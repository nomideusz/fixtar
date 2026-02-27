import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

if (!env.TURSO_DATABASE_URL && !process.env.TURSO_DATABASE_URL) {
	console.warn('[db] TURSO_DATABASE_URL is not set — database will not function until configured.');
}
if (!env.TURSO_AUTH_TOKEN && !process.env.TURSO_AUTH_TOKEN) {
	console.warn('[db] TURSO_AUTH_TOKEN is not set — database will not function until configured.');
}

const libsqlClient = createClient({
	url: env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./dev.db',
	authToken: env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined
});

export const db = drizzle(libsqlClient, { schema });
export { schema };
