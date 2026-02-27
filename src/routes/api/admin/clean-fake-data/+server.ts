import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check admin access
	if (!dev) {
		if (!locals.user) {
			return json({ success: false, message: 'Unauthorized. Admin access required.' }, { status: 403 });
		}
		// TODO: Verify admin role once Better Auth roles are configured
	} else {
		console.log('[DEV MODE] Bypassing admin authentication for development');
	}

	try {
		const requestData = await request.json();
		const confirmClean = requestData.confirm === true;

		if (!confirmClean) {
			return json({
				success: false,
				message: 'You must confirm the cleanup by sending { "confirm": true }'
			}, { status: 400 });
		}

		// TODO: Implement fake data cleanup against Turso DB (previously used PocketBase collections)
		console.warn('[TODO] api/admin/clean-fake-data: implement DB cleanup logic');

		return json({
			success: true,
			message: 'Clean-fake-data endpoint is a stub. TODO: implement against Turso DB.',
			deleted: { categories: 0, products: 0, orders: 0 }
		});
	} catch (err: any) {
		console.error('[CLEAN] Error:', err);
		return json({ success: false, message: err.message }, { status: 500 });
	}
};
