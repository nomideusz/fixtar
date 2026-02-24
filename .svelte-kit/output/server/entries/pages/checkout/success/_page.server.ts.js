import { error } from "@sveltejs/kit";
const load = async ({ url, locals }) => {
  const pb = locals.pb;
  const orderId = url.searchParams.get("order");
  if (!orderId) {
    return {
      order: null
    };
  }
  try {
    const order = await pb.collection("orders").getOne(orderId, {
      expand: "user"
    });
    const user = locals.user;
    if (order.user && order.user !== user?.id && !user?.isAdmin) {
      throw error(403, "Brak dostępu do tego zamówienia");
    }
    return {
      order
    };
  } catch (e) {
    console.error("Error fetching order:", e);
    return {
      order: null
    };
  }
};
export {
  load
};
