import { h as head, e as ensure_array_like, d as escape_html, a as attr_class, b as stringify, c as attr } from "../../../chunks/vendor.js";
import { H as Hero } from "../../../chunks/Hero.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const teamMembers = [
      {
        name: "Marcin Kowalski",
        role: "Założyciel & CEO",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        bio: "Marcin założył FixTar w 2024 roku po 10 latach doświadczenia w branży narzędziowej, z wizją stworzenia sklepu skoncentrowanego na kliencie.",
        linkedin: "#",
        email: "marcin@FixTar.pl"
      },
      {
        name: "Anna Nowak",
        role: "Marketing & Obsługa Klienta",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
        bio: "Anna nadzoruje nasze strategie marketingowe i zapewnia, że każdy klient ma wyjątkowe doświadczenie z FixTar.",
        linkedin: "#",
        email: "anna@FixTar.pl"
      },
      {
        name: "Tomasz Wiśniewski",
        role: "Specjalista ds. Technicznych",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        bio: "Tomasz to nasz ekspert techniczny, który pomaga klientom w wyborze najlepszych narzędzi do ich potrzeb.",
        linkedin: "#",
        email: "tomasz@FixTar.pl"
      }
    ];
    const brandValues = [
      {
        title: "Jakość Przede Wszystkim",
        icon: "🎯",
        description: "Współpracujemy z zaufanymi markami i osobiście testujemy produkty przed dodaniem ich do naszego sklepu.",
        color: "from-brand-500 to-brand-600"
      },
      {
        title: "Innowacyjność",
        icon: "⚡",
        description: "Śledzimy najnowsze trendy technologiczne, aby dostarczać najnowsze innowacje naszym klientom.",
        color: "from-accent-500 to-accent-600"
      },
      {
        title: "Klient Na Pierwszym Miejscu",
        icon: "👥",
        description: "Oferujemy spersonalizowaną obsługę i porady techniczne, aby pomóc znaleźć idealne rozwiązanie.",
        color: "from-emerald-500 to-emerald-600"
      },
      {
        title: "Profesjonalizm",
        icon: "🏆",
        description: "Wysokie standardy obsługi i profesjonalne doradztwo w każdym aspekcie naszej działalności.",
        color: "from-orange-500 to-orange-600"
      },
      {
        title: "Szybkość Działania",
        icon: "🚀",
        description: "Szybka realizacja zamówień i błyskawiczna odpowiedź na zapytania klientów.",
        color: "from-red-500 to-red-600"
      },
      {
        title: "Wsparcie Techniczne",
        icon: "🔧",
        description: "Kompleksowe wsparcie techniczne długo po dokonaniu zakupu.",
        color: "from-indigo-500 to-indigo-600"
      }
    ];
    const stats = [
      { value: "2024", label: "Rok założenia" },
      { value: "5000+", label: "Zadowolonych klientów" },
      { value: "1200+", label: "Produktów w ofercie" },
      { value: "99%", label: "Pozytywnych opinii" }
    ];
    head("cwls5q", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>O Nas - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Poznaj FixTar - Twój zaufany sklep z profesjonalnymi narzędziami i elektronarzędziami najlepszych marek."/>`);
    });
    Hero($$renderer2, {
      title: "O Nas",
      subtitle: "Poznaj historię i wartości, które kierują nami w codziennej pracy. Jesteśmy zespołem pasjonatów narzędzi, którzy chcą dzielić się swoją wiedzą i doświadczeniem.",
      centered: true,
      className: "bg-gradient-to-br from-brand-50 via-white to-purple-50"
    });
    $$renderer2.push(`<!----> <div class="bg-white"><div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16"><section class="mb-20"><div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"><div class="order-2 lg:order-1"><div class="space-y-6"><div class="inline-flex items-center px-4 py-2 bg-brand-100 text-brand-800 rounded-full text-sm font-semibold"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Nasza Historia</div> <h2 class="text-4xl font-bold text-neutral-900 leading-tight">Pasja do Narzędzi Od 2024 Roku</h2> <div class="space-y-4 text-lg text-neutral-600 leading-relaxed"><p>FixTar narodziło się z prostej idei: dostarczanie najlepszych profesjonalnych narzędzi 
								z profesjonalną obsługą i ekspercką wiedzą. Założyliśmy firmę, aby ułatwić zakup 
								elektronarzędzi najlepszych marek — Stihl, Makita, Bosch, DeWalt, Milwaukee.</p> <p>Nasza misja to nie tylko sprzedaż narzędzi, ale budowanie długotrwałych relacji z klientami 
								poprzez doradztwo techniczne, wsparcie posprzedażowe i ciągłe doskonalenie naszych usług.</p></div> <div class="space-y-4"><!--[-->`);
    const each_array = ensure_array_like([
      {
        title: "Eksperckie Doradztwo",
        desc: "Personalizowane rekomendacje od naszych specjalistów"
      },
      {
        title: "Gwarancja Jakości",
        desc: "Każdy produkt jest starannie testowany i wybrany"
      },
      {
        title: "Wsparcie Techniczne",
        desc: "Ciągłe wsparcie długo po dokonaniu zakupu"
      },
      {
        title: "Szybka Dostawa",
        desc: "Realizacja zamówień w 24 godziny"
      }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<div class="flex items-start group"><div class="flex-shrink-0 mt-1"><div class="w-6 h-6 bg-gradient-to-r from-brand-500 to-accent-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"><svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></div> <div class="ml-4"><span class="font-semibold text-neutral-900">${escape_html(item.title)}:</span> <span class="text-neutral-600">${escape_html(item.desc)}</span></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="order-1 lg:order-2">`);
    Card($$renderer2, {
      class: "overflow-hidden",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="aspect-[4/3] bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center"><img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&amp;q=80" alt="Sklep z narzędziami FixTar" class="w-full h-full object-cover" loading="lazy"/></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div></section> <section class="mb-20">`);
    Card($$renderer2, {
      class: "p-12 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-100",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="text-center mb-12"><h2 class="text-3xl font-bold text-neutral-900 mb-4">FixTar w Liczbach</h2> <p class="text-lg text-neutral-600">Nasze osiągnięcia mówią same za siebie</p></div> <div class="grid grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`);
        const each_array_1 = ensure_array_like(stats);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let stat = each_array_1[$$index_1];
          $$renderer3.push(`<div class="text-center group"><div class="relative"><div class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">${escape_html(stat.value)}</div> <p class="text-sm font-medium text-neutral-600 uppercase tracking-wide">${escape_html(stat.label)}</p></div></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section> <section class="mb-20"><div class="text-center mb-16"><div class="inline-flex items-center px-4 py-2 bg-purple-100 text-accent-800 rounded-full text-sm font-semibold mb-4"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> Nasze Wartości</div> <h2 class="text-4xl font-bold text-neutral-900 mb-6">Co Nas Motywuje</h2> <p class="text-xl text-neutral-600 max-w-3xl mx-auto">Nasze podstawowe wartości kształtują sposób, w jaki prowadzimy biznes i budujemy relacje z klientami</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
    const each_array_2 = ensure_array_like(brandValues);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let value = each_array_2[$$index_2];
      Card($$renderer2, {
        hover: true,
        class: "group",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="relative overflow-hidden"><div${attr_class(`absolute inset-0 bg-gradient-to-br ${stringify(value.color)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`)}></div> <div class="relative p-8 text-center"><div class="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">${escape_html(value.icon)}</div> <h3 class="text-xl font-bold text-neutral-900 mb-4 group-hover:text-brand-600 transition-colors duration-300">${escape_html(value.title)}</h3> <p class="text-neutral-600 leading-relaxed">${escape_html(value.description)}</p></div></div>`);
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--></div></section> <section><div class="text-center mb-16"><div class="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-4"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Nasz Zespół</div> <h2 class="text-4xl font-bold text-neutral-900 mb-6">Poznaj Ludzi Za FixTar</h2> <p class="text-xl text-neutral-600 max-w-3xl mx-auto">Nasz zespół składa się z pasjonatów narzędzi, którzy codziennie pracują nad tym, 
					aby dostarczać najlepsze doświadczenia naszym klientom</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
    const each_array_3 = ensure_array_like(teamMembers);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let member = each_array_3[$$index_3];
      Card($$renderer2, {
        hover: true,
        class: "group",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center"><div class="relative inline-block mb-6"><div class="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-neutral-100 group-hover:ring-brand-200 transition-all duration-300"><img${attr("src", member.image)}${attr("alt", member.name)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/></div> <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></div> <h3 class="text-xl font-bold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors duration-300">${escape_html(member.name)}</h3> <p class="text-brand-600 font-semibold mb-4">${escape_html(member.role)}</p> <p class="text-neutral-600 mb-6 leading-relaxed">${escape_html(member.bio)}</p> <div class="flex justify-center gap-3"><a${attr("href", `mailto:${stringify(member.email)}`)} class="inline-flex items-center px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-700 rounded-lg transition-colors duration-200 text-sm font-medium"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> Email</a> <a${attr("href", member.linkedin)} class="inline-flex items-center px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200 text-sm font-medium"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg> LinkedIn</a></div></div>`);
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--></div></section> <section class="mt-20">`);
    Card($$renderer2, {
      class: "p-12 text-center bg-gradient-to-br from-brand-600 to-accent-700 text-white",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="max-w-3xl mx-auto"><h2 class="text-3xl font-bold mb-6">Dołącz Do Naszej Społeczności</h2> <p class="text-xl mb-8 opacity-90">Przekonaj się sam, dlaczego tysiące klientów wybiera FixTar. 
						Rozpocznij swoją przygodę z najlepszymi narzędziami już dziś.</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
        Button($$renderer3, {
          href: "/products",
          class: "bg-white hover:bg-neutral-100 text-brand-600 font-bold text-lg px-8 py-4 shadow-lg",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Przeglądaj Produkty`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          href: "/contact",
          class: "border-2 border-white/30 backdrop-blur-sm hover:border-white hover:bg-white/10 text-white font-bold text-lg px-8 py-4",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Skontaktuj Się`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></section></div></div>`);
  });
}
export {
  _page as default
};
