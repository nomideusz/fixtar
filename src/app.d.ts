// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('better-auth').User | null;
			session: import('better-auth').Session | null;
			isAuthenticated: boolean;
			isBot?: boolean;
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
