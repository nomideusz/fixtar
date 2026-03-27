import type { PageServerLoad } from './$types';
import { getAllProducts, toStoreProduct } from '$lib/server/products';

export const load = (async () => {
	try {
		const { products: dbProducts } = await getAllProducts({
			sort: 'name',
			page: 1,
			perPage: 200
		});

		const allProducts = dbProducts.map(toStoreProduct);

		// Deals = products where BaseLinker has set a compare-at price higher than sale price
		const deals = allProducts
			.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
			.map((p) => ({
				id: p.id,
				slug: p.slug,
				name: p.name,
				description: p.description?.slice(0, 150) || '',
				price: p.price,
				compareAtPrice: p.compareAtPrice!,
				discountPercent: Math.round(
					((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100
				),
				image: p.mainImage,
				category: p.expand?.categories?.[0]?.name || '',
				inStock: (p.inventory?.quantity ?? 0) > 0
			}))
			.sort((a, b) => b.discountPercent - a.discountPercent);

		return { deals };
	} catch (error) {
		console.error('Failed to load deals:', error);
		return {
			deals: [],
			error: 'Wystąpił błąd podczas ładowania promocji.'
		};
	}
}) satisfies PageServerLoad;
