import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Fetch real stats from BaseLinker API
	return {
		stats: {
			totalProducts: 0,
			activeProducts: 0,
			draftProducts: 0,
			totalCategories: 0,
			totalOrders: 0,
			totalRevenue: 0
		},
		recentProducts: []
	};
};
