import type { LayoutServerLoad } from './$types';
import { getCategories } from '$lib/server/products';

export const load: LayoutServerLoad = async ({ locals }) => {
	const dbCategories = await getCategories();
	const categories = dbCategories.map((c) => ({
		id: c.category_slug,
		name: c.category,
		slug: c.category_slug,
		count: Number(c.count)
	}));

	return {
		user: locals.user ?? null,
		isAuthenticated: locals.isAuthenticated ?? false,
		categories
	};
};
