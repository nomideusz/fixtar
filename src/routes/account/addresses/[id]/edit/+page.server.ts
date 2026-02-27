import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}
	// TODO: Fetch address by params.id from database
	return { user: locals.user, address: null, id: params.id };
};

export const actions: Actions = {
	updateAddress: async () => {
		// TODO: Implement address update
		return { success: false, error: 'Not implemented yet' };
	},
	deleteAddress: async () => {
		return { success: false, error: 'Not implemented yet' };
	}
};
