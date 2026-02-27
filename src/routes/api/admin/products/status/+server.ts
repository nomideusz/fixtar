import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		if (!locals.isAuthenticated || !locals.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// TODO: Verify admin role once Better Auth roles are configured

		const { productIds, status } = await request.json();

		if (!['active', 'draft', 'inactive'].includes(status)) {
			return json({ error: 'Invalid status' }, { status: 400 });
		}

		if (!Array.isArray(productIds) || productIds.length === 0) {
			return json({ error: 'No products selected' }, { status: 400 });
		}

		// TODO: Update product status rows in Turso DB (previously used PocketBase collection)
		console.warn('[TODO] api/admin/products/status: update products in DB', productIds, '->', status);

		return json({
			success: true,
			message: 'Product status update is a stub. TODO: implement against Turso DB.',
			updated: [],
			errors: []
		});
	} catch (err: any) {
		console.error('Error updating product status:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
