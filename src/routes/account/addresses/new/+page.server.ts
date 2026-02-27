import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}
	return { user: locals.user };
};

export const actions: Actions = {
	addAddress: async () => {
		// TODO: Implement address creation
		return { success: false, error: 'Not implemented yet' };
	}
};
