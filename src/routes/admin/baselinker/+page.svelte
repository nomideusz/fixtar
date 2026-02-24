<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface Inventory {
		inventory_id: number;
		name: string;
		description: string;
	}

	interface SyncResult {
		success: boolean;
		productsAdded: number;
		productsUpdated: number;
		productsSkipped: number;
		errors: string[];
		timestamp: string;
	}

	let inventories = $state<Inventory[]>([]);
	let selectedInventory = $state<number | null>(null);
	let syncing = $state(false);
	let loading = $state(false);
	let syncResult = $state<SyncResult | null>(null);
	let error = $state<string | null>(null);

	async function loadInventories() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/baselinker/sync');
			const data = await res.json();
			if (data.error) {
				error = data.error;
			} else {
				inventories = data.inventories || [];
				if (inventories.length > 0 && !selectedInventory) {
					selectedInventory = inventories[0].inventory_id;
				}
			}
		} catch (err: any) {
			error = err.message || 'Nie udało się pobrać katalogów';
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
			const res = await fetch('/api/baselinker/sync', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ inventoryId: selectedInventory, dryRun })
			});
			const data = await res.json();
			if (data.error) {
				error = data.error;
			} else {
				syncResult = data;
			}
		} catch (err: any) {
			error = err.message || 'Synchronizacja nie powiodła się';
		} finally {
			syncing = false;
		}
	}
</script>

<svelte:head>
	<title>BaseLinker - Admin | FixTar</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h2 class="text-2xl font-bold text-neutral-900">Integracja BaseLinker</h2>
			<p class="text-neutral-600 mt-1">Synchronizuj produkty i zarządzaj zamówieniami przez BaseLinker</p>
		</div>
		<Button onclick={loadInventories} disabled={loading}>
			{loading ? 'Ładowanie...' : 'Pobierz katalogi'}
		</Button>
	</div>

	{#if error}
		<div class="bg-danger/5 border border-danger/10 rounded-lg p-4">
			<div class="flex items-center">
				<svg class="w-5 h-5 text-danger mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="text-danger-dark">{error}</p>
			</div>
			{#if error.includes('API token')}
				<p class="text-danger text-sm mt-2">
					Ustaw <code class="bg-danger/10 px-2 py-1 rounded">BASELINKER_API_TOKEN</code> w pliku <code class="bg-danger/10 px-2 py-1 rounded">.env</code>
				</p>
			{/if}
		</div>
	{/if}

	<!-- Connection Status -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
					</svg>
				</div>
				<div>
					<p class="text-sm text-neutral-600">Status połączenia</p>
					<p class="font-semibold {inventories.length > 0 ? 'text-success' : 'text-neutral-400'}">
						{inventories.length > 0 ? 'Połączono' : 'Nie połączono'}
					</p>
				</div>
			</div>
		</Card>

		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<div>
					<p class="text-sm text-neutral-600">Katalogi</p>
					<p class="font-semibold text-neutral-900">{inventories.length}</p>
				</div>
			</div>
		</Card>

		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</div>
				<div>
					<p class="text-sm text-neutral-600">Ostatnia synchronizacja</p>
					<p class="font-semibold text-neutral-900">
						{syncResult?.timestamp ? new Date(syncResult.timestamp).toLocaleString('pl-PL') : 'Brak'}
					</p>
				</div>
			</div>
		</Card>
	</div>

	<!-- Sync Controls -->
	{#if inventories.length > 0}
		<Card class="p-6">
			<h3 class="text-lg font-semibold text-neutral-900 mb-4">Synchronizacja produktów</h3>
			
			<div class="space-y-4">
				<div>
					<label for="inventory-select" class="block text-sm font-medium text-neutral-700 mb-1">
						Wybierz katalog BaseLinker
					</label>
					<select
						id="inventory-select"
						bind:value={selectedInventory}
						class="w-full rounded-lg border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
					>
						{#each inventories as inv (inv)}
							<option value={inv.inventory_id}>
								{inv.name} (ID: {inv.inventory_id})
							</option>
						{/each}
					</select>
				</div>

				<div class="flex gap-3">
					<Button onclick={() => startSync(true)} disabled={syncing || !selectedInventory} variant="outline">
						{syncing ? 'Sprawdzanie...' : 'Podgląd (Dry Run)'}
					</Button>
					<Button onclick={() => startSync(false)} disabled={syncing || !selectedInventory} variant="primary">
						{syncing ? 'Synchronizuję...' : 'Synchronizuj produkty'}
					</Button>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Sync Results -->
	{#if syncResult}
		<Card class="p-6">
			<h3 class="text-lg font-semibold text-neutral-900 mb-4">Wynik synchronizacji</h3>
			
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
				<div class="bg-success/10 rounded-lg p-3 text-center">
					<p class="text-2xl font-bold text-success">{syncResult.productsAdded}</p>
					<p class="text-sm text-success-dark">Dodanych</p>
				</div>
				<div class="bg-brand-50 rounded-lg p-3 text-center">
					<p class="text-2xl font-bold text-brand-600">{syncResult.productsUpdated}</p>
					<p class="text-sm text-brand-700">Zaktualizowanych</p>
				</div>
				<div class="bg-neutral-50 rounded-lg p-3 text-center">
					<p class="text-2xl font-bold text-neutral-600">{syncResult.productsSkipped}</p>
					<p class="text-sm text-neutral-700">Pominiętych</p>
				</div>
				<div class="bg-danger/5 rounded-lg p-3 text-center">
					<p class="text-2xl font-bold text-danger">{syncResult.errors.length}</p>
					<p class="text-sm text-danger-dark">Błędów</p>
				</div>
			</div>

			{#if syncResult.errors.length > 0}
				<div class="mt-4">
					<h4 class="text-sm font-medium text-danger-dark mb-2">Błędy:</h4>
					<ul class="bg-danger/5 rounded-lg p-3 space-y-1">
						{#each syncResult.errors as err (err)}
							<li class="text-sm text-danger-dark">• {err}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</Card>
	{/if}

	<!-- Help Section -->
	<Card class="p-6 bg-neutral-50">
		<h3 class="text-lg font-semibold text-neutral-900 mb-3">Konfiguracja BaseLinker</h3>
		<div class="prose prose-sm text-neutral-600">
			<ol class="space-y-2">
				<li>Zaloguj się do <a href="https://baselinker.com" target="_blank" rel="noopener" class="text-brand-600 hover:underline">BaseLinker</a></li>
				<li>Przejdź do <strong>Moje konto → API</strong></li>
				<li>Wygeneruj nowy token API</li>
				<li>Dodaj token do pliku <code class="bg-neutral-200 px-2 py-1 rounded">.env</code>:
					<pre class="bg-neutral-800 text-neutral-100 rounded-lg p-3 mt-2">BASELINKER_API_TOKEN=twoj_token_api</pre>
				</li>
				<li>Kliknij "Pobierz katalogi" aby zweryfikować połączenie</li>
			</ol>
		</div>
	</Card>
</div>


