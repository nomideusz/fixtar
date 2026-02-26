<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		featuredProduct?: Product;
	}

	let { featuredProduct }: Props = $props();

	const brands = ['Stihl', 'Makita', 'Bosch', 'DeWalt', 'Milwaukee'] as const;
</script>

<section class="hero">
	<!-- Angled brand accent strip -->
	<div class="hero-accent"></div>

	<div class="hero-inner">
		<!-- Left: Bold copy -->
		<div class="hero-copy">
			<!-- Brand bar -->
			<div class="brand-bar">
				{#each brands as brand, i (brand)}
					{#if i > 0}<span class="brand-dot">·</span>{/if}
					<span class="brand-name">{brand}</span>
				{/each}
			</div>

			<h1 class="hero-title">
				<span class="hero-title-line">Narzędzia</span>
				<span class="hero-title-accent">Naty i Seby</span>
			</h1>

			<p class="hero-subtitle">
				Pilarki, wiertarki, szlifierki. Najwyższa jakość w&nbsp;konkurencyjnych cenach.
			</p>

			<div class="hero-actions">
				<Button href="/products" size="lg">Przeglądaj Produkty</Button>
				<Button href="/contact" variant="outline" size="lg">Kontakt</Button>
			</div>

			<!-- Stats row -->
			<div class="hero-stats">
				<div class="hero-stat">
					<span class="stat-value">5000+</span>
					<span class="stat-label">Klientów</span>
				</div>
				<div class="stat-divider"></div>
				<div class="hero-stat">
					<span class="stat-value">1200+</span>
					<span class="stat-label">Produktów</span>
				</div>
				<div class="stat-divider"></div>
				<div class="hero-stat">
					<span class="stat-value">99%</span>
					<span class="stat-label">Opinii ★</span>
				</div>
			</div>
		</div>

		<!-- Right: Product showcase with bold staging -->
		<div class="hero-product">
			<div class="product-stage">
				<!-- Large brand-colored backdrop shape -->
				<div class="product-backdrop"></div>

				{#if featuredProduct}
					<div class="product-card">
						{#if featuredProduct.mainImage}
							<img
								src={featuredProduct.mainImage}
								alt={featuredProduct.name}
								class="product-img"
							/>
						{:else}
							<!-- Fallback to generated image -->
							<img
								src="/img/hero-chainsaw.png"
								alt="Profesjonalna pilarka"
								class="product-img"
							/>
						{/if}

						<div class="product-meta">
							<span class="product-badge">Polecany</span>
							<h2 class="product-name">{featuredProduct.name}</h2>
							<div class="product-price-row">
								<span class="product-price">{featuredProduct.price.toFixed(2)} zł</span>
								{#if featuredProduct.compareAtPrice && featuredProduct.compareAtPrice > featuredProduct.price}
									<span class="product-old">{featuredProduct.compareAtPrice.toFixed(2)} zł</span>
								{/if}
							</div>
							<a href="/products/{featuredProduct.slug || featuredProduct.id}" class="product-cta">
								Zobacz Produkt →
							</a>
						</div>
					</div>
				{:else}
					<div class="product-card product-card-empty">
						<img
							src="/img/hero-chainsaw.png"
							alt="Profesjonalne narzędzia"
							class="product-img"
						/>
						<div class="product-meta">
							<h2 class="product-name">Profesjonalne Narzędzia</h2>
							<a href="/products" class="product-cta">
								Przeglądaj Produkty →
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Hero container ── */
	.hero {
		position: relative;
		/* Account for fixed navbar height */
		min-height: calc(100vh - 5rem);
		display: flex;
		align-items: stretch;
		background-color: #0c1117;
		overflow: hidden;
	}

	/* ── Angled accent strip — the signature element ── */
	.hero-accent {
		position: absolute;
		top: 0;
		right: 0;
		width: 55%;
		height: 100%;
		background: linear-gradient(135deg, var(--ft-primary, #378A92) 0%, #2a6f76 100%);
		clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
		z-index: 1;
	}

	@media (max-width: 1023px) {
		.hero-accent {
			width: 100%;
			height: 45%;
			bottom: 0;
			top: auto;
			clip-path: polygon(0 20%, 100% 0, 100% 100%, 0% 100%);
		}
	}

	/* ── Grid ── */
	.hero-inner {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr;
		width: 100%;
		max-width: 1536px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	@media (min-width: 640px) {
		.hero-inner { padding: 0 2rem; }
	}

	@media (min-width: 1024px) {
		.hero-inner {
			grid-template-columns: 1fr 1fr;
			padding: 0 3rem;
		}
	}

	/* ── Left copy ── */
	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 6rem 0 3rem;
		color: white;
	}

	@media (min-width: 1024px) {
		.hero-copy {
			padding: 5rem 4rem 5rem 0;
		}
	}

	/* ── Brand trust bar ── */
	.brand-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.brand-name {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--ft-primary, #378A92);
	}

	.brand-dot {
		color: rgba(255, 255, 255, 0.2);
		font-size: 1.25rem;
	}

	/* ── Title — BIG, distinctive ── */
	.hero-title {
		margin-bottom: 1.5rem;
		line-height: 0.95;
	}

	.hero-title-line {
		display: block;
		font-size: clamp(3rem, 7vw, 5.5rem);
		font-weight: 900;
		letter-spacing: -0.03em;
		color: white;
	}

	.hero-title-accent {
		display: block;
		font-size: clamp(3rem, 7vw, 5.5rem);
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--ft-primary, #378A92);
		/* Slight offset — gives energy */
		margin-left: 0.15em;
	}

	/* ── Subtitle ── */
	.hero-subtitle {
		font-size: 1.125rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.5);
		max-width: 26rem;
		margin-bottom: 2.5rem;
	}

	/* ── Actions ── */
	.hero-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 3rem;
	}

	/* ── Stats ── */
	.hero-stats {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.hero-stat {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}

	.stat-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.4);
		margin-top: 0.125rem;
	}

	.stat-divider {
		width: 1px;
		height: 2rem;
		background-color: rgba(255, 255, 255, 0.15);
	}

	/* ── Right: Product ── */
	.hero-product {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 0;
	}

	@media (min-width: 1024px) {
		.hero-product {
			padding: 3rem 0 3rem 2rem;
		}
	}

	.product-stage {
		position: relative;
		width: 100%;
		max-width: 28rem;
	}

	/* Large circle backdrop behind the product */
	.product-backdrop {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.08);
		z-index: 0;
	}

	.product-card {
		position: relative;
		z-index: 1;
		background-color: white;
		border: 1px solid var(--ft-border, #e2e8f0);
		overflow: hidden;
	}

	.product-card-empty {
		display: flex;
		flex-direction: column;
	}

	.product-img {
		width: 100%;
		height: 16rem;
		object-fit: contain;
		background-color: #f8fafc;
		padding: 1.5rem;
	}

	@media (min-width: 1024px) {
		.product-img {
			height: 20rem;
		}
	}

	.product-meta {
		padding: 1.5rem;
		background-color: white;
	}

	.product-badge {
		display: inline-block;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		background-color: var(--ft-primary, #378A92);
		color: white;
		padding: 0.2rem 0.6rem;
		margin-bottom: 0.5rem;
	}

	.product-name {
		font-size: 1rem;
		font-weight: 700;
		color: var(--ft-text-primary, #0f172a);
		line-height: 1.3;
		margin-bottom: 0.5rem;
	}

	.product-price-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--ft-primary, #378A92);
		font-variant-numeric: tabular-nums;
	}

	.product-old {
		font-size: 0.875rem;
		color: var(--ft-text-muted, #94a3b8);
		text-decoration: line-through;
		font-variant-numeric: tabular-nums;
	}

	.product-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ft-primary, #378A92);
		transition: gap 0.2s;
		cursor: pointer;
	}

	.product-cta:hover {
		gap: 0.625rem;
	}
</style>
