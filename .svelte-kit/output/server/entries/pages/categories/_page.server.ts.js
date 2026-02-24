import { p as private_env } from "../../../chunks/vendor.js";
const POCKETBASE_URL = private_env.POCKETBASE_URL || "https://k.xeon.pl";
const load = async ({ fetch }) => {
  try {
    const categoriesUrl = `${POCKETBASE_URL}/api/collections/categories/records?page=1&perPage=50`;
    const categoriesResponse = await fetch(categoriesUrl);
    if (!categoriesResponse.ok) {
      throw new Error(`Categories API error: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
    }
    const categoriesResult = await categoriesResponse.json();
    const categoriesWithCounts = await Promise.all(
      categoriesResult.items.map(async (category) => {
        try {
          const productCountUrl = `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent(`categories = "${category.id}" && status = "active"`)}`;
          const productCountResponse = await fetch(productCountUrl);
          if (!productCountResponse.ok) {
            console.error(`Failed to count products for category ${category.name}`);
            return {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              image: category.image ? `${POCKETBASE_URL}/api/files/categories/${category.id}/${category.image}` : null,
              featured: category.featured,
              displayOrder: category.displayOrder,
              productCount: 0,
              createdAt: category.created,
              updatedAt: category.updated
            };
          }
          const productCountResult = await productCountResponse.json();
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image ? `${POCKETBASE_URL}/api/files/categories/${category.id}/${category.image}` : null,
            featured: category.featured,
            displayOrder: category.displayOrder,
            productCount: productCountResult.totalItems || 0,
            createdAt: category.created,
            updatedAt: category.updated
          };
        } catch (error) {
          console.error(`Failed to count products for category ${category.name}:`, error);
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image ? `${POCKETBASE_URL}/api/files/categories/${category.id}/${category.image}` : null,
            featured: category.featured,
            displayOrder: category.displayOrder,
            productCount: 0,
            createdAt: category.created,
            updatedAt: category.updated
          };
        }
      })
    );
    return {
      categories: categoriesWithCounts
    };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return {
      categories: [],
      error: `Failed to load categories: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
};
export {
  load
};
