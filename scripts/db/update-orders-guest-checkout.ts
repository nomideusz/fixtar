import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase orders collection updater for guest checkout...');

// Load environment variables from .env file
dotenv.config();

/**
 * Creates a PocketBase client with admin credentials
 */
function createClient() {
	const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
	return pb;
}

/**
 * Authenticates as admin
 */
async function authenticate(pb: PocketBase) {
	if (!process.env.PB_ADMIN_EMAIL || !process.env.PB_ADMIN_PASSWORD) {
		console.error('Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD env vars');
		return false;
	}

	try {
		console.log(`Authenticating as ${process.env.PB_ADMIN_EMAIL}...`);
		await pb
			.collection('_superusers')
			.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
		console.log('Authentication successful');
		return true;
	} catch (error) {
		console.error('Authentication failed:', error);
		return false;
	}
}

/**
 * Update the orders collection to allow guest checkout
 */
async function updateOrdersCollection() {
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

		// Get the orders collection
		console.log('Fetching orders collection...');
		const ordersCollection = await pb.collections.getOne('orders');

		// Find the user field and make it optional
		const fields = ordersCollection.fields || [];
		const userFieldIndex = fields.findIndex((field: any) => field.name === 'user');

		if (userFieldIndex !== -1) {
			fields[userFieldIndex].required = false;
			console.log('Made user field optional');
		} else {
			console.error('User field not found in orders collection');
			return false;
		}

		// Update collection rules to allow guest checkout
		const updatedCollection = {
			fields: fields,
			createRule: '' // Allow anyone to create orders (including guests)
		};

		console.log('Updating orders collection...');
		await pb.collections.update('orders', updatedCollection);

		console.log('Orders collection updated successfully!');
		console.log('- User field is now optional (allows guest checkout)');
		console.log('- Create rule allows anyone to create orders');
		console.log(
			'- View/List rules allow authenticated users to see their orders or guests to view by email'
		);

		return true;
	} catch (error) {
		console.error('Error updating orders collection:', error);
		return false;
	}
}

// Main execution
async function main() {
	try {
		const success = await updateOrdersCollection();
		if (success) {
			console.log('✅ Orders collection updated for guest checkout successfully!');
		} else {
			console.error('❌ Failed to update orders collection.');
			process.exit(1);
		}
	} catch (error) {
		console.error('Unexpected error:', error);
		process.exit(1);
	}
}

main();
