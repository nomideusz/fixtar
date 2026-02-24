/**
 * Client-side hooks for SvelteKit
 *
 * These hooks run in the browser and help with navigation and state management.
 */
export declare const reroute: (request: Request) => string;
/**
 * Utility to create a URL with a timestamp to prevent caching
 * Useful for logout and authentication flows
 */
export declare const nonCachedUrl: (url: string) => string;
/**
 * Utility to clear sensitive data from local storage and cookies
 * Useful for logout functions
 */
export declare const clearBrowserState: () => void;
/**
 * Checks if the user appears to be logged in based on client-side indicators
 */
export declare const hasSessionClient: () => boolean;
export declare const transport: {};
