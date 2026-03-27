import type { PageServerLoad } from './$types';
import { getAllProducts, toStoreProduct } from '$lib/server/products';

export const load = (async () => {
	try {
		// Get products with compareAtPrice (discounted products)
		const { products: dbProducts } = await getAllProducts({
			sort: 'name',
			page: 1,
			perPage: 50
		});

		const allProducts = dbProducts.map(toStoreProduct);

		// Filter products that have a discount (compareAtPrice > price)
		const discountedProducts = allProducts.filter(
			(p) => p.compareAtPrice && p.compareAtPrice > p.price
		);

		// Sort by discount percentage (highest first)
		const sortedDeals = discountedProducts
			.map((p) => ({
				...p,
				discountPercent: Math.round(
					((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100
				)
			}))
			.sort((a, b) => b.discountPercent - a.discountPercent)
			.slice(0, 6); // Take top 6 deals

		return {
			flashDeals: sortedDeals.slice(0, 2).map((p) => ({
				id: p.id,
				slug: p.slug,
				title: p.name,
				description: p.shortDescription || p.description?.slice(0, 120) || '',
				originalPrice: p.compareAtPrice!,
				salePrice: p.price,
				discount: p.discountPercent,
				image: p.mainImage,
				validUntil: getRelativeDate(2),
				badge: p.discountPercent >= 30 ? 'Oferta błyskawiczna' : 'Promocja'
			})),
			seasonalDeals: sortedDeals.slice(2, 5).map((p) => ({
				id: p.id,
				slug: p.slug,
				title: p.name,
				description: p.shortDescription || p.description?.slice(0, 120) || '',
				discount: p.discountPercent,
				image: p.mainImage,
				validUntil: getRelativeDate(14),
				href: `/products/${p.slug}`
			})),
			hasMoreDeals: sortedDeals.length > 5
		};
	} catch (error) {
		console.error('Failed to load deals:', error);
		return {
			flashDeals: [],
			seasonalDeals: [],
			hasMoreDeals: false,
			error: 'Wystąpił błąd podczas ładowania promocji.'
		};
	}
}) satisfies PageServerLoad;

function getRelativeDate(daysFromNow: number): string {
	const d = new Date();
	d.setDate(d.getDate() + daysFromNow);
	d.setHours(23, 59, 59, 0);
	return d.toISOString();
}
