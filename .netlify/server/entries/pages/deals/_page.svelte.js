import { h as head, e as ensure_array_like, c as attr, d as escape_html } from "../../../chunks/vendor.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
function _page($$renderer) {
  const deals = [
    {
      id: 1,
      title: "Summer Sale",
      description: "Up to 50% off on selected items",
      discount: "50%",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
      validUntil: "2024-08-31"
    },
    {
      id: 2,
      title: "Buy 2 Get 1 Free",
      description: "On all accessories",
      discount: "B2G1",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      validUntil: "2024-07-31"
    },
    {
      id: 3,
      title: "Flash Deal",
      description: "24-hour special on electronics",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      validUntil: "2024-06-30"
    }
  ];
  head("34ug9c", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Deals - FixTar</title>`);
    });
    $$renderer2.push(`<meta name="description" content="Check out our latest deals and special offers"/>`);
  });
  $$renderer.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-neutral-900">Special Deals</h1> <p class="mt-2 text-neutral-600">Don't miss out on these amazing offers!</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
  const each_array = ensure_array_like(deals);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let deal = each_array[$$index];
    Card($$renderer, {
      class: "overflow-hidden hover:shadow-xl transition-shadow",
      children: ($$renderer2) => {
        if (deal.image) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", deal.image)}${attr("alt", deal.title)} class="w-full h-48 object-cover"/>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="p-6"><div class="flex justify-between items-start mb-2"><h3 class="text-xl font-semibold text-neutral-900">${escape_html(deal.title)}</h3> <span class="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">${escape_html(deal.discount)}</span></div> <p class="text-neutral-600 mb-4">${escape_html(deal.description)}</p> <p class="text-sm text-neutral-500 mb-4">Valid until: ${escape_html(deal.validUntil)}</p> `);
        Button($$renderer2, {
          href: "/products",
          fullWidth: true,
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Shop Now`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
      },
      $$slots: { default: true }
    });
  }
  $$renderer.push(`<!--]--></div> <div class="mt-12 bg-brand-50 rounded-lg p-8 text-center"><h2 class="text-2xl font-bold text-neutral-900 mb-4">Newsletter Exclusive Deals</h2> <p class="text-neutral-600 mb-6">Subscribe to our newsletter and get exclusive deals delivered to your inbox!</p> <div class="max-w-md mx-auto flex gap-4"><input type="email" placeholder="Enter your email" class="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"/> `);
  Button($$renderer, {
    children: ($$renderer2) => {
      $$renderer2.push(`<!---->Subscribe`);
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----></div></div></div>`);
}
export {
  _page as default
};
