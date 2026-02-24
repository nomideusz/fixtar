import { h as head, c as attr, d as escape_html } from "../../../../../../chunks/vendor.js";
import { C as Card } from "../../../../../../chunks/Card.js";
import { B as Button } from "../../../../../../chunks/Button.js";
import "../../../../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { data, form } = $$props;
    let isSubmitting = false;
    const address = data.address;
    head("1em1r2k", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Edit Address - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Edit your shipping address"/>`);
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
    $$renderer2.push(`<!----> <h1 class="text-2xl font-bold text-gray-900">Edit Address</h1></div> `);
    if (address) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-2xl">`);
      Card($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<form method="POST" action="?/updateAddress"><input type="hidden" name="id"${attr("value", address.id)}/> <div class="space-y-6"><div><label for="type" class="block text-sm font-medium text-gray-700 mb-2">Address Type</label> `);
          $$renderer3.select(
            {
              id: "type",
              name: "type",
              required: true,
              value: address.type || "Home",
              class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "Home" }, ($$renderer5) => {
                $$renderer5.push(`Home`);
              });
              $$renderer4.option({ value: "Work" }, ($$renderer5) => {
                $$renderer5.push(`Work`);
              });
              $$renderer4.option({ value: "Other" }, ($$renderer5) => {
                $$renderer5.push(`Other`);
              });
            }
          );
          $$renderer3.push(`</div> <div><label for="street" class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label> <input type="text" id="street" name="street" required=""${attr("value", address.street || "")} placeholder="123 Main Street" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="city" class="block text-sm font-medium text-gray-700 mb-2">City *</label> <input type="text" id="city" name="city" required=""${attr("value", address.city || "")} placeholder="Warsaw" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div> <div><label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label> <input type="text" id="postalCode" name="postalCode" required=""${attr("value", address.postalCode || "")} placeholder="00-001" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div></div> <div><label for="country" class="block text-sm font-medium text-gray-700 mb-2">Country *</label> `);
          $$renderer3.select(
            {
              id: "country",
              name: "country",
              required: true,
              value: address.country || "",
              class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "" }, ($$renderer5) => {
                $$renderer5.push(`Select Country`);
              });
              $$renderer4.option({ value: "Poland" }, ($$renderer5) => {
                $$renderer5.push(`Poland`);
              });
              $$renderer4.option({ value: "Germany" }, ($$renderer5) => {
                $$renderer5.push(`Germany`);
              });
              $$renderer4.option({ value: "Czech Republic" }, ($$renderer5) => {
                $$renderer5.push(`Czech Republic`);
              });
              $$renderer4.option({ value: "Slovakia" }, ($$renderer5) => {
                $$renderer5.push(`Slovakia`);
              });
              $$renderer4.option({ value: "Lithuania" }, ($$renderer5) => {
                $$renderer5.push(`Lithuania`);
              });
              $$renderer4.option({ value: "Latvia" }, ($$renderer5) => {
                $$renderer5.push(`Latvia`);
              });
              $$renderer4.option({ value: "Estonia" }, ($$renderer5) => {
                $$renderer5.push(`Estonia`);
              });
              $$renderer4.option({ value: "Other" }, ($$renderer5) => {
                $$renderer5.push(`Other`);
              });
            }
          );
          $$renderer3.push(`</div> <div class="flex items-center"><input type="checkbox" id="default" name="default" value="true"${attr("checked", address.default === true, true)} class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/> <label for="default" class="ml-2 block text-sm text-gray-700">Set as default address</label></div></div> <div class="flex gap-3 pt-6 mt-6 border-t border-gray-200">`);
          Button($$renderer3, {
            type: "submit",
            disabled: isSubmitting,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html("Update Address")}`);
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
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      Card($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center py-12"><svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h3 class="text-lg font-medium text-gray-900 mb-2">Address not found</h3> <p class="text-gray-600 mb-6">The address you're trying to edit doesn't exist.</p> `);
          Button($$renderer3, {
            href: "/account/addresses",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Back to Addresses`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
