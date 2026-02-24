import type { PageServerLoad } from './$types';
import type { Product } from '$lib/stores/products.svelte';
import { env } from '$env/dynamic/private';
import { isDemoMode } from '$lib/server/pocketbase';
import { mockProducts } from '$lib/data/mockData';

const POCKETBASE_URL = env.POCKETBASE_URL || 'https://k.xeon.pl';

export const load: PageServerLoad = async ({ fetch }) => {
	// Demo mode - return mock data without hitting PocketBase
	if (isDemoMode()) {
		const demoProducts = mockProducts.slice(0, 8).map((p) => ({
			...p,
			id: p.id,
			name: p.name,
			slug: p.id,
			price: p.price,
			mainImage: p.image,
			images: [p.image],
			description: p.description || '',
			status: 'active',
			inventory: { trackQuantity: true, quantity: 10 }
		})) as unknown as Product[];

		return {
			featuredProducts: demoProducts,
			totalProducts: mockProducts.length
		};
	}

	try {
		// Fetch featured products (first 8 active products)
		const productsUrl = `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=8&filter=${encodeURIComponent('status = "active"')}`;
		const productsResponse = await fetch(productsUrl);
		
		if (!productsResponse.ok) {
			console.error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
			throw new Error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
		}
		
		const productsResult = await productsResponse.json();

		// Process products to add proper image URLs
		const processedProducts = productsResult.items.map((product: any) => ({
			...product,
			mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
			images: product.images ? product.images.map((img: string) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
		})) as Product[];

		return {
			featuredProducts: processedProducts,
			totalProducts: productsResult.totalItems
		};
	} catch (error) {
		console.error('Error loading homepage data:', error);
		
		// Return fallback data on error
		return {
			featuredProducts: [] as Product[],
			totalProducts: 0,
			error: `Failed to load homepage data: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
}; 