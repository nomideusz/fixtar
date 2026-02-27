# Payment Integration Guide for Polish E-commerce

## Recommended Payment Solutions

### 1. **Przelewy24 (Primary Recommendation)**

- **Why**: Most popular in Poland, supports 165+ payment methods
- **Supports**: BLIK, cards, bank transfers, e-wallets, buy now pay later
- **Integration**: REST API, webhooks, hosted payment page
- **Fees**: ~1.9% + 0.35 PLN per transaction

### 2. **PayU**

- **Why**: Strong alternative, good for Central/Eastern Europe
- **Supports**: Similar to P24, good BLIK integration
- **Integration**: REST API, OAuth 2.0
- **Fees**: ~1.9-2.5% per transaction

### 3. **Stripe (International Option)**

- **Why**: Excellent developer experience, global reach
- **Supports**: Cards, BLIK (via P24), bank transfers
- **Integration**: Excellent SDKs and documentation
- **Fees**: 1.5% + 1 PLN for European cards

## Implementation Plan

### Phase 1: Przelewy24 Integration

#### 1. Install Dependencies

```bash
npm install --save crypto axios
```

#### 2. Environment Variables

```env
# .env
P24_MERCHANT_ID=your_merchant_id
P24_POS_ID=your_pos_id
P24_CRC_KEY=your_crc_key
P24_API_KEY=your_api_key
P24_TEST_MODE=true
P24_WEBHOOK_SECRET=your_webhook_secret
```

#### 3. Create Payment Service

```typescript
// src/lib/services/payment/przelewy24.ts
import crypto from 'crypto';
import axios from 'axios';

export class Przelewy24Service {
	private merchantId: number;
	private posId: number;
	private crcKey: string;
	private apiKey: string;
	private testMode: boolean;

	constructor() {
		this.merchantId = parseInt(process.env.P24_MERCHANT_ID!);
		this.posId = parseInt(process.env.P24_POS_ID!);
		this.crcKey = process.env.P24_CRC_KEY!;
		this.apiKey = process.env.P24_API_KEY!;
		this.testMode = process.env.P24_TEST_MODE === 'true';
	}

	get apiUrl() {
		return this.testMode
			? 'https://sandbox.przelewy24.pl/api/v1'
			: 'https://secure.przelewy24.pl/api/v1';
	}

	generateSign(data: Record<string, any>): string {
		const signString =
			Object.keys(data)
				.sort()
				.map((key) => `${key}=${data[key]}`)
				.join('&') + `&${this.crcKey}`;

		return crypto.createHash('sha384').update(signString).digest('hex');
	}

	async createTransaction(orderData: {
		sessionId: string;
		amount: number; // in grosz (1 PLN = 100 grosz)
		currency: string;
		description: string;
		email: string;
		country: string;
		language: string;
		urlReturn: string;
		urlStatus: string;
		regulationAccept: boolean;
	}) {
		const data = {
			merchantId: this.merchantId,
			posId: this.posId,
			sessionId: orderData.sessionId,
			amount: orderData.amount,
			currency: orderData.currency,
			description: orderData.description,
			email: orderData.email,
			country: orderData.country,
			language: orderData.language,
			urlReturn: orderData.urlReturn,
			urlStatus: orderData.urlStatus,
			regulationAccept: orderData.regulationAccept,
			sign: ''
		};

		data.sign = this.generateSign(data);

		try {
			const response = await axios.post(`${this.apiUrl}/transaction/register`, data, {
				headers: {
					Authorization: `Basic ${Buffer.from(`${this.posId}:${this.apiKey}`).toString('base64')}`
				}
			});

			return {
				success: true,
				token: response.data.data.token,
				redirectUrl: `${this.testMode ? 'https://sandbox.przelewy24.pl' : 'https://secure.przelewy24.pl'}/trnRequest/${response.data.data.token}`
			};
		} catch (error) {
			console.error('P24 transaction error:', error);
			return {
				success: false,
				error: error.response?.data?.error || 'Transaction creation failed'
			};
		}
	}

	async verifyTransaction(data: {
		merchantId: number;
		posId: number;
		sessionId: string;
		amount: number;
		currency: string;
		orderId: number;
		sign: string;
	}) {
		// Verify the signature
		const calculatedSign = this.generateSign({
			merchantId: data.merchantId,
			posId: data.posId,
			sessionId: data.sessionId,
			amount: data.amount,
			currency: data.currency,
			orderId: data.orderId
		});

		if (calculatedSign !== data.sign) {
			return { success: false, error: 'Invalid signature' };
		}

		// Verify with P24 API
		try {
			const response = await axios.put(
				`${this.apiUrl}/transaction/verify`,
				{
					merchantId: this.merchantId,
					posId: this.posId,
					sessionId: data.sessionId,
					amount: data.amount,
					currency: data.currency,
					orderId: data.orderId,
					sign: calculatedSign
				},
				{
					headers: {
						Authorization: `Basic ${Buffer.from(`${this.posId}:${this.apiKey}`).toString('base64')}`
					}
				}
			);

			return { success: true, data: response.data };
		} catch (error) {
			return { success: false, error: error.response?.data?.error || 'Verification failed' };
		}
	}
}
```

