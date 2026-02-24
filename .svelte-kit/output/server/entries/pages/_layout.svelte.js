import { s as store_get, e as ensure_array_like, a as attr_class, b as stringify, c as attr, d as escape_html, f as attr_style, u as unsubscribe_stores } from "../../chunks/vendor.js";
import { n as notifications, c as cart, u as userStore } from "../../chunks/notifications-simple.js";
import { B as Button } from "../../chunks/Button.js";
import { F as FixTarLogo } from "../../chunks/logo-FixTar.js";
function Notifications($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const typeClasses = {
      success: "from-emerald-600/90 to-green-600/90 text-white border-emerald-500/30",
      error: "from-red-600/90 to-red-700/90 text-white border-red-500/30",
      info: "from-blue-600/90 to-brand-700/90 text-white border-blue-500/30",
      warning: "from-orange-600/90 to-orange-700/90 text-white border-orange-500/30"
    };
    const iconPaths = {
      success: "M5 13l4 4L19 7",
      error: "M6 18L18 6M6 6l12 12",
      info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    };
    let timers = /* @__PURE__ */ new Map();
    {
      store_get($$store_subs ??= {}, "$notifications", notifications).forEach((notification) => {
        if (!timers.has(notification.id) && notification.duration !== 0) {
          const timer = setTimeout(
            () => {
              notifications.remove(notification.id);
              timers.delete(notification.id);
            },
            notification.duration || 5e3
          );
          timers.set(notification.id, timer);
        }
      });
    }
    $$renderer2.push(`<div class="fixed top-6 right-6 z-9999 space-y-3 max-w-sm"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$notifications", notifications));
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let notification = each_array[index];
      $$renderer2.push(`<div${attr_class(`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl transform bg-linear-to-r ${stringify(typeClasses[notification.type] || typeClasses.info)}`)} role="alert" aria-live="polite"><div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> <div class="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent"></div> <div class="relative flex items-start p-4 gap-3"><div class="relative shrink-0"><div class="absolute inset-0 bg-white/30 rounded-full blur-md"></div> <div class="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", iconPaths[notification.type] || iconPaths.info)}></path></svg></div></div> <div class="flex-1 min-w-0"><p class="text-sm text-white/90 leading-relaxed">${escape_html(notification.message)}</p></div> <button class="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 group" aria-label="Zamknij powiadomienie"><svg class="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> `);
      if (notification.duration && notification.duration > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden"><div class="h-full bg-white/60 rounded-full animate-notification-progress"${attr_style(`animation-duration: ${stringify(notification.duration)}ms`)}></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (notification.type === "success") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute inset-0 overflow-hidden pointer-events-none"><!--[-->`);
        const each_array_1 = ensure_array_like(Array(6));
        for (let i = 0, $$length2 = each_array_1.length; i < $$length2; i++) {
          each_array_1[i];
          $$renderer2.push(`<div class="absolute w-1 h-1 bg-white/40 rounded-full animate-float-particle"${attr_style(` left: ${stringify(20 + Math.random() * 60)}%; top: ${stringify(20 + Math.random() * 60)}%; animation-delay: ${stringify(Math.random() * 2)}s; animation-duration: ${stringify(2 + Math.random() * 2)}s; `)}></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const FixTarLogoWhite = "/_app/immutable/assets/logo-FixTar-white.Cy0Mjsr0.png";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { children, data } = $$props;
    Notifications($$renderer2);
    $$renderer2.push(`<!----> <nav${attr_class(`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${stringify("py-5")}`)}><div${attr_class(`absolute inset-0 bg-white/95 backdrop-blur-md ${stringify("shadow-lg")} transition-all duration-500`)}></div> <div class="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12"><div class="flex justify-between items-center"><div class="flex items-center"><a href="/" class="relative group cursor-pointer focus:outline-none"><img${attr("src", FixTarLogo)} alt="FixTar" class="relative h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-105"/></a></div> <div class="hidden lg:flex items-center"><div class="flex items-center gap-1"><a href="/products" class="nav-link-pro svelte-12qhfyh"><span class="relative z-10">Produkty</span></a> <a href="/about" class="nav-link-pro svelte-12qhfyh"><span class="relative z-10">O Nas</span></a> <a href="/contact" class="nav-link-pro svelte-12qhfyh"><span class="relative z-10">Kontakt</span></a></div></div> <div class="flex items-center gap-3 md:gap-4"><a href="/search" class="nav-icon-pro svelte-12qhfyh" aria-label="Szukaj produktów"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></a> <button class="nav-icon-pro relative svelte-12qhfyh" aria-label="Otwórz koszyk"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> `);
    if (store_get($$store_subs ??= {}, "$cart", cart).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="absolute -top-2 -right-2 bg-brand-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold shadow-md">${escape_html(store_get($$store_subs ??= {}, "$cart", cart).reduce((sum, item) => sum + item.quantity, 0))}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    if (store_get($$store_subs ??= {}, "$userStore", userStore)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="relative"><button class="nav-icon-pro svelte-12qhfyh" aria-label="Menu użytkownika"><div class="flex items-center gap-1.5"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> <svg${attr_class(`w-3 h-3 transition-all duration-300 ${stringify("")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      Button($$renderer2, {
        href: "/auth/login",
        variant: "primary",
        class: "hidden md:flex",
        children: ($$renderer3) => {
          $$renderer3.push(`<span class="relative z-10">Zaloguj</span>`);
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--> <button class="lg:hidden nav-icon-pro svelte-12qhfyh"${attr("aria-label", "Otwórz menu")}><div class="w-5 h-5 flex flex-col justify-center gap-1.5"><span${attr_class(`block h-0.5 w-full bg-current transform transition-all duration-300 ${stringify("")}`)}></span> <span${attr_class(`block h-0.5 w-full bg-current transition-all duration-300 ${stringify("")}`)}></span> <span${attr_class(`block h-0.5 w-full bg-current transform transition-all duration-300 ${stringify("")}`)}></span></div></button></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></nav> <main class="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 pt-20 md:pt-24">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></main> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <footer class="relative bg-gray-900 text-white overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div> <div class="relative max-w-screen-2xl mx-auto px-6 py-20 sm:px-8 lg:px-12"><div class="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16"><div class="lg:col-span-2"><img${attr("src", FixTarLogoWhite)} alt="FixTar" class="h-12 w-auto mb-6"/> <p class="text-neutral-300 text-lg leading-relaxed mb-8 max-w-md">Dostarczamy wysokiej jakości produkty z pasją i zaangażowaniem. Twoja satysfakcja jest naszym priorytetem.</p> <div class="flex gap-3"><!--[-->`);
    const each_array_1 = ensure_array_like(["facebook", "twitter", "instagram", "linkedin"]);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let social = each_array_1[$$index_1];
      $$renderer2.push(`<a${attr("href", `https://${stringify(social)}.com/FixTar`)} class="social-icon group svelte-12qhfyh"${attr("aria-label", `Obserwuj nas na ${stringify(social)}`)} target="_blank" rel="noopener noreferrer"><div class="absolute inset-0 bg-gradient-to-r from-accent-600 to-brand-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> <svg class="w-5 h-5 relative z-10 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">`);
      if (social === "facebook") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>`);
      } else if (social === "twitter") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>`);
      } else if (social === "instagram") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"></path>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>`);
      }
      $$renderer2.push(`<!--]--></svg></a>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="lg:col-span-2"><div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"><h3 class="text-2xl font-bold mb-4">Newsletter</h3> <p class="text-neutral-300 mb-6">Bądź na bieżąco z najnowszymi ofertami i promocjami</p> <form class="flex gap-3"><input type="email" placeholder="Twój adres email" class="flex-1 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white placeholder-neutral-400 border border-white/20 focus:outline-none focus:border-white/40 transition-colors duration-300" required=""/> <button type="submit" class="px-6 py-3 bg-gradient-to-r from-accent-600 to-brand-600 hover:from-accent-700 hover:to-brand-700 text-white font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">Zapisz</button></form></div></div></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"><div><h4 class="font-bold text-lg mb-6 text-white">Produkty</h4> <ul class="space-y-3"><!--[-->`);
    const each_array_2 = ensure_array_like(["Nowości", "Bestsellery", "Wyprzedaż", "Kategorie"]);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let link = each_array_2[$$index_2];
      $$renderer2.push(`<li><a href="/products" class="footer-link svelte-12qhfyh">${escape_html(link)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div><h4 class="font-bold text-lg mb-6 text-white">Firma</h4> <ul class="space-y-3"><!--[-->`);
    const each_array_3 = ensure_array_like(["O Nas", "Kariera", "Blog", "Kontakt"]);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let link = each_array_3[$$index_3];
      $$renderer2.push(`<li><a${attr("href", `/${stringify(link.toLowerCase().replace(" ", "-"))}`)} class="footer-link svelte-12qhfyh">${escape_html(link)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div><h4 class="font-bold text-lg mb-6 text-white">Pomoc</h4> <ul class="space-y-3"><!--[-->`);
    const each_array_4 = ensure_array_like(["FAQ", "Dostawa", "Zwroty", "Status Zamówienia"]);
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let link = each_array_4[$$index_4];
      $$renderer2.push(`<li><a${attr("href", `/${stringify(link.toLowerCase().replace(" ", "-"))}`)} class="footer-link svelte-12qhfyh">${escape_html(link)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div><h4 class="font-bold text-lg mb-6 text-white">Prawne</h4> <ul class="space-y-3"><!--[-->`);
    const each_array_5 = ensure_array_like(["Regulamin", "Polityka Prywatności", "Cookies", "Licencje"]);
    for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
      let link = each_array_5[$$index_5];
      $$renderer2.push(`<li><a${attr("href", `/${stringify(link.toLowerCase().replace(" ", "-"))}`)} class="footer-link svelte-12qhfyh">${escape_html(link)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div></div> <div class="pt-8 border-t border-gray-800"><div class="flex flex-col md:flex-row justify-between items-center gap-4"><p class="text-neutral-400 text-center md:text-left">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} FixTar. Wszelkie prawa zastrzeżone.</p> <div class="flex items-center gap-6"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" class="h-8 opacity-60 hover:opacity-100 transition-opacity"/> <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-8 opacity-60 hover:opacity-100 transition-opacity"/> <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-6 opacity-60 hover:opacity-100 transition-opacity"/></div></div></div></div></footer>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
