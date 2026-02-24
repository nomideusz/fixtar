import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

const DEMO_MODE = env.DEMO_MODE === 'true';

if (!DEMO_MODE) {
	if (!env.POCKETBASE_URL) throw new Error('POCKETBASE_URL is not set');
	if (!env.PB_ADMIN_EMAIL) throw new Error('PB_ADMIN_EMAIL is not set');
	if (!env.PB_ADMIN_PASSWORD) throw new Error('PB_ADMIN_PASSWORD is not set');
}

// For Cloudflare Edge Runtime, we need to create a fresh PocketBase client for each request
// This helps avoid the "Cannot perform I/O on behalf of a different request" error
export function createPocketBaseClient() {
	return new PocketBase(env.POCKETBASE_URL || 'http://localhost:8090');
}

export function isDemoMode() {
	return DEMO_MODE;
}

// Static PocketBase client instance - for non-edge environments
// Avoid using this directly in edge functions (Vercel, Cloudflare Workers)
export const pb = createPocketBaseClient();

// Admin authentication for server-side operations
// Only call this from a backend service, not from edge functions
export async function authenticateAsAdmin() {
	if (DEMO_MODE) {
		console.log('[pb] Demo mode - skipping admin authentication');
		return false;
	}
	try {
		if (process.env.VERCEL_ENV || process.env.CF_PAGES) {
			console.log('[pb] Skipping admin authentication in Edge runtime');
			return false;
		}

		// Since we check for existence above, we can safely assert these are strings
		const adminEmail = env.PB_ADMIN_EMAIL as string;
		const adminPassword = env.PB_ADMIN_PASSWORD as string;
		await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
		console.log('[pb] Admin authentication successful');
		return true;
	} catch (error) {
		console.error('[pb] Failed to authenticate as admin:', error);
		return false;
	}
}

// Initialize admin authentication in non-edge environments
if (!process.env.VERCEL_ENV && !process.env.CF_PAGES) {
	authenticateAsAdmin().then((success) => {
		if (success) {
			console.log('[pb] Admin credentials verified');
		} else {
			console.warn('[pb] Admin authentication failed');
		}
	});
}

/**
 * Initialize sync-related collections in PocketBase
 * Call this function from an admin-only route to ensure collections exist
 */
export async function initSyncCollections() {
	try {
		// Check if sync_sessions collection exists
		let syncSessionExists = false;
		try {
			await pb.collections.getOne('sync_sessions');
			syncSessionExists = true;
		} catch (err) {
			// Collection doesn't exist
		}

		// Create sync_sessions collection if it doesn't exist
		if (!syncSessionExists) {
			await pb.collections.create({
				name: 'sync_sessions',
				type: 'base',
				schema: [
					{
						name: 'type',
						type: 'text',
						required: true,
						options: {
							min: 2,
							max: 50
						}
					},
					{
						name: 'status',
						type: 'select',
						required: true,
						options: {
							maxSelect: 1,
							values: ['pending', 'in_progress', 'completed', 'failed']
						}
					},
					{
						name: 'details',
						type: 'json',
					},
					{
						name: 'logs',
						type: 'json',
					},
					{
						name: 'summary',
						type: 'json',
					},
					{
						name: 'completed',
						type: 'date',
					}
				],
				listRule: "@request.auth.isAdmin = true",
				viewRule: "@request.auth.isAdmin = true",
				createRule: "@request.auth.isAdmin = true",
				updateRule: "@request.auth.isAdmin = true",
				deleteRule: "@request.auth.isAdmin = true",
			});
			
			console.log('Created sync_sessions collection');
		}

		return true;
	} catch (error) {
		console.error('Failed to initialize sync collections:', error);
		return false;
	}
}
