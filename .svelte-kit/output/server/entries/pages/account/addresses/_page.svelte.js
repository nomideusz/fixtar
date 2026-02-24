import { h as head, d as escape_html, e as ensure_array_like, b as stringify, c as attr, i as derived } from "../../../../chunks/vendor.js";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Button } from "../../../../chunks/Button.js";
import { n as notifications } from "../../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { data, form } = $$props;
    let addresses = data.addresses || [];
    let isSubmitting = false;
    const hasError = derived(() => !!data.error);
    const errorMessage = derived(() => data.error || "");
    function handleSetDefault(addressId) {
      isSubmitting = true;
      const formData = new FormData();
      formData.append("id", addressId);
      fetch("?/setDefaultAddress", { method: "POST", body: formData }).then((response) => {
        if (response.ok) {
          addresses = addresses.map((addr) => ({ ...addr, default: addr.id === addressId }));
          notifications.success("Default address updated");
        } else {
          notifications.error("Failed to update default address");
        }
      }).catch((err) => {
        console.error("Error setting default address:", err);
        notifications.error("Failed to update default address");
      }).finally(() => {
        isSubmitting = false;
      });
    }
    head("1dgo0tb", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>My Addresses - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Manage your shipping addresses"/>`);
    });
    $$renderer2.push(`<div><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold text-gray-900">My Addresses</h1> `);
    Button($$renderer2, {
      href: "/account/addresses/new",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Add New Address`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> `);
    if (hasError()) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center py-12"><svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading addresses</h3> <p class="text-gray-600 mb-6">${escape_html(errorMessage())}</p> `);
          Button($$renderer3, {
            onclick: () => window.location.reload(),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Try Again`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
    } else if (addresses.length === 0) {
      $$renderer2.push("<!--[1-->");
      Card($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center py-12"><svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> <h3 class="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3> <p class="text-gray-600 mb-6">Add an address to make checkout faster.</p> `);
          Button($$renderer3, {
            href: "/account/addresses/new",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Add Your First Address`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><!--[-->`);
      const each_array = ensure_array_like(addresses);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let address = each_array[$$index];
        Card($$renderer2, {
          children: ($$renderer3) => {
            $$renderer3.push(`<div class="flex justify-between items-start mb-4"><div><h3 class="font-semibold text-gray-900 flex items-center gap-2">${escape_html(address.type || "Address")} `);
            if (address.default) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Default</span>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></h3></div> <div class="flex gap-2">`);
            Button($$renderer3, {
              href: `/account/addresses/${stringify(address.id)}/edit`,
              variant: "ghost",
              size: "sm",
              children: ($$renderer4) => {
                $$renderer4.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> <button${attr("disabled", isSubmitting, true)} class="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete address"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button> <form${attr("id", `delete-form-${stringify(address.id)}`)} method="POST" action="?/removeAddress" style="display: none;"><input type="hidden" name="id"${attr("value", address.id)}/></form></div></div> <div class="text-sm text-gray-600 space-y-1 mb-4"><p>${escape_html(address.street)}</p> <p>${escape_html(address.city)} ${escape_html(address.postalCode)}</p> <p>${escape_html(address.country)}</p></div> `);
            if (!address.default) {
              $$renderer3.push("<!--[-->");
              Button($$renderer3, {
                onclick: () => handleSetDefault(address.id),
                disabled: isSubmitting,
                variant: "secondary",
                size: "sm",
                fullWidth: true,
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(isSubmitting ? "Setting..." : "Set as Default")}`);
                },
                $$slots: { default: true }
              });
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
