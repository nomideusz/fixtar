import { h as head, d as escape_html, e as ensure_array_like, a as attr_class, b as stringify, i as derived } from "../../../chunks/vendor.js";
import "../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const activePercentage = derived(() => data.stats.totalProducts > 0 ? Math.round(data.stats.activeProducts / data.stats.totalProducts * 100) : 0);
    const draftPercentage = derived(() => data.stats.totalProducts > 0 ? Math.round(data.stats.draftProducts / data.stats.totalProducts * 100) : 0);
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin Dashboard - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Admin dashboard for managing the store"/>`);
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-neutral-900">Admin Dashboard</h1> <p class="mt-2 text-neutral-600">Manage your store from one place</p> `);
    if (data.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"><p class="text-red-600">Warning: ${escape_html(data.error)}</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">`);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm text-neutral-600">Total Products</p> <p class="text-2xl font-bold text-neutral-900">${escape_html(data.stats.totalProducts)}</p> <p class="text-xs text-neutral-500 mt-1">All products in system</p></div> <div class="p-3 bg-purple-100 rounded-full"><svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm text-neutral-600">Active Products</p> <p class="text-2xl font-bold text-green-600">${escape_html(data.stats.activeProducts)}</p> <p class="text-xs text-neutral-500 mt-1">${escape_html(activePercentage())}% of total products</p></div> <div class="p-3 bg-green-100 rounded-full"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm text-neutral-600">Draft Products</p> <p class="text-2xl font-bold text-orange-600">${escape_html(data.stats.draftProducts)}</p> <p class="text-xs text-neutral-500 mt-1">${escape_html(draftPercentage())}% waiting for review</p></div> <div class="p-3 bg-orange-100 rounded-full"><svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm text-neutral-600">Categories</p> <p class="text-2xl font-bold text-brand-600">${escape_html(data.stats.totalCategories)}</p> <p class="text-xs text-neutral-500 mt-1">Product categories</p></div> <div class="p-3 bg-brand-100 rounded-full"><svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">`);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold mb-4">Product Management</h2> <div class="space-y-3"><a href="/admin/products" class="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors"><div class="flex items-center"><svg class="w-5 h-5 text-neutral-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg> <div><span class="font-medium">Manage Products</span> <p class="text-sm text-neutral-500">View and edit all products</p></div></div> <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a> `);
        if (data.stats.draftProducts > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<a href="/admin/products?status=draft" class="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors border border-orange-200"><div class="flex items-center"><svg class="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg> <div><span class="font-medium text-orange-800">Review Draft Products</span> <p class="text-sm text-orange-600">${escape_html(data.stats.draftProducts)} products need review</p></div></div> <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <a href="/admin/xml-sync" class="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors"><div class="flex items-center"><svg class="w-5 h-5 text-neutral-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> <div><span class="font-medium">Sync XML Products</span> <p class="text-sm text-neutral-500">Import from Qoltec API</p></div></div> <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold mb-4">Recently Added Products</h2> <div class="space-y-3">`);
        const each_array = ensure_array_like(data.recentProducts);
        if (each_array.length !== 0) {
          $$renderer3.push("<!--[-->");
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let product = each_array[$$index];
            $$renderer3.push(`<div class="flex items-center justify-between py-2 gap-3"><div class="flex-1 min-w-0"><p class="font-medium truncate text-sm">${escape_html(product.name)}</p> <p class="text-sm text-neutral-600 truncate">${escape_html(product.sku ? `SKU: ${product.sku}` : "No SKU")} • ${escape_html(product.price.toFixed(2))} zł</p></div> <div class="flex items-center space-x-2 flex-shrink-0"><span${attr_class(`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${stringify(product.status === "active" ? "bg-green-100 text-green-800" : product.status === "draft" ? "bg-orange-100 text-orange-800" : "bg-neutral-100 text-neutral-800")}`)}>${escape_html(product.status)}</span></div></div>`);
          }
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div class="text-center py-4 text-neutral-500">No recent products found</div>`);
        }
        $$renderer3.push(`<!--]--></div> `);
        if (data.recentProducts.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="mt-4 pt-4 border-t"><a href="/admin/products" class="text-brand-600 hover:text-brand-800 text-sm font-medium">View all products →</a></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="mt-8">`);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold mb-4">Quick Actions</h2> <div class="flex flex-wrap gap-4">`);
        Button($$renderer3, {
          href: "/admin/products",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Manage Products`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          href: "/admin/xml-sync",
          variant: "secondary",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Sync Products`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        if (data.stats.draftProducts > 0) {
          $$renderer3.push("<!--[-->");
          Button($$renderer3, {
            href: "/admin/products?status=draft",
            variant: "ghost",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Review Drafts (${escape_html(data.stats.draftProducts)})`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        Button($$renderer3, {
          href: "/admin/orders",
          variant: "secondary",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->View Orders`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div>`);
  });
}
export {
  _page as default
};
