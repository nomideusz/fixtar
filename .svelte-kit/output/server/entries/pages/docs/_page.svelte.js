import "@sveltejs/kit/internal";
import "../../../chunks/vendor.js";
import "@sveltejs/kit/internal/server";
import { L as LoadingSpinner } from "../../../chunks/LoadingSpinner.js";
import { P as PageContainer } from "../../../chunks/PageContainer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    PageContainer($$renderer2, {
      paddingY: "pb-8 pb-12",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="loading-container svelte-1xmjmrw">`);
        LoadingSpinner($$renderer3, { visible: true, message: "Loading documentation..." });
        $$renderer3.push(`<!----></div>`);
      },
      $$slots: { default: true }
    });
  });
}
export {
  _page as default
};
