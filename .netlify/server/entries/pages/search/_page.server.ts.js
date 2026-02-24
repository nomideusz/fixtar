import { p as private_env } from "../../../chunks/vendor.js";
import { d as dedupedFetch, s as serverCache } from "../../../chunks/performance.js";
const POCKETBASE_URL = private_env.POCKETBASE_URL || "https://k.xeon.pl";
const SEARCH_CACHE_KEYS = {
  CATEGORIES: "search_categories",
  RESULTS: (query, category, minPrice, maxPrice, sortBy) => `search_${Buffer.from(`${query}|${category}|${minPrice}|${maxPrice}|${sortBy}`).toString("base64")}`
};
const SEARCH_CACHE_TTL = {
  CATEGORIES: 5 * 60 * 1e3,
  // 5 minutes
  RESULTS: 2 * 60 * 1e3
  // 2 minutes (shorter for search results)
};
async function fetchCategoriesForSearch(fetch) {
  return dedupedFetch(SEARCH_CACHE_KEYS.CATEGORIES, async () => {
    const cached = serverCache.get(SEARCH_CACHE_KEYS.CATEGORIES);
    if (cached) {
      return cached;
    }
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?sort=name&perPage=100`);
      if (!response.ok) {
        throw new Error(`Categories fetch failed: ${response.status}`);
      }
      const result = await response.json();
      const categories = result.items;
      serverCache.set(SEARCH_CACHE_KEYS.CATEGORIES, categories, SEARCH_CACHE_TTL.CATEGORIES);
      return categories;
    } catch (error) {
      console.error("Error fetching categories for search:", error);
      return [];
    }
  });
}
async function performSearch(fetch, query, category, minPrice, maxPrice, sortBy) {
  const cacheKey = SEARCH_CACHE_KEYS.RESULTS(query, category, minPrice, maxPrice, sortBy);
  return dedupedFetch(cacheKey, async () => {
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const filters = ['status="active"'];
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(" ").filter((term) => term.length > 0);
        const searchFilters = searchTerms.map(
          (term) => `(name ~ "${term}" || description ~ "${term}" || shortDescription ~ "${term}" || sku ~ "${term}")`
        );
        filters.push(`(${searchFilters.join(" && ")})`);
      }
      if (category) {
        filters.push(`categories ~ "${category}"`);
      }
      if (minPrice > 0) {
        filters.push(`price >= ${minPrice}`);
      }
      if (maxPrice < 1e4) {
        filters.push(`price <= ${maxPrice}`);
      }
      const filterString = filters.join(" && ");
      let sortParam = "";
      switch (sortBy) {
        case "price-low":
          sortParam = "price";
          break;
        case "price-high":
          sortParam = "-price";
          break;
        case "name":
        default:
          sortParam = "name";
          break;
      }
      const queryParams = new URLSearchParams({
        filter: filterString,
        sort: sortParam,
        perPage: "50",
        // Reasonable limit for search results
        expand: "categories"
      });
      const url = `${POCKETBASE_URL}/api/collections/products/records?${queryParams}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      const processedProducts = result.items.map((product) => ({
        ...product,
        mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
        images: product.gallery ? product.gallery.map((img) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
      }));
      const searchResult = {
        products: processedProducts,
        totalResults: result.totalItems || 0
      };
      serverCache.set(cacheKey, searchResult, SEARCH_CACHE_TTL.RESULTS);
      return searchResult;
    } catch (error) {
      console.error("Search error:", error);
      return {
        products: [],
        totalResults: 0,
        error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  });
}
const load = async ({ url, fetch }) => {
  const query = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(url.searchParams.get("maxPrice") || "10000");
  const sortBy = url.searchParams.get("sort") || "name";
  try {
    const [categories, searchResults] = await Promise.all([
      fetchCategoriesForSearch(fetch),
      performSearch(fetch, query, category, minPrice, maxPrice, sortBy)
    ]);
    return {
      query,
      category,
      minPrice,
      maxPrice,
      sortBy,
      categories,
      products: searchResults.products,
      totalResults: searchResults.totalResults,
      error: searchResults.error,
      searchQuery: query
      // For consistency with the frontend
    };
  } catch (error) {
    console.error("Error in search page load:", error);
    return {
      query: "",
      category: "",
      minPrice: 0,
      maxPrice: 1e4,
      sortBy: "name",
      categories: [],
      products: [],
      totalResults: 0,
      error: `Failed to load search page: ${error instanceof Error ? error.message : "Unknown error"}`,
      searchQuery: query
    };
  }
};
export {
  load
};
