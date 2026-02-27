import type { PageServerLoad } from './$types';

export const load = (async () => {
	// TODO: Fetch categories from BaseLinker API
	return {
		categories: [],
		featuredCategories: []
	};
}) satisfies PageServerLoad;
