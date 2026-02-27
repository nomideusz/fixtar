import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	// TODO: Fetch product by slug from BaseLinker API
	// params.slug is available but data fetching is not yet implemented
	console.log('[product-slug] TODO: fetch product for slug:', params.slug);
	throw error(404, 'Product data source not yet configured. Implement with BaseLinker API.');
}) satisfies PageServerLoad;
