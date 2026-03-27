import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { magicLink, user } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';

/**
 * Sign a cookie value the same way better-call does:
 * HMAC-SHA256 with Web Crypto, output as base64 (not base64url).
 * The signed format is: "value.signature" where signature is 44 chars base64 ending with "=".
 */
async function signCookie(value: string, secret: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
	const base64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
	return `${value}.${base64}`;
}

export const GET: RequestHandler = async ({ params, request }) => {
	const { token } = params;

	const [link] = await db
		.select()
		.from(magicLink)
		.where(eq(magicLink.token, token));

	if (!link) {
		throw redirect(302, '/auth/login?error=invalid-link');
	}

	if (link.expiresAt < new Date()) {
		throw redirect(302, '/auth/login?error=expired-link');
	}

	const [targetUser] = await db.select().from(user).where(eq(user.id, link.userId));
	if (!targetUser) {
		throw redirect(302, '/auth/login?error=user-not-found');
	}

	// Create session via better-auth internals
	const ctx = await (auth as any).$context;
	const internalSession = await ctx.internalAdapter.createSession(
		targetUser.id,
		request.headers
	);

	if (!internalSession) {
		throw redirect(302, '/auth/login?error=session-failed');
	}

	// Sign cookie with the same method better-call uses (Web Crypto HMAC-SHA256, base64)
	const cookieName = ctx.authCookies.sessionToken.name;
	const cookieAttrs = ctx.authCookies.sessionToken.attributes;
	const signedValue = await signCookie(internalSession.token, ctx.secret);
	const maxAge = ctx.sessionConfig.expiresIn || 30 * 24 * 60 * 60;

	const parts = [
		`${cookieName}=${signedValue}`,
		`Path=${cookieAttrs.path || '/'}`,
		`Max-Age=${maxAge}`,
		'HttpOnly',
		`SameSite=${cookieAttrs.sameSite || 'Lax'}`
	];
	if (cookieAttrs.secure) parts.push('Secure');

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
			'Set-Cookie': parts.join('; ')
		}
	});
};
