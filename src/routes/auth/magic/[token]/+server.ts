import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { magicLink, user } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { createHmac } from 'crypto';

function signCookie(value: string, secret: string): string {
	const signature = createHmac('sha256', secret)
		.update(value)
		.digest('base64url');
	return `${value}.${signature}`;
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

	// Access better-auth internals to create a real session
	const ctx = await (auth as any).$context;

	const internalSession = await ctx.internalAdapter.createSession(
		targetUser.id,
		request.headers
	);

	if (!internalSession) {
		throw redirect(302, '/auth/login?error=session-failed');
	}

	// Sign the session token the same way better-auth does
	const cookieName = ctx.authCookies.sessionToken.name;
	const cookieAttrs = ctx.authCookies.sessionToken.attributes;
	const signedValue = signCookie(internalSession.token, ctx.secret);
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
