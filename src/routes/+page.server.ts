import type { PageServerLoad } from './$types';
import type { Product } from '$lib/stores/products.svelte';
import { mockProducts } from '$lib/data/mockData';

export const load: PageServerLoad = async () => {
	// TODO: Replace with BaseLinker API integration once PocketBase is fully removed.
	// For now, always return mock data.
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
};
