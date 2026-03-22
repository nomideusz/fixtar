import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const categoryFilter = url.searchParams.get('category') || '';
	const currentPage = parseInt(url.searchParams.get('page') || '1');
	const perPage = 20;

	const [{ products: dbProducts, total: totalItems }, dbCategories] = await Promise.all([
		getAllProducts({
			search: searchQuery || undefined,
			category: categoryFilter || undefined,
			page: currentPage,
			perPage
		}),
		getCategories()
	]);

	const products = dbProducts.map((p) => {
		const sp = toStoreProduct(p);
		return {
			...sp,
			expand: sp.expand
		};
	});

	const categories = dbCategories.map((c) => ({
		id: c.category_slug,
		name: c.category,
		slug: c.category_slug,
		productCount: Number(c.count)
	}));

	return {
		products,
		categories,
		stats: {
			active: totalItems,
			draft: 0,
			inactive: 0
		},
		totalItems,
		totalPages: Math.max(1, Math.ceil(totalItems / perPage)),
		currentPage,
		filters: {
			search: searchQuery,
			status: '',
			category: categoryFilter
		},
		searchQuery,
		statusFilter: '',
		categoryFilter
	};
};
