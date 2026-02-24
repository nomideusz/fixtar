import { h as head, d as escape_html, e as ensure_array_like, c as attr, a as attr_class, o as goto, q as invalidateAll, b as stringify } from "../../../../chunks/vendor.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import { C as Card } from "../../../../chunks/Card.js";
import "../../../../chunks/notifications-simple.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let searchQuery = data.filters.search;
    let statusFilter = data.filters.status;
    let categoryFilter = data.filters.category;
    let sortBy = data.filters.sort;
    let sortOrder = data.filters.order;
    let selectedProducts = /* @__PURE__ */ new Set();
    let isLoading = false;
    let bulkAction = "";
    let showBulkConfirm = false;
    let toastMessage = "";
    let toastType = "success";
    let showToast = false;
    function showToastNotification(message, type = "success") {
      toastMessage = message;
      toastType = type;
      showToast = true;
      setTimeout(
        () => {
          showToast = false;
        },
        4e3
      );
    }
    function updateFilters() {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      if (sortBy !== "created") params.set("sort", sortBy);
      if (sortOrder !== "desc") params.set("order", sortOrder);
      `/admin/products${params.toString() ? "?" + params.toString() : ""}`;
      goto();
    }
    function clearFilters() {
      searchQuery = "";
      statusFilter = "";
      categoryFilter = "";
      sortBy = "created";
      sortOrder = "desc";
      updateFilters();
    }
    async function bulkUpdateStatus(newStatus) {
      if (selectedProducts.size === 0) return;
      isLoading = true;
      try {
        const response = await fetch("/api/admin/products/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productIds: Array.from(selectedProducts),
            status: newStatus,
            action: "bulk_update"
          })
        });
        const result = await response.json();
        if (result.success) {
          selectedProducts = /* @__PURE__ */ new Set();
          await invalidateAll();
          showToastNotification(`Successfully updated ${result.updated} products to ${newStatus}`);
        } else {
          showToastNotification(`Error: ${result.error}`, "error");
        }
      } catch (error) {
        showToastNotification(`Error updating products: ${error}`, "error");
      } finally {
        isLoading = false;
        showBulkConfirm = false;
        bulkAction = "";
      }
    }
    async function updateProductStatus(productId, newStatus) {
      isLoading = true;
      try {
        const response = await fetch("/api/admin/products/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: [productId], status: newStatus })
        });
        const result = await response.json();
        if (result.success) {
          await invalidateAll();
        } else {
          showToastNotification(`Error: ${result.error}`, "error");
        }
      } catch (error) {
        showToastNotification(`Error updating product: ${error}`, "error");
      } finally {
        isLoading = false;
      }
    }
    function goToPage(page) {
      const params = new URLSearchParams(window.location.search);
      if (page > 1) {
        params.set("page", page.toString());
      } else {
        params.delete("page");
      }
      `/admin/products${params.toString() ? "?" + params.toString() : ""}`;
      goto();
    }
    function handleBulkAction() {
      if (!bulkAction || selectedProducts.size === 0) return;
      showBulkConfirm = true;
    }
    head("6t53h5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Manage Products - Admin - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Manage your store products"/>`);
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="flex justify-between items-center mb-8"><div><h1 class="text-3xl font-bold text-gray-900">Manage Products</h1> <p class="mt-2 text-gray-600">${escape_html(data.pagination.totalItems)} products in catalog</p> <div class="mt-2 flex items-center gap-4 text-sm text-gray-500"><span>• Change product statuses and visibility</span> <span>• Search and filter all products</span> <a href="/admin/xml-products" class="text-blue-600 hover:text-blue-800 font-medium">→ Manage XML Product Pricing</a></div></div> <div class="flex gap-4">`);
    Button($$renderer2, {
      href: "/admin/xml-products",
      variant: "secondary",
      children: ($$renderer3) => {
        $$renderer3.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path></svg> XML Pricing`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Button($$renderer2, {
      href: "/admin/xml-sync",
      variant: "secondary",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Sync Products`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div> `);
    if (data.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"><div class="flex items-center"><svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p class="text-red-600">Error: ${escape_html(data.error)}</p></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">`);
    Card($$renderer2, {
      class: "p-4",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">Active Products</p> <p class="text-2xl font-bold text-green-600">${escape_html(data.statusCounts.active)}</p> <p class="text-xs text-gray-500 mt-1">Visible to customers</p></div> <button class="text-green-600 hover:text-green-800 transition-colors" title="View active products"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-4",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">Draft Products</p> <p class="text-2xl font-bold text-orange-600">${escape_html(data.statusCounts.draft)}</p> <p class="text-xs text-gray-500 mt-1">Awaiting review</p></div> <button class="text-orange-600 hover:text-orange-800 transition-colors" title="View draft products"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg></button></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-4",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">Inactive Products</p> <p class="text-2xl font-bold text-gray-600">${escape_html(data.statusCounts.inactive)}</p> <p class="text-xs text-gray-500 mt-1">Hidden from store</p></div> <button class="text-gray-600 hover:text-gray-800 transition-colors" title="View inactive products"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path></svg></button></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> `);
    Card($$renderer2, {
      class: "p-6 mb-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-4"><h3 class="text-lg font-medium text-gray-900 mb-2">Search &amp; Filter Products</h3> <p class="text-sm text-gray-600">Find products by name, SKU, or filter by status and category</p></div> <form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label> `);
        Input($$renderer3, {
          id: "search",
          type: "search",
          placeholder: "Search by name, SKU...",
          value: searchQuery,
          oninput: (e) => searchQuery = e.currentTarget.value
        });
        $$renderer3.push(`<!----></div> <div><label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label> `);
        $$renderer3.select(
          {
            id: "status",
            value: statusFilter,
            onchange: (e) => {
              statusFilter = e.currentTarget.value;
              updateFilters();
            },
            class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          },
          ($$renderer4) => {
            $$renderer4.option({ value: "" }, ($$renderer5) => {
              $$renderer5.push(`All Statuses`);
            });
            $$renderer4.option({ value: "active" }, ($$renderer5) => {
              $$renderer5.push(`✅ Active (visible)`);
            });
            $$renderer4.option({ value: "draft" }, ($$renderer5) => {
              $$renderer5.push(`⚠️ Draft (hidden)`);
            });
            $$renderer4.option({ value: "inactive" }, ($$renderer5) => {
              $$renderer5.push(`❌ Inactive (disabled)`);
            });
          }
        );
        $$renderer3.push(`</div> <div><label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label> `);
        $$renderer3.select(
          {
            id: "category",
            value: categoryFilter,
            onchange: (e) => {
              categoryFilter = e.currentTarget.value;
              updateFilters();
            },
            class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          },
          ($$renderer4) => {
            $$renderer4.option({ value: "" }, ($$renderer5) => {
              $$renderer5.push(`All Categories`);
            });
            $$renderer4.push(`<!--[-->`);
            const each_array = ensure_array_like(data.categories);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let category = each_array[$$index];
              $$renderer4.option({ value: category.id }, ($$renderer5) => {
                $$renderer5.push(`${escape_html(category.name)}`);
              });
            }
            $$renderer4.push(`<!--]-->`);
          }
        );
        $$renderer3.push(`</div> <div class="flex items-end space-x-2">`);
        Button($$renderer3, {
          type: "submit",
          size: "sm",
          disabled: isLoading,
          children: ($$renderer4) => {
            if (isLoading) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> Search`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          type: "button",
          variant: "ghost",
          size: "sm",
          onclick: clearFilters,
          disabled: isLoading,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Clear`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div></form>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    if (selectedProducts.size > 0) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-4 mb-6 bg-blue-50 border-blue-200",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="flex items-center"><svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p class="font-medium text-blue-900">${escape_html(selectedProducts.size)} products selected</p></div> `);
          $$renderer3.select(
            {
              value: bulkAction,
              onchange: (e) => bulkAction = e.currentTarget.value,
              class: "px-3 py-1 border border-blue-300 rounded-md text-sm bg-white",
              disabled: isLoading
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "" }, ($$renderer5) => {
                $$renderer5.push(`Choose action...`);
              });
              $$renderer4.option({ value: "active" }, ($$renderer5) => {
                $$renderer5.push(`✅ Set as Active (visible)`);
              });
              $$renderer4.option({ value: "draft" }, ($$renderer5) => {
                $$renderer5.push(`⚠️ Set as Draft (hidden)`);
              });
              $$renderer4.option({ value: "inactive" }, ($$renderer5) => {
                $$renderer5.push(`❌ Set as Inactive (disabled)`);
              });
            }
          );
          $$renderer3.push(`</div> <div class="flex items-center space-x-2">`);
          Button($$renderer3, {
            size: "sm",
            onclick: handleBulkAction,
            disabled: !bulkAction || isLoading,
            children: ($$renderer4) => {
              if (isLoading) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Updating...`);
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`Apply Action`);
              }
              $$renderer4.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            size: "sm",
            variant: "ghost",
            onclick: () => selectedProducts = /* @__PURE__ */ new Set(),
            disabled: isLoading,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Clear Selection`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b bg-gray-50"><th class="text-left py-3 px-4 w-8"><input type="checkbox"${attr("checked", selectedProducts.size === data.products.length && data.products.length > 0, true)} class="rounded border-gray-300"/></th><th class="text-left py-3 px-4"><button class="flex items-center hover:text-blue-600">Product `);
        if (sortBy === "name") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<svg${attr_class(`w-4 h-4 ml-1 ${stringify(sortOrder === "asc" ? "rotate-180" : "")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></button></th><th class="text-left py-3 px-4"><button class="flex items-center hover:text-blue-600">SKU `);
        if (sortBy === "sku") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<svg${attr_class(`w-4 h-4 ml-1 ${stringify(sortOrder === "asc" ? "rotate-180" : "")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></button></th><th class="text-left py-3 px-4"><button class="flex items-center hover:text-blue-600">Price `);
        if (sortBy === "price") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<svg${attr_class(`w-4 h-4 ml-1 ${stringify(sortOrder === "asc" ? "rotate-180" : "")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></button></th><th class="text-left py-3 px-4">Categories</th><th class="text-left py-3 px-4"><button class="flex items-center hover:text-blue-600">Status &amp; Actions `);
        if (sortBy === "status") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<svg${attr_class(`w-4 h-4 ml-1 ${stringify(sortOrder === "asc" ? "rotate-180" : "")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></button></th></tr></thead><tbody><!--[-->`);
        const each_array_1 = ensure_array_like(data.products);
        for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
          let product = each_array_1[$$index_2];
          $$renderer3.push(`<tr class="border-b hover:bg-gray-50"><td class="py-3 px-4"><input type="checkbox"${attr("checked", selectedProducts.has(product.id), true)} class="rounded border-gray-300"/></td><td class="py-3 px-4"><div class="flex items-center">`);
          if (product.mainImage) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<img${attr("src", product.mainImage)}${attr("alt", product.name)} class="w-12 h-12 rounded object-cover mr-3"/>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div class="w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`);
          }
          $$renderer3.push(`<!--]--> <div><p class="font-medium text-gray-900 truncate max-w-xs">${escape_html(product.name)}</p> `);
          if (product.shortDescription) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="text-sm text-gray-500 truncate max-w-xs">${escape_html(product.shortDescription)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div></div></td><td class="py-3 px-4 text-gray-600 font-mono text-sm">${escape_html(product.sku || "-")}</td><td class="py-3 px-4 font-medium">${escape_html(product.price.toFixed(2))} zł</td><td class="py-3 px-4">`);
          if (product.expand?.categories && product.expand.categories.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="flex flex-wrap gap-1"><!--[-->`);
            const each_array_2 = ensure_array_like(product.expand.categories.slice(0, 2));
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let category = each_array_2[$$index_1];
              $$renderer3.push(`<span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${escape_html(category.name)}</span>`);
            }
            $$renderer3.push(`<!--]--> `);
            if (product.expand.categories.length > 2) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<span class="text-xs text-gray-500">+${escape_html(product.expand.categories.length - 2)} more</span>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<span class="text-gray-400">No categories</span>`);
          }
          $$renderer3.push(`<!--]--></td><td class="px-6 py-4 whitespace-nowrap"><div class="space-y-2"><div class="flex items-center">`);
          if (product.status === "active") {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Active</span>`);
          } else if (product.status === "draft") {
            $$renderer3.push("<!--[1-->");
            $$renderer3.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg> Draft</span>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path></svg> Inactive</span>`);
          }
          $$renderer3.push(`<!--]--> `);
          if (isLoading) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<svg class="w-4 h-4 animate-spin text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div> `);
          $$renderer3.select(
            {
              value: product.status,
              onchange: (e) => updateProductStatus(product.id, e.currentTarget.value),
              class: "w-full text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50",
              disabled: isLoading,
              title: "Change product status"
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "active" }, ($$renderer5) => {
                $$renderer5.push(`✅ Set as Active`);
              });
              $$renderer4.option({ value: "draft" }, ($$renderer5) => {
                $$renderer5.push(`⚠️ Set as Draft`);
              });
              $$renderer4.option({ value: "inactive" }, ($$renderer5) => {
                $$renderer5.push(`❌ Set as Inactive`);
              });
            }
          );
          $$renderer3.push(`</div> <div class="mt-1 text-xs text-gray-500">`);
          if (product.status === "active") {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`Visible to customers`);
          } else if (product.status === "draft") {
            $$renderer3.push("<!--[1-->");
            $$renderer3.push(`Hidden, needs review`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`Disabled and hidden`);
          }
          $$renderer3.push(`<!--]--></div></td></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody></table> `);
        if (data.products.length === 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="text-center py-8 text-gray-500">${escape_html(data.filters.search || data.filters.status || data.filters.category ? "No products found matching your filters." : "No products in catalog.")}</div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    if (data.pagination.totalPages > 1) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-6 flex justify-center"><nav class="flex items-center space-x-2">`);
      Button($$renderer2, {
        onclick: () => goToPage(data.pagination.currentPage - 1),
        disabled: data.pagination.currentPage <= 1,
        variant: "ghost",
        size: "sm",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Previous`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <!--[-->`);
      const each_array_3 = ensure_array_like(Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
        const start = Math.max(1, data.pagination.currentPage - 2);
        return start + i;
      }));
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let pageNum = each_array_3[$$index_3];
        if (pageNum <= data.pagination.totalPages) {
          $$renderer2.push("<!--[-->");
          Button($$renderer2, {
            onclick: () => goToPage(pageNum),
            variant: pageNum === data.pagination.currentPage ? "primary" : "ghost",
            size: "sm",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->${escape_html(pageNum)}`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--> `);
      Button($$renderer2, {
        onclick: () => goToPage(data.pagination.currentPage + 1),
        disabled: data.pagination.currentPage >= data.pagination.totalPages,
        variant: "ghost",
        size: "sm",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Next`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></nav></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (showBulkConfirm) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">`);
      Card($$renderer2, {
        class: "max-w-md w-full",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="p-6"><h3 class="text-lg font-semibold mb-4">Confirm Bulk Action</h3> <p class="text-gray-600 mb-6">Are you sure you want to set ${escape_html(selectedProducts.size)} selected products to "${escape_html(bulkAction)}" status?</p> <div class="flex justify-end space-x-3">`);
          Button($$renderer3, {
            variant: "ghost",
            onclick: () => {
              showBulkConfirm = false;
              bulkAction = "";
            },
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Cancel`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            onclick: () => bulkUpdateStatus(bulkAction),
            disabled: isLoading,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(isLoading ? "Updating..." : "Confirm")}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showToast) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">`);
      Card($$renderer2, {
        class: "max-w-md w-full",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="p-6"><h3 class="text-lg font-semibold mb-4">`);
          if (toastType === "success") {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`✅ Success`);
          } else if (toastType === "error") {
            $$renderer3.push("<!--[1-->");
            $$renderer3.push(`❌ Error`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`ℹ️ Info`);
          }
          $$renderer3.push(`<!--]--></h3> <p class="text-gray-600 mb-6">${escape_html(toastMessage)}</p> <div class="flex justify-end space-x-3">`);
          Button($$renderer3, {
            variant: "ghost",
            onclick: () => {
              showToast = false;
              toastMessage = "";
              toastType = "success";
            },
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Close`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
