import { h as head, c as attr, d as escape_html, a as attr_class, f as attr_style, b as stringify } from "../../../../chunks/vendor.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import { C as Card } from "../../../../chunks/Card.js";
import "../../../../chunks/notifications-simple.js";
import { F as FixTarLogo } from "../../../../chunks/logo-FixTar.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { form } = $$props;
    let formData = {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      acceptTerms: false,
      acceptMarketing: false
    };
    let loading = false;
    let errors = {};
    let passwordStrength = 0;
    function getPasswordStrengthText() {
      switch (passwordStrength) {
        case 0:
        case 1:
          return "Bardzo słabe";
        case 2:
          return "Słabe";
        case 3:
          return "Średnie";
        case 4:
          return "Silne";
        case 5:
          return "Bardzo silne";
        default:
          return "";
      }
    }
    function getPasswordStrengthColor() {
      switch (passwordStrength) {
        case 0:
        case 1:
          return "bg-red-500";
        case 2:
          return "bg-orange-500";
        case 3:
          return "bg-yellow-500";
        case 4:
          return "bg-green-500";
        case 5:
          return "bg-emerald-500";
        default:
          return "bg-gray-300";
      }
    }
    head("8bdjn9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Rejestracja - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Utwórz konto w sklepie FixTar"/>`);
    });
    $$renderer2.push(`<div class="bg-gray-50 min-h-screen py-12"><div class="max-w-md mx-auto px-6"><div class="text-center mb-8"><img${attr("src", FixTarLogo)} alt="FixTar" class="h-12 w-auto mx-auto mb-4"/> <h1 class="text-2xl font-bold text-gray-900 mb-2">Rejestracja</h1> <p class="text-gray-600">Utwórz nowe konto</p></div> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<form method="POST" class="space-y-4">`);
        if (errors.general) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">${escape_html(errors.general)}</div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div class="grid grid-cols-2 gap-3">`);
        Input($$renderer3, {
          name: "firstName",
          label: "Imię",
          value: formData.firstName,
          oninput: (e) => formData.firstName = e.currentTarget.value,
          error: errors.firstName,
          required: true,
          autocomplete: "given-name",
          placeholder: "Jan"
        });
        $$renderer3.push(`<!----> `);
        Input($$renderer3, {
          name: "lastName",
          label: "Nazwisko",
          value: formData.lastName,
          oninput: (e) => formData.lastName = e.currentTarget.value,
          error: errors.lastName,
          required: true,
          autocomplete: "family-name",
          placeholder: "Kowalski"
        });
        $$renderer3.push(`<!----></div> `);
        Input($$renderer3, {
          type: "email",
          name: "email",
          label: "Email",
          value: formData.email,
          oninput: (e) => formData.email = e.currentTarget.value,
          error: errors.email,
          required: true,
          autocomplete: "email",
          placeholder: "jan.kowalski@example.com"
        });
        $$renderer3.push(`<!----> <div>`);
        Input($$renderer3, {
          type: "password",
          name: "password",
          label: "Hasło",
          value: formData.password,
          oninput: (e) => formData.password = e.currentTarget.value,
          error: errors.password,
          required: true,
          autocomplete: "new-password",
          placeholder: "Minimum 8 znaków"
        });
        $$renderer3.push(`<!----> `);
        if (formData.password) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="mt-2"><div class="flex items-center justify-between mb-1"><span class="text-xs text-gray-600">Siła hasła</span> <span class="text-xs text-gray-500">${escape_html(getPasswordStrengthText())}</span></div> <div class="w-full bg-gray-200 rounded-full h-1"><div${attr_class(`h-1 rounded-full transition-all duration-300 ${stringify(getPasswordStrengthColor())}`, "svelte-8bdjn9")}${attr_style(`width: ${stringify(passwordStrength / 5 * 100)}%`)}></div></div></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> `);
        Input($$renderer3, {
          type: "password",
          name: "confirmPassword",
          label: "Potwierdź hasło",
          value: formData.confirmPassword,
          oninput: (e) => formData.confirmPassword = e.currentTarget.value,
          error: errors.confirmPassword,
          required: true,
          autocomplete: "new-password",
          placeholder: "Powtórz hasło"
        });
        $$renderer3.push(`<!----> <div class="space-y-3"><div><label class="flex items-start cursor-pointer text-sm"><input type="checkbox" name="acceptTerms"${attr("checked", formData.acceptTerms, true)} class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"/> <span class="ml-2 text-gray-700">Akceptuję <a href="/regulamin" class="text-blue-600 hover:text-blue-700 underline" target="_blank">Regulamin</a>  i  <a href="/polityka-prywatnosci" class="text-blue-600 hover:text-blue-700 underline" target="_blank">Politykę Prywatności</a></span></label> `);
        if (errors.acceptTerms) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="mt-1 text-sm text-red-600">${escape_html(errors.acceptTerms)}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> <div><label class="flex items-start cursor-pointer text-sm"><input type="checkbox" name="acceptMarketing"${attr("checked", formData.acceptMarketing, true)} class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"/> <span class="ml-2 text-gray-700">Wyrażam zgodę na otrzymywanie informacji handlowych <span class="text-gray-500">(opcjonalnie)</span></span></label></div></div> `);
        Button($$renderer3, {
          type: "submit",
          fullWidth: true,
          disabled: loading,
          class: "mt-6",
          children: ($$renderer4) => {
            {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`Utwórz konto`);
            }
            $$renderer4.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></form> <div class="mt-6"><div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div> <div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">lub</span></div></div> <div class="mt-4 space-y-2"><button type="button" class="social-login-button svelte-8bdjn9"><svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> <span class="ml-2">Google</span></button> <button type="button" class="social-login-button svelte-8bdjn9"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path></svg> <span class="ml-2">GitHub</span></button></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <div class="mt-6 text-center"><p class="text-sm text-gray-600">Masz już konto? <a href="/auth/login" class="text-blue-600 hover:text-blue-700 font-medium">Zaloguj się</a></p></div></div></div>`);
  });
}
export {
  _page as default
};
