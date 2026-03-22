<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { SvelteSet, SvelteURLSearchParams } from 'svelte/reactivity';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import CategoryFilter from '$lib/components/products/CategoryFilter.svelte';
	import MobileFilterPanel from '$lib/components/products/MobileFilterPanel.svelte';
	import ProductListItem from '$lib/components/products/ProductListItem.svelte';
	import ActiveFilters from '$lib/components/products/ActiveFilters.svelte';
	import type { Product, Category } from '$lib/stores/products.svelte';

	interface CategoryWithCount extends Category {
		productCount: number;
	}

	interface Props {
		data: {
			products: Product[];
			categories: CategoryWithCount[];
			subcategories: CategoryWithCount[];
			allSubcategories: CategoryWithCount[];
			totalPages: number;
			totalItems: number;
			currentPage: number;
			searchQuery: string;
			selectedCategory: string;
			sortBy: string;
			error?: string;
		};
	}

	let { data }: Props = $props();

	// Local state for form inputs
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let sortBy = $state('name');

	// Sync state with server data
	$effect(() => {
		searchQuery = data.searchQuery;
		selectedCategory = data.selectedCategory;
		sortBy = data.sortBy;
	});

	// UI State
	let viewMode = $state<'grid' | 'list'>('grid');
	let showMobileFilters = $state(false);
	let expandedCategories = new SvelteSet<string>();
	let priceRange = $state({ min: '0', max: '1000' });
	let showInStock = $state(false);

	// Derived values
	const selectedCategoryName = $derived(
		data.categories.find((cat) => cat.slug === selectedCategory)?.name ||
			data.subcategories.find((cat) => cat.slug === selectedCategory)?.name ||
			''
	);

	const categoriesWithSubs = $derived(
		data.categories.map((category) => ({
			...category,
			subcategories: data.allSubcategories.filter((sub) => sub.parent === category.id)
		}))
	);

	const hasActiveFilters = $derived(!!searchQuery || !!selectedCategory || showInStock);

	const breadcrumbItems = $derived.by(() => {
		const items = [{ label: 'Strona główna', href: '/' }];
		if (selectedCategoryName) {
			items.push({ label: 'Produkty', href: '/products' });
			items.push({ label: selectedCategoryName, href: `/products?category=${selectedCategory}` });
		} else {
			items.push({ label: 'Produkty', href: '/products' });
		}
		return items;
	});

	const productCountLabel = $derived.by(() => {
		const count = data.totalItems;
		if (count === 1) return '1 produkt';
		if (count < 5) return `${count} produkty`;
		return `${count} produktów`;
	});

	// Auto-expand category tree for the selected category
	$effect(() => {
		if (!selectedCategory) return;

		const mainCategory = data.categories.find((cat) => cat.slug === selectedCategory);
		if (mainCategory) {
			expandedCategories.add(mainCategory.slug);
			return;
		}

		const subcategory = data.allSubcategories.find((cat) => cat.slug === selectedCategory);
		if (subcategory) {
			const parent = data.categories.find((cat) => cat.id === subcategory.parent);
			if (parent) expandedCategories.add(parent.slug);
		}
	});

	// --- URL Navigation ---

	function buildFilterParams(overrides: { page?: number } = {}) {
		const params = new SvelteURLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (selectedCategory) params.set('category', selectedCategory);
		if (sortBy !== 'name') params.set('sort', sortBy);
		if (overrides.page && overrides.page > 1) params.set('page', overrides.page.toString());
		const qs = params.toString();
		return `/products${qs ? '?' + qs : ''}`;
	}

	function navigateWithFilters(overrides: { page?: number } = {}) {
		goto(buildFilterParams(overrides));
	}

	// --- Event Handlers ---

	function handleCategoryChange(categorySlug: string) {
		selectedCategory = categorySlug;

		// Auto-expand main categories when selected
		if (data.categories.some((cat) => cat.slug === categorySlug)) {
			expandedCategories.add(categorySlug);
		}

		navigateWithFilters();
	}

	function handleSortChange(e: Event) {
		sortBy = (e.target as HTMLSelectElement).value;
		navigateWithFilters();
	}

	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		navigateWithFilters();
	}

	function clearSearch() {
		searchQuery = '';
		navigateWithFilters();
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = '';
		sortBy = 'name';
		showInStock = false;
		priceRange = { min: '0', max: '1000' };
		expandedCategories.clear();
		goto('/products');
	}

	function toggleCategory(slug: string) {
		if (expandedCategories.has(slug)) {
			expandedCategories.delete(slug);
		} else {
			expandedCategories.add(slug);
		}
	}
