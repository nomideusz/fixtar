import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { getClient } from '$lib/server/products';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!dev && !locals.user) {
		return json({ success: false, message: 'Unauthorized' }, { status: 403 });
	}

	try {
		const requestData = await request.json();
		if (requestData.confirm !== true) {
			return json(
				{ success: false, message: 'Send { "confirm": true } to proceed' },
				{ status: 400 }
			);
		}

		const db = getClient();

		// Delete all products and related search data
		await db.execute('DELETE FROM product_trigrams');
		await db.execute('DELETE FROM products');
		await db.execute("INSERT INTO products_fts(products_fts) VALUES('rebuild')");

		return json({
			success: true,
			message: 'All product data cleared. Re-sync from BaseLinker to repopulate.'
		});
	} catch (err: any) {
		console.error('[CLEAN] Error:', err);
		return json({ success: false, message: err.message }, { status: 500 });
	}
};
