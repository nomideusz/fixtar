import { json } from "@sveltejs/kit";
import { P as PaymentService } from "../../../../../chunks/index.js";
import PocketBase from "pocketbase";
import { p as private_env } from "../../../../../chunks/vendor.js";
const POST = async ({ request, url }) => {
  const pb = new PocketBase(private_env.POCKETBASE_URL || "http://127.0.0.1:8090");
  const paymentService = new PaymentService();
  try {
    const provider = url.searchParams.get("provider");
    if (!provider) {
      return json({ status: "ERROR", message: "Provider not specified" }, { status: 400 });
    }
    const data = await request.json();
    const verification = await paymentService.verifyPayment(provider, data);
    if (verification.success) {
      const orderId = data.sessionId || data.orderId || data.order_id;
      if (orderId) {
        await pb.collection("orders").update(orderId, {
          status: "processing",
          paymentDetails: {
            provider,
            transactionId: verification.transactionId,
            status: "completed",
            verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
      }
      return json({ status: "OK" });
    }
    return json({ status: "ERROR", message: "Verification failed" }, { status: 400 });
  } catch (error) {
    console.error("Webhook error:", error);
    return json({ status: "ERROR", message: "Internal server error" }, { status: 500 });
  }
};
export {
  POST
};
