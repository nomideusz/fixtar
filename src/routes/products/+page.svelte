<script lang="ts">
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import type { Product, Category } from '$lib/stores/products.svelte';

	interface CategoryWithCount extends Category {
		productCount: number;
	}

	interface Props {
		data: {
			categorySections: Array<{
				category: CategoryWithCount;
				products: Product[];
			}>;
			chipSections: Array<{
				category: CategoryWithCount;
				products: Product[];
			}>;
			categories: CategoryWithCount[];
			searchQuery: string;
			sortBy: string;
			inStockOnly: boolean;
			categoryIsolate: string;
			categoryScrollTo?: string;
			isolateMode?: boolean;
			brandSlug?: string;
			brandsFacet?: Array<{ slug: string; label: string; count: number }>;
			priceTier?: string;
			totalItems: number;
			error?: string;
		};
	}

	let { data }: Props = $props();

	let sortBy = $state('name');
	let activeCategory = $state('');
	let chipScrollEl: HTMLElement | undefined = $state();
	let chipsStuck = $state(false);
	let sentinelEl: HTMLElement | undefined = $state();
	let isScrolling = false;
	let scrollTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		sortBy = data.sortBy;
	});

	// ?category= bez isolate= — przewiń do sekcji (linki z kategorii / wyszukiwarki)
	$effect(() => {
		const slug = data.categoryScrollTo;
		if (!slug) return;
		const t = setTimeout(() => scrollToCategory(slug), 100);
		return () => clearTimeout(t);
	});

	// Track which category section is in view
	$effect(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const sections = document.querySelectorAll<HTMLElement>('[data-cat-section]');
		if (!sections.length) return;

		if (!activeCategory && sections.length > 0) {
			activeCategory = sections[0].getAttribute('data-cat-section') || '';
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (isScrolling) return;
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const slug = entry.target.getAttribute('data-cat-section') || '';
						if (slug !== activeCategory) {
							activeCategory = slug;
							scrollChipIntoView(slug);
						}
					}
				}
			},
			{ rootMargin: '-30% 0px -65% 0px', threshold: 0 }
		);

		sections.forEach((s) => observer.observe(s));
		return () => observer.disconnect();
	});

	// Sticky chips: detect when bar is stuck to top
	$effect(() => {
		if (!sentinelEl || typeof IntersectionObserver === 'undefined') return;
		const obs = new IntersectionObserver(
			([entry]) => {
				chipsStuck = !entry.isIntersecting;
			},
			{ threshold: 0, rootMargin: '0px' }
		);
		obs.observe(sentinelEl);
		return () => obs.disconnect();
	});

	function scrollChipIntoView(slug: string) {
		if (!chipScrollEl) return;
		const chip = chipScrollEl.querySelector(`[data-chip="${slug}"]`) as HTMLElement | null;
		if (!chip) return;
		const containerRect = chipScrollEl.getBoundingClientRect();
		const chipRect = chip.getBoundingClientRect();
		const offset =
			chipRect.left - containerRect.left - containerRect.width / 2 + chipRect.width / 2;
		chipScrollEl.scrollBy({ left: offset, behavior: 'smooth' });
	}

	function scrollToCategory(slug: string) {
		const section = document.querySelector(`[data-cat-section="${slug}"]`);
		if (!section) return;

		activeCategory = slug;
		isScrolling = true;
		scrollChipIntoView(slug);

		const navRaw =
			getComputedStyle(document.documentElement).getPropertyValue('--ft-navbar-h') ||
			getComputedStyle(document.documentElement).getPropertyValue('--ft-nav-h');
		const navH = parseInt(navRaw, 10) || 60;
		const chipsBar = document.querySelector('.chips-bar') as HTMLElement | null;
		const chipsHeight = chipsBar?.offsetHeight || 60;
		const offset = navH + chipsHeight + 16;

		const top = section.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior: 'smooth' });

		if (scrollTimer) clearTimeout(scrollTimer);
		scrollTimer = setTimeout(() => {
			isScrolling = false;
		}, 800);
	}

	function buildUrl(overrides: Record<string, string | null> = {}) {
		const merged: Record<string, string | null | undefined> = {
			search: data.searchQuery || '',
			sort: sortBy !== 'name' ? sortBy : '',
			stock: data.inStockOnly ? '1' : '',
			category: data.isolateMode && data.categoryIsolate ? data.categoryIsolate : '',
			isolate: data.isolateMode ? '1' : '',
			brand: data.brandSlug || '',
			price: data.priceTier || '',
			...overrides
		};

		const params = new URLSearchParams();
		for (const [k, v] of Object.entries(merged)) {
			if (v === null || v === undefined || v === '') continue;
			params.set(k, v);
		}
		const qs = params.toString();
		return `/products${qs ? `?${qs}` : ''}`;
	}

	const sortOptions = [
		{ value: 'name', label: 'Nazwa A-Z' },
		{ value: 'price-low', label: 'Od najtańszych' },
		{ value: 'price-high', label: 'Od najdroższych' }
	];

	const PRICE_PRESETS = [
		{ id: '', label: 'Wszystkie ceny' },
		{ id: 'low', label: 'do 300 zł' },
		{ id: 'mid', label: '300–800 zł' },
		{ id: 'high', label: 'powyżej 800 zł' }
	] as const;

	function setPriceTier(id: string) {
		goto(buildUrl({ price: id || null }));
	}

	function onHorizontalKeydown(e: KeyboardEvent, el: HTMLElement | undefined) {
		if (!el) return;
		if (e.key === 'ArrowRight') {
			el.scrollBy({ left: 120, behavior: 'smooth' });
			e.preventDefault();
		} else if (e.key === 'ArrowLeft') {
			el.scrollBy({ left: -120, behavior: 'smooth' });
			e.preventDefault();
		}
	}

	function setBrand(slug: string) {
		if (!slug) {
			goto(buildUrl({ brand: null }));
			return;
		}
		if (slug === data.brandSlug) goto(buildUrl({ brand: null }));
		else goto(buildUrl({ brand: slug }));
	}

	function setSort(value: string) {
		sortBy = value;
		goto(buildUrl({ sort: value === 'name' ? null : value }));
	}

	function toggleStock() {
		goto(buildUrl({ stock: data.inStockOnly ? null : '1' }));
	}

	function onChipClick(slug: string) {
		if (activeCategory === slug && !data.isolateMode) {
			goto(buildUrl({ category: slug, isolate: '1' }));
			return;
		}
		if (data.isolateMode && data.categoryIsolate === slug) {
			goto(buildUrl({ category: null, isolate: null }));
			return;
		}
		scrollToCategory(slug);
	}

	const showBreadcrumbs = $derived(
		Boolean(
			data.searchQuery ||
				data.isolateMode ||
				data.brandSlug ||
				data.priceTier
		)
	);

	const breadcrumbItems = $derived.by(() => {
		const items: Array<{ label: string; href: string }> = [
			{ label: 'Produkty', href: '/products' }
		];
		if (data.brandSlug && data.brandsFacet?.length) {
			const b = data.brandsFacet.find((x) => x.slug === data.brandSlug);
			if (b) {
				items.push({
					label: b.label,
					href: buildUrl({ brand: null })
				});
			}
		}
		if (data.priceTier) {
			const preset = PRICE_PRESETS.find((p) => p.id === data.priceTier);
			if (preset?.id) {
				items.push({
					label: preset.label,
					href: buildUrl({ price: null })
				});
			}
		}
		if (data.isolateMode && data.categoryIsolate) {
			const cat = data.categories.find((c) => c.slug === data.categoryIsolate);
			if (cat) {
				items.push({
					label: cat.name,
					href: `/products?category=${encodeURIComponent(cat.slug)}`
				});
			}
		}
		if (data.searchQuery) {
			items.push({
				label: `„${data.searchQuery}”`,
				href: buildUrl({ search: null })
			});
		}
		return items;
	});

	const hasActiveFilters = $derived(
		Boolean(
			data.inStockOnly ||
				data.searchQuery ||
				data.brandSlug ||
				data.priceTier ||
				data.isolateMode
		)
	);
