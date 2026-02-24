import { loginUser, setSessionCookieWithParams } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	default: async ({ request, cookies, fetch, url }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const redirectTo = data.get('redirectTo')?.toString() || '/account';

		console.log(`[login] Processing login attempt for ${email || 'unknown user'}`);
		console.log(`[login] Current URL: ${url.toString()}`);
		console.log(`[login] Redirect destination: ${redirectTo}`);

		if (!email || !password) {
			return fail(400, {
				message: 'Email and password are required',
				email: email || '',
				redirectTo
			});
		}

		// Use our simplified login function
		const result = await loginUser(email, password);

		if (!result.success) {
			console.log(`[login] Login failed:`, result.error);
			return fail(401, {
				message: 'Invalid credentials',
				email,
				redirectTo
			});
		}

		console.log(`[login] Login successful for ${email}`);

		// Set the session cookie with improved domain handling
		console.log(`[login] Setting session cookie`);

		// Set domain explicitly to match the hostname
		setSessionCookieWithParams(cookies, url, result.token as string);

		// Print all cookies for debugging
		const allCookies = cookies.getAll();
		console.log(`[login] Cookies set (${allCookies.length})`);

		// Get absolute redirect URL for consistency
		const absoluteRedirectUrl = new URL(redirectTo, url.origin).toString();
		console.log(`[login] Redirecting to: ${absoluteRedirectUrl}`);

		// For direct server redirects, it's better to use an immediate redirect
		throw redirect(303, absoluteRedirectUrl);
	}
};
