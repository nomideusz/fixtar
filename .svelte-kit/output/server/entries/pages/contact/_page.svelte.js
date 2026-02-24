import { h as head, e as ensure_array_like, d as escape_html, c as attr } from "../../../chunks/vendor.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { H as Hero } from "../../../chunks/Hero.js";
import "../../../chunks/notifications-simple.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let formData = { name: "", email: "", subject: "", message: "" };
    let sending = false;
    const contactInfo = [
      {
        icon: "location",
        title: "Adres",
        details: ["ul. Technologiczna 15", "00-001 Warszawa", "Polska"],
        action: { text: "Zobacz na mapie", href: "#" }
      },
      {
        icon: "phone",
        title: "Telefon",
        details: ["+48 22 123 45 67", "+48 800 123 456 (bezpłatna)"],
        action: { text: "Zadzwoń teraz", href: "tel:+48221234567" }
      },
      {
        icon: "email",
        title: "Email",
        details: ["kontakt@FixTar.pl", "wsparcie@FixTar.pl"],
        action: { text: "Napisz email", href: "mailto:kontakt@FixTar.pl" }
      },
      {
        icon: "clock",
        title: "Godziny otwarcia",
        details: [
          "Pon-Pt: 9:00 - 18:00",
          "Sob: 10:00 - 16:00",
          "Nd: zamknięte"
        ],
        action: null
      }
    ];
    const faqItems = [
      {
        question: "Jak długo trwa dostawa?",
        answer: "Standardowa dostawa trwa 1-3 dni robocze. Oferujemy również dostawę ekspresową w ciągu 24 godzin."
      },
      {
        question: "Czy mogę zwrócić produkt?",
        answer: "Tak, masz 14 dni na zwrot produktu bez podania przyczyny. Produkt musi być w oryginalnym opakowaniu."
      },
      {
        question: "Czy oferujecie wsparcie techniczne?",
        answer: "Tak, nasz zespół techniczny jest dostępny od poniedziałku do piątku w godzinach 9:00-17:00."
      },
      {
        question: "Jakie są koszty dostawy?",
        answer: "Dostawa jest bezpłatna przy zamówieniach powyżej 200 zł. Poniżej tej kwoty koszt wynosi 15 zł."
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1bv7ezn", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Kontakt - FixTar</title>`);
        });
        $$renderer4.push(`<meta name="description" content="Skontaktuj się z FixTar w sprawie pytań lub wsparcia. Jesteśmy tutaj, aby pomóc!"/>`);
      });
      Hero($$renderer3, {
        title: "Kontakt",
        subtitle: "Jesteśmy tutaj, aby pomóc! Skontaktuj się z nami w sprawie pytań, wsparcia lub po prostu by porozmawiać o technologii.",
        centered: true,
        className: "bg-gradient-to-br from-emerald-50 via-white to-brand-50"
      });
      $$renderer3.push(`<!----> <div class="bg-white"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16"><section class="mb-20"><div class="text-center mb-12"><div class="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-4"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Informacje Kontaktowe</div> <h2 class="text-3xl font-bold text-neutral-900 mb-4">Skontaktuj Się Z Nami</h2> <p class="text-lg text-neutral-600 max-w-2xl mx-auto">Wybierz najwygodniejszy dla Ciebie sposób kontaktu. Nasz zespół jest gotowy do pomocy.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
      const each_array = ensure_array_like(contactInfo);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let info = each_array[$$index_1];
        Card($$renderer3, {
          hover: true,
          class: "group text-center",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="p-6"><div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">`);
            if (info.icon === "location") {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`);
            } else if (info.icon === "phone") {
              $$renderer4.push("<!--[1-->");
              $$renderer4.push(`<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`);
            } else if (info.icon === "email") {
              $$renderer4.push("<!--[2-->");
              $$renderer4.push(`<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`);
            } else if (info.icon === "clock") {
              $$renderer4.push("<!--[3-->");
              $$renderer4.push(`<svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div> <h3 class="text-lg font-bold text-neutral-900 mb-3 group-hover:text-brand-600 transition-colors duration-200">${escape_html(info.title)}</h3> <div class="space-y-1 mb-4"><!--[-->`);
            const each_array_1 = ensure_array_like(info.details);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let detail = each_array_1[$$index];
              $$renderer4.push(`<p class="text-neutral-600 text-sm">${escape_html(detail)}</p>`);
            }
            $$renderer4.push(`<!--]--></div> `);
            if (info.action) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<a${attr("href", info.action.href)} class="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium text-sm group-hover:underline transition-all duration-200">${escape_html(info.action.text)} <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div>`);
          },
          $$slots: { default: true }
        });
      }
      $$renderer3.push(`<!--]--></div></section> <section class="mb-20"><div class="grid grid-cols-1 lg:grid-cols-2 gap-16"><div>`);
      Card($$renderer3, {
        class: "p-8",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="mb-8"><h3 class="text-2xl font-bold text-neutral-900 mb-4">Napisz Do Nas</h3> <p class="text-neutral-600">Wypełnij formularz poniżej, a odpowiemy w ciągu 24 godzin.</p></div> <form class="space-y-6"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label for="name" class="block text-sm font-semibold text-neutral-900 mb-2">Imię i nazwisko *</label> `);
          Input($$renderer4, {
            id: "name",
            type: "text",
            placeholder: "Jan Kowalski",
            required: true,
            disabled: sending,
            get value() {
              return formData.name;
            },
            set value($$value) {
              formData.name = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div><label for="email" class="block text-sm font-semibold text-neutral-900 mb-2">Adres email *</label> `);
          Input($$renderer4, {
            id: "email",
            type: "email",
            placeholder: "jan@example.com",
            required: true,
            disabled: sending,
            get value() {
              return formData.email;
            },
            set value($$value) {
              formData.email = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div> <div><label for="subject" class="block text-sm font-semibold text-neutral-900 mb-2">Temat *</label> `);
          Input($$renderer4, {
            id: "subject",
            type: "text",
            placeholder: "W czym możemy pomóc?",
            required: true,
            disabled: sending,
            get value() {
              return formData.subject;
            },
            set value($$value) {
              formData.subject = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div><label for="message" class="block text-sm font-semibold text-neutral-900 mb-2">Wiadomość *</label> <textarea id="message" placeholder="Opisz swoje pytanie lub problem..." required=""${attr("disabled", sending, true)} rows="5" class="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed">`);
          const $$body = escape_html(formData.message);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div> `);
          Button($$renderer4, {
            type: "submit",
            disabled: sending,
            class: "w-full text-lg py-4",
            children: ($$renderer5) => {
              {
                $$renderer5.push("<!--[!-->");
                $$renderer5.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> Wyślij Wiadomość`);
              }
              $$renderer5.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></form>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> <div class="space-y-6">`);
      Card($$renderer3, {
        class: "overflow-hidden",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><div class="text-center p-8"><svg class="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> <p class="text-neutral-600 font-medium">Mapa do naszego biura</p> <p class="text-sm text-neutral-500 mt-2">ul. Technologiczna 15, Warszawa</p></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        class: "p-6 bg-gradient-to-br from-brand-50 to-emerald-50",
        children: ($$renderer4) => {
          $$renderer4.push(`<h4 class="text-lg font-bold text-neutral-900 mb-4">Odwiedź Nas</h4> <div class="space-y-3 text-sm"><div class="flex items-center"><svg class="w-5 h-5 text-brand-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> <span class="text-neutral-700">ul. Technologiczna 15, 00-001 Warszawa</span></div> <div class="flex items-center"><svg class="w-5 h-5 text-brand-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 0V7a1 1 0 011-1h6a1 1 0 011 1v0m-8 0h8M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4M9 21H5a1 1 0 01-1-1v-4a1 1 0 011-1h4m0 0h4m0 0h4a1 1 0 011 1v4a1 1 0 01-1 1h-4"></path></svg> <span class="text-neutral-700">2 piętro, pokój 205</span></div> <div class="flex items-center"><svg class="w-5 h-5 text-brand-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg> <span class="text-neutral-700">Parking dostępny na terenie budynku</span></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div></section> <section><div class="text-center mb-12"><div class="inline-flex items-center px-4 py-2 bg-brand-100 text-brand-800 rounded-full text-sm font-semibold mb-4"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Często Zadawane Pytania</div> <h2 class="text-3xl font-bold text-neutral-900 mb-4">Masz Pytanie?</h2> <p class="text-lg text-neutral-600 max-w-2xl mx-auto">Sprawdź odpowiedzi na najczęściej zadawane pytania lub skontaktuj się z nami bezpośrednio.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><!--[-->`);
      const each_array_2 = ensure_array_like(faqItems);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let faq = each_array_2[$$index_2];
        Card($$renderer3, {
          class: "p-6 hover:shadow-lg transition-shadow duration-200",
          children: ($$renderer4) => {
            $$renderer4.push(`<h4 class="text-lg font-semibold text-neutral-900 mb-3">${escape_html(faq.question)}</h4> <p class="text-neutral-600 leading-relaxed">${escape_html(faq.answer)}</p>`);
          },
          $$slots: { default: true }
        });
      }
      $$renderer3.push(`<!--]--></div> <div class="text-center mt-12">`);
      Card($$renderer3, {
        class: "p-8 bg-gradient-to-br from-neutral-50 to-white inline-block",
        children: ($$renderer4) => {
          $$renderer4.push(`<h3 class="text-xl font-bold text-neutral-900 mb-4">Nie znalazłeś odpowiedzi?</h3> <p class="text-neutral-600 mb-6">Nasz zespół wsparcia jest gotowy do pomocy</p> <div class="flex flex-col sm:flex-row gap-3 justify-center">`);
          Button($$renderer4, {
            href: "tel:+48221234567",
            variant: "outline",
            children: ($$renderer5) => {
              $$renderer5.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> Zadzwoń`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            href: "mailto:kontakt@FixTar.pl",
            children: ($$renderer5) => {
              $$renderer5.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> Napisz Email`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></section></div></div>`);
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
