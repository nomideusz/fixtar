import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user || !(locals.user as any).isAdmin) {
		throw redirect(302, '/');
	}
};
