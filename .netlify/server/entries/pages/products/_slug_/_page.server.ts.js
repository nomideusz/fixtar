import { error } from "@sveltejs/kit";
import { p as private_env } from "../../../../chunks/vendor.js";
import { i as isDemoMode } from "../../../../chunks/pocketbase.js";
import { m as mockProducts } from "../../../../chunks/mockData.js";
const POCKETBASE_URL = private_env.POCKETBASE_URL || "https://k.xeon.pl";
const load = async ({ params, fetch }) => {
  if (isDemoMode()) {
    const mockProduct = mockProducts.find((p) => p.id === params.slug);
    if (!mockProduct) {
      throw error(404, "Product not found");
    }
    const product = {
      id: mockProduct.id,
      name: mockProduct.name,
      slug: mockProduct.id,
      price: mockProduct.price,
      mainImage: mockProduct.image,
      gallery: [mockProduct.image],
      images: [mockProduct.image],
      description: mockProduct.description || "",
      status: "active",
      inventory: { trackQuantity: true, quantity: 10 },
      categories: [mockProduct.category]
    };
    const relatedProducts = mockProducts.filter((p) => p.category === mockProduct.category && p.id !== mockProduct.id).slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.id,
      price: p.price,
      mainImage: p.image,
      gallery: [p.image],
      description: p.description || "",
      status: "active",
      inventory: { trackQuantity: true, quantity: 10 }
    }));
    return { product, relatedProducts };
  }
  try {
    let product;
    try {
      const slugResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent(`slug='${params.slug}' && status = "active"`)}&expand=categories`
      );
      if (slugResponse.ok) {
        const slugData = await slugResponse.json();
        if (slugData.items && slugData.items.length > 0) {
          product = slugData.items[0];
        } else {
          throw new Error("Product not found by slug");
        }
      } else {
        throw new Error("Slug query failed");
      }
    } catch (slugError) {
      try {
        const idResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/products/records/${params.slug}?expand=categories`
        );
        if (idResponse.ok) {
          const productData = await idResponse.json();
          if (productData.status !== "active") {
            throw error(404, "Product not found");
          }
          product = productData;
        } else {
          throw error(404, "Product not found");
        }
      } catch (idError) {
        throw error(404, "Product not found");
      }
    }
    let relatedProducts = [];
    try {
      console.log("Fetching related products for:", product.id, "Categories:", product.categories);
      if (product.categories) {
        const categories = Array.isArray(product.categories) ? product.categories : [product.categories];
        const categoryFilters = categories.map(
          (catId) => `categories ~ '${catId}'`
        ).join(" || ");
        const categoryResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=8&filter=${encodeURIComponent(`(${categoryFilters}) && status = "active" && id != "${product.id}"`)}&expand=categories`
        );
        console.log("Category filter:", `(${categoryFilters}) && status = "active" && id != "${product.id}"`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          relatedProducts = categoryData.items || [];
          console.log("Found category-related products:", relatedProducts.length);
        } else {
          console.warn("Category query failed:", await categoryResponse.text());
        }
      }
      if (relatedProducts.length < 4) {
        const priceMin = Math.round(product.price * 0.5 * 100) / 100;
        const priceMax = Math.round(product.price * 2 * 100) / 100;
        const priceResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=${8 - relatedProducts.length}&filter=${encodeURIComponent(`price >= ${priceMin} && price <= ${priceMax} && status = "active" && id != "${product.id}"`)}&expand=categories`
        );
        console.log("Price filter:", `price >= ${priceMin} && price <= ${priceMax} && status = "active" && id != "${product.id}"`);
        if (priceResponse.ok) {
          const priceData = await priceResponse.json();
          const priceProducts = (priceData.items || []).filter((p) => !relatedProducts.find((rp) => rp.id === p.id));
          relatedProducts = [...relatedProducts, ...priceProducts];
          console.log("Added price-related products, total:", relatedProducts.length);
        } else {
          console.warn("Price query failed:", await priceResponse.text());
        }
      }
      if (relatedProducts.length < 4) {
        const featuredResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=${8 - relatedProducts.length}&filter=${encodeURIComponent(`featured = true && status = "active" && id != "${product.id}"`)}&expand=categories`
        );
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          const featuredProducts = (featuredData.items || []).filter((p) => !relatedProducts.find((rp) => rp.id === p.id));
          relatedProducts = [...relatedProducts, ...featuredProducts];
          console.log("Added featured products, total:", relatedProducts.length);
        } else {
          console.warn("Featured query failed:", await featuredResponse.text());
        }
      }
      if (relatedProducts.length < 4) {
        const fallbackResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=${8 - relatedProducts.length}&filter=${encodeURIComponent(`status = "active" && id != "${product.id}"`)}&expand=categories`
        );
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackProducts = (fallbackData.items || []).filter((p) => !relatedProducts.find((rp) => rp.id === p.id));
          relatedProducts = [...relatedProducts, ...fallbackProducts];
          console.log("Added fallback products, final total:", relatedProducts.length);
        } else {
          console.warn("Fallback query failed:", await fallbackResponse.text());
        }
      }
      relatedProducts = relatedProducts.slice(0, 4);
      console.log("Final related products count:", relatedProducts.length);
    } catch (relatedError) {
      console.warn("Failed to fetch related products:", relatedError);
    }
    const processedProduct = {
      ...product,
      mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
      gallery: product.gallery ? product.gallery.map((img) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
    };
    console.log("Processing product images:");
    console.log("Product ID:", product.id);
    console.log("Original mainImage:", product.mainImage);
    console.log("Processed mainImage URL:", processedProduct.mainImage);
    console.log("Original gallery:", product.gallery);
    console.log("Processed gallery URLs:", processedProduct.gallery);
    console.log("PocketBase URL:", POCKETBASE_URL);
    const processedRelatedProducts = relatedProducts.map((relatedProduct) => ({
      ...relatedProduct,
      mainImage: relatedProduct.mainImage ? `${POCKETBASE_URL}/api/files/products/${relatedProduct.id}/${relatedProduct.mainImage}` : null,
      gallery: relatedProduct.gallery ? relatedProduct.gallery.map((img) => `${POCKETBASE_URL}/api/files/products/${relatedProduct.id}/${img}`) : []
    }));
    return {
      product: processedProduct,
      relatedProducts: processedRelatedProducts
    };
  } catch (err) {
    console.error("Error loading product:", err);
    throw error(404, "Product not found");
  }
};
export {
  load
};
