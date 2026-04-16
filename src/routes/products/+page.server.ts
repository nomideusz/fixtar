import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';
import {
	CATALOG_BRANDS,
	detectCatalogBrandSlug,
	productMatchesBrandSlug,
	type CatalogBrandSlug
} from '$lib/config/catalog-brands';

const PER_PAGE = 120;

function parsePriceTier(tier: string | null): { minPrice?: number; maxPrice?: number } {
	switch (tier) {
		case 'low':
			return { maxPrice: 300 };
		case 'mid':
			return { minPrice: 300, maxPrice: 800 };
		case 'high':
			return { minPrice: 800 };
		default:
			return {};
	}
}

export const load = (async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const sortBy = url.searchParams.get('sort') || 'name';
	const inStockOnly = url.searchParams.get('stock') === '1';
	const categoryParam = url.searchParams.get('category') || '';
	const isolate = url.searchParams.get('isolate') === '1';
	const categoryIsolate = isolate && categoryParam ? categoryParam : '';
	const brandSlug = (url.searchParams.get('brand') || '').toLowerCase();
	const priceTier = url.searchParams.get('price') || '';
	const { minPrice, maxPrice } = parsePriceTier(priceTier);

	const brandFilter: CatalogBrandSlug | null = CATALOG_BRANDS.some((b) => b.slug === brandSlug)
		? (brandSlug as CatalogBrandSlug)
		: null;

	try {
		const [{ products: allDbProducts }, dbCategories] = await Promise.all([
			getAllProducts({
				search: searchQuery || undefined,
				sort: sortBy,
				inStockOnly,
				minPrice,
				maxPrice,
				page: 1,
				perPage: PER_PAGE
			}),
			getCategories()
		]);

		let allProducts = allDbProducts.map(toStoreProduct);

		const brandCounts: Record<string, number> = {};
		for (const b of CATALOG_BRANDS) brandCounts[b.slug] = 0;
		for (const p of allProducts) {
			const slug = detectCatalogBrandSlug(p.name);
			if (slug) brandCounts[slug] = (brandCounts[slug] ?? 0) + 1;
		}

		const brandsFacet = CATALOG_BRANDS.map((b) => ({
			slug: b.slug,
			label: b.label,
			count: brandCounts[b.slug] ?? 0
		})).filter((x) => x.count > 0);

		if (brandFilter) {
			allProducts = allProducts.filter((p) => productMatchesBrandSlug(p.name, brandFilter));
		}

		const categories = dbCategories.map((c) => ({
			id: c.category_slug,
			name: c.category,
			slug: c.category_slug,
			image: '',
			productCount: Number(c.count)
		}));

		const productsByCategory: Record<string, typeof allProducts> = {};
		for (const product of allProducts) {
			const catSlug = product.categories?.[0] || 'inne';
			if (!productsByCategory[catSlug]) productsByCategory[catSlug] = [];
			productsByCategory[catSlug].push(product);
		}

		const allSections = categories
			.filter((cat) => productsByCategory[cat.slug]?.length > 0)
			.map((cat) => ({
				category: { ...cat, productCount: productsByCategory[cat.slug]!.length },
				products: productsByCategory[cat.slug] || []
			}));

		const categorySections = categoryIsolate
			? allSections.filter((s) => s.category.slug === categoryIsolate)
			: allSections;

		const chipSections = allSections;

		return {
			categorySections,
			chipSections,
			categories,
			searchQuery,
			sortBy,
			inStockOnly,
			categoryIsolate,
			categoryScrollTo: categoryParam && !categoryIsolate ? categoryParam : '',
			isolateMode: Boolean(categoryIsolate),
			brandSlug: brandFilter || '',
			brandsFacet,
			priceTier: priceTier || '',
			totalItems: categorySections.reduce((n, s) => n + s.products.length, 0)
		};
	} catch (error) {
		console.error('Failed to load products:', error);
		return {
			categorySections: [],
			chipSections: [],
			categories: [],
			brandsFacet: [],
			searchQuery,
			sortBy,
			inStockOnly,
			categoryIsolate: '',
			categoryScrollTo: '',
			isolateMode: false,
			brandSlug: '',
			priceTier: '',
			totalItems: 0,
			error: 'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.'
		};
	}
}) satisfies PageServerLoad;
