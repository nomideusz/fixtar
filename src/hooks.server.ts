import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import {
	SESSION_COOKIE_NAME,
	validateSession,
	deleteSessionCookie,
	logoutUser
} from '$lib/server/auth';
import { createPocketBaseClient, isDemoMode } from '$lib/server/pocketbase';

// Security headers to improve site security
const securityHeaders = {
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Handle authentication
const handleAuth: Handle = async ({ event, resolve }) => {
	// Set defaults on event.locals
	event.locals.isAuthenticated = false;
	event.locals.user = null;
	event.locals.token = null;

	// In demo mode, skip PocketBase auth entirely
	if (isDemoMode()) {
		event.locals.pb = null as any;
		return resolve(event);
	}

	// Create a fresh PocketBase client for this request
	const pb = createPocketBaseClient();

	// Get the session token from cookies
	const token = event.cookies.get(SESSION_COOKIE_NAME);

	// Log authentication attempt for debugging
	console.log(
		`[hooks] Auth check for: ${event.url.pathname}, token ${token ? 'present' : 'absent'}`
	);

	// Set PB on event.locals
	event.locals.pb = pb;

	if (token) {
		try {
			// Validate the session token
			console.log('[hooks] Found token, validating session...');
			const { user, isValid } = await validateSession(token);

			console.log('[hooks] Validation result:', { isValid, userExists: !!user });

			if (isValid && user) {
				// Valid session - set locals for routes to access
				console.log('[hooks] Session is valid, setting user in locals:', user.username);
				event.locals.user = user;
				event.locals.token = token;
				event.locals.isAuthenticated = true;
			} else {
				// Invalid session - clean up cookies
				console.log('[hooks] Session is invalid, cleaning up cookies');
				logoutUser(pb);
				deleteSessionCookie(event);
			}
		} catch (error) {
			// Error during validation - clean up
			console.error('Session validation error:', error);
			logoutUser(pb);
			deleteSessionCookie(event);
		}
	} else {
		console.log('[hooks] No auth token found in cookies');
	}

	return resolve(event);
};

// Add security headers to response
const handleSecurity: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Add security headers to all responses
	Object.entries(securityHeaders).forEach(([header, value]) => {
		response.headers.set(header, value);
	});

	return response;
};

// Handle basic bot filtering
const filterBots: Handle = async ({ event, resolve }) => {
	const userAgent = event.request.headers.get('user-agent') || '';
	const isBot = /bot|crawl|spider|slurp|mediapartners-google/i.test(userAgent);

	// Set bot info on locals for use in routes if needed
	event.locals.isBot = isBot;

	// If this is a bot accessing a protected route, return 404 early
	if (
		isBot &&
		(event.url.pathname.startsWith('/account') || event.url.pathname.startsWith('/api'))
	) {
		return new Response('Not Found', { status: 404 });
	}

	return resolve(event);
};

// Sequence the handlers
export const handle: Handle = sequence(filterBots, handleAuth, handleSecurity);
