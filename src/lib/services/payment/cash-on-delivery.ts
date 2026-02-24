import type { PaymentProvider, PaymentOrder, PaymentResult, VerificationResult } from './types';

export class CashOnDeliveryProvider implements PaymentProvider {
  name = 'cod';
  
  private codFee = 5.00; // PLN
  
  async processPayment(order: PaymentOrder): Promise<PaymentResult> {
    // For COD, we don't need to redirect anywhere
    // Just mark the order as ready for processing
    
    return {
      success: true,
      transactionId: `COD-${order.orderNumber}`
    };
  }
  
  async verifyPayment(data: any): Promise<VerificationResult> {
    // COD payments are verified when the courier confirms delivery
    return {
      success: true,
      transactionId: data.transactionId
    };
  }
  
  getCodFee(): number {
    return this.codFee;
  }
} 