import { a as attr_class, e as ensure_array_like, d as escape_html, c as attr, j as page } from "../../../chunks/vendor.js";
import { P as PageContainer } from "../../../chunks/PageContainer.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { children } = $$props;
    let isMounted = false;
    const docSections = [
      {
        name: "Components",
        items: [
          // Add documentation sections as needed
        ]
      },
      { name: "API", items: [] },
      { name: "Guides", items: [] }
    ];
    function isActivePath(path) {
      return page.url.pathname === path;
    }
    $$renderer2.push(`<div class="docs-layout svelte-1bpnej"><div${attr_class("sidebar-desktop svelte-1bpnej", void 0, { "visible": isMounted })}><div class="sidebar-content svelte-1bpnej"><h2 class="sidebar-title svelte-1bpnej">Documentation</h2> <!--[-->`);
    const each_array = ensure_array_like(docSections);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let section = each_array[$$index_1];
      if (section.items.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="sidebar-section svelte-1bpnej"><h3 class="sidebar-section-title svelte-1bpnej">${escape_html(section.name)}</h3> <nav class="sidebar-nav svelte-1bpnej"><!--[-->`);
        const each_array_1 = ensure_array_like(section.items);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let item = each_array_1[$$index];
          $$renderer2.push(`<a${attr("href", item.path)}${attr_class("sidebar-link svelte-1bpnej", void 0, { "active": isActivePath(item.path) })}>${escape_html(item.name)}</a>`);
        }
        $$renderer2.push(`<!--]--></nav></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="sidebar-mobile svelte-1bpnej"><button class="sidebar-toggle svelte-1bpnej" aria-label="Toggle documentation menu"><span class="icon icon-menu-regular" aria-hidden="true"></span> <span class="sidebar-toggle-text svelte-1bpnej">Docs</span></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="docs-content svelte-1bpnej">`);
    PageContainer($$renderer2, {
      paddingY: "py-6",
      children: ($$renderer3) => {
        children?.($$renderer3);
        $$renderer3.push(`<!---->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div>`);
  });
}
export {
  _layout as default
};
