import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';

export const load = (async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const sortBy = url.searchParams.get('sort') || 'name';

	try {
		const [{ products: allDbProducts }, dbCategories] = await Promise.all([
			getAllProducts({
				search: searchQuery || undefined,
				sort: sortBy,
				page: 1,
				perPage: 500 // get all products
			}),
			getCategories()
		]);

		const allProducts = allDbProducts.map(toStoreProduct);

		const categories = dbCategories.map((c) => ({
			id: c.category_slug,
			name: c.category,
			slug: c.category_slug,
			image: '',
			productCount: Number(c.count)
		}));

		// Group products by category
		const productsByCategory: Record<string, typeof allProducts> = {};
		for (const product of allProducts) {
			const catSlug = product.categories?.[0] || 'inne';
			if (!productsByCategory[catSlug]) {
				productsByCategory[catSlug] = [];
			}
			productsByCategory[catSlug].push(product);
		}

		// Build ordered category sections
		const categorySections = categories
			.filter((cat) => productsByCategory[cat.slug]?.length > 0)
			.map((cat) => ({
				category: cat,
				products: productsByCategory[cat.slug] || []
			}));

		return {
			categorySections,
			categories,
			searchQuery,
			sortBy,
			totalItems: allProducts.length
		};
	} catch (error) {
		console.error('Failed to load products:', error);
		return {
			categorySections: [],
			categories: [],
			searchQuery,
			sortBy,
			totalItems: 0,
			error: 'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.'
		};
	}
}) satisfies PageServerLoad;
