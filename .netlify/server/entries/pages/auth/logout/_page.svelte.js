import { h as head, c as attr } from "../../../../chunks/vendor.js";
import "../../../../chunks/notifications-simple.js";
import "@sveltejs/kit/internal";
import "@sveltejs/kit/internal/server";
import { C as Card } from "../../../../chunks/Card.js";
import { H as Hero } from "../../../../chunks/Hero.js";
import { F as FixTarLogo } from "../../../../chunks/logo-FixTar.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("wg845q", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Wylogowywanie - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Wylogowywanie z konta FixTar" class="svelte-wg845q"/>`);
    });
    Hero($$renderer2, {
      title: "Do zobaczenia!",
      subtitle: "Wylogowywanie z Twojego konta FixTar - dziękujemy za odwiedziny",
      centered: true,
      className: "bg-gradient-to-br from-orange-50 via-white to-red-50"
    });
    $$renderer2.push(`<!----> <div class="bg-gray-50 min-h-screen svelte-wg845q"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16 svelte-wg845q"><div class="max-w-md mx-auto svelte-wg845q"><div class="text-center mb-8 svelte-wg845q"><div class="relative inline-block mb-6 svelte-wg845q"><div class="absolute inset-0 bg-orange-100 rounded-full transform scale-110 opacity-30 svelte-wg845q"></div> <img${attr("src", FixTarLogo)} alt="FixTar" class="relative h-16 w-auto mx-auto svelte-wg845q"/></div></div> `);
    Card($$renderer2, {
      class: "p-8 shadow-xl text-center",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-8 svelte-wg845q">`);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="relative inline-block svelte-wg845q"><div class="absolute inset-0 bg-blue-100 rounded-full animate-pulse svelte-wg845q"></div> <div class="relative w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl svelte-wg845q"><svg class="w-10 h-10 text-white animate-spin svelte-wg845q" fill="none" viewBox="0 0 24 24"><circle class="opacity-25 svelte-wg845q" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75 svelte-wg845q" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div></div>`);
        }
        $$renderer3.push(`<!--]--></div> <div class="mb-8 svelte-wg845q">`);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<h1 class="text-3xl font-bold text-gray-900 mb-4 svelte-wg845q">Wylogowywanie...</h1> <p class="text-lg text-gray-600 mb-6 svelte-wg845q">Prosimy czekać, kończymy sesję</p> <div class="flex items-center justify-center space-x-2 svelte-wg845q"><div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce svelte-wg845q"></div> <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce svelte-wg845q" style="animation-delay: 0.1s"></div> <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce svelte-wg845q" style="animation-delay: 0.2s"></div></div>`);
        }
        $$renderer3.push(`<!--]--></div> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <div class="mt-8 text-center svelte-wg845q"><div class="bg-white rounded-xl p-6 shadow-md svelte-wg845q"><div class="flex items-center justify-center text-sm text-gray-600 mb-3 svelte-wg845q"><svg class="w-4 h-4 mr-2 text-green-600 svelte-wg845q" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" class="svelte-wg845q"></path></svg> Twoja sesja została bezpiecznie zakończona</div> <div class="text-xs text-gray-500 space-y-1 svelte-wg845q"><p class="svelte-wg845q">Wszystkie dane sesji zostały usunięte z przeglądarki</p> <p class="svelte-wg845q">Twoje konto pozostaje bezpieczne</p></div></div></div></div></div></div>`);
  });
}
export {
  _page as default
};
