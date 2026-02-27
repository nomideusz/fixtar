import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

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
			const result = await auth.api.signInEmail({
				body: { email, password }
			});

			if (!result?.token) {
				return fail(401, { message: 'Nieprawidłowe dane logowania', email, redirectTo });
			}

			// Set the Better Auth session cookie
			cookies.set('better-auth.session_token', result.token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
		} catch (err: any) {
			const message = err?.body?.message || 'Nieprawidłowe dane logowania';
			return fail(401, { message, email, redirectTo });
		}

		throw redirect(303, redirectTo);
	}
};
