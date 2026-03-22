import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProductBySlug, getRelatedProducts, toStoreProduct } from '$lib/server/products';

export const load = (async ({ params }) => {
	try {
		const dbProduct = await getProductBySlug(params.slug);

		if (!dbProduct) {
			throw error(404, 'Product not found.');
		}

		const product = toStoreProduct(dbProduct);

		const dbRelated = await getRelatedProducts(dbProduct.category_slug, dbProduct.id, 4);
		const relatedProducts = dbRelated.map(toStoreProduct);

		return { product, relatedProducts };
	} catch (err) {
		// If it's already a 404 error, re-throw it
		if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
			throw err;
		}
		
		console.error('Failed to load product:', err);
		throw error(500, 'Failed to load product details. Please try again later.');
	}
}) satisfies PageServerLoad;
