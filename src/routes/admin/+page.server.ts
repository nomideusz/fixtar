import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const POCKETBASE_URL = env.POCKETBASE_URL || 'https://k.xeon.pl';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch real statistics from PocketBase
		
		// Get total products count
		const productsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1`);
		const productsResult = productsResponse.ok ? await productsResponse.json() : { totalItems: 0 };
		
		// Get active products count
		const activeProductsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent('status = "active"')}`);
		const activeProductsResult = activeProductsResponse.ok ? await activeProductsResponse.json() : { totalItems: 0 };
		
		// Get draft products count  
		const draftProductsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent('status = "draft"')}`);
		const draftProductsResult = draftProductsResponse.ok ? await draftProductsResponse.json() : { totalItems: 0 };
		
		// Get categories count
		const categoriesResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?page=1&perPage=1`);
		const categoriesResult = categoriesResponse.ok ? await categoriesResponse.json() : { totalItems: 0 };
		
		// Get orders count (if orders collection exists)
		const ordersResponse = await fetch(`${POCKETBASE_URL}/api/collections/orders/records?page=1&perPage=1`);
		const ordersResult = ordersResponse.ok ? await ordersResponse.json() : { totalItems: 0 };
		
		// Calculate total revenue (mock for now - would need to sum order totals)
		const totalRevenue = ordersResult.totalItems * 75.50; // Mock average order value
		
		// Recent products (last 5 synced)
		const recentProductsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=5&sort=-created&expand=categories`);
		const recentProducts = recentProductsResponse.ok ? await recentProductsResponse.json() : { items: [] };
		
		return {
			stats: {
				totalProducts: productsResult.totalItems,
				activeProducts: activeProductsResult.totalItems,
				draftProducts: draftProductsResult.totalItems,
				totalCategories: categoriesResult.totalItems,
				totalOrders: ordersResult.totalItems,
				totalRevenue: totalRevenue
			},
			recentProducts: recentProducts.items.map((product: any) => ({
				id: product.id,
				name: product.name,
				sku: product.sku,
				price: product.price,
				status: product.status,
				created: product.created,
				categories: product.expand?.categories || []
			}))
		};
	} catch (error) {
		console.error('Failed to load admin dashboard data:', error);
		
		// Return fallback data
		return {
			stats: {
				totalProducts: 0,
				activeProducts: 0,
				draftProducts: 0,
				totalCategories: 0,
				totalOrders: 0,
				totalRevenue: 0
			},
			recentProducts: [],
			error: error instanceof Error ? error.message : 'Failed to load dashboard data'
		};
	}
}; 
