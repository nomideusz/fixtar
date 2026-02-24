import { s as store_get, h as head, d as escape_html, u as unsubscribe_stores, g as page } from "../../../../chunks/vendor.js";
import { P as PageContainer } from "../../../../chunks/PageContainer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let productId;
    productId = store_get($$store_subs ??= {}, "$page", page).params.id;
    head("1sbdlqh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>XML Product ${escape_html(productId)} | FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="XML Product details"/>`);
    });
    PageContainer($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="py-8"><div class="mb-6"><a href="/xml-products" class="text-blue-600 hover:text-blue-800 flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Back to XML Products</a></div> <h1 class="text-3xl font-bold mb-8">XML Product Details</h1> <div class="bg-blue-50 border border-blue-200 rounded-lg p-6"><div class="flex items-center mb-4"><svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h2 class="text-xl font-semibold text-blue-900">XML Product: ${escape_html(productId)}</h2></div> <p class="text-blue-800 mb-4">This would show detailed information for XML product with ID: <strong>${escape_html(productId)}</strong></p> <div class="bg-white rounded-md p-4 border border-blue-200"><h3 class="font-medium text-blue-900 mb-2">Product Features:</h3> <ul class="list-disc list-inside text-blue-800 space-y-1"><li>Product images and gallery</li> <li>Detailed specifications</li> <li>Pricing and availability</li> <li>Category information</li> <li>Related products</li></ul></div> <div class="mt-4 flex space-x-3"><a href="/xml-products" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Back to XML Products</a> <a href="/products" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">View Regular Products</a></div></div></div>`);
      },
      $$slots: { default: true }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
