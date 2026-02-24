// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/pb-auth').PocketBaseUser | null;
			token: string | null;
			isAuthenticated: boolean;
			pb: import('pocketbase').default;
			isBot?: boolean; // Added for bot detection in hooks
		}
	}
}

// Add type declaration for .md imports
declare module '*.md' {
	import type { ComponentType } from 'svelte';
	const component: ComponentType;
	export default component;
}

export {};
