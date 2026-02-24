import { z } from 'zod';
import type PocketBase from 'pocketbase';
import { createPocketBaseClient } from './pocketbase';
import type { RequestEvent } from '@sveltejs/kit';

// Session cookie name
export const SESSION_COOKIE_NAME = 'pb-auth';

// Zod schema for user authentication
export const LoginSchema = z.object({
	identity: z.string().min(1, 'Username or email is required'),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

export const RegisterSchema = z
	.object({
		username: z.string().min(3, 'Username must be at least 3 characters'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		passwordConfirm: z.string().min(8, 'Password confirmation is required')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm']
	});

// Define user type
export type AuthUser = {
	id: string;
	username: string;
	email: string;
	verified: boolean;
	created: string;
	updated: string;
	isAdmin?: boolean;
};

/**
 * Helper function to check if a hostname is a Netlify site
 */
function isNetlifyUrl(hostname: string): boolean {
	return hostname?.endsWith('.netlify.app') || 
		   hostname?.includes('netlify') ||
		   hostname?.includes('-netlify-') ||
		   hostname?.endsWith('.netlify.com');
}

/**
 * Gets the currently authenticated user, if any
 */
export async function getAuthenticatedUser(pb: PocketBase | undefined, locals?: any) {
	if (!pb) return null;

	try {
		// First check if user is provided in locals from hooks
		if (locals?.user) {
			console.log('[auth] Found user in locals:', locals.user.username || 'unknown');
			return locals.user;
		}

		if (!pb.authStore || !pb.authStore.isValid) return null;

		// For serverless/edge environments, skip token refresh
		if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV || process.env.NETLIFY) {
			return pb.authStore.isValid && pb.authStore.record ? pb.authStore.record : null;
		}

		// In development, attempt token refresh
		try {
			await pb.collection('users').authRefresh();
		} catch (refreshError) {
			console.error('Token refresh failed:', refreshError);
		}

		return pb.authStore.record;
	} catch (err) {
		console.error('Error getting authenticated user:', err);
		pb?.authStore?.clear();
		return null;
	}
}

/**
 * Login a user with username/email and password
 */
export async function loginUser(identity: string, password: string, pb?: PocketBase) {
	const client = pb || createPocketBaseClient();

	try {
		// Validate input
		const validData = LoginSchema.parse({ identity, password });

		// Authenticate with PocketBase
		await client.collection('users').authWithPassword(validData.identity, validData.password);

		// Map the user record to our expected type
		const user = client.authStore.record
			? ({
					id: client.authStore.record.id,
					username: client.authStore.record.username,
					email: client.authStore.record.email,
					verified: client.authStore.record.verified,
					created: client.authStore.record.created,
					updated: client.authStore.record.updated,
					isAdmin: client.authStore.record.isAdmin || false
				} as AuthUser)
			: null;

		return {
			success: true,
			user,
			token: client.authStore.token
		};
	} catch (error) {
		console.error('Login failed:', error);
		return {
			success: false,
			error
		};
	}
}

/**
 * Register a new user
 */
export async function registerUser(
	username: string,
	email: string,
	password: string,
	passwordConfirm: string
) {
	const pb = createPocketBaseClient();

	try {
		// Validate input
		const validData = RegisterSchema.parse({ username, email, password, passwordConfirm });

		// Create user in PocketBase
		const result = await pb.collection('users').create({
			username: validData.username,
			email: validData.email,
			password: validData.password,
			passwordConfirm: validData.passwordConfirm
		});

		return { success: true, user: result };
	} catch (error) {
		console.error('Registration failed:', error);
		return { success: false, error };
	}
}

/**
 * Logout the current user
 */
export function logoutUser(pb?: PocketBase) {
	const client = pb || createPocketBaseClient();
	client.authStore.clear();
	return { success: true };
}

/**
 * Set the session token cookie
 */
export function setSessionCookie(event: RequestEvent, token: string) {
	// Set cookie for 30 days
	const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	const isProduction = process.env.NODE_ENV === 'production';
	const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
	const hostname = event.url?.hostname || '';
	const isNetlify = !!process.env.NETLIFY || 
	                   !!process.env.NETLIFY_IMAGES_CDN_DOMAIN || 
	                   !!process.env.NETLIFY_DEPLOY_URL ||
	                   isNetlifyUrl(hostname);
	
	console.log(`[auth] Setting cookies in environment: ${isProduction ? 'production' : 'development'}, Vercel: ${isVercel}, Netlify: ${isNetlify}, Hostname: ${hostname}`);

	// Improved domain detection for production, especially for Vercel and custom domains
	let domain = undefined;
	
	if (isProduction && event.url) {
		// Get host without port
		const hostname = event.url.hostname.split(':')[0];
		
		console.log(`[auth] Setting cookies for hostname: ${hostname}`);
		
		// Don't set domain for localhost
		if (!hostname.includes('localhost')) {
			// For www domains, use the domain as is
			if (hostname.startsWith('www.')) {
				domain = hostname;
				console.log(`[auth] Using full www domain: ${domain}`);
			} else if (hostname.includes('.')) {
				domain = hostname;
				console.log(`[auth] Using domain: ${domain}`);
			}
		}
	}

	// For Vercel deployments, special cookie settings to handle preview URLs
	// For Netlify, use standard lax settings but ensure secure flag in production
	const sameSite = isVercel ? 'none' : 'lax';
	// Force secure for Netlify in production regardless of protocol
	const useSecure = isProduction && (isVercel || isNetlify || event.url.protocol === 'https:');
	
	// Log the cookie options we're about to use
	console.log(`[auth] Setting cookie with options:`, 
		JSON.stringify({
			path: '/',
			domain,
			sameSite,
			secure: useSecure,
			httpOnly: true,
			expires: expires.toISOString(),
			token: token ? `${token.substring(0, 10)}...` : 'none'
		})
	);

	// Set the auth cookie using explicit options to avoid TypeScript issues
	event.cookies.set(SESSION_COOKIE_NAME, token, {
		path: '/',
		domain,
		sameSite: isVercel ? 'none' : 'lax',
		secure: useSecure,
		httpOnly: true,
		expires
	});

	// Set a non-httpOnly helper cookie for client-side detection
	event.cookies.set(`${SESSION_COOKIE_NAME}_exists`, 'true', {
		path: '/',
		domain,
		sameSite: isVercel ? 'none' : 'lax',
		secure: useSecure,
		httpOnly: false,
		expires
	});
	
	// Log cookie setting result
	console.log(`[auth] Session cookies set for domain: ${domain || 'default'} with SameSite=${sameSite}, secure=${useSecure}`);
}

/**
 * Set session cookie using separate cookies and URL objects
 * Useful for API routes that need more flexibility
 */
export function setSessionCookieWithParams(cookies: any, url: URL, token: string) {
	// Set cookie for 30 days
	const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
	
	const isProduction = process.env.NODE_ENV === 'production';
	const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
	const hostname = url?.hostname || '';
	const isNetlify = !!process.env.NETLIFY || 
	                   !!process.env.NETLIFY_IMAGES_CDN_DOMAIN || 
	                   !!process.env.NETLIFY_DEPLOY_URL ||
	                   isNetlifyUrl(hostname);
	
	console.log(`[auth] Setting cookies in environment: ${isProduction ? 'production' : 'development'}, Vercel: ${isVercel}, Netlify: ${isNetlify}, Hostname: ${hostname}`);

	// Improved domain detection for production, especially for Vercel and custom domains
	let domain = undefined;
	
	if (isProduction) {
		// Get host without port
		const hostname = url.hostname.split(':')[0];
		
		console.log(`[auth] Setting cookies for hostname: ${hostname}`);
		
		// Don't set domain for localhost
		if (!hostname.includes('localhost')) {
			// For www domains, use the domain as is
			if (hostname.startsWith('www.')) {
				domain = hostname;
				console.log(`[auth] Using full www domain: ${domain}`);
			} else if (hostname.includes('.')) {
				domain = hostname;
				console.log(`[auth] Using domain: ${domain}`);
			}
		}
	}
	
	// For Vercel deployments, special cookie settings to handle preview URLs
	// For Netlify, use standard lax settings but ensure secure flag in production
	const sameSite = isVercel ? 'none' : 'lax';
	// Force secure for Netlify in production regardless of protocol
	const useSecure = isProduction && (isVercel || isNetlify || url.protocol === 'https:');
	
	// Log the cookie options we're about to use
	console.log(`[auth] Setting cookie with options:`, 
		JSON.stringify({
			path: '/',
			domain,
			sameSite,
			secure: useSecure,
			httpOnly: true,
			expires: expires.toISOString(),
			token: token ? `${token.substring(0, 10)}...` : 'none'
		})
	);

	// Set the auth cookie using explicit options to avoid TypeScript issues
	cookies.set(SESSION_COOKIE_NAME, token, {
		path: '/',
		domain,
		sameSite: isVercel ? 'none' : 'lax',
		secure: useSecure,
		httpOnly: true,
		expires
	});

	// Set a non-httpOnly helper cookie for client-side detection
	cookies.set(`${SESSION_COOKIE_NAME}_exists`, 'true', {
		path: '/',
		domain,
		sameSite: isVercel ? 'none' : 'lax',
		secure: useSecure,
		httpOnly: false,
		expires
	});
	
	// Log cookie setting result
	console.log(`[auth] Session cookies set for domain: ${domain || 'default'} with SameSite=${sameSite}, secure=${useSecure}`);
}

/**
 * Delete the session cookie
 */
export function deleteSessionCookie(event: RequestEvent) {
	console.log('[auth] Deleting session cookies');

	try {
		const isProduction = process.env.NODE_ENV === 'production';
		const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
		const hostname = event.url?.hostname || '';
		const isNetlify = !!process.env.NETLIFY || 
		                 !!process.env.NETLIFY_IMAGES_CDN_DOMAIN || 
		                 !!process.env.NETLIFY_DEPLOY_URL ||
                     isNetlifyUrl(hostname);
		
		// Get the hostname from request for domain
		let domain = undefined;
		
		// URL can be accessed differently in different SvelteKit versions
		const url = event.url || (event as any)?.request?.url || null;
		
		if (isProduction && url) {
			let hostname;
			
			// Handle both URL objects and string URLs
			if (typeof url === 'string') {
				try {
					hostname = new URL(url).hostname.split(':')[0];
				} catch (e) {
					console.error('[auth] Invalid URL string:', url);
					hostname = '';
				}
			} else {
				hostname = url.hostname.split(':')[0];
			}
			
			console.log(`[auth] Deleting cookies for hostname: ${hostname}`);
			
			if (!hostname.includes('localhost')) {
				if (hostname.startsWith('www.')) {
					domain = hostname;
					console.log(`[auth] Using www domain: ${domain}`);
				} else if (hostname.includes('.')) {
					domain = hostname;
					console.log(`[auth] Using domain: ${domain}`);
				}
			}
		}
		
		// For Vercel deployments with custom domains, use permissive cookie settings 
		// We need to explicitly type these values for TypeScript
		const sameSite = isVercel ? 'none' : 'lax';
		// Force secure for Netlify in production regardless of protocol
		const useSecure = isProduction && (isVercel || isNetlify || (url && typeof url !== 'string' && url.protocol === 'https:'));

		// Using type assertion to satisfy TypeScript
		const baseOptions = {
			path: '/',
			domain,
			sameSite,
			secure: useSecure
		} as const;
		
		console.log(`[auth] Cookie deletion options:`, JSON.stringify({
			...baseOptions,
			sameSite,
			secure: useSecure
		}));

		// Delete main auth cookie with explicit sameSite value
		event.cookies.delete(SESSION_COOKIE_NAME, {
			path: '/',
			domain,
			sameSite: isVercel ? 'none' : 'lax',
			secure: useSecure
		});
		console.log(`[auth] Deleted cookie ${SESSION_COOKIE_NAME}`);

		// Delete helper cookie
		event.cookies.delete(`${SESSION_COOKIE_NAME}_exists`, {
			path: '/',
			domain,
			sameSite: isVercel ? 'none' : 'lax',
			secure: useSecure
		});
		console.log(`[auth] Deleted cookie ${SESSION_COOKIE_NAME}_exists`);

		// Try to delete with different paths just to be sure
		const paths = ['/', '/auth', '/api', '/account'];
		for (const path of paths) {
			try {
				event.cookies.delete(SESSION_COOKIE_NAME, { 
					path,
					domain,
					sameSite: isVercel ? 'none' : 'lax',
					secure: useSecure
				});
				event.cookies.delete(`${SESSION_COOKIE_NAME}_exists`, { 
					path,
					domain,
					sameSite: isVercel ? 'none' : 'lax',
					secure: useSecure
				});
			} catch (e) {
				// Ignore errors for additional paths
			}
		}

		// Force browser to clear cookie by setting immediate expiry
		event.cookies.set(SESSION_COOKIE_NAME, '', {
			path: '/',
			domain,
			sameSite: isVercel ? 'none' : 'lax',
			secure: useSecure,
			expires: new Date(0),
			maxAge: 0
		});
		
		// Also clear the helper cookie with same settings
		event.cookies.set(`${SESSION_COOKIE_NAME}_exists`, '', {
			path: '/',
			domain,
			sameSite: isVercel ? 'none' : 'lax',
			secure: useSecure,
			expires: new Date(0),
			maxAge: 0
		});

		// Log all cookies after deletion - safely access headers
		try {
			if (event.request && event.request.headers) {
				console.log(
					'[auth] Cookies after deletion:',
					event.request.headers.get('cookie') || 'no cookies'
				);
			} else {
				console.log('[auth] Cookies after deletion: Unable to access request headers');
			}
		} catch (headerError) {
			console.log('[auth] Could not read request headers:', headerError);
		}
	} catch (e) {
		console.error('[auth] Error deleting cookies:', e);
	}
}

/**
 * Validate the current session token
 */
export async function validateSession(token: string) {
	const pb = createPocketBaseClient();

	try {
		if (!token) return { user: null, token: null, isValid: false };

		// Set token in auth store
		pb.authStore.save(token, null);

		// Check if token is valid
		if (!pb.authStore.isValid) return { user: null, token: null, isValid: false };

		console.log('[auth] Auth record in store after token validation:', pb.authStore.record);

		// Skip token refresh in production
		if (process.env.NODE_ENV === 'production') {
			// Just use current record if available
			if (pb.authStore.record) {
				const user = {
					id: pb.authStore.record.id,
					username: pb.authStore.record.username,
					email: pb.authStore.record.email,
					verified: pb.authStore.record.verified || false,
					created: pb.authStore.record.created,
					updated: pb.authStore.record.updated,
					isAdmin: pb.authStore.record.isAdmin || false
				} as AuthUser;

				console.log('[auth] Mapped user from AuthStore:', user);
				return { user, token, isValid: true };
			}
		} else {
			// In development, verify with server
			try {
				await pb.collection('users').authRefresh();
				console.log('[auth] Auth refreshed successfully');
			} catch (error) {
				// If refresh fails but token was valid, accept it
				console.error('[auth] Auth refresh failed:', error);
			}
		}

		// Get user from auth store
		if (!pb.authStore.record) {
			console.log('[auth] No record in auth store after validation');
			return { user: null, token: null, isValid: false };
		}

		// Raw record for debugging
		console.log('[auth] Raw record from auth store:', pb.authStore.record);

		// Try to extract user data safely
		const user = {
			id: pb.authStore.record.id || '',
			username: pb.authStore.record.username || 'unknown',
			email: pb.authStore.record.email || '',
			verified: pb.authStore.record.verified || false,
			created: pb.authStore.record.created || new Date().toISOString(),
			updated: pb.authStore.record.updated || new Date().toISOString(),
			isAdmin: pb.authStore.record.isAdmin || false
		} as AuthUser;

		console.log('[auth] Final mapped user:', user);
		return { user, token, isValid: !!user.id };
	} catch (error) {
		console.error('[auth] Session validation failed:', error);
		pb.authStore.clear();
		return { user: null, token: null, isValid: false };
	}
}
