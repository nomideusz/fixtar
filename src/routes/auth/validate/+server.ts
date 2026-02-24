import { json } from '@sveltejs/kit';
import { validateSession, setSessionCookieWithParams, SESSION_COOKIE_NAME } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	try {
		// Get token from request body, handling empty bodies gracefully
		let token = null;
		try {
			// First try to get token from request body JSON
			const contentType = request.headers.get('content-type') || '';
			if (contentType.includes('application/json')) {
				const text = await request.text();
				if (text && text.length > 0) {
					const body = JSON.parse(text);
					token = body.token;
				}
			}
		} catch (e) {
			console.log('[AUTH] Error parsing request body:', e);
			// Continue - will validate cookie-based auth
		}

		// If no token in body, try from cookies
		if (!token) {
			token = cookies.get(SESSION_COOKIE_NAME);
		}

		if (!token) {
			return json({ isValid: false, error: 'No session token found' }, { status: 401 });
		}

		// Validate the token
		const { user, isValid } = await validateSession(token);

		if (isValid && user) {
			// Set the cookie so future requests will be authenticated
			setSessionCookieWithParams(cookies, url, token);

			return json({
				isValid: true,
				user,
				token
			});
		} else {
			return json({ isValid: false, error: 'Invalid session' }, { status: 401 });
		}
	} catch (error) {
		console.error('Session validation error:', error);
		return json(
			{
				isValid: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
