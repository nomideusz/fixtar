import type { PageServerLoad } from './$types';
import {
	getFeaturedProducts,
	getTotalProducts,
	getCategories,
	getDealsCount,
	toStoreProduct
} from '$lib/server/products';

export const load: PageServerLoad = async () => {
	const [dbProducts, totalProducts, dbCategories, dealsCount] = await Promise.all([
		getFeaturedProducts(12),
		getTotalProducts(),
		getCategories(),
		getDealsCount()
	]);

	const categories = dbCategories.map((c) => ({
		id: c.category_slug,
		name: c.category,
		slug: c.category_slug,
		count: Number(c.count)
	}));

	return {
		featuredProducts: dbProducts.map(toStoreProduct),
		totalProducts,
		categories,
		dealsCount
	};
};
