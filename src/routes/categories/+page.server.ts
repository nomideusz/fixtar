import type { PageServerLoad } from './$types';
import { getCategories } from '$lib/server/products';

export const load = (async () => {
	const dbCategories = await getCategories();

	const categories = dbCategories.map((c) => ({
		id: c.category_slug,
		name: c.category,
		slug: c.category_slug,
		description: '',
		image: '',
		featured: false,
		productCount: Number(c.count)
	}));

	return {
		categories,
		featuredCategories: categories.slice(0, 4)
	};
}) satisfies PageServerLoad;
