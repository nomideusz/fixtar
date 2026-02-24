import { h as head, s as store_get, b as stringify, e as ensure_array_like, d as escape_html, c as attr, a as attr_class, u as unsubscribe_stores, i as derived } from "../../../chunks/vendor.js";
import { c as cart } from "../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { C as Card } from "../../../chunks/Card.js";
import { H as Hero } from "../../../chunks/Hero.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { data, form } = $$props;
    let formData = {
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      apartment: "",
      city: "",
      voivodeship: "",
      postalCode: "",
      phone: "",
      nip: "",
      notes: "",
      saveAddress: false
    };
    let processing = false;
    let errors = {};
    let selectedShipping = null;
    let selectedPayment = null;
    let subtotal = derived(() => store_get($$store_subs ??= {}, "$cart", cart).reduce((sum, item) => sum + item.price * item.quantity, 0));
    let shippingCost = derived(
      () => 0
    );
    let paymentFee = derived(
      () => 0
    );
    let tax = derived(() => subtotal() * 0.23);
    let total = derived(() => subtotal() + shippingCost() + paymentFee() + tax());
    function formatPostalCode(e) {
      const input = e.currentTarget;
      let value = input.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "-" + value.slice(2, 5);
      }
      formData.postalCode = value;
    }
    function formatPhone(e) {
      const input = e.currentTarget;
      let value = input.value.replace(/\D/g, "");
      if (value.length > 0 && !value.startsWith("48")) {
        value = "48" + value;
      }
      if (value.length > 2) {
        const countryCode = value.slice(0, 2);
        const rest = value.slice(2);
        let formatted = "+" + countryCode;
        if (rest.length > 0) {
          formatted += " " + rest.slice(0, 3);
          if (rest.length > 3) {
            formatted += " " + rest.slice(3, 6);
            if (rest.length > 6) {
              formatted += " " + rest.slice(6, 9);
            }
          }
        }
        formData.phone = formatted;
      } else {
        formData.phone = value;
      }
    }
    head("jbcej5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Finalizacja Zamówienia - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Bezpieczna finalizacja zamówienia - wypełnij dane dostawy i płatności"/>`);
    });
    Hero($$renderer2, {
      title: "Finalizacja Zamówienia",
      subtitle: "Bezpiecznie sfinalizuj swoje zakupy - potrzebujesz tylko kilku kliknięć",
      centered: true,
      className: "bg-gradient-to-br from-emerald-50 via-white to-brand-50"
    });
    $$renderer2.push(`<!----> <div class="bg-neutral-50 min-h-screen"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">`);
    if (store_get($$store_subs ??= {}, "$cart", cart).length === 0) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-16 text-center max-w-2xl mx-auto",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-8"><svg class="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div> <h2 class="text-3xl font-bold text-neutral-900 mb-4">Twój koszyk jest pusty</h2> <p class="text-lg text-neutral-600 mb-8">Dodaj produkty do koszyka, aby przejść do finalizacji zamówienia</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
          Button($$renderer3, {
            href: "/products",
            class: "text-lg px-8 py-4",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Przeglądaj produkty`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            href: "/",
            variant: "outline",
            class: "text-lg px-8 py-4",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Wróć do strony głównej`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="mb-12"><div class="flex items-center justify-center space-x-4"><div class="flex items-center"><div class="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div> <span class="ml-3 text-sm font-medium text-brand-600">Koszyk</span></div> <div class="w-16 h-1 bg-brand-600 rounded"></div> <div class="flex items-center"><div class="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div> <span class="ml-3 text-sm font-medium text-brand-600">Finalizacja</span></div> <div class="w-16 h-1 bg-gray-300 rounded"></div> <div class="flex items-center"><div class="w-10 h-10 bg-gray-300 text-neutral-500 rounded-full flex items-center justify-center font-bold text-sm">3</div> <span class="ml-3 text-sm font-medium text-neutral-500">Potwierdzenie</span></div></div></div> <form method="POST" action="?/placeOrder" class="grid grid-cols-1 xl:grid-cols-3 gap-8"><div class="xl:col-span-2 space-y-8">`);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mr-3"><svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg></div> <h2 class="text-2xl font-bold text-neutral-900">Dane kontaktowe</h2></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
          Input($$renderer3, {
            type: "email",
            label: "Adres email",
            name: "email",
            value: formData.email,
            oninput: (e) => formData.email = e.currentTarget.value,
            error: errors.email,
            required: true,
            placeholder: "jan.kowalski@example.com",
            class: "focus:ring-2 focus:ring-brand-500"
          });
          $$renderer3.push(`<!----> `);
          Input($$renderer3, {
            type: "tel",
            label: "Numer telefonu",
            name: "phone",
            value: formData.phone,
            oninput: formatPhone,
            error: errors.phone,
            required: true,
            placeholder: "+48 123 456 789",
            class: "focus:ring-2 focus:ring-brand-500"
          });
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3"><svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div> <h2 class="text-2xl font-bold text-neutral-900">Adres dostawy</h2></div> <div class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
          Input($$renderer3, {
            label: "Imię",
            name: "firstName",
            value: formData.firstName,
            oninput: (e) => formData.firstName = e.currentTarget.value,
            error: errors.firstName,
            required: true,
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----> `);
          Input($$renderer3, {
            label: "Nazwisko",
            name: "lastName",
            value: formData.lastName,
            oninput: (e) => formData.lastName = e.currentTarget.value,
            error: errors.lastName,
            required: true,
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----></div> `);
          Input($$renderer3, {
            label: "Firma (opcjonalnie)",
            name: "company",
            value: formData.company,
            oninput: (e) => formData.company = e.currentTarget.value,
            placeholder: "Nazwa firmy",
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="md:col-span-2">`);
          Input($$renderer3, {
            label: "Ulica i numer domu",
            name: "street",
            value: formData.street,
            oninput: (e) => formData.street = e.currentTarget.value,
            error: errors.street,
            required: true,
            placeholder: "ul. Przykładowa 123",
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----></div> `);
          Input($$renderer3, {
            label: "Nr lokalu",
            name: "apartment",
            value: formData.apartment,
            oninput: (e) => formData.apartment = e.currentTarget.value,
            placeholder: "10",
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
          Input($$renderer3, {
            label: "Miasto",
            name: "city",
            value: formData.city,
            oninput: (e) => formData.city = e.currentTarget.value,
            error: errors.city,
            required: true,
            placeholder: "Warszawa",
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----> <div><label for="voivodeship" class="block text-sm font-semibold text-neutral-700 mb-2">Województwo</label> `);
          $$renderer3.select(
            {
              id: "voivodeship",
              name: "voivodeship",
              value: formData.voivodeship,
              onchange: (e) => formData.voivodeship = e.currentTarget.value,
              class: `w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${stringify(errors.voivodeship ? "border-red-300 focus:ring-red-500" : "")}`,
              required: true
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "" }, ($$renderer5) => {
                $$renderer5.push(`Wybierz województwo`);
              });
              $$renderer4.push(`<!--[-->`);
              const each_array = ensure_array_like(data.voivodeships);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let voivodeship = each_array[$$index];
                $$renderer4.option({ value: voivodeship }, ($$renderer5) => {
                  $$renderer5.push(`${escape_html(voivodeship)}`);
                });
              }
              $$renderer4.push(`<!--]-->`);
            }
          );
          $$renderer3.push(` `);
          if (errors.voivodeship) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="mt-2 text-sm text-red-600">${escape_html(errors.voivodeship)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
          Input($$renderer3, {
            label: "Kod pocztowy",
            name: "postalCode",
            value: formData.postalCode,
            oninput: formatPostalCode,
            error: errors.postalCode,
            required: true,
            placeholder: "00-001",
            maxlength: 6,
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----> `);
          Input($$renderer3, {
            label: "NIP (dla faktury)",
            name: "nip",
            value: formData.nip,
            oninput: (e) => formData.nip = e.currentTarget.value,
            error: errors.nip,
            placeholder: "1234567890",
            class: "focus:ring-2 focus:ring-emerald-500"
          });
          $$renderer3.push(`<!----></div> `);
          if (data.user) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<label class="flex items-center"><input type="checkbox" name="saveAddress"${attr("checked", formData.saveAddress, true)} class="rounded border-neutral-300 text-emerald-600 shadow-sm focus:ring-emerald-500 h-4 w-4"/> <span class="ml-3 text-sm font-medium text-neutral-700">Zapisz adres do przyszłych zamówień</span></label>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3"><svg class="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg></div> <h2 class="text-2xl font-bold text-neutral-900">Metoda dostawy</h2></div> `);
          if (data.shippingMethods && data.shippingMethods.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="space-y-4"><!--[-->`);
            const each_array_1 = ensure_array_like(data.shippingMethods);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let method = each_array_1[$$index_1];
              $$renderer3.push(`<label${attr_class(`shipping-method-card ${stringify(selectedShipping?.id === method.id ? "selected" : "")}`, "svelte-jbcej5")}><input type="radio" name="shippingMethod"${attr("value", method.id)}${attr("checked", selectedShipping?.id === method.id, true)} class="sr-only"/> <div class="flex items-start p-6"><div class="flex-shrink-0 mt-1"><div${attr_class(`w-4 h-4 border-2 border-neutral-300 rounded-full relative ${stringify(selectedShipping?.id === method.id ? "border-purple-600" : "")}`)}>`);
              if (selectedShipping?.id === method.id) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="w-2 h-2 bg-purple-600 rounded-full absolute top-0.5 left-0.5"></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div></div> <div class="ml-4 flex-1"><div class="flex justify-between items-start"><div><h3 class="text-lg font-bold text-neutral-900">${escape_html(method.name)}</h3> <p class="text-sm text-neutral-600 mt-1">${escape_html(method.description)}</p> `);
              if (method.estimatedDeliveryDays) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="flex items-center mt-2"><svg class="w-4 h-4 text-neutral-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span class="text-sm text-neutral-500">Dostawa: ${escape_html(method.estimatedDeliveryDays)} dni roboczych</span></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div> <div class="text-right">`);
              if (method.freeShippingThreshold && subtotal() >= method.freeShippingThreshold) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="text-lg font-bold text-green-600">Darmowa</div> <div class="text-sm text-neutral-500 line-through">${escape_html(method.cost)} zł</div>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<div class="text-lg font-bold text-neutral-900">${escape_html(method.cost)} zł</div> `);
                if (method.freeShippingThreshold) {
                  $$renderer3.push("<!--[-->");
                  $$renderer3.push(`<div class="text-xs text-neutral-500">Darmowa od ${escape_html(method.freeShippingThreshold)} zł</div>`);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]--></div></div></div></div></label>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div class="text-center py-8"><div class="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div> <p class="text-neutral-500">Brak dostępnych metod dostawy. Skontaktuj się z obsługą.</p></div>`);
          }
          $$renderer3.push(`<!--]--> `);
          if (errors.shippingMethod) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="mt-3 text-sm text-red-600">${escape_html(errors.shippingMethod)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3"><svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg></div> <h2 class="text-2xl font-bold text-neutral-900">Metoda płatności</h2></div> `);
          if (data.paymentMethods && data.paymentMethods.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="space-y-4"><!--[-->`);
            const each_array_2 = ensure_array_like(data.paymentMethods);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              let method = each_array_2[$$index_2];
              $$renderer3.push(`<label${attr_class(`payment-method-card ${stringify(selectedPayment?.id === method.id ? "selected" : "")}`, "svelte-jbcej5")}><input type="radio" name="paymentMethod"${attr("value", method.code || method.id)}${attr("checked", selectedPayment?.id === method.id, true)} class="sr-only"/> <div class="flex items-start p-6"><div class="flex-shrink-0 mt-1"><div${attr_class(`w-4 h-4 border-2 border-neutral-300 rounded-full relative ${stringify(selectedPayment?.id === method.id ? "border-orange-600" : "")}`)}>`);
              if (selectedPayment?.id === method.id) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="w-2 h-2 bg-orange-600 rounded-full absolute top-0.5 left-0.5"></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div></div> <div class="ml-4 flex-1"><div class="flex justify-between items-start"><div><h3 class="text-lg font-bold text-neutral-900">${escape_html(method.name)}</h3> <p class="text-sm text-neutral-600 mt-1">${escape_html(method.description)}</p></div> `);
              if (method.processingFee) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="text-right"><div class="text-sm text-neutral-600">+${escape_html(method.feeType === "percentage" ? `${method.processingFee}%` : `${method.processingFee} zł`)}</div></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div></div></div></label>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div class="text-center py-8"><div class="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div> <p class="text-neutral-500">Brak dostępnych metod płatności. Skontaktuj się z obsługą.</p></div>`);
          }
          $$renderer3.push(`<!--]--> `);
          if (errors.paymentMethod) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="mt-3 text-sm text-red-600">${escape_html(errors.paymentMethod)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center mb-6"><div class="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center mr-3"><svg class="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div> <h2 class="text-2xl font-bold text-neutral-900">Dodatkowe informacje</h2></div> <textarea name="notes" placeholder="Uwagi do zamówienia, specjalne instrukcje dostawy (opcjonalnie)" rows="4" class="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none">`);
          const $$body = escape_html(formData.notes);
          if ($$body) {
            $$renderer3.push(`${$$body}`);
          }
          $$renderer3.push(`</textarea>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div> <div class="xl:col-span-1"><div class="sticky top-8">`);
      Card($$renderer2, {
        class: "p-8",
        children: ($$renderer3) => {
          $$renderer3.push(`<h2 class="text-2xl font-bold text-neutral-900 mb-6">Podsumowanie zamówienia</h2> <div class="space-y-4 mb-6"><!--[-->`);
          const each_array_3 = ensure_array_like(store_get($$store_subs ??= {}, "$cart", cart));
          for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
            let item = each_array_3[$$index_3];
            $$renderer3.push(`<div class="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl">`);
            if (item.image) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"><img${attr("src", item.image)}${attr("alt", item.name)} class="w-full h-full object-cover"/></div>`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"><svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`);
            }
            $$renderer3.push(`<!--]--> <div class="flex-1 min-w-0"><h3 class="text-sm font-semibold text-neutral-900 truncate">${escape_html(item.name)}</h3> <p class="text-sm text-neutral-600">Ilość: ${escape_html(item.quantity)}</p> <p class="text-sm font-bold text-brand-600">${escape_html((item.price * item.quantity).toFixed(2))} zł</p></div></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="border-t border-neutral-200 pt-6 space-y-4"><div class="flex justify-between text-sm"><span class="text-neutral-600">Suma częściowa</span> <span class="font-semibold text-neutral-900">${escape_html(subtotal().toFixed(2))} zł</span></div> <div class="flex justify-between text-sm"><span class="text-neutral-600">Dostawa</span> <span${attr_class(`font-semibold ${stringify(shippingCost() === 0 ? "text-green-600" : "text-neutral-900")}`)}>${escape_html(shippingCost() === 0 ? "Darmowa" : `${shippingCost().toFixed(2)} zł`)}</span></div> `);
          if (paymentFee() > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="flex justify-between text-sm"><span class="text-neutral-600">Opłata za płatność</span> <span class="font-semibold text-neutral-900">${escape_html(paymentFee().toFixed(2))} zł</span></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> <div class="flex justify-between text-sm"><span class="text-neutral-600">VAT (23%)</span> <span class="font-semibold text-neutral-900">${escape_html(tax().toFixed(2))} zł</span></div> <div class="flex justify-between text-xl font-bold pt-4 border-t border-neutral-200"><span class="text-neutral-900">Do zapłaty</span> <span class="text-brand-600">${escape_html(total().toFixed(2))} zł</span></div></div> `);
          Button($$renderer3, {
            type: "submit",
            fullWidth: true,
            size: "lg",
            disabled: processing,
            class: "mt-8 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-blue-700 hover:to-accent-700 text-white font-bold py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg",
            children: ($$renderer4) => {
              {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Złóż zamówienie`);
              }
              $$renderer4.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <div class="mt-6 p-4 bg-neutral-50 rounded-xl"><div class="flex items-center text-sm text-neutral-600 mb-3"><svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Bezpieczne szyfrowane połączenie SSL</div> <div class="text-xs text-neutral-500 space-y-1"><p>Składając zamówienie, akceptujesz nasz</p> <p><a href="/regulamin" class="underline hover:text-neutral-700 font-medium">Regulamin</a>  i  <a href="/polityka-prywatnosci" class="underline hover:text-neutral-700 font-medium">Politykę prywatności</a></p></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div></form>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (form?.message) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md z-50"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span class="font-medium">${escape_html(form.message)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
