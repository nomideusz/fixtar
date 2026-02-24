import { h as head, d as escape_html, a as attr_class, e as ensure_array_like, b as stringify } from "../../../../chunks/vendor.js";
import { B as Button } from "../../../../chunks/Button.js";
import { C as Card } from "../../../../chunks/Card.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let inventories = [];
    let selectedInventory = null;
    let syncing = false;
    let loading = false;
    let syncResult = null;
    let error = null;
    async function loadInventories() {
      loading = true;
      error = null;
      try {
        const res = await fetch("/api/baselinker/sync");
        const data = await res.json();
        if (data.error) {
          error = data.error;
        } else {
          inventories = data.inventories || [];
          if (inventories.length > 0 && !selectedInventory) {
            selectedInventory = inventories[0].inventory_id;
          }
        }
      } catch (err) {
        error = err.message || "Nie udało się pobrać katalogów";
      } finally {
        loading = false;
      }
    }
    async function startSync(dryRun = false) {
      if (!selectedInventory) return;
      syncing = true;
      syncResult = null;
      error = null;
      try {
        const res = await fetch("/api/baselinker/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inventoryId: selectedInventory, dryRun })
        });
        const data = await res.json();
        if (data.error) {
          error = data.error;
        } else {
          syncResult = data;
        }
      } catch (err) {
        error = err.message || "Synchronizacja nie powiodła się";
      } finally {
        syncing = false;
      }
    }
    head("eri0jz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>BaseLinker - Admin | FixTar</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h2 class="text-2xl font-bold text-gray-900">Integracja BaseLinker</h2> <p class="text-gray-600 mt-1">Synchronizuj produkty i zarządzaj zamówieniami przez BaseLinker</p></div> `);
    Button($$renderer2, {
      onclick: loadInventories,
      disabled: loading,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(loading ? "Ładowanie..." : "Pobierz katalogi")}`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-red-50 border border-red-200 rounded-lg p-4"><div class="flex items-center"><svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p class="text-red-800">${escape_html(error)}</p></div> `);
      if (error.includes("API token")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-red-600 text-sm mt-2">Ustaw <code class="bg-red-100 px-2 py-1 rounded">BASELINKER_API_TOKEN</code> w pliku <code class="bg-red-100 px-2 py-1 rounded">.env</code></p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-3 gap-4">`);
    Card($$renderer2, {
      class: "p-4",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center gap-3"><div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg></div> <div><p class="text-sm text-gray-600">Status połączenia</p> <p${attr_class(`font-semibold ${stringify(inventories.length > 0 ? "text-green-600" : "text-gray-400")}`)}>${escape_html(inventories.length > 0 ? "Połączono" : "Nie połączono")}</p></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-4",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center gap-3"><div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div> <div><p class="text-sm text-gray-600">Katalogi</p> <p class="font-semibold text-gray-900">${escape_html(inventories.length)}</p></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-4",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center gap-3"><div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></div> <div><p class="text-sm text-gray-600">Ostatnia synchronizacja</p> <p class="font-semibold text-gray-900">${escape_html(syncResult?.timestamp ? new Date(syncResult.timestamp).toLocaleString("pl-PL") : "Brak")}</p></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> `);
    if (inventories.length > 0) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<h3 class="text-lg font-semibold text-gray-900 mb-4">Synchronizacja produktów</h3> <div class="space-y-4"><div><label for="inventory-select" class="block text-sm font-medium text-gray-700 mb-1">Wybierz katalog BaseLinker</label> `);
          $$renderer3.select(
            {
              id: "inventory-select",
              value: selectedInventory,
              class: "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            },
            ($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              const each_array = ensure_array_like(inventories);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let inv = each_array[$$index];
                $$renderer4.option({ value: inv.inventory_id }, ($$renderer5) => {
                  $$renderer5.push(`${escape_html(inv.name)} (ID: ${escape_html(inv.inventory_id)})`);
                });
              }
              $$renderer4.push(`<!--]-->`);
            }
          );
          $$renderer3.push(`</div> <div class="flex gap-3">`);
          Button($$renderer3, {
            onclick: () => startSync(true),
            disabled: syncing || !selectedInventory,
            variant: "outline",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(syncing ? "Sprawdzanie..." : "Podgląd (Dry Run)")}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            onclick: () => startSync(false),
            disabled: syncing || !selectedInventory,
            variant: "primary",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(syncing ? "Synchronizuję..." : "Synchronizuj produkty")}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div>`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (syncResult) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<h3 class="text-lg font-semibold text-gray-900 mb-4">Wynik synchronizacji</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"><div class="bg-green-50 rounded-lg p-3 text-center"><p class="text-2xl font-bold text-green-600">${escape_html(syncResult.productsAdded)}</p> <p class="text-sm text-green-700">Dodanych</p></div> <div class="bg-blue-50 rounded-lg p-3 text-center"><p class="text-2xl font-bold text-blue-600">${escape_html(syncResult.productsUpdated)}</p> <p class="text-sm text-blue-700">Zaktualizowanych</p></div> <div class="bg-gray-50 rounded-lg p-3 text-center"><p class="text-2xl font-bold text-gray-600">${escape_html(syncResult.productsSkipped)}</p> <p class="text-sm text-gray-700">Pominiętych</p></div> <div class="bg-red-50 rounded-lg p-3 text-center"><p class="text-2xl font-bold text-red-600">${escape_html(syncResult.errors.length)}</p> <p class="text-sm text-red-700">Błędów</p></div></div> `);
          if (syncResult.errors.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="mt-4"><h4 class="text-sm font-medium text-red-800 mb-2">Błędy:</h4> <ul class="bg-red-50 rounded-lg p-3 space-y-1"><!--[-->`);
            const each_array_1 = ensure_array_like(syncResult.errors);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let err = each_array_1[$$index_1];
              $$renderer3.push(`<li class="text-sm text-red-700">• ${escape_html(err)}</li>`);
            }
            $$renderer3.push(`<!--]--></ul></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    Card($$renderer2, {
      class: "p-6 bg-gray-50",
      children: ($$renderer3) => {
        $$renderer3.push(`<h3 class="text-lg font-semibold text-gray-900 mb-3">Konfiguracja BaseLinker</h3> <div class="prose prose-sm text-gray-600"><ol class="space-y-2"><li>Zaloguj się do <a href="https://baselinker.com" target="_blank" rel="noopener" class="text-blue-600 hover:underline">BaseLinker</a></li> <li>Przejdź do <strong>Moje konto → API</strong></li> <li>Wygeneruj nowy token API</li> <li>Dodaj token do pliku <code class="bg-gray-200 px-2 py-1 rounded">.env</code>: <pre class="bg-gray-800 text-gray-100 rounded-lg p-3 mt-2">BASELINKER_API_TOKEN=twoj_token_api</pre></li> <li>Kliknij "Pobierz katalogi" aby zweryfikować połączenie</li></ol></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
