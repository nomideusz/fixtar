/**
 * Client-side hooks for SvelteKit
 *
 * These hooks run in the browser and help with navigation and state management.
 */

// Simple function to extract pathname from URL
export const reroute = (request: Request): string => new URL(request.url).pathname;

/**
 * Utility to create a URL with a timestamp to prevent caching
 * Useful for logout and authentication flows
 */
export const nonCachedUrl = (url: string): string => {
	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}t=${Date.now()}`;
};

/**
 * Utility to clear sensitive data from local storage and cookies
 * Useful for logout functions
 */
export const clearBrowserState = (): void => {
	try {
		// Clear user data
		localStorage.removeItem('user_data');
		sessionStorage.removeItem('user_data');

		// Clear any PocketBase related data
		localStorage.removeItem('pocketbase_auth');
		sessionStorage.removeItem('pocketbase_auth');

		// Clear any cookie detection markers
		document.cookie = 'pb-auth_exists=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

		console.log('Browser state cleared successfully');
	} catch (error) {
		console.error('Error clearing browser state:', error);
	}
};

/**
 * Checks if the user appears to be logged in based on client-side indicators
 */
export const hasSessionClient = (): boolean => {
	if (typeof document === 'undefined') return false;

	try {
		// Check for user data in localStorage
		const userData = localStorage.getItem('user_data');
		if (userData && userData !== 'null') return true;

		// Check for session cookie existence marker
		return document.cookie.split(';').some((c) => c.trim().startsWith('pb-auth_exists='));
	} catch (e) {
		return false;
	}
};

// Fix for the build error - transports are used for serializing data
export const transport = {};
