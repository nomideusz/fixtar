import type { PaymentProvider, PaymentOrder, PaymentResult, VerificationResult } from './types';
import crypto from 'crypto';

export class Przelewy24Provider implements PaymentProvider {
	name = 'przelewy24';

	private merchantId: number;
	private posId: number;
	private crcKey: string;
	private apiKey: string;
	private testMode: boolean;

	constructor() {
		// These would come from environment variables
		this.merchantId = 0; // parseInt(process.env.P24_MERCHANT_ID || '0');
		this.posId = 0; // parseInt(process.env.P24_POS_ID || '0');
		this.crcKey = ''; // process.env.P24_CRC_KEY || '';
		this.apiKey = ''; // process.env.P24_API_KEY || '';
		this.testMode = true; // process.env.P24_TEST_MODE === 'true';
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

	async processPayment(order: PaymentOrder): Promise<PaymentResult> {
		// Return mock response for now
		// When credentials are available, implement actual P24 integration

		return {
			success: false,
			error: 'Przelewy24 integration not configured. Please add P24 credentials.'
		};

		/* Actual implementation would be:
    const data = {
      merchantId: this.merchantId,
      posId: this.posId,
      sessionId: order.orderId,
      amount: Math.round(order.amount * 100), // Convert to grosz
      currency: order.currency,
      description: order.description,
      email: order.email,
      country: 'PL',
      language: 'pl',
      urlReturn: order.returnUrl,
      urlStatus: order.webhookUrl,
      regulationAccept: true,
      sign: ''
    };
    
    data.sign = this.generateSign(data);
    
    // Make API call to P24
    // Return redirect URL
    */
	}

	async verifyPayment(data: any): Promise<VerificationResult> {
		// Mock verification for now
		return {
			success: false,
			error: 'Przelewy24 verification not implemented'
		};
	}
}
