import { d as escape_html, e as ensure_array_like, c as attr, a as attr_class, b as stringify, i as derived, s as store_get, g as page, u as unsubscribe_stores } from "../../../chunks/vendor.js";
import { u as userStore } from "../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { C as Card } from "../../../chunks/Card.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { children, data } = $$props;
    const user = derived(() => data.user || store_get($$store_subs ??= {}, "$userStore", userStore));
    const navItems = [
      {
        label: "Przegląd",
        href: "/account",
        icon: "overview",
        description: "Panel główny konta"
      },
      {
        label: "Zamówienia",
        href: "/account/orders",
        icon: "orders",
        description: "Historia zamówień"
      },
      {
        label: "Adresy",
        href: "/account/addresses",
        icon: "addresses",
        description: "Adresy dostawy"
      },
      {
        label: "Ulubione",
        href: "/account/favorites",
        icon: "favorites",
        description: "Zapisane produkty"
      },
      {
        label: "Ustawienia",
        href: "/account/settings",
        icon: "settings",
        description: "Preferencje konta"
      }
    ];
    function isActive(href) {
      if (href === "/account") {
        return store_get($$store_subs ??= {}, "$page", page).url.pathname === href;
      }
      return store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(href);
    }
    if (user()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-neutral-50 min-h-screen"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8"><div class="flex flex-col lg:flex-row gap-8"><div class="lg:w-80 flex-shrink-0"><div class="sticky top-8">`);
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center mb-8"><div class="relative inline-block mb-4"><div class="w-20 h-20 bg-gradient-to-br from-brand-100 to-accent-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-neutral-100"><svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div> <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></div> <h3 class="text-xl font-bold text-neutral-900 mb-1">${escape_html(user().username || "Użytkownik")}</h3> <p class="text-sm text-neutral-600 mb-3">${escape_html(user().email)}</p> <div class="inline-flex items-center px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-semibold"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Aktywne konto</div></div> <nav class="space-y-2"><!--[-->`);
          const each_array = ensure_array_like(navItems);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let item = each_array[$$index];
            $$renderer3.push(`<a${attr("href", item.href)}${attr_class(`nav-item group ${stringify(isActive(item.href) ? "nav-item-active" : "nav-item-inactive")}`, "svelte-1bm518h")}><div class="flex items-center"><div${attr_class(`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${stringify(isActive(item.href) ? "bg-brand-100" : "bg-neutral-100 group-hover:bg-brand-50")} transition-colors duration-200`)}>`);
            if (item.icon === "overview") {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<svg${attr_class(`w-5 h-5 ${stringify(isActive(item.href) ? "text-brand-600" : "text-neutral-600 group-hover:text-brand-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 5l4-4 4 4"></path></svg>`);
            } else if (item.icon === "orders") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<svg${attr_class(`w-5 h-5 ${stringify(isActive(item.href) ? "text-brand-600" : "text-neutral-600 group-hover:text-brand-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`);
            } else if (item.icon === "addresses") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<svg${attr_class(`w-5 h-5 ${stringify(isActive(item.href) ? "text-brand-600" : "text-neutral-600 group-hover:text-brand-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
            } else if (item.icon === "favorites") {
              $$renderer3.push("<!--[3-->");
              $$renderer3.push(`<svg${attr_class(`w-5 h-5 ${stringify(isActive(item.href) ? "text-brand-600" : "text-neutral-600 group-hover:text-brand-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`);
            } else if (item.icon === "settings") {
              $$renderer3.push("<!--[4-->");
              $$renderer3.push(`<svg${attr_class(`w-5 h-5 ${stringify(isActive(item.href) ? "text-brand-600" : "text-neutral-600 group-hover:text-brand-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div> <div class="flex-1 min-w-0"><div class="font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors duration-200">${escape_html(item.label)}</div> <div class="text-xs text-neutral-500 truncate">${escape_html(item.description)}</div></div> `);
            if (isActive(item.href)) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="ml-2"><svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></div>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div></a>`);
          }
          $$renderer3.push(`<!--]--></nav> <div class="mt-8 pt-6 border-t border-neutral-200"><div class="space-y-2"><a href="/products" class="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors duration-200"><svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> Kontynuuj zakupy</a> <a href="/contact" class="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors duration-200"><svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Centrum pomocy</a></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div> <div class="lg:hidden fixed bottom-6 right-6 z-50"><button class="w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200" aria-label="Otwórz menu konta"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex-1 min-w-0">`);
      children($$renderer2);
      $$renderer2.push(`<!----></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
