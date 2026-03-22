<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		featuredProduct?: Product;
		totalProducts?: number;
	}

	let { featuredProduct, totalProducts = 0 }: Props = $props();
</script>

<section class="hero">
	<div class="hero-inner">
		<div class="hero-content">
			<div class="hero-kicker">Elektronarzędzia · Serwis · Dostawa 24h</div>

			<h1 class="hero-title">Profesjonalne<br />Narzędzia</h1>

			<p class="hero-desc">
				Szlifierki, wiertarki, młotowiertarki, piły i więcej.
				Sprawdzone marki w konkurencyjnych cenach.
			</p>

			<div class="hero-actions">
				<a href="/products" class="hero-btn-primary">
					Przeglądaj Produkty
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
				</a>
				<a href="/search" class="hero-btn-secondary">Szukaj</a>
			</div>
		</div>

		{#if featuredProduct}
			<a href="/products/{featuredProduct.slug || featuredProduct.id}" class="hero-product">
				<div class="product-image-wrap">
					{#if featuredProduct.mainImage}
						<img
							src={featuredProduct.mainImage}
							alt={featuredProduct.name}
							class="product-img"
							width="400"
							height="300"
						/>
					{/if}
				</div>
				<div class="product-info">
					<span class="product-badge">Polecany</span>
					<h2 class="product-name">{featuredProduct.name}</h2>
					<div class="product-price-row">
						<span class="product-price">{featuredProduct.price.toFixed(2)} zł</span>
						{#if featuredProduct.compareAtPrice && featuredProduct.compareAtPrice > featuredProduct.price}
							<span class="product-old-price">{featuredProduct.compareAtPrice.toFixed(2)} zł</span>
						{/if}
					</div>
				</div>
			</a>
		{/if}
	</div>

	<!-- Stats strip -->
	<div class="stats-strip">
		<div class="stats-inner">
			<div class="stat">
				<span class="stat-value">{totalProducts}+</span>
				<span class="stat-label">Produktów</span>
			</div>
			<span class="stat-dot">·</span>
			<div class="stat">
				<span class="stat-value">4</span>
				<span class="stat-label">Marki</span>
			</div>
			<span class="stat-dot">·</span>
			<div class="stat">
				<span class="stat-value">24h</span>
				<span class="stat-label">Wysyłka</span>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: clamp(100px, 12vh, 160px) 0 0;
	}

	.hero-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px;
		align-items: center;
	}

	@media (min-width: 1024px) {
		.hero-inner {
			grid-template-columns: 1fr 1fr;
			gap: 64px;
		}
	}

	/* ── Content ── */
	.hero-content {
		display: flex;
		flex-direction: column;
	}

	.hero-kicker {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ft-accent);
		margin-bottom: 20px;
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 6vw, 4.4rem);
		font-weight: 700;
		line-height: 1.06;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
		margin-bottom: 24px;
	}

	.hero-desc {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--ft-text-muted);
		max-width: 420px;
		margin-bottom: 36px;
	}

	.hero-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.hero-btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--ft-accent);
		color: white;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 14px 28px;
		border-radius: var(--radius-sm);
		transition: all var(--dur-fast) ease;
	}

	.hero-btn-primary:hover {
		background: var(--ft-accent-hover);
		color: white;
		box-shadow: var(--ft-shadow-md);
	}

	.hero-btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: transparent;
		color: var(--ft-text-muted);
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 14px 28px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		transition: all var(--dur-fast) ease;
	}

	.hero-btn-secondary:hover {
		border-color: var(--ft-accent);
		color: var(--ft-dark);
	}

	/* ── Featured product card ── */
	.hero-product {
		display: flex;
		flex-direction: column;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-lg);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
	}

	.hero-product:hover {
		border-color: var(--ft-accent);
		box-shadow: var(--ft-shadow-lg);
	}

	.product-image-wrap {
		padding: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ffffff;
		min-height: 280px;
	}

	.product-img {
		max-width: 100%;
		max-height: 260px;
		object-fit: contain;
		transition: transform 0.4s var(--ease-out);
	}

	.hero-product:hover .product-img {
		transform: scale(1.03);
	}

	.product-info {
		padding: 24px;
	}

	.product-badge {
		display: inline-block;
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-warm);
		border: 1px solid var(--ft-warm);
		background: var(--ft-warm-bg);
		padding: 3px 10px;
		border-radius: var(--radius-full);
		margin-bottom: 10px;
	}

	.product-name {
		font-family: var(--font-sans);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--ft-dark);
		line-height: 1.35;
		margin-bottom: 8px;
	}

	.product-price-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.product-price {
		font-weight: 700;
		font-size: 1.2rem;
		color: var(--ft-dark);
		font-variant-numeric: tabular-nums;
	}

	.product-old-price {
		font-size: 0.85rem;
		color: var(--ft-text-muted);
		text-decoration: line-through;
	}

	/* ── Stats strip ── */
	.stats-strip {
		margin-top: 56px;
		border-top: 1px solid var(--ft-line);
		border-bottom: 1px solid var(--ft-line);
	}

	.stats-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 20px var(--ft-gutter);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 32px;
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.1rem;
		color: var(--ft-dark);
	}

	.stat-label {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
	}

	.stat-dot {
		color: var(--ft-text-faint);
		font-size: 0.8rem;
	}
</style>
