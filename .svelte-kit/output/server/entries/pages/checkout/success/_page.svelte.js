import { h as head, d as escape_html, e as ensure_array_like, c as attr, i as derived, s as store_get, g as page, u as unsubscribe_stores } from "../../../../chunks/vendor.js";
import { B as Button } from "../../../../chunks/Button.js";
import { C as Card } from "../../../../chunks/Card.js";
import { H as Hero } from "../../../../chunks/Hero.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { data } = $$props;
    const isFallback = derived(() => store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("fallback") === "true");
    const orderNumber = derived(() => data.order?.orderNumber || "PL" + Math.random().toString(36).substr(2, 9).toUpperCase());
    function formatCurrency(amount) {
      return `${amount.toFixed(2)} zł`;
    }
    function getPaymentMethodName(method) {
      const methods = {
        "blik": "BLIK",
        "card": "Karta płatnicza",
        "bank_transfer": "Przelew tradycyjny",
        "przelewy24": "Przelewy24",
        "cod": "Płatność przy odbiorze"
      };
      return methods[method] || method;
    }
    function getShippingMethodName(method) {
      const methods = {
        "standard": "Poczta Polska",
        "express": "Kurier DPD",
        "inpost": "InPost Paczkomat"
      };
      return methods[method] || method;
    }
    head("1jgp7p9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Zamówienie Potwierdzone - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Twoje zamówienie zostało złożone pomyślnie - dziękujemy za zakupy"/>`);
    });
    Hero($$renderer2, {
      title: "Zamówienie Potwierdzone!",
      subtitle: "Dziękujemy za zakupy w FixTar - Twoje zamówienie zostało pomyślnie złożone i zostanie szybko przetworzone",
      centered: true,
      className: "bg-gradient-to-br from-green-50 via-white to-emerald-50"
    });
    $$renderer2.push(`<!----> <div class="bg-gray-50 min-h-screen"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16"><div class="text-center mb-12"><div class="relative inline-block mb-8"><div class="absolute inset-0 bg-green-100 rounded-full transform scale-110 animate-pulse"></div> <div class="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl"><svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></div></div> `);
    Card($$renderer2, {
      class: "inline-block p-6 mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-green-200",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center space-x-4"><div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div> <div class="text-left"><p class="text-sm font-medium text-gray-600">Numer zamówienia</p> <p class="text-2xl font-bold text-gray-900">#${escape_html(orderNumber())}</p></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> `);
    if (isFallback() && data.order?.metadata?.paymentDetails?.originalMethod) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-4xl mx-auto mb-8">`);
      Card($$renderer2, {
        class: "p-6 bg-amber-50 border-2 border-amber-200",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-start space-x-4"><div class="flex-shrink-0"><div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div></div> <div><h3 class="text-lg font-bold text-amber-800 mb-2">Zmiana metody płatności</h3> <p class="text-amber-700">Wybrana metoda płatności <strong>${escape_html(getPaymentMethodName(data.order.metadata.paymentDetails.originalMethod))}</strong> była czasowo niedostępna. Zamówienie zostało automatycznie przekierowane do płatności przelewem tradycyjnym.</p></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.order?.paymentMethod === "bank_transfer" && data.order?.metadata?.paymentDetails?.bankDetails) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-4xl mx-auto mb-12">`);
      Card($$renderer2, {
        class: "p-8 bg-blue-50 border-2 border-blue-200",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg></div> <h3 class="text-2xl font-bold text-blue-900">Dane do przelewu</h3></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h4 class="text-sm font-semibold text-gray-700 mb-2">Nazwa odbiorcy</h4> <p class="text-lg font-bold text-gray-900 p-3 bg-white rounded-xl border border-gray-200">${escape_html(data.order.metadata.paymentDetails.bankDetails.accountName)}</p></div> <div><h4 class="text-sm font-semibold text-gray-700 mb-2">Bank</h4> <p class="text-lg font-bold text-gray-900 p-3 bg-white rounded-xl border border-gray-200">${escape_html(data.order.metadata.paymentDetails.bankDetails.bankName)}</p></div> <div><h4 class="text-sm font-semibold text-gray-700 mb-2">Numer konta</h4> <p class="text-lg font-mono font-bold text-gray-900 p-3 bg-white rounded-xl border border-gray-200 tracking-wider">${escape_html(data.order.metadata.paymentDetails.bankDetails.accountNumber)}</p></div> <div><h4 class="text-sm font-semibold text-gray-700 mb-2">SWIFT</h4> <p class="text-lg font-mono font-bold text-gray-900 p-3 bg-white rounded-xl border border-gray-200">${escape_html(data.order.metadata.paymentDetails.bankDetails.swift)}</p></div> <div class="md:col-span-2"><h4 class="text-sm font-semibold text-gray-700 mb-2">Tytuł przelewu</h4> <p class="text-lg font-bold text-gray-900 p-4 bg-yellow-100 rounded-xl border-2 border-yellow-300 text-center">${escape_html(data.order.metadata.paymentDetails.bankDetails.reference)}</p></div> <div class="md:col-span-2"><h4 class="text-sm font-semibold text-gray-700 mb-2">Kwota do zapłaty</h4> <p class="text-3xl font-bold text-blue-600 p-4 bg-white rounded-xl border border-gray-200 text-center">${escape_html(data.order.metadata.paymentDetails.bankDetails.amount)}</p></div></div> <div class="mt-6 p-4 bg-yellow-100 rounded-xl border border-yellow-300"><div class="flex items-start space-x-3"><svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <div><p class="font-bold text-yellow-800 mb-1">Ważne instrukcje płatności:</p> <ul class="text-sm text-yellow-700 space-y-1"><li>• Prosimy o dokładne przepisanie tytułu przelewu</li> <li>• Pozwoli to na szybką identyfikację Twojej płatności</li> <li>• Zamówienie zostanie wysłane po otrzymaniu płatności</li></ul></div></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="text-center mb-16"><p class="text-lg text-gray-600 mb-8">Wysłaliśmy email z potwierdzeniem zamówienia i szczegółami dostawy na podany adres.</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
    Button($$renderer2, {
      href: "/account/orders",
      class: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Moje zamówienia`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Button($$renderer2, {
      href: "/products",
      variant: "outline",
      class: "font-bold py-4 px-8 rounded-2xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 text-lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> Kontynuuj zakupy`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div> `);
    if (data.order) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">`);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3"><svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"></path></svg></div> <h3 class="text-2xl font-bold text-gray-900">Zamówione produkty</h3></div> `);
          if (data.order.items && data.order.items.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="space-y-4"><!--[-->`);
            const each_array = ensure_array_like(data.order.items);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let item = each_array[$$index];
              $$renderer3.push(`<div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">`);
              if (item.image) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"><img${attr("src", item.image)}${attr("alt", item.name)} class="w-full h-full object-cover"/></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<div class="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`);
              }
              $$renderer3.push(`<!--]--> <div class="flex-1 min-w-0"><h4 class="text-lg font-bold text-gray-900 truncate">${escape_html(item.name)}</h4> <div class="flex items-center space-x-4 mt-2"><span class="text-sm text-gray-600">Ilość: <strong>${escape_html(item.quantity)}</strong></span> <span class="text-sm text-gray-600">Cena: <strong>${escape_html(formatCurrency(item.price))}</strong></span></div></div> <div class="text-right"><p class="text-xl font-bold text-blue-600">${escape_html(formatCurrency(item.price * item.quantity))}</p></div></div>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div class="text-center py-8"><div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"></path></svg></div> <p class="text-gray-600">Brak szczegółów produktów w zamówieniu</p></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="space-y-8">`);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div> <h3 class="text-2xl font-bold text-gray-900">Adres dostawy</h3></div> `);
          if (data.order.shippingAddress) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="bg-gray-50 rounded-xl p-6"><div class="space-y-2"><p class="text-lg font-bold text-gray-900">${escape_html(data.order.shippingAddress.firstName)} ${escape_html(data.order.shippingAddress.lastName)}</p> `);
            if (data.order.shippingAddress.company) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p class="text-gray-600 font-medium">${escape_html(data.order.shippingAddress.company)}</p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <p class="text-gray-600">${escape_html(data.order.shippingAddress.street)}</p> `);
            if (data.order.shippingAddress.apartment) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p class="text-gray-600">Mieszkanie ${escape_html(data.order.shippingAddress.apartment)}</p>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <p class="text-gray-600">${escape_html(data.order.shippingAddress.postalCode)} ${escape_html(data.order.shippingAddress.city)}</p> <p class="text-gray-600">${escape_html(data.order.shippingAddress.voivodeship)}</p></div></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<p class="text-gray-600">Brak danych adresowych</p>`);
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3"><svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div> <h3 class="text-2xl font-bold text-gray-900">Szczegóły zamówienia</h3></div> <div class="space-y-6"><div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl"><div class="flex items-center"><svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg> <span class="font-medium text-gray-700">Płatność</span></div> <span class="font-bold text-gray-900">${escape_html(getPaymentMethodName(data.order.paymentMethod || "card"))}</span></div> <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl"><div class="flex items-center"><svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg> <span class="font-medium text-gray-700">Dostawa</span></div> <span class="font-bold text-gray-900">${escape_html(getShippingMethodName(data.order.shippingMethod || "standard"))}</span></div> `);
          if (data.order.total) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="flex justify-between items-center p-4 bg-green-50 rounded-xl border-2 border-green-200"><div class="flex items-center"><svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg> <span class="font-semibold text-green-700">Łączna kwota</span></div> <span class="text-xl font-bold text-green-600">${escape_html(formatCurrency(data.order.total))}</span></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-16 max-w-4xl mx-auto">`);
    Card($$renderer2, {
      class: "p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-gray-100",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="text-center"><div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <h3 class="text-2xl font-bold text-gray-900 mb-4">Co dalej?</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"><div class="flex items-start space-x-3"><div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span class="text-green-600 font-bold text-sm">1</span></div> <div><h4 class="font-bold text-gray-900 mb-1">Potwierdzenie email</h4> <p class="text-sm text-gray-600">Sprawdź swoją skrzynkę pocztową w poszukiwaniu emaila z potwierdzeniem</p></div></div> <div class="flex items-start space-x-3"><div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span class="text-blue-600 font-bold text-sm">2</span></div> <div><h4 class="font-bold text-gray-900 mb-1">Przygotowanie</h4> <p class="text-sm text-gray-600">Przygotowujemy Twoje zamówienie do wysyłki</p></div></div> <div class="flex items-start space-x-3"><div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span class="text-accent-600 font-bold text-sm">3</span></div> <div><h4 class="font-bold text-gray-900 mb-1">Dostawa</h4> <p class="text-sm text-gray-600">Otrzymasz powiadomienie o wysyłce z numerem do śledzenia</p></div></div></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
