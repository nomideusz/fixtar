import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

console.log('🚀 Starting PocketBase database setup...');

// Load environment variables
dotenv.config();

/**
 * Creates a PocketBase client
 */
function createClient() {
	const url = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
	console.log(`📡 Connecting to PocketBase at ${url}...`);
	return new PocketBase(url);
}

/**
 * Authenticates as admin
 */
async function authenticate(pb: PocketBase) {
	if (!process.env.PB_ADMIN_EMAIL || !process.env.PB_ADMIN_PASSWORD) {
		console.error('❌ Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD environment variables');
		console.log('Please create a .env file with:');
		console.log('POCKETBASE_URL=http://127.0.0.1:8090');
		console.log('PB_ADMIN_EMAIL=admin@FixTar.local');
		console.log('PB_ADMIN_PASSWORD=your_password');
		return false;
	}

	try {
		console.log(`🔐 Authenticating as ${process.env.PB_ADMIN_EMAIL}...`);
		await pb
			.collection('_superusers')
			.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
		console.log('✅ Authentication successful');
		return true;
	} catch (error) {
		console.error('❌ Authentication failed:', error);
		return false;
	}
}

/**
 * Check if a collection exists
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
 * Create categories collection and populate with real data
 */
async function setupCategories(pb: PocketBase) {
	console.log('📂 Setting up categories...');

	const exists = await collectionExists(pb, 'categories');
	if (!exists) {
		console.log('Creating categories collection...');
		await pb.collections.create({
			name: 'categories',
			type: 'base',
			listRule: '',
			viewRule: '',
			createRule: '@request.auth.isAdmin = true',
			updateRule: '@request.auth.isAdmin = true',
			deleteRule: '@request.auth.isAdmin = true',
			fields: [
				{
					name: 'name',
					type: 'text',
					required: true,
					min: 2,
					max: 100
				},
				{
					name: 'slug',
					type: 'text',
					required: true,
					min: 2,
					max: 100
				},
				{
					name: 'description',
					type: 'text',
					required: false,
					max: 500
				},
				{
					name: 'parent',
					type: 'relation',
					required: false,
					collectionId: '', // Will be set after creation
					cascadeDelete: false,
					maxSelect: 1
				},
				{
					name: 'image',
					type: 'file',
					required: false,
					maxSelect: 1,
					maxSize: 5242880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
				},
				{
					name: 'featured',
					type: 'bool',
					required: false
				},
				{
					name: 'displayOrder',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'seo',
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
	}

	// Create sample categories
	const categories = [
		{
			name: 'Electronics',
			slug: 'electronics',
			description: 'Latest electronic devices and gadgets',
			featured: true,
			displayOrder: 1
		},
		{
			name: 'Smartphones',
			slug: 'smartphones',
			description: 'Latest smartphones and mobile devices',
			featured: true,
			displayOrder: 2
		},
		{
			name: 'Laptops',
			slug: 'laptops',
			description: 'High-performance laptops and notebooks',
			featured: true,
			displayOrder: 3
		},
		{
			name: 'Accessories',
			slug: 'accessories',
			description: 'Phone cases, chargers, and other accessories',
			featured: false,
			displayOrder: 4
		},
		{
			name: 'Gaming',
			slug: 'gaming',
			description: 'Gaming laptops, accessories, and peripherals',
			featured: true,
			displayOrder: 5
		}
	];

	for (const category of categories) {
		try {
			const existing = await pb
				.collection('categories')
				.getFirstListItem(`slug="${category.slug}"`);
			console.log(`Category "${category.name}" already exists`);
		} catch {
			await pb.collection('categories').create(category);
			console.log(`✅ Created category: ${category.name}`);
		}
	}
}

/**
 * Create products collection and populate with real data
 */
async function setupProducts(pb: PocketBase) {
	console.log('📱 Setting up products...');

	// Get categories collection ID
	const categoriesCollection = await pb.collections.getOne('categories');

	const exists = await collectionExists(pb, 'products');
	if (!exists) {
		console.log('Creating products collection...');
		await pb.collections.create({
			name: 'products',
			type: 'base',
			listRule: '',
			viewRule: '',
			createRule: '@request.auth.isAdmin = true',
			updateRule: '@request.auth.isAdmin = true',
			deleteRule: '@request.auth.isAdmin = true',
			fields: [
				{
					name: 'name',
					type: 'text',
					required: true,
					min: 2,
					max: 200
				},
				{
					name: 'slug',
					type: 'text',
					required: true,
					min: 2,
					max: 200
				},
				{
					name: 'description',
					type: 'editor',
					required: false
				},
				{
					name: 'shortDescription',
					type: 'text',
					required: false,
					max: 500
				},
				{
					name: 'price',
					type: 'number',
					required: true,
					min: 0
				},
				{
					name: 'compareAtPrice',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'cost',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'sku',
					type: 'text',
					required: true,
					min: 2,
					max: 100
				},
				{
					name: 'barcode',
					type: 'text',
					required: false,
					max: 100
				},
				{
					name: 'categories',
					type: 'relation',
					required: false,
					collectionId: categoriesCollection.id,
					cascadeDelete: false,
					maxSelect: 0
				},
				{
					name: 'mainImage',
					type: 'file',
					required: false,
					maxSelect: 1,
					maxSize: 5242880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				},
				{
					name: 'gallery',
					type: 'file',
					required: false,
					maxSelect: 10,
					maxSize: 5242880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				},
				{
					name: 'status',
					type: 'select',
					required: true,
					values: ['draft', 'active', 'archived']
				},
				{
					name: 'inventory',
					type: 'json',
					required: false
				},
				{
					name: 'variants',
					type: 'json',
					required: false
				},
				{
					name: 'attributes',
					type: 'json',
					required: false
				},
				{
					name: 'weight',
					type: 'number',
					required: false,
					min: 0
				},
				{
					name: 'dimensions',
					type: 'json',
					required: false
				},
				{
					name: 'featured',
					type: 'bool',
					required: false
				},
				{
					name: 'shipping',
					type: 'json',
					required: false
				},
				{
					name: 'taxable',
					type: 'bool',
					required: false
				},
				{
					name: 'taxClass',
					type: 'text',
					required: false
				},
				{
					name: 'seo',
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
	}

	// Get category IDs
	const categories = await pb.collection('categories').getFullList();
	const electronicsId = categories.find((c) => c.slug === 'electronics')?.id;
	const smartphonesId = categories.find((c) => c.slug === 'smartphones')?.id;
	const laptopsId = categories.find((c) => c.slug === 'laptops')?.id;
	const accessoriesId = categories.find((c) => c.slug === 'accessories')?.id;
	const gamingId = categories.find((c) => c.slug === 'gaming')?.id;

	// Create sample products with real data
	const products = [
		{
			name: 'iPhone 15 Pro',
			slug: 'iphone-15-pro',
			description:
				'<p>The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.</p>',
			shortDescription: 'Latest iPhone with titanium design and A17 Pro chip',
			price: 999.0,
			compareAtPrice: 1099.0,
			cost: 750.0,
			sku: 'IPHONE15PRO-128',
			barcode: '194253000000',
			categories: [electronicsId, smartphonesId],
			status: 'active',
			featured: true,
			inventory: {
				quantity: 50,
				trackQuantity: true,
				allowBackorder: false,
				lowStockThreshold: 10
			},
			variants: [
				{ name: 'Storage', options: ['128GB', '256GB', '512GB', '1TB'] },
				{
					name: 'Color',
					options: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
				}
			],
			attributes: {
				brand: 'Apple',
				model: 'iPhone 15 Pro',
				color: 'Natural Titanium',
				storage: '128GB',
				display: '6.1-inch Super Retina XDR',
				camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
				battery: 'Up to 23 hours video playback',
				os: 'iOS 17'
			},
			weight: 187,
			dimensions: { length: 146.6, width: 70.6, height: 8.25 },
			taxable: true,
			seo: {
				title: 'iPhone 15 Pro - Latest Apple Smartphone',
				description:
					'Buy the new iPhone 15 Pro with titanium design and A17 Pro chip. Free shipping available.',
				keywords: 'iPhone, Apple, smartphone, titanium, A17 Pro'
			}
		},
		{
			name: 'Samsung Galaxy S24 Ultra',
			slug: 'samsung-galaxy-s24-ultra',
			description:
				'<p>The Galaxy S24 Ultra features an integrated S Pen, 200MP camera, and AI-powered features for productivity and creativity.</p>',
			shortDescription: 'Premium Android phone with S Pen and 200MP camera',
			price: 1199.0,
			compareAtPrice: 1299.0,
			cost: 850.0,
			sku: 'GALAXYS24U-256',
			barcode: '887276000000',
			categories: [electronicsId, smartphonesId],
			status: 'active',
			featured: true,
			inventory: {
				quantity: 35,
				trackQuantity: true,
				allowBackorder: false,
				lowStockThreshold: 5
			},
			variants: [
				{ name: 'Storage', options: ['256GB', '512GB', '1TB'] },
				{
					name: 'Color',
					options: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow']
				}
			],
			attributes: {
				brand: 'Samsung',
				model: 'Galaxy S24 Ultra',
				color: 'Titanium Black',
				storage: '256GB',
				display: '6.8-inch Dynamic AMOLED 2X',
				camera: '200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto',
				battery: '5000mAh',
				os: 'Android 14'
			},
			weight: 232,
			dimensions: { length: 162.3, width: 79.0, height: 8.6 },
			taxable: true,
			seo: {
				title: 'Samsung Galaxy S24 Ultra - Premium Android Phone',
				description:
					'Experience the Galaxy S24 Ultra with S Pen, 200MP camera, and AI features. Order now with free shipping.',
				keywords: 'Samsung, Galaxy, S24 Ultra, Android, S Pen, 200MP camera'
			}
		},
		{
			name: 'MacBook Pro 14-inch M3',
			slug: 'macbook-pro-14-m3',
			description:
				'<p>The MacBook Pro 14-inch with M3 chip delivers exceptional performance for professionals with up to 22 hours of battery life.</p>',
			shortDescription: 'Professional laptop with M3 chip and Liquid Retina XDR display',
			price: 1599.0,
			compareAtPrice: 1799.0,
			cost: 1200.0,
			sku: 'MBP14M3-512',
			barcode: '194253000001',
			categories: [electronicsId, laptopsId],
			status: 'active',
			featured: true,
			inventory: {
				quantity: 25,
				trackQuantity: true,
				allowBackorder: true,
				lowStockThreshold: 5
			},
			variants: [
				{ name: 'Storage', options: ['512GB', '1TB', '2TB'] },
				{ name: 'Memory', options: ['8GB', '16GB', '32GB'] },
				{ name: 'Color', options: ['Space Gray', 'Silver'] }
			],
			attributes: {
				brand: 'Apple',
				model: 'MacBook Pro 14-inch',
				processor: 'Apple M3',
				memory: '8GB',
				storage: '512GB SSD',
				display: '14.2-inch Liquid Retina XDR',
				graphics: 'M3 10-core GPU',
				battery: 'Up to 22 hours',
				os: 'macOS Sonoma'
			},
			weight: 1550,
			dimensions: { length: 312.6, width: 221.2, height: 15.5 },
			taxable: true,
			seo: {
				title: 'MacBook Pro 14-inch M3 - Professional Laptop',
				description:
					'Get the MacBook Pro 14-inch with M3 chip for professional performance. Free shipping and setup included.',
				keywords: 'MacBook Pro, Apple, M3 chip, laptop, professional'
			}
		},
		{
			name: 'Dell XPS 13 Plus',
			slug: 'dell-xps-13-plus',
			description:
				'<p>The Dell XPS 13 Plus features a stunning InfinityEdge display, 12th Gen Intel processors, and premium build quality.</p>',
			shortDescription: 'Ultra-portable laptop with InfinityEdge display',
			price: 1299.0,
			compareAtPrice: 1499.0,
			cost: 950.0,
			sku: 'DELLXPS13P-512',
			barcode: '884116000000',
			categories: [electronicsId, laptopsId],
			status: 'active',
			featured: false,
			inventory: {
				quantity: 20,
				trackQuantity: true,
				allowBackorder: false,
				lowStockThreshold: 3
			},
			variants: [
				{ name: 'Processor', options: ['Intel i5-1240P', 'Intel i7-1260P'] },
				{ name: 'Memory', options: ['16GB', '32GB'] },
				{ name: 'Storage', options: ['512GB', '1TB'] }
			],
			attributes: {
				brand: 'Dell',
				model: 'XPS 13 Plus',
				processor: 'Intel Core i5-1240P',
				memory: '16GB LPDDR5',
				storage: '512GB SSD',
				display: '13.4-inch FHD+ InfinityEdge',
				graphics: 'Intel Iris Xe',
				battery: 'Up to 12 hours',
				os: 'Windows 11 Home'
			},
			weight: 1260,
			dimensions: { length: 295.3, width: 199.04, height: 15.28 },
			taxable: true,
			seo: {
				title: 'Dell XPS 13 Plus - Ultra-Portable Laptop',
				description:
					'Experience the Dell XPS 13 Plus with InfinityEdge display and 12th Gen Intel processors.',
				keywords: 'Dell, XPS 13, laptop, InfinityEdge, Intel, portable'
			}
		},
		{
			name: 'AirPods Pro (2nd generation)',
			slug: 'airpods-pro-2nd-gen',
			description:
				'<p>AirPods Pro (2nd generation) feature Active Noise Cancellation, Adaptive Transparency, and up to 6 hours of listening time.</p>',
			shortDescription: 'Premium wireless earbuds with Active Noise Cancellation',
			price: 249.0,
			compareAtPrice: 279.0,
			cost: 180.0,
			sku: 'AIRPODSPRO2-USB',
			barcode: '194253000002',
			categories: [electronicsId, accessoriesId],
			status: 'active',
			featured: true,
			inventory: {
				quantity: 100,
				trackQuantity: true,
				allowBackorder: false,
				lowStockThreshold: 20
			},
			attributes: {
				brand: 'Apple',
				model: 'AirPods Pro (2nd generation)',
				connectivity: 'Bluetooth 5.3',
				battery: 'Up to 6 hours listening (ANC on)',
				charging: 'Lightning/USB-C case',
				features: 'Active Noise Cancellation, Adaptive Transparency, Spatial Audio',
				compatibility: 'iPhone, iPad, Mac, Apple Watch'
			},
			weight: 50.8,
			dimensions: { length: 30.9, width: 21.8, height: 24.0 },
			taxable: true,
			seo: {
				title: 'AirPods Pro (2nd generation) - Premium Wireless Earbuds',
				description:
					'Get AirPods Pro with Active Noise Cancellation and Adaptive Transparency. Free shipping included.',
				keywords: 'AirPods Pro, Apple, wireless earbuds, noise cancellation'
			}
		}
	];

	for (const product of products) {
		try {
			const existing = await pb.collection('products').getFirstListItem(`slug="${product.slug}"`);
			console.log(`Product "${product.name}" already exists`);
		} catch {
			await pb.collection('products').create(product);
			console.log(`✅ Created product: ${product.name}`);
		}
	}
}

/**
 * Main setup function
 */
async function main() {
	try {
		const pb = createClient();
		const authenticated = await authenticate(pb);

		if (!authenticated) {
			console.error('❌ Setup failed: Authentication required');
			process.exit(1);
		}

		console.log('🏗️  Setting up database collections...');

		await setupCategories(pb);
		await setupProducts(pb);

		console.log('🎉 Database setup completed successfully!');
		console.log('');
		console.log('Next steps:');
		console.log('1. Start your SvelteKit app: npm run dev');
		console.log('2. Visit the admin panel to manage products');
		console.log('3. Add product images through the PocketBase admin interface');
	} catch (error) {
		console.error('❌ Setup failed:', error);
		process.exit(1);
	}
}

// Run the setup
main();
