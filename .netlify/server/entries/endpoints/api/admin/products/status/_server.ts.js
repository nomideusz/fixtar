import { json } from "@sveltejs/kit";
import { c as createPocketBaseClient } from "../../../../../../chunks/pocketbase.js";
import { p as private_env } from "../../../../../../chunks/vendor.js";
const POST = async ({ request, locals }) => {
  try {
    if (!locals.isAuthenticated || !locals.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    const { productIds, status, action } = await request.json();
    if (!["active", "draft", "inactive"].includes(status)) {
      return json({ error: "Invalid status" }, { status: 400 });
    }
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return json({ error: "No products selected" }, { status: 400 });
    }
    const pb = createPocketBaseClient();
    try {
      await pb.collection("_superusers").authWithPassword(
        private_env.PB_ADMIN_EMAIL,
        private_env.PB_ADMIN_PASSWORD
      );
    } catch (authError) {
      console.error("Admin auth failed:", authError);
      return json({ error: "Authentication failed" }, { status: 500 });
    }
    const results = [];
    const errors = [];
    for (const productId of productIds) {
      try {
        const updatedProduct = await pb.collection("products").update(productId, {
          status,
          updated: (/* @__PURE__ */ new Date()).toISOString()
        });
        results.push({
          id: productId,
          status: updatedProduct.status,
          name: updatedProduct.name
        });
      } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        errors.push({
          id: productId,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    return json({
      success: true,
      updated: results.length,
      errorsCount: errors.length,
      results,
      errors
    });
  } catch (error) {
    console.error("Error updating product statuses:", error);
    return json({
      error: error instanceof Error ? error.message : "Failed to update product statuses"
    }, { status: 500 });
  }
};
const GET = async ({ url, locals }) => {
  try {
    if (!locals.isAuthenticated || !locals.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    const productId = url.searchParams.get("id");
    if (!productId) {
      return json({ error: "Product ID required" }, { status: 400 });
    }
    const pb = createPocketBaseClient();
    try {
      await pb.collection("_superusers").authWithPassword(
        private_env.PB_ADMIN_EMAIL,
        private_env.PB_ADMIN_PASSWORD
      );
    } catch (authError) {
      console.error("Admin auth failed:", authError);
      return json({ error: "Authentication failed" }, { status: 500 });
    }
    const product = await pb.collection("products").getOne(productId);
    return json({
      id: product.id,
      name: product.name,
      sku: product.sku,
      status: product.status,
      price: product.price
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return json({
      error: error instanceof Error ? error.message : "Failed to fetch product"
    }, { status: 500 });
  }
};
export {
  GET,
  POST
};
