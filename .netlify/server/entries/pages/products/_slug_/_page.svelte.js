import { h as head, c as attr, b as stringify, d as escape_html, e as ensure_array_like, a as attr_class, t as html, i as derived } from "../../../../chunks/vendor.js";
import { c as cart, n as notifications } from "../../../../chunks/notifications-simple.js";
import { B as Button } from "../../../../chunks/Button.js";
import { C as Card } from "../../../../chunks/Card.js";
import { P as ProductCard } from "../../../../chunks/ProductCard.js";
import "pocketbase";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let { product, relatedProducts } = data;
    let quantity = 1;
    let selectedImageIndex = 0;
    function isInStock(product2) {
      if (!product2.inventory?.trackQuantity) return true;
      return product2.inventory.quantity > 0;
    }
    function getStockStatus(product2) {
      if (!product2.inventory?.trackQuantity) return "Dostępny";
      const qty = product2.inventory.quantity;
      const lowThreshold = product2.inventory.lowStockThreshold || 10;
      if (qty === 0) return "Wyprzedany";
      if (qty <= lowThreshold) return `Mało sztuk (${qty})`;
      return "Dostępny";
    }
    function getStockColor(product2) {
      if (!product2.inventory?.trackQuantity) return "text-emerald-600";
      const qty = product2.inventory.quantity;
      const lowThreshold = product2.inventory.lowStockThreshold || 10;
      if (qty === 0) return "text-red-600";
      if (qty <= lowThreshold) return "text-orange-600";
      return "text-emerald-600";
    }
    function addToCart() {
      cart.addItem(
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.mainImage
          // Use the already processed URL
        },
        quantity
      );
      notifications.success(`Dodano ${quantity} ${product.name} do koszyka`);
    }
    function increaseQuantity() {
      const maxQuantity = product.inventory?.trackQuantity ? product.inventory.quantity : 99;
      if (quantity < maxQuantity) {
        quantity++;
      }
    }
    function decreaseQuantity() {
      if (quantity > 1) {
        quantity--;
      }
    }
    const inStock = derived(() => isInStock(product));
    const stockStatus = derived(() => getStockStatus(product));
    const stockColor = derived(() => getStockColor(product));
    const hasDiscount = derived(() => product.compareAtPrice && product.compareAtPrice > product.price);
    const discountPercent = derived(() => hasDiscount() ? Math.round((product.compareAtPrice - product.price) / product.compareAtPrice * 100) : 0);
    const mainImageUrl = derived(() => product.mainImage || "");
    const galleryImages = derived(() => product.gallery || []);
    const allImages = derived(() => [mainImageUrl(), ...galleryImages()].filter(Boolean));
    head("1iljj73", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(product.name)} - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", product.description || product.shortDescription || `${product.name} - Dostępny w FixTar`)}/>`);
    });
    $$renderer2.push(`<div class="bg-gradient-to-b from-gray-50 to-white min-h-screen"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8"><nav class="mb-8"><ol class="flex items-center space-x-2 text-sm"><li><a href="/" class="text-gray-500 hover:text-blue-600 transition-colors font-medium">Strona główna</a></li> <li><svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></li> <li><a href="/products" class="text-gray-500 hover:text-blue-600 transition-colors font-medium">Produkty</a></li> `);
    if (product.expand?.categories && product.expand.categories.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<li><svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></li> <li><a${attr("href", `/products?category=${stringify(product.expand.categories[0].slug)}`)} class="text-gray-500 hover:text-blue-600 transition-colors font-medium">${escape_html(product.expand.categories[0].name)}</a></li>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <li><svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></li> <li class="text-gray-900 font-medium">${escape_html(product.name)}</li></ol></nav> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12"><div class="space-y-6">`);
    Card($$renderer2, {
      class: "overflow-hidden",
      children: ($$renderer3) => {
        if (allImages().length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="space-y-4"><div class="relative group"><div class="aspect-square w-full overflow-hidden bg-gray-100 rounded-xl"><button class="w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl" aria-label="Powiększ zdjęcie produktu"><img${attr("src", allImages()[selectedImageIndex])}${attr("alt", product.name)} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.__e=event" onload="this.__e=event"/></button></div> <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none"><div class="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-900"><svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Kliknij aby powiększyć</div></div> <div class="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">`);
          if (product.featured) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<span class="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">Polecany</span>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> `);
          if (hasDiscount()) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<span class="bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">-${escape_html(discountPercent())}%</span>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> `);
          if (!inStock()) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<span class="bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">Wyprzedane</span>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div></div> `);
          if (allImages().length > 1) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="flex space-x-3 overflow-x-auto pb-2"><!--[-->`);
            const each_array = ensure_array_like(allImages());
            for (let index = 0, $$length = each_array.length; index < $$length; index++) {
              let image = each_array[index];
              $$renderer3.push(`<button${attr_class(`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${stringify(selectedImageIndex === index ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300")}`)}><img${attr("src", image)}${attr("alt", `${product.name} widok ${index + 1}`)} class="w-full h-full object-cover"/></button>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div class="flex items-center justify-center h-96 bg-gray-100 rounded-xl"><div class="text-center"><svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> <p class="text-gray-500">Brak zdjęcia produktu</p></div></div>`);
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="space-y-8"><div><div class="flex items-start justify-between mb-4"><h1 class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">${escape_html(product.name)}</h1></div> <div class="space-y-4"><div class="flex items-center gap-4"><span class="text-4xl font-bold text-blue-600">${escape_html(product.price.toFixed(2))} zł</span> `);
    if (hasDiscount()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-2"><span class="text-xl text-gray-500 line-through">${escape_html(product.compareAtPrice?.toFixed(2))} zł</span> <span class="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-lg">-${escape_html(discountPercent())}%</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-3"><div class="flex items-center gap-2"><div${attr_class(`w-2 h-2 rounded-full ${stringify(inStock() ? "bg-emerald-500" : "bg-red-500")}`)}></div> <span${attr_class(`text-sm font-semibold ${stringify(stockColor())}`)}>${escape_html(stockStatus())}</span></div> `);
    if (product.sku) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-sm text-gray-500">SKU: <span class="font-mono">${escape_html(product.sku)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    if (product.expand?.categories && product.expand.categories.length > 0) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        glass: true,
        class: "p-4",
        children: ($$renderer3) => {
          $$renderer3.push(`<h3 class="text-sm font-semibold text-gray-900 mb-3">Kategorie</h3> <div class="flex flex-wrap gap-2"><!--[-->`);
          const each_array_1 = ensure_array_like(product.expand.categories);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let category = each_array_1[$$index_1];
            $$renderer3.push(`<a${attr("href", `/products?category=${stringify(category.slug)}`)} class="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg> ${escape_html(category.name)}</a>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (product.description || product.shortDescription) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<h3 class="text-lg font-semibold text-gray-900 mb-4">Opis produktu</h3> <div class="text-gray-700 leading-relaxed">`);
          if (product.description) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="prose prose-sm max-w-none">${html(product.description.replace(/\n/g, "<br>"))}</div>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<p>${escape_html(product.shortDescription)}</p>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (inStock()) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="space-y-6"><div><label for="quantity" class="block text-sm font-semibold text-gray-900 mb-3">Ilość</label> <div class="flex items-center gap-4"><div class="flex items-center bg-white rounded-xl border border-gray-300 shadow-sm">`);
          Button($$renderer3, {
            variant: "ghost",
            size: "sm",
            onclick: decreaseQuantity,
            disabled: quantity <= 1,
            class: "rounded-l-xl rounded-r-none border-0",
            children: ($$renderer4) => {
              $$renderer4.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <div class="px-4 py-2 text-lg font-semibold text-gray-900 min-w-[60px] text-center">${escape_html(quantity)}</div> `);
          Button($$renderer3, {
            variant: "ghost",
            size: "sm",
            onclick: increaseQuantity,
            disabled: product.inventory?.trackQuantity && quantity >= product.inventory.quantity,
            class: "rounded-r-xl rounded-l-none border-0",
            children: ($$renderer4) => {
              $$renderer4.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> `);
          if (product.inventory?.trackQuantity && product.inventory.quantity <= 10) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<span class="text-sm text-orange-600 font-medium">Tylko ${escape_html(product.inventory.quantity)} sztuk w magazynie</span>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div></div> <div class="flex items-center justify-between py-4 px-4 bg-white rounded-xl border border-gray-200"><span class="text-lg font-semibold text-gray-900">Łączna cena:</span> <span class="text-2xl font-bold text-blue-600">${escape_html((product.price * quantity).toFixed(2))} zł</span></div> `);
          Button($$renderer3, {
            onclick: addToCart,
            class: "w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200",
            size: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Dodaj do koszyka`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600"><div class="flex items-center gap-2"><svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Darmowa dostawa od 200 zł</div> <div class="flex items-center gap-2"><svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Gwarancja producenta</div></div></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      Card($$renderer2, {
        class: "p-6 bg-red-50 border border-red-200",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center"><svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <h3 class="text-lg font-semibold text-gray-900 mb-2">Produkt niedostępny</h3> <p class="text-gray-600 mb-4">Ten produkt jest obecnie wyprzedany</p> `);
          Button($$renderer3, {
            disabled: true,
            class: "w-full",
            size: "lg",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Wyprzedane`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (relatedProducts && relatedProducts.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-20">`);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center mb-10"><h2 class="text-3xl font-bold text-gray-900 mb-4">Podobne produkty</h2> <p class="text-gray-600 max-w-2xl mx-auto">Sprawdź inne produkty, które mogą Cię zainteresować</p></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
          const each_array_2 = ensure_array_like(relatedProducts);
          for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
            let relatedProduct = each_array_2[$$index_2];
            ProductCard($$renderer3, { product: relatedProduct });
          }
          $$renderer3.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
