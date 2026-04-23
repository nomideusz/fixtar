import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const categoryFilter = url.searchParams.get('category') || '';
	const statusFilter = url.searchParams.get('status') || '';
	const sort = url.searchParams.get('sort') || 'created';
	const order = url.searchParams.get('order') || 'desc';
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

	const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

	return {
		products,
		categories,
		statusCounts: {
			active: totalItems,
			draft: 0,
			inactive: 0
		},
		pagination: {
			currentPage,
			totalPages,
			totalItems
		},
		filters: {
			search: searchQuery,
			status: statusFilter,
			category: categoryFilter,
			sort,
			order
		}
	};
};
