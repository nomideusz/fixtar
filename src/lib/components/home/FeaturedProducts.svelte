<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { cart, notifications } from '$lib/stores';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		products: Product[];
		error?: string;
	}

	let { products, error }: Props = $props();

	function addToCart(product: Product) {
		cart.addItem({
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.mainImage || undefined
		});
		notifications.success(`Dodano ${product.name} do koszyka`);
	}

	const items = $derived(products.slice(1, 7));
</script>

<section class="featured-section">
	<div class="featured-container">
		<!-- Header -->
		<div class="featured-header">
			<span class="featured-eyebrow">Wybrane dla Ciebie</span>
			<h2 class="featured-title">Polecane Produkty</h2>
			<p class="featured-desc">
				Starannie wyselekcjonowane narzędzia najwyższej jakości
			</p>
		</div>

		{#if error}
			<div class="featured-error">
				<svg class="featured-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<h3 class="featured-error-title">Ups! Coś poszło nie tak</h3>
				<p class="featured-error-msg">{error}</p>
				<Button href="/products">Spróbuj Ponownie</Button>
			</div>
		{:else if items.length > 0}
			<div class="featured-grid">
				{#each items as product, i (product.id)}
					<a href="/products/{product.slug || product.id}" class="fcard" class:fcard--hero={i === 0}>
						<!-- Image -->
						<div class="fcard-img-wrap">
							{#if product.mainImage}
								<img
									src={product.mainImage}
									alt={product.name}
									class="fcard-img"
									loading="lazy"
								/>
							{:else}
								<div class="fcard-img-placeholder">
								<svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							{/if}

							<!-- Badges -->
							<div class="fcard-badges">
								{#if i === 0}
									<span class="fcard-badge fcard-badge--hot">🔥 Bestseller</span>
								{:else if product.featured}
									<span class="fcard-badge fcard-badge--featured">Polecany</span>
								{/if}
								{#if product.compareAtPrice && product.compareAtPrice > product.price}
									<span class="fcard-badge fcard-badge--sale">
										-{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
									</span>
								{/if}
							</div>
						</div>

						<!-- Info -->
						<div class="fcard-body">
							<h3 class="fcard-name">{product.name}</h3>
							{#if i === 0 && product.description}
								<p class="fcard-desc">{product.description}</p>
							{/if}

							<div class="fcard-footer">
								<div class="fcard-price-row">
									<span class="fcard-price">{product.price.toFixed(2)} zł</span>
									{#if product.compareAtPrice && product.compareAtPrice > product.price}
										<span class="fcard-old-price">{product.compareAtPrice.toFixed(2)} zł</span>
									{/if}
								</div>
								<button
									class="fcard-cart-btn"
							onclick={(e) => { e.stopPropagation(); e.preventDefault(); addToCart(product); }}
									aria-label="Dodaj do koszyka"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
									</svg>
								</button>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<div class="featured-cta">
				<Button href="/products" size="lg">
					<span class="flex items-center gap-2">
						Zobacz Wszystkie Produkty
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</span>
				</Button>
			</div>
		{:else}
			<div class="featured-empty">
				<svg class="featured-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
				</svg>
				<h3 class="featured-empty-title">Przygotowujemy Coś Specjalnego</h3>
				<p class="featured-empty-msg">Nasza nowa kolekcja już wkrótce.</p>
				<Button href="/contact">Powiadom Mnie</Button>
			</div>
		{/if}
	</div>
</section>

<style>
	/* ══════════════════════════════════════
	   FEATURED PRODUCTS — Dark Industrial Grid
	   ══════════════════════════════════════ */

	.featured-section {
		position: relative;
		padding: 6rem 0 7rem;
		background: var(--ft-dark, #0c1118);
		overflow: hidden;
	}

	/* Blueprint grid continuation */
	.featured-section::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(55, 138, 146, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(55, 138, 146, 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 90% 80% at 50% 30%, black 10%, transparent 70%);
		-webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 30%, black 10%, transparent 70%);
		pointer-events: none;
	}

	/* Top fade — seamless hero connection */
	.featured-section::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 8rem;
		background: linear-gradient(to bottom, var(--ft-dark-deeper, #090e13), transparent);
		pointer-events: none;
		z-index: 1;
	}

	.featured-container {
		position: relative;
		z-index: 2;
		max-width: 1536px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	@media (min-width: 640px)  { .featured-container { padding: 0 2rem; } }
	@media (min-width: 1024px) { .featured-container { padding: 0 3rem; } }

	/* ── Header ── */
	.featured-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.featured-eyebrow {
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

	.featured-eyebrow::before,
	.featured-eyebrow::after {
		content: '';
		width: 2rem;
		height: 1px;
		background: var(--color-brand-500, #378a92);
		opacity: 0.3;
	}

	.featured-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4vw, 3.25rem);
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.featured-desc {
		font-size: 1.05rem;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		max-width: 36rem;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* ── Grid ── */
	.featured-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}

	@media (min-width: 640px) {
		.featured-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.featured-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
		}
	}

	/* ── Card ── */
	.fcard {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--ft-dark-card, rgba(255, 255, 255, 0.02));
		border: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.06));
		border-radius: 0.25rem;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
	}

	/* Precision top accent line */
	.fcard::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--color-brand-500, #378a92), transparent);
		opacity: 0;
		transition: opacity 0.35s ease;
		z-index: 3;
	}

	.fcard:hover {
		background: var(--ft-dark-card-hover, rgba(255, 255, 255, 0.04));
		border-color: var(--ft-dark-border-hover, rgba(55, 138, 146, 0.15));
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(55, 138, 146, 0.06);
		transform: translateY(-3px);
	}

	.fcard:hover::before {
		opacity: 1;
	}

	/* Hero card spans full width on sm, 2col+2row on lg */
	@media (min-width: 640px) {
		.fcard--hero {
			grid-column: span 2;
		}
	}
	@media (min-width: 1024px) {
		.fcard--hero {
			grid-column: span 1;
			grid-row: span 2;
		}
	}

	/* ── Image area ── */
	.fcard-img-wrap {
		position: relative;
		background: rgba(255, 255, 255, 0.01);
		overflow: hidden;
	}

	/* Standard cards: fixed aspect ratio */
	.fcard:not(.fcard--hero) .fcard-img-wrap {
		aspect-ratio: 4 / 3;
	}

	/* Hero card: takes available space so it can stretch with the 2-row span */
	.fcard--hero .fcard-img-wrap {
		flex: 1 1 0%;
		min-height: 14rem;
	}

	.fcard-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 1rem;
		transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
	}

	.fcard:hover .fcard-img {
		transform: scale(1.05);
	}

	.fcard-img-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 10rem;
		color: rgba(255, 255, 255, 0.1);
	}

	/* ── Badges ── */
	.fcard-badges {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		z-index: 2;
	}

	.fcard-badge {
		display: inline-block;
		font-family: var(--font-heading);
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.2rem 0.6rem;
		border-radius: 0;
		line-height: 1.4;
	}

	.fcard-badge--hot {
		background: var(--color-brand-600, #2f6d73);
		color: #fff;
	}

	.fcard-badge--featured {
		background: rgba(55, 138, 146, 0.15);
		color: var(--color-brand-400, #64a1a7);
		border: 1px solid rgba(55, 138, 146, 0.2);
	}

	.fcard-badge--sale {
		background: rgba(220, 38, 38, 0.15);
		color: #fca5a5;
		border: 1px solid rgba(220, 38, 38, 0.2);
	}

	/* ── Card body ── */
	.fcard-body {
		display: flex;
		flex-direction: column;
		padding: 1.25rem;
		gap: 0.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.04);
	}

	.fcard-name {
		font-family: var(--font-heading);
		font-size: 0.95rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.25s;
	}

	.fcard:hover .fcard-name {
		color: white;
	}

	.fcard--hero .fcard-name {
		font-size: 1.15rem;
	}

	.fcard-desc {
		font-size: 0.85rem;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.3));
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ── Footer: price + cart button ── */
	.fcard-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
		padding-top: 0.5rem;
	}

	.fcard-price-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.fcard-price {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
	}

	.fcard--hero .fcard-price {
		font-size: 1.35rem;
	}

	.fcard-old-price {
		font-size: 0.8rem;
		color: var(--ft-dark-text-muted, rgba(255, 255, 255, 0.25));
		text-decoration: line-through;
	}

	.fcard-cart-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0;
		border: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.08));
		background: transparent;
		color: rgba(255, 255, 255, 0.4);
		cursor: pointer;
		transition: all 0.25s ease;
		flex-shrink: 0;
	}

	.fcard-cart-btn:hover {
		border-color: var(--color-brand-500, #378a92);
		background: var(--color-brand-600, #2f6d73);
		color: #fff;
		box-shadow: 0 0 12px rgba(55, 138, 146, 0.2);
	}

	/* ── CTA ── */
	.featured-cta {
		text-align: center;
		margin-top: 3.5rem;
	}

	/* ── Error / Empty states ── */
	.featured-error,
	.featured-empty {
		text-align: center;
		background: var(--ft-dark-card, rgba(255, 255, 255, 0.02));
		border: 1px solid var(--ft-dark-border, rgba(255, 255, 255, 0.06));
		border-radius: 0.25rem;
		padding: 4rem 2rem;
	}

	.featured-error-icon {
		width: 3rem;
		height: 3rem;
		color: #f87171;
		margin: 0 auto 1.5rem;
	}

	.featured-error-title,
	.featured-empty-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		margin-bottom: 0.75rem;
	}

	.featured-error-msg,
	.featured-empty-msg {
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		margin-bottom: 2rem;
		max-width: 24rem;
		margin-inline: auto;
	}

	.featured-empty-icon {
		width: 4rem;
		height: 4rem;
		color: var(--ft-dark-text-muted, rgba(255, 255, 255, 0.15));
		margin: 0 auto 1.5rem;
	}
</style>
