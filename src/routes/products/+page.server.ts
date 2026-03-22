import type { PageServerLoad } from './$types';
import { getAllProducts, getCategories, toStoreProduct } from '$lib/server/products';

export const load = (async ({ url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const selectedCategory = url.searchParams.get('category') || '';
	const sortBy = url.searchParams.get('sort') || 'name';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
	const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;
	const inStockOnly = url.searchParams.get('inStock') === 'true';
	const perPage = 20;

	try {
		const [{ products: dbProducts, total: totalItems }, dbCategories] = await Promise.all([
			getAllProducts({
				search: searchQuery || undefined,
				category: selectedCategory || undefined,
				sort: sortBy,
				page,
				perPage,
				minPrice,
				maxPrice,
				inStockOnly
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
			sortBy,
			minPrice,
			maxPrice,
			inStockOnly
		};
	} catch (error) {
		console.error('Failed to load products:', error);
		return {
			products: [],
			categories: [],
			subcategories: [],
			allSubcategories: [],
			totalPages: 0,
			totalItems: 0,
			currentPage: 1,
			searchQuery,
			selectedCategory,
			sortBy,
			minPrice,
			maxPrice,
			inStockOnly,
			error: 'Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.'
		};
	}
}) satisfies PageServerLoad;
