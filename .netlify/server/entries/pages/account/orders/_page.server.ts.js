import { error } from "@sveltejs/kit";
const load = (async ({ locals, url }) => {
  const pb = locals.pb;
  const user = locals.user;
  if (!user) {
    throw error(401, "Unauthorized");
  }
  try {
    const page = Number(url.searchParams.get("page") || "1");
    const perPage = Number(url.searchParams.get("perPage") || "10");
    if (!pb || typeof pb.collection !== "function") {
      console.error("PocketBase instance is not properly initialized");
      return {
        orders: [],
        totalOrders: 0,
        totalPages: 1,
        page: 1,
        error: "Database connection issue"
      };
    }
    console.log(`Orders page: User ID=${user.id}, Username=${user.username || user.email}`);
    try {
      const possibleUserFields = ["user", "userId", "user_id"];
      let ordersResult = null;
      let userFieldName = "user";
      for (const fieldName of possibleUserFields) {
        try {
          console.log(`Trying to fetch orders with field: ${fieldName}`);
          ordersResult = await pb.collection("orders").getList(page, perPage, {
            filter: `${fieldName} = "${user.id}"`
          });
          userFieldName = fieldName;
          console.log(`Successfully fetched orders using field: ${fieldName}`);
          break;
        } catch (e) {
          console.log(`Field ${fieldName} failed:`, e.message);
          continue;
        }
      }
      if (ordersResult) {
        try {
          const sortedResult = await pb.collection("orders").getList(page, perPage, {
            filter: `${userFieldName} = "${user.id}"`,
            sort: "-created"
          });
          ordersResult = sortedResult;
          console.log("Applied sorting successfully");
        } catch (e) {
          console.log("Sorting failed, using unsorted results:", e.message);
        }
      }
      if (!ordersResult) {
        console.log("No valid user field found for orders collection");
        return {
          orders: [],
          totalOrders: 0,
          totalPages: 1,
          page,
          error: "Orders collection is not properly configured. Please contact support."
        };
      }
      const orders = ordersResult.items.map((item) => ({
        id: item.id || "",
        orderNumber: item.orderNumber || item.id || "",
        created: item.created || (/* @__PURE__ */ new Date()).toISOString(),
        status: item.status || "processing",
        total: typeof item.total === "number" ? item.total : 0
      }));
      console.log(`Successfully loaded ${orders.length} orders for user`);
      return {
        orders,
        totalOrders: ordersResult.totalItems,
        totalPages: ordersResult.totalPages,
        page
      };
    } catch (err) {
      console.error("Error fetching orders:", err);
      let errorMessage = "Failed to load orders";
      if (err.status === 400) {
        errorMessage = "Orders collection is not accessible. This feature may not be set up yet.";
      } else if (err.status === 403) {
        errorMessage = "You do not have permission to view orders.";
      } else if (err.status === 404) {
        errorMessage = "Orders collection not found. This feature is not available.";
      }
      return {
        orders: [],
        totalOrders: 0,
        totalPages: 1,
        page,
        error: errorMessage
      };
    }
  } catch (err) {
    console.error("Error in orders load function:", err);
    return {
      orders: [],
      totalOrders: 0,
      totalPages: 1,
      page: 1,
      error: "Failed to load orders"
    };
  }
});
export {
  load
};
