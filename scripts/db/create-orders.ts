import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase orders collection creator...');

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
 * Check if a collection exists
 * @param pb PocketBase client
 * @param name Collection name
 * @returns Boolean indicating if the collection exists
 */
async function collectionExists(pb: PocketBase, name: string): Promise<boolean> {
	try {
		await pb.collections.getOne(name);
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Create the orders collection
 */
async function createOrdersCollection() {
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

		// Check if orders collection already exists
		const exists = await collectionExists(pb, 'orders');
		if (exists) {
			console.log('Collection "orders" already exists. Skipping creation.');
			return true;
		}

		// Get products collection ID if it exists
		let productsId: string | undefined = undefined;
		const productsExists = await collectionExists(pb, 'products');
		if (productsExists) {
			const productsCollection = await pb.collections.getOne('products');
			productsId = productsCollection.id;
		} else {
			console.warn(
				'Products collection does not exist. Product relation fields will be incomplete.'
			);
		}

		console.log('Creating orders collection...');
		const result = await pb.collections.create({
			name: 'orders',
			type: 'base',
			listRule: '@request.auth.id != ""',
			viewRule: '@request.auth.id = user.id || @request.auth.isAdmin = true',
			createRule: '@request.auth.id != ""',
			updateRule: '@request.auth.isAdmin = true',
			deleteRule: '@request.auth.isAdmin = true',
			fields: [
				{
					name: 'orderNumber',
					type: 'text',
					required: true,
					min: 3,
					max: 50
				},
				{
					name: 'user',
					type: 'relation',
					required: true,
					collectionId: '_pb_users_auth_',
					cascadeDelete: false,
					maxSelect: 1,
					displayFields: ['id', 'username', 'email']
				},
				{
					name: 'status',
					type: 'select',
					required: true,
					values: [
						'pending',
						'processing',
						'completed',
						'cancelled',
						'refunded',
						'on_hold',
						'failed'
					]
				},
				{
					name: 'items',
					type: 'json',
					required: true
				},
				{
					name: 'shippingAddress',
					type: 'json',
					required: false
				},
				{
					name: 'billingAddress',
					type: 'json',
					required: false
				},
				{
					name: 'paymentMethod',
					type: 'text',
					required: false
				},
				{
					name: 'paymentDetails',
					type: 'json',
					required: false
				},
				{
					name: 'shippingMethod',
					type: 'text',
					required: false
				},
				{
					name: 'subtotal',
					type: 'number',
					required: true,
					min: 0
				},
				{
					name: 'tax',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'shippingCost',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'discount',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'total',
					type: 'number',
					required: true,
					min: 0
				},
				{
					name: 'notes',
					type: 'text',
					required: false
				},
				{
					name: 'couponCode',
					type: 'text',
					required: false
				},
				{
					name: 'couponDiscount',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'trackingNumber',
					type: 'text',
					required: false
				},
				{
					name: 'dateShipped',
					type: 'date',
					required: false
				},
				{
					name: 'history',
					type: 'json',
					required: false
				},
				{
					name: 'metadata',
					type: 'json',
					required: false
				}
			]
		});

		console.log('Orders collection created successfully!');
		return true;
	} catch (error) {
		console.error('Error creating orders collection:', error);
		console.error(error);
		return false;
	}
}

// Main execution
async function main() {
	try {
		const success = await createOrdersCollection();
		if (success) {
			console.log('✅ Orders collection setup completed successfully!');
		} else {
			console.error('❌ Failed to set up orders collection.');
			process.exit(1);
		}
	} catch (error) {
		console.error('Unexpected error:', error);
		process.exit(1);
	}
}

main();
