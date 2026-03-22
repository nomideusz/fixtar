<script lang="ts">
	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		categories: Category[];
		visible: boolean;
		onClose: () => void;
	}

	let { categories, visible, onClose }: Props = $props();

	/* Distinct SVG icon paths per category slug */
	const categoryIcons: Record<string, { paths: string[]; viewBox?: string }> = {
		'szlifierki-i-polerki': {
			paths: [
				'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
			]
		},
		'wiertarki-i-wkretarki': {
			paths: [
				'M2 12l5-5 2 2-5 5z',
				'M7 7l10-5 5 5-5 10-2-2 3-6-6 3z'
			]
		},
		'pily-i-pilarki': {
			paths: [
				'M12 2L2 7l10 5 10-5-10-5z',
				'M2 17l10 5 10-5',
				'M2 12l10 5 10-5'
			]
		},
		'mlotowiertarki': {
			paths: [
				'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z',
				'M3 6h18',
				'M12 10v8',
				'M8 14h8'
			]
		},
		'frezarki': {
			paths: [
				'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
				'M3.27 6.96L12 12.01l8.73-5.05',
				'M12 22.08V12'
			]
		},
		'odkurzacze-przemyslowe': {
			paths: [
				'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z',
				'M12 8v4l3 3'
			]
		},
		'narzedzia-reczne': {
			paths: [
				'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
			]
		},
		'akcesoria': {
			paths: [
				'M20 7h-9',
				'M14 17H5',
				'M17 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
				'M7 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'
			]
		},
		'kompresory': {
			paths: [
				'M12 2v20',
				'M2 12h20',
				'M12 2a10 10 0 0 1 10 10',
				'M12 2a10 10 0 0 0-10 10'
			]
		},
		'spawarki': {
			paths: [
				'M13 2L3 14h9l-1 8 10-12h-9l1-8z'
			]
		}
	};

	const defaultIcon = {
		paths: [
			'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
		]
	};

	function getIcon(slug: string) {
		return categoryIcons[slug] || defaultIcon;
	}
</script>

{#if visible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mega-backdrop" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()} role="presentation"></div>

	<div
		class="mega-menu"
		role="menu"
		tabindex="-1"
		aria-label="Kategorie produktów"
		onkeydown={(e) => e.key === 'Escape' && onClose()}
	>
		<div class="mega-inner">
			<div class="mega-header">
				<!-- Using span instead of h3 to avoid heading hierarchy skip (no h1/h2 above in nav) -->
				<span class="mega-title">Kategorie</span>
				<a href="/products" class="mega-all" onclick={onClose}>
					Wszystkie produkty
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
					</svg>
				</a>
			</div>

			<div class="mega-grid">
				{#each categories as cat (cat.id)}
					{@const icon = getIcon(cat.slug)}
					<a
						href="/products?category={cat.slug}"
						class="mega-item"
						role="menuitem"
						onclick={onClose}
					>
						<div class="mega-icon" aria-hidden="true">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								{#each icon.paths as d}
									<path {d} />
								{/each}
							</svg>
						</div>
						<div class="mega-item-info">
							<span class="mega-item-name">{cat.name}</span>
							<span class="mega-item-count">{cat.count} {cat.count === 1 ? 'produkt' : cat.count < 5 ? 'produkty' : 'produktów'}</span>
						</div>
						<svg class="mega-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</a>
				{/each}
			</div>

			<div class="mega-footer">
				<a href="/deals" class="mega-promo" onclick={onClose}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
						<line x1="7" y1="7" x2="7.01" y2="7" />
					</svg>
					Sprawdź aktualne promocje
					<svg class="mega-promo-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.mega-backdrop {
		position: fixed;
		inset: 0;
		z-index: 39;
		background: rgba(0, 0, 0, 0.06);
		cursor: pointer;
	}

	.mega-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 40;
		background: var(--ft-surface);
		border-bottom: 1px solid var(--ft-line);
		box-shadow:
			0 8px 32px rgba(21, 29, 43, 0.06),
			0 2px 8px rgba(21, 29, 43, 0.04);
		animation: megaSlideIn 0.2s ease-out;
	}

	/* Invisible bridge: continuous hover zone from trigger to menu */
	.mega-menu::before {
		content: '';
		position: absolute;
		top: -24px;
		left: 0;
		right: 0;
		height: 24px;
	}

	@keyframes megaSlideIn {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mega-menu {
			animation: none;
		}
	}

	.mega-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 24px var(--ft-gutter) 20px;
	}

	.mega-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--ft-line);
	}

	.mega-title {
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ft-text-muted);
	}

	.mega-all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--ft-accent);
		text-decoration: none;
		cursor: pointer;
		border-radius: var(--radius-sm);
		padding: 6px 10px;
		margin: -6px -10px;
		transition:
			gap 0.2s ease,
			background var(--dur-fast) ease;
	}

	.mega-all:hover {
		gap: 10px;
		background: rgba(55, 138, 146, 0.06);
	}

	.mega-all:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	/* ── Grid ── */
	.mega-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 4px;
	}

	@media (min-width: 768px) {
		.mega-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1280px) {
		.mega-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 4px 8px;
		}
	}

	/* ── Item ── */
	.mega-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.mega-item:hover,
	.mega-item:focus-visible {
		background: var(--ft-frost);
	}

	.mega-item:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: -2px;
	}

	.mega-icon {
		flex-shrink: 0;
		width: 38px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
		color: var(--ft-accent);
		transition: all 0.15s ease;
	}

	.mega-item:hover .mega-icon {
		background: var(--ft-accent);
		color: white;
		box-shadow: 0 2px 8px rgba(55, 138, 146, 0.2);
	}

	.mega-item-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.mega-item-name {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-dark);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mega-item-count {
		font-size: 0.68rem;
		color: var(--ft-text-muted);
	}

	.mega-item-arrow {
		flex-shrink: 0;
		color: var(--ft-text-faint);
		opacity: 0;
		transform: translateX(-4px);
		transition: all 0.15s ease;
	}

	.mega-item:hover .mega-item-arrow {
		opacity: 0.6;
		transform: translateX(0);
	}

	/* ── Footer ── */
	.mega-footer {
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid var(--ft-line);
	}

	.mega-promo {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--ft-warm);
		text-decoration: none;
		cursor: pointer;
		border-radius: var(--radius-sm);
		padding: 6px 10px;
		margin: -6px -10px;
		transition:
			color 0.15s ease,
			background var(--dur-fast) ease;
	}

	.mega-promo:hover {
		color: var(--ft-accent);
		background: rgba(55, 138, 146, 0.04);
	}

	.mega-promo:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.mega-promo-arrow {
		opacity: 0;
		transform: translateX(-4px);
		transition: all 0.15s ease;
	}

	.mega-promo:hover .mega-promo-arrow {
		opacity: 0.7;
		transform: translateX(0);
	}
</style>
