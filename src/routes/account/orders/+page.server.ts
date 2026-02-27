import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		return { orders: [], totalOrders: 0, totalPages: 1, page: 1 };
	}

	// TODO: Fetch orders from BaseLinker API
	return {
		orders: [],
		totalOrders: 0,
		totalPages: 1,
		page: 1
	};
}) satisfies PageServerLoad;
