import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase collection updater...');

// Load environment variables from .env file
dotenv.config();
console.log('Environment loaded, PB URL:', process.env.POCKETBASE_URL);

/**
 * Creates a PocketBase client with admin credentials
 */
function createClient() {
	// Load PocketBase URL from env vars or use default
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
 * Update a collection by ID or name
 * @param pb PocketBase client instance
 * @param idOrName Collection ID or name
 * @param data Update data
 * @returns The updated collection or null on failure
 */
export async function updateCollection(
	pb: PocketBase,
	idOrName: string,
	data: Record<string, any>
) {
	try {
		console.log(`Updating collection "${idOrName}"...`);
		return await pb.collections.update(idOrName, data);
	} catch (error) {
		console.error(`Error updating collection "${idOrName}":`, error);
		return null;
	}
}

/**
 * Example: Update a collection
 */
async function updateExampleCollection() {
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

		// Get collection name and update field from command line arguments
		const collectionName = process.argv[2];
		const updateField = process.argv[3];
		const updateValue = process.argv[4];

		if (!collectionName) {
			console.error('Please provide a collection name as an argument');
			console.log('Usage: npm run update-collection -- <name> [field] [value]');
			console.log('Examples:');
			console.log('  npm run update-collection -- users');
			console.log('  npm run update-collection -- posts listRule "id = @request.auth.id"');
			return null;
		}

		// First, get the current collection details
		try {
			const collection = await pb.collections.getOne(collectionName);
			console.log(`\nFound collection "${collectionName}":`);
			console.log(`- ID: ${collection.id}`);
			console.log(`- Name: ${collection.name}`);
			console.log(`- Type: ${collection.type}`);

			// If update field and value are provided, update the collection
			if (updateField && updateValue) {
				const updateData: Record<string, any> = {};
				updateData[updateField] = updateValue;

				console.log(`\nUpdating ${updateField} to "${updateValue}"...`);

				const updated = await updateCollection(pb, collectionName, updateData);

				if (updated) {
					console.log('\nCollection updated successfully:');
					console.log(`- ID: ${updated.id}`);
					console.log(`- Name: ${updated.name}`);
					console.log(`- ${updateField}: ${updated[updateField]}`);
					return updated;
				} else {
					console.error(`Failed to update collection "${collectionName}"`);
					return null;
				}
			}

			return collection;
		} catch (error) {
			console.error(`Collection "${collectionName}" not found:`, error);
			return null;
		}
	} catch (error) {
		console.error('Error updating collection:', error);
		throw error;
	}
}

// Run the collection updater
console.log('Running updateExampleCollection...');
updateExampleCollection()
	.then((collection) => {
		if (collection) {
			console.log('\nOperation completed successfully');
		} else {
			console.log('\nOperation failed');
		}
		process.exit(collection ? 0 : 1);
	})
	.catch((err) => {
		console.error('Error in updateExampleCollection:', err);
		process.exit(1);
	});

/**
 * API Reference
 *
 * PATCH /api/collections/{collectionIdOrName}
 *
 * Path parameters:
 * - collectionIdOrName: ID or name of the collection to update
 *
 * Body Parameters:
 * {
 *   "name": "string (required)", // Unique collection name
 *   "type": "base|view|auth", // Collection type (cannot be changed after creation)
 *   "fields": [ // Optional for "view" collections (auto-populated from viewQuery)
 *     {
 *       "name": "string",
 *       "type": "text|number|bool|email|url|date|select|relation|file|...",
 *       "required": boolean,
 *       "unique": boolean,
 *       "options": {}
 *     }
 *   ],
 *   "indexes": ["string"], // Collection indexes (not for "view" collections)
 *
 *   // API rules
 *   "listRule": "string|null",
 *   "viewRule": "string|null",
 *   "createRule": "string|null",
 *   "updateRule": "string|null",
 *   "deleteRule": "string|null",
 *
 *   // View options
 *   "viewQuery": "string (required for view collections)",
 *
 *   // Auth options
 *   "manageRule": "string|null",
 *   "authRule": "string|null",
 *   "passwordAuth": {
 *     "enabled": boolean,
 *     "identityFields": ["string"]
 *   }
 *   // Additional auth options available...
 * }
 */
