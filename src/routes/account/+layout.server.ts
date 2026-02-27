import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	if (!locals.isAuthenticated || !locals.user) {
		throw redirect(303, '/auth/login?redirect=' + encodeURIComponent(url.pathname));
	}

	return {
		user: {
			...locals.user,
			isAuthenticated: true
		}
	};
}) satisfies LayoutServerLoad;
