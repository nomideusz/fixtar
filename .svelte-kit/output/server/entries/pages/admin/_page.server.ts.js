import { p as private_env } from "../../../chunks/vendor.js";
const POCKETBASE_URL = private_env.POCKETBASE_URL || "https://k.xeon.pl";
const load = async ({ fetch }) => {
  try {
    const productsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1`);
    const productsResult = productsResponse.ok ? await productsResponse.json() : { totalItems: 0 };
    const activeProductsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent('status = "active"')}`);
    const activeProductsResult = activeProductsResponse.ok ? await activeProductsResponse.json() : { totalItems: 0 };
    const draftProductsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent('status = "draft"')}`);
    const draftProductsResult = draftProductsResponse.ok ? await draftProductsResponse.json() : { totalItems: 0 };
    const categoriesResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?page=1&perPage=1`);
    const categoriesResult = categoriesResponse.ok ? await categoriesResponse.json() : { totalItems: 0 };
    const ordersResponse = await fetch(`${POCKETBASE_URL}/api/collections/orders/records?page=1&perPage=1`);
    const ordersResult = ordersResponse.ok ? await ordersResponse.json() : { totalItems: 0 };
    const totalRevenue = ordersResult.totalItems * 75.5;
    const recentProductsResponse = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=5&sort=-created&expand=categories`);
    const recentProducts = recentProductsResponse.ok ? await recentProductsResponse.json() : { items: [] };
    return {
      stats: {
        totalProducts: productsResult.totalItems,
        activeProducts: activeProductsResult.totalItems,
        draftProducts: draftProductsResult.totalItems,
        totalCategories: categoriesResult.totalItems,
        totalOrders: ordersResult.totalItems,
        totalRevenue
      },
      recentProducts: recentProducts.items.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        status: product.status,
        created: product.created,
        categories: product.expand?.categories || []
      }))
    };
  } catch (error) {
    console.error("Failed to load admin dashboard data:", error);
    return {
      stats: {
        totalProducts: 0,
        activeProducts: 0,
        draftProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0
      },
      recentProducts: [],
      error: error instanceof Error ? error.message : "Failed to load dashboard data"
    };
  }
};
export {
  load
};
