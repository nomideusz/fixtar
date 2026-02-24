import type { PageServerLoad } from './$types';
import type { Category } from '$lib/stores/products.svelte';
import { env } from '$env/dynamic/private';

const POCKETBASE_URL = env.POCKETBASE_URL || 'https://k.xeon.pl';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch categories from database using direct API call
		const categoriesUrl = `${POCKETBASE_URL}/api/collections/categories/records?page=1&perPage=50`;
		const categoriesResponse = await fetch(categoriesUrl);
		
		if (!categoriesResponse.ok) {
			throw new Error(`Categories API error: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
		}
		
		const categoriesResult = await categoriesResponse.json();
		
		// Get product counts for each category
		const categoriesWithCounts = await Promise.all(
			categoriesResult.items.map(async (category: any) => {
				try {
					// Count products in this specific category (only active products)
					const productCountUrl = `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent(`categories = "${category.id}" && status = "active"`)}`;
					const productCountResponse = await fetch(productCountUrl);
					
					if (!productCountResponse.ok) {
						console.error(`Failed to count products for category ${category.name}`);
						return {
							id: category.id,
							name: category.name,
							slug: category.slug,
							description: category.description,
							image: category.image ? `${POCKETBASE_URL}/api/files/categories/${category.id}/${category.image}` : null,
							featured: category.featured,
							displayOrder: category.displayOrder,
							productCount: 0,
							createdAt: category.created,
							updatedAt: category.updated
						} as Category & { productCount: number };
					}
					
					const productCountResult = await productCountResponse.json();
					
					return {
						id: category.id,
						name: category.name,
						slug: category.slug,
						description: category.description,
						image: category.image ? `${POCKETBASE_URL}/api/files/categories/${category.id}/${category.image}` : null,
						featured: category.featured,
						displayOrder: category.displayOrder,
						productCount: productCountResult.totalItems || 0,
						createdAt: category.created,
						updatedAt: category.updated
					} as Category & { productCount: number };
				} catch (error) {
					console.error(`Failed to count products for category ${category.name}:`, error);
					return {
						id: category.id,
						name: category.name,
						slug: category.slug,
						description: category.description,
						image: category.image ? `${POCKETBASE_URL}/api/files/categories/${category.id}/${category.image}` : null,
						featured: category.featured,
						displayOrder: category.displayOrder,
						productCount: 0,
						createdAt: category.created,
						updatedAt: category.updated
					} as Category & { productCount: number };
				}
			})
		);

		return {
			categories: categoriesWithCounts
		};
	} catch (error) {
		console.error('Failed to fetch categories:', error);
		
		// Return fallback data on error
		return {
			categories: [],
			error: `Failed to load categories: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
}; 
