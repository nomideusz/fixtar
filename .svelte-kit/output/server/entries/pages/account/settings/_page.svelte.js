import { h as head, e as ensure_array_like, a as attr_class, b as stringify, d as escape_html } from "../../../../chunks/vendor.js";
import "../../../../chunks/notifications-simple.js";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import { H as Hero } from "../../../../chunks/Hero.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { data, form } = $$props;
    let isSubmitting = false;
    let currentUser = data.user;
    let profileForm = {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      phone: currentUser?.phone || "",
      company: currentUser?.company || ""
    };
    ({
      emailNotifications: currentUser?.preferences?.emailNotifications ?? true,
      smsNotifications: currentUser?.preferences?.smsNotifications ?? false,
      marketingEmails: currentUser?.preferences?.marketingEmails ?? true,
      orderUpdates: currentUser?.preferences?.orderUpdates ?? true,
      newsletter: currentUser?.preferences?.newsletter ?? false,
      language: currentUser?.preferences?.language || "pl",
      currency: currentUser?.preferences?.currency || "PLN",
      theme: currentUser?.preferences?.theme || "light"
    });
    let profileErrors = { username: "", email: "", firstName: "", lastName: "" };
    const settingsSections = [
      {
        id: "profile",
        title: "Informacje osobiste",
        description: "Zarządzaj swoimi danymi osobowymi i kontaktowymi",
        icon: "profile"
      },
      {
        id: "security",
        title: "Bezpieczeństwo",
        description: "Zmień hasło i zarządzaj ustawieniami bezpieczeństwa",
        icon: "security"
      },
      {
        id: "notifications",
        title: "Powiadomienia",
        description: "Dostosuj preferencje powiadomień",
        icon: "notifications"
      },
      {
        id: "preferences",
        title: "Preferencje",
        description: "Personalizuj swoje doświadczenie",
        icon: "preferences"
      }
    ];
    let activeSection = "profile";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1ty8u0q", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Ustawienia Konta - FixTar</title>`);
        });
        $$renderer4.push(`<meta name="description" content="Zarządzaj ustawieniami konta, bezpieczeństwem i preferencjami"/>`);
      });
      Hero($$renderer3, {
        title: "Ustawienia Konta",
        subtitle: "Zarządzaj swoimi danymi osobowymi, bezpieczeństwem i preferencjami zakupowymi",
        centered: true,
        className: "bg-gradient-to-br from-purple-50 via-white to-blue-50"
      });
      $$renderer3.push(`<!----> <div class="space-y-8"><section>`);
      Card($$renderer3, {
        class: "p-6",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
          const each_array = ensure_array_like(settingsSections);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let section = each_array[$$index];
            $$renderer4.push(`<button${attr_class(`settings-nav-item ${stringify(activeSection === section.id ? "settings-nav-active" : "settings-nav-inactive")}`, "svelte-1ty8u0q")}><div class="flex items-center"><div${attr_class(`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${stringify(activeSection === section.id ? "bg-blue-100" : "bg-gray-100")} transition-colors duration-200`)}>`);
            if (section.icon === "profile") {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<svg${attr_class(`w-5 h-5 ${stringify(activeSection === section.id ? "text-blue-600" : "text-gray-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`);
            } else if (section.icon === "security") {
              $$renderer4.push("<!--[1-->");
              $$renderer4.push(`<svg${attr_class(`w-5 h-5 ${stringify(activeSection === section.id ? "text-blue-600" : "text-gray-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`);
            } else if (section.icon === "notifications") {
              $$renderer4.push("<!--[2-->");
              $$renderer4.push(`<svg${attr_class(`w-5 h-5 ${stringify(activeSection === section.id ? "text-blue-600" : "text-gray-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM9 7h6l3 3H6l3-3z"></path></svg>`);
            } else if (section.icon === "preferences") {
              $$renderer4.push("<!--[3-->");
              $$renderer4.push(`<svg${attr_class(`w-5 h-5 ${stringify(activeSection === section.id ? "text-blue-600" : "text-gray-600")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div> <div class="text-left"><div class="font-semibold text-gray-900 text-sm">${escape_html(section.title)}</div> <div class="text-xs text-gray-500 hidden sm:block">${escape_html(section.description)}</div></div></div></button>`);
          }
          $$renderer4.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></section> `);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<section>`);
        Card($$renderer3, {
          class: "p-8",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="mb-8"><h2 class="text-2xl font-bold text-gray-900 mb-2">Informacje osobiste</h2> <p class="text-gray-600">Zaktualizuj swoje dane osobowe i kontaktowe</p></div> <form method="POST" action="?/updateProfile"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div>`);
            Input($$renderer4, {
              label: "Nazwa użytkownika",
              name: "username",
              error: profileErrors.username,
              required: true,
              placeholder: "Wprowadź nazwę użytkownika",
              get value() {
                return profileForm.username;
              },
              set value($$value) {
                profileForm.username = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div>`);
            Input($$renderer4, {
              label: "Adres email",
              name: "email",
              type: "email",
              error: profileErrors.email,
              required: true,
              placeholder: "Wprowadź adres email",
              get value() {
                return profileForm.email;
              },
              set value($$value) {
                profileForm.email = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div>`);
            Input($$renderer4, {
              label: "Imię",
              name: "firstName",
              error: profileErrors.firstName,
              placeholder: "Wprowadź imię",
              get value() {
                return profileForm.firstName;
              },
              set value($$value) {
                profileForm.firstName = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div>`);
            Input($$renderer4, {
              label: "Nazwisko",
              name: "lastName",
              error: profileErrors.lastName,
              placeholder: "Wprowadź nazwisko",
              get value() {
                return profileForm.lastName;
              },
              set value($$value) {
                profileForm.lastName = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div>`);
            Input($$renderer4, {
              label: "Telefon",
              name: "phone",
              type: "tel",
              placeholder: "+48 123 456 789",
              get value() {
                return profileForm.phone;
              },
              set value($$value) {
                profileForm.phone = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div>`);
            Input($$renderer4, {
              label: "Firma (opcjonalnie)",
              name: "company",
              placeholder: "Nazwa firmy",
              get value() {
                return profileForm.company;
              },
              set value($$value) {
                profileForm.company = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div> <div class="mt-8 flex justify-end">`);
            Button($$renderer4, {
              type: "submit",
              disabled: false,
              loading: isSubmitting,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Zapisz zmiany`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div></form>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></section>`);
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> <section>`);
      Card($$renderer3, {
        class: "p-8 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="text-center"><h3 class="text-xl font-bold text-gray-900 mb-4">Akcje konta</h3> <p class="text-gray-600 mb-6">Zarządzaj swoim kontem lub usuń je całkowicie</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
          Button($$renderer4, {
            href: "/account/export",
            variant: "outline",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Eksportuj dane`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            variant: "danger",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Usuń konto`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></section></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
