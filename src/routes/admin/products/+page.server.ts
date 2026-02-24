import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const POCKETBASE_URL = env.POCKETBASE_URL || 'https://k.xeon.pl';

export const load: PageServerLoad = async ({ url, fetch }) => {
	try {
		// Get URL parameters
		const searchQuery = url.searchParams.get('search') || '';
		const statusFilter = url.searchParams.get('status') || '';
		const categoryFilter = url.searchParams.get('category') || '';
		const sortBy = url.searchParams.get('sort') || 'created';
		const sortOrder = url.searchParams.get('order') || 'desc';
		const currentPage = parseInt(url.searchParams.get('page') || '1');
		const itemsPerPage = 20;

		// Build query parameters
		const queryParams = [
			`page=${currentPage}`,
			`perPage=${itemsPerPage}`
		];
		
		// Build filter array
		const filters: string[] = [];
		
		// Add search filter
		if (searchQuery.trim()) {
			const searchTerm = searchQuery.trim();
			filters.push(`(name ~ "${searchTerm}" || description ~ "${searchTerm}" || shortDescription ~ "${searchTerm}" || sku ~ "${searchTerm}")`);
		}
		
		// Add status filter
		if (statusFilter && ['active', 'draft', 'inactive'].includes(statusFilter)) {
			filters.push(`status = "${statusFilter}"`);
		}
		
		// Add category filter
		if (categoryFilter.trim()) {
			filters.push(`categories ~ "${categoryFilter}"`);
		}
		
		// Combine filters
		if (filters.length > 0) {
			queryParams.push(`filter=${encodeURIComponent(filters.join(' && '))}`);
		}
		
		// Add sorting
		const sortPrefix = sortOrder === 'desc' ? '-' : '';
		queryParams.push(`sort=${sortPrefix}${sortBy}`);
		
		// Add expand to get category details
		queryParams.push('expand=categories');
		
		const queryString = queryParams.join('&');

		// Fetch products
		const productsUrl = `${POCKETBASE_URL}/api/collections/products/records?${queryString}`;
		const productsResponse = await fetch(productsUrl);
		
		if (!productsResponse.ok) {
			throw new Error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
		}
		
		const productsResult = await productsResponse.json();

		// Fetch categories for filter dropdown
		const categoriesUrl = `${POCKETBASE_URL}/api/collections/categories/records?sort=name&perPage=100`;
		const categoriesResponse = await fetch(categoriesUrl);
		const categoriesResult = categoriesResponse.ok ? await categoriesResponse.json() : { items: [] };

		// Get status counts for dashboard
		const statusCounts = await Promise.all([
			fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent('status = "active"')}`),
			fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent('status = "draft"')}`),
			fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent('status = "inactive"')}`)
		]).then(async responses => {
			const results = await Promise.all(responses.map(r => r.ok ? r.json() : { totalItems: 0 }));
			return {
				active: results[0].totalItems || 0,
				draft: results[1].totalItems || 0,
				inactive: results[2].totalItems || 0
			};
		});

		// Process products to add proper image URLs
		const processedProducts = productsResult.items.map((product: any) => ({
			...product,
			mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
			images: product.gallery ? product.gallery.map((img: string) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
		}));

		return {
			products: processedProducts,
			categories: categoriesResult.items,
			statusCounts,
			pagination: {
				currentPage,
				totalPages: productsResult.totalPages,
				totalItems: productsResult.totalItems,
				itemsPerPage
			},
			filters: {
				search: searchQuery,
				status: statusFilter,
				category: categoryFilter,
				sort: sortBy,
				order: sortOrder
			}
		};
	} catch (error) {
		console.error('Error loading admin products:', error);
		
		return {
			products: [],
			categories: [],
			statusCounts: { active: 0, draft: 0, inactive: 0 },
			pagination: {
				currentPage: 1,
				totalPages: 1,
				totalItems: 0,
				itemsPerPage: 20
			},
			filters: {
				search: '',
				status: '',
				category: '',
				sort: 'created',
				order: 'desc'
			},
			error: error instanceof Error ? error.message : 'Failed to load products'
		};
	}
}; 