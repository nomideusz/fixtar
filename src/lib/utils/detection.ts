/**
 * Environment detection utilities
 */

export function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function isServer(): boolean {
	return typeof window === 'undefined';
}

export function hasDOM(): boolean {
	return isBrowser() && typeof document !== 'undefined' && typeof document.createElement === 'function';
}
