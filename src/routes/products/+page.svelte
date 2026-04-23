<script lang="ts">
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import ProductCardSkeleton from '$lib/components/ui/ProductCardSkeleton.svelte';
	import { ArrowDownIcon, ArrowUpIcon, MagnifyingGlassIcon, XIcon } from 'phosphor-svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Category {
		slug: string;
		name: string;
		count: number;
	}

	interface Props {
		data: {
			products: Product[];
			categories: Category[];
			searchQuery: string;
			sortBy: string;
			category: string;
			totalItems: number;
			error?: string;
		};
	}

	let { data }: Props = $props();

	let searchInput = $state('');
	let loading = $state(false);

	$effect(() => {
		searchInput = data.searchQuery;
	});

	function buildUrl(next: { search?: string; sort?: string; category?: string }) {
		const params = new window.URLSearchParams();
		const search = next.search ?? data.searchQuery;
		const sort = next.sort ?? data.sortBy;
		const category = next.category ?? data.category;
		if (search) params.set('search', search);
		if (sort && sort !== 'name') params.set('sort', sort);
		if (category) params.set('category', category);
		const qs = params.toString();
		return `/products${qs ? '?' + qs : ''}`;
	}

	function navigate(next: Parameters<typeof buildUrl>[0]) {
		loading = true;
		goto(buildUrl(next), { keepFocus: true }).finally(() => {
			loading = false;
		});
	}

	function setCategory(slug: string) {
		navigate({ category: slug === data.category ? '' : slug });
	}

	function setSort(value: string) {
		navigate({ sort: value });
	}

	function submitSearch(e: Event) {
		e.preventDefault();
		navigate({ search: searchInput.trim() });
	}

	function clearSearch() {
		searchInput = '';
		navigate({ search: '' });
	}

	function clearFilters() {
		searchInput = '';
		navigate({ search: '', category: '', sort: 'name' });
	}

	function productCountLabel(n: number) {
		if (n === 1) return 'produkt';
		if (n > 1 && n < 5) return 'produkty';
		return 'produktów';
	}

	const sortOptions: Array<{ value: string; label: string; icon?: 'up' | 'down' }> = [
		{ value: 'name', label: 'A-Z' },
		{ value: 'price-low', label: 'Cena', icon: 'up' },
		{ value: 'price-high', label: 'Cena', icon: 'down' }
	];

	let hasFilters = $derived(!!(data.searchQuery || data.category));
</script>

<svelte:head>
	<title>Produkty — FixTar</title>
	<meta
		name="description"
		content="Elektronarzędzia i akcesoria. Szlifierki, wiertarki, piły, młotowiertarki."
	/>
</svelte:head>

