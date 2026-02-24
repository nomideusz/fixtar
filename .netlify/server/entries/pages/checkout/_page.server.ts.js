import { fail } from "@sveltejs/kit";
import { P as PaymentService } from "../../../chunks/index.js";
const POLISH_VOIVODESHIPS = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie"
];
const load = async ({ locals }) => {
  const pb = locals.pb;
  const user = locals.user;
  console.log("[Checkout] Loading checkout data...");
  try {
    let addresses = [];
    if (user) {
      try {
        addresses = await pb.collection("addresses").getFullList({
          filter: `user = "${user.id}"`,
          sort: "-default,created"
        });
        console.log("[Checkout] Loaded addresses:", addresses.length);
      } catch (e) {
        console.error("[Checkout] Error fetching addresses:", e);
      }
    }
    let shippingMethods = [];
    try {
      shippingMethods = await pb.collection("shipping_methods").getFullList({
        filter: "active = true",
        sort: "displayOrder,name"
      });
      console.log("[Checkout] Loaded shipping methods from DB:", shippingMethods.length);
    } catch (e) {
      console.error("[Checkout] Error fetching shipping methods:", e);
    }
    if (shippingMethods.length === 0) {
      shippingMethods = [
        {
          id: "standard",
          name: "Poczta Polska",
          description: "Dostawa w 3-5 dni roboczych",
          cost: 12.99,
          freeShippingThreshold: 150,
          estimatedDeliveryDays: "3-5"
        },
        {
          id: "express",
          name: "Kurier DPD",
          description: "Dostawa następnego dnia roboczego",
          cost: 19.99,
          freeShippingThreshold: 300,
          estimatedDeliveryDays: "1-2"
        },
        {
          id: "inpost",
          name: "InPost Paczkomat",
          description: "Dostawa do paczkomatu w 1-2 dni",
          cost: 9.99,
          freeShippingThreshold: 100,
          estimatedDeliveryDays: "1-2"
        }
      ];
      console.log("[Checkout] Using fallback shipping methods:", shippingMethods.length);
    }
    let paymentMethods = [];
    try {
      paymentMethods = await pb.collection("payment_methods").getFullList({
        filter: "active = true",
        sort: "displayOrder,name"
      });
      console.log("[Checkout] Loaded payment methods from DB:", paymentMethods.length);
    } catch (e) {
      console.error("[Checkout] Error fetching payment methods:", e);
    }
    if (paymentMethods.length === 0) {
      paymentMethods = [
        {
          id: "blik",
          code: "blik",
          name: "BLIK",
          type: "digital_wallet",
          description: "Płatność kodem BLIK",
          icon: null
        },
        {
          id: "card",
          code: "card",
          name: "Karta płatnicza",
          type: "credit_card",
          description: "Visa, Mastercard, Maestro",
          icon: null
        },
        {
          id: "transfer",
          code: "bank_transfer",
          name: "Przelew tradycyjny",
          type: "bank_transfer",
          description: "Przelew bankowy",
          icon: null
        },
        {
          id: "p24",
          code: "przelewy24",
          name: "Przelewy24",
          type: "digital_wallet",
          description: "Szybkie płatności online",
          icon: null
        },
        {
          id: "cod",
          code: "cod",
          name: "Płatność przy odbiorze",
          type: "cash_on_delivery",
          description: "Zapłać kurierowi przy odbiorze",
          processingFee: 5,
          feeType: "fixed"
        }
      ];
      console.log("[Checkout] Using fallback payment methods:", paymentMethods.length);
    }
    const result = {
      addresses,
      shippingMethods,
      paymentMethods,
      voivodeships: POLISH_VOIVODESHIPS,
      user
    };
    console.log("[Checkout] Returning data:", {
      addresses: result.addresses.length,
      shippingMethods: result.shippingMethods.length,
      paymentMethods: result.paymentMethods.length,
      voivodeships: result.voivodeships.length,
      hasUser: !!result.user
    });
    return result;
  } catch (e) {
    console.error("[Checkout] Critical error loading checkout data:", e);
    return {
      addresses: [],
      shippingMethods: [],
      paymentMethods: [],
      voivodeships: POLISH_VOIVODESHIPS,
      user
    };
  }
};
const actions = {
  placeOrder: async ({ request, locals, url }) => {
    const pb = locals.pb;
    const user = locals.user;
    try {
      const formData = await request.formData();
      const orderData = {
        // Contact info
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        // Shipping address
        shippingAddress: {
          firstName: formData.get("firstName")?.toString() || "",
          lastName: formData.get("lastName")?.toString() || "",
          company: formData.get("company")?.toString() || "",
          street: formData.get("street")?.toString() || "",
          apartment: formData.get("apartment")?.toString() || "",
          city: formData.get("city")?.toString() || "",
          voivodeship: formData.get("voivodeship")?.toString() || "",
          postalCode: formData.get("postalCode")?.toString() || "",
          country: "Poland"
        },
        // Payment and shipping
        paymentMethod: formData.get("paymentMethod")?.toString() || "",
        shippingMethod: formData.get("shippingMethod")?.toString() || "",
        // Additional info
        nip: formData.get("nip")?.toString() || "",
        notes: formData.get("notes")?.toString() || "",
        // Cart items (should be passed from client)
        items: JSON.parse(formData.get("items")?.toString() || "[]"),
        subtotal: parseFloat(formData.get("subtotal")?.toString() || "0"),
        shippingCost: parseFloat(formData.get("shippingCost")?.toString() || "0"),
        tax: parseFloat(formData.get("tax")?.toString() || "0"),
        total: parseFloat(formData.get("total")?.toString() || "0")
      };
      if (!orderData.email || !orderData.shippingAddress.firstName || !orderData.shippingAddress.lastName || !orderData.shippingAddress.street || !orderData.shippingAddress.city || !orderData.shippingAddress.postalCode || !orderData.paymentMethod || !orderData.shippingMethod) {
        return fail(400, {
          success: false,
          message: "Proszę wypełnić wszystkie wymagane pola"
        });
      }
      const orderNumber = `PL${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
      const orderDataToCreate = {
        orderNumber,
        user: user?.id || null,
        status: "pending",
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.shippingAddress,
        // Same as shipping for now
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
          userAgent: request.headers.get("user-agent"),
          ip: request.headers.get("x-forwarded-for") || "unknown"
        }
      };
      console.log("[Checkout] Creating order with data:", JSON.stringify(orderDataToCreate, null, 2));
      const paymentService = new PaymentService();
      const appUrl = url.origin;
      let actualPaymentMethod = orderData.paymentMethod;
      let paymentDetails = null;
      const testPaymentResult = await paymentService.processPayment(orderData.paymentMethod, {
        orderId: "test",
        // Temporary ID for testing
        orderNumber,
        amount: orderData.total,
        currency: "PLN",
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
      if (!testPaymentResult.success && (testPaymentResult.error?.includes("not configured") || testPaymentResult.error?.includes("not supported"))) {
        console.log(`[Checkout] Payment method ${orderData.paymentMethod} not configured, will use bank transfer`);
        const bankResult = await paymentService.processPayment("bank_transfer", {
          orderId: "temp",
          orderNumber,
          amount: orderData.total,
          currency: "PLN",
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
        actualPaymentMethod = "bank_transfer";
        paymentDetails = {
          provider: "bank_transfer",
          originalMethod: orderData.paymentMethod,
          transactionId: bankResult.transactionId,
          bankDetails: bankResult.bankDetails,
          status: "pending"
        };
      } else if (testPaymentResult.success) {
        paymentDetails = {
          provider: orderData.paymentMethod,
          transactionId: testPaymentResult.transactionId,
          bankDetails: testPaymentResult.bankDetails,
          status: "pending"
        };
      }
      orderDataToCreate.paymentMethod = actualPaymentMethod;
      if (paymentDetails) {
        orderDataToCreate.metadata = {
          ...orderDataToCreate.metadata,
          paymentDetails
        };
      }
      const order = await pb.collection("orders").create(orderDataToCreate);
      console.log("[Checkout] Order created successfully:", order.id);
      if (actualPaymentMethod === "bank_transfer" && orderData.paymentMethod !== "bank_transfer") {
        return {
          success: true,
          redirectUrl: `/checkout/success?order=${order.id}&payment=bank_transfer&fallback=true`
        };
      } else if (testPaymentResult.redirectUrl) {
        return {
          success: true,
          redirectUrl: testPaymentResult.redirectUrl.replace("order=temp", `order=${order.id}`)
        };
      } else if (actualPaymentMethod === "bank_transfer") {
        return {
          success: true,
          redirectUrl: `/checkout/success?order=${order.id}&payment=bank_transfer`
        };
      } else {
        return {
          success: true,
          redirectUrl: `/checkout/success?order=${order.id}`
        };
      }
    } catch (e) {
      if (e && typeof e === "object" && "status" in e && "location" in e) {
        console.log("Order created successfully, redirecting to:", e.location);
        throw e;
      }
      if (e instanceof Response) throw e;
      console.error("Error creating order:", e);
      let errorMessage = "Wystąpił błąd podczas składania zamówienia";
      if (e && typeof e === "object" && "response" in e) {
        const pbError = e;
        if (pbError.response?.data) {
          console.error("PocketBase error details:", pbError.response.data);
          if (pbError.response.data.data) {
            const fieldErrors = Object.entries(pbError.response.data.data).map(([field, error2]) => `${field}: ${error2.message || error2}`).join(", ");
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
export {
  actions,
  load
};
