/**
 * Generate a magic link for a user.
 *
 * Usage:
 *   npx tsx scripts/generate-magic-link.ts <email> [days]
 *
 * Examples:
 *   npx tsx scripts/generate-magic-link.ts s@kurcz.pl        # 7-day link
 *   npx tsx scripts/generate-magic-link.ts s@kurcz.pl 30     # 30-day link
 */

import 'dotenv/config';
import { createClient } from '@libsql/client';
import { randomUUID, randomBytes } from 'crypto';

const email = process.argv[2];
const days = parseInt(process.argv[3] || '7');

if (!email) {
	console.error('Usage: npx tsx scripts/generate-magic-link.ts <email> [days]');
	process.exit(1);
}

const client = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN
});

async function run() {
	// Find user
	const result = await client.execute({ sql: 'SELECT id, name, email FROM user WHERE email = ?', args: [email] });
	if (result.rows.length === 0) {
		console.error(`User not found: ${email}`);
		process.exit(1);
	}

	const user = result.rows[0];
	const token = randomBytes(32).toString('base64url');
	const now = Date.now();
	const expiresAt = now + days * 24 * 60 * 60 * 1000;

	await client.execute({
		sql: 'INSERT INTO magic_link (id, token, user_id, expires_at, used, created_at) VALUES (?, ?, ?, ?, 0, ?)',
		args: [randomUUID(), token, user.id as string, expiresAt, now]
	});

	const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:5173';
	const link = `${baseUrl}/auth/magic/${token}`;

	console.log('');
	console.log(`Magic link for ${user.name} (${user.email}):`);
	console.log(`Expires: ${new Date(expiresAt).toLocaleDateString('pl-PL')} (${days} days)`);
	console.log('');
	console.log(link);
	console.log('');
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
