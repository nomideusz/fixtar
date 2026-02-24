import { h as head, c as attr, d as escape_html, e as ensure_array_like, a as attr_class, b as stringify, i as derived } from "../../../../chunks/vendor.js";
import "../../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Button } from "../../../../chunks/Button.js";
import "pocketbase";
import { L as LoadingSpinner } from "../../../../chunks/LoadingSpinner.js";
const pb = null;
function formatDate(isoString) {
  if (!isoString || isoString === "" || isoString.trim() === "") {
    return "N/A";
  }
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleString();
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "N/A";
  }
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let loading = true;
    let customers = [];
    let error = null;
    let searchTerm = "";
    let currentPage = 1;
    let pageSize = 20;
    let totalCustomers = 0;
    async function fetchCustomers() {
      try {
        loading = true;
        error = null;
        const headers = {};
        if (pb && pb.authStore && pb.authStore.token) ;
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString(),
          ...searchTerm && { search: searchTerm }
        });
        const response = await fetch(`/api/admin/customers?${params}`, { headers });
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        customers = data.customers || [];
        totalCustomers = data.total || 0;
      } catch (err) {
        console.error("Error fetching customers:", err);
        error = err instanceof Error ? err.message : "Failed to fetch customers";
        customers = [];
      } finally {
        loading = false;
      }
    }
    const totalPages = derived(() => Math.ceil(totalCustomers / pageSize));
    const hasNextPage = derived(() => currentPage < totalPages());
    const hasPrevPage = derived(() => currentPage > 1);
    head("zvcdha", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Customers - Admin | FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Manage customers"/>`);
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900">Customers</h1> <p class="mt-2 text-gray-600">Manage your customer base</p> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"><p class="text-red-600">Error: ${escape_html(error)}</p> `);
      Button($$renderer2, {
        onclick: fetchCustomers,
        variant: "secondary",
        class: "mt-2",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Retry`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    Card($$renderer2, {
      class: "mb-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex flex-col sm:flex-row gap-4 items-center justify-between"><div class="flex-1 max-w-md"><label for="search" class="sr-only">Search customers</label> <div class="relative"><input id="search" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Search customers by name or email..."${attr("value", searchTerm)}/> <button class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></div></div> <div class="flex items-center gap-2">`);
        Button($$renderer3, {
          onclick: fetchCustomers,
          variant: "secondary",
          children: ($$renderer4) => {
            if (loading) {
              $$renderer4.push("<!--[-->");
              LoadingSpinner($$renderer4, { visible: true });
              $$renderer4.push(`<!----> <span class="ml-2">Refreshing...</span>`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`Refresh`);
            }
            $$renderer4.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      children: ($$renderer3) => {
        if (loading && customers.length === 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="flex justify-center items-center py-12">`);
          LoadingSpinner($$renderer3, { visible: true });
          $$renderer3.push(`<!----></div>`);
        } else if (customers.length === 0) {
          $$renderer3.push("<!--[1-->");
          $$renderer3.push(`<div class="text-center py-12"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> <h3 class="mt-2 text-sm font-medium text-gray-900">No customers found</h3> <p class="mt-1 text-sm text-gray-500">${escape_html("No customers have registered yet.")}</p></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
          const each_array = ensure_array_like(customers);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let customer = each_array[$$index];
            $$renderer3.push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="flex-shrink-0 h-10 w-10"><div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><span class="text-sm font-medium text-blue-600">${escape_html(customer.name ? customer.name.charAt(0).toUpperCase() : customer.email.charAt(0).toUpperCase())}</span></div></div> <div class="ml-4"><div class="text-sm font-medium text-gray-900">${escape_html(customer.name || "No name provided")}</div> <div class="text-sm text-gray-500">Customer ID: ${escape_html(customer.id)}</div></div></div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${escape_html(customer.email)}</div> `);
            if (customer.emailVisibility === false) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="text-xs text-orange-500">Email hidden</div>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${escape_html(formatDate(customer.created))}</td><td class="px-6 py-4 whitespace-nowrap"><span${attr_class(`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stringify(customer.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800")}`)}>${escape_html(customer.verified ? "Verified" : "Unverified")}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${escape_html(customer.orderCount || 0)} orders</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">`);
            Button($$renderer3, {
              href: `/admin/customers/${stringify(customer.id)}`,
              variant: "ghost",
              size: "sm",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->View Details`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></td></tr>`);
          }
          $$renderer3.push(`<!--]--></tbody></table></div> `);
          if (totalPages() > 1) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"><div class="flex items-center justify-between"><div class="flex-1 flex justify-between sm:hidden"><button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", !hasPrevPage(), true)}>Previous</button> <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", !hasNextPage(), true)}>Next</button></div> <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"><div><p class="text-sm text-gray-700">Showing <span class="font-medium">${escape_html((currentPage - 1) * pageSize + 1)}</span> to <span class="font-medium">${escape_html(Math.min(currentPage * pageSize, totalCustomers))}</span> of <span class="font-medium">${escape_html(totalCustomers)}</span> results</p></div> <div><nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"><button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", !hasPrevPage(), true)}><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></button> <!--[-->`);
            const each_array_1 = ensure_array_like(Array(Math.min(5, totalPages())));
            for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
              each_array_1[i];
              const pageNum = i + Math.max(1, currentPage - 2);
              if (pageNum <= totalPages()) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<button${attr_class(`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${stringify(pageNum === currentPage ? "z-10 bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}`)}>${escape_html(pageNum)}</button>`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]-->`);
            }
            $$renderer3.push(`<!--]--> <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", !hasNextPage(), true)}><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></button></nav></div></div></div></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
