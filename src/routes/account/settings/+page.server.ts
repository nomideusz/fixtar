import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.isAuthenticated || !locals.user) {
		throw redirect(302, '/auth/login');
	}

	return {
		user: {
			id: locals.user.id,
			name: locals.user.name || '',
			email: locals.user.email || '',
			emailVerified: locals.user.emailVerified || false,
			image: locals.user.image || null,
			createdAt: locals.user.createdAt,
			updatedAt: locals.user.updatedAt
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const name = data.get('name')?.toString() || '';

		try {
			await auth.api.updateUser({
				body: { name },
				headers: request.headers
			});
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.body?.message || 'Failed to update profile' });
		}
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const currentPassword = data.get('currentPassword')?.toString() || '';
		const newPassword = data.get('newPassword')?.toString() || '';
		const confirmPassword = data.get('confirmPassword')?.toString() || '';

		if (newPassword !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match' });
		}

		if (newPassword.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters' });
		}

		try {
			await auth.api.changePassword({
				body: { currentPassword, newPassword, revokeOtherSessions: true },
				headers: request.headers
			});
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.body?.message || 'Failed to change password' });
		}
	}
};
