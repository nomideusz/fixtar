import type { PageServerLoad } from './$types';
import type { Product } from '$lib/stores/products.svelte';
import { mockProducts, mockCategories } from '$lib/data/mockData';

export const load = (async ({ url }) => {
	// TODO: Replace with BaseLinker API integration once PocketBase is fully removed.
	const searchQuery = url.searchParams.get('search') || '';
	const selectedCategory = url.searchParams.get('category') || '';
	const sortBy = url.searchParams.get('sort') || 'name';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const perPage = 20;

	// Map mock products to Product shape
	let products = mockProducts.map((p) => ({
		...p,
		slug: p.id,
		mainImage: p.image,
		images: [p.image],
		categories: [p.category],
		status: 'active' as const,
		inventory: { trackQuantity: true, quantity: 10 }
	})) as unknown as Product[];

	// Filter by search
	if (searchQuery) {
		const q = searchQuery.toLowerCase();
		products = products.filter(
			(p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q)
		);
	}

	// Filter by category
	if (selectedCategory) {
		products = products.filter((p) => p.categories?.includes(selectedCategory));
	}

	// Sort
	if (sortBy === 'price-asc') {
		products.sort((a, b) => a.price - b.price);
	} else if (sortBy === 'price-desc') {
		products.sort((a, b) => b.price - a.price);
	} else {
		products.sort((a, b) => a.name.localeCompare(b.name));
	}

	const totalItems = products.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
	const currentPage = Math.min(page, totalPages);
	products = products.slice((currentPage - 1) * perPage, currentPage * perPage);

	// Build categories with slug and productCount
	const categories = mockCategories.map((c) => ({
		id: c.id,
		name: c.name,
		slug: c.id,
		image: c.image,
		productCount: mockProducts.filter((p) => p.category === c.id).length
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
		sortBy
	};
}) satisfies PageServerLoad;
