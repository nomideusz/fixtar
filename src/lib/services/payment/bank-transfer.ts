import type { PaymentProvider, PaymentOrder, PaymentResult, VerificationResult } from './types';

export class BankTransferProvider implements PaymentProvider {
	name = 'bank_transfer';

	private bankDetails = {
		accountNumber: 'PL 78 1050 1445 1000 0092 7832 9553',
		accountName: 'FixTar',
		bankName: 'ING Bank Śląski',
		swift: 'INGBPLPW'
	};

	async processPayment(order: PaymentOrder): Promise<PaymentResult> {
		// For bank transfers, we just return the bank details
		// The customer will make the transfer manually

		const reference = `FixTar-${order.orderNumber}`;

		return {
			success: true,
			bankDetails: {
				...this.bankDetails,
				reference,
				amount: `${order.amount.toFixed(2)} ${order.currency}`
			}
		};
	}

	async verifyPayment(data: any): Promise<VerificationResult> {
		// Bank transfers would be verified manually or via bank API
		// This is a placeholder implementation
		return {
			success: true,
			transactionId: data.transactionId
		};
	}
}
