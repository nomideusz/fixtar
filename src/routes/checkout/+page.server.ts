import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PaymentService } from '$lib/services/payment';

// Polish voivodeships (województwa)
const POLISH_VOIVODESHIPS = [
	'dolnośląskie',
	'kujawsko-pomorskie',
	'lubelskie',
	'lubuskie',
	'łódzkie',
	'małopolskie',
	'mazowieckie',
	'opolskie',
	'podkarpackie',
	'podlaskie',
	'pomorskie',
	'śląskie',
	'świętokrzyskie',
	'warmińsko-mazurskie',
	'wielkopolskie',
	'zachodniopomorskie'
];

export const load: PageServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	const user = locals.user;
	
	console.log('[Checkout] Loading checkout data...');
	
	try {
		// Get user's addresses if logged in
		let addresses: any[] = [];
		if (user) {
			try {
				addresses = await pb.collection('addresses').getFullList({
					filter: `user = "${user.id}"`,
					sort: '-default,created'
				});
				console.log('[Checkout] Loaded addresses:', addresses.length);
			} catch (e) {
				console.error('[Checkout] Error fetching addresses:', e);
			}
		}
		
		// Get active shipping methods
		let shippingMethods: any[] = [];
		try {
			shippingMethods = await pb.collection('shipping_methods').getFullList({
				filter: 'active = true',
				sort: 'displayOrder,name'
			});
			console.log('[Checkout] Loaded shipping methods from DB:', shippingMethods.length);
		} catch (e) {
			console.error('[Checkout] Error fetching shipping methods:', e);
		}
		
		// Use fallback methods if none found
		if (shippingMethods.length === 0) {
			shippingMethods = [
				{
					id: 'standard',
					name: 'Poczta Polska',
					description: 'Dostawa w 3-5 dni roboczych',
					cost: 12.99,
					freeShippingThreshold: 150,
					estimatedDeliveryDays: '3-5'
				},
				{
					id: 'express',
					name: 'Kurier DPD',
					description: 'Dostawa następnego dnia roboczego',
					cost: 19.99,
					freeShippingThreshold: 300,
					estimatedDeliveryDays: '1-2'
				},
				{
					id: 'inpost',
					name: 'InPost Paczkomat',
					description: 'Dostawa do paczkomatu w 1-2 dni',
					cost: 9.99,
					freeShippingThreshold: 100,
					estimatedDeliveryDays: '1-2'
				}
			];
			console.log('[Checkout] Using fallback shipping methods:', shippingMethods.length);
		}
		
		// Get active payment methods
		let paymentMethods: any[] = [];
		try {
			paymentMethods = await pb.collection('payment_methods').getFullList({
				filter: 'active = true',
				sort: 'displayOrder,name'
			});
			console.log('[Checkout] Loaded payment methods from DB:', paymentMethods.length);
		} catch (e) {
			console.error('[Checkout] Error fetching payment methods:', e);
		}
		
		// Use fallback methods if none found
		if (paymentMethods.length === 0) {
			paymentMethods = [
				{
					id: 'blik',
					code: 'blik',
					name: 'BLIK',
					type: 'digital_wallet',
					description: 'Płatność kodem BLIK',
					icon: null
				},
				{
					id: 'card',
					code: 'card',
					name: 'Karta płatnicza',
					type: 'credit_card',
					description: 'Visa, Mastercard, Maestro',
					icon: null
				},
				{
					id: 'transfer',
					code: 'bank_transfer',
					name: 'Przelew tradycyjny',
					type: 'bank_transfer',
					description: 'Przelew bankowy',
					icon: null
				},
				{
					id: 'p24',
					code: 'przelewy24',
					name: 'Przelewy24',
					type: 'digital_wallet',
					description: 'Szybkie płatności online',
					icon: null
				},
				{
					id: 'cod',
					code: 'cod',
					name: 'Płatność przy odbiorze',
					type: 'cash_on_delivery',
					description: 'Zapłać kurierowi przy odbiorze',
					processingFee: 5.0,
					feeType: 'fixed'
				}
			];
			console.log('[Checkout] Using fallback payment methods:', paymentMethods.length);
		}
		
		const result = {
			addresses,
			shippingMethods,
			paymentMethods,
			voivodeships: POLISH_VOIVODESHIPS,
			user
		};
		
		console.log('[Checkout] Returning data:', {
			addresses: result.addresses.length,
			shippingMethods: result.shippingMethods.length,
			paymentMethods: result.paymentMethods.length,
			voivodeships: result.voivodeships.length,
			hasUser: !!result.user
		});
		
		return result;
	} catch (e) {
		console.error('[Checkout] Critical error loading checkout data:', e);
		return {
			addresses: [],
			shippingMethods: [],
			paymentMethods: [],
			voivodeships: POLISH_VOIVODESHIPS,
			user
		};
	}
};

