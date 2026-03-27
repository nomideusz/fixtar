import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { magicLink, user, session } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const { token } = params;

	// Find valid, unused, non-expired magic link
	const [link] = await db
		.select()
		.from(magicLink)
		.where(and(eq(magicLink.token, token), eq(magicLink.used, false)));

	if (!link) {
		throw redirect(302, '/auth/login?error=invalid-link');
	}

	if (link.expiresAt < new Date()) {
		await db.update(magicLink).set({ used: true }).where(eq(magicLink.id, link.id));
		throw redirect(302, '/auth/login?error=expired-link');
	}

	// Mark as used
	await db.update(magicLink).set({ used: true }).where(eq(magicLink.id, link.id));

	// Get the user
	const [targetUser] = await db.select().from(user).where(eq(user.id, link.userId));
	if (!targetUser) {
		throw redirect(302, '/auth/login?error=user-not-found');
	}

	// Create a session directly
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

	// better-auth prefixes cookie name with __Secure- when useSecureCookies is true (production)
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
