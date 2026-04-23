<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { GearIcon, WrenchIcon, ScissorsIcon, HouseIcon, PackageIcon } from 'phosphor-svelte';

	const popularCategories = [
		{ id: 'szlifierki-i-polerki', name: 'Szlifierki i polerki', icon: GearIcon },
		{ id: 'wiertarki-i-wkretarki', name: 'Wiertarki i wkrętarki', icon: WrenchIcon },
		{ id: 'pily-i-pilarki', name: 'Piły i pilarki', icon: ScissorsIcon },
		{ id: 'dom-i-ogrod', name: 'Dom i ogród', icon: HouseIcon },
		{ id: 'zestawy-i-akcesoria', name: 'Zestawy i akcesoria', icon: PackageIcon }
	];

	let searchQuery = $state('');

	function handleSearch() {
		if (!browser) return;
		if (searchQuery) {
			window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
		}
	}
</script>

<svelte:head>
	<title>Nie znaleziono strony - FixTar</title>
	<meta name="description" content="Strona, której szukasz, nie istnieje" />
</svelte:head>

<div class="ft-container ft-section-lg min-h-[70vh]">
	<div class="mx-auto max-w-4xl">
		<div class="mb-12 text-center">
			<div
				class="mb-4 inline-block rounded-full border border-[--ft-line] bg-[--ft-surface] px-3 py-1 text-sm text-[--ft-accent]"
			>
				Błąd {$page.status || 404}
			</div>

			<h1 class="mb-4 text-4xl text-[--ft-text-strong] md:text-5xl lg:text-6xl">
				Nie znaleziono strony
			</h1>

			<p class="mx-auto mb-6 max-w-3xl text-xl text-[--ft-text-muted]">
				Strona, której szukasz, nie istnieje lub została przeniesiona.
			</p>

			<p class="mb-10 text-lg text-[--ft-text-muted]">
				Nie martw się, pomożemy Ci wrócić na właściwą ścieżkę.
			</p>

			<div class="mb-12 flex flex-wrap justify-center gap-4">
				<a href="/" class="btn-primary px-6 py-3 text-lg">Wróć na stronę główną</a>
				<a href="/contact" class="btn-secondary px-6 py-3 text-lg">Skontaktuj się z nami</a>
			</div>
		</div>

		<div class="ft-card mb-10 p-8">
			<div class="mb-6 border-b border-[--ft-line] pb-3">
				<h2 class="text-xl text-[--ft-text]">Oto kilka sugestii</h2>
			</div>

			<div class="mb-6">
				<h3 class="mb-3 font-mono text-sm text-[--ft-text-muted]">popularne kategorie</h3>

				<div class="flex flex-wrap gap-2">
					{#each popularCategories as category (category.id)}
						{@const Icon = category.icon}
						<a
							href="/products?category={category.id}"
							class="inline-flex items-center gap-1.5 rounded-full border border-[--ft-line] bg-[--ft-surface] px-3 py-1.5 text-sm text-[--ft-text] transition-colors hover:border-[--ft-line-strong] hover:text-[--ft-text]"
						>
							<Icon class="h-4 w-4" aria-hidden="true" />
							{category.name}
						</a>
					{/each}
				</div>
			</div>

			<div>
				<h3 class="mb-3 font-mono text-sm text-[--ft-text-muted]">przeszukaj nasz sklep</h3>

				<div class="flex gap-2">
					<input
						type="text"
						placeholder="pilarka, wiertarka, szlifierka..."
						bind:value={searchQuery}
						class="input flex-1"
						aria-label="Szukaj produktów"
						onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button type="button" class="btn-primary" onclick={handleSearch}>Szukaj</button>
				</div>
			</div>
		</div>
	</div>
</div>
