import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchProducts } from '$lib/server/search';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

// Direct libsql client for search (bypasses drizzle)
const client = createClient({
	url: env.TURSO_DATABASE_URL || 'file:./dev.db',
	authToken: env.TURSO_AUTH_TOKEN || undefined
});

export const GET: RequestHandler = async ({ url }) => {
	const q = (url.searchParams.get('q') ?? '').slice(0, 200);
	const category = url.searchParams.get('category') ?? undefined;
	const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit') ?? '20', 10) || 20));
	const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10) || 0);

	try {
		const response = await searchProducts(client, { query: q, category, limit, offset });
		return json(response);
	} catch (err) {
		console.error('Search error:', err);
		return json({ error: 'Search failed' }, { status: 500 });
	}
};
