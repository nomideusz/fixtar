import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';

export const load = (async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const sortBy = url.searchParams.get('sort') || 'name';
	const category = url.searchParams.get('category') || '';

	try {
		const [{ products: dbProducts, total }, dbCategories] = await Promise.all([
			getAllProducts({
				search: searchQuery || undefined,
				category: category || undefined,
				sort: sortBy,
				page: 1,
				perPage: 500
			}),
			getCategories()
		]);

		const products = dbProducts.map(toStoreProduct);

		const categories = dbCategories.map((c) => ({
			slug: c.category_slug,
			name: c.category,
			count: Number(c.count)
		}));

		return {
			products,
			categories,
			searchQuery,
			sortBy,
			category,
			totalItems: total
		};
	} catch (error) {
		console.error('Failed to load products:', error);
		return {
			products: [],
			categories: [],
			searchQuery,
			sortBy,
			category,
			totalItems: 0,
			error: 'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.'
		};
	}
}) satisfies PageServerLoad;
