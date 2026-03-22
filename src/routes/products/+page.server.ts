import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';

export const load = (async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const selectedCategory = url.searchParams.get('category') || '';
	const sortBy = url.searchParams.get('sort') || 'name';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const perPage = 20;

	const [{ products: dbProducts, total: totalItems }, dbCategories] = await Promise.all([
		getAllProducts({
			search: searchQuery || undefined,
			category: selectedCategory || undefined,
			sort: sortBy,
			page,
			perPage
		}),
		getCategories()
	]);

	const products = dbProducts.map(toStoreProduct);
	const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
	const currentPage = Math.min(page, totalPages);

	const categories = dbCategories.map((c) => ({
		id: c.category_slug,
		name: c.category,
		slug: c.category_slug,
		image: '',
		productCount: Number(c.count)
	}));

	return {
		products,
		categories,
		subcategories: [],
		allSubcategories: [],
		totalPages,
		totalItems,
		currentPage,
		searchQuery,
		selectedCategory,
		sortBy
	};
}) satisfies PageServerLoad;
