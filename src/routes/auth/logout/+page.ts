import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// We don't need to redirect to the server endpoint as we are now handling the logout
// in the +page.svelte component with a proper UI and user context
export const load: PageLoad = () => {
	return {};
};
