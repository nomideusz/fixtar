import { h as head, d as escape_html, s as store_get, e as ensure_array_like, c as attr, b as stringify, u as unsubscribe_stores, g as page } from "../../chunks/vendor.js";
function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const popularCategories = [
      { id: "smartphones", name: "Smartphones", icon: "📱" },
      { id: "laptops", name: "Laptops", icon: "💻" },
      { id: "audio", name: "Audio", icon: "🎧" },
      { id: "accessories", name: "Accessories", icon: "⌚" },
      { id: "tablets", name: "Tablets", icon: "📲" }
    ];
    let searchQuery = "";
    head("1j96wlh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Page Not Found - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="The page you're looking for doesn't exist" class="svelte-1j96wlh"/>`);
    });
    $$renderer2.push(`<div class="relative mx-auto min-h-[70vh] max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 svelte-1j96wlh">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="mb-12 text-center svelte-1j96wlh"><div class="mb-4 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium svelte-1j96wlh">Error ${escape_html(store_get($$store_subs ??= {}, "$page", page).status || 404)}</div> <h1 class="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent md:text-5xl lg:text-6xl svelte-1j96wlh">Page Not Found</h1> <p class="mx-auto mb-8 max-w-3xl text-xl text-gray-600 svelte-1j96wlh">The page you're looking for doesn't exist or has been moved.</p> <p class="mb-10 text-lg text-gray-500 italic svelte-1j96wlh">Don't worry, let's get you back on track!</p> <div class="mb-12 flex flex-wrap justify-center gap-4 svelte-1j96wlh"><a href="/" class="btn-primary text-lg px-6 py-3 svelte-1j96wlh">Back to Home</a> <a href="/contact" class="btn-secondary text-lg px-6 py-3 svelte-1j96wlh">Contact Support</a></div></div> <div class="mx-auto max-w-3xl svelte-1j96wlh"><div class="card mb-10 svelte-1j96wlh"><div class="mb-4 flex items-center gap-3 svelte-1j96wlh"><h2 class="text-xl font-bold text-gray-900 svelte-1j96wlh">Here are some suggestions:</h2></div> <div class="mb-6 svelte-1j96wlh"><h3 class="mb-3 text-lg font-medium text-gray-800 svelte-1j96wlh">Popular Categories</h3> <div class="flex flex-wrap gap-2 svelte-1j96wlh"><!--[-->`);
    const each_array = ensure_array_like(popularCategories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let category = each_array[$$index];
      $$renderer2.push(`<a${attr("href", `/products?category=${stringify(category.id)}`)} class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors svelte-1j96wlh"><span class="text-xl svelte-1j96wlh">${escape_html(category.icon)}</span> ${escape_html(category.name)}</a>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="svelte-1j96wlh"><h3 class="mb-3 text-lg font-medium text-gray-800 svelte-1j96wlh">Search our site</h3> <div class="flex gap-2 svelte-1j96wlh"><input type="text" placeholder="iPhone, laptop, headphones..."${attr("value", searchQuery)} class="input flex-1 svelte-1j96wlh"/> <button type="button" class="btn-primary svelte-1j96wlh">Search</button></div></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _error as default
};
