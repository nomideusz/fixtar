import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPocketBaseClient } from '$lib/server/pocketbase';

export const GET: RequestHandler = async ({ locals, request, cookies, url }) => {
	// Create a fresh PocketBase client for this request
	const freshPb = createPocketBaseClient();

	// Get all cookies for debugging
	const allCookies: Record<string, string> = {};

	// Use cookies.getAll() properly - it returns { name, value, path, ... } objects
	for (const cookie of cookies.getAll()) {
		allCookies[cookie.name] = cookie.value;
	}

	// Get request headers for debugging
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});

	// Create a safe version of user data without sensitive information
	const safeUser = locals.user
		? {
				id: locals.user.id,
				email: locals.user.email,
				username: locals.user.username,
				verified: locals.user.verified,
				isAuthenticated: locals.isAuthenticated
			}
		: null;

	// Get PocketBase auth store state from locals
	const pbAuthState = locals.pb
		? {
				isValid: locals.pb.authStore.isValid,
				token: locals.pb.authStore.token
					? `${locals.pb.authStore.token.substring(0, 10)}...`
					: null,
				hasRecord: !!locals.pb.authStore.record
			}
		: null;

	// Get auth state from the fresh PB instance using the auth cookie
	const authCookie = cookies.get('pb-auth');
	if (authCookie) {
		freshPb.authStore.save(authCookie, null);
	}

	const freshPbAuthState = {
		isValid: freshPb.authStore.isValid,
		token: freshPb.authStore.token ? `${freshPb.authStore.token.substring(0, 10)}...` : null,
		hasRecord: !!freshPb.authStore.record
	};

	// Return useful debugging information
	return json({
		authenticated: !!locals.user,
		isAuthenticated: locals.isAuthenticated,
		user: safeUser,
		token: locals.token ? `${locals.token.substring(0, 10)}...` : null,
		pbAuthState,
		freshPbAuthState,
		cookies: allCookies,
		headers,
		url: url.toString(),
		origin: url.origin,
		host: url.host,
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
		runtime: {
			vercel: !!process.env.VERCEL_ENV,
			cf: !!process.env.CF_PAGES
		}
	});
};
