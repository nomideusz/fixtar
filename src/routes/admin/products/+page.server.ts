import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// TODO: Fetch products from BaseLinker API / Turso DB (PocketBase REST API removed)
	const searchQuery = url.searchParams.get('search') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const categoryFilter = url.searchParams.get('category') || '';
	const currentPage = parseInt(url.searchParams.get('page') || '1');

	console.warn('[TODO] admin/products: implement product listing from Turso DB or BaseLinker API');

	return {
		products: [],
		categories: [],
		stats: { active: 0, draft: 0, inactive: 0 },
		totalItems: 0,
		totalPages: 0,
		currentPage,
		searchQuery,
		statusFilter,
		categoryFilter
	};
};
