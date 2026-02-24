import { registerUser, loginUser, setSessionCookieWithParams } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies, fetch, url }) => {
		const data = await request.formData();
		const fullName = data.get('username')?.toString(); // This is actually the full name from the form
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		console.log(`[register] Processing registration for ${email || 'unknown'}`);

		// Validate required fields
		if (!fullName || !email || !password) {
			return fail(400, {
				message: 'All fields are required',
				username: fullName || '',
				email: email || ''
			});
		}

		// Create a username from email (part before @)
		const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
		
		console.log(`[register] Created username "${username}" from email "${email}"`);
		console.log(`[register] Full name: "${fullName}"`);
		console.log(`[register] Password length: ${password.length}`);

		// Validate password confirmation
		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match',
				username: fullName,
				email
			});
		}

		// Ensure username is at least 3 characters (required by schema)
		if (username.length < 3) {
			return fail(400, {
				message: 'Email address is too short to create a valid username',
				username: fullName,
				email
			});
		}

		// Register the user
		const registerResult = await registerUser(username, email, password, confirmPassword);

		if (!registerResult.success) {
			// Check for possible error types
			const errorMessage = String(registerResult.error);
			if (errorMessage.includes('already exists')) {
				console.log(`[register] Email already exists: ${email}`);
							return fail(400, {
				message: 'This email is already registered. Please try logging in instead.',
				username: fullName,
				email,
				emailExists: true
			});
			}

			// Handle other registration errors
			console.log(`[register] Registration failed:`, registerResult.error);
			return fail(400, {
				message: 'Registration failed. Please try again.',
				username: fullName,
				email
			});
		}

		console.log(`[register] Registration successful for ${email}, logging in automatically`);

		// Log the user in immediately after registration
		const loginResult = await loginUser(email, password);

		if (!loginResult.success) {
			console.log(`[register] Auto-login failed after registration:`, loginResult.error);
			return fail(500, {
				message: 'Registration successful but login failed',
				username: fullName,
				email
			});
		}

		// Set the session cookie with the complete event object
		console.log(`[register] Setting session cookie`);

		// Call the simplified function with cookies and URL directly
		setSessionCookieWithParams(cookies, url, loginResult.token as string);

		// Print all cookies for debugging
		const allCookies = cookies.getAll();
		console.log(
			`[register] Cookies set (${allCookies.length}):`,
			allCookies.map((c) => ({
				name: c.name,
				value: c.value ? 'present' : 'missing'
			}))
		);

		console.log(`[register] Login successful after registration, redirecting to account page`);

		// Use an absolute URL for redirect to ensure proper handling across domains
		const accountUrl = new URL('/account', url.origin).toString();
		throw redirect(303, accountUrl);
	}
};
