import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const firstName = data.get('firstName')?.toString().trim() || '';
		const lastName = data.get('lastName')?.toString().trim() || '';
		const name = [firstName, lastName].filter(Boolean).join(' ') || data.get('username')?.toString().trim() || '';
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
			await auth.api.signUpEmail({
				body: { name, email, password }
			});
		} catch (err: any) {
			const message = err?.body?.message || 'Registration failed';
			if (message.toLowerCase().includes('already')) {
				return fail(400, { message: 'This email is already registered.', name, email, emailExists: true });
			}
			return fail(400, { message, name, email });
		}

		throw redirect(303, '/account');
	}
};
