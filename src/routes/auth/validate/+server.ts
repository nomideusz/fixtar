import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';

/**
 * POST /auth/validate
 * Validate the current Better Auth session
 * NOTE: Better Auth already validates sessions via svelteKitHandler in hooks.server.ts.
 * This endpoint exists for client-side explicit token validation.
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Try to get session from Authorization header (token in body) or cookies
		const headers = new Headers();

		const contentType = request.headers.get('content-type') || '';
		if (contentType.includes('application/json')) {
			try {
				const text = await request.text();
				if (text) {
					const body = JSON.parse(text);
					if (body.token) headers.set('authorization', `Bearer ${body.token}`);
				}
			} catch {
				// ignore parse errors — fall through to cookie-based auth
			}
		}

		// Forward cookies so Better Auth can validate cookie-based session
		const cookieHeader = cookies
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join('; ');
		if (cookieHeader) headers.set('cookie', cookieHeader);

		const session = await auth.api.getSession({ headers });

		if (session?.user) {
			return json({
				isValid: true,
				user: { id: session.user.id, email: session.user.email, name: session.user.name }
			});
		}

		return json({ isValid: false, error: 'No valid session' }, { status: 401 });
	} catch (error) {
		console.error('Session validation error:', error);
		return json(
			{ isValid: false, error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};
