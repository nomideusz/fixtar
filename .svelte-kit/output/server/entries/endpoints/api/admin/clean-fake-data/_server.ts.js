import { json } from "@sveltejs/kit";
import { p as pb } from "../../../../../chunks/pocketbase.js";
const POST = async ({ request, locals }) => {
  {
    const isAdmin = locals.user?.isAdmin || request.headers.get("Authorization")?.startsWith("Bearer ");
    if (!isAdmin) {
      return json({
        success: false,
        message: "Unauthorized. Admin access required."
      }, { status: 403 });
    }
  }
  try {
    const requestData = await request.json();
    const confirmClean = requestData.confirm === true;
    if (!confirmClean) {
      return json({
        success: false,
        message: 'You must confirm the cleanup by sending { "confirm": true }'
      }, { status: 400 });
    }
    console.log("[CLEAN] Starting fake data cleanup...");
    const allCategories = await pb.collection("categories").getList(1, 200, {
      filter: 'metadata.source = "xml_sync"'
    });
    console.log(`[CLEAN] Found ${allCategories.items.length} synced categories to review`);
    const fakeCategories = allCategories.items.filter((category) => {
      const xmlId = parseInt(category.metadata?.xmlId || "0", 10);
      return xmlId > 0 && xmlId <= 10;
    });
    console.log(`[CLEAN] Found ${fakeCategories.length} fake categories to remove`);
    for (const category of fakeCategories) {
      console.log(`[CLEAN] Removing fake category: ${category.name} (xmlId: ${category.metadata.xmlId})`);
      await pb.collection("categories").delete(category.id);
    }
    const fakeProducts = await pb.collection("products").getList(1, 200, {
      filter: 'metadata.source = "xml_sync"'
    });
    console.log(`[CLEAN] Found ${fakeProducts.items.length} synced products to review`);
    let removedProducts = 0;
    for (const product of fakeProducts.items) {
      const categories = Array.isArray(product.categories) ? product.categories : [];
      const hasFakeCategories = categories.some((catId) => {
        return fakeCategories.some((fakeCat) => fakeCat.id === catId);
      });
      const testSkus = ["51744", "50887", "50456", "57234", "52118"];
      const hasFakeSku = testSkus.includes(product.sku);
      if (hasFakeCategories || hasFakeSku) {
        console.log(`[CLEAN] Removing fake product: ${product.name} (SKU: ${product.sku})`);
        await pb.collection("products").delete(product.id);
        removedProducts++;
      }
    }
    console.log("[CLEAN] Fake data cleanup completed");
    return json({
      success: true,
      message: "Fake data cleanup completed successfully",
      removed: {
        categories: fakeCategories.length,
        products: removedProducts
      }
    });
  } catch (error) {
    console.error("[CLEAN] Error during fake data cleanup:", error);
    return json({
      success: false,
      message: "Failed to clean fake data",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
};
export {
  POST
};
