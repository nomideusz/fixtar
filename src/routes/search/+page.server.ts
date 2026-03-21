import type { PageServerLoad } from './$types';
import { searchProducts, type ProductSearchResult } from '$lib/server/search';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

const client = createClient({
	url: env.TURSO_DATABASE_URL || 'file:./dev.db',
	authToken: env.TURSO_AUTH_TOKEN || undefined
});

export const load = (async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const category = url.searchParams.get('category') || undefined;

	if (!query.trim()) {
		return {
			searchQuery: query,
			products: [] as ProductSearchResult[],
			total: 0,
			error: undefined
		};
	}

	try {
		const response = await searchProducts(client, { query, category, limit: 40 });
		return {
			searchQuery: query,
			products: response.results,
			total: response.totalFound,
			error: undefined
		};
	} catch (err) {
		console.error('Search error:', err);
		return {
			searchQuery: query,
			products: [] as ProductSearchResult[],
			total: 0,
			error: 'Wystąpił błąd podczas wyszukiwania'
		};
	}
}) satisfies PageServerLoad;
