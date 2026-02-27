import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';

/**
 * POST /api/auth/validate
 * Validate a Better Auth session token
 * TODO: Evaluate if this endpoint is still needed — Better Auth handles session
 * validation automatically via svelteKitHandler in hooks.server.ts
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { token } = body;

		if (!token) {
			return json({ isValid: false, error: 'No token provided' }, { status: 400 });
		}

		// Use Better Auth to validate the session token
		const session = await auth.api.getSession({
			headers: new Headers({ authorization: `Bearer ${token}` })
		});

		if (session?.user) {
			return json({ isValid: true, user: { id: session.user.id, email: session.user.email, name: session.user.name } });
		}

		return json({ isValid: false, error: 'Invalid token' }, { status: 401 });
	} catch (error) {
		console.error('[API] Token validation error:', error);
		return json({ isValid: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
	}
};
