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
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-[--ft-text-strong]">Integracja BaseLinker</h2>
			<p class="mt-1 text-[--ft-text-muted]">
				Synchronizuj produkty i zarządzaj zamówieniami przez BaseLinker
			</p>
		</div>
		<Button onclick={loadInventories} disabled={loading}>
			{loading ? 'Ładowanie...' : 'Pobierz katalogi'}
		</Button>
	</div>

	{#if error}
		<div class="bg-danger/5 border-danger/10 rounded-lg border p-4">
			<div class="flex items-center">
				<svg class="text-danger mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-danger-dark">{error}</p>
			</div>
			{#if error.includes('API token')}
				<p class="text-danger mt-2 text-sm">
					Ustaw <code class="bg-danger/10 rounded px-2 py-1">BASELINKER_API_TOKEN</code> w pliku
					<code class="bg-danger/10 rounded px-2 py-1">.env</code>
				</p>
			{/if}
		</div>
	{/if}

	<!-- Connection Status -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="bg-[--ft-frost] flex h-10 w-10 items-center justify-center rounded-lg">
					<svg class="text-[--ft-accent] h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm text-[--ft-text-muted]">Status połączenia</p>
					<p class="font-semibold {inventories.length > 0 ? 'text-success' : 'text-[--ft-text-muted]'}">
						{inventories.length > 0 ? 'Połączono' : 'Nie połączono'}
					</p>
				</div>
			</div>
		</Card>

		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="bg-[--ft-frost] flex h-10 w-10 items-center justify-center rounded-lg">
					<svg
						class="text-[--ft-accent] h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm text-[--ft-text-muted]">Katalogi</p>
					<p class="font-semibold text-[--ft-text-strong]">{inventories.length}</p>
				</div>
			</div>
		</Card>

		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
					<svg class="text-success h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm text-[--ft-text-muted]">Ostatnia synchronizacja</p>
					<p class="font-semibold text-[--ft-text-strong]">
						{syncResult?.timestamp
							? new Date(syncResult.timestamp).toLocaleString('pl-PL')
							: 'Brak'}
					</p>
				</div>
			</div>
		</Card>
	</div>

	<!-- Sync Controls -->
	{#if inventories.length > 0}
		<Card class="p-6">
			<h3 class="mb-4 text-lg font-semibold text-[--ft-text-strong]">Synchronizacja produktów</h3>

			<div class="space-y-4">
				<div>
					<label for="inventory-select" class="mb-1 block text-sm font-medium text-[--ft-text]">
						Wybierz katalog BaseLinker
					</label>
					<select
						id="inventory-select"
						bind:value={selectedInventory}
						class="focus:border-[--ft-accent] focus:ring-[--ft-accent] w-full rounded-lg border-[--ft-line] shadow-sm"
					>
						{#each inventories as inv (inv)}
							<option value={inv.inventory_id}>
								{inv.name} (ID: {inv.inventory_id})
							</option>
						{/each}
					</select>
				</div>

				<div class="flex gap-3">
					<Button
						onclick={() => startSync(true)}
						disabled={syncing || !selectedInventory}
						variant="outline"
					>
						{syncing ? 'Sprawdzanie...' : 'Podgląd (Dry Run)'}
					</Button>
					<Button
						onclick={() => startSync(false)}
						disabled={syncing || !selectedInventory}
						variant="primary"
					>
						{syncing ? 'Synchronizuję...' : 'Synchronizuj produkty'}
					</Button>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Sync Results -->
	{#if syncResult}
		<Card class="p-6">
			<h3 class="mb-4 text-lg font-semibold text-[--ft-text-strong]">Wynik synchronizacji</h3>

			<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
				<div class="bg-success/10 rounded-lg p-3 text-center">
					<p class="text-success text-2xl font-bold">{syncResult.productsAdded}</p>
					<p class="text-success-dark text-sm">Dodanych</p>
				</div>
				<div class="bg-[--ft-frost] rounded-lg p-3 text-center">
					<p class="text-[--ft-accent] text-2xl font-bold">{syncResult.productsUpdated}</p>
					<p class="text-[--ft-accent-hover] text-sm">Zaktualizowanych</p>
				</div>
				<div class="rounded-lg bg-[--ft-frost] p-3 text-center">
					<p class="text-2xl font-bold text-[--ft-text-muted]">{syncResult.productsSkipped}</p>
					<p class="text-sm text-[--ft-text]">Pominiętych</p>
				</div>
				<div class="bg-danger/5 rounded-lg p-3 text-center">
					<p class="text-danger text-2xl font-bold">{syncResult.errors.length}</p>
					<p class="text-danger-dark text-sm">Błędów</p>
				</div>
			</div>

			{#if syncResult.errors.length > 0}
				<div class="mt-4">
					<h4 class="text-danger-dark mb-2 text-sm font-medium">Błędy:</h4>
					<ul class="bg-danger/5 space-y-1 rounded-lg p-3">
						{#each syncResult.errors as err (err)}
							<li class="text-danger-dark text-sm">• {err}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</Card>
	{/if}

	<!-- Help Section -->
	<Card class="bg-[--ft-frost] p-6">
		<h3 class="mb-3 text-lg font-semibold text-[--ft-text-strong]">Konfiguracja BaseLinker</h3>
		<div class="prose prose-sm text-[--ft-text-muted]">
			<ol class="space-y-2">
				<li>
					Zaloguj się do <a
						href="https://baselinker.com"
						target="_blank"
						rel="noopener"
						class="text-[--ft-accent] hover:underline">BaseLinker</a
					>
				</li>
				<li>Przejdź do <strong>Moje konto → API</strong></li>
				<li>Wygeneruj nowy token API</li>
				<li>
					Dodaj token do pliku <code class="rounded bg-[--ft-frost] px-2 py-1">.env</code>:
					<pre
						class="mt-2 rounded-lg bg-neutral-800 p-3 text-neutral-100">BASELINKER_API_TOKEN=twoj_token_api</pre>
				</li>
				<li>Kliknij "Pobierz katalogi" aby zweryfikować połączenie</li>
			</ol>
		</div>
	</Card>
</div>