#### 4. Update Checkout Flow

```typescript
// src/routes/checkout/+page.server.ts (update placeOrder action)
import { Przelewy24Service } from '$lib/services/payment/przelewy24';

// In placeOrder action, after creating order:
if (
	orderData.paymentMethod === 'przelewy24' ||
	orderData.paymentMethod === 'blik' ||
	orderData.paymentMethod === 'card'
) {
	const p24 = new Przelewy24Service();

	const transaction = await p24.createTransaction({
		sessionId: order.id,
		amount: Math.round(orderData.total * 100), // Convert to grosz
		currency: 'PLN',
		description: `Zamówienie ${order.orderNumber}`,
		email: orderData.email,
		country: 'PL',
		language: 'pl',
		urlReturn: `${PUBLIC_APP_URL}/checkout/payment-return?order=${order.id}`,
		urlStatus: `${PUBLIC_APP_URL}/api/webhooks/przelewy24`,
		regulationAccept: true
	});

	if (transaction.success) {
		// Save transaction token to order
		await pb.collection('orders').update(order.id, {
			paymentDetails: {
				provider: 'przelewy24',
				token: transaction.token,
				status: 'pending'
			}
		});

		// Redirect to P24 payment page
		return {
			success: true,
			redirectUrl: transaction.redirectUrl
		};
	}
}
```

#### 5. Create Webhook Handler

```typescript
// src/routes/api/webhooks/przelewy24/+server.ts
import { json } from '@sveltejs/kit';
import { Przelewy24Service } from '$lib/services/payment/przelewy24';
import PocketBase from 'pocketbase';

export async function POST({ request }) {
	const pb = new PocketBase(process.env.POCKETBASE_URL);
	const p24 = new Przelewy24Service();

	try {
		const data = await request.json();

		// Verify transaction
		const verification = await p24.verifyTransaction(data);

		if (verification.success) {
			// Update order status
			await pb.collection('orders').update(data.sessionId, {
				status: 'processing',
				paymentDetails: {
					provider: 'przelewy24',
					orderId: data.orderId,
					status: 'completed',
					verifiedAt: new Date().toISOString()
				}
			});

			// TODO: Send confirmation email
			// TODO: Clear cart
			// TODO: Update inventory

			return json({ status: 'OK' });
		}

		return json({ status: 'ERROR', message: verification.error }, { status: 400 });
	} catch (error) {
		console.error('Webhook error:', error);
		return json({ status: 'ERROR' }, { status: 500 });
	}
}
```

#### 6. Create Payment Return Page

```typescript
// src/routes/checkout/payment-return/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const orderId = url.searchParams.get('order');
	const status = url.searchParams.get('status');

	if (!orderId) {
		throw redirect(303, '/checkout');
	}

	// Check order payment status
	try {
		const order = await locals.pb.collection('orders').getOne(orderId);

		if (order.paymentDetails?.status === 'completed') {
			throw redirect(303, `/checkout/success?order=${orderId}`);
		} else {
			// Payment not yet confirmed, show waiting page
			return {
				order,
				status: 'pending'
			};
		}
	} catch (error) {
		throw redirect(303, '/checkout');
	}
};
```

### Phase 2: Alternative Payment Methods

#### Bank Transfer Instructions

For traditional bank transfers, generate unique payment reference:

```typescript
// After order creation
if (orderData.paymentMethod === 'bank_transfer') {
	const bankDetails = {
		accountNumber: 'PL61 1090 2590 0000 0001 4567 8901',
		accountName: 'FixTar Sp. z o.o.',
		bankName: 'Santander Bank Polska',
		swift: 'WBKPPLPP',
		reference: `FixTar-${order.orderNumber}`,
		amount: `${orderData.total.toFixed(2)} PLN`
	};

	await pb.collection('orders').update(order.id, {
		paymentDetails: {
			provider: 'bank_transfer',
			bankDetails,
			status: 'awaiting_payment'
		}
	});

	// Show bank details on success page
}
```

#### Cash on Delivery

```typescript
if (orderData.paymentMethod === 'cod') {
	await pb.collection('orders').update(order.id, {
		status: 'processing', // Can start processing immediately
		paymentDetails: {
			provider: 'cod',
			status: 'pending',
			additionalFee: 5.0 // COD fee
		}
	});
}
```

### Phase 3: Testing

#### Test Cards for Przelewy24 Sandbox

- **Successful payment**: Any valid card number
- **Failed payment**: Card number starting with 5201
- **3D Secure**: Card number starting with 5301

#### Test BLIK Codes

- **Success**: 777123
- **Failure**: 777456

### Security Considerations

1. **Always verify webhooks** - Check signatures
2. **Use HTTPS only** - For all callbacks
3. **Store sensitive data securely** - Use environment variables
4. **Log all transactions** - For debugging and auditing
5. **Implement idempotency** - Prevent duplicate charges
6. **Add rate limiting** - On payment endpoints

### Next Steps

1. Sign up for Przelewy24 test account
2. Implement basic integration
3. Test all payment methods
4. Add error handling and retry logic
5. Implement email notifications
6. Add payment status tracking in user account
7. Consider adding PayU as backup provider
