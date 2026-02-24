import type { PageServerLoad } from './$types';
import type { Product, Category } from '$lib/stores/products.svelte';
import { env } from '$env/dynamic/private';
import { serverCache } from '$lib/utils/cache';
import { dedupedFetch, parallelLimit } from '$lib/utils/performance';
import { isDemoMode } from '$lib/server/pocketbase';
import { mockProducts, mockCategories } from '$lib/data/mockData';

const POCKETBASE_URL = env.POCKETBASE_URL || 'https://k.xeon.pl';

// Extend Category type to include product count
interface CategoryWithCount extends Category {
	productCount: number;
}

interface CachedCategoryData {
	categories: CategoryWithCount[];
	subcategories: CategoryWithCount[];
	allSubcategories: CategoryWithCount[];
}

// Cache keys
const CACHE_KEYS = {
	CATEGORIES: 'categories_with_counts',
	PRODUCTS: (page: number, filters: string, sort: string) => 
		`products_${page}_${Buffer.from(filters + sort).toString('base64')}`
};

// Cache TTL - 5 minutes for categories (they change less frequently), 1 minute for products
const CACHE_TTL = {
	CATEGORIES: 5 * 60 * 1000, // 5 minutes
	PRODUCTS: 1 * 60 * 1000    // 1 minute
};

async function fetchCategoriesWithCounts(fetch: typeof global.fetch): Promise<CachedCategoryData> {
	return dedupedFetch(CACHE_KEYS.CATEGORIES, async () => {
		// Check cache first
		const cached = serverCache.get<CachedCategoryData>(CACHE_KEYS.CATEGORIES);
		if (cached) {
			return cached;
		}

		try {
			// Fetch all categories and subcategories in parallel
			const [mainCategoriesResponse, allSubcategoriesResponse] = await Promise.all([
				fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=parent=""&sort=displayOrder,name&perPage=50`),
				fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=parent!=""&sort=displayOrder,name&perPage=200`)
			]);

			if (!mainCategoriesResponse.ok || !allSubcategoriesResponse.ok) {
				throw new Error('Failed to fetch categories');
			}

			const [categoriesResult, subcategoriesResult] = await Promise.all([
				mainCategoriesResponse.json(),
				allSubcategoriesResponse.json()
			]);

			// Build a map of category ID to subcategory IDs for efficient lookup
			const categoryToSubcategoriesMap = new Map<string, string[]>();
			subcategoriesResult.items.forEach((sub: any) => {
				if (!categoryToSubcategoriesMap.has(sub.parent)) {
					categoryToSubcategoriesMap.set(sub.parent, []);
				}
				categoryToSubcategoriesMap.get(sub.parent)!.push(sub.id);
			});

			// Get product counts for all categories in batch (with concurrency limit)
			const allCategoryIds = [
				...categoriesResult.items.map((cat: any) => cat.id),
				...subcategoriesResult.items.map((sub: any) => sub.id)
			];

			const categoryCountResults = await parallelLimit(
				allCategoryIds,
				async (categoryId: string) => {
					const countFilter = `categories = "${categoryId}" && status = "active"`;
					const response = await fetch(
						`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent(countFilter)}`
					);
					
					if (response.ok) {
						const result = await response.json();
						return { categoryId, count: result.totalItems || 0 };
					}
					return { categoryId, count: 0 };
				},
				10 // Limit concurrent requests to 10
			);

			const categoryCountsMap = new Map(
				categoryCountResults.map(({ categoryId, count }) => [categoryId, count])
			);

			// Process main categories with counts (including subcategory products)
			const categoriesWithCounts: CategoryWithCount[] = categoriesResult.items.map((category: any) => {
				const subcategoryIds = categoryToSubcategoriesMap.get(category.id) || [];
				const mainCategoryCount = categoryCountsMap.get(category.id) || 0;
				const subcategoriesCount = subcategoryIds.reduce(
					(total, subId) => total + (categoryCountsMap.get(subId) || 0), 
					0
				);
				
				return {
					...category,
					productCount: mainCategoryCount + subcategoriesCount
				};
			}).filter((cat: CategoryWithCount) => cat.productCount > 0);

			// Process subcategories with individual counts
			const subcategoriesWithCounts: CategoryWithCount[] = subcategoriesResult.items.map((subcategory: any) => ({
				...subcategory,
				productCount: categoryCountsMap.get(subcategory.id) || 0
			})).filter((sub: CategoryWithCount) => sub.productCount > 0);

			const result: CachedCategoryData = {
				categories: categoriesWithCounts,
				subcategories: subcategoriesWithCounts,
				allSubcategories: subcategoriesWithCounts
			};

			// Cache the result
			serverCache.set(CACHE_KEYS.CATEGORIES, result, CACHE_TTL.CATEGORIES);
			
			return result;
		} catch (error) {
			console.error('Error fetching categories with counts:', error);
			return {
				categories: [],
				subcategories: [],
				allSubcategories: []
			};
		}
	});
}

