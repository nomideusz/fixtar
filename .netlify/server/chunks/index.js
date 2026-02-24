class BankTransferProvider {
  constructor() {
    this.name = "bank_transfer";
    this.bankDetails = {
      accountNumber: "PL 78 1050 1445 1000 0092 7832 9553",
      accountName: "FixTar",
      bankName: "ING Bank Śląski",
      swift: "INGBPLPW"
    };
  }
  async processPayment(order) {
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
  async verifyPayment(data) {
    return {
      success: true,
      transactionId: data.transactionId
    };
  }
}
class CashOnDeliveryProvider {
  constructor() {
    this.name = "cod";
    this.codFee = 5;
  }
  // PLN
  async processPayment(order) {
    return {
      success: true,
      transactionId: `COD-${order.orderNumber}`
    };
  }
  async verifyPayment(data) {
    return {
      success: true,
      transactionId: data.transactionId
    };
  }
  getCodFee() {
    return this.codFee;
  }
}
class PaymentService {
  constructor() {
    this.providers = /* @__PURE__ */ new Map();
    this.registerProvider(new BankTransferProvider());
    this.registerProvider(new CashOnDeliveryProvider());
  }
  registerProvider(provider) {
    this.providers.set(provider.name, provider);
  }
  getProvider(name) {
    return this.providers.get(name) || null;
  }
  async processPayment(paymentMethod, order) {
    let providerName = paymentMethod;
    if (paymentMethod === "blik" || paymentMethod === "card") {
      if (this.providers.has("przelewy24")) {
        providerName = "przelewy24";
      } else {
        return {
          success: false,
          error: `${paymentMethod === "blik" ? "BLIK" : "Karta płatnicza"} integration not configured. Please use bank transfer or cash on delivery.`
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
        error: "Payment processing failed"
      };
    }
  }
  async verifyPayment(paymentMethod, data) {
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
        error: "Payment verification failed"
      };
    }
  }
}
export {
  PaymentService as P
};
