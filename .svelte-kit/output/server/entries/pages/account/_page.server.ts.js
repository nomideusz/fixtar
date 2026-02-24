import { redirect } from "@sveltejs/kit";
import { l as logoutUser, d as deleteSessionCookie } from "../../../chunks/auth.js";
const actions = {
  logout: async (event) => {
    logoutUser(event.locals.pb);
    deleteSessionCookie(event);
    event.cookies.set("pb-auth", "", {
      path: "/",
      expires: /* @__PURE__ */ new Date(0),
      maxAge: 0,
      httpOnly: true
    });
    event.cookies.set("pb-auth_exists", "", {
      path: "/",
      expires: /* @__PURE__ */ new Date(0),
      maxAge: 0,
      httpOnly: false
    });
    return redirect(302, "/auth/login");
  }
};
const load = (async ({ locals, fetch }) => {
  const pb = locals.pb;
  const user = locals.user;
  if (!user) {
    console.log("Account page: No authenticated user found");
    return {
      orders: [],
      cart: null,
      favorites: []
    };
  }
  console.log(`Account page: Authenticated as ${user.username || user.email} (ID: ${user.id})`);
  try {
    let orders = [];
    let cart = null;
    let favorites = [];
    const collections = await pb.collections.getFullList().catch((e) => {
      console.error("Could not get collections:", e);
      return [];
    });
    const collectionMap = {};
    collections.forEach((collection) => {
      collectionMap[collection.name] = true;
    });
    console.log("Available collections:", Object.keys(collectionMap).join(", "));
    if (collectionMap["orders"]) {
      try {
        const sampleOrder = await pb.collection("orders").getFirstListItem("").catch(() => null);
        console.log("Sample order structure:", sampleOrder ? Object.keys(sampleOrder) : "No orders found");
        if (sampleOrder) {
          const userFieldName = Object.keys(sampleOrder).find(
            (key) => key === "user" || key === "userId" || key === "user_id"
          ) || "user";
          console.log(`Using field "${userFieldName}" for user reference in orders`);
          orders = await pb.collection("orders").getList(1, 5, {
            filter: `${userFieldName} = "${user.id}"`,
            sort: "-created"
          }).then((res) => res.items.map((item) => ({
            id: item.id || "",
            orderNumber: item.orderNumber || item.id || "",
            created: item.created || (/* @__PURE__ */ new Date()).toISOString(),
            status: item.status || "processing",
            total: typeof item.total === "number" ? item.total : 0
          }))).catch((e) => {
            console.error(`Error fetching orders with ${userFieldName} filter:`, e);
            return [];
          });
        }
      } catch (e) {
        console.error("Error getting sample order:", e);
      }
    }
    if (collectionMap["carts"]) {
      try {
        const sampleCart = await pb.collection("carts").getFirstListItem("").catch(() => null);
        console.log("Sample cart structure:", sampleCart ? Object.keys(sampleCart) : "No carts found");
        if (sampleCart) {
          const userFieldName = Object.keys(sampleCart).find(
            (key) => key === "user" || key === "userId" || key === "user_id"
          ) || "user";
          console.log(`Using field "${userFieldName}" for user reference in carts`);
          cart = await pb.collection("carts").getFirstListItem(
            `${userFieldName} = "${user.id}" && status = "active"`
          ).catch(() => null);
        }
      } catch (e) {
        console.error("Error getting sample cart:", e);
      }
    }
    const wishlistItems = user.wishlist ? Array.isArray(user.wishlist) ? user.wishlist : [] : [];
    console.log(`User has ${wishlistItems.length} items in wishlist`);
    if (wishlistItems.length > 0 && collectionMap["products"]) {
      try {
        const idFilters = wishlistItems.map((id) => `id = "${id}"`).join(" || ");
        if (idFilters) {
          const result = await pb.collection("products").getFullList({
            filter: idFilters,
            sort: "name"
          }).catch((e) => {
            console.error("Error fetching product details:", e);
            return [];
          });
          favorites = result;
        }
      } catch (e) {
        console.error("Error processing wishlist:", e);
      }
    }
    return {
      orders,
      cart,
      favorites
    };
  } catch (error) {
    console.error("Error fetching account data:", error);
    return {
      orders: [],
      cart: null,
      favorites: [],
      error: "Failed to load account data"
    };
  }
});
export {
  actions,
  load
};
