// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	// Check if the user is authenticated
	if (!locals.isAuthenticated || !locals.user) {
		throw redirect(302, '/auth/login');
	}

	// Authenticate the PocketBase client
	const pb = locals.pb;
	if (locals.token) {
		try {
			pb.authStore.save(locals.token, locals.user);
		} catch (authError) {
			console.error('[settings] Failed to authenticate PocketBase client:', authError);
			// Fallback to session user data if PB auth fails
			return {
				user: {
					id: locals.user.id,
					username: locals.user.username || '',
					email: locals.user.email || '',
					firstName: locals.user.firstName || '',
					lastName: locals.user.lastName || '',
					phone: locals.user.phone || '',
					verified: locals.user.verified || false,
					isAdmin: locals.user.isAdmin || false,
					created: locals.user.created,
					updated: locals.user.updated
				}
			};
		}
	}

	try {
		// Fetch fresh user data from PocketBase to ensure we have the latest updates
		console.log('[settings] Fetching fresh user data for:', locals.user.id);
		const freshUser = await pb.collection('users').getOne(locals.user.id);
		
		console.log('[settings] Fresh user data loaded successfully');
		
		// Return fresh user data with proper fallbacks
		return {
			user: {
				id: freshUser.id,
				username: freshUser.username || '',
				email: freshUser.email || '',
				firstName: freshUser.firstName || '',
				lastName: freshUser.lastName || '',
				phone: freshUser.phone || '',
				verified: freshUser.verified || false,
				isAdmin: freshUser.isAdmin || false,
				created: freshUser.created,
				updated: freshUser.updated
			}
		};
	} catch (error) {
		console.error('[settings] Error fetching fresh user data:', error);
		// Fallback to session user data with proper fallbacks if fetch fails
		return {
			user: {
				id: locals.user.id,
				username: locals.user.username || '',
				email: locals.user.email || '',
				firstName: locals.user.firstName || '',
				lastName: locals.user.lastName || '',
				phone: locals.user.phone || '',
				verified: locals.user.verified || false,
				isAdmin: locals.user.isAdmin || false,
				created: locals.user.created,
				updated: locals.user.updated
			}
		};
	}
};

export const actions = {
	updateProfile: async ({ request, locals }: import('./$types').RequestEvent) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		// Authenticate the PocketBase client
		const pb = locals.pb;
		if (locals.token) {
			try {
				pb.authStore.save(locals.token, locals.user);
			} catch (authError) {
				console.error('Failed to authenticate PocketBase client:', authError);
				return fail(401, { message: 'Authentication failed' });
			}
		}

		const formData = await request.formData();
		const firstName = formData.get('firstName')?.toString() || '';
		const lastName = formData.get('lastName')?.toString() || '';
		const username = formData.get('username')?.toString();
		const phone = formData.get('phone')?.toString() || '';

		if (!username) {
			return fail(400, { message: 'Username is required' });
		}

		try {
			console.log('[settings] Updating user profile:', {
				firstName,
				lastName,
				username,
				phone
			});

			// Update user record using PocketBase client
			const updatedUser = await pb.collection('users').update(locals.user.id, {
				firstName,
				lastName,
				username,
				phone
			});

			console.log('[settings] Profile updated successfully');

			return {
				success: true,
				user: {
					id: updatedUser.id,
					username: updatedUser.username,
					email: updatedUser.email,
					firstName: updatedUser.firstName,
					lastName: updatedUser.lastName,
					phone: updatedUser.phone,
					verified: updatedUser.verified,
					isAdmin: updatedUser.isAdmin,
					created: updatedUser.created,
					updated: updatedUser.updated
				}
			};
		} catch (error: any) {
			console.error('[settings] Error updating profile:', error);
			
			// Handle specific PocketBase errors
			if (error.data?.data?.username) {
				return fail(400, { message: 'Username is already taken' });
			}
			
			return fail(500, {
				message: error.message || 'Failed to update profile'
			});
		}
	},

	changePassword: async ({ request, locals }: import('./$types').RequestEvent) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		// Authenticate the PocketBase client
		const pb = locals.pb;
		if (locals.token) {
			try {
				pb.authStore.save(locals.token, locals.user);
			} catch (authError) {
				console.error('Failed to authenticate PocketBase client:', authError);
				return fail(401, { message: 'Authentication failed' });
			}
		}

		const formData = await request.formData();
		const oldPassword = formData.get('oldPassword')?.toString();
		const newPassword = formData.get('newPassword')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!oldPassword || !newPassword || !confirmPassword) {
			return fail(400, { message: 'All password fields are required' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { message: 'New passwords do not match' });
		}

		if (newPassword.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters' });
		}

		try {
			console.log('[settings] Changing password for user:', locals.user.id);

			// Update password using PocketBase client
			await pb.collection('users').update(locals.user.id, {
				oldPassword,
				password: newPassword,
				passwordConfirm: confirmPassword
			});

			console.log('[settings] Password changed successfully');

			return { success: true, passwordChanged: true };
		} catch (error: any) {
			console.error('[settings] Error changing password:', error);
			
			// Handle specific PocketBase errors
			if (error.data?.data?.oldPassword) {
				return fail(400, { message: 'Current password is incorrect' });
			}
			if (error.data?.data?.password) {
				return fail(400, { message: 'New password does not meet requirements' });
			}
			
			return fail(500, { message: error.message || 'Failed to update password' });
		}
	},

	requestVerification: async ({ locals }: import('./$types').RequestEvent) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		// Authenticate the PocketBase client
		const pb = locals.pb;
		if (locals.token) {
			try {
				pb.authStore.save(locals.token, locals.user);
			} catch (authError) {
				console.error('Failed to authenticate PocketBase client:', authError);
				return fail(401, { message: 'Authentication failed' });
			}
		}

		try {
			console.log('[settings] Requesting email verification for:', locals.user.email);

			// Request email verification using PocketBase client
			await pb.collection('users').requestVerification(locals.user.email);

			console.log('[settings] Verification email sent successfully');

			return { success: true, verificationSent: true };
		} catch (error: any) {
			console.error('[settings] Error requesting verification:', error);
			return fail(500, { 
				message: error.message || 'Failed to send verification email' 
			});
		}
	}
};
;null as any as Actions;