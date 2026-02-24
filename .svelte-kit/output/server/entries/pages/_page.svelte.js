import { h as head, f as attr_style, e as ensure_array_like, d as escape_html, c as attr, b as stringify, a as attr_class } from "../../chunks/vendor.js";
import { B as Button } from "../../chunks/Button.js";
import { P as ProductCard } from "../../chunks/ProductCard.js";
import "../../chunks/notifications-simple.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let scrollY = 0;
    let newsletterEmail = "";
    let newsletterSubmitting = false;
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>FixTar - Profesjonalne Narzędzia i Elektronarzędzia</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Sklep z profesjonalnymi narzędziami - pilarki, wiertarki, szlifierki, spawarki. Stihl, Makita, Bosch, DeWalt, Milwaukee." class="svelte-1uha8ag"/>`);
    });
    $$renderer2.push(`<section class="relative min-h-screen flex items-center overflow-hidden svelte-1uha8ag"><div class="absolute inset-0 bg-gradient-to-br from-neutral-900 via-gray-800 to-neutral-900 svelte-1uha8ag"><div class="absolute inset-0 bg-black/20 svelte-1uha8ag"></div></div> <div class="absolute inset-0 overflow-hidden svelte-1uha8ag"><div class="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float svelte-1uha8ag"></div> <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed svelte-1uha8ag"></div> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-500/10 rounded-full blur-3xl animate-pulse svelte-1uha8ag"></div> <div class="absolute inset-0 svelte-1uha8ag" style="background-image: url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.03\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); opacity: 0.5;"></div></div> <div class="relative z-10 max-w-screen-2xl mx-auto px-6 py-32 sm:px-8 lg:px-12 w-full svelte-1uha8ag"${attr_style(`transform: translateY(${stringify(scrollY * 0.3)}px)`)}><div class="grid lg:grid-cols-2 gap-12 items-center svelte-1uha8ag"><div class="text-center lg:text-left svelte-1uha8ag"><div class="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white mb-8 animate-fade-in svelte-1uha8ag"><span class="relative flex h-3 w-3 mr-3 svelte-1uha8ag"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 svelte-1uha8ag"></span> <span class="relative inline-flex rounded-full h-3 w-3 bg-brand-500 svelte-1uha8ag"></span></span> <span class="text-sm font-medium svelte-1uha8ag">Profesjonalne narzędzia najlepszych marek</span></div> <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 animate-fade-in-up svelte-1uha8ag"><span class="text-white svelte-1uha8ag">Narzędzia</span> <br class="svelte-1uha8ag"/> <span class="text-orange-400 svelte-1uha8ag">Dla Profesjonalistów</span> <br class="svelte-1uha8ag"/> <span class="text-white svelte-1uha8ag">i Majsterkowiczów</span></h1> <p class="text-xl sm:text-2xl text-gray-200 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up animation-delay-200 svelte-1uha8ag">Pilarki, wiertarki, szlifierki i więcej. Stihl, Makita, Bosch, DeWalt — najwyższa jakość w konkurencyjnych cenach.</p> <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-400 svelte-1uha8ag">`);
    Button($$renderer2, {
      href: "/products",
      class: "shadow-2xl",
      children: ($$renderer3) => {
        $$renderer3.push(`<span class="relative z-10 svelte-1uha8ag">Przeglądaj Produkty</span>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Button($$renderer2, {
      href: "/contact",
      class: "group border-2 border-white/30 backdrop-blur-sm hover:border-white hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300",
      children: ($$renderer3) => {
        $$renderer3.push(`<span class="flex items-center svelte-1uha8ag">Skontaktuj się z nami <svg class="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform svelte-1uha8ag" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" class="svelte-1uha8ag"></path></svg></span>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up animation-delay-600 svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like([
      { value: "5000+", label: "Zadowolonych Klientów" },
      { value: "1200+", label: "Produktów w Ofercie" },
      { value: "99%", label: "Pozytywnych Opinii" }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let stat = each_array[$$index];
      $$renderer2.push(`<div class="text-center lg:text-left svelte-1uha8ag"><p class="text-3xl font-bold text-white svelte-1uha8ag">${escape_html(stat.value)}</p> <p class="text-sm text-neutral-300 mt-1 svelte-1uha8ag">${escape_html(stat.label)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="hidden lg:block relative svelte-1uha8ag">`);
    if (data.featuredProducts && data.featuredProducts.length > 0) {
      $$renderer2.push("<!--[-->");
      const featuredProduct = data.featuredProducts[0];
      $$renderer2.push(`<div class="relative w-full h-[600px] svelte-1uha8ag"><div class="h-full animate-float-subtle svelte-1uha8ag"><div class="h-full bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl svelte-1uha8ag"><div class="h-full flex flex-col svelte-1uha8ag"><div class="mb-4 flex justify-between items-start svelte-1uha8ag"><span class="inline-flex items-center px-4 py-2 bg-brand-500/80 backdrop-blur-sm text-white text-sm font-bold rounded-full svelte-1uha8ag">⭐ Polecany Produkt</span> `);
      if (featuredProduct.compareAtPrice && featuredProduct.compareAtPrice > featuredProduct.price) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="inline-flex items-center px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white text-sm font-bold rounded-full svelte-1uha8ag">-${escape_html(Math.round((featuredProduct.compareAtPrice - featuredProduct.price) / featuredProduct.compareAtPrice * 100))}%</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (featuredProduct.mainImage) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="relative bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 mb-6 flex-1 flex items-center justify-center overflow-hidden svelte-1uha8ag"><img${attr("src", featuredProduct.mainImage)}${attr("alt", featuredProduct.name)} class="max-w-full max-h-full object-contain transform hover:scale-105 transition-transform duration-500 svelte-1uha8ag"/></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="relative bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 mb-6 flex-1 flex items-center justify-center svelte-1uha8ag"><svg class="w-32 h-32 text-neutral-600 svelte-1uha8ag" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" class="svelte-1uha8ag"></path></svg></div>`);
      }
      $$renderer2.push(`<!--]--> <div class="mt-auto svelte-1uha8ag"><h3 class="text-xl font-bold text-white mb-2 line-clamp-2 svelte-1uha8ag">${escape_html(featuredProduct.name)}</h3> <div class="flex items-center gap-3 mb-4 svelte-1uha8ag"><p class="text-3xl font-bold text-brand-400 svelte-1uha8ag">${escape_html(featuredProduct.price.toFixed(2))} zł</p> `);
      if (featuredProduct.compareAtPrice && featuredProduct.compareAtPrice > featuredProduct.price) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-xl text-neutral-400 line-through svelte-1uha8ag">${escape_html(featuredProduct.compareAtPrice.toFixed(2))} zł</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (featuredProduct.inventory?.trackQuantity && featuredProduct.inventory.quantity > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-green-400 mb-4 svelte-1uha8ag">✓ Dostępny (${escape_html(featuredProduct.inventory.quantity)} szt.)</p>`);
      } else if (featuredProduct.inventory?.trackQuantity && featuredProduct.inventory.quantity === 0) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<p class="text-sm text-red-400 mb-4 svelte-1uha8ag">✗ Wyprzedany</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<p class="text-sm text-green-400 mb-4 svelte-1uha8ag">✓ Dostępny</p>`);
      }
      $$renderer2.push(`<!--]--> <a${attr("href", `/products/${stringify(featuredProduct.slug || featuredProduct.id)}`)} class="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 svelte-1uha8ag">Zobacz Produkt <svg class="ml-2 w-5 h-5 svelte-1uha8ag" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" class="svelte-1uha8ag"></path></svg></a></div></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="relative w-full h-[600px] svelte-1uha8ag"><div class="h-full animate-float-subtle svelte-1uha8ag"><div class="h-full bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl flex items-center justify-center svelte-1uha8ag"><div class="text-center svelte-1uha8ag"><div class="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 svelte-1uha8ag"><svg class="w-16 h-16 text-white svelte-1uha8ag" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" class="svelte-1uha8ag"></path></svg></div> <h3 class="text-2xl font-bold text-white mb-4 svelte-1uha8ag">Profesjonalne Narzędzia</h3> <p class="text-neutral-300 mb-6 svelte-1uha8ag">Odkryj naszą ofertę</p> <a href="/products" class="inline-flex items-center justify-center px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 svelte-1uha8ag">Przeglądaj Produkty</a></div></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce svelte-1uha8ag"><div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center svelte-1uha8ag"><div class="w-1 h-3 bg-white rounded-full mt-2 animate-scroll svelte-1uha8ag"></div></div></div></section> <section class="py-24 relative bg-gradient-to-b from-neutral-50 to-white svelte-1uha8ag"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 svelte-1uha8ag"><div class="text-center mb-20 svelte-1uha8ag"><div class="inline-block relative svelte-1uha8ag"><h2 class="text-6xl lg:text-7xl xl:text-8xl font-black text-neutral-900 mb-6 svelte-1uha8ag">Wybrane Produkty</h2></div> <p class="text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto svelte-1uha8ag">Starannie wyselekcjonowane produkty, które pokochają nasi klienci</p></div> `);
    if (data.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="relative svelte-1uha8ag"><div class="absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl transform rotate-1 svelte-1uha8ag"></div> <div class="relative bg-white rounded-3xl p-12 shadow-xl svelte-1uha8ag"><div class="text-center svelte-1uha8ag"><div class="w-24 h-24 mx-auto mb-6 relative svelte-1uha8ag"><div class="absolute inset-0 bg-red-200 rounded-full animate-ping svelte-1uha8ag"></div> <div class="relative bg-red-100 rounded-full w-full h-full flex items-center justify-center svelte-1uha8ag"><svg class="w-12 h-12 text-red-600 svelte-1uha8ag" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" class="svelte-1uha8ag"></path></svg></div></div> <h3 class="text-2xl font-bold text-neutral-900 mb-4 svelte-1uha8ag">Ups! Coś poszło nie tak</h3> <p class="text-neutral-600 mb-8 svelte-1uha8ag">${escape_html(data.error)}</p> `);
      Button($$renderer2, {
        href: "/products",
        class: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Spróbuj Ponownie`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div></div>`);
    } else if (data.featuredProducts.length > 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 svelte-1uha8ag"><!--[-->`);
      const each_array_1 = ensure_array_like(data.featuredProducts.slice(0, 8));
      for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
        let product = each_array_1[index];
        $$renderer2.push(`<div${attr_class(`group relative ${stringify(index === 0 ? "md:col-span-2 md:row-span-2" : "")} ${stringify(index === 3 ? "lg:col-span-2" : "")}`, "svelte-1uha8ag")}${attr_style(`animation: fadeInScale 0.6s ease-out ${stringify(index * 0.1)}s both`)}><div class="relative h-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] svelte-1uha8ag"><div class="relative h-full svelte-1uha8ag">`);
        if (index === 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="h-full min-h-[500px] p-8 flex flex-col svelte-1uha8ag"><div class="flex-1 svelte-1uha8ag"><span class="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-full mb-6 svelte-1uha8ag">🔥 Bestseller</span> <h3 class="text-3xl font-bold text-neutral-900 mb-4 group-hover:text-brand-700 transition-colors svelte-1uha8ag">${escape_html(product.name)}</h3> <p class="text-neutral-600 text-lg mb-6 line-clamp-3 svelte-1uha8ag">${escape_html(product.description || "Odkryj najwyższą jakość i innowacyjny design")}</p> <p class="text-4xl font-bold text-brand-600 svelte-1uha8ag">${escape_html(product.price)} zł</p></div> `);
          if (product.mainImage) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="mt-6 relative h-64 rounded-2xl overflow-hidden flex-shrink-0 svelte-1uha8ag"><img${attr("src", product.mainImage)}${attr("alt", product.name)} class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 svelte-1uha8ag" loading="lazy"/></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          ProductCard($$renderer2, { product });
        }
        $$renderer2.push(`<!--]--></div> `);
        if (index < 3) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="absolute -top-8 -right-8 w-16 h-16 bg-brand-400/30 rounded-full opacity-20 group-hover:opacity-40 group-hover:scale-150 transition-all duration-500 svelte-1uha8ag"></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="mt-20 text-center svelte-1uha8ag"><div class="relative inline-block svelte-1uha8ag">`);
      Button($$renderer2, {
        href: "/products",
        class: "group relative overflow-hidden bg-brand-600 hover:bg-brand-700 text-white font-bold px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-500 text-lg",
        children: ($$renderer3) => {
          $$renderer3.push(`<span class="relative z-10 flex items-center svelte-1uha8ag">Zobacz Wszystkie Produkty <svg class="ml-3 w-6 h-6 transform group-hover:translate-x-2 transition-transform svelte-1uha8ag" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" class="svelte-1uha8ag"></path></svg></span>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 svelte-1uha8ag"><!--[-->`);
      const each_array_2 = ensure_array_like([0, 1, 2]);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let dot = each_array_2[$$index_2];
        $$renderer2.push(`<div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce svelte-1uha8ag"${attr_style(`animation-delay: ${stringify(dot * 0.2)}s`)}></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="relative svelte-1uha8ag"><div class="absolute inset-0 bg-gradient-to-r from-accent-100 to-indigo-100 rounded-3xl transform -rotate-1 svelte-1uha8ag"></div> <div class="relative bg-white rounded-3xl p-16 shadow-xl svelte-1uha8ag"><div class="text-center svelte-1uha8ag"><div class="w-32 h-32 mx-auto mb-8 relative svelte-1uha8ag"><div class="absolute inset-0 bg-accent-200 rounded-full animate-pulse svelte-1uha8ag"></div> <div class="relative bg-gradient-to-br from-accent-100 to-indigo-100 rounded-full w-full h-full flex items-center justify-center svelte-1uha8ag"><svg class="w-16 h-16 text-accent-600 svelte-1uha8ag" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" class="svelte-1uha8ag"></path></svg></div></div> <h3 class="text-3xl font-bold text-neutral-900 mb-4 svelte-1uha8ag">Przygotowujemy Coś Specjalnego</h3> <p class="text-xl text-neutral-600 mb-8 max-w-md mx-auto svelte-1uha8ag">Nasza nowa kolekcja już wkrótce. Bądź pierwszym, który ją zobaczy!</p> `);
      Button($$renderer2, {
        href: "/contact",
        class: "bg-gradient-to-r from-accent-600 to-indigo-600 hover:from-accent-700 hover:to-brand-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Powiadom Mnie`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="py-24 relative overflow-hidden svelte-1uha8ag"><div class="absolute inset-0 bg-neutral-50 svelte-1uha8ag"></div> <div class="absolute top-0 left-0 w-full h-full svelte-1uha8ag"><div class="absolute top-20 left-10 w-72 h-72 bg-brand-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob svelte-1uha8ag"></div> <div class="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 svelte-1uha8ag"></div> <div class="absolute -bottom-8 left-20 w-72 h-72 bg-neutral-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 svelte-1uha8ag"></div></div> <div class="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 svelte-1uha8ag"><div class="text-center mb-16 svelte-1uha8ag"><h2 class="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 svelte-1uha8ag">Dlaczego <span class="text-brand-600 svelte-1uha8ag">FixTar</span>?</h2> <p class="text-xl text-neutral-600 max-w-3xl mx-auto svelte-1uha8ag">Najlepsze marki, profesjonalny serwis i konkurencyjne ceny elektronarzędzi</p></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 svelte-1uha8ag"><!--[-->`);
    const each_array_3 = ensure_array_like([
      {
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        title: "Gwarancja i Serwis",
        description: "Pełna gwarancja producenta oraz profesjonalny serwis techniczny",
        color: "green-600",
        delay: "0"
      },
      {
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
        title: "Ekspresowa Dostawa",
        description: "Szybka wysyłka w 24h na terenie całego kraju",
        color: "blue-600",
        delay: "200"
      },
      {
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        title: "Wsparcie Eksperckie",
        description: "Doradztwo techniczne i pomoc w doborze narzędzi",
        color: "purple-600",
        delay: "400"
      }
    ]);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let feature = each_array_3[$$index_3];
      $$renderer2.push(`<div class="group relative animate-fade-in-up svelte-1uha8ag"${attr_style(`animation-delay: ${stringify(feature.delay)}ms`)}><div class="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-neutral-100 svelte-1uha8ag"><div${attr_class(`absolute top-0 right-0 w-32 h-32 bg-${stringify(feature.color)}/5 blur-2xl`, "svelte-1uha8ag")}></div> <div class="relative w-16 h-16 mb-6 svelte-1uha8ag"><div${attr_class(`w-full h-16 bg-${stringify(feature.color)}/10 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`, "svelte-1uha8ag")}><svg${attr_class(`w-8 h-8 text-${stringify(feature.color)}`, "svelte-1uha8ag")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", feature.icon)} class="svelte-1uha8ag"></path></svg></div></div> <h3${attr_class(`text-2xl font-bold text-neutral-900 mb-4 group-hover:text-${stringify(feature.color)} transition-colors duration-300`, "svelte-1uha8ag")}>${escape_html(feature.title)}</h3> <p class="text-neutral-600 leading-relaxed svelte-1uha8ag">${escape_html(feature.description)}</p> <div${attr_class(`absolute bottom-0 left-0 right-0 h-1 bg-${stringify(feature.color)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`, "svelte-1uha8ag")}></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="py-24 relative overflow-hidden svelte-1uha8ag"><div class="absolute inset-0 bg-neutral-900 svelte-1uha8ag"><div class="absolute inset-0 bg-black/10 svelte-1uha8ag"></div></div> <div class="absolute inset-0 svelte-1uha8ag"><!--[-->`);
    const each_array_4 = ensure_array_like(Array(12));
    for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
      each_array_4[i];
      $$renderer2.push(`<div class="absolute w-1 h-1 bg-white rounded-full animate-float-up opacity-20 svelte-1uha8ag"${attr_style(`left: ${stringify(Math.random() * 100)}%; animation-delay: ${stringify(Math.random() * 10)}s; animation-duration: ${stringify(15 + Math.random() * 20)}s`)}></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 svelte-1uha8ag"><div class="max-w-4xl mx-auto text-center svelte-1uha8ag"><div class="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white mb-8 svelte-1uha8ag"><span class="relative flex h-3 w-3 mr-3 svelte-1uha8ag"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 svelte-1uha8ag"></span> <span class="relative inline-flex rounded-full h-3 w-3 bg-brand-500 svelte-1uha8ag"></span></span> <span class="text-sm font-medium svelte-1uha8ag">Dołącz do ponad 15,000 subskrybentów</span></div> <h2 class="text-5xl lg:text-6xl font-bold text-white mb-6 svelte-1uha8ag">Newsletter FixTar</h2> <p class="text-xl text-gray-200 mb-12 svelte-1uha8ag">Otrzymuj informacje o najnowszych narzędziach, promocjach i nowościach ze świata elektronarzędzi</p> <form class="relative max-w-2xl mx-auto svelte-1uha8ag"><div class="relative group svelte-1uha8ag"><div class="absolute -inset-1 bg-brand-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity svelte-1uha8ag"></div> <div class="relative flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 svelte-1uha8ag"><input type="email" placeholder="twoj@email.pl"${attr("value", newsletterEmail)}${attr("disabled", newsletterSubmitting, true)} class="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm text-white placeholder-neutral-300 rounded-xl focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-brand-400/50 transition-all duration-300 disabled:opacity-50 svelte-1uha8ag" required=""/> <button type="submit"${attr("disabled", !newsletterEmail.trim(), true)} class="px-8 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 whitespace-nowrap svelte-1uha8ag">${escape_html("Zapisz się")}</button></div></div> <p class="text-sm text-neutral-300 mt-6 svelte-1uha8ag">Szanujemy Twoją prywatność. Możesz zrezygnować w każdej chwili.</p></form> <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8 opacity-10 svelte-1uha8ag"><div class="w-20 h-20 border-4 border-white rounded-full animate-ping svelte-1uha8ag"></div> <div class="w-16 h-16 border-4 border-white rounded-full animate-ping animation-delay-200 svelte-1uha8ag"></div> <div class="w-12 h-12 border-4 border-white rounded-full animate-ping animation-delay-400 svelte-1uha8ag"></div></div></div></div></section>`);
  });
}
export {
  _page as default
};
