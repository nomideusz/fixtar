<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import ProductCardSkeleton from '$lib/components/ui/ProductCardSkeleton.svelte';
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
			minPrice?: number;
			maxPrice?: number;
			inStockOnly: boolean;
			error?: string;
		};
	}

	let { data }: Props = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('');
	let sortBy = $state('name');

	$effect(() => {
		searchQuery = data.searchQuery;
		selectedCategory = data.selectedCategory;
		sortBy = data.sortBy;
	});

	let chipScrollEl: HTMLElement | undefined = $state();

	// Scroll selected chip into view on mobile
	$effect(() => {
		if (!chipScrollEl || !selectedCategory) return;
		const timer = setTimeout(() => {
			const selected = chipScrollEl?.querySelector('.chip--selected') as HTMLElement | null;
			if (selected) {
				selected.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
			}
		}, 100);
		return () => clearTimeout(timer);
	});

	const selectedCategoryName = $derived(
		data.categories.find((cat) => cat.slug === selectedCategory)?.name || ''
	);

	const productCountLabel = $derived.by(() => {
		const count = data.totalItems;
		if (count === 1) return '1 produkt';
		if (count < 5) return `${count} produkty`;
		return `${count} produktów`;
	});

	// --- URL Navigation ---

	function buildFilterParams(overrides: { page?: number } = {}) {
		const params = new URLSearchParams();
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

	function handleCategoryChange(slug: string) {
		selectedCategory = slug;
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
</script>

<svelte:head>
	<title>Produkty{selectedCategoryName ? ` — ${selectedCategoryName}` : ''} — FixTar</title>
	<meta
		name="description"
		content="Elektronarzędzia i akcesoria{selectedCategoryName ? ` — ${selectedCategoryName}` : ''}. Szlifierki, wiertarki, piły, młotowiertarki."
	/>
</svelte:head>

<div class="products-page">
	<!-- Header -->
	<div class="page-header">
		<h1 class="page-title">{selectedCategoryName || 'Produkty'}</h1>
		<span class="page-count">{productCountLabel}</span>
	</div>

	<!-- Category pills -->
	<div class="chips-wrap">
		<div class="chip-scroll" bind:this={chipScrollEl}>
			{#each data.categories as cat (cat.id)}
				<button
					class="chip"
					class:chip--selected={selectedCategory === cat.slug}
					onclick={() => handleCategoryChange(cat.slug)}
				>
					{cat.name}
					<span class="chip-count">{cat.productCount}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Search + Sort -->
	<div class="toolbar">
		<form onsubmit={handleSearchSubmit} class="search-form" role="search">
			<label for="product-search" class="sr-only">Szukaj produktów</label>
			<div class="search-box">
				<svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					id="product-search"
					type="search"
					placeholder="Szukaj..."
					value={searchQuery}
					oninput={(e) => (searchQuery = (e.target as HTMLInputElement).value)}
					class="search-input"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="search-clear"
						aria-label="Wyczyść wyszukiwanie"
					>&times;</button>
				{/if}
			</div>
		</form>

		<div class="sort-wrap">
			<label for="product-sort" class="sr-only">Sortuj</label>
			<select
				id="product-sort"
				value={sortBy}
				onchange={handleSortChange}
				class="sort-select"
			>
				<option value="name">Nazwa A-Z</option>
				<option value="price-low">Cena rosnąco</option>
				<option value="price-high">Cena malejąco</option>
			</select>
		</div>
	</div>

	<!-- Products -->
	<div class="products-area">
		{#if $navigating}
			<div class="product-grid" role="status" aria-label="Ładowanie produktów">
				<ProductCardSkeleton count={6} />
			</div>
		{:else if data.error}
			<div class="empty-state">
				<p>{data.error}</p>
			</div>
		{:else if data.products.length > 0}
			<div class="product-grid">
				{#each data.products as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.totalPages > 1}
				<nav class="pagination" aria-label="Paginacja">
					{#if data.currentPage > 1}
						<button class="page-btn" aria-label="Poprzednia strona" onclick={() => navigateWithFilters({ page: data.currentPage - 1 })}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 19l-7-7 7-7"/></svg>
						</button>
					{/if}

					{#each Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
						const start = Math.max(1, Math.min(data.currentPage - 2, data.totalPages - 4));
						return start + i;
					}) as pageNum (pageNum)}
						{#if pageNum <= data.totalPages}
							<button
								class="page-btn"
								class:page-btn--active={pageNum === data.currentPage}
								onclick={() => navigateWithFilters({ page: pageNum })}
							>{pageNum}</button>
						{/if}
					{/each}

					{#if data.currentPage < data.totalPages}
						<button class="page-btn" aria-label="Następna strona" onclick={() => navigateWithFilters({ page: data.currentPage + 1 })}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
						</button>
					{/if}
				</nav>
			{/if}
		{:else}
			<div class="empty-state">
				<p>Nie znaleziono produktów{selectedCategoryName ? ` w kategorii "${selectedCategoryName}"` : ''}.</p>
				{#if searchQuery || selectedCategory}
					<button class="clear-btn" onclick={() => { searchQuery = ''; selectedCategory = ''; sortBy = 'name'; goto('/products'); }}>
						Wyczyść filtry
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.products-page {
		max-width: var(--ft-container, 1440px);
		margin: 0 auto;
		padding: 0 var(--ft-gutter, clamp(24px, 5vw, 80px));
		width: 100%;
	}

	/* ── Header ── */
	.page-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: clamp(24px, 4vh, 40px) 0 16px;
	}

	.page-title {
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 3vw, 1.8rem);
		font-weight: 700;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
	}

	.page-count {
		font-size: 0.78rem;
		color: var(--ft-text-muted);
	}

	/* ── Category pills ── */
	.chips-wrap {
		padding-bottom: 20px;
	}

	.chip-scroll {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		/* bleed into gutter for edge-to-edge scroll on mobile */
		margin: 0 calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding: 0 var(--ft-gutter, clamp(24px, 5vw, 80px));
	}

	.chip-scroll::-webkit-scrollbar {
		display: none;
	}

	.chip {
		flex-shrink: 0;
		scroll-snap-align: start;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 24px;
		font-size: 0.82rem;
		font-weight: 400;
		color: var(--ft-text-muted);
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
		min-height: 44px;
	}

	.chip:hover:not(.chip--selected) {
		background: var(--ft-frost);
		color: var(--ft-text-strong);
	}

	.chip--selected {
		background: var(--ft-text-strong);
		border-color: var(--ft-text-strong);
		color: white;
		font-weight: 500;
	}

	.chip-count {
		font-size: 0.68rem;
		opacity: 0.5;
	}

	.chip--selected .chip-count {
		opacity: 0.7;
	}

	/* ── Toolbar ── */
	.toolbar {
		display: flex;
		gap: 12px;
		align-items: center;
		padding-bottom: 24px;
	}

	.search-form {
		flex: 1;
		min-width: 0;
	}

	.search-box {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		color: var(--ft-text-faint);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 10px 36px 10px 40px;
		font-size: 0.88rem;
		color: var(--ft-text);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: 8px;
		outline: none;
		transition: border-color 0.15s ease;
	}

	.search-input::placeholder {
		color: var(--ft-text-faint);
	}

	.search-input:focus {
		border-color: var(--ft-accent);
	}

	.search-clear {
		position: absolute;
		right: 8px;
		background: none;
		border: none;
		color: var(--ft-text-faint);
		font-size: 1.2rem;
		cursor: pointer;
		padding: 4px 6px;
		line-height: 1;
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-clear:hover {
		color: var(--ft-text);
	}

	.sort-wrap {
		flex-shrink: 0;
	}

	.sort-select {
		padding: 10px 32px 10px 12px;
		font-size: 0.82rem;
		color: var(--ft-text);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: 8px;
		outline: none;
		cursor: pointer;
		min-height: 44px;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b7d8e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
	}

	.sort-select:focus {
		border-color: var(--ft-accent);
	}

	/* ── Product grid ── */
	.product-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 16px;
	}

	/* ── Pagination ── */
	.pagination {
		display: flex;
		justify-content: center;
		gap: 4px;
		padding: clamp(32px, 5vh, 48px) 0;
	}

	.page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: 8px 12px;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--ft-text-muted);
		background: none;
		border: 1px solid var(--ft-line);
		border-radius: 8px;
		cursor: pointer;
		transition: border-color 0.15s ease, color 0.15s ease;
	}

	.page-btn:hover {
		border-color: var(--ft-text-strong);
		color: var(--ft-text-strong);
	}

	.page-btn--active {
		background: var(--ft-text-strong);
		border-color: var(--ft-text-strong);
		color: white;
	}

	/* ── Empty state ── */
	.empty-state {
		text-align: center;
		padding: clamp(48px, 8vh, 80px) 0;
		color: var(--ft-text-muted);
		font-size: 0.9rem;
	}

	.clear-btn {
		margin-top: 16px;
		padding: 10px 24px;
		font-size: 0.82rem;
		color: var(--ft-text-muted);
		background: none;
		border: 1px solid var(--ft-line);
		border-radius: 8px;
		cursor: pointer;
		min-height: 44px;
		transition: border-color 0.15s ease, color 0.15s ease;
	}

	.clear-btn:hover {
		border-color: var(--ft-text-strong);
		color: var(--ft-text-strong);
	}

	/* ── Desktop: wrap pills ── */
	@media (min-width: 769px) {
		.chip-scroll {
			flex-wrap: wrap;
			overflow: visible;
			margin: 0;
			padding: 0;
		}
	}

	/* ── Mobile: pills don't wrap, horizontal scroll ── */
	@media (max-width: 768px) {
		.chip-scroll {
			flex-wrap: nowrap;
		}

		.toolbar {
			flex-direction: column;
			gap: 8px;
		}

		.sort-wrap {
			width: 100%;
		}

		.sort-select {
			width: 100%;
		}
	}

	/* ── Bottom padding ── */
	.products-page {
		padding-bottom: clamp(32px, 5vh, 48px);
	}
</style>
