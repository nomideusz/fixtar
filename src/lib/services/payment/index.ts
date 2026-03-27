import type { PaymentProvider, PaymentOrder } from './types';
import { BankTransferProvider } from './bank-transfer';
import { CashOnDeliveryProvider } from './cash-on-delivery';
import { Przelewy24Provider } from './przelewy24';

export * from './types';

export class PaymentService {
	private providers: Map<string, PaymentProvider> = new Map();
	private p24: Przelewy24Provider;

	constructor() {
		this.registerProvider(new BankTransferProvider());
		this.registerProvider(new CashOnDeliveryProvider());

		// P24 is always instantiated but only routes to it if configured
		this.p24 = new Przelewy24Provider();
		if (this.p24.isConfigured) {
			this.registerProvider(this.p24);
		}
	}

	get isP24Available(): boolean {
		return this.p24.isConfigured;
	}

	registerProvider(provider: PaymentProvider) {
		this.providers.set(provider.name, provider);
	}

	getProvider(name: string): PaymentProvider | null {
		return this.providers.get(name) || null;
	}

	async processPayment(paymentMethod: string, order: PaymentOrder) {
		let providerName = paymentMethod;

		// Route online payment methods through P24
		if (paymentMethod === 'blik' || paymentMethod === 'card' || paymentMethod === 'przelewy24') {
			if (this.isP24Available) {
				providerName = 'przelewy24';
			} else {
				return {
					success: false,
					error: 'Płatności online nie są jeszcze dostępne. Wybierz płatność przy odbiorze.'
				};
			}
		}

		const provider = this.getProvider(providerName);

		if (!provider) {
			return {
				success: false,
				error: `Metoda płatności "${paymentMethod}" nie jest obsługiwana.`
			};
		}

		try {
			return await provider.processPayment(order);
		} catch (error) {
			console.error(`Payment error with ${paymentMethod}:`, error);
			return {
				success: false,
				error: 'Przetwarzanie płatności nie powiodło się.'
			};
		}
	}

	async verifyPayment(paymentMethod: string, data: any) {
		const provider = this.getProvider(paymentMethod);

		if (!provider) {
			return {
				success: false,
				error: `Metoda płatności "${paymentMethod}" nie jest obsługiwana.`
			};
		}

		try {
			return await provider.verifyPayment(data);
		} catch (error) {
			console.error(`Verification error with ${paymentMethod}:`, error);
			return {
				success: false,
				error: 'Weryfikacja płatności nie powiodła się.'
			};
		}
	}
}
