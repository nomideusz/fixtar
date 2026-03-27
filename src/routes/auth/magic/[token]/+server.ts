import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { magicLink, user, session } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, cookies }) => {
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

	// Single-use links get consumed; reusable links (used=false) stay active
	// To make a link single-use, set used=true after first use
	// For now all links are reusable until expiry

	const [targetUser] = await db.select().from(user).where(eq(user.id, link.userId));
	if (!targetUser) {
		throw redirect(302, '/auth/login?error=user-not-found');
	}

	const now = new Date();
	const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
	const sessionToken = crypto.randomUUID();
	const sessionId = crypto.randomUUID();

	await db.insert(session).values({
		id: sessionId,
		token: sessionToken,
		userId: targetUser.id,
		expiresAt,
		createdAt: now,
		updatedAt: now
	});

	const isProduction = process.env.NODE_ENV === 'production';
	const cookieName = isProduction
		? '__Secure-better-auth.session_token'
		: 'better-auth.session_token';

	cookies.set(cookieName, sessionToken, {
		path: '/',
		httpOnly: true,
		secure: isProduction,
		sameSite: 'lax',
		maxAge: 30 * 24 * 60 * 60
	});

	throw redirect(302, '/');
};
