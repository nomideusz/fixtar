import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request, cookies, url }) => {
	// Get all cookies for debugging
	const allCookies: Record<string, string> = {};
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
				name: locals.user.name,
				emailVerified: locals.user.emailVerified,
				isAuthenticated: locals.isAuthenticated
			}
		: null;

	const safeSession = locals.session
		? {
				id: locals.session.id,
				expiresAt: locals.session.expiresAt
			}
		: null;

	return json({
		authenticated: !!locals.user,
		isAuthenticated: locals.isAuthenticated,
		user: safeUser,
		session: safeSession,
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
