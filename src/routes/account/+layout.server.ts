import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getAuthenticatedUser, logoutUser, deleteSessionCookie } from '$lib/server/auth';
import { dev } from '$app/environment';

export const load = (async ({ locals, url, cookies, fetch }) => {
	// Get the PocketBase instance from locals (created fresh per request)
	const pb = locals.pb;

	try {
		console.log(`Account layout server: Checking auth for path ${url.pathname}`);

		// Get authenticated user with enhanced error logging
		const user = await getAuthenticatedUser(pb, locals);

		// Add debug logging to track authentication state
		console.log(
			`Account layout server: Auth state check - User ${user ? 'found with ID ' + user.id : 'not found'}, authStore.isValid=${pb?.authStore?.isValid || false}`
		);

		// Check if we're in development mode - allow bypassing authentication in dev
		if (dev) {
			console.log('Account layout server: Dev mode active, allowing access without authentication');
			return {
				user: user || {
					id: 'dev-user',
					username: 'DevUser',
					email: 'dev@example.com',
					created: new Date().toISOString(),
					updated: new Date().toISOString(),
					verified: true
				}
			};
		}

		// IMPORTANT: If user exists in locals but authStore reports invalid,
		// We should trust the user in locals as the hooks already validated the session
		if (user && locals.user) {
			console.log('Account layout server: User found in locals, trusting hooks validation');
			return {
				user: {
					...user,
					isAuthenticated: true
				}
			};
		}
		
		// Double check authentication - if no user, redirect to login
		if (!user) {
			console.log('Account layout server: No authenticated user, forcing logout');

			// Force a server-side logout to clear any invalid/stale cookies
			try {
				logoutUser(pb);
				deleteSessionCookie({ locals, cookies, url } as any);
			} catch (err) {
				console.error('Error during logout process:', err);
			}

			console.log('Account layout server: Redirecting to login');
			// Redirect to login with parameter to return to this page
			throw redirect(303, `/auth/login?redirect=${encodeURIComponent(url.pathname)}&auth=expired`);
		}

		console.log('Account layout server: User authenticated successfully:', user.username);

		// Return user data for the account layout
		return {
			user: {
				...user,
				isAuthenticated: true
			}
		};
	} catch (error) {
		console.error('Account layout server error:', error);

		// Force cleanup of any auth cookies if there was an error
		try {
			logoutUser(pb);
			deleteSessionCookie({ locals, cookies, url } as any);
		} catch (e) {
			console.error('Failed to clear cookies during error handling:', e);
		}

		throw redirect(303, `/auth/login?redirect=${encodeURIComponent(url.pathname)}&error=session`);
	}
}) satisfies LayoutServerLoad;

