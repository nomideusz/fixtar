import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase collections lister...');

// Load environment variables from .env file
dotenv.config();
console.log('Environment loaded, PB URL:', process.env.POCKETBASE_URL);

/**
 * List PocketBase collections with various options for filtering and sorting
 */

/**
 * Creates a PocketBase client with admin credentials
 */
function createClient() {
	// We need to load env vars manually in scripts
	const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
	return pb;
}

/**
 * Authenticates as admin
 */
async function authenticate(pb: PocketBase) {
	if (!process.env.PB_ADMIN_EMAIL || !process.env.PB_ADMIN_PASSWORD) {
		console.warn('Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD env vars');
		console.log('Environment variables loaded:');
		Object.keys(process.env)
			.filter((k) => !k.includes('SECRET') && !k.includes('KEY'))
			.forEach((key) => {
				console.log(`  ${key}: ${process.env[key] ? '✓' : '✗'}`);
			});
		return false;
	}

	try {
		console.log(`Authenticating as ${process.env.PB_ADMIN_EMAIL}...`);
		await pb
			.collection('_superusers')
			.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
		return true;
	} catch (error) {
		console.error('Authentication failed:', error);
		return false;
	}
}

/**
 * Get a paginated list of collections
 * @param pb PocketBase client instance
 * @param page Page number (default: 1)
 * @param perPage Items per page (default: 30)
 * @param filter Filter expression (optional)
 * @param sort Sort expression (optional)
 * @returns Paginated list of collections
 */
export async function getCollectionsList(
	pb: PocketBase,
	page: number = 1,
	perPage: number = 30,
	filter?: string,
	sort?: string
) {
	const options: Record<string, any> = {};

	if (filter) options.filter = filter;
	if (sort) options.sort = sort;

	return await pb.collections.getList(page, perPage, options);
}

/**
 * Get all collections at once
 * @param pb PocketBase client instance
 * @param sort Sort expression (optional)
 * @param filter Filter expression (optional)
 * @returns Full list of collections
 */
export async function getAllCollections(pb: PocketBase, sort?: string, filter?: string) {
	const options: Record<string, any> = {};

	if (filter) options.filter = filter;
	if (sort) options.sort = sort;

	return await pb.collections.getFullList(options);
}

/**
 * Get the first collection that matches a filter
 * @param pb PocketBase client instance
 * @param filter Filter expression
 * @returns First matching collection
 */
export async function getFirstCollection(pb: PocketBase, filter: string) {
	return await pb.collections.getFirstListItem(filter);
}

/**
 * Example usage
 */
async function listCollections() {
	try {
		console.log(
			`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`
		);

		// Create and authenticate client
		const pb = createClient();
		const authenticated = await authenticate(pb);

		if (!authenticated) {
			console.error('Failed to authenticate. Check your credentials in .env file.');
			return null;
		}

		console.log('Authentication successful! Fetching collections...');

		// Get all collections sorted by creation date (descending)
		const allCollections = await getAllCollections(pb, '-created');
		console.log(`\nFound ${allCollections.length} collections:`);

		// Print each collection with its key details
		allCollections.forEach((collection) => {
			console.log(`- ${collection.name} (${collection.type}): ${collection.id}`);
		});

		return allCollections;
	} catch (error) {
		console.error('Error listing collections:', error);
		throw error;
	}
}

// Always run the collection listing
console.log('Running listCollections...');
listCollections()
	.then((collections) => {
		if (collections) {
			console.log('Successfully retrieved collections');
		} else {
			console.log('Failed to retrieve collections');
		}
		process.exit(0);
	})
	.catch((err) => {
		console.error('Error in listCollections:', err);
		process.exit(1);
	});

/**
 * API Reference
 *
 * Query parameters:
 * - page: The page number (default: 1)
 * - perPage: Items per page (default: 30)
 * - sort: Sort fields (e.g., '-created,id' for DESC by created and ASC by id)
 *   Supported: @random, id, created, updated, name, type, system
 * - filter: Filter expression (e.g., 'name~"user" && created>"2022-01-01"')
 *   Supported fields: id, created, updated, name, type, system
 *
 * Filter operators:
 * = Equal
 * != NOT equal
 * > Greater than
 * >= Greater than or equal
 * < Less than
 * <= Less than or equal
 * ~ Like/Contains
 * !~ NOT Like/Contains
 * ?= Any/At least one of Equal
 * ?!= Any/At least one of NOT equal
 * ?> Any/At least one of Greater than
 * ?>= Any/At least one of Greater than or equal
 * ?< Any/At least one of Less than
 * ?<= Any/At least one of Less than or equal
 * ?~ Any/At least one of Like/Contains
 * ?!~ Any/At least one of NOT Like/Contains
 *
 * Group expressions with parentheses (...), && (AND), || (OR)
 */
