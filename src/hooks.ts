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

		console.log('Browser state cleared successfully');
	} catch (error) {
		console.error('Error clearing browser state:', error);
	}
};

/**
 * Checks if the user appears to be logged in based on client-side indicators.
 * Better Auth sets a `better-auth.session_token` cookie.
 */
export const hasSessionClient = (): boolean => {
	if (typeof document === 'undefined') return false;

	try {
		return document.cookie
			.split(';')
			.some((c) => c.trim().startsWith('better-auth.session_token='));
	} catch (e) {
		return false;
	}
};

// Fix for the build error - transports are used for serializing data
export const transport = {};
