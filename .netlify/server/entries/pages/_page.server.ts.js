import { p as private_env } from "../../chunks/vendor.js";
import { i as isDemoMode } from "../../chunks/pocketbase.js";
import { m as mockProducts } from "../../chunks/mockData.js";
const POCKETBASE_URL = private_env.POCKETBASE_URL || "https://k.xeon.pl";
const load = async ({ fetch }) => {
  if (isDemoMode()) {
    const demoProducts = mockProducts.slice(0, 8).map((p) => ({
      ...p,
      id: p.id,
      name: p.name,
      slug: p.id,
      price: p.price,
      mainImage: p.image,
      images: [p.image],
      description: p.description || "",
      status: "active",
      inventory: { trackQuantity: true, quantity: 10 }
    }));
    return {
      featuredProducts: demoProducts,
      totalProducts: mockProducts.length
    };
  }
  try {
    const productsUrl = `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=8&filter=${encodeURIComponent('status = "active"')}`;
    const productsResponse = await fetch(productsUrl);
    if (!productsResponse.ok) {
      console.error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
      throw new Error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
    }
    const productsResult = await productsResponse.json();
    const processedProducts = productsResult.items.map((product) => ({
      ...product,
      mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
      images: product.images ? product.images.map((img) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
    }));
    return {
      featuredProducts: processedProducts,
      totalProducts: productsResult.totalItems
    };
  } catch (error) {
    console.error("Error loading homepage data:", error);
    return {
      featuredProducts: [],
      totalProducts: 0,
      error: `Failed to load homepage data: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
};
export {
  load
};