async function fetchProducts(
	fetch: typeof global.fetch,
	searchQuery: string,
	selectedCategory: string,
	sortBy: string,
	currentPage: number,
	itemsPerPage: number
): Promise<{ products: Product[]; totalPages: number; totalItems: number; error?: string }> {
	
	// Create cache key based on parameters
	const filters = `${searchQuery}|${selectedCategory}`;
	const cacheKey = CACHE_KEYS.PRODUCTS(currentPage, filters, sortBy);
	
	return dedupedFetch(cacheKey, async () => {
		// Check cache first
		const cached = serverCache.get<any>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			// Build query parameters
			const queryParams = [
				`page=${currentPage}`,
				`perPage=${itemsPerPage}`
			];
			
			// Build filter array for PocketBase
			const filterList: string[] = [];
			
			// Add search filter if provided
			if (searchQuery.trim()) {
				const searchTerm = searchQuery.trim();
				filterList.push(`(name ~ "${searchTerm}" || description ~ "${searchTerm}" || shortDescription ~ "${searchTerm}" || sku ~ "${searchTerm}")`);
			}
			
			// Add category filter if provided
			if (selectedCategory.trim()) {
				// Get category by slug
				const categoryResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=slug="${selectedCategory}"`);
				if (categoryResponse.ok) {
					const categoryResult = await categoryResponse.json();
					if (categoryResult.items.length > 0) {
						const category = categoryResult.items[0];
						const categoryId = category.id;
						
						if (category.parent) {
							// Subcategory - filter by this specific category
							filterList.push(`categories = "${categoryId}"`);
						} else {
							// Main category - include subcategories
							const subcategoriesResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=parent="${categoryId}"&perPage=200`);
							if (subcategoriesResponse.ok) {
								const subcategoriesResult = await subcategoriesResponse.json();
								const subcategoryIds = subcategoriesResult.items.map((sub: any) => sub.id);
								
								const categoryFilters = [`categories = "${categoryId}"`];
								subcategoryIds.forEach((subId: string) => {
									categoryFilters.push(`categories = "${subId}"`);
								});
								
								filterList.push(`(${categoryFilters.join(' || ')})`);
							} else {
								filterList.push(`categories = "${categoryId}"`);
							}
						}
					}
				}
			}
			
			// Only show active products
			filterList.push(`status = "active"`);
			
			// Combine filters
			if (filterList.length > 0) {
				queryParams.push(`filter=${encodeURIComponent(filterList.join(' && '))}`);
			}
			
			// Add sorting
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
			queryParams.push(`sort=${sortParam}`);
			queryParams.push('expand=categories');
			
			const queryString = queryParams.join('&');
			const productsUrl = `${POCKETBASE_URL}/api/collections/products/records?${queryString}`;
			
			const productsResponse = await fetch(productsUrl);
			
			if (!productsResponse.ok) {
				throw new Error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
			}
			
			const productsResult = await productsResponse.json();

			// Process products to add proper image URLs
			const processedProducts = productsResult.items.map((product: any) => ({
				...product,
				mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
				images: product.gallery ? product.gallery.map((img: string) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
			})) as Product[];

			const result = {
				products: processedProducts,
				totalPages: productsResult.totalPages,
				totalItems: productsResult.totalItems
			};

			// Cache the result
			serverCache.set(cacheKey, result, CACHE_TTL.PRODUCTS);
			
			return result;
		} catch (error) {
			console.error('Error loading products:', error);
			return {
				products: [],
				totalPages: 1,
				totalItems: 0,
				error: `Failed to load products: ${error instanceof Error ? error.message : 'Unknown error'}`
			};
		}
	});
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	// Get URL parameters
	const searchQuery = url.searchParams.get('search') || '';
	const selectedCategory = url.searchParams.get('category') || '';
	const sortBy = url.searchParams.get('sort') || 'name';
	const currentPage = parseInt(url.searchParams.get('page') || '1');
	const itemsPerPage = 12;

	// Demo mode - serve mock data without PocketBase
	if (isDemoMode()) {
		let filteredProducts = mockProducts.map((p) => ({
			id: p.id,
			name: p.name,
			slug: p.id,
			price: p.price,
			mainImage: p.image,
			images: [p.image],
			description: p.description || '',
			status: 'active' as const,
			inventory: { trackQuantity: true, quantity: 10 },
			categories: [p.category]
		})) as unknown as Product[];

		// Apply search filter
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			filteredProducts = filteredProducts.filter(
				(p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
			);
		}

		// Apply category filter
		if (selectedCategory.trim()) {
			filteredProducts = filteredProducts.filter((p: any) =>
				p.categories?.includes(selectedCategory)
			);
		}

		// Apply sorting
		if (sortBy === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
		else if (sortBy === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
		else filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

		const demoCategories = mockCategories.map((c) => ({
			id: c.id,
			name: c.name,
			slug: c.id,
			image: c.image,
			productCount: c.count
		})) as unknown as Category[];

		const totalItems = filteredProducts.length;
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		const paged = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

		return {
			products: paged,
			categories: demoCategories,
			subcategories: [] as Category[],
			allSubcategories: [] as Category[],
			totalPages,
			totalItems,
			currentPage,
			searchQuery,
			selectedCategory,
			sortBy,
			itemsPerPage
		};
	}

	try {
		// Fetch categories and products in parallel
		const [categoryData, productData] = await Promise.all([
			fetchCategoriesWithCounts(fetch),
			fetchProducts(fetch, searchQuery, selectedCategory, sortBy, currentPage, itemsPerPage)
		]);

		// Get selected category subcategories (from cached data)
		let selectedCategorySubcategories: Category[] = [];
		if (selectedCategory.trim()) {
			// Try to find category in cached data first
			const allCategories = [...categoryData.categories, ...categoryData.subcategories];
			const foundCategory = allCategories.find(cat => cat.slug === selectedCategory);
			
			if (foundCategory) {
				selectedCategorySubcategories = categoryData.subcategories.filter(
					sub => sub.parent === foundCategory.id
				) as unknown as Category[];
			} else {
				// Fallback to API call if not found in cache
				const categoryResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=slug="${selectedCategory}"`);
				if (categoryResponse.ok) {
					const categoryResult = await categoryResponse.json();
					if (categoryResult.items.length > 0) {
						const categoryId = categoryResult.items[0].id;
						selectedCategorySubcategories = categoryData.subcategories.filter(
							sub => sub.parent === categoryId
						) as unknown as Category[];
					}
				}
			}
		}

		return {
			products: productData.products,
			categories: categoryData.categories as unknown as Category[],
			subcategories: selectedCategorySubcategories,
			allSubcategories: categoryData.allSubcategories as unknown as Category[],
			totalPages: productData.totalPages,
			totalItems: productData.totalItems,
			currentPage,
			searchQuery,
			selectedCategory,
			sortBy,
			itemsPerPage,
			error: productData.error
		};
	} catch (error) {
		console.error('Error in page load:', error);
		
		return {
			products: [] as Product[],
			categories: [] as Category[],
			subcategories: [] as Category[],
			allSubcategories: [] as Category[],
			totalPages: 1,
			totalItems: 0,
			currentPage: 1,
			searchQuery: '',
			selectedCategory: '',
			sortBy: 'name',
			itemsPerPage: 12,
			error: `Failed to load page: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
}; 
