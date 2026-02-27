import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const actions: Actions = {
	logout: async ({ request }) => {
		await auth.api.signOut({ headers: request.headers }).catch(() => {});
		throw redirect(302, '/auth/login');
	}
};

export const load = (async ({ locals }) => {
	if (!locals.user) {
		return { orders: [], cart: null, favorites: [] };
	}

	// TODO: Replace with BaseLinker API calls when ready
	return {
		orders: [],
		cart: null,
		favorites: []
	};
}) satisfies PageServerLoad;
