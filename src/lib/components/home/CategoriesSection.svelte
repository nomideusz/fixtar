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

	/* Story blocks — top 4 categories get editorial treatment */
	const storyGradients = [
		'linear-gradient(135deg, #014783 0%, #0a5a9e 100%)',
		'linear-gradient(135deg, #1a2233 0%, #2e3a46 100%)',
		'linear-gradient(135deg, #3E8B8B 0%, #327272 100%)',
		'linear-gradient(135deg, #014783 0%, #1a3a5c 100%)',
	];

	const storyIcons = [
		/* Saws / cutting */
		'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		/* Drill */
		'M12 22V8M5 12H2a10 10 0 0020 0h-3',
		/* Grinder */
		'M22 12h-4l-3 9L9 3l-3 9H2',
		/* Hammer */
		'M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9',
	];

	const storyDescriptions: Record<string, string> = {
		'szlifierki': 'Precyzyjne szlifowanie metalu, drewna i betonu.',
		'wiertarki': 'Wiercenie w każdym materiale z pełną kontrolą.',
		'piły': 'Czyste cięcia w drewnie, metalu i laminacie.',
		'młotowiertarki': 'Kucie i wiercenie w betonie i kamieniu.',
		'frezarki': 'Profesjonalne frezowanie krawędzi i profili.',
		'odkurzacze': 'Porządek na budowie i w warsztacie.',
		'narzędzia ręczne': 'Klasyczne narzędzia najwyższej jakości.',
		'akcesoria': 'Tarcze, wiertła, nasadki i więcej.',
		'kompresory': 'Sprężone powietrze do każdego zastosowania.',
		'spawarki': 'Spawanie MIG, TIG i elektrodowe.',
	};

	const storyCategories = $derived(categories.slice(0, 4));
	const remainingCategories = $derived(categories.slice(4));
</script>

<section class="categories-section">
	<div class="section-header">
		<div class="section-header-inner">
			<span class="section-kicker">Kategorie</span>
			<h2 class="section-title">Znajdź Swoje Narzędzia</h2>
		</div>
	</div>

	<!-- Story blocks — large editorial cards -->
	<div class="story-grid">
		{#each storyCategories as category, i (category.id)}
			<a
				href="/products?category={category.slug}"
				class="story-block"
				class:story-block--wide={i === 0}
				style="--story-bg: {storyGradients[i % storyGradients.length]}"
			>
				<!-- Photo placeholder -->
				<div class="story-photo" aria-hidden="true">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d={storyIcons[i % storyIcons.length]} />
					</svg>
				</div>

				<div class="story-content">
					<span class="story-count">{category.count} produktów</span>
					<h3 class="story-name">{category.name}</h3>
					<p class="story-desc">
						{storyDescriptions[category.slug.toLowerCase()] || 'Sprawdź pełną ofertę w tej kategorii.'}
					</p>
					<span class="story-cta">
						Przeglądaj
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
					</span>
				</div>
			</a>
		{/each}
	</div>

	<!-- Remaining categories — compact row -->
	{#if remainingCategories.length > 0}
		<div class="remaining">
			<div class="remaining-inner">
				{#each remainingCategories as category (category.id)}
					<a href="/products?category={category.slug}" class="remaining-chip">
						{category.name}
						<span class="chip-count">{category.count}</span>
					</a>
				{/each}
				<a href="/products" class="remaining-chip remaining-chip--all">
					Wszystkie produkty
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
				</a>
			</div>
		</div>
	{/if}
</section>

<style>
	.categories-section {
		padding: clamp(48px, 6vh, 72px) 0;
	}

	/* ── Section header ── */
	.section-header {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		margin-bottom: 32px;
	}

	.section-kicker {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--ft-accent);
		display: block;
		margin-bottom: 6px;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
	}

	/* ── Story grid ── */
	.story-grid {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	@media (min-width: 768px) {
		.story-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.story-block--wide {
			grid-column: span 2;
		}
	}

	@media (min-width: 1024px) {
		.story-grid {
			grid-template-columns: repeat(4, 1fr);
		}

		.story-block--wide {
			grid-column: span 2;
		}
	}

	/* ── Story block ── */
	.story-block {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: 220px;
		padding: 28px;
		border-radius: var(--radius-md);
		background: var(--story-bg);
		color: white;
		text-decoration: none;
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.story-block--wide {
		min-height: 260px;
	}

	.story-block:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		color: white;
	}

	/* ── Photo placeholder — will hold product/lifestyle photos ── */
	.story-photo {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.4);
		transition: all 0.3s ease;
	}

	.story-block:hover .story-photo {
		background: rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.6);
		transform: scale(1.05);
	}

	/* ── Content ── */
	.story-content {
		position: relative;
		z-index: 2;
	}

	.story-count {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		opacity: 0.6;
		display: block;
		margin-bottom: 6px;
	}

	.story-name {
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: white;
		margin-bottom: 6px;
		text-transform: capitalize;
	}

	.story-block--wide .story-name {
		font-size: 1.8rem;
	}

	.story-desc {
		font-size: 0.82rem;
		line-height: 1.5;
		opacity: 0.7;
		margin-bottom: 16px;
		max-width: 300px;
	}

	.story-cta {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		opacity: 0.9;
		transition: gap 0.2s ease;
	}

	.story-block:hover .story-cta {
		gap: 10px;
		opacity: 1;
	}

	/* ── Remaining categories (compact chips) ── */
	.remaining {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 20px var(--ft-gutter) 0;
	}

	.remaining-inner {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.remaining-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-full);
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.remaining-chip:hover {
		border-color: var(--ft-cta);
		color: var(--ft-cta);
	}

	.chip-count {
		font-size: 0.65rem;
		color: var(--ft-text-faint);
		font-weight: 500;
	}

	.remaining-chip--all {
		color: var(--ft-cta);
		border-color: var(--ft-cta);
		background: rgba(255, 107, 0, 0.04);
	}

	.remaining-chip--all:hover {
		background: var(--ft-cta);
		color: white;
	}
</style>
