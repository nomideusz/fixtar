<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { GearIcon, WrenchIcon, ScissorsIcon, HouseIcon, PackageIcon } from 'phosphor-svelte';

	let showDecorations = $state(false);

	onMount(() => {
		setTimeout(() => {
			showDecorations = true;
		}, 100);
	});

	// Popular categories with SVG icons
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
	<!-- Decorative elements -->
	{#if browser && showDecorations}
		<div
			class="bg-[--ft-accent]/10 absolute top-1/3 right-0 -z-10 h-72 w-72 rounded-full opacity-70 blur-3xl filter transition-opacity duration-1000 ease-out"
		></div>
		<div
			class="bg-accent-600/10 absolute top-2/3 left-1/4 -z-10 h-64 w-64 rounded-full opacity-70 blur-3xl filter transition-opacity delay-300 duration-1000 ease-out"
		></div>
		<div
			class="bg-accent-600/10 absolute right-1/4 bottom-1/3 -z-10 h-80 w-80 rounded-full opacity-70 blur-3xl filter transition-opacity delay-700 duration-1000 ease-out"
		></div>
	{/if}

	<div class="mb-12 text-center">
		<div
			class="bg-[--ft-frost] text-[--ft-accent] mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium"
		>
			Błąd {$page.status || 404}
		</div>

		<h1
			class="mb-4 text-4xl font-bold text-[--ft-text-strong] md:text-5xl lg:text-6xl"
		>
			Nie znaleziono strony
		</h1>

		<p class="mx-auto mb-8 max-w-3xl text-xl text-[--ft-text-muted]">
			Strona, której szukasz, nie istnieje lub została przeniesiona.
		</p>

		<p class="mb-10 text-lg text-[--ft-text-muted] italic">Nie martw się, pomożemy Ci wrócić na właściwą ścieżkę!</p>

		<div class="mb-12 flex flex-wrap justify-center gap-4">
			<a href="/" class="btn-primary px-6 py-3 text-lg">Wróć na stronę główną</a>
			<a href="/contact" class="btn-secondary px-6 py-3 text-lg">Skontaktuj się z nami</a>
		</div>
	</div>

	<!-- Help section -->
	<div class="mx-auto max-w-3xl">
		<div class="ft-card p-8 mb-10">
			<div class="mb-4 flex items-center gap-3">
				<h2 class="text-xl font-bold text-[--ft-text]">Oto kilka sugestii:</h2>
			</div>

			<!-- Popular categories -->
			<div class="mb-6">
				<h3 class="mb-3 text-lg font-medium text-[--ft-text-muted]">Popularne kategorie</h3>

				<div class="flex flex-wrap gap-2">
					{#each popularCategories as category (category.id)}
						{@const Icon = category.icon}
						<a
							href="/products?category={category.id}"
							class="inline-flex items-center gap-1.5 rounded-full border border-[--ft-line] bg-[--ft-frost] px-3 py-1.5 text-sm font-medium text-[--ft-text] transition-colors hover:border-[--ft-cta] hover:text-[--ft-cta]"
						>
							<Icon class="h-4 w-4" aria-hidden="true" />
							{category.name}
						</a>
					{/each}
				</div>
			</div>

			<!-- Search -->
			<div>
				<h3 class="mb-3 text-lg font-medium text-[--ft-text-muted]">Przeszukaj nasz sklep</h3>

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
