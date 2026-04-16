import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';

export const load = (async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const sortBy = url.searchParams.get('sort') || 'name';
	const inStockOnly = url.searchParams.get('stock') === '1';
	const categoryIsolate = url.searchParams.get('category') || '';

	try {
		const [{ products: allDbProducts }, dbCategories] = await Promise.all([
			getAllProducts({
				search: searchQuery || undefined,
				sort: sortBy,
				inStockOnly,
				page: 1,
				perPage: 500
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
			if (!productsByCategory[catSlug]) productsByCategory[catSlug] = [];
			productsByCategory[catSlug].push(product);
		}

		// Build ordered category sections, using the filtered count (not total DB count)
		const allSections = categories
			.filter((cat) => productsByCategory[cat.slug]?.length > 0)
			.map((cat) => ({
				category: { ...cat, productCount: productsByCategory[cat.slug]!.length },
				products: productsByCategory[cat.slug] || []
			}));

		// Category isolate: show only one section for content, but keep full chip list
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
			totalItems: categorySections.reduce((n, s) => n + s.products.length, 0)
		};
	} catch (error) {
		console.error('Failed to load products:', error);
		return {
			categorySections: [],
			chipSections: [],
			categories: [],
			searchQuery,
			sortBy,
			inStockOnly,
			categoryIsolate,
			totalItems: 0,
			error: 'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.'
		};
	}
}) satisfies PageServerLoad;
