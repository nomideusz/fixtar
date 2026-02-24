import { a as attr_class, m as clsx, h as head, d as escape_html, e as ensure_array_like, c as attr, b as stringify } from "../../../../chunks/vendor.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Button } from "../../../../chunks/Button.js";
function CustomBadge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { $$slots, $$events, ...props } = $$props;
    const variant = props.variant || "primary";
    const size = props.size || "md";
    const rounded = props.rounded || "md";
    const gradient = props.gradient !== void 0 ? props.gradient : true;
    const glow = props.glow || false;
    const outline = props.outline || false;
    const customClass = props.customClass || "";
    const children = props.children;
    const gradientClasses = {
      primary: "bg-gradient-to-r from-primary to-primary-light text-white",
      secondary: "bg-gradient-to-r from-secondary to-secondary-light text-white",
      success: "bg-gradient-to-r from-success to-success-light text-white",
      danger: "bg-gradient-to-r from-danger to-danger-light text-white",
      warning: "bg-gradient-to-r from-warning to-warning-light text-white",
      info: "bg-gradient-to-r from-info to-info-light text-white"
    };
    const solidClasses = {
      primary: "bg-primary text-white",
      secondary: "bg-secondary text-white",
      success: "bg-success text-white",
      danger: "bg-danger text-white",
      warning: "bg-warning text-black",
      info: "bg-info text-white"
    };
    const outlineClasses = {
      primary: "bg-transparent border border-primary text-primary",
      secondary: "bg-transparent border border-secondary text-secondary",
      success: "bg-transparent border border-success text-success",
      danger: "bg-transparent border border-danger text-danger",
      warning: "bg-transparent border border-warning text-warning",
      info: "bg-transparent border border-info text-info"
    };
    const sizeClasses = {
      xs: "text-xs py-0.5 px-2",
      sm: "text-sm py-0.5 px-2.5",
      md: "text-base py-1 px-3",
      lg: "text-lg py-1.5 px-4"
    };
    const roundedClasses = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full"
    };
    const glowClass = glow ? "shadow-custom-md" : "";
    let colorClass = "";
    if (outline) {
      colorClass = outlineClasses[variant];
    } else if (gradient) {
      colorClass = gradientClasses[variant];
    } else {
      colorClass = solidClasses[variant];
    }
    const badgeClasses = [
      "inline-flex items-center justify-center",
      "font-medium",
      colorClass,
      sizeClasses[size],
      roundedClasses[rounded],
      glowClass,
      customClass
    ].join(" ");
    $$renderer2.push(`<span${attr_class(clsx(badgeClasses))}>`);
    if (children) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></span>`);
  });
}
const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PLN: "zł",
  JPY: "¥"
};
const symbolToCurrency = {
  $: "USD",
  "€": "EUR",
  "£": "GBP",
  zł: "PLN",
  "¥": "JPY"
};
function formatPrice(price, currency = "USD", decimals = 2) {
  let currencyCode;
  if (currency in currencySymbols) {
    currencyCode = currency;
  } else if (currency in symbolToCurrency) {
    currencyCode = symbolToCurrency[currency];
  } else {
    return `${currency}${price.toFixed(decimals)}`;
  }
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  } catch (error) {
    const symbol = currencyCode in currencySymbols ? currencySymbols[currencyCode] : currencyCode;
    return `${symbol}${price.toFixed(decimals)}`;
  }
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const statusConfig = {
      pending: {
        label: "Oczekuje",
        color: "bg-yellow-100 text-yellow-800",
        icon: "🕒"
      },
      processing: {
        label: "W realizacji",
        color: "bg-blue-100 text-blue-800",
        icon: "⚙️"
      },
      shipped: {
        label: "Wysłane",
        color: "bg-purple-100 text-purple-800",
        icon: "🚚"
      },
      delivered: {
        label: "Dostarczone",
        color: "bg-green-100 text-green-800",
        icon: "✅"
      },
      cancelled: {
        label: "Anulowane",
        color: "bg-red-100 text-red-800",
        icon: "❌"
      },
      refunded: {
        label: "Zwrócone",
        color: "bg-gray-100 text-gray-800",
        icon: "💰"
      }
    };
    const paymentMethodLabels = {
      blik: "BLIK",
      card: "Karta płatnicza",
      przelewy24: "Przelewy24",
      payu: "PayU",
      bank_transfer: "Przelew tradycyjny",
      cod: "Płatność przy odbiorze"
    };
    const shippingMethodLabels = {
      standard: "Dostawa standardowa",
      express: "Dostawa ekspresowa",
      pickup: "Odbiór osobisty"
    };
    function getStatusConfig(status) {
      return statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800", icon: "❓" };
    }
    function formatDate(dateString) {
      return new Date(dateString).toLocaleString("pl-PL");
    }
    function downloadInvoice() {
      alert("Funkcja pobierania faktury będzie dostępna wkrótce");
    }
    function trackShipment() {
      alert("Śledzenie przesyłki będzie dostępne wkrótce");
    }
    function requestReturn() {
      alert("Zgłaszanie zwrotu będzie dostępne wkrótce");
    }
    head("1vi81lu", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Zamówienie ${escape_html(data.order.orderNumber)} - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", `Szczegóły zamówienia ${stringify(data.order.orderNumber)}`)}/>`);
    });
    $$renderer2.push(`<div class="bg-gray-50 min-h-screen"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8"><div class="mb-8"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-gray-900">Zamówienie ${escape_html(data.order.orderNumber)}</h1> <p class="text-gray-600 mt-1">Złożone ${escape_html(formatDate(data.order.created))}</p></div> <div class="flex items-center space-x-4"><div class="text-right"><p class="text-sm text-gray-500 mb-1">Status zamówienia</p> `);
    CustomBadge($$renderer2, {
      customClass: getStatusConfig(data.order.status).color,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(getStatusConfig(data.order.status).icon)} ${escape_html(getStatusConfig(data.order.status).label)}`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6">`);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold text-gray-900 mb-6">Produkty w zamówieniu</h2> <div class="space-y-4"><!--[-->`);
        const each_array = ensure_array_like(data.order.items);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer3.push(`<div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"><div class="flex-shrink-0">`);
          if (item.product?.mainImage) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<img${attr("src", item.product.mainImage)}${attr("alt", item.product?.name || "Produkt")} class="w-16 h-16 object-cover rounded-lg"/>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="flex-1"><h3 class="font-medium text-gray-900">${escape_html(item.product?.name || `Produkt ID: ${item.productId}`)}</h3> `);
          if (item.product?.sku) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="text-sm text-gray-500">SKU: ${escape_html(item.product.sku)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> <div class="flex items-center space-x-4 mt-2"><span class="text-sm text-gray-600">Ilość: ${escape_html(item.quantity)}</span> <span class="text-sm text-gray-600">Cena: ${escape_html(formatPrice(item.price, "PLN"))}</span></div></div> <div class="text-right"><p class="font-semibold text-gray-900">${escape_html(formatPrice(item.price * item.quantity, "PLN"))}</p></div></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold text-gray-900 mb-6">Historia zamówienia</h2> <div class="space-y-4"><div class="flex items-center space-x-4"><div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div> <div><p class="font-medium text-gray-900">Zamówienie złożone</p> <p class="text-sm text-gray-500">${escape_html(formatDate(data.order.created))}</p></div></div> `);
        if (data.order.status !== "pending") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="flex items-center space-x-4"><div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div> <div><p class="font-medium text-gray-900">Płatność potwierdzona</p> <p class="text-sm text-gray-500">Zamówienie w realizacji</p></div></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (data.order.status === "shipped" || data.order.status === "delivered") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="flex items-center space-x-4"><div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div> <div><p class="font-medium text-gray-900">Zamówienie wysłane</p> <p class="text-sm text-gray-500">Paczka w drodze do Ciebie</p></div></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (data.order.status === "delivered") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="flex items-center space-x-4"><div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div> <div><p class="font-medium text-gray-900">Zamówienie dostarczone</p> <p class="text-sm text-gray-500">Paczka została dostarczona</p></div></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="space-y-6">`);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold text-gray-900 mb-6">Podsumowanie</h2> <div class="space-y-3"><div class="flex justify-between"><span class="text-gray-600">Wartość produktów:</span> <span class="font-medium">${escape_html(formatPrice(data.order.subtotal, "PLN"))}</span></div> <div class="flex justify-between"><span class="text-gray-600">Dostawa:</span> <span class="font-medium">${escape_html(formatPrice(data.order.shippingCost, "PLN"))}</span></div> `);
        if (data.order.tax > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="flex justify-between"><span class="text-gray-600">VAT:</span> <span class="font-medium">${escape_html(formatPrice(data.order.tax, "PLN"))}</span></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div class="border-t pt-3"><div class="flex justify-between"><span class="text-lg font-semibold text-gray-900">Razem:</span> <span class="text-lg font-bold text-gray-900">${escape_html(formatPrice(data.order.total, "PLN"))}</span></div></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold text-gray-900 mb-6">Informacje o płatności i dostawie</h2> <div class="space-y-4"><div><h3 class="font-medium text-gray-900 mb-2">Metoda płatności</h3> <p class="text-gray-600">${escape_html(paymentMethodLabels[data.order.paymentMethod] || data.order.paymentMethod)}</p></div> <div><h3 class="font-medium text-gray-900 mb-2">Metoda dostawy</h3> <p class="text-gray-600">${escape_html(shippingMethodLabels[data.order.shippingMethod] || data.order.shippingMethod)}</p></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold text-gray-900 mb-6">Adres dostawy</h2> <div class="text-gray-600"><p class="font-medium text-gray-900">${escape_html(data.order.shippingAddress.firstName)} ${escape_html(data.order.shippingAddress.lastName)}</p> <p>${escape_html(data.order.shippingAddress.street)}</p> <p>${escape_html(data.order.shippingAddress.postalCode)} ${escape_html(data.order.shippingAddress.city)}</p> <p>${escape_html(data.order.shippingAddress.country)}</p> `);
        if (data.order.metadata?.email) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="mt-3"><span class="font-medium">Email:</span> ${escape_html(data.order.metadata.email)}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (data.order.metadata?.phone) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p><span class="font-medium">Telefon:</span> ${escape_html(data.order.metadata.phone)}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-xl font-semibold text-gray-900 mb-6">Akcje</h2> <div class="space-y-3">`);
        Button($$renderer3, {
          onclick: downloadInvoice,
          variant: "outline",
          class: "w-full",
          children: ($$renderer4) => {
            $$renderer4.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Pobierz fakturę`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        if (data.order.status === "shipped" || data.order.status === "processing") {
          $$renderer3.push("<!--[-->");
          Button($$renderer3, {
            onclick: trackShipment,
            variant: "outline",
            class: "w-full",
            children: ($$renderer4) => {
              $$renderer4.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Śledź przesyłkę`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (data.order.status === "delivered") {
          $$renderer3.push("<!--[-->");
          Button($$renderer3, {
            onclick: requestReturn,
            variant: "outline",
            class: "w-full",
            children: ($$renderer4) => {
              $$renderer4.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg> Zgłoś zwrot`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        Button($$renderer3, {
          href: "/account/orders",
          variant: "outline",
          class: "w-full",
          children: ($$renderer4) => {
            $$renderer4.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> Wszystkie zamówienia`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div></div></div>`);
  });
}
export {
  _page as default
};
