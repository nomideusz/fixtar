import { h as head, d as escape_html } from "../../../../../chunks/vendor.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { B as Button } from "../../../../../chunks/Button.js";
import "../../../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { form } = $$props;
    let isSubmitting = false;
    head("1osli7i", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Add New Address - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Add a new shipping address"/>`);
    });
    $$renderer2.push(`<div><div class="flex items-center gap-4 mb-6">`);
    Button($$renderer2, {
      href: "/account/addresses",
      variant: "ghost",
      size: "sm",
      children: ($$renderer3) => {
        $$renderer3.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Back to Addresses`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <h1 class="text-2xl font-bold text-gray-900">Add New Address</h1></div> <div class="max-w-2xl">`);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<form method="POST" action="?/addAddress"><div class="space-y-6"><div><label for="type" class="block text-sm font-medium text-gray-700 mb-2">Address Type</label> <select id="type" name="type" required="" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">`);
        $$renderer3.option({ value: "Home" }, ($$renderer4) => {
          $$renderer4.push(`Home`);
        });
        $$renderer3.option({ value: "Work" }, ($$renderer4) => {
          $$renderer4.push(`Work`);
        });
        $$renderer3.option({ value: "Other" }, ($$renderer4) => {
          $$renderer4.push(`Other`);
        });
        $$renderer3.push(`</select></div> <div><label for="street" class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label> <input type="text" id="street" name="street" required="" placeholder="123 Main Street" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="city" class="block text-sm font-medium text-gray-700 mb-2">City *</label> <input type="text" id="city" name="city" required="" placeholder="Warsaw" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div> <div><label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label> <input type="text" id="postalCode" name="postalCode" required="" placeholder="00-001" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div></div> <div><label for="country" class="block text-sm font-medium text-gray-700 mb-2">Country *</label> <select id="country" name="country" required="" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">`);
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Select Country`);
        });
        $$renderer3.option({ value: "Poland" }, ($$renderer4) => {
          $$renderer4.push(`Poland`);
        });
        $$renderer3.option({ value: "Germany" }, ($$renderer4) => {
          $$renderer4.push(`Germany`);
        });
        $$renderer3.option({ value: "Czech Republic" }, ($$renderer4) => {
          $$renderer4.push(`Czech Republic`);
        });
        $$renderer3.option({ value: "Slovakia" }, ($$renderer4) => {
          $$renderer4.push(`Slovakia`);
        });
        $$renderer3.option({ value: "Lithuania" }, ($$renderer4) => {
          $$renderer4.push(`Lithuania`);
        });
        $$renderer3.option({ value: "Latvia" }, ($$renderer4) => {
          $$renderer4.push(`Latvia`);
        });
        $$renderer3.option({ value: "Estonia" }, ($$renderer4) => {
          $$renderer4.push(`Estonia`);
        });
        $$renderer3.option({ value: "Other" }, ($$renderer4) => {
          $$renderer4.push(`Other`);
        });
        $$renderer3.push(`</select></div> <div class="flex items-center"><input type="checkbox" id="default" name="default" value="true" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/> <label for="default" class="ml-2 block text-sm text-gray-700">Set as default address</label></div></div> <div class="flex gap-3 pt-6 mt-6 border-t border-gray-200">`);
        Button($$renderer3, {
          type: "submit",
          disabled: isSubmitting,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html("Add Address")}`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          type: "button",
          variant: "secondary",
          href: "/account/addresses",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Cancel`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></form>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div>`);
  });
}
export {
  _page as default
};
