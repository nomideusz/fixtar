import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { CartItem } from '$lib/types';

/**
 * GET cart data for the authenticated user
 * TODO: Integrate with persistent cart storage (Turso DB or external service)
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ success: false, message: 'Authentication required', items: [] }, { status: 401 });
	}

	// TODO: Fetch cart items from Turso DB keyed by locals.user.id
	return json({ success: true, items: [], last_sync: null });
};

/**
 * POST to update the cart for the authenticated user
 * TODO: Integrate with persistent cart storage (Turso DB or external service)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ success: false, message: 'Authentication required' }, { status: 401 });
	}

	try {
		const { items } = await request.json() as { items: CartItem[] };

		if (!Array.isArray(items)) {
			return json({ success: false, message: 'Invalid cart data format' }, { status: 400 });
		}

		// TODO: Upsert cart rows in Turso DB for user locals.user.id
		console.warn('[TODO] api/cart/sync POST: persist cart to DB for user', locals.user.id);

		return json({ success: true, message: 'Cart synced (stub)', last_sync: new Date().toISOString() });
	} catch (err) {
		console.error('Error syncing cart:', err);
		return json({ success: false, message: 'Error syncing cart' }, { status: 500 });
	}
};
