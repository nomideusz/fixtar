import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('Starting PocketBase coupons collection creator...');

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
 * Create the coupons collection
 */
async function createCouponsCollection() {
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

		// Check if coupons collection already exists
		const exists = await collectionExists(pb, 'coupons');
		if (exists) {
			console.log('Collection "coupons" already exists. Skipping creation.');
			return true;
		}

		// Check for products and categories collections to use for relations
		const productsExists = await collectionExists(pb, 'products');
		const categoriesExists = await collectionExists(pb, 'categories');

		let productsId: string | undefined = undefined;
		let categoriesId: string | undefined = undefined;

		if (productsExists) {
			const productsCollection = await pb.collections.getOne('products');
			productsId = productsCollection.id;
		} else {
			console.warn('Products collection does not exist. Some relation fields will be incomplete.');
		}

		if (categoriesExists) {
			const categoriesCollection = await pb.collections.getOne('categories');
			categoriesId = categoriesCollection.id;
		} else {
			console.warn(
				'Categories collection does not exist. Some relation fields will be incomplete.'
			);
		}

		console.log('Creating coupons collection...');
		const result = await pb.collections.create({
			name: 'coupons',
			type: 'base',
			listRule: '@request.auth.id != ""', // Authenticated users can list
			viewRule: '@request.auth.id != ""', // Authenticated users can view
			createRule: '@request.auth.isAdmin = true', // Only admins can create
			updateRule: '@request.auth.isAdmin = true', // Only admins can update
			deleteRule: '@request.auth.isAdmin = true', // Only admins can delete
			fields: [
				{
					name: 'code',
					type: 'text',
					required: true,
					min: 3,
					max: 30
				},
				{
					name: 'description',
					type: 'text',
					required: false,
					max: 200
				},
				{
					name: 'type',
					type: 'select',
					required: true,
					values: ['percentage', 'fixed_amount', 'free_shipping']
				},
				{
					name: 'value',
					type: 'number',
					required: true,
					min: 0
				},
				{
					name: 'minimumPurchase',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'status',
					type: 'select',
					required: true,
					values: ['active', 'inactive', 'expired']
				},
				{
					name: 'validFrom',
					type: 'date',
					required: true
				},
				{
					name: 'validTo',
					type: 'date',
					required: false
				},
				{
					name: 'usageLimit',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'usageCount',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'perUserLimit',
					type: 'number',
					required: false,
					min: 0
				},
				...(productsId
					? [
							{
								name: 'applicableProducts',
								type: 'relation',
								required: false,
								collectionId: productsId,
								cascadeDelete: false,
								maxSelect: 0, // Unlimited
								displayFields: ['name']
							},
							{
								name: 'excludedProducts',
								type: 'relation',
								required: false,
								collectionId: productsId,
								cascadeDelete: false,
								maxSelect: 0, // Unlimited
								displayFields: ['name']
							}
						]
					: []),
				...(categoriesId
					? [
							{
								name: 'applicableCategories',
								type: 'relation',
								required: false,
								collectionId: categoriesId,
								cascadeDelete: false,
								maxSelect: 0, // Unlimited
								displayFields: ['name']
							}
						]
					: []),
				{
					name: 'metadata',
					type: 'json',
					required: false
				}
			]
		});

		console.log('Coupons collection created successfully!');
		return true;
	} catch (error) {
		console.error('Error creating coupons collection:', error);
		console.error(error);
		return false;
	}
}

// Main execution
async function main() {
	try {
		const success = await createCouponsCollection();
		if (success) {
			console.log('✅ Coupons collection setup completed successfully!');
		} else {
			console.error('❌ Failed to set up coupons collection.');
			process.exit(1);
		}
	} catch (error) {
		console.error('Unexpected error:', error);
		process.exit(1);
	}
}

main();
