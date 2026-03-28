import { json, type RequestHandler } from '@sveltejs/kit';
import { getProductById, toStoreProduct } from '$lib/server/products';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { ids } = await request.json();

		if (!Array.isArray(ids) || ids.length === 0) {
			return json({ products: [] });
		}

		// Limit to 50 products max
		const safeIds = ids.slice(0, 50);
		const products = await Promise.all(
			safeIds.map(async (id: string) => {
				const dbProduct = await getProductById(id);
				return dbProduct ? toStoreProduct(dbProduct) : null;
			})
		);

		return json({ products: products.filter(Boolean) });
	} catch {
		return json({ products: [] }, { status: 400 });
	}
};
