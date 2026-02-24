import type { PageServerLoad } from './$types';
import type { Product, Category } from '$lib/stores/products.svelte';
import { env } from '$env/dynamic/private';
import { serverCache } from '$lib/utils/cache';
import { dedupedFetch } from '$lib/utils/performance';

const POCKETBASE_URL = env.POCKETBASE_URL || 'https://k.xeon.pl';

// Cache keys for search
const SEARCH_CACHE_KEYS = {
	CATEGORIES: 'search_categories',
	RESULTS: (query: string, category: string, minPrice: number, maxPrice: number, sortBy: string) => 
		`search_${Buffer.from(`${query}|${category}|${minPrice}|${maxPrice}|${sortBy}`).toString('base64')}`
};

// Cache TTL
const SEARCH_CACHE_TTL = {
	CATEGORIES: 5 * 60 * 1000, // 5 minutes
	RESULTS: 2 * 60 * 1000     // 2 minutes (shorter for search results)
};

async function fetchCategoriesForSearch(fetch: typeof global.fetch): Promise<Category[]> {
	return dedupedFetch(SEARCH_CACHE_KEYS.CATEGORIES, async () => {
		// Check cache first
		const cached = serverCache.get<Category[]>(SEARCH_CACHE_KEYS.CATEGORIES);
		if (cached) {
			return cached;
		}

		try {
			const response = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?sort=name&perPage=100`);
			if (!response.ok) {
				throw new Error(`Categories fetch failed: ${response.status}`);
			}
			
			const result = await response.json();
			const categories = result.items as unknown as Category[];
			
			// Cache the result
			serverCache.set(SEARCH_CACHE_KEYS.CATEGORIES, categories, SEARCH_CACHE_TTL.CATEGORIES);
			
			return categories;
		} catch (error) {
			console.error('Error fetching categories for search:', error);
			return [];
		}
	});
}

async function performSearch(
	fetch: typeof global.fetch,
	query: string,
	category: string,
	minPrice: number,
	maxPrice: number,
	sortBy: string
): Promise<{ products: Product[]; totalResults: number; error?: string }> {
	
	const cacheKey = SEARCH_CACHE_KEYS.RESULTS(query, category, minPrice, maxPrice, sortBy);
	
	return dedupedFetch(cacheKey, async () => {
		// Check cache first
		const cached = serverCache.get<any>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			// Build search filter
			const filters: string[] = ['status="active"'];

			// Add text search filter
			if (query.trim()) {
				const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
				const searchFilters = searchTerms.map(term => 
					`(name ~ "${term}" || description ~ "${term}" || shortDescription ~ "${term}" || sku ~ "${term}")`
				);
				filters.push(`(${searchFilters.join(' && ')})`);
			}

			// Add category filter
			if (category) {
				filters.push(`categories ~ "${category}"`);
			}

			// Add price range filter
			if (minPrice > 0) {
				filters.push(`price >= ${minPrice}`);
			}
			if (maxPrice < 10000) {
				filters.push(`price <= ${maxPrice}`);
			}

			// Combine all filters
			const filterString = filters.join(' && ');

			// Build sort parameter
			let sortParam = '';
			switch (sortBy) {
				case 'price-low':
					sortParam = 'price';
					break;
				case 'price-high':
					sortParam = '-price';
					break;
				case 'name':
				default:
					sortParam = 'name';
					break;
			}

			// Build query parameters
			const queryParams = new URLSearchParams({
				filter: filterString,
				sort: sortParam,
				perPage: '50', // Reasonable limit for search results
				expand: 'categories'
			});

			const url = `${POCKETBASE_URL}/api/collections/products/records?${queryParams}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Search failed: ${response.status} ${response.statusText}`);
			}

			const result = await response.json();

			// Process products to add proper image URLs
			const processedProducts = result.items.map((product: any) => ({
				...product,
				mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
				images: product.gallery ? product.gallery.map((img: string) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
			})) as Product[];

			const searchResult = {
				products: processedProducts,
				totalResults: result.totalItems || 0
			};

			// Cache the result
			serverCache.set(cacheKey, searchResult, SEARCH_CACHE_TTL.RESULTS);
			
			return searchResult;
		} catch (error) {
			console.error('Search error:', error);
			return {
				products: [],
				totalResults: 0,
				error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			};
		}
	});
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	// Get search parameters
	const query = url.searchParams.get('q') || '';
	const category = url.searchParams.get('category') || '';
	const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
	const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '10000');
	const sortBy = url.searchParams.get('sort') || 'name';

	try {
		// Fetch categories and perform search in parallel
		const [categories, searchResults] = await Promise.all([
			fetchCategoriesForSearch(fetch),
			performSearch(fetch, query, category, minPrice, maxPrice, sortBy)
		]);

		return {
			query,
			category,
			minPrice,
			maxPrice,
			sortBy,
			categories,
			products: searchResults.products,
			totalResults: searchResults.totalResults,
			error: searchResults.error,
			searchQuery: query // For consistency with the frontend
		};
	} catch (error) {
		console.error('Error in search page load:', error);
		
		return {
			query: '',
			category: '',
			minPrice: 0,
			maxPrice: 10000,
			sortBy: 'name',
			categories: [] as Category[],
			products: [] as Product[],
			totalResults: 0,
			error: `Failed to load search page: ${error instanceof Error ? error.message : 'Unknown error'}`,
			searchQuery: query
		};
	}
}; 
