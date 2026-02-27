<script lang="ts">
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { Product } from '$lib/stores/products.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import { navigating } from '$app/state';

	interface Props {
		data: {
			products: Product[];
			error?: string;
			searchQuery: string;
		};
	}

	let { data }: Props = $props();

	let searchQuery = $derived(data.searchQuery || '');

	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		if (searchQuery && searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	function clearSearch() {
		searchQuery = '';
		goto('/search');
	}
</script>

<svelte:head>
	<title>{searchQuery ? `Wyniki wyszukiwania dla "${searchQuery}"` : 'Szukaj'} - FixTar</title>
	<meta
		name="description"
		content={searchQuery
			? `Wyniki wyszukiwania dla "${searchQuery}" w FixTar`
			: 'Szukaj produktów w FixTar'}
	/>
</svelte:head>

<!-- Professional Search Hero -->
<Hero
	title="Wyszukiwarka"
	subtitle="Znajdź dokładnie to, czego szukasz w naszej szerokiej ofercie produktów"
	centered={true}
>
	<!-- Enhanced Search Form in Hero -->
	<div class="mx-auto mt-8 max-w-2xl">
		<form onsubmit={handleSearchSubmit} class="relative">
			<div class="group relative">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<svg
						class="group-focus-within:text-brand-600 h-5 w-5 text-neutral-400 transition-colors"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<Input
					type="text"
					placeholder="Wpisz nazwę produktu, kategorię lub słowo kluczowe..."
					value={searchQuery}
					oninput={(e) => (searchQuery = (e.target as HTMLInputElement).value)}
					class="focus:border-brand-500 rounded-2xl border-2 border-transparent py-4 pr-12 pl-12 text-lg shadow-lg transition-all"
					autofocus
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="group/clear absolute inset-y-0 right-4 flex items-center"
						aria-label="Wyczyść wyszukiwanie"
					>
						<svg
							class="h-5 w-5 text-neutral-400 transition-colors group-hover/clear:text-neutral-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				{/if}
			</div>

			<div class="mt-4 flex justify-center">
				<Button
					type="submit"
					disabled={!searchQuery || !searchQuery.trim() || !!navigating.to}
					class="px-8 py-3 text-base font-semibold shadow-md"
				>
					{#if navigating.to}
						<LoadingSpinner visible={true} />
						<span class="ml-2">Szukam...</span>
					{:else}
						Szukaj
					{/if}
				</Button>
			</div>
		</form>

		<!-- Popular Searches -->
		<div class="mt-8 text-center">
			<p class="mb-3 text-sm text-neutral-500">Popularne wyszukiwania:</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each ['Pilarki', 'Wiertarki', 'Szlifierki', 'Spawarki', 'Narzędzia ogrodowe'] as term (term)}
					<button
						onclick={() => {
							searchQuery = term;
							handleSearchSubmit(new Event('submit'));
						}}
						class="cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/20"
					>
						{term}
					</button>
				{/each}
			</div>
		</div>
	</div>
</Hero>

<!-- Main Content -->
<div>
	<div class="mx-auto max-w-screen-2xl px-6 py-16 sm:px-8 lg:px-12">
		{#if data.error}
			<div class="mx-auto max-w-2xl">
				<div class="bg-danger-50 border-danger-light rounded-xl border p-6 text-center">
					<svg
						class="text-danger mx-auto mb-4 h-12 w-12"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<h3 class="text-danger-dark mb-2 text-lg font-semibold">Wystąpił błąd</h3>
					<p class="text-danger">{data.error}</p>
				</div>
			</div>
		{:else if searchQuery && data.products.length === 0}
			<div class="mx-auto max-w-2xl">
				<div class="rounded-xl bg-white/5 p-12 text-center">
					<svg
						class="mx-auto mb-6 h-16 w-16 text-neutral-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 class="mb-3 text-xl font-semibold text-white">Brak wyników</h3>
					<p class="mb-6 text-neutral-400">
						Nie znaleźliśmy produktów pasujących do "{searchQuery}"
					</p>
					<div class="space-y-3">
						<p class="text-sm text-neutral-500">Spróbuj:</p>
						<ul class="inline-block space-y-2 text-left text-sm text-neutral-400">
							<li class="flex items-start">
								<svg
									class="text-brand-500 mt-0.5 mr-2 h-4 w-4 shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								Sprawdzić pisownię
							</li>
							<li class="flex items-start">
								<svg
									class="text-brand-500 mt-0.5 mr-2 h-4 w-4 shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								Użyć bardziej ogólnych terminów
							</li>
							<li class="flex items-start">
								<svg
									class="text-brand-500 mt-0.5 mr-2 h-4 w-4 shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								Użyć mniejszej liczby słów kluczowych
							</li>
						</ul>
					</div>
					<Button href="/products" class="mt-8">Przeglądaj wszystkie produkty</Button>
				</div>
			</div>
		{:else if searchQuery && data.products.length > 0}
			<div>
				<!-- Results Header -->
				<div class="mb-8">
					<h2 class="text-2xl font-bold text-white">
						Znaleziono {data.products.length}
						{data.products.length === 1
							? 'produkt'
							: data.products.length < 5
								? 'produkty'
								: 'produktów'} dla "{searchQuery}"
					</h2>
				</div>

				<!-- Products Grid -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each data.products as product (product)}
						<ProductCard {product} />
					{/each}
				</div>
			</div>
		{:else}
			<!-- Empty State - No search yet -->
			<div class="mx-auto max-w-2xl">
				<div class="from-white/5 to-white/5 rounded-2xl bg-linear-to-br p-12 text-center">
					<div class="relative">
						<div class="absolute inset-0 flex items-center justify-center">
							<div
								class="bg-brand-200 h-32 w-32 animate-pulse rounded-full opacity-30 blur-3xl filter"
							></div>
						</div>
						<svg
							class="text-brand-600 relative mx-auto mb-6 h-20 w-20"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<h3 class="mb-3 text-2xl font-bold text-white">Rozpocznij wyszukiwanie</h3>
					<p class="mx-auto mb-8 max-w-md text-neutral-400">
						Wpisz nazwę produktu, kategorię lub słowo kluczowe w polu wyszukiwania powyżej
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<Button href="/products" variant="outline">Przeglądaj katalog</Button>
						<Button href="/categories">Zobacz kategorie</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
