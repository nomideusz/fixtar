import { h as head, d as escape_html, c as attr, b as stringify, s as store_get, r as navigating, a as attr_class, e as ensure_array_like, u as unsubscribe_stores, i as derived, o as goto } from "../../../chunks/vendor.js";
import { P as ProductCard } from "../../../chunks/ProductCard.js";
import { C as Card } from "../../../chunks/Card.js";
import { I as Input } from "../../../chunks/Input.js";
import { B as Button } from "../../../chunks/Button.js";
import { L as LoadingSpinner } from "../../../chunks/LoadingSpinner.js";
import { H as Hero } from "../../../chunks/Hero.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let searchQuery = "";
    let selectedCategory = "";
    let sortBy = "name";
    let showMobileFilters = false;
    let expandedCategories = /* @__PURE__ */ new Set();
    let priceRange = { min: "0", max: "1000" };
    let showInStock = false;
    const selectedCategoryName = derived(() => data.categories.find((cat) => cat.slug === selectedCategory)?.name || data.subcategories.find((cat) => cat.slug === selectedCategory)?.name || "");
    const mainCategoriesWithSubs = derived(() => data.categories.map((category) => ({
      ...category,
      subcategories: data.allSubcategories.filter((sub) => sub.parent === category.id)
    })));
    function updateURL() {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (sortBy !== "name") params.set("sort", sortBy);
      `/products${params.toString() ? "?" + params.toString() : ""}`;
      goto();
    }
    let sortedProducts = derived(() => data.products);
    function handleSearchChange(e) {
      searchQuery = e.target.value;
    }
    function handleSortChange(e) {
      sortBy = e.target.value;
      updateURL();
    }
    function handlePageChange(page) {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (sortBy !== "name") params.set("sort", sortBy);
      if (page > 1) params.set("page", page.toString());
      `/products${params.toString() ? "?" + params.toString() : ""}`;
      goto();
    }
    function clearFilters() {
      searchQuery = "";
      selectedCategory = "";
      sortBy = "name";
      showInStock = false;
      priceRange = { min: "0", max: "1000" };
      expandedCategories = /* @__PURE__ */ new Set();
      goto();
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1dj9mz1", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Produkty${escape_html(selectedCategoryName() ? ` - ${selectedCategoryName()}` : "")} - FixTar</title>`);
        });
        $$renderer4.push(`<meta name="description"${attr("content", `Odkryj naszą kompletną ofertę narzędzi i akcesoriów${stringify(selectedCategoryName() ? ` w kategorii ${selectedCategoryName()}` : "")}`)}/>`);
      });
      Hero($$renderer3, {
        title: selectedCategoryName() ? selectedCategoryName() : "Narzędzia i Akcesoria",
        subtitle: selectedCategoryName() ? `Odkryj naszą profesjonalną ofertę produktów z kategorii ${selectedCategoryName()}` : "Odkryj najlepsze narzędzia i akcesoria w jednym miejscu",
        centered: true,
        className: "bg-gradient-to-br from-brand-50 via-white to-accent-50"
      });
      $$renderer3.push(`<!----> <section class="bg-white border-b border-neutral-100"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8"><nav class="flex mb-6" aria-label="Breadcrumb"><ol class="inline-flex items-center space-x-1 md:space-x-2"><li class="inline-flex items-center"><a href="/" class="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"></path></svg> Strona główna</a></li> <li><div class="flex items-center"><svg class="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg> `);
      if (selectedCategoryName()) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<a href="/products" class="ml-1 text-sm font-medium text-neutral-600 hover:text-brand-600 md:ml-2 transition-colors">Produkty</a>`);
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<span class="ml-1 text-sm font-medium text-neutral-900 md:ml-2">Produkty</span>`);
      }
      $$renderer3.push(`<!--]--></div></li> `);
      if (selectedCategoryName()) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<li aria-current="page"><div class="flex items-center"><svg class="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg> <span class="ml-1 text-sm font-medium text-neutral-900 md:ml-2">${escape_html(selectedCategoryName())}</span></div></li>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></ol></nav> <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6"><div class="flex-1 max-w-2xl"><form class="relative group"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg class="h-5 w-5 text-neutral-400 group-focus-within:text-brand-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> `);
      Input($$renderer3, {
        type: "search",
        placeholder: "Szukaj produktów, kategorii, marek...",
        value: searchQuery,
        oninput: handleSearchChange,
        class: "pl-12 pr-12 py-3 text-base rounded-xl border-2 border-transparent focus:border-brand-500 shadow-sm"
      });
      $$renderer3.push(`<!----> `);
      if (searchQuery) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<button type="button" class="absolute inset-y-0 right-4 flex items-center group/clear" aria-label="Wyczyść wyszukiwanie"><svg class="h-5 h-5 text-neutral-400 group-hover/clear:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></form></div> <div class="flex items-center gap-4"><div class="text-sm text-neutral-600 font-medium">${escape_html(data.totalItems)} ${escape_html(data.totalItems === 1 ? "produkt" : data.totalItems < 5 ? "produkty" : "produktów")}</div> `);
      Button($$renderer3, {
        variant: "outline",
        onclick: () => showMobileFilters = true,
        class: "lg:hidden",
        children: ($$renderer4) => {
          $$renderer4.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path></svg> Filtry`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div></div></section> <div class="bg-neutral-50 min-h-screen"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8"><div class="lg:grid lg:grid-cols-4 lg:gap-8"><div class="hidden lg:block lg:col-span-1">`);
      Card($$renderer3, {
        glass: true,
        class: "sticky top-6 p-6",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex items-center justify-between mb-6"><h3 class="text-lg font-bold text-neutral-900">Filtry</h3> `);
          if (searchQuery || selectedCategory || showInStock) {
            $$renderer4.push("<!--[-->");
            Button($$renderer4, {
              variant: "ghost",
              size: "sm",
              onclick: clearFilters,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Wyczyść wszystkie`);
              },
              $$slots: { default: true }
            });
          } else {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--></div> <div class="border-b border-neutral-200 pb-6 mb-6"><h4 class="text-sm font-semibold text-neutral-900 mb-4">Kategorie</h4> <div class="space-y-1"><button${attr("disabled", !!store_get($$store_subs ??= {}, "$navigating", navigating), true)}${attr_class(`filter-category-button ${stringify(!selectedCategory ? "active" : "")}`, "svelte-1dj9mz1")}><span class="flex-1 text-left">Wszystkie produkty</span> <span class="filter-badge svelte-1dj9mz1">${escape_html(data.totalItems)}</span> `);
          if (store_get($$store_subs ??= {}, "$navigating", navigating) && !selectedCategory) {
            $$renderer4.push("<!--[-->");
            LoadingSpinner($$renderer4, { visible: true });
          } else {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--></button> <!--[-->`);
          const each_array = ensure_array_like(mainCategoriesWithSubs());
          for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
            let category = each_array[$$index_1];
            $$renderer4.push(`<div class="space-y-1"><div class="flex items-center"><button${attr("disabled", !!store_get($$store_subs ??= {}, "$navigating", navigating), true)}${attr_class(`filter-category-button flex-1 ${stringify(selectedCategory === category.slug ? "active" : "")}`, "svelte-1dj9mz1")}><span class="flex-1 text-left">${escape_html(category.name)}</span> <span class="filter-badge mr-2 svelte-1dj9mz1">${escape_html(category.productCount)}</span> `);
            if (store_get($$store_subs ??= {}, "$navigating", navigating) && selectedCategory === category.slug) {
              $$renderer4.push("<!--[-->");
              LoadingSpinner($$renderer4, { visible: true });
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></button> `);
            if (category.subcategories.length > 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<button${attr("disabled", !!store_get($$store_subs ??= {}, "$navigating", navigating), true)} class="category-toggle-button svelte-1dj9mz1"${attr("aria-label", expandedCategories.has(category.slug) ? "Ukryj podkategorie" : "Pokaż podkategorie")}><svg${attr_class(`w-4 h-4 transition-transform ${stringify(expandedCategories.has(category.slug) ? "rotate-90" : "")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div> `);
            if (expandedCategories.has(category.slug) && category.subcategories.length > 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="ml-4 space-y-1"><!--[-->`);
              const each_array_1 = ensure_array_like(category.subcategories);
              for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                let subcategory = each_array_1[$$index];
                $$renderer4.push(`<button${attr("disabled", !!store_get($$store_subs ??= {}, "$navigating", navigating), true)}${attr_class(`filter-subcategory-button ${stringify(selectedCategory === subcategory.slug ? "active" : "")}`, "svelte-1dj9mz1")}><span class="flex-1 text-left">${escape_html(subcategory.name)}</span> <span class="filter-badge svelte-1dj9mz1">${escape_html(subcategory.productCount)}</span> `);
                if (store_get($$store_subs ??= {}, "$navigating", navigating) && selectedCategory === subcategory.slug) {
                  $$renderer4.push("<!--[-->");
                  LoadingSpinner($$renderer4, { visible: true });
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></button>`);
              }
              $$renderer4.push(`<!--]--></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div>`);
          }
          $$renderer4.push(`<!--]--></div></div> <div class="border-b border-neutral-200 pb-6 mb-6"><h4 class="text-sm font-semibold text-neutral-900 mb-4">Zakres cen</h4> <div class="flex items-center space-x-3">`);
          Input($$renderer4, {
            type: "number",
            placeholder: "Min",
            class: "text-sm",
            get value() {
              return priceRange.min;
            },
            set value($$value) {
              priceRange.min = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> <span class="text-neutral-400 font-medium">-</span> `);
          Input($$renderer4, {
            type: "number",
            placeholder: "Max",
            class: "text-sm",
            get value() {
              return priceRange.max;
            },
            set value($$value) {
              priceRange.max = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="mt-3 text-xs text-neutral-500">Ceny w PLN</div></div> <div class="pb-6"><h4 class="text-sm font-semibold text-neutral-900 mb-4">Dostępność</h4> <label class="flex items-center cursor-pointer group"><input type="checkbox"${attr("checked", showInStock, true)} class="rounded border-neutral-300 text-brand-600 focus:ring-brand-500 focus:ring-2"/> <span class="ml-3 text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">Tylko dostępne</span></label></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> `);
      if (showMobileFilters) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="fixed inset-0 z-50 lg:hidden"><div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" tabindex="0" role="button" aria-label="Zamknij filtry"></div> <div class="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl"><div class="flex flex-col h-full"><div class="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50"><h3 class="text-xl font-bold text-neutral-900">Filtry</h3> `);
        Button($$renderer3, {
          variant: "ghost",
          size: "sm",
          onclick: () => showMobileFilters = false,
          children: ($$renderer4) => {
            $$renderer4.push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div> <div class="flex-1 overflow-y-auto p-6"><div class="border-b border-neutral-200 pb-6 mb-6"><h4 class="text-sm font-semibold text-neutral-900 mb-4">Kategorie</h4> <div class="space-y-2"><button${attr("disabled", !!store_get($$store_subs ??= {}, "$navigating", navigating), true)}${attr_class(`filter-category-button ${stringify(!selectedCategory ? "active" : "")}`, "svelte-1dj9mz1")}><span class="flex-1 text-left">Wszystkie</span> <span class="filter-badge svelte-1dj9mz1">${escape_html(data.totalItems)}</span></button> <!--[-->`);
        const each_array_2 = ensure_array_like(mainCategoriesWithSubs());
        for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
          let category = each_array_2[$$index_3];
          $$renderer3.push(`<div class="space-y-1"><div class="flex items-center"><button${attr("disabled", !!store_get($$store_subs ??= {}, "$navigating", navigating), true)}${attr_class(`filter-category-button flex-1 ${stringify(selectedCategory === category.slug ? "active" : "")}`, "svelte-1dj9mz1")}><span class="flex-1 text-left">${escape_html(category.name)}</span> <span class="filter-badge mr-2 svelte-1dj9mz1">${escape_html(category.productCount)}</span></button> `);
          if (category.subcategories.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<button class="category-toggle-button svelte-1dj9mz1"${attr("aria-label", expandedCategories.has(category.slug) ? "Ukryj podkategorie" : "Pokaż podkategorie")}><svg${attr_class(`w-4 h-4 transition-transform ${stringify(expandedCategories.has(category.slug) ? "rotate-90" : "")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div> `);
          if (expandedCategories.has(category.slug) && category.subcategories.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="ml-4 space-y-1"><!--[-->`);
            const each_array_3 = ensure_array_like(category.subcategories);
            for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
              let subcategory = each_array_3[$$index_2];
              $$renderer3.push(`<button${attr_class(`filter-subcategory-button ${stringify(selectedCategory === subcategory.slug ? "active" : "")}`, "svelte-1dj9mz1")}><span class="flex-1 text-left">${escape_html(subcategory.name)}</span> <span class="filter-badge svelte-1dj9mz1">${escape_html(subcategory.productCount)}</span></button>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--></div></div> <div class="border-b border-neutral-200 pb-6 mb-6"><h4 class="text-sm font-semibold text-neutral-900 mb-4">Zakres cen</h4> <div class="flex items-center space-x-3">`);
        Input($$renderer3, {
          type: "number",
          placeholder: "Min",
          class: "text-sm",
          get value() {
            return priceRange.min;
          },
          set value($$value) {
            priceRange.min = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> <span class="text-neutral-400">-</span> `);
        Input($$renderer3, {
          type: "number",
          placeholder: "Max",
          class: "text-sm",
          get value() {
            return priceRange.max;
          },
          set value($$value) {
            priceRange.max = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div></div> <div><h4 class="text-sm font-semibold text-neutral-900 mb-4">Dostępność</h4> <label class="flex items-center cursor-pointer"><input type="checkbox"${attr("checked", showInStock, true)} class="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"/> <span class="ml-3 text-sm text-neutral-700">Tylko dostępne</span></label></div></div> <div class="border-t border-neutral-200 p-6 bg-neutral-50"><div class="flex gap-3">`);
        Button($$renderer3, {
          variant: "outline",
          onclick: clearFilters,
          class: "flex-1",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Wyczyść`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          onclick: () => showMobileFilters = false,
          class: "flex-1",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Pokaż produkty`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div></div></div></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> <div class="lg:col-span-3">`);
      Card($$renderer3, {
        class: "p-6 mb-8",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div class="flex items-center justify-between sm:justify-start gap-6"><div class="flex items-center gap-2"><span class="text-sm font-medium text-neutral-700">Widok:</span> <div class="flex items-center bg-neutral-100 rounded-xl p-1"><button${attr_class(`view-mode-button ${stringify("active")}`, "svelte-1dj9mz1")}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></button> <button${attr_class(`view-mode-button ${stringify("")}`, "svelte-1dj9mz1")}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg></button></div></div></div> <div class="flex items-center gap-3"><span class="text-sm font-medium text-neutral-700">Sortuj:</span> `);
          $$renderer4.select(
            {
              value: sortBy,
              onchange: handleSortChange,
              class: "px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white"
            },
            ($$renderer5) => {
              $$renderer5.option({ value: "name" }, ($$renderer6) => {
                $$renderer6.push(`Nazwa A-Z`);
              });
              $$renderer5.option({ value: "price-low" }, ($$renderer6) => {
                $$renderer6.push(`Cena: rosnąco`);
              });
              $$renderer5.option({ value: "price-high" }, ($$renderer6) => {
                $$renderer6.push(`Cena: malejąco`);
              });
            }
          );
          $$renderer4.push(`</div></div> `);
          if (searchQuery || selectedCategory || showInStock) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="mt-6 pt-6 border-t border-neutral-200"><div class="flex flex-wrap items-center gap-3"><span class="text-sm font-medium text-neutral-700">Aktywne filtry:</span> `);
            if (searchQuery) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<span class="active-filter svelte-1dj9mz1"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> "${escape_html(searchQuery)}" <button class="filter-remove-button svelte-1dj9mz1" aria-label="Usuń filtr wyszukiwania"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></span>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (selectedCategoryName()) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<span class="active-filter bg-accent-100 text-accent-800 svelte-1dj9mz1"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg> ${escape_html(selectedCategoryName())} <button class="filter-remove-button svelte-1dj9mz1" aria-label="Usuń filtr kategorii"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></span>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (showInStock) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<span class="active-filter bg-accent-100 text-accent-800 svelte-1dj9mz1"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Tylko dostępne <button class="filter-remove-button svelte-1dj9mz1" aria-label="Usuń filtr dostępności"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></span>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> `);
            Button($$renderer4, {
              variant: "ghost",
              size: "sm",
              onclick: clearFilters,
              class: "text-neutral-500 hover:text-neutral-700",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Wyczyść wszystkie`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <div class="relative">`);
      if (store_get($$store_subs ??= {}, "$navigating", navigating)) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl"><div class="flex flex-col items-center gap-3">`);
        LoadingSpinner($$renderer3, { visible: true });
        $$renderer3.push(`<!----> <p class="text-sm font-medium text-neutral-600">Ładowanie produktów...</p></div></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (data.error) {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          class: "p-12 text-center",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="max-w-md mx-auto"><svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <h3 class="text-lg font-semibold text-neutral-900 mb-2">Wystąpił błąd</h3> <p class="text-neutral-600 mb-4">${escape_html(data.error)}</p> `);
            Button($$renderer4, {
              href: "/products",
              variant: "outline",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Spróbuj ponownie`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
          },
          $$slots: { default: true }
        });
      } else if (sortedProducts().length > 0) {
        $$renderer3.push("<!--[1-->");
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"><!--[-->`);
          const each_array_4 = ensure_array_like(sortedProducts());
          for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
            let product = each_array_4[$$index_4];
            ProductCard($$renderer3, { product });
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--> `);
        if (data.totalPages > 1) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="mt-12 flex justify-center"><nav class="flex items-center gap-2">`);
          Button($$renderer3, {
            onclick: () => handlePageChange(data.currentPage - 1),
            disabled: data.currentPage <= 1 || !!store_get($$store_subs ??= {}, "$navigating", navigating),
            variant: "outline",
            size: "sm",
            children: ($$renderer4) => {
              $$renderer4.push(`<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Poprzednia`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <!--[-->`);
          const each_array_7 = ensure_array_like(Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
            const start = Math.max(1, data.currentPage - 2);
            return start + i;
          }));
          for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
            let pageNum = each_array_7[$$index_7];
            if (pageNum <= data.totalPages) {
              $$renderer3.push("<!--[-->");
              Button($$renderer3, {
                onclick: () => handlePageChange(pageNum),
                variant: pageNum === data.currentPage ? "primary" : "outline",
                size: "sm",
                disabled: !!store_get($$store_subs ??= {}, "$navigating", navigating),
                class: "min-w-[40px]",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(pageNum)}`);
                },
                $$slots: { default: true }
              });
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--> `);
          Button($$renderer3, {
            onclick: () => handlePageChange(data.currentPage + 1),
            disabled: data.currentPage >= data.totalPages || !!store_get($$store_subs ??= {}, "$navigating", navigating),
            variant: "outline",
            size: "sm",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Następna <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></nav></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[!-->");
        Card($$renderer3, {
          class: "p-16 text-center",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="max-w-lg mx-auto"><div class="relative"><div class="absolute inset-0 flex items-center justify-center"><div class="w-32 h-32 bg-neutral-200 rounded-full filter blur-3xl opacity-20"></div></div> <svg class="w-20 h-20 text-neutral-400 mx-auto mb-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"></path></svg></div> <h3 class="text-2xl font-bold text-neutral-900 mb-3">Brak produktów</h3> <p class="text-neutral-600 mb-6">${escape_html(searchQuery || selectedCategoryName() ? "Nie znaleźliśmy produktów odpowiadających Twoim kryteriom wyszukiwania" : "W tej chwili nie ma dostępnych produktów")}</p> `);
            if (searchQuery || selectedCategory) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="flex flex-col sm:flex-row gap-3 justify-center">`);
              Button($$renderer4, {
                onclick: clearFilters,
                variant: "outline",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Wyczyść filtry`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                href: "/products",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Zobacz wszystkie produkty`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
              Button($$renderer4, {
                href: "/",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Wróć do strony głównej`);
                },
                $$slots: { default: true }
              });
            }
            $$renderer4.push(`<!--]--></div>`);
          },
          $$slots: { default: true }
        });
      }
      $$renderer3.push(`<!--]--></div></div></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
