import { p as private_env } from "../../../chunks/vendor.js";
import { d as dedupedFetch, s as serverCache, p as parallelLimit } from "../../../chunks/performance.js";
import { i as isDemoMode } from "../../../chunks/pocketbase.js";
import { m as mockProducts, a as mockCategories } from "../../../chunks/mockData.js";
const POCKETBASE_URL = private_env.POCKETBASE_URL || "https://k.xeon.pl";
const CACHE_KEYS = {
  CATEGORIES: "categories_with_counts",
  PRODUCTS: (page, filters, sort) => `products_${page}_${Buffer.from(filters + sort).toString("base64")}`
};
const CACHE_TTL = {
  CATEGORIES: 5 * 60 * 1e3,
  // 5 minutes
  PRODUCTS: 1 * 60 * 1e3
  // 1 minute
};
async function fetchCategoriesWithCounts(fetch) {
  return dedupedFetch(CACHE_KEYS.CATEGORIES, async () => {
    const cached = serverCache.get(CACHE_KEYS.CATEGORIES);
    if (cached) {
      return cached;
    }
    try {
      const [mainCategoriesResponse, allSubcategoriesResponse] = await Promise.all([
        fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=parent=""&sort=displayOrder,name&perPage=50`),
        fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=parent!=""&sort=displayOrder,name&perPage=200`)
      ]);
      if (!mainCategoriesResponse.ok || !allSubcategoriesResponse.ok) {
        throw new Error("Failed to fetch categories");
      }
      const [categoriesResult, subcategoriesResult] = await Promise.all([
        mainCategoriesResponse.json(),
        allSubcategoriesResponse.json()
      ]);
      const categoryToSubcategoriesMap = /* @__PURE__ */ new Map();
      subcategoriesResult.items.forEach((sub) => {
        if (!categoryToSubcategoriesMap.has(sub.parent)) {
          categoryToSubcategoriesMap.set(sub.parent, []);
        }
        categoryToSubcategoriesMap.get(sub.parent).push(sub.id);
      });
      const allCategoryIds = [
        ...categoriesResult.items.map((cat) => cat.id),
        ...subcategoriesResult.items.map((sub) => sub.id)
      ];
      const categoryCountResults = await parallelLimit(
        allCategoryIds,
        async (categoryId) => {
          const countFilter = `categories = "${categoryId}" && status = "active"`;
          const response = await fetch(
            `${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1&filter=${encodeURIComponent(countFilter)}`
          );
          if (response.ok) {
            const result2 = await response.json();
            return { categoryId, count: result2.totalItems || 0 };
          }
          return { categoryId, count: 0 };
        },
        10
        // Limit concurrent requests to 10
      );
      const categoryCountsMap = new Map(
        categoryCountResults.map(({ categoryId, count }) => [categoryId, count])
      );
      const categoriesWithCounts = categoriesResult.items.map((category) => {
        const subcategoryIds = categoryToSubcategoriesMap.get(category.id) || [];
        const mainCategoryCount = categoryCountsMap.get(category.id) || 0;
        const subcategoriesCount = subcategoryIds.reduce(
          (total, subId) => total + (categoryCountsMap.get(subId) || 0),
          0
        );
        return {
          ...category,
          productCount: mainCategoryCount + subcategoriesCount
        };
      }).filter((cat) => cat.productCount > 0);
      const subcategoriesWithCounts = subcategoriesResult.items.map((subcategory) => ({
        ...subcategory,
        productCount: categoryCountsMap.get(subcategory.id) || 0
      })).filter((sub) => sub.productCount > 0);
      const result = {
        categories: categoriesWithCounts,
        subcategories: subcategoriesWithCounts,
        allSubcategories: subcategoriesWithCounts
      };
      serverCache.set(CACHE_KEYS.CATEGORIES, result, CACHE_TTL.CATEGORIES);
      return result;
    } catch (error) {
      console.error("Error fetching categories with counts:", error);
      return {
        categories: [],
        subcategories: [],
        allSubcategories: []
      };
    }
  });
}
async function fetchProducts(fetch, searchQuery, selectedCategory, sortBy, currentPage, itemsPerPage) {
  const filters = `${searchQuery}|${selectedCategory}`;
  const cacheKey = CACHE_KEYS.PRODUCTS(currentPage, filters, sortBy);
  return dedupedFetch(cacheKey, async () => {
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const queryParams = [
        `page=${currentPage}`,
        `perPage=${itemsPerPage}`
      ];
      const filterList = [];
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        filterList.push(`(name ~ "${searchTerm}" || description ~ "${searchTerm}" || shortDescription ~ "${searchTerm}" || sku ~ "${searchTerm}")`);
      }
      if (selectedCategory.trim()) {
        const categoryResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=slug="${selectedCategory}"`);
        if (categoryResponse.ok) {
          const categoryResult = await categoryResponse.json();
          if (categoryResult.items.length > 0) {
            const category = categoryResult.items[0];
            const categoryId = category.id;
            if (category.parent) {
              filterList.push(`categories = "${categoryId}"`);
            } else {
              const subcategoriesResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=parent="${categoryId}"&perPage=200`);
              if (subcategoriesResponse.ok) {
                const subcategoriesResult = await subcategoriesResponse.json();
                const subcategoryIds = subcategoriesResult.items.map((sub) => sub.id);
                const categoryFilters = [`categories = "${categoryId}"`];
                subcategoryIds.forEach((subId) => {
                  categoryFilters.push(`categories = "${subId}"`);
                });
                filterList.push(`(${categoryFilters.join(" || ")})`);
              } else {
                filterList.push(`categories = "${categoryId}"`);
              }
            }
          }
        }
      }
      filterList.push(`status = "active"`);
      if (filterList.length > 0) {
        queryParams.push(`filter=${encodeURIComponent(filterList.join(" && "))}`);
      }
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
      queryParams.push(`sort=${sortParam}`);
      queryParams.push("expand=categories");
      const queryString = queryParams.join("&");
      const productsUrl = `${POCKETBASE_URL}/api/collections/products/records?${queryString}`;
      const productsResponse = await fetch(productsUrl);
      if (!productsResponse.ok) {
        throw new Error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
      }
      const productsResult = await productsResponse.json();
      const processedProducts = productsResult.items.map((product) => ({
        ...product,
        mainImage: product.mainImage ? `${POCKETBASE_URL}/api/files/products/${product.id}/${product.mainImage}` : null,
        images: product.gallery ? product.gallery.map((img) => `${POCKETBASE_URL}/api/files/products/${product.id}/${img}`) : []
      }));
      const result = {
        products: processedProducts,
        totalPages: productsResult.totalPages,
        totalItems: productsResult.totalItems
      };
      serverCache.set(cacheKey, result, CACHE_TTL.PRODUCTS);
      return result;
    } catch (error) {
      console.error("Error loading products:", error);
      return {
        products: [],
        totalPages: 1,
        totalItems: 0,
        error: `Failed to load products: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  });
}
const load = async ({ url, fetch }) => {
  const searchQuery = url.searchParams.get("search") || "";
  const selectedCategory = url.searchParams.get("category") || "";
  const sortBy = url.searchParams.get("sort") || "name";
  const currentPage = parseInt(url.searchParams.get("page") || "1");
  const itemsPerPage = 12;
  if (isDemoMode()) {
    let filteredProducts = mockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.id,
      price: p.price,
      mainImage: p.image,
      images: [p.image],
      description: p.description || "",
      status: "active",
      inventory: { trackQuantity: true, quantity: 10 },
      categories: [p.category]
    }));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
      );
    }
    if (selectedCategory.trim()) {
      filteredProducts = filteredProducts.filter(
        (p) => p.categories?.includes(selectedCategory)
      );
    }
    if (sortBy === "price-low") filteredProducts.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") filteredProducts.sort((a, b) => b.price - a.price);
    else filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    const demoCategories = mockCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.id,
      image: c.image,
      productCount: c.count
    }));
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paged = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return {
      products: paged,
      categories: demoCategories,
      subcategories: [],
      allSubcategories: [],
      totalPages,
      totalItems,
      currentPage,
      searchQuery,
      selectedCategory,
      sortBy,
      itemsPerPage
    };
  }
  try {
    const [categoryData, productData] = await Promise.all([
      fetchCategoriesWithCounts(fetch),
      fetchProducts(fetch, searchQuery, selectedCategory, sortBy, currentPage, itemsPerPage)
    ]);
    let selectedCategorySubcategories = [];
    if (selectedCategory.trim()) {
      const allCategories = [...categoryData.categories, ...categoryData.subcategories];
      const foundCategory = allCategories.find((cat) => cat.slug === selectedCategory);
      if (foundCategory) {
        selectedCategorySubcategories = categoryData.subcategories.filter(
          (sub) => sub.parent === foundCategory.id
        );
      } else {
        const categoryResponse = await fetch(`${POCKETBASE_URL}/api/collections/categories/records?filter=slug="${selectedCategory}"`);
        if (categoryResponse.ok) {
          const categoryResult = await categoryResponse.json();
          if (categoryResult.items.length > 0) {
            const categoryId = categoryResult.items[0].id;
            selectedCategorySubcategories = categoryData.subcategories.filter(
              (sub) => sub.parent === categoryId
            );
          }
        }
      }
    }
    return {
      products: productData.products,
      categories: categoryData.categories,
      subcategories: selectedCategorySubcategories,
      allSubcategories: categoryData.allSubcategories,
      totalPages: productData.totalPages,
      totalItems: productData.totalItems,
      currentPage,
      searchQuery,
      selectedCategory,
      sortBy,
      itemsPerPage,
      error: productData.error
    };
  } catch (error) {
    console.error("Error in page load:", error);
    return {
      products: [],
      categories: [],
      subcategories: [],
      allSubcategories: [],
      totalPages: 1,
      totalItems: 0,
      currentPage: 1,
      searchQuery: "",
      selectedCategory: "",
      sortBy: "name",
      itemsPerPage: 12,
      error: `Failed to load page: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
};
export {
  load
};
