import type { PageServerLoad } from './$types';

export const load = (async () => {
	// TODO: Fetch products and categories from BaseLinker API
	return {
		products: [],
		categories: [],
		parentCategories: [],
		childCategories: [],
		total: 0,
		totalPages: 1,
		page: 1,
		perPage: 20
	};
}) satisfies PageServerLoad;
