import { a as attr_class, d as escape_html, c as attr, b as stringify } from "./vendor.js";
import { B as Button } from "./Button.js";
function Hero($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      title,
      subtitle,
      image,
      className = "",
      primaryButton,
      secondaryButton,
      centered = false,
      fullHeight = false,
      children
    } = $$props;
    $$renderer2.push(`<section${attr_class(`${stringify(fullHeight ? "min-h-screen" : "")} relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white ${stringify(className)}`)}><div class="absolute inset-0 opacity-[0.02]"><div class="absolute inset-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;); background-size: 60px 60px;"></div></div> <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32"><div${attr_class(centered ? "text-center" : "lg:grid lg:grid-cols-2 lg:gap-16 items-center")}><div${attr_class(centered ? "max-w-3xl mx-auto" : "")}><h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">${escape_html(title)}</h1> `);
    if (subtitle) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p${attr_class(`text-lg sm:text-xl text-neutral-600 mb-8 leading-relaxed ${stringify(centered ? "max-w-2xl mx-auto" : "")}`)}>${escape_html(subtitle)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (primaryButton || secondaryButton) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(`flex flex-col sm:flex-row gap-4 ${stringify(centered ? "justify-center" : "")}`)}>`);
      if (primaryButton) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          href: primaryButton.href,
          onclick: primaryButton.onClick,
          size: "lg",
          class: "shadow-lg hover:shadow-xl transition-shadow",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(primaryButton.text)}`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (secondaryButton) {
        $$renderer2.push("<!--[-->");
        Button($$renderer2, {
          href: secondaryButton.href,
          onclick: secondaryButton.onClick,
          variant: "outline",
          size: "lg",
          class: "border-2",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(secondaryButton.text)}`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (children) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (image && !centered) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-12 lg:mt-0"><div class="relative"><div class="absolute -inset-4 bg-brand-100 rounded-2xl opacity-20 blur-3xl"></div> <img${attr("src", image)}${attr("alt", title)} class="relative rounded-2xl shadow-2xl w-full h-auto object-cover"/></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (image && centered) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-16 max-w-5xl mx-auto"><div class="relative"><div class="absolute -inset-4 bg-brand-100 rounded-2xl opacity-20 blur-3xl"></div> <img${attr("src", image)}${attr("alt", title)} class="relative rounded-2xl shadow-2xl w-full h-auto object-cover"/></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></section>`);
  });
}
export {
  Hero as H
};
