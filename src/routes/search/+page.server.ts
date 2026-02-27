import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	// TODO: Implement search using BaseLinker API
	return {
		query,
		products: [],
		categories: [],
		total: 0
	};
}) satisfies PageServerLoad;
