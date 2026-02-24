import { error } from "@sveltejs/kit";
import { p as private_env } from "../../../../chunks/vendor.js";
const POCKETBASE_URL = private_env.POCKETBASE_URL || "https://k.xeon.pl";
const load = async ({ params, locals, fetch }) => {
  const orderId = params.id;
  if (!orderId) {
    throw error(404, "Order not found");
  }
  try {
    const orderResponse = await fetch(`${POCKETBASE_URL}/api/collections/orders/records/${orderId}`);
    if (!orderResponse.ok) {
      if (orderResponse.status === 404) {
        throw error(404, "Order not found");
      }
      throw error(500, "Failed to fetch order");
    }
    const order = await orderResponse.json();
    const user = locals.user;
    if (!user) {
      throw error(401, "Please log in to view your orders");
    }
    if (order.user !== user.id && user.role !== "admin") {
      throw error(403, "You do not have permission to view this order");
    }
    const itemsWithProducts = await Promise.all(
      order.items.map(async (item) => {
        try {
          const productResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records/${item.productId}`);
          if (productResponse.ok) {
            const product = await productResponse.json();
            return {
              ...item,
              product: {
                ...product,
                mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
                images: product.gallery ? product.gallery.map((img) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
              }
            };
          }
        } catch (error2) {
          console.error(`Failed to fetch product ${item.productId}:`, error2);
        }
        return item;
      })
    );
    return {
      order: {
        ...order,
        items: itemsWithProducts
      },
      user
    };
  } catch (err) {
    console.error("Error loading order:", err);
    if (err instanceof Response) {
      throw err;
    }
    throw error(500, "Failed to load order details");
  }
};
export {
  load
};
