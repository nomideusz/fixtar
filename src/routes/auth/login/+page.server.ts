import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

/**
 * Parse a single Set-Cookie header string into name, value, and options.
 */
function parseSetCookie(header: string) {
	const parts = header.split(';').map((s) => s.trim());
	const [nameValue] = parts;
	const eqIdx = nameValue.indexOf('=');
	if (eqIdx < 0) return null;

	const name = nameValue.substring(0, eqIdx);
	const value = nameValue.substring(eqIdx + 1);

	const opts: Record<string, unknown> = { path: '/' };
	for (const part of parts.slice(1)) {
		const lower = part.toLowerCase();
		if (lower.startsWith('max-age=')) opts.maxAge = parseInt(lower.split('=')[1]);
		if (lower === 'httponly') opts.httpOnly = true;
		if (lower === 'secure') opts.secure = true;
		if (lower.startsWith('samesite=')) opts.sameSite = lower.split('=')[1];
		if (lower.startsWith('path=')) opts.path = part.split('=')[1];
	}

	return { name, value, opts };
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString();
		const redirectTo = data.get('redirectTo')?.toString() || '/account';

		if (!email || !password) {
			return fail(400, { message: 'Email i hasło są wymagane', email: email || '', redirectTo });
		}

		try {
			// Use asResponse to get the full HTTP response with signed Set-Cookie headers
			const response = await auth.api.signInEmail({
				body: { email, password },
				asResponse: true
			});

			if (!response.ok) {
				return fail(401, { message: 'Nieprawidłowe dane logowania', email, redirectTo });
			}

			// Forward Set-Cookie headers from Better Auth response.
			// Better Auth signs/encodes the session token — we must use the exact
			// cookie values it produces, not the raw token from the JSON body.
			const setCookieHeaders = response.headers.getSetCookie();
			for (const cookieStr of setCookieHeaders) {
				const parsed = parseSetCookie(cookieStr);
				if (!parsed) continue;
				// Use encode: identity to avoid double-encoding the signed value
				cookies.set(parsed.name, parsed.value, {
					...parsed.opts,
					path: (parsed.opts.path as string) || '/',
					encode: (v: string) => v
				});
			}
		} catch (err: unknown) {
			console.error('[login] signInEmail error:', err);
			const message =
				(err as any)?.body?.message || (err as any)?.message || 'Nieprawidłowe dane logowania';
			return fail(401, { message, email, redirectTo });
		}

		throw redirect(303, redirectTo);
	}
};