<div class="products-page">
	<!-- Header -->
	<header class="page-header">
		<div class="page-heading">
			<span class="ft-label">katalog</span>
			<h1 class="page-title">Produkty</h1>
			<p class="page-count">
				{data.totalItems}
				{productCountLabel(data.totalItems)}
			</p>
		</div>
	</header>

	<!-- Filter strip: search + sort -->
	<div class="filters">
		<form class="search" onsubmit={submitSearch} role="search">
			<MagnifyingGlassIcon class="search-icon" size={16} weight="regular" aria-hidden="true" />
			<input
				type="search"
				bind:value={searchInput}
				placeholder="Szukaj produktów…"
				class="search-input"
				aria-label="Szukaj produktów"
			/>
			{#if searchInput}
				<button
					type="button"
					class="search-clear"
					onclick={clearSearch}
					aria-label="Wyczyść wyszukiwanie"
				>
					<XIcon size={14} weight="bold" aria-hidden="true" />
				</button>
			{/if}
		</form>

		<div class="sort-bar" role="group" aria-label="Sortowanie">
			{#each sortOptions as opt (opt.value)}
				<button
					class="sort-btn"
					class:sort-btn--active={data.sortBy === opt.value}
					onclick={() => setSort(opt.value)}
					aria-pressed={data.sortBy === opt.value}
				>
					{opt.label}
					{#if opt.icon === 'up'}
						<ArrowUpIcon size={14} weight="bold" aria-hidden="true" />
					{:else if opt.icon === 'down'}
						<ArrowDownIcon size={14} weight="bold" aria-hidden="true" />
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Category chips -->
	{#if data.categories.length > 0}
		<nav class="chips" aria-label="Filtruj po kategorii">
			<button class="chip" class:chip--active={!data.category} onclick={() => setCategory('')}>
				Wszystkie
				<span class="chip-count">{data.totalItems}</span>
			</button>
			{#each data.categories as c (c.slug)}
				<button
					class="chip"
					class:chip--active={data.category === c.slug}
					onclick={() => setCategory(c.slug)}
				>
					{c.name}
					<span class="chip-count">{c.count}</span>
				</button>
			{/each}
		</nav>
	{/if}

	<!-- Results -->
	{#if data.error}
		<div class="empty">
			<p>{data.error}</p>
		</div>
	{:else if loading}
		<div class="grid">
			<ProductCardSkeleton count={8} />
		</div>
	{:else if data.products.length === 0}
		<div class="empty">
			{#if hasFilters}
				<p>Brak wyników dla wybranych filtrów.</p>
				<button type="button" class="btn-clear" onclick={clearFilters}> Wyczyść filtry </button>
			{:else}
				<p>Nie znaleziono produktów.</p>
			{/if}
		</div>
	{:else}
		<div class="ft-stagger grid">
			{#each data.products as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.products-page {
		max-width: var(--ft-container, 1440px);
		margin: 0 auto;
		padding: 0 var(--ft-gutter, clamp(24px, 5vw, 80px));
		padding-bottom: clamp(32px, 5vh, 48px);
		width: 100%;
	}

	/* ── Header ── */
	.page-header {
		padding: clamp(24px, 4vh, 40px) 0 20px;
		margin-bottom: 16px;
		border-bottom: 1px solid var(--ft-line);
	}

	.page-heading {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.page-title {
		font-family: var(--font-sans);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.page-count {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--ft-text-muted);
		letter-spacing: 0.02em;
		margin-top: 2px;
	}

	/* ── Filter strip ── */
	.filters {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}

	.search {
		position: relative;
		flex: 1;
		min-width: 240px;
		max-width: 520px;
	}

	.search :global(.search-icon) {
		position: absolute;
		top: 50%;
		left: 14px;
		transform: translateY(-50%);
		color: var(--ft-text-faint);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 10px 40px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		min-height: 44px;
		transition: border-color var(--dur-fast) ease;
	}

	.search-input::placeholder {
		color: var(--ft-text-faint);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--ft-accent);
	}

	.search-clear {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--ft-text-muted);
		cursor: pointer;
		transition: background-color var(--dur-fast) ease;
	}

	.search-clear:hover {
		background: var(--ft-frost);
		color: var(--ft-text);
	}

	/* ── Sort buttons ── */
	.sort-bar {
		display: flex;
		gap: 0;
		flex-shrink: 0;
	}

	.sort-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 6px 12px;
		background: transparent;
		border: 1px solid var(--ft-line);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--ft-text-muted);
		text-transform: lowercase;
		letter-spacing: 0.02em;
		cursor: pointer;
		min-height: 44px;
		transition:
			color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.sort-btn:first-child {
		border-radius: var(--radius-sm) 0 0 var(--radius-sm);
	}

	.sort-btn:last-child {
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}

	.sort-btn:not(:first-child) {
		margin-left: -1px;
	}

	.sort-btn:hover:not(.sort-btn--active) {
		color: var(--ft-text-strong);
		background: var(--ft-frost);
	}

	.sort-btn--active {
		background: color-mix(in srgb, var(--ft-accent) 8%, white);
		border-color: var(--ft-accent);
		color: var(--ft-accent-text);
		z-index: 1;
	}

	/* ── Category chips ── */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: clamp(20px, 3vh, 32px);
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		font-family: var(--font-sans);
		font-size: 0.875rem;
		font-weight: 400;
		color: var(--ft-text);
		cursor: pointer;
		min-height: 36px;
		transition:
			color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.chip:hover:not(.chip--active) {
		border-color: var(--ft-text-strong);
	}

	.chip--active {
		background: var(--ft-text-strong);
		border-color: var(--ft-text-strong);
		color: var(--ft-bg);
	}

	.chip-count {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--ft-text-faint);
		letter-spacing: 0.02em;
	}

	.chip--active .chip-count {
		color: rgba(255, 255, 255, 0.7);
	}

	/* ── Product grid ── */
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 16px;
		}
	}

	@media (min-width: 1024px) {
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 1440px) {
		.grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}

	/* ── Empty state ── */
	.empty {
		text-align: center;
		padding: clamp(48px, 8vh, 96px) 0;
		color: var(--ft-text-muted);
	}

	.empty p {
		font-size: 0.9375rem;
		margin-bottom: 16px;
	}

	.btn-clear {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		padding: 10px 20px;
		min-height: 44px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--ft-line);
		background: transparent;
		color: var(--ft-text);
		cursor: pointer;
		transition: border-color var(--dur-fast) ease;
	}

	.btn-clear:hover {
		border-color: var(--ft-accent);
		color: var(--ft-accent-text);
	}
</style>