export const actions: Actions = {
	placeOrder: async ({ request, locals, url }) => {
		const pb = locals.pb;
		const user = locals.user;
		
		try {
			const formData = await request.formData();
			
			// Extract form data
			const orderData = {
				// Contact info
				email: formData.get('email')?.toString() || '',
				phone: formData.get('phone')?.toString() || '',
				
				// Shipping address
				shippingAddress: {
					firstName: formData.get('firstName')?.toString() || '',
					lastName: formData.get('lastName')?.toString() || '',
					company: formData.get('company')?.toString() || '',
					street: formData.get('street')?.toString() || '',
					apartment: formData.get('apartment')?.toString() || '',
					city: formData.get('city')?.toString() || '',
					voivodeship: formData.get('voivodeship')?.toString() || '',
					postalCode: formData.get('postalCode')?.toString() || '',
					country: 'Poland'
				},
				
				// Payment and shipping
				paymentMethod: formData.get('paymentMethod')?.toString() || '',
				shippingMethod: formData.get('shippingMethod')?.toString() || '',
				
				// Additional info
				nip: formData.get('nip')?.toString() || '',
				notes: formData.get('notes')?.toString() || '',
				
				// Cart items (should be passed from client)
				items: JSON.parse(formData.get('items')?.toString() || '[]'),
				subtotal: parseFloat(formData.get('subtotal')?.toString() || '0'),
				shippingCost: parseFloat(formData.get('shippingCost')?.toString() || '0'),
				tax: parseFloat(formData.get('tax')?.toString() || '0'),
				total: parseFloat(formData.get('total')?.toString() || '0')
			};
			
			// Validate required fields
			if (!orderData.email || !orderData.shippingAddress.firstName || 
				!orderData.shippingAddress.lastName || !orderData.shippingAddress.street ||
				!orderData.shippingAddress.city || !orderData.shippingAddress.postalCode ||
				!orderData.paymentMethod || !orderData.shippingMethod) {
				return fail(400, { 
					success: false, 
					message: 'Proszę wypełnić wszystkie wymagane pola' 
				});
			}
			
			// Generate order number
			const orderNumber = `PL${Date.now()}-${Math.floor(Math.random() * 1000)}`;
			
			// Prepare order data
			const orderDataToCreate = {
				orderNumber,
				user: user?.id || null,
				status: 'pending',
				items: orderData.items,
				shippingAddress: orderData.shippingAddress,
				billingAddress: orderData.shippingAddress, // Same as shipping for now
				paymentMethod: orderData.paymentMethod,
				shippingMethod: orderData.shippingMethod,
				subtotal: orderData.subtotal,
				tax: orderData.tax,
				shippingCost: orderData.shippingCost,
				total: orderData.total,
				notes: orderData.notes,
				metadata: {
					email: orderData.email,
					phone: orderData.phone,
					nip: orderData.nip,
					userAgent: request.headers.get('user-agent'),
					ip: request.headers.get('x-forwarded-for') || 'unknown'
				}
			};
			
			console.log('[Checkout] Creating order with data:', JSON.stringify(orderDataToCreate, null, 2));
			
			// Initialize payment service first to determine payment flow
			const paymentService = new PaymentService();
			const appUrl = url.origin;
			
			// Check if payment method needs fallback before creating order
			let actualPaymentMethod = orderData.paymentMethod;
			let paymentDetails: any = null;
			
			// Pre-process payment to determine actual method
			const testPaymentResult = await paymentService.processPayment(orderData.paymentMethod, {
				orderId: 'test', // Temporary ID for testing
				orderNumber: orderNumber,
				amount: orderData.total,
				currency: 'PLN',
				email: orderData.email,
				description: `Zamówienie ${orderNumber}`,
				customerData: {
					firstName: orderData.shippingAddress.firstName,
					lastName: orderData.shippingAddress.lastName,
					phone: orderData.phone
				},
				returnUrl: `${appUrl}/checkout/payment-return?order=temp`,
				webhookUrl: `${appUrl}/api/webhooks/payment`
			});
			
			// If payment method is not configured, prepare to use bank transfer
			if (!testPaymentResult.success && 
				(testPaymentResult.error?.includes('not configured') || 
				 testPaymentResult.error?.includes('not supported'))) {
				console.log(`[Checkout] Payment method ${orderData.paymentMethod} not configured, will use bank transfer`);
				
				// Process as bank transfer
				const bankResult = await paymentService.processPayment('bank_transfer', {
					orderId: 'temp',
					orderNumber: orderNumber,
					amount: orderData.total,
					currency: 'PLN',
					email: orderData.email,
					description: `Zamówienie ${orderNumber}`,
					customerData: {
						firstName: orderData.shippingAddress.firstName,
						lastName: orderData.shippingAddress.lastName,
						phone: orderData.phone
					},
					returnUrl: `${appUrl}/checkout/payment-return?order=temp`,
					webhookUrl: `${appUrl}/api/webhooks/payment`
				});
				
				actualPaymentMethod = 'bank_transfer';
				paymentDetails = {
					provider: 'bank_transfer',
					originalMethod: orderData.paymentMethod,
					transactionId: bankResult.transactionId,
					bankDetails: bankResult.bankDetails,
					status: 'pending'
				};
			} else if (testPaymentResult.success) {
				// Use original payment method details
				paymentDetails = {
					provider: orderData.paymentMethod,
					transactionId: testPaymentResult.transactionId,
					bankDetails: testPaymentResult.bankDetails,
					status: 'pending'
				};
			}
			
			// Update order data with actual payment method and details
			orderDataToCreate.paymentMethod = actualPaymentMethod;
			if (paymentDetails) {
				// Store payment details in metadata to avoid schema issues
				(orderDataToCreate.metadata as any) = {
					...orderDataToCreate.metadata,
					paymentDetails: paymentDetails
				};
			}
			
			// Create order record with all details
			const order = await pb.collection('orders').create(orderDataToCreate);
			
			console.log('[Checkout] Order created successfully:', order.id);
			
			// Handle different payment flows
			if (actualPaymentMethod === 'bank_transfer' && orderData.paymentMethod !== 'bank_transfer') {
				// This was a fallback to bank transfer
				return {
					success: true,
					redirectUrl: `/checkout/success?order=${order.id}&payment=bank_transfer&fallback=true`
				};
			} else if (testPaymentResult.redirectUrl) {
				// External payment gateway (Przelewy24, PayU, etc.)
				// Note: In real implementation, we'd need to update the redirectUrl with the actual order ID
				return {
					success: true,
					redirectUrl: testPaymentResult.redirectUrl.replace('order=temp', `order=${order.id}`)
				};
			} else if (actualPaymentMethod === 'bank_transfer') {
				// Bank transfer - show success page with bank details
				return {
					success: true,
					redirectUrl: `/checkout/success?order=${order.id}&payment=bank_transfer`
				};
			} else {
				// Cash on delivery or other methods - go straight to success
				return {
					success: true,
					redirectUrl: `/checkout/success?order=${order.id}`
				};
			}
		} catch (e) {
			// Check if it's a redirect (which is actually a success)
			if (e && typeof e === 'object' && 'status' in e && 'location' in e) {
				console.log('Order created successfully, redirecting to:', (e as any).location);
				throw e; // Re-throw the redirect
			}
			
			if (e instanceof Response) throw e; // Re-throw other responses
			
			console.error('Error creating order:', e);
			
			// Extract detailed error message from PocketBase
			let errorMessage = 'Wystąpił błąd podczas składania zamówienia';
			if (e && typeof e === 'object' && 'response' in e) {
				const pbError = e as any;
				if (pbError.response?.data) {
					console.error('PocketBase error details:', pbError.response.data);
					// Check for specific field errors
					if (pbError.response.data.data) {
						const fieldErrors = Object.entries(pbError.response.data.data)
							.map(([field, error]: [string, any]) => `${field}: ${error.message || error}`)
							.join(', ');
						errorMessage = `Błąd walidacji: ${fieldErrors}`;
					}
				}
			}
			
			return fail(500, { 
				success: false, 
				message: errorMessage 
			});
		}
	}
}; 
