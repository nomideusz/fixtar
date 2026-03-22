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

	/* SVG icon paths per category slug — lightweight tool silhouettes */
	const categoryIcons: Record<string, string> = {
		'szlifierki-i-polerki':
			'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
		'wiertarki-i-wkretarki':
			'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
		'pily-i-pilarki':
			'M3 6h18M3 12h18M3 18h18',
		'mlotowiertarki':
			'M15 12h.01M12 12h.01M9 12h.01M4 4h16v16H4z',
		default:
			'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
	};

	function getIcon(slug: string): string {
		return categoryIcons[slug] || categoryIcons['default'];
	}
</script>

<section class="categories">
	<div class="categories-inner">
		<h4 class="categories-label">Kategorie</h4>
		<h2 class="categories-title">Znajdź Narzędzia</h2>

		<div class="categories-grid">
			{#each categories as cat, i (cat.id)}
				<a
					href="/products?category={cat.slug}"
					class="category-card ft-animate"
					style="animation-delay: {i * 50}ms"
				>
					<div class="category-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d={getIcon(cat.slug)} />
						</svg>
					</div>
					<div class="category-info">
						<span class="category-name">{cat.name}</span>
						<span class="category-count">{cat.count} {cat.count === 1 ? 'produkt' : cat.count < 5 ? 'produkty' : 'produktów'}</span>
					</div>
					<svg class="category-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
					</svg>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.categories {
		padding: clamp(48px, 6vh, 72px) 0;
	}

	.categories-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
	}

	.categories-label {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ft-accent);
		margin-bottom: 8px;
	}

	.categories-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-bottom: 32px;
	}

	/* ── Grid of category cards ── */
	.categories-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	@media (min-width: 640px) {
		.categories-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.categories-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1280px) {
		.categories-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	/* ── Category card ── */
	.category-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 18px 20px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: inherit;
		transition: all 0.25s ease;
	}

	.category-card:hover {
		border-color: var(--ft-accent);
		box-shadow: var(--ft-shadow-md);
		transform: translateY(-1px);
	}

	.category-icon {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
		color: var(--ft-accent);
		transition: all 0.25s ease;
	}

	.category-card:hover .category-icon {
		background: var(--ft-accent);
		color: white;
	}

	.category-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.category-name {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--ft-dark);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.category-count {
		font-size: 0.72rem;
		color: var(--ft-text-muted);
	}

	.category-arrow {
		flex-shrink: 0;
		color: var(--ft-text-faint);
		transition: all 0.25s ease;
	}

	.category-card:hover .category-arrow {
		color: var(--ft-accent);
		transform: translateX(3px);
	}
</style>
