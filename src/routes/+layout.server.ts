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

	const user = locals.user;
	return {
		user: user
			? {
					id: user.id,
					username: user.name || '',
					email: user.email || '',
					isAdmin: (user as any).isAdmin ?? false
				}
			: null,
		isAuthenticated: locals.isAuthenticated ?? false,
		categories
	};
};
