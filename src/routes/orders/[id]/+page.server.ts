import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Please log in to view orders');
	}

	// TODO: Fetch order from BaseLinker API using params.id
	console.log('[order-id] TODO: fetch order:', params.id);
	throw error(404, 'Order data source not yet configured. Implement with BaseLinker API.');
}) satisfies PageServerLoad;
