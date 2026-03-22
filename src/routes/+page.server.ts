import type { PageServerLoad } from './$types';
import {
	getFeaturedProducts,
	getTotalProducts,
	getCategories,
	toStoreProduct
} from '$lib/server/products';

export const load: PageServerLoad = async () => {
	const [dbProducts, totalProducts, dbCategories] = await Promise.all([
		getFeaturedProducts(8),
		getTotalProducts(),
		getCategories()
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
		categories
	};
};
