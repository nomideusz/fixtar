import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

console.log('Starting PocketBase collection importer...');

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
 * Import collections from a configuration object
 * @param pb PocketBase client instance
 * @param collections Collection configuration array
 * @param deleteMissing Whether to delete missing collections
 * @returns Success status
 */
export async function importCollections(
	pb: PocketBase,
	collections: any[],
	deleteMissing: boolean = false
): Promise<boolean> {
	try {
		console.log(`Importing ${collections.length} collections (deleteMissing=${deleteMissing})...`);
		await pb.collections.import(collections, deleteMissing);
		console.log('Collections imported successfully');
		return true;
	} catch (error) {
		console.error('Error importing collections:', error);
		return false;
	}
}

/**
 * Import collections from a JSON file
 */
async function importCollectionsFromFile() {
	try {
		console.log(
			`Connecting to PocketBase at ${process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'}...`
		);

		// Create and authenticate client
		const pb = createClient();
		const authenticated = await authenticate(pb);

		if (!authenticated) {
			console.error('Failed to authenticate. Check your credentials in .env file.');
			return false;
		}

		// Get file path and delete flag from command line arguments
		const filePath = process.argv[2];
		const deleteMissing = process.argv.includes('--delete-missing');

		if (!filePath) {
			console.error('Please provide a collections JSON file path');
			console.log('Usage: npm run import-collections -- <file-path> [--delete-missing]');
			console.log('Example: npm run import-collections -- ./collections.json');
			return false;
		}

		// Read the collections definition file
		let collectionsData;
		try {
			const resolvedPath = path.resolve(process.cwd(), filePath);
			console.log(`Reading collections from ${resolvedPath}...`);
			const fileContent = fs.readFileSync(resolvedPath, 'utf8');
			collectionsData = JSON.parse(fileContent);
		} catch (error) {
			console.error(`Error reading collections file: ${filePath}`, error);
			return false;
		}

		if (!Array.isArray(collectionsData)) {
			console.error('Invalid collections data: Expected an array of collections');
			return false;
		}

		console.log(`Found ${collectionsData.length} collections in file`);

		// Warn if delete-missing is enabled
		if (deleteMissing) {
			console.log('\nWARNING: You are using --delete-missing flag');
			console.log(
				'This will DELETE ALL existing collections and fields that are not in the imported file!'
			);
			console.log('To continue, add the --confirm flag');

			const confirmed = process.argv.includes('--confirm');
			if (!confirmed) {
				console.log('Operation aborted. Add --confirm flag to proceed with risky deletion.');
				return false;
			}
		}

		// Import the collections
		const success = await importCollections(pb, collectionsData, deleteMissing);
		return success;
	} catch (error) {
		console.error('Error in import process:', error);
		return false;
	}
}

// Run the collection importer
console.log('Running importCollectionsFromFile...');
importCollectionsFromFile()
	.then((success) => {
		console.log(success ? '\nCollections imported successfully' : '\nFailed to import collections');
		process.exit(success ? 0 : 1);
	})
	.catch((err) => {
		console.error('Error in importCollectionsFromFile:', err);
		process.exit(1);
	});

/**
 * API Reference
 *
 * PUT /api/collections/import
 *
 * Body Parameters:
 * collections Array<Collection> - List of collections to import (replace and create)
 * deleteMissing Boolean (optional) - If true, existing collections and schema fields
 *                                   not present in the import will be deleted
 *                                   (default: false)
 *
 * Requires admin authentication
 * This is a powerful operation that can delete data if deleteMissing=true
 */
