import { h as head, e as ensure_array_like, i as derived } from "../../../../chunks/vendor.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { data } = $$props;
    data.data?.user || null;
    const favorites = derived(() => data.favorites || []);
    head("13oylku", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>My Favorites | FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="View and manage your favorite products"/>`);
    });
    $$renderer2.push(`<div class="favorites-page svelte-13oylku"><div class="account-bg-elements svelte-13oylku"><div class="account-bg-element account-bg-element-1 svelte-13oylku"></div> <div class="account-bg-element account-bg-element-2 svelte-13oylku"></div> <div class="account-bg-element account-bg-element-3 svelte-13oylku"></div></div> <div class="page-container svelte-13oylku"><div class="page-header svelte-13oylku"><h1 class="page-title t-text-brand-primary-light svelte-13oylku">My Favorites</h1> <p class="t-text-tertiary">Products you've saved for later</p></div> <div class="favorites-container">`);
    if (favorites().length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="card empty-state-card svelte-13oylku"><div class="cyber-grid svelte-13oylku"></div> <div class="empty-state svelte-13oylku"><p class="t-text-tertiary">You don't have any favorites yet.</p> <a href="/products" class="btn t-btn-primary svelte-13oylku">Browse Products</a></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="products-grid svelte-13oylku"><!--[-->`);
      const each_array = ensure_array_like(favorites());
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        each_array[i];
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};
