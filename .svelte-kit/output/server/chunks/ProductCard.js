import { c as attr, d as escape_html, e as ensure_array_like, a as attr_class, b as stringify, i as derived } from "./vendor.js";
import "./notifications-simple.js";
function ProductCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { product, onQuickView } = $$props;
    function isInStock(product2) {
      if (!product2.inventory?.trackQuantity) return true;
      return product2.inventory.quantity > 0;
    }
    function getStockStatus(product2) {
      if (!product2.inventory?.trackQuantity) return "Dostępny";
      const quantity = product2.inventory.quantity;
      const lowThreshold = product2.inventory.lowStockThreshold || 10;
      if (quantity === 0) return "Wyprzedany";
      if (quantity <= lowThreshold) return `Mało sztuk (${quantity})`;
      return "Dostępny";
    }
    function getStockColor(product2) {
      if (!product2.inventory?.trackQuantity) return "text-emerald-600";
      const quantity = product2.inventory.quantity;
      const lowThreshold = product2.inventory.lowStockThreshold || 10;
      if (quantity === 0) return "text-red-600";
      if (quantity <= lowThreshold) return "text-orange-600";
      return "text-emerald-600";
    }
    const mainImageUrl = derived(() => product.mainImage || "");
    const inStock = derived(() => isInStock(product));
    const stockStatus = derived(() => getStockStatus(product));
    const stockColor = derived(() => getStockColor(product));
    const hasDiscount = derived(() => product.compareAtPrice && product.compareAtPrice > product.price);
    const discountPercent = derived(() => hasDiscount() ? Math.round((product.compareAtPrice - product.price) / product.compareAtPrice * 100) : 0);
    const productLink = derived(() => product.slug && product.slug.trim() ? product.slug : product.id);
    const productUrl = derived(() => `/products/${productLink()}`);
    $$renderer2.push(`<div class="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"><a${attr("href", productUrl())} class="block cursor-pointer"><div class="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-50">`);
    if (mainImageUrl()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", mainImageUrl())}${attr("alt", product.name)} class="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.__e=event"/> <div class="hidden items-center justify-center h-64 bg-gray-50"><div class="text-center"><svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> <p class="text-sm text-gray-500">Zdjęcie niedostępne</p></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64 bg-gray-50"><div class="text-center"><svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> <p class="text-sm text-gray-500">Brak zdjęcia</p></div></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="absolute top-3 left-3 flex flex-col gap-2">`);
    if (product.featured) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">Polecany</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (hasDiscount()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">-${escape_html(discountPercent())}%</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!inStock()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="bg-gray-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">Wyprzedane</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></a> <div class="p-5"><a${attr("href", productUrl())} class="block"><h3 class="text-base font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">${escape_html(product.name)}</h3> `);
    if (product.shortDescription) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-sm text-gray-600 line-clamp-2">${escape_html(product.shortDescription)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></a> `);
    if (product.expand?.categories && product.expand.categories.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-3 flex flex-wrap gap-1"><!--[-->`);
      const each_array = ensure_array_like(product.expand.categories.slice(0, 2));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer2.push(`<span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">${escape_html(category.name)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-3 flex items-center justify-between"><div class="flex items-center gap-2"><span class="text-lg font-bold text-gray-900">${escape_html(product.price.toFixed(2))} zł</span> `);
    if (hasDiscount()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="text-sm text-gray-500 line-through">${escape_html(product.compareAtPrice?.toFixed(2))} zł</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <span${attr_class(`text-xs font-medium ${stringify(stockColor())}`)}>${escape_html(stockStatus())}</span></div> `);
    if (product.sku) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-1"><span class="text-xs text-gray-400">SKU: ${escape_html(product.sku)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-4 flex gap-2"><button${attr("disabled", !inStock(), true)} class="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed">${escape_html(inStock() ? "Dodaj do Koszyka" : "Wyprzedane")}</button> `);
    if (onQuickView) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button aria-label="Szybki podgląd" class="px-3 py-2 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 rounded-lg transition-colors duration-200"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  ProductCard as P
};
