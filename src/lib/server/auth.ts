import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, schema } from './db';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema
	}),

	// Secret for signing sessions — MUST be set via BETTER_AUTH_SECRET env var in production
	secret: env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || 'dev-placeholder-set-BETTER_AUTH_SECRET-in-env',
	baseURL: env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:5173',

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url }) => {
			// TODO: Replace with a real email provider (Resend, SendGrid, etc.)
			console.log('[auth] Password reset for ' + user.email + ': ' + url);
		}
	},

	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			// TODO: Replace with a real email provider
			console.log('[auth] Verify email for ' + user.email + ': ' + url);
		},
		sendOnSignUp: false
	},

	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID || '',
			clientSecret: env.GOOGLE_CLIENT_SECRET || ''
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID || '',
			clientSecret: env.GITHUB_CLIENT_SECRET || ''
		}
	},

	session: {
		expiresIn: 60 * 60 * 24 * 30,
		updateAge: 60 * 60 * 24
	},

	advanced: {
		useSecureCookies: process.env.NODE_ENV === 'production'
	}
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
