import { h as head, s as store_get, d as escape_html, e as ensure_array_like, c as attr, u as unsubscribe_stores, i as derived } from "../../../chunks/vendor.js";
import { c as cart } from "../../../chunks/notifications-simple.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let couponCode = "";
    let discount = 0;
    function applyCoupon() {
      if (couponCode.toUpperCase() === "SAVE10") {
        discount = 0.1;
      } else if (couponCode.toUpperCase() === "SAVE20") {
        discount = 0.2;
      } else {
        discount = 0;
      }
    }
    let subtotal = derived(() => store_get($$store_subs ??= {}, "$cart", cart).reduce((sum, item) => sum + item.price * item.quantity, 0));
    let discountAmount = derived(() => subtotal() * discount);
    let total = derived(() => subtotal() - discountAmount());
    head("k7hhd7", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Shopping Cart - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Review your shopping cart"/>`);
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><h1 class="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1> `);
    if (store_get($$store_subs ??= {}, "$cart", cart).length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-16"><svg class="mx-auto h-24 w-24 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> <h2 class="mt-4 text-xl font-semibold text-neutral-900">Your cart is empty</h2> <p class="mt-2 text-neutral-600">Start shopping to add items to your cart</p> `);
      Button($$renderer2, {
        href: "/products",
        class: "mt-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Browse Products`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2"><div class="bg-white rounded-lg shadow-md p-6"><h2 class="text-xl font-semibold mb-4">Cart Items (${escape_html(store_get($$store_subs ??= {}, "$cart", cart).length)})</h2> <div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cart", cart));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<div class="flex items-center space-x-4 py-4 border-b last:border-0">`);
        if (item.image) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", item.image)}${attr("alt", item.name)} class="w-20 h-20 object-cover rounded"/>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center"><svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="flex-1"><h3 class="font-medium text-neutral-900">${escape_html(item.name)}</h3> <p class="text-neutral-600">$${escape_html(item.price.toFixed(2))}</p></div> <div class="flex items-center space-x-2"><button class="p-1 rounded border border-neutral-300 hover:bg-neutral-100" aria-label="Decrease quantity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button> <span class="w-12 text-center font-medium">${escape_html(item.quantity)}</span> <button class="p-1 rounded border border-neutral-300 hover:bg-neutral-100" aria-label="Increase quantity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button></div> <div class="text-right"><p class="font-medium text-neutral-900">$${escape_html((item.price * item.quantity).toFixed(2))}</p> <button class="text-sm text-red-600 hover:text-red-800">Remove</button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div> <div class="lg:col-span-1"><div class="bg-white rounded-lg shadow-md p-6"><h2 class="text-xl font-semibold mb-4">Order Summary</h2> <div class="mb-4"><div class="flex space-x-2">`);
      Input($$renderer2, {
        type: "text",
        label: "Coupon Code",
        placeholder: "Enter code",
        value: couponCode,
        oninput: (e) => couponCode = e.currentTarget.value,
        class: "flex-1"
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        onclick: applyCoupon,
        variant: "secondary",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Apply`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div> `);
      if (discount > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="mt-2 text-sm text-green-600">Coupon applied! ${escape_html(discount * 100)}% off</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-2 py-4 border-t"><div class="flex justify-between"><span class="text-neutral-600">Subtotal</span> <span class="font-medium">$${escape_html(subtotal().toFixed(2))}</span></div> `);
      if (discount > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex justify-between text-green-600"><span>Discount</span> <span>-$${escape_html(discountAmount().toFixed(2))}</span></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex justify-between"><span class="text-neutral-600">Shipping</span> <span class="font-medium">Free</span></div></div> <div class="flex justify-between py-4 border-t text-lg font-semibold"><span>Total</span> <span>$${escape_html(total().toFixed(2))}</span></div> `);
      Button($$renderer2, {
        href: "/checkout",
        fullWidth: true,
        size: "lg",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Proceed to Checkout`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="mt-4 text-center"><a href="/products" class="text-brand-600 hover:text-brand-800 text-sm">Continue Shopping</a></div></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
