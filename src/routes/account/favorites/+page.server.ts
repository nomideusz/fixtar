import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		return { favorites: [], user: null };
	}

	// TODO: Fetch favorites from database/BaseLinker
	return {
		favorites: [],
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions = {
	removeFavorite: async () => {
		// TODO: Implement via BaseLinker/database
		return { success: false, error: 'Not implemented yet' };
	},
	addFavorite: async () => {
		// TODO: Implement via BaseLinker/database
		return { success: false, error: 'Not implemented yet' };
	}
};
