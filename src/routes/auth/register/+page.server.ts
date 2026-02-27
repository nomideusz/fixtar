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
		const firstName = data.get('firstName')?.toString().trim() || '';
		const lastName = data.get('lastName')?.toString().trim() || '';
		const name =
			[firstName, lastName].filter(Boolean).join(' ') ||
			data.get('username')?.toString().trim() ||
			'';
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!name || !email || !password) {
			return fail(400, { message: 'Wszystkie pola są wymagane', name, email: email || '' });
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match', name, email });
		}

		try {
			// Use asResponse to get signed Set-Cookie headers (auto-login after signup)
			const response = await auth.api.signUpEmail({
				body: { name, email, password },
				asResponse: true
			});

			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				const message = body?.message || 'Registration failed';
				if (message.toLowerCase().includes('already')) {
					return fail(400, {
						message: 'This email is already registered.',
						name,
						email,
						emailExists: true
					});
				}
				return fail(400, { message, name, email });
			}

			// Forward Set-Cookie headers so the user is logged in immediately
			const setCookieHeaders = response.headers.getSetCookie();
			for (const cookieStr of setCookieHeaders) {
				const parsed = parseSetCookie(cookieStr);
				if (!parsed) continue;
				cookies.set(parsed.name, parsed.value, {
					...parsed.opts,
					path: (parsed.opts.path as string) || '/',
					encode: (v: string) => v
				});
			}
		} catch (err: unknown) {
			console.error('[register] signUpEmail error:', err);
			const message = (err as any)?.body?.message || (err as any)?.message || 'Registration failed';
			if (typeof message === 'string' && message.toLowerCase().includes('already')) {
				return fail(400, {
					message: 'This email is already registered.',
					name,
					email,
					emailExists: true
				});
			}
			return fail(400, { message, name, email });
		}

		throw redirect(303, '/account');
	}
};