</script>

<svelte:head>
	<title>Produkty — FixTar</title>
	<meta
		name="description"
		content="Elektronarzędzia i akcesoria. Szlifierki, wiertarki, piły, młotowiertarki."
	/>
</svelte:head>

<div class="products-page">
	{#if showBreadcrumbs}
		<div class="crumbs-wrap">
			<Breadcrumbs items={breadcrumbItems} />
		</div>
	{/if}

	<!-- Header -->
	<div class="page-header">
		<div class="page-header-title">
			<span class="ft-label">Katalog</span>
			<h1 class="page-title">
				Produkty
				{#if !data.error && data.totalItems > 0}
					<span class="page-count">({data.totalItems})</span>
				{/if}
			</h1>
		</div>
		<div class="header-controls">
			{#if !data.error}
				<label class="stock-toggle">
					<input type="checkbox" checked={data.inStockOnly} onchange={toggleStock} />
					<span class="stock-toggle-label">Tylko dostępne</span>
				</label>
			{/if}
			<div class="sort-bar" role="group" aria-label="Sortowanie">
				{#each sortOptions as opt (opt.value)}
					<button
						class="sort-btn"
						class:sort-btn--active={sortBy === opt.value}
						onclick={() => setSort(opt.value)}
						aria-pressed={sortBy === opt.value}
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Sentinel for sticky-detect -->
	<div bind:this={sentinelEl} aria-hidden="true" class="chips-sentinel"></div>

	<!-- Category chips — sticky nav -->
	{#if data.chipSections.length > 1}
		<nav class="chips-bar" class:chips-bar--stuck={chipsStuck} aria-label="Kategorie">
			{#if data.isolateMode}
				<button
					class="isolate-clear"
					onclick={() => goto(buildUrl({ category: null, isolate: null }))}
					aria-label="Pokaż wszystkie kategorie"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<line x1="19" y1="12" x2="5" y2="12" />
						<polyline points="12 19 5 12 12 5" />
					</svg>
					Wszystkie kategorie
				</button>
			{/if}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				class="chip-scroll"
				bind:this={chipScrollEl}
				role="region"
				aria-label="Skróty kategorii — przewijanie w poziomie"
				tabindex="0"
				onkeydown={(e) => onHorizontalKeydown(e, chipScrollEl)}
			>
				{#each data.chipSections as section (section.category.id)}
					<button
						class="chip"
						class:chip--active={data.isolateMode
							? data.categoryIsolate === section.category.slug
							: activeCategory === section.category.slug}
						aria-current={data.isolateMode && data.categoryIsolate === section.category.slug
							? 'page'
							: !data.isolateMode && activeCategory === section.category.slug
								? 'location'
								: undefined}
						data-chip={section.category.slug}
						onclick={() => onChipClick(section.category.slug)}
					>
						{section.category.name}
						<span class="chip-count">{section.category.productCount}</span>
					</button>
				{/each}
			</div>
		</nav>
	{/if}

	{#if !data.error}
		<div class="facet-strip">
			<div
				class="facet-row facet-row--price"
				role="group"
				aria-label="Przedział cenowy"
			>
				{#each PRICE_PRESETS as preset (preset.id || 'all')}
					<button
						type="button"
						class="facet-chip"
						class:facet-chip--active={data.priceTier === preset.id}
						aria-pressed={data.priceTier === preset.id}
						onclick={() => setPriceTier(preset.id)}
					>
						{preset.label}
					</button>
				{/each}
			</div>
			{#if data.brandsFacet && data.brandsFacet.length > 0}
				<div
					class="facet-row facet-row--brands"
					role="region"
					aria-label="Marki w katalogu"
				>
					<button
						type="button"
						class="facet-chip"
						class:facet-chip--active={!data.brandSlug}
						aria-pressed={!data.brandSlug}
						onclick={() => setBrand('')}
					>
						Wszystkie marki
					</button>
					{#each data.brandsFacet as b (b.slug)}
						<button
							type="button"
							class="facet-chip"
							class:facet-chip--active={data.brandSlug === b.slug}
							aria-pressed={data.brandSlug === b.slug}
							onclick={() => setBrand(b.slug)}
						>
							{b.label}
							<span class="facet-chip-count">{b.count}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Category sections -->
	{#if data.error}
		<div class="error-state" role="alert">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			<p>{data.error}</p>
		</div>
	{:else if data.categorySections.length > 0}
		{#each data.categorySections as section (section.category.id)}
			<section
				class="cat-section"
				data-cat-section={section.category.slug}
				aria-labelledby="cat-{section.category.slug}"
			>
				<div class="cat-header">
					<h2 class="cat-title" id="cat-{section.category.slug}">
						{section.category.name}
						<span class="cat-count">({section.category.productCount})</span>
					</h2>
					<p class="scroll-hint" aria-hidden="true">
						<span>Więcej</span>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M5 12h14M13 6l6 6-6 6"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</p>
				</div>

				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					class="cat-grid ft-stagger"
					role="region"
					aria-label="Produkty w kategorii {section.category.name}"
					tabindex="0"
				>
					{#each section.products as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>
			</section>
		{/each}
	{:else}
		<div class="empty-state">
			<p>Nie znaleziono produktów.</p>
			{#if hasActiveFilters}
				<a href="/products" class="empty-reset">Wyczyść filtry</a>
			{/if}
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

	.crumbs-wrap {
		padding-top: clamp(16px, 2vh, 24px);
	}

	/* ── Header ── */
	.page-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 24px;
		padding: clamp(20px, 4vh, 36px) 0 16px;
		flex-wrap: wrap;
		border-bottom: 1px solid var(--ft-line);
		margin-bottom: 4px;
	}

	.header-controls {
		display: flex;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
	}

	.page-header-title {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.page-title {
		font-family: var(--font-sans);
		font-size: clamp(1.6rem, 3.2vw, 2.1rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		text-transform: none;
		line-height: 1;
		display: inline-flex;
		align-items: baseline;
		gap: 10px;
	}

	.page-count {
		font-size: 0.55em;
		font-weight: 500;
		color: var(--ft-text-faint);
		letter-spacing: 0;
	}

	/* ── Sort buttons ── */
	.sort-bar {
		display: flex;
		gap: 2px;
		flex-shrink: 0;
	}

	.sort-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 8px 14px;
		background: transparent;
		border: 1px solid var(--ft-line);
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		text-transform: none;
		letter-spacing: 0;
		cursor: pointer;
		min-height: 44px;
		transition:
			color 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.sort-btn:first-child {
		border-radius: var(--radius-full) 0 0 var(--radius-full);
	}

	.sort-btn:last-child {
		border-radius: 0 var(--radius-full) var(--radius-full) 0;
	}

	.sort-btn:not(:first-child) {
		margin-left: -1px;
	}

	.sort-btn:hover:not(.sort-btn--active) {
		color: var(--ft-text-strong);
		background: var(--ft-frost);
	}

	.sort-btn--active {
		background: var(--ft-accent);
		border-color: var(--ft-accent);
		color: white;
		z-index: 1;
	}

	/* ── Facet bar: in-stock toggle (inline with header) ── */

	.stock-toggle {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		min-height: 44px;
		padding: 0 4px;
		user-select: none;
	}

	.stock-toggle input {
		width: 16px;
		height: 16px;
		accent-color: var(--ft-accent);
		cursor: pointer;
	}

	.stock-toggle-label {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--ft-text);
	}

	/* ── Sticky chip bar ── */
	.chips-sentinel {
		height: 1px;
		margin-top: -1px;
	}

	.chips-bar {
		position: sticky;
		top: var(--ft-navbar-h, var(--ft-nav-h, 60px));
		z-index: 10;
		background: var(--ft-bg);
		padding: 12px 0;
		margin-left: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		margin-right: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding-left: var(--ft-gutter, clamp(24px, 5vw, 80px));
		margin-bottom: 8px;
		border-bottom: 1px solid var(--ft-line);
		transition:
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.chips-bar--stuck {
		background: color-mix(in srgb, var(--ft-bg) 92%, transparent);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}

	.chip-scroll {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
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
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-full);
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		cursor: pointer;
		white-space: nowrap;
		text-transform: none;
		letter-spacing: 0;
		transition:
			color 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
		min-height: 44px;
	}

	.chip:hover:not(.chip--active) {
		background: var(--ft-frost);
		color: var(--ft-text-strong);
	}

	.chip--active {
		background: var(--ft-accent);
		border-color: var(--ft-accent);
		color: white;
	}

	.chip-count {
		font-weight: 500;
		font-size: 0.78em;
		opacity: 0.75;
		font-variant-numeric: tabular-nums;
	}

	.isolate-clear {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 10px;
		background: transparent;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-full);
		padding: 8px 16px;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-accent);
		cursor: pointer;
		min-height: 44px;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.isolate-clear:hover {
		background: var(--ft-frost);
		border-color: var(--ft-accent);
	}

	@media (min-width: 769px) {
		.chip-scroll {
			flex-wrap: wrap;
			overflow: visible;
			margin: 0;
			padding: 0;
		}
	}

	/* ── Category sections ── */
	.cat-section {
		padding-bottom: clamp(32px, 4vh, 48px);
		scroll-margin-top: calc(var(--ft-navbar-h, var(--ft-nav-h, 60px)) + 96px);
	}

	.cat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 20px;
	}

	.scroll-hint {
		display: none;
		align-items: center;
		gap: 4px;
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--ft-text-faint);
		flex-shrink: 0;
	}

	.scroll-hint svg {
		flex-shrink: 0;
		opacity: 0.85;
	}

	@media (max-width: 639px) {
		.scroll-hint {
			display: inline-flex;
		}
	}

	/* ── Price + brand facets ── */
	.facet-strip {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: clamp(16px, 2.5vh, 28px);
	}

	.facet-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	.facet-row--brands {
		flex-wrap: nowrap;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		margin-left: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		margin-right: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding-left: var(--ft-gutter, clamp(24px, 5vw, 80px));
		padding-right: var(--ft-gutter, clamp(24px, 5vw, 80px));
		padding-bottom: 4px;
		-webkit-mask-image: linear-gradient(to right, black 0, black 92%, transparent 100%);
		mask-image: linear-gradient(to right, black 0, black 92%, transparent 100%);
	}

	.facet-row--brands::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 900px) {
		.facet-row--brands {
			flex-wrap: wrap;
			overflow: visible;
			margin-left: 0;
			margin-right: 0;
			padding-left: 0;
			padding-right: 0;
			-webkit-mask-image: none;
			mask-image: none;
		}
	}

	.facet-chip {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: 44px;
		padding: 8px 14px;
		background: transparent;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-full);
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		cursor: pointer;
		transition:
			color 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.facet-chip:hover:not(.facet-chip--active) {
		background: var(--ft-frost);
		color: var(--ft-text-strong);
	}

	.facet-chip--active {
		background: var(--ft-accent);
		border-color: var(--ft-accent);
		color: white;
	}

	.facet-chip-count {
		font-weight: 500;
		font-size: 0.85em;
		opacity: 0.85;
		font-variant-numeric: tabular-nums;
	}

	.cat-title {
		font-family: var(--font-sans);
		font-size: clamp(1.05rem, 2vw, 1.3rem);
		font-weight: 600;
		color: var(--ft-dark);
		letter-spacing: -0.015em;
		text-transform: none;
		line-height: 1.1;
	}

	.cat-count {
		font-weight: 400;
		color: var(--ft-text-faint);
		margin-left: 6px;
		font-variant-numeric: tabular-nums;
	}

	/* ── Product grid — horizontal scroll on mobile with edge fade ── */
	.cat-grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 16px;
		overflow-x: auto;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		margin-right: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding-right: var(--ft-gutter, clamp(24px, 5vw, 80px));
		padding-bottom: 16px;
		/* Hint: more items to the right on mobile */
		-webkit-mask-image: linear-gradient(to right, black 0, black 90%, transparent 100%);
		mask-image: linear-gradient(to right, black 0, black 90%, transparent 100%);
	}

	.cat-grid:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.cat-grid::-webkit-scrollbar {
		display: none;
	}

	:global(.cat-grid > *) {
		flex: 0 0 75%;
		scroll-snap-align: start;
	}

	@media (min-width: 640px) {
		.cat-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			margin: 0;
			padding: 0;
			overflow: visible;
			-webkit-mask-image: none;
			mask-image: none;
		}

		:global(.cat-grid > *) {
			flex: auto;
		}
	}

	@media (min-width: 1024px) {
		.cat-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 1440px) {
		.cat-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	/* ── Empty / error states ── */
	.empty-state {
		text-align: center;
		padding: clamp(48px, 8vh, 80px) 0;
		color: var(--ft-text-muted);
		font-size: 0.9rem;
	}

	.empty-reset {
		display: inline-block;
		margin-top: 12px;
		color: var(--ft-accent);
		text-decoration: underline;
		font-weight: 500;
	}

	.error-state {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 20px 24px;
		margin: clamp(24px, 4vh, 40px) 0;
		background: color-mix(in srgb, #dc2626 6%, transparent);
		border: 1px solid color-mix(in srgb, #dc2626 30%, var(--ft-line));
		border-left-width: 3px;
		border-radius: var(--radius-md);
		color: var(--ft-text);
	}

	.error-state svg {
		flex-shrink: 0;
		color: #dc2626;
		margin-top: 2px;
	}

	.error-state p {
		margin: 0;
		font-size: 0.9rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.chips-bar {
			transition: none;
		}
	}
</style>