</script>

<svelte:head>
	<title>Produkty{selectedCategoryName ? ` - ${selectedCategoryName}` : ''} - FixTar</title>
	<meta
		name="description"
		content="Odkryj naszą kompletną ofertę narzędzi i akcesoriów{selectedCategoryName
			? ` w kategorii ${selectedCategoryName}`
			: ''}"
	/>
</svelte:head>

<!-- Page Header — compact: breadcrumbs, title, search, count -->
<section class="border-b border-[--ft-line] bg-[--ft-surface]">
	<div class="ft-container py-6 lg:py-8">
		<!-- Breadcrumbs -->
		<div class="mb-4">
			<Breadcrumbs items={breadcrumbItems} />
		</div>

		<!-- Title row -->
		<div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
			<h1 class="text-2xl font-bold tracking-tight text-[--ft-text-strong] lg:text-3xl" style="font-family:var(--font-display);letter-spacing:-0.03em">
				{selectedCategoryName || 'Narzędzia i Akcesoria'}
			</h1>
			<span class="text-sm font-medium text-[--ft-text-muted]">{productCountLabel}</span>
		</div>

		<!-- Search + mobile filter button -->
		<div class="flex gap-3">
			<form onsubmit={handleSearchSubmit} class="group relative min-w-0 flex-1" role="search">
				<label for="product-search" class="sr-only">Szukaj produktów</label>
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
					<svg
						class="h-4.5 w-4.5 text-[--ft-text-faint] transition-colors group-focus-within:text-[--ft-accent]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
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
					id="product-search"
					type="search"
					placeholder="Szukaj produktów, kategorii, marek..."
					value={searchQuery}
					oninput={(e: Event) => (searchQuery = (e.target as HTMLInputElement).value)}
					class="rounded-lg border border-[--ft-line] py-2.5 pr-10 pl-10 text-sm shadow-sm focus:border-[--ft-accent] focus:ring-1 focus:ring-[--ft-accent]"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="group/clear absolute inset-y-0 right-0 flex items-center pr-3"
						aria-label="Wyczyść wyszukiwanie"
					>
						<svg
							class="h-4 w-4 text-[--ft-text-faint] transition-colors group-hover/clear:text-[--ft-text]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
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
			</form>
			<Button variant="outline" onclick={() => (showMobileFilters = true)} class="shrink-0 lg:hidden">
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
					/>
				</svg>
				Filtry
			</Button>
		</div>
	</div>
</section>

