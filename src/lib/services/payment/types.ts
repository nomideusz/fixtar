export interface PaymentProvider {
	name: string;
	processPayment(order: PaymentOrder): Promise<PaymentResult>;
	verifyPayment(data: any): Promise<VerificationResult>;
}

export interface PaymentOrder {
	orderId: string;
	orderNumber: string;
	amount: number; // in PLN
	currency: string;
	email: string;
	description: string;
	customerData: {
		firstName: string;
		lastName: string;
		phone?: string;
	};
	returnUrl: string;
	webhookUrl: string;
}

export interface PaymentResult {
	success: boolean;
	redirectUrl?: string;
	transactionId?: string;
	bankDetails?: BankTransferDetails;
	error?: string;
}

export interface BankTransferDetails {
	accountNumber: string;
	accountName: string;
	bankName: string;
	swift: string;
	reference: string;
	amount: string;
}

export interface VerificationResult {
	success: boolean;
	transactionId?: string;
	error?: string;
}

export type PaymentStatus =
	| 'pending'
	| 'processing'
	| 'completed'
	| 'failed'
	| 'cancelled'
	| 'refunded';
