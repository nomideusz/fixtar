<script lang="ts">
	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		categories?: Category[];
	}

	let { categories = [] }: Props = $props();

	/* Category icon paths — one per known slug */
	const categoryIcons: Record<string, string> = {
		'szlifierki': 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		'wiertarki': 'M12 2L4 7v10l8 5 8-5V7l-8-5zM12 22V12M20 7l-8 5-8-5',
		'piły': 'M3 6h18M3 12h18M3 18h18',
		'młotowiertarki': 'M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9M22 2l-5 5',
		'frezarki': 'M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07',
		'odkurzacze': 'M3 18V6a2 2 0 012-2h14a2 2 0 012 2v12M3 18h18M7 22h10',
		'narzędzia ręczne': 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		'akcesoria': 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2',
		'kompresory': 'M12 2v4M6.34 6.34l2.83 2.83M2 12h4M6.34 17.66l2.83-2.83M12 18v4M17.66 17.66l-2.83-2.83M22 12h-4M17.66 6.34l-2.83 2.83',
		'spawarki': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
	};

	const defaultIcon = 'M4 4h16v16H4zM4 9h16M9 4v16';
</script>

<section class="categories">
	<div class="categories-inner">
		<div class="categories-header">
			<h2 class="categories-title">Kategorie</h2>
			<a href="/products" class="categories-all">
				Wszystkie produkty
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
			</a>
		</div>

		<div class="categories-grid">
			{#each categories as category (category.id)}
				<a href="/products?category={category.slug}" class="cat-card">
					<!-- Photo placeholder — will hold category lifestyle images -->
					<div class="cat-image">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d={categoryIcons[category.slug.toLowerCase()] || defaultIcon} />
						</svg>
					</div>
					<span class="cat-name">{category.name}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.categories {
		padding: clamp(40px, 5vh, 56px) 0;
	}

	.categories-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
	}

	/* ── Header ── */
	.categories-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.categories-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.5rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
	}

	.categories-all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color 0.15s ease, gap 0.15s ease;
	}

	.categories-all:hover {
		color: var(--ft-dark);
		gap: 10px;
	}

	/* ── Grid — matches Scheppach's 6-col category layout ── */
	.categories-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	@media (min-width: 640px) {
		.categories-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.categories-grid {
			grid-template-columns: repeat(6, 1fr);
		}
	}

	/* ── Card — image-first, like Scheppach ── */
	.cat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		border-radius: var(--radius-md);
		overflow: hidden;
		transition: transform 0.2s ease;
	}

	.cat-card:hover {
		transform: translateY(-2px);
	}

	.cat-image {
		width: 100%;
		aspect-ratio: 1;
		background: var(--ft-frost);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ft-text-faint);
		transition: background 0.2s ease, color 0.2s ease;
		/* Placeholder — replace with actual product photography */
	}

	.cat-card:hover .cat-image {
		background: var(--ft-line);
		color: var(--ft-text-muted);
	}

	.cat-name {
		display: block;
		padding: 10px 4px 4px;
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-dark);
		text-align: center;
		text-transform: capitalize;
		letter-spacing: -0.01em;
	}
</style>
