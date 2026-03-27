import type { PaymentProvider, PaymentOrder, PaymentResult, VerificationResult } from './types';
import { createHash } from 'crypto';
import { env } from '$env/dynamic/private';

export class Przelewy24Provider implements PaymentProvider {
	name = 'przelewy24';

	private get merchantId(): number {
		return parseInt(env.P24_MERCHANT_ID || '0');
	}

	private get posId(): number {
		return parseInt(env.P24_POS_ID || env.P24_MERCHANT_ID || '0');
	}

	private get crcKey(): string {
		return env.P24_CRC || '';
	}

	private get apiKey(): string {
		return env.P24_API_KEY || '';
	}

	private get apiUrl(): string {
		return 'https://secure.przelewy24.pl';
	}

	get isConfigured(): boolean {
		return this.merchantId > 0 && !!this.crcKey && !!this.apiKey;
	}

	private get authHeader(): string {
		return 'Basic ' + Buffer.from(`${this.posId}:${this.apiKey}`).toString('base64');
	}

	private sha384(input: string): string {
		return createHash('sha384').update(input).digest('hex');
	}

	/**
	 * Register transaction with P24 API.
	 * Returns a token used to redirect the customer to the payment page.
	 */
	async processPayment(order: PaymentOrder): Promise<PaymentResult> {
		if (!this.isConfigured) {
			return {
				success: false,
				error: 'Przelewy24 nie jest skonfigurowane. Dodaj dane dostępowe P24.'
			};
		}

		const amountInGrosze = Math.round(order.amount * 100);

		// CRC for transaction/register: SHA384("{sessionId}|{merchantId}|{amount}|{currency}|{crc}")
		const sign = this.sha384(
			`${order.orderId}|${this.merchantId}|${amountInGrosze}|${order.currency}|${this.crcKey}`
		);

		const body = {
			merchantId: this.merchantId,
			posId: this.posId,
			sessionId: order.orderId,
			amount: amountInGrosze,
			currency: order.currency,
			description: order.description,
			email: order.email,
			client: `${order.customerData.firstName} ${order.customerData.lastName}`,
			phone: order.customerData.phone || '',
			country: 'PL',
			language: 'pl',
			urlReturn: order.returnUrl,
			urlStatus: order.webhookUrl,
			sign
		};

		try {
			const response = await fetch(`${this.apiUrl}/api/v1/transaction/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.authHeader
				},
				body: JSON.stringify(body)
			});

			const result = await response.json();

			if (result.data?.token) {
				return {
					success: true,
					transactionId: result.data.token,
					redirectUrl: `${this.apiUrl}/trnRequest/${result.data.token}`
				};
			}

			console.error('[P24] Register failed:', result);
			return {
				success: false,
				error: result.error || 'Nie udało się zarejestrować transakcji w Przelewy24.'
			};
		} catch (err: any) {
			console.error('[P24] Request error:', err);
			return {
				success: false,
				error: 'Błąd połączenia z Przelewy24.'
			};
		}
	}

	/**
	 * Verify transaction after P24 sends a webhook notification.
	 * P24 POST body contains: merchantId, posId, sessionId, amount, currency, orderId, sign
	 */
	async verifyPayment(data: any): Promise<VerificationResult> {
		if (!this.isConfigured) {
			return { success: false, error: 'P24 not configured' };
		}

		const amountInGrosze = data.amount;

		// CRC for verification: SHA384("{sessionId}|{orderId}|{amount}|{currency}|{crc}")
		const sign = this.sha384(
			`${data.sessionId}|${data.orderId}|${amountInGrosze}|${data.currency}|${this.crcKey}`
		);

		const body = {
			merchantId: this.merchantId,
			posId: this.posId,
			sessionId: data.sessionId,
			amount: amountInGrosze,
			currency: data.currency,
			orderId: data.orderId,
			sign
		};

		try {
			const response = await fetch(`${this.apiUrl}/api/v1/transaction/verify`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.authHeader
				},
				body: JSON.stringify(body)
			});

			const result = await response.json();

			if (result.data?.status === 'success') {
				return {
					success: true,
					transactionId: String(data.orderId)
				};
			}

			console.error('[P24] Verify failed:', result);
			return {
				success: false,
				error: result.error || 'Weryfikacja płatności nie powiodła się.'
			};
		} catch (err: any) {
			console.error('[P24] Verify request error:', err);
			return { success: false, error: 'Błąd połączenia z Przelewy24.' };
		}
	}
}
