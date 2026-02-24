import { json } from "@sveltejs/kit";
import { g as getAuthenticatedUser } from "../../../../../chunks/auth.js";
const POST = async ({ request, locals, cookies }) => {
  const user = await getAuthenticatedUser(locals.pb, locals);
  if (!user) {
    return json({
      success: false,
      message: "Authentication required"
    }, { status: 401 });
  }
  try {
    const { guestItems } = await request.json();
    if (!Array.isArray(guestItems)) {
      return json({
        success: false,
        message: "Invalid cart data format"
      }, { status: 400 });
    }
    const pb = locals.pb;
    let serverItems = [];
    let merged = [];
    try {
      const existingCart = await pb.collection("user_carts").getFirstListItem(`user_id="${user.id}"`);
      serverItems = existingCart.items || [];
      merged = [...serverItems];
      for (const guestItem of guestItems) {
        const existingItemIndex = merged.findIndex(
          (item) => item.product.id === guestItem.product.id
        );
        if (existingItemIndex >= 0) {
          merged[existingItemIndex].quantity += guestItem.quantity;
        } else {
          merged.push(guestItem);
        }
      }
      await pb.collection("user_carts").update(existingCart.id, {
        items: merged,
        updated: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (e) {
      merged = guestItems;
      await pb.collection("user_carts").create({
        user_id: user.id,
        items: merged,
        created: (/* @__PURE__ */ new Date()).toISOString(),
        updated: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return json({
      success: true,
      message: "Carts merged successfully",
      items: merged,
      mergeStats: {
        guestItemCount: guestItems.length,
        serverItemCount: serverItems.length,
        mergedItemCount: merged.length
      }
    });
  } catch (err) {
    console.error("Error merging carts:", err);
    return json({
      success: false,
      message: "Error merging carts"
    }, { status: 500 });
  }
};
export {
  POST
};
