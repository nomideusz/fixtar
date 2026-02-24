<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { Product, Category } from '$lib/stores/products.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import { navigating } from '$app/stores';

	interface Props {
		data: {
			query: string;
			category: string;
			minPrice: number;
			maxPrice: number;
			sortBy: string;
			categories: Category[];
			products: Product[];
			totalResults: number;
			error?: string;
			searchQuery: string;
		};
	}

	let { data }: Props = $props();

	// Local state for filters - ensure proper fallbacks for undefined values
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let minPrice = $state(0);
	let maxPrice = $state(10000);
	let sortBy = $state('name');

	// Sync local state when data prop changes (e.g. on navigation)
	$effect(() => {
		searchQuery = data.searchQuery || '';
		selectedCategory = data.category || '';
		minPrice = data.minPrice || 0;
		maxPrice = data.maxPrice || 10000;
		sortBy = data.sortBy || 'name';
	});

	// Update URL and reload data
	function updateSearch() {
		const params = new URLSearchParams();
		
		if (searchQuery && searchQuery.trim()) params.set('q', searchQuery.trim());
		if (selectedCategory) params.set('category', selectedCategory);
		if (minPrice > 0) params.set('minPrice', minPrice.toString());
		if (maxPrice < 10000) params.set('maxPrice', maxPrice.toString());
		if (sortBy !== 'name') params.set('sort', sortBy);

		const url = `/search${params.toString() ? '?' + params.toString() : ''}`;
		goto(url);
	}

	// Clear all filters
	function clearFilters() {
		searchQuery = '';
		selectedCategory = '';
		minPrice = 0;
		maxPrice = 10000;
		sortBy = 'name';
		updateSearch();
	}

	// Handle search form submission
	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		if (searchQuery && searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	// Handle price range changes
	function handlePriceChange() {
		// Debounce price changes
		setTimeout(() => {
			updateSearch();
		}, 500);
	}

	function clearSearch() {
		searchQuery = '';
		goto('/search');
	}
</script>

<svelte:head>
	<title>{searchQuery ? `Wyniki wyszukiwania dla "${searchQuery}"` : 'Szukaj'} - FixTar</title>
	<meta name="description" content={searchQuery ? `Wyniki wyszukiwania dla "${searchQuery}" w FixTar` : 'Szukaj produktów w FixTar'} />
</svelte:head>

<!-- Professional Search Hero -->
<Hero
	title="Wyszukiwarka"
	subtitle="Znajdź dokładnie to, czego szukasz w naszej szerokiej ofercie produktów"
	centered={true}
	className="bg-linear-to-br from-neutral-50 via-white to-brand-50"
>
	<!-- Enhanced Search Form in Hero -->
	<div class="mt-8 max-w-2xl mx-auto">
		<form onsubmit={handleSearchSubmit} class="relative">
			<div class="relative group">
				<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
					<svg class="h-5 w-5 text-neutral-400 group-focus-within:text-brand-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<Input
					type="text"
					placeholder="Wpisz nazwę produktu, kategorię lub słowo kluczowe..."
					value={searchQuery}
					oninput={(e) => searchQuery = (e.target as HTMLInputElement).value}
					class="pl-12 pr-12 py-4 text-lg rounded-2xl shadow-lg border-2 border-transparent focus:border-brand-500 transition-all"
					autofocus
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="absolute inset-y-0 right-4 flex items-center group/clear"
						aria-label="Wyczyść wyszukiwanie"
					>
						<svg class="h-5 w-5 text-neutral-400 group-hover/clear:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
			
			<div class="mt-4 flex justify-center">
				<Button 
					type="submit" 
					disabled={!searchQuery || !searchQuery.trim() || !!$navigating}
					class="px-8 py-3 text-base font-semibold shadow-md"
				>
					{#if $navigating}
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
			<p class="text-sm text-neutral-500 mb-3">Popularne wyszukiwania:</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each ['Laptopy', 'Procesory', 'Karty graficzne', 'Monitory', 'Klawiatury'] as term (term)}
					<button
						onclick={() => { searchQuery = term; handleSearchSubmit(new Event('submit')); }}
						class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium transition-colors cursor-pointer"
					>
						{term}
					</button>
				{/each}
			</div>
		</div>
	</div>
</Hero>

<!-- Main Content -->
<div class="bg-white">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
		{#if data.error}
			<div class="max-w-2xl mx-auto">
				<div class="bg-danger-50 border border-danger-light rounded-xl p-6 text-center">
					<svg class="w-12 h-12 text-danger mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<h3 class="text-lg font-semibold text-danger-dark mb-2">Wystąpił błąd</h3>
					<p class="text-danger">{data.error}</p>
				</div>
			</div>
		{:else if searchQuery && data.products.length === 0}
			<div class="max-w-2xl mx-auto">
				<div class="bg-neutral-50 rounded-xl p-12 text-center">
					<svg class="w-16 h-16 text-neutral-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3 class="text-xl font-semibold text-neutral-900 mb-3">Brak wyników</h3>
					<p class="text-neutral-600 mb-6">Nie znaleźliśmy produktów pasujących do "{searchQuery}"</p>
					<div class="space-y-3">
						<p class="text-sm text-neutral-500">Spróbuj:</p>
						<ul class="text-left inline-block space-y-2 text-sm text-neutral-600">
							<li class="flex items-start">
								<svg class="w-4 h-4 text-brand-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								Sprawdzić pisownię
							</li>
							<li class="flex items-start">
								<svg class="w-4 h-4 text-brand-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								Użyć bardziej ogólnych terminów
							</li>
							<li class="flex items-start">
								<svg class="w-4 h-4 text-brand-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								Użyć mniejszej liczby słów kluczowych
							</li>
						</ul>
					</div>
					<Button href="/products" class="mt-8">
						Przeglądaj wszystkie produkty
					</Button>
				</div>
			</div>
		{:else if searchQuery && data.products.length > 0}
			<div>
				<!-- Results Header -->
				<div class="mb-8">
					<h2 class="text-2xl font-bold text-neutral-900">
						Znaleziono {data.products.length} {data.products.length === 1 ? 'produkt' : data.products.length < 5 ? 'produkty' : 'produktów'} dla "{searchQuery}"
					</h2>
				</div>
				
				<!-- Products Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each data.products as product (product)}
						<ProductCard {product} />
					{/each}
				</div>
			</div>
		{:else}
			<!-- Empty State - No search yet -->
			<div class="max-w-2xl mx-auto">
				<div class="bg-linear-to-br from-brand-50 to-accent-50 rounded-2xl p-12 text-center">
					<div class="relative">
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="w-32 h-32 bg-brand-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
						</div>
						<svg class="w-20 h-20 text-brand-600 mx-auto mb-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-neutral-900 mb-3">Rozpocznij wyszukiwanie</h3>
					<p class="text-neutral-600 mb-8 max-w-md mx-auto">
						Wpisz nazwę produktu, kategorię lub słowo kluczowe w polu wyszukiwania powyżej
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Button href="/products" variant="outline">
							Przeglądaj katalog
						</Button>
						<Button href="/categories">
							Zobacz kategorie
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>




