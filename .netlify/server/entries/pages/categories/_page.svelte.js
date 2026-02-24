import { h as head, d as escape_html, e as ensure_array_like, c as attr, i as derived } from "../../../chunks/vendor.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let searchQuery = "";
    let filteredCategories = derived(() => () => {
      if (!searchQuery.trim()) {
        return data.categories;
      }
      const query = searchQuery.toLowerCase();
      return data.categories.filter((category) => category.name.toLowerCase().includes(query) || category.description?.toLowerCase().includes(query));
    });
    function clearSearch() {
      searchQuery = "";
    }
    function getCategoryIcon(categoryName) {
      const name = categoryName.toLowerCase();
      if (name.includes("smartphone") || name.includes("phone")) return "📱";
      if (name.includes("laptop") || name.includes("computer")) return "💻";
      if (name.includes("audio") || name.includes("headphone") || name.includes("speaker")) return "🎧";
      if (name.includes("gaming") || name.includes("game")) return "🎮";
      if (name.includes("accessory") || name.includes("accessories")) return "🔌";
      if (name.includes("tablet")) return "📟";
      if (name.includes("electronic")) return "⚡";
      return "📦";
    }
    head("13grsjl", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Categories - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Browse our wide range of product categories at FixTar"/>`);
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="text-center mb-12"><h1 class="text-4xl font-bold text-neutral-900 mb-4">Product Categories</h1> <p class="text-xl text-neutral-600 max-w-2xl mx-auto">Explore our wide range of products organized by category</p></div> <div class="max-w-md mx-auto mb-8"><div class="relative">`);
    Input($$renderer2, {
      type: "search",
      placeholder: "Search categories...",
      value: searchQuery,
      oninput: (e) => searchQuery = e.currentTarget.value,
      class: "pl-10 pr-10"
    });
    $$renderer2.push(`<!----> <div class="absolute inset-y-0 left-0 flex items-center pl-3"><svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> `);
    if (searchQuery) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Clear search"><svg class="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (data.error) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-8 text-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-red-600 mb-4"><svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg></div> <h3 class="text-lg font-medium text-neutral-900 mb-2">Error Loading Categories</h3> <p class="text-neutral-600 mb-4">${escape_html(data.error)}</p> `);
          Button($$renderer3, {
            onclick: () => window.location.reload(),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Try Again`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      });
    } else if (filteredCategories()().length === 0) {
      $$renderer2.push("<!--[1-->");
      Card($$renderer2, {
        class: "p-12 text-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-neutral-400 mb-4"><svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> <h3 class="text-lg font-medium text-neutral-900 mb-2">${escape_html(searchQuery ? "No categories found" : "No categories available")}</h3> <p class="text-neutral-600 mb-6">`);
          if (searchQuery) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`No categories match your search for "${escape_html(searchQuery)}". Try different keywords.`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`Categories will appear here once they are added to the database.`);
          }
          $$renderer3.push(`<!--]--></p> `);
          if (searchQuery) {
            $$renderer3.push("<!--[-->");
            Button($$renderer3, {
              onclick: clearSearch,
              variant: "secondary",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Clear Search`);
              },
              $$slots: { default: true }
            });
          } else {
            $$renderer3.push("<!--[!-->");
            Button($$renderer3, {
              href: "/products",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Browse All Products`);
              },
              $$slots: { default: true }
            });
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
      const each_array = ensure_array_like(filteredCategories()());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        Card($$renderer2, {
          class: "group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden",
          children: ($$renderer3) => {
            $$renderer3.push(`<button class="w-full text-left"><div class="relative overflow-hidden rounded-t-lg mb-4 h-48 bg-neutral-100">`);
            if (category.image) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<img${attr("src", category.image)}${attr("alt", category.name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-100"><span class="text-6xl">${escape_html(getCategoryIcon(category.name))}</span></div>`);
            }
            $$renderer3.push(`<!--]--> `);
            if (category.featured) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="absolute top-3 left-3"><span class="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">Featured</span></div>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <div class="absolute bottom-3 right-3"><span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-neutral-700">${escape_html(category.productCount)} product${escape_html(category.productCount !== 1 ? "s" : "")}</span></div></div> <div class="p-4"><h3 class="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors">${escape_html(category.name)}</h3> `);
            if (category.description) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p class="text-neutral-600 text-sm line-clamp-2 svelte-13grsjl">${escape_html(category.description)}</p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div></button>`);
          },
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div> `);
      if (searchQuery) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-8 text-center"><p class="text-neutral-600">Showing ${escape_html(filteredCategories()().length)} of ${escape_html(data.categories.length)} categories</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
