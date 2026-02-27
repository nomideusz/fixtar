import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config();

const POCKETBASE_URL =
	process.env.POCKETBASE_URL || process.env.PUBLIC_POCKETBASE_URL || 'https://k.xeon.pl';

async function seedCheckoutData() {
	const pb = new PocketBase(POCKETBASE_URL);

	try {
		// Check for admin credentials
		if (!process.env.PB_ADMIN_EMAIL || !process.env.PB_ADMIN_PASSWORD) {
			console.error('❌ Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD environment variables');
			console.log('Please create a .env file with:');
			console.log('POCKETBASE_URL=https://k.xeon.pl');
			console.log('PB_ADMIN_EMAIL=your-admin-email@example.com');
			console.log('PB_ADMIN_PASSWORD=your-admin-password');
			return;
		}

		// Authenticate as admin
		console.log(`🔐 Authenticating as ${process.env.PB_ADMIN_EMAIL}...`);
		await pb
			.collection('_superusers')
			.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
		console.log('✅ Authentication successful');

		// Check if collections exist
		const collections = await pb.collections.getList();
		const hasShipping = collections.items.some((c) => c.name === 'shipping_methods');
		const hasPayment = collections.items.some((c) => c.name === 'payment_methods');

		// Create shipping methods collection if it doesn't exist
		if (!hasShipping) {
			console.log('Creating shipping_methods collection...');
			await pb.collections.create({
				name: 'shipping_methods',
				type: 'base',
				listRule: '',
				viewRule: '',
				createRule: '@request.auth.isAdmin = true',
				updateRule: '@request.auth.isAdmin = true',
				deleteRule: '@request.auth.isAdmin = true',
				schema: [
					{
						name: 'name',
						type: 'text',
						required: true
					},
					{
						name: 'description',
						type: 'text',
						required: false
					},
					{
						name: 'cost',
						type: 'number',
						required: true
					},
					{
						name: 'freeShippingThreshold',
						type: 'number',
						required: false
					},
					{
						name: 'active',
						type: 'bool',
						required: true
					},
					{
						name: 'estimatedDeliveryDays',
						type: 'text',
						required: false
					},
					{
						name: 'displayOrder',
						type: 'number',
						required: false
					}
				]
			});
		}

		// Create payment methods collection if it doesn't exist
		if (!hasPayment) {
			console.log('Creating payment_methods collection...');
			await pb.collections.create({
				name: 'payment_methods',
				type: 'base',
				listRule: '',
				viewRule: '',
				createRule: '@request.auth.isAdmin = true',
				updateRule: '@request.auth.isAdmin = true',
				deleteRule: '@request.auth.isAdmin = true',
				schema: [
					{
						name: 'name',
						type: 'text',
						required: true
					},
					{
						name: 'code',
						type: 'text',
						required: true
					},
					{
						name: 'description',
						type: 'text',
						required: false
					},
					{
						name: 'type',
						type: 'select',
						required: true,
						options: {
							values: [
								'credit_card',
								'bank_transfer',
								'digital_wallet',
								'cash_on_delivery',
								'other'
							]
						}
					},
					{
						name: 'active',
						type: 'bool',
						required: true
					},
					{
						name: 'processingFee',
						type: 'number',
						required: false
					},
					{
						name: 'feeType',
						type: 'select',
						required: false,
						options: {
							values: ['percentage', 'fixed']
						}
					},
					{
						name: 'displayOrder',
						type: 'number',
						required: false
					}
				]
			});
		}

		// Seed Polish shipping methods
		const shippingMethods = [
			{
				name: 'InPost Paczkomat',
				description: 'Dostawa do paczkomatu w 1-2 dni',
				cost: 9.99,
				freeShippingThreshold: 100,
				active: true,
				estimatedDeliveryDays: '1-2',
				displayOrder: 1
			},
			{
				name: 'Poczta Polska',
				description: 'Dostawa w 3-5 dni roboczych',
				cost: 12.99,
				freeShippingThreshold: 150,
				active: true,
				estimatedDeliveryDays: '3-5',
				displayOrder: 2
			},
			{
				name: 'Kurier DPD',
				description: 'Dostawa następnego dnia roboczego',
				cost: 19.99,
				freeShippingThreshold: 300,
				active: true,
				estimatedDeliveryDays: '1-2',
				displayOrder: 3
			},
			{
				name: 'Kurier DHL',
				description: 'Ekspresowa dostawa',
				cost: 24.99,
				freeShippingThreshold: 500,
				active: true,
				estimatedDeliveryDays: '1',
				displayOrder: 4
			}
		];

		// Seed Polish payment methods
		const paymentMethods = [
			{
				name: 'BLIK',
				code: 'blik',
				description: 'Płatność kodem BLIK',
				type: 'digital_wallet',
				active: true,
				displayOrder: 1
			},
			{
				name: 'Przelewy24',
				code: 'przelewy24',
				description: 'Szybkie płatności online',
				type: 'digital_wallet',
				active: true,
				displayOrder: 2
			},
			{
				name: 'Karta płatnicza',
				code: 'card',
				description: 'Visa, Mastercard, Maestro',
				type: 'credit_card',
				active: true,
				displayOrder: 3
			},
			{
				name: 'PayU',
				code: 'payu',
				description: 'Płatności PayU',
				type: 'digital_wallet',
				active: true,
				displayOrder: 4
			},
			{
				name: 'Przelew tradycyjny',
				code: 'bank_transfer',
				description: 'Przelew bankowy',
				type: 'bank_transfer',
				active: true,
				displayOrder: 5
			},
			{
				name: 'Płatność przy odbiorze',
				code: 'cod',
				description: 'Zapłać kurierowi przy odbiorze',
				type: 'cash_on_delivery',
				active: true,
				processingFee: 5.0,
				feeType: 'fixed',
				displayOrder: 6
			}
		];

		// Insert shipping methods
		for (const method of shippingMethods) {
			try {
				await pb.collection('shipping_methods').create(method);
				console.log(`Created shipping method: ${method.name}`);
			} catch (e: any) {
				if (e.status === 400 && e.data?.data?.name?.code === 'validation_not_unique') {
					console.log(`Shipping method already exists: ${method.name}`);
				} else {
					console.error(`Error creating shipping method ${method.name}:`, e);
				}
			}
		}

		// Insert payment methods
		for (const method of paymentMethods) {
			try {
				await pb.collection('payment_methods').create(method);
				console.log(`Created payment method: ${method.name}`);
			} catch (e: any) {
				if (e.status === 400 && e.data?.data?.code?.code === 'validation_not_unique') {
					console.log(`Payment method already exists: ${method.name}`);
				} else {
					console.error(`Error creating payment method ${method.name}:`, e);
				}
			}
		}

		console.log('Checkout data seeding completed!');
	} catch (error) {
		console.error('Error seeding checkout data:', error);
	}
}

// Run the script
seedCheckoutData();
