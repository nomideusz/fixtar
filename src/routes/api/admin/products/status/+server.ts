import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getClient } from '$lib/server/products';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { productIds, status } = await request.json();

		if (!['active', 'draft', 'inactive'].includes(status)) {
			return json({ error: 'Invalid status' }, { status: 400 });
		}

		if (!Array.isArray(productIds) || productIds.length === 0) {
			return json({ error: 'No products selected' }, { status: 400 });
		}

		const db = getClient();
		const inStock = status === 'active' ? 1 : 0;

		const placeholders = productIds.map(() => '?').join(',');
		await db.execute({
			sql: `UPDATE products SET in_stock = ? WHERE id IN (${placeholders})`,
			args: [inStock, ...productIds]
		});

		return json({
			success: true,
			updated: productIds,
			errors: []
		});
	} catch (err: any) {
		console.error('Error updating product status:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
