import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { CartItem } from '$lib/types';

/**
 * POST to merge a guest cart with the authenticated user's server cart
 * TODO: Integrate with persistent cart storage (Turso DB or external service)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ success: false, message: 'Authentication required' }, { status: 401 });
	}

	try {
		const { guestItems } = (await request.json()) as { guestItems: CartItem[] };

		if (!Array.isArray(guestItems)) {
			return json({ success: false, message: 'Invalid cart data format' }, { status: 400 });
		}

		// TODO: Load server cart, merge with guestItems, upsert to Turso DB
		console.warn('[TODO] api/cart/merge POST: merge guest cart for user', locals.user.id);

		return json({ success: true, items: guestItems, message: 'Cart merged (stub)' });
	} catch (err) {
		console.error('Error merging cart:', err);
		return json({ success: false, message: 'Error merging cart' }, { status: 500 });
	}
};
