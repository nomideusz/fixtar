<script lang="ts">
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import { ArrowDownIcon, ArrowUpIcon } from 'phosphor-svelte';
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
			categories: CategoryWithCount[];
			searchQuery: string;
			sortBy: string;
			totalItems: number;
			error?: string;
		};
	}

	let { data }: Props = $props();

	let sortBy = $state('name');
	let activeCategory = $state('');
	let chipScrollEl: HTMLElement | undefined = $state();
	let isScrolling = false;
	let scrollTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		sortBy = data.sortBy;
	});

	// Track which category section is in view
	$effect(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const sections = document.querySelectorAll<HTMLElement>('[data-cat-section]');
		if (!sections.length) return;

		// Set initial active category
		if (!activeCategory && sections.length > 0) {
			activeCategory = sections[0].getAttribute('data-cat-section') || '';
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (isScrolling) return; // ignore during programmatic scroll
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

	function scrollChipIntoView(slug: string) {
		if (!chipScrollEl) return;
		const chip = chipScrollEl.querySelector(`[data-chip="${slug}"]`) as HTMLElement | null;
		if (!chip) return;
		// Scroll only the chip container horizontally — never touch page scroll
		const containerRect = chipScrollEl.getBoundingClientRect();
		const chipRect = chip.getBoundingClientRect();
		const offset = chipRect.left - containerRect.left - containerRect.width / 2 + chipRect.width / 2;
		chipScrollEl.scrollBy({ left: offset, behavior: 'smooth' });
	}

	function scrollToCategory(slug: string) {
		const section = document.querySelector(`[data-cat-section="${slug}"]`);
		if (!section) return;

		// Set active immediately and lock observer
		activeCategory = slug;
		isScrolling = true;
		scrollChipIntoView(slug);

		// Calculate offset: navbar + chip bar height
		const chipsBar = document.querySelector('.chips-bar') as HTMLElement | null;
		const navHeight = window.innerWidth >= 769 ? 100 : 60;
		const chipsHeight = chipsBar?.offsetHeight || 60;
		const offset = navHeight + chipsHeight + 16;

		const top = section.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior: 'smooth' });

		// Unlock observer after scroll settles
		if (scrollTimer) clearTimeout(scrollTimer);
		scrollTimer = setTimeout(() => {
			isScrolling = false;
		}, 800);
	}

	const sortOptions: Array<{ value: string; label: string; icon?: 'up' | 'down' }> = [
		{ value: 'name', label: 'A-Z' },
		{ value: 'price-low', label: 'Cena', icon: 'up' },
		{ value: 'price-high', label: 'Cena', icon: 'down' }
	];

	function setSort(value: string) {
		sortBy = value;
		const params = new URLSearchParams();
		if (data.searchQuery) params.set('search', data.searchQuery);
		if (sortBy !== 'name') params.set('sort', sortBy);
		const qs = params.toString();
		goto(`/products${qs ? '?' + qs : ''}`);
	}
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
	<div class="page-header">
		<h1 class="page-title">Produkty</h1>
		<div class="sort-bar" role="group" aria-label="Sortowanie">
			{#each sortOptions as opt (opt.value)}
				<button
					class="sort-btn"
					class:sort-btn--active={sortBy === opt.value}
					onclick={() => setSort(opt.value)}
					aria-pressed={sortBy === opt.value}
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

	<!-- Category chips — sticky nav -->
	{#if data.categorySections.length > 1}
		<nav class="chips-bar" aria-label="Kategorie">
			<div class="chip-scroll" bind:this={chipScrollEl}>
				{#each data.categorySections as section (section.category.id)}
					<button
						class="chip"
						class:chip--active={activeCategory === section.category.slug}
						data-chip={section.category.slug}
						onclick={() => scrollToCategory(section.category.slug)}
					>
						{section.category.name}
					</button>
				{/each}
			</div>
		</nav>
	{/if}

	<!-- Category sections -->
	{#if data.error}
		<div class="empty-state">
			<p>{data.error}</p>
		</div>
	{:else if data.categorySections.length > 0}
		{#each data.categorySections as section (section.category.id)}
			<section class="cat-section" data-cat-section={section.category.slug}>
				<div class="cat-header">
					<h2 class="cat-title">{section.category.name}</h2>
				</div>

				<div class="cat-grid ft-stagger">
					{#each section.products as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>
			</section>
		{/each}
	{:else}
		<div class="empty-state">
			<p>Nie znaleziono produktów.</p>
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: clamp(24px, 4vh, 40px) 0 20px;
	}

	.page-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		border-left: 4px solid var(--ft-accent);
		padding-left: 14px;
		text-transform: uppercase;
		line-height: 1;
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
		padding: 6px 12px;
		background: transparent;
		border: 1px solid var(--ft-line);
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		cursor: pointer;
		min-height: 36px;
		transition:
			color 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.sort-btn:first-child {
		border-radius: 2px 0 0 2px;
	}

	.sort-btn:last-child {
		border-radius: 0 2px 2px 0;
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

	/* ── Sticky chip bar ── */
	.chips-bar {
		position: sticky;
		top: 60px; /* below navbar mobile */
		z-index: 10;
		background: var(--ft-bg);
		padding: 12px 0;
		margin-left: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		margin-right: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding-left: var(--ft-gutter, clamp(24px, 5vw, 80px));
		margin-bottom: 8px;
		border-bottom: 1px solid var(--ft-line);
	}

	@media (min-width: 769px) {
		.chips-bar {
			top: 100px; /* below navbar desktop */
		}
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
		padding: 8px 16px;
		background: transparent;
		border: 1px solid var(--ft-line);
		border-radius: 2px;
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		cursor: pointer;
		white-space: nowrap;
		text-transform: uppercase;
		letter-spacing: 0.03em;
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
	}

	.cat-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.cat-title {
		font-family: var(--font-display);
		font-size: clamp(1rem, 2vw, 1.25rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.01em;
		border-left: 4px solid var(--ft-accent);
		padding-left: 14px;
		text-transform: uppercase;
		line-height: 1;
	}

	/* ── Product grid — horizontal scroll on mobile ── */
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

	/* ── Empty state ── */
	.empty-state {
		text-align: center;
		padding: clamp(48px, 8vh, 80px) 0;
		color: var(--ft-text-muted);
		font-size: 0.9rem;
	}


</style>
