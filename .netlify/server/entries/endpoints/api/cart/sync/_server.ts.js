import { json } from "@sveltejs/kit";
import { g as getAuthenticatedUser } from "../../../../../chunks/auth.js";
const GET = async ({ locals, cookies }) => {
  const user = await getAuthenticatedUser(locals.pb, locals);
  if (!user) {
    return json({
      success: false,
      message: "Authentication required",
      items: []
    }, { status: 401 });
  }
  try {
    const pb = locals.pb;
    try {
      const userCart = await pb.collection("user_carts").getFirstListItem(`user_id="${user.id}"`);
      return json({
        success: true,
        items: userCart.items || [],
        last_sync: userCart.updated
      });
    } catch (e) {
      console.log("User cart not found in database, will create on first sync");
      return json({
        success: true,
        items: [],
        last_sync: null
      });
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
    return json({
      success: false,
      message: "Error fetching cart",
      items: []
    }, { status: 500 });
  }
};
const POST = async ({ request, locals, cookies }) => {
  const user = await getAuthenticatedUser(locals.pb, locals);
  if (!user) {
    return json({
      success: false,
      message: "Authentication required"
    }, { status: 401 });
  }
  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return json({
        success: false,
        message: "Invalid cart data format"
      }, { status: 400 });
    }
    const pb = locals.pb;
    try {
      const existingCart = await pb.collection("user_carts").getFirstListItem(`user_id="${user.id}"`);
      await pb.collection("user_carts").update(existingCart.id, {
        items,
        updated: (/* @__PURE__ */ new Date()).toISOString()
      });
      return json({
        success: true,
        message: "Cart updated successfully",
        last_sync: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (e) {
      await pb.collection("user_carts").create({
        user_id: user.id,
        items,
        created: (/* @__PURE__ */ new Date()).toISOString(),
        updated: (/* @__PURE__ */ new Date()).toISOString()
      });
      return json({
        success: true,
        message: "Cart created successfully",
        last_sync: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  } catch (err) {
    console.error("Error updating cart:", err);
    return json({
      success: false,
      message: "Error updating cart"
    }, { status: 500 });
  }
};
export {
  GET,
  POST
};
