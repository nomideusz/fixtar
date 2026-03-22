<script lang="ts">
	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		categories: Category[];
	}

	let { categories }: Props = $props();

	// Category icons mapped by slug keyword
	const iconMap: Record<string, string> = {
		szlifierk: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		wkret: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
		wiertark: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		młotowiert: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		piły: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
		pił: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
		wyrzynark: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
		kompresor: 'M12 2v20M2 12h20 M4.93 4.93l14.14 14.14 M19.07 4.93L4.93 19.07',
		ostrzałk: 'M13 10V3L4 14h7v7l9-11h-7z',
		poler: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
		klucz: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		spawark: 'M13 10V3L4 14h7v7l9-11h-7z',
		młot: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		frezark: 'M12 2v20M2 12h20',
		zestaw: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
		pompy: 'M12 2v6m0 0a4 4 0 100 8 4 4 0 000-8zm0 14v2 M6 12H4 M20 12h-2',
		narzędz: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		mieszad: 'M12 2v20M2 12h20',
		mieszark: 'M12 2v20M2 12h20',
		przedłuż: 'M13 10V3L4 14h7v7l9-11h-7z',
		węż: 'M12 2v6m0 0a4 4 0 100 8 4 4 0 000-8zm0 14v2',
	};

	const defaultIcon = 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';

	function getIcon(slug: string): string {
		for (const [key, path] of Object.entries(iconMap)) {
			if (slug.includes(key)) return path;
		}
		return defaultIcon;
	}

	// Show top 8 categories
	const topCategories = $derived(categories.slice(0, 8));
</script>

<section class="categories-section">
	<div class="categories-container">
		<div class="categories-header">
			<span class="categories-eyebrow">Kategorie</span>
			<h2 class="categories-title">Znajdź Narzędzia</h2>
			<p class="categories-desc">
				Przeglądaj produkty według kategorii
			</p>
		</div>

		<div class="categories-grid">
			{#each topCategories as cat (cat.id)}
				<a href="/products?category={cat.slug}" class="cat-card">
					<div class="cat-icon">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d={getIcon(cat.slug)}
							/>
						</svg>
					</div>
					<h3 class="cat-name">{cat.name}</h3>
					<span class="cat-count">{cat.count} {cat.count === 1 ? 'produkt' : cat.count < 5 ? 'produkty' : 'produktów'}</span>
				</a>
			{/each}
		</div>

		{#if categories.length > 8}
			<div class="categories-more">
				<a href="/products" class="more-link">
					Zobacz wszystkie kategorie ({categories.length})
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.categories-section {
		position: relative;
		padding: 5rem 0 6rem;
		background: var(--ft-dark, var(--ft-surface));
		overflow: hidden;
	}

	/* Top divider */
	.categories-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 10%;
		right: 10%;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--ft-brand-medium), transparent);
		pointer-events: none;
	}

	.categories-container {
		position: relative;
		z-index: 1;
		max-width: 1536px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	@media (min-width: 640px) { .categories-container { padding: 0 2rem; } }
	@media (min-width: 1024px) { .categories-container { padding: 0 3rem; } }

	/* ── Header ── */
	.categories-header {
		text-align: center;
		margin-bottom: 3.5rem;
	}

	.categories-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-heading);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-brand-500, #378a92);
		margin-bottom: 1rem;
	}

	.categories-eyebrow::before,
	.categories-eyebrow::after {
		content: '';
		width: 2rem;
		height: 1px;
		background: var(--color-brand-500, #378a92);
		opacity: 0.3;
	}

	.categories-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		letter-spacing: -0.02em;
		margin-bottom: 0.75rem;
	}

	.categories-desc {
		font-size: 1rem;
		color: var(--ft-dark-text-secondary, var(--ft-text-muted));
		max-width: 30rem;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* ── Grid ── */
	.categories-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.categories-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	@media (min-width: 1024px) {
		.categories-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 1.25rem;
		}
	}

	/* ── Card ── */
	.cat-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem 1rem 1.5rem;
		background: var(--ft-dark-card, var(--ft-card));
		border: 1px solid var(--ft-dark-border, var(--ft-border));
		border-radius: 0.25rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
		overflow: hidden;
	}

	.cat-card::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-brand-500, #378a92);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.cat-card:hover {
		background: var(--ft-dark-card-hover, var(--ft-card-hover));
		border-color: var(--ft-brand-medium);
		transform: translateY(-3px);
		box-shadow: 0 8px 24px var(--ft-shadow);
	}

	.cat-card:hover::after {
		transform: scaleX(1);
	}

	/* ── Icon ── */
	.cat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		margin-bottom: 1rem;
		background: var(--ft-brand-muted);
		border: 1px solid var(--ft-brand-glow);
		border-radius: 0.125rem;
		color: var(--color-brand-500, #378a92);
		transition: all 0.3s ease;
	}

	.cat-card:hover .cat-icon {
		background: var(--ft-brand-medium);
		box-shadow: 0 0 16px var(--ft-brand-glow);
	}

	/* ── Name ── */
	.cat-name {
		font-family: var(--font-heading);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--ft-text-strong);
		margin-bottom: 0.375rem;
		line-height: 1.3;
		transition: color 0.25s;
	}

	.cat-card:hover .cat-name {
		color: var(--ft-text);
	}

	/* ── Count ── */
	.cat-count {
		font-size: 0.75rem;
		color: var(--ft-text-faint);
		letter-spacing: 0.02em;
	}

	/* ── More link ── */
	.categories-more {
		text-align: center;
		margin-top: 2.5rem;
	}

	.more-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-heading);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
		text-decoration: none;
		padding: 0.5rem 1.25rem;
		border: 1px solid var(--ft-border);
		transition: all 0.3s ease;
	}

	.more-link:hover {
		color: var(--ft-text);
		border-color: var(--color-brand-500, #378a92);
		background: var(--ft-brand-muted);
	}
</style>
