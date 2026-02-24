import { h as head, d as escape_html, e as ensure_array_like, c as attr, s as store_get, r as navigating, u as unsubscribe_stores } from "../../../chunks/vendor.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { P as ProductCard } from "../../../chunks/ProductCard.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { L as LoadingSpinner } from "../../../chunks/LoadingSpinner.js";
import { H as Hero } from "../../../chunks/Hero.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let searchQuery = data.searchQuery || "";
    data.category || "";
    data.minPrice || 0;
    data.maxPrice || 1e4;
    data.sortBy || "name";
    head("e12qt1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(searchQuery ? `Wyniki wyszukiwania dla "${searchQuery}"` : "Szukaj")} - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", searchQuery ? `Wyniki wyszukiwania dla "${searchQuery}" w FixTar` : "Szukaj produktów w FixTar")}/>`);
    });
    Hero($$renderer2, {
      title: "Wyszukiwarka",
      subtitle: "Znajdź dokładnie to, czego szukasz w naszej szerokiej ofercie produktów",
      centered: true,
      className: "bg-gradient-to-br from-neutral-50 via-white to-brand-50",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mt-8 max-w-2xl mx-auto"><form class="relative"><div class="relative group"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg class="h-5 w-5 text-neutral-400 group-focus-within:text-brand-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> `);
        Input($$renderer3, {
          type: "text",
          placeholder: "Wpisz nazwę produktu, kategorię lub słowo kluczowe...",
          value: searchQuery,
          oninput: (e) => searchQuery = e.target.value,
          class: "pl-12 pr-12 py-4 text-lg rounded-2xl shadow-lg border-2 border-transparent focus:border-brand-500 transition-all",
          autofocus: true
        });
        $$renderer3.push(`<!----> `);
        if (searchQuery) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button type="button" class="absolute inset-y-0 right-4 flex items-center group/clear" aria-label="Wyczyść wyszukiwanie"><svg class="h-5 w-5 text-neutral-400 group-hover/clear:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> <div class="mt-4 flex justify-center">`);
        Button($$renderer3, {
          type: "submit",
          disabled: !searchQuery || !searchQuery.trim() || !!store_get($$store_subs ??= {}, "$navigating", navigating),
          class: "px-8 py-3 text-base font-semibold shadow-md",
          children: ($$renderer4) => {
            if (store_get($$store_subs ??= {}, "$navigating", navigating)) {
              $$renderer4.push("<!--[-->");
              LoadingSpinner($$renderer4, { visible: true });
              $$renderer4.push(`<!----> <span class="ml-2">Szukam...</span>`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`Szukaj`);
            }
            $$renderer4.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></form> <div class="mt-8 text-center"><p class="text-sm text-neutral-500 mb-3">Popularne wyszukiwania:</p> <div class="flex flex-wrap justify-center gap-2"><!--[-->`);
        const each_array = ensure_array_like([
          "Laptopy",
          "Procesory",
          "Karty graficzne",
          "Monitory",
          "Klawiatury"
        ]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let term = each_array[$$index];
          $$renderer3.push(`<button class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium transition-colors cursor-pointer">${escape_html(term)}</button>`);
        }
        $$renderer3.push(`<!--]--></div></div></div>`);
      }
    });
    $$renderer2.push(`<!----> <div class="bg-white"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">`);
    if (data.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-2xl mx-auto"><div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center"><svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <h3 class="text-lg font-semibold text-red-800 mb-2">Wystąpił błąd</h3> <p class="text-red-600">${escape_html(data.error)}</p></div></div>`);
    } else if (searchQuery && data.products.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="max-w-2xl mx-auto"><div class="bg-neutral-50 rounded-xl p-12 text-center"><svg class="w-16 h-16 text-neutral-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h3 class="text-xl font-semibold text-neutral-900 mb-3">Brak wyników</h3> <p class="text-neutral-600 mb-6">Nie znaleźliśmy produktów pasujących do "${escape_html(searchQuery)}"</p> <div class="space-y-3"><p class="text-sm text-neutral-500">Spróbuj:</p> <ul class="text-left inline-block space-y-2 text-sm text-neutral-600"><li class="flex items-start"><svg class="w-4 h-4 text-brand-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Sprawdzić pisownię</li> <li class="flex items-start"><svg class="w-4 h-4 text-brand-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Użyć bardziej ogólnych terminów</li> <li class="flex items-start"><svg class="w-4 h-4 text-brand-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Użyć mniejszej liczby słów kluczowych</li></ul></div> `);
      Button($$renderer2, {
        href: "/products",
        class: "mt-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Przeglądaj wszystkie produkty`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div>`);
    } else if (searchQuery && data.products.length > 0) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div><div class="mb-8"><h2 class="text-2xl font-bold text-neutral-900">Znaleziono ${escape_html(data.products.length)} ${escape_html(data.products.length === 1 ? "produkt" : data.products.length < 5 ? "produkty" : "produktów")} dla "${escape_html(searchQuery)}"</h2></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
      const each_array_1 = ensure_array_like(data.products);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let product = each_array_1[$$index_1];
        ProductCard($$renderer2, { product });
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="max-w-2xl mx-auto"><div class="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-2xl p-12 text-center"><div class="relative"><div class="absolute inset-0 flex items-center justify-center"><div class="w-32 h-32 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div></div> <svg class="w-20 h-20 text-brand-600 mx-auto mb-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> <h3 class="text-2xl font-bold text-neutral-900 mb-3">Rozpocznij wyszukiwanie</h3> <p class="text-neutral-600 mb-8 max-w-md mx-auto">Wpisz nazwę produktu, kategorię lub słowo kluczowe w polu wyszukiwania powyżej</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
      Button($$renderer2, {
        href: "/products",
        variant: "outline",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Przeglądaj katalog`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        href: "/categories",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Zobacz kategorie`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
