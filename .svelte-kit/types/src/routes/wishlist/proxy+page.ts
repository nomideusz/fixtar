// @ts-nocheck
import type { PageLoad } from './$types';

// Simple page loader to ensure this route is recognized by SvelteKit
export const load = async () => {
	return {
		meta: {
			title: 'My Wishlist | FixTar',
			description: 'View and manage your favorite products'
		}
	};
};

;null as any as PageLoad;