import type { PageServerLoad } from './$types';
import { getTotalProducts, getCategories, getFeaturedProducts, toStoreProduct } from '$lib/server/products';

export const load: PageServerLoad = async () => {
	const [totalProducts, categories, recentDbProducts] = await Promise.all([
		getTotalProducts(),
		getCategories(),
		getFeaturedProducts(5)
	]);

	return {
		stats: {
			totalProducts,
			activeProducts: totalProducts,
			draftProducts: 0,
			totalCategories: categories.length,
			totalOrders: 0,
			totalRevenue: 0
		},
		recentProducts: recentDbProducts.map((p) => {
			const sp = toStoreProduct(p);
			return {
				id: sp.id,
				name: sp.name,
				sku: sp.sku,
				price: sp.price,
				status: sp.status,
				created: '',
				categories: sp.expand?.categories || []
			};
		})
	};
};
