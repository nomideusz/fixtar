import type { PaymentProvider, PaymentOrder } from './types';
import { BankTransferProvider } from './bank-transfer';
import { CashOnDeliveryProvider } from './cash-on-delivery';

export * from './types';

export class PaymentService {
	private providers: Map<string, PaymentProvider> = new Map();

	constructor() {
		// Register available payment providers
		this.registerProvider(new BankTransferProvider());
		this.registerProvider(new CashOnDeliveryProvider());

		// TODO: Add Przelewy24Provider when credentials are available
		// TODO: Add PayUProvider when credentials are available
	}

	registerProvider(provider: PaymentProvider) {
		this.providers.set(provider.name, provider);
	}

	getProvider(name: string): PaymentProvider | null {
		return this.providers.get(name) || null;
	}

	async processPayment(paymentMethod: string, order: PaymentOrder) {
		// Map payment methods to providers
		let providerName = paymentMethod;

		// Route specific payment methods through appropriate gateways
		if (paymentMethod === 'blik' || paymentMethod === 'card') {
			// Try Przelewy24 first for BLIK and cards
			if (this.providers.has('przelewy24')) {
				providerName = 'przelewy24';
			} else {
				// If P24 not available, these methods can't be processed
				return {
					success: false,
					error: `${paymentMethod === 'blik' ? 'BLIK' : 'Karta płatnicza'} integration not configured. Please use bank transfer or cash on delivery.`
				};
			}
		}

		const provider = this.getProvider(providerName);

		if (!provider) {
			return {
				success: false,
				error: `Payment method ${paymentMethod} not supported`
			};
		}

		try {
			return await provider.processPayment(order);
		} catch (error) {
			console.error(`Payment error with ${paymentMethod}:`, error);
			return {
				success: false,
				error: 'Payment processing failed'
			};
		}
	}

	async verifyPayment(paymentMethod: string, data: any) {
		const provider = this.getProvider(paymentMethod);

		if (!provider) {
			return {
				success: false,
				error: `Payment method ${paymentMethod} not supported`
			};
		}

		try {
			return await provider.verifyPayment(data);
		} catch (error) {
			console.error(`Verification error with ${paymentMethod}:`, error);
			return {
				success: false,
				error: 'Payment verification failed'
			};
		}
	}
}
