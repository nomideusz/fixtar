import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// Security headers to improve site security
const securityHeaders = {
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Handle authentication via Better Auth
const handleAuth: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

// Populate locals from Better Auth session
const populateLocals: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.user = session.user;
		event.locals.session = session.session;
		event.locals.isAuthenticated = true;
	} else {
		event.locals.user = null;
		event.locals.session = null;
		event.locals.isAuthenticated = false;
	}

	return resolve(event);
};

// Add security headers to response
const handleSecurity: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	Object.entries(securityHeaders).forEach(([header, value]) => {
		response.headers.set(header, value);
	});

	return response;
};

// Handle basic bot filtering
const filterBots: Handle = async ({ event, resolve }) => {
	const userAgent = event.request.headers.get('user-agent') || '';
	const isBot = /bot|crawl|spider|slurp|mediapartners-google/i.test(userAgent);

	event.locals.isBot = isBot;

	if (
		isBot &&
		(event.url.pathname.startsWith('/account') || event.url.pathname.startsWith('/api'))
	) {
		return new Response('Not Found', { status: 404 });
	}

	return resolve(event);
};

// Sequence the handlers
export const handle: Handle = sequence(filterBots, handleAuth, populateLocals, handleSecurity);
