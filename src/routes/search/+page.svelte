<script lang="ts">
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { Product } from '$lib/stores/products.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { navigating } from '$app/state';
	import { MagnifyingGlassIcon, XIcon, WarningCircleIcon, CheckCircleIcon } from 'phosphor-svelte';

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

<PageHeader title="Wyszukiwarka" description="Znajdź dokładnie to, czego szukasz w naszej szerokiej ofercie produktów" />

<section>
	<div class="ft-container" style="padding-bottom: clamp(32px, 4vh, 48px);">
		<div class="mx-auto max-w-3xl text-center">
			<div class="mx-auto max-w-2xl">
				<form onsubmit={handleSearchSubmit} class="relative">
					<div class="group relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
							<MagnifyingGlassIcon class="group-focus-within:text-[--ft-accent] h-5 w-5 text-[--ft-text-muted] transition-colors" aria-hidden="true" />
						</div>
						<Input
							type="text"
							placeholder="Wpisz nazwę produktu, kategorię lub słowo kluczowe..."
							value={searchQuery}
							oninput={(e) => (searchQuery = (e.target as HTMLInputElement).value)}
							class="focus:border-[--ft-accent] rounded-2xl border-2 border-transparent py-4 pr-12 pl-12 text-lg shadow-lg transition-colors"
							autofocus
						/>
						{#if searchQuery}
							<button
								type="button"
								onclick={clearSearch}
								class="group/clear absolute inset-y-0 right-4 flex items-center"
								aria-label="Wyczyść wyszukiwanie"
							>
								<XIcon class="h-5 w-5 text-[--ft-text-muted] transition-colors group-hover/clear:text-[--ft-text-muted]" aria-hidden="true" />
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
					<p class="mb-3 text-sm text-[--ft-text-muted]">Popularne wyszukiwania:</p>
					<div class="flex flex-wrap justify-center gap-2">
						{#each ['Pilarki', 'Wiertarki', 'Szlifierki', 'Spawarki', 'Narzędzia ogrodowe'] as term (term)}
							<button
								onclick={() => {
									searchQuery = term;
									handleSearchSubmit(new Event('submit'));
								}}
								class="cursor-pointer rounded-full bg-[--ft-frost] px-4 py-2 text-sm font-medium text-[--ft-text] transition-colors hover:bg-[--ft-line]"
							>
								{term}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Main Content -->
<div>
	<div class="ft-container ft-section-lg">
		{#if data.error}
			<div class="mx-auto max-w-2xl">
				<div class="bg-danger/10 border-danger/30 rounded-xl border p-6 text-center">
					<WarningCircleIcon class="text-danger mx-auto mb-4 h-12 w-12" aria-hidden="true" />
					<h3 class="text-danger mb-2 text-lg font-semibold">Wystąpił błąd</h3>
					<p class="text-danger">{data.error}</p>
				</div>
			</div>
		{:else if searchQuery && data.products.length === 0}
			<div class="mx-auto max-w-2xl">
				<div class="rounded-xl bg-[--ft-frost] p-6 text-center sm:p-12">
					<MagnifyingGlassIcon class="mx-auto mb-6 h-16 w-16 text-[--ft-text-muted]" aria-hidden="true" />
					<h3 class="mb-3 text-xl font-semibold text-[--ft-text]">Brak wyników</h3>
					<p class="mb-6 text-[--ft-text-muted]">
						Nie znaleźliśmy produktów pasujących do "{searchQuery}"
					</p>
					<div class="space-y-3">
						<p class="text-sm text-[--ft-text-muted]">Spróbuj:</p>
						<ul class="inline-block space-y-2 text-left text-sm text-[--ft-text-muted]">
							<li class="flex items-start">
								<CheckCircleIcon class="text-[--ft-accent] mt-0.5 mr-2 h-4 w-4 shrink-0" weight="fill" aria-hidden="true" />
								Sprawdzić pisownię
							</li>
							<li class="flex items-start">
								<CheckCircleIcon class="text-[--ft-accent] mt-0.5 mr-2 h-4 w-4 shrink-0" weight="fill" aria-hidden="true" />
								Użyć bardziej ogólnych terminów
							</li>
							<li class="flex items-start">
								<CheckCircleIcon class="text-[--ft-accent] mt-0.5 mr-2 h-4 w-4 shrink-0" weight="fill" aria-hidden="true" />
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
					<h2 class="text-2xl font-bold text-[--ft-text]">
						Znaleziono {data.products.length}
						{data.products.length === 1
							? 'produkt'
							: data.products.length < 5
								? 'produkty'
								: 'produktów'} dla "{searchQuery}"
					</h2>
				</div>

				<!-- Products Grid -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ft-stagger">
					{#each data.products as product (product)}
						<ProductCard {product} />
					{/each}
				</div>
			</div>
		{:else}
			<!-- Empty State - No search yet -->
			<div class="mx-auto max-w-2xl">
				<div class="rounded-2xl bg-[--ft-frost] p-6 text-center sm:p-12">
					<div class="relative">
						<div class="absolute inset-0 flex items-center justify-center">
							<div
								class="bg-[--ft-accent] h-32 w-32 animate-pulse rounded-full opacity-30 blur-3xl filter"
							></div>
						</div>
						<MagnifyingGlassIcon class="text-[--ft-accent] relative mx-auto mb-6 h-20 w-20" aria-hidden="true" />
					</div>
					<h3 class="mb-3 text-2xl font-bold text-[--ft-text]">Rozpocznij wyszukiwanie</h3>
					<p class="mx-auto mb-8 max-w-md text-[--ft-text-muted]">
						Wpisz nazwę produktu, kategorię lub słowo kluczowe w polu wyszukiwania powyżej
					</p>
					<div class="flex justify-center">
						<Button href="/products">Przeglądaj katalog</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
