import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProductBySlug, getRelatedProducts, toStoreProduct } from '$lib/server/products';

export const load = (async ({ params }) => {
	const dbProduct = await getProductBySlug(params.slug);

	if (!dbProduct) {
		throw error(404, 'Product not found.');
	}

	const product = toStoreProduct(dbProduct);

	const dbRelated = await getRelatedProducts(dbProduct.category_slug, dbProduct.id, 4);
	const relatedProducts = dbRelated.map(toStoreProduct);

	return { product, relatedProducts };
}) satisfies PageServerLoad;
