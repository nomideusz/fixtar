import { h as head, d as escape_html, e as ensure_array_like, a as attr_class, b as stringify, i as derived } from "../../../../chunks/vendor.js";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Button } from "../../../../chunks/Button.js";
import { H as Hero } from "../../../../chunks/Hero.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { data } = $$props;
    const orders = derived(() => data.orders || []);
    const hasError = derived(() => !!data.error);
    const errorMessage = derived(() => data.error || "");
    function getStatusColor(status) {
      switch (status.toLowerCase()) {
        case "delivered":
        case "completed":
          return "text-green-800 bg-green-100";
        case "processing":
        case "pending":
          return "text-blue-800 bg-blue-100";
        case "shipped":
        case "shipping":
          return "text-accent-800 bg-purple-100";
        case "cancelled":
        case "canceled":
          return "text-red-800 bg-red-100";
        default:
          return "text-gray-800 bg-gray-100";
      }
    }
    function formatStatus(status) {
      switch (status.toLowerCase()) {
        case "delivered":
        case "completed":
          return "Dostarczono";
        case "processing":
          return "Przetwarzane";
        case "pending":
          return "Oczekuje";
        case "shipped":
        case "shipping":
          return "Wysłano";
        case "cancelled":
        case "canceled":
          return "Anulowano";
        default:
          return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      }
    }
    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
    }
    let statusFilter = "all";
    let sortBy = "date-desc";
    const filteredOrders = derived(() => () => {
      let filtered = orders();
      return filtered.sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return new Date(a.created).getTime() - new Date(b.created).getTime();
          case "date-desc":
            return new Date(b.created).getTime() - new Date(a.created).getTime();
          case "total-asc":
            return (a.total || 0) - (b.total || 0);
          case "total-desc":
            return (b.total || 0) - (a.total || 0);
          default:
            return 0;
        }
      });
    });
    const orderStats = derived(() => () => {
      const total = orders().length;
      const delivered = orders().filter((o) => o.status.toLowerCase() === "delivered" || o.status.toLowerCase() === "completed").length;
      const processing = orders().filter((o) => o.status.toLowerCase() === "processing" || o.status.toLowerCase() === "pending").length;
      const totalSpent = orders().reduce((sum, order) => sum + (order.total || 0), 0);
      return { total, delivered, processing, totalSpent };
    });
    head("itfzfa", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Moje Zamówienia - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Zobacz historię swoich zamówień i śledź ich status"/>`);
    });
    Hero($$renderer2, {
      title: "Moje Zamówienia",
      subtitle: "Przeglądaj historię zamówień, śledź status dostaw i zarządzaj swoimi zakupami",
      centered: true,
      className: "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
    });
    $$renderer2.push(`<!----> <div class="space-y-8">`);
    if (hasError()) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-8 text-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div> <h3 class="text-xl font-bold text-gray-900 mb-2">Wystąpił błąd</h3> <p class="text-gray-600 mb-6">${escape_html(errorMessage())}</p> `);
          Button($$renderer3, {
            href: "/account",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Wróć do konta`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<section><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`);
      Card($$renderer2, {
        hover: true,
        class: "group text-center p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div> <div class="text-2xl font-bold text-blue-600 mb-1">${escape_html(orderStats()().total)}</div> <div class="text-sm text-gray-600 font-medium">Łączne zamówienia</div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        hover: true,
        class: "group text-center p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div> <div class="text-2xl font-bold text-green-600 mb-1">${escape_html(orderStats()().delivered)}</div> <div class="text-sm text-gray-600 font-medium">Dostarczone</div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        hover: true,
        class: "group text-center p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"><svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <div class="text-2xl font-bold text-orange-600 mb-1">${escape_html(orderStats()().processing)}</div> <div class="text-sm text-gray-600 font-medium">W trakcie</div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        hover: true,
        class: "group text-center p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="w-12 h-12 bg-gradient-to-br from-accent-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"><svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg></div> <div class="text-2xl font-bold text-accent-600 mb-1">${escape_html(orderStats()().totalSpent.toFixed(2))} zł</div> <div class="text-sm text-gray-600 font-medium">Łączne wydatki</div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></section> <section>`);
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div class="flex flex-col sm:flex-row gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Filtruj po statusie</label> `);
          $$renderer3.select(
            {
              value: statusFilter,
              class: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "all" }, ($$renderer5) => {
                $$renderer5.push(`Wszystkie`);
              });
              $$renderer4.option({ value: "delivered" }, ($$renderer5) => {
                $$renderer5.push(`Dostarczone`);
              });
              $$renderer4.option({ value: "processing" }, ($$renderer5) => {
                $$renderer5.push(`Przetwarzane`);
              });
              $$renderer4.option({ value: "shipped" }, ($$renderer5) => {
                $$renderer5.push(`Wysłane`);
              });
              $$renderer4.option({ value: "cancelled" }, ($$renderer5) => {
                $$renderer5.push(`Anulowane`);
              });
            }
          );
          $$renderer3.push(`</div> <div><label class="block text-sm font-medium text-gray-700 mb-2">Sortuj według</label> `);
          $$renderer3.select(
            {
              value: sortBy,
              class: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "date-desc" }, ($$renderer5) => {
                $$renderer5.push(`Data: najnowsze`);
              });
              $$renderer4.option({ value: "date-asc" }, ($$renderer5) => {
                $$renderer5.push(`Data: najstarsze`);
              });
              $$renderer4.option({ value: "total-desc" }, ($$renderer5) => {
                $$renderer5.push(`Kwota: malejąco`);
              });
              $$renderer4.option({ value: "total-asc" }, ($$renderer5) => {
                $$renderer5.push(`Kwota: rosnąco`);
              });
            }
          );
          $$renderer3.push(`</div></div> <div class="text-sm text-gray-600">Wyświetlam ${escape_html(filteredOrders()().length)} z ${escape_html(orders().length)} zamówień</div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></section> <section>`);
      if (filteredOrders()().length === 0) {
        $$renderer2.push("<!--[-->");
        Card($$renderer2, {
          class: "p-12 text-center",
          children: ($$renderer3) => {
            $$renderer3.push(`<div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div> <h3 class="text-xl font-bold text-gray-900 mb-2">${escape_html("Brak zamówień")}</h3> <p class="text-gray-600 mb-6">${escape_html(
              "Rozpocznij zakupy i zobacz swoje zamówienia tutaj"
            )}</p> <div class="flex flex-col sm:flex-row gap-3 justify-center">`);
            {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            Button($$renderer3, {
              href: "/products",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Rozpocznij zakupy`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-4"><!--[-->`);
        const each_array = ensure_array_like(filteredOrders()());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let order = each_array[$$index];
          Card($$renderer2, {
            hover: true,
            class: "group",
            children: ($$renderer3) => {
              $$renderer3.push(`<div class="p-6"><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between"><div class="flex-1 mb-4 lg:mb-0"><div class="flex items-center gap-4 mb-3"><div><h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Zamówienie #${escape_html(order.orderNumber || order.id)}</h3> <p class="text-sm text-gray-600">Złożone ${escape_html(formatDate(order.created))}</p></div> <span${attr_class(`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${stringify(getStatusColor(order.status))}`)}>${escape_html(formatStatus(order.status))}</span></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm"><div><span class="text-gray-500">Suma zamówienia:</span> <span class="font-semibold text-gray-900 ml-1">${escape_html((order.total || 0).toFixed(2))} zł</span></div> <div><span class="text-gray-500">Metoda płatności:</span> <span class="font-semibold text-gray-900 ml-1">${escape_html(order.paymentMethod || "Karta")}</span></div> <div><span class="text-gray-500">Dostawa:</span> <span class="font-semibold text-gray-900 ml-1">${escape_html(order.shippingMethod || "Standardowa")}</span></div></div></div> <div class="flex flex-col sm:flex-row gap-3">`);
              Button($$renderer3, {
                href: `/account/orders/${stringify(order.id)}`,
                variant: "outline",
                size: "sm",
                class: "group-hover:border-blue-500 group-hover:text-blue-600 transition-colors",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->Zobacz szczegóły`);
                },
                $$slots: { default: true }
              });
              $$renderer3.push(`<!----> `);
              if (order.status.toLowerCase() === "delivered" || order.status.toLowerCase() === "completed") {
                $$renderer3.push("<!--[-->");
                Button($$renderer3, {
                  href: `/products?reorder=${stringify(order.id)}`,
                  size: "sm",
                  children: ($$renderer4) => {
                    $$renderer4.push(`<!---->Zamów ponownie`);
                  },
                  $$slots: { default: true }
                });
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div></div></div>`);
            },
            $$slots: { default: true }
          });
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></section> <section>`);
      Card($$renderer2, {
        class: "p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-gray-100",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center"><h3 class="text-xl font-bold text-gray-900 mb-4">Potrzebujesz pomocy z zamówieniem?</h3> <p class="text-gray-600 mb-6">Nasz zespół wsparcia jest gotowy do pomocy w każdej kwestii dotyczącej Twoich zamówień</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
          Button($$renderer3, {
            href: "/contact",
            variant: "outline",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Skontaktuj się z nami`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            href: "/help/orders",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Pomoc z zamówieniami`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></section>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
