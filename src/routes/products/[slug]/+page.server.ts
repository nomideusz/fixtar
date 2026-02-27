import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product } from '$lib/stores/products.svelte';
import { mockProducts } from '$lib/data/mockData';

function toProduct(p: (typeof mockProducts)[number]): Product {
	return {
		...p,
		slug: p.id,
		mainImage: p.image,
		images: [p.image],
		status: 'active',
		inventory: { trackQuantity: true, quantity: 10 }
	} as unknown as Product;
}

export const load = (async ({ params }) => {
	// TODO: Replace with BaseLinker API integration once PocketBase is fully removed.
	const mock = mockProducts.find((p) => p.id === params.slug);

	if (!mock) {
		throw error(404, 'Product not found.');
	}

	const product = toProduct(mock);

	// Pick up to 4 related products from the same category
	const relatedProducts = mockProducts
		.filter((p) => p.category === mock.category && p.id !== mock.id)
		.slice(0, 4)
		.map(toProduct);

	return { product, relatedProducts };
}) satisfies PageServerLoad;