<!-- Main Content -->
<div class="min-h-screen">
	<div class="ft-container ft-section-sm">
		<div class="lg:grid lg:grid-cols-4 lg:gap-8">
			<!-- Desktop Sidebar -->
			<div class="hidden lg:col-span-1 lg:block">
				<Card glass={true} class="sticky top-20 p-6">
					<div class="mb-6 flex items-center justify-between">
						<h3 class="text-lg font-bold text-[--ft-text]">Filtry</h3>
						{#if hasActiveFilters}
							<Button variant="ghost" size="sm" onclick={clearFilters}>Wyczyść wszystkie</Button>
						{/if}
					</div>

					<!-- Categories -->
					<div class="mb-6 border-b border-[--ft-line] pb-6">
						<h4 class="mb-4 text-sm font-semibold text-[--ft-text]">Kategorie</h4>
						<CategoryFilter
							categories={categoriesWithSubs}
							{selectedCategory}
							{expandedCategories}
							totalItems={data.totalItems}
							onCategoryChange={handleCategoryChange}
							onToggleCategory={toggleCategory}
						/>
					</div>

					<!-- Price Range -->
					<div class="mb-6 border-b border-[--ft-line] pb-6">
						<h4 class="mb-4 text-sm font-semibold text-[--ft-text]">Zakres cen</h4>
						<div class="flex items-center space-x-3">
							<Input type="number" placeholder="Min" bind:value={priceRange.min} class="text-sm" />
							<span class="font-medium text-[--ft-text-faint]">-</span>
							<Input type="number" placeholder="Max" bind:value={priceRange.max} class="text-sm" />
						</div>
						<div class="mt-3 text-xs text-[--ft-text-secondary]">Ceny w PLN</div>
					</div>

					<!-- Availability -->
					<div class="pb-6">
						<h4 class="mb-4 text-sm font-semibold text-[--ft-text]">Dostępność</h4>
						<label class="group flex cursor-pointer items-center">
							<input
								type="checkbox"
								bind:checked={showInStock}
								class="text-brand-600 focus:ring-brand-500 rounded border-[--ft-line] focus:ring-2"
							/>
							<span
								class="ml-3 text-sm text-[--ft-text-muted] transition-colors group-hover:text-[--ft-text]"
								>Tylko dostępne</span
							>
						</label>
					</div>
				</Card>
			</div>

			<!-- Mobile Filter Panel -->
			{#if showMobileFilters}
				<MobileFilterPanel
					categories={categoriesWithSubs}
					{selectedCategory}
					{expandedCategories}
					totalItems={data.totalItems}
					bind:priceRange
					bind:showInStock
					onCategoryChange={handleCategoryChange}
					onToggleCategory={toggleCategory}
					onClearFilters={clearFilters}
					onClose={() => (showMobileFilters = false)}
				/>
			{/if}

			<!-- Main Product Area -->
			<div class="lg:col-span-3">
				<!-- Toolbar -->
				<div class="mb-6 flex flex-col gap-4 border-b border-[--ft-line] pb-5 sm:flex-row sm:items-center sm:justify-between">
					<!-- View Mode Toggle -->
					<div class="flex items-center gap-3">
						<div class="flex items-center rounded-lg bg-[--ft-frost] p-0.5" role="group" aria-label="Tryb wyświetlania">
							<button
								onclick={() => (viewMode = 'grid')}
								class="view-mode-button {viewMode === 'grid' ? 'active' : ''}"
								aria-label="Widok siatki"
								aria-pressed={viewMode === 'grid'}
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
								</svg>
							</button>
							<button
								onclick={() => (viewMode = 'list')}
								class="view-mode-button {viewMode === 'list' ? 'active' : ''}"
								aria-label="Widok listy"
								aria-pressed={viewMode === 'list'}
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
								</svg>
							</button>
						</div>
					</div>

					<!-- Sort Dropdown -->
					<div class="flex items-center gap-2">
						<label for="product-sort" class="text-sm text-[--ft-text-muted]">Sortuj:</label>
						<select
							id="product-sort"
							value={sortBy}
							onchange={handleSortChange}
							class="rounded-lg border border-[--ft-line] bg-[--ft-surface] px-3 py-2 text-sm text-[--ft-text] transition-colors focus:border-[--ft-accent] focus:ring-1 focus:ring-[--ft-accent] focus:outline-none"
						>
							<option value="name">Nazwa A-Z</option>
							<option value="price-low">Cena: rosnąco</option>
							<option value="price-high">Cena: malejąco</option>
						</select>
					</div>
				</div>

				<!-- Active Filters -->
				<ActiveFilters
					{searchQuery}
					{selectedCategoryName}
					{showInStock}
					onClearSearch={clearSearch}
					onClearCategory={() => handleCategoryChange('')}
					onClearInStock={() => (showInStock = false)}
					onClearAll={clearFilters}
				/>

				<!-- Products with Loading Overlay -->
				<div class="relative">
					{#if $navigating}
						<div
							class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm"
							role="status"
							aria-live="polite"
						>
							<div class="flex flex-col items-center gap-3">
								<LoadingSpinner visible={true} />
								<p class="text-sm font-medium text-[--ft-text-muted]">Ładowanie produktów...</p>
							</div>
						</div>
					{/if}

					{#if data.error}
						<Card class="p-12 text-center">
							<div class="mx-auto max-w-md">
								<svg
									class="text-danger mx-auto mb-4 h-16 w-16"
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
								<h3 class="mb-2 text-lg font-semibold text-[--ft-text]">Wystąpił błąd</h3>
								<p class="mb-4 text-[--ft-text-faint]">{data.error}</p>
								<Button href="/products" variant="outline">Spróbuj ponownie</Button>
							</div>
						</Card>
					{:else if data.products.length > 0}
						<!-- Grid View -->
						{#if viewMode === 'grid'}
							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{#each data.products as product (product)}
									<ProductCard {product} />
								{/each}
							</div>
						{:else}
							<!-- List View -->
							<div class="space-y-4">
								{#each data.products as product (product)}
									<ProductListItem {product} />
								{/each}
							</div>
						{/if}

						<!-- Pagination -->
						{#if data.totalPages > 1}
							<div class="mt-12 flex justify-center">
								<nav class="flex items-center gap-2" aria-label="Paginacja produktów">
									<Button
										onclick={() => navigateWithFilters({ page: data.currentPage - 1 })}
										disabled={data.currentPage <= 1 || !!$navigating}
										variant="outline"
										size="sm"
									>
										<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 19l-7-7 7-7"
											/>
										</svg>
										Poprzednia
									</Button>

									{#each Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
										const start = Math.max(1, data.currentPage - 2);
										return start + i;
									}) as pageNum (pageNum)}
										{#if pageNum <= data.totalPages}
											<Button
												onclick={() => navigateWithFilters({ page: pageNum })}
												variant={pageNum === data.currentPage ? 'primary' : 'outline'}
												size="sm"
												disabled={!!$navigating}
												class="min-w-10"
											>
												{pageNum}
											</Button>
										{/if}
									{/each}

									<Button
										onclick={() => navigateWithFilters({ page: data.currentPage + 1 })}
										disabled={data.currentPage >= data.totalPages || !!$navigating}
										variant="outline"
										size="sm"
									>
										Następna
										<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</Button>
								</nav>
							</div>
						{/if}
					{:else}
						<!-- Empty State -->
						<Card class="p-16 text-center">
							<div class="mx-auto max-w-lg">
								<div class="relative">
									<div class="absolute inset-0 flex items-center justify-center">
										<div
											class="h-32 w-32 rounded-full bg-[--ft-frost] opacity-20 blur-3xl filter"
										></div>
									</div>
									<svg
										class="relative mx-auto mb-6 h-20 w-20 text-[--ft-text-faint]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"
										/>
									</svg>
								</div>
								<h3 class="mb-3 text-2xl font-bold text-[--ft-text]">Brak produktów</h3>
								<p class="mb-6 text-[--ft-text-faint]">
									{searchQuery || selectedCategoryName
										? 'Nie znaleźliśmy produktów odpowiadających Twoim kryteriom wyszukiwania'
										: 'W tej chwili nie ma dostępnych produktów'}
								</p>
								{#if searchQuery || selectedCategory}
									<div class="flex flex-col justify-center gap-3 sm:flex-row">
										<Button onclick={clearFilters} variant="outline">Wyczyść filtry</Button>
										<Button href="/products">Zobacz wszystkie produkty</Button>
									</div>
								{:else}
									<Button href="/">Wróć do strony głównej</Button>
								{/if}
							</div>
						</Card>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.view-mode-button {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 38px;
		min-height: 38px;
		padding: 0.5rem;
		border-radius: var(--radius-sm);
		transition: all 0.15s ease;
		cursor: pointer;
	}

	.view-mode-button:not(.active) {
		color: var(--ft-text-muted);
	}

	.view-mode-button:not(.active):hover {
		color: var(--ft-accent);
		background-color: rgba(55, 138, 146, 0.06);
	}

	.view-mode-button.active {
		background-color: var(--ft-surface);
		color: var(--ft-accent);
		box-shadow: var(--ft-shadow-sm);
	}
</style>
