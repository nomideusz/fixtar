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
	<!-- Engineering grid overlay -->
	<div class="hero-grid"></div>

	<!-- Angled brand accent strip with diagonal texture -->
	<div class="hero-accent"></div>

	<!-- Laser sweep — desktop only -->
	<div class="hero-sweep"></div>

	<!-- Corner marks — desktop only -->
	<div class="corner-mark corner-tl"></div>
	<div class="corner-mark corner-tr"></div>
	<div class="corner-mark corner-bl"></div>
	<div class="corner-mark corner-br"></div>

	<div class="hero-inner">
		<!-- Left: Bold copy -->
		<div class="hero-copy">
			<!-- Brand trust bar -->
			<div class="brand-bar">
				{#each brands as brand, i (brand)}
					{#if i > 0}<span class="brand-pipe">|</span>{/if}
					<span class="brand-name">{brand}</span>
				{/each}
			</div>

			<!-- Accent bar before title -->
			<div class="title-accent-bar"></div>

			<h1 class="hero-title">
				<span class="hero-title-line">Narzędzia</span>
				<span class="hero-title-accent">Naty i Seby</span>
			</h1>

			<!-- Horizontal rule -->
			<div class="hero-rule"></div>

			<p class="hero-subtitle">
				Pilarki, wiertarki, szlifierki. Najwyższa jakość w&nbsp;konkurencyjnych cenach.
			</p>

			<div class="hero-actions">
				<Button href="/products" size="lg">Przeglądaj Produkty</Button>
				<Button href="/contact" variant="outline" size="lg">Kontakt</Button>
			</div>

			<!-- Stats — industrial spec sheet -->
			<div class="hero-stats">
				<div class="stat-cell">
					<span class="stat-value">5000+</span>
					<span class="stat-label">Klientów</span>
				</div>
				<div class="stat-cell">
					<span class="stat-value">1200+</span>
					<span class="stat-label">Produktów</span>
				</div>
				<div class="stat-cell">
					<span class="stat-value">99%</span>
					<span class="stat-label">Opinii ★</span>
				</div>
			</div>
		</div>

		<!-- Right: Product showcase -->
		<div class="hero-product">
			<div class="product-stage">
				<!-- Radial glow backdrop -->
				<div class="product-backdrop"></div>

				{#if featuredProduct}
					<a href="/products/{featuredProduct.slug || featuredProduct.id}" class="product-card">
						<div class="product-card-accent"></div>
						{#if featuredProduct.mainImage}
							<img src={featuredProduct.mainImage} alt={featuredProduct.name} class="product-img" />
						{:else}
							<img src="/img/pila1.png" alt="Profesjonalna pilarka" class="product-img" />
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
							<span class="product-cta">
								Zobacz Produkt
								<span class="cta-arrow">→</span>
							</span>
						</div>
					</a>
				{:else}
					<a href="/products" class="product-card">
						<div class="product-card-accent"></div>
						<img src="/img/pila1.png" alt="Profesjonalne narzędzia" class="product-img" />
						<div class="product-meta">
							<h2 class="product-name">Profesjonalne Narzędzia</h2>
							<span class="product-cta">
								Przeglądaj Produkty
								<span class="cta-arrow">→</span>
							</span>
						</div>
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Hero container ── */
	.hero {
		position: relative;
		min-height: calc(100vh - 5rem);
		display: flex;
		align-items: stretch;
		background: linear-gradient(180deg, #0f1720 0%, #0c1117 35%);
		overflow: hidden;
		/* Pull hero up into layout padding to eliminate light gap */
		margin-top: -5rem;
	}

	@media (min-width: 768px) {
		.hero { margin-top: -6rem; }
	}

	/* ── Engineering grid overlay ── */
	.hero-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		z-index: 0;
	}

	/* ── Angled accent strip with diagonal hatching ── */
	.hero-accent {
		position: absolute;
		top: 0;
		right: 0;
		width: 55%;
		height: 100%;
		background: linear-gradient(145deg, var(--ft-primary, #378A92) 0%, #1a5c63 100%);
		clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
		z-index: 1;
	}

	.hero-accent::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 10px,
			rgba(255, 255, 255, 0.035) 10px,
			rgba(255, 255, 255, 0.035) 11px
		);
	}

	@media (max-width: 1023px) {
		.hero-accent {
			width: 100%;
			height: 40%;
			bottom: 0;
			top: auto;
			clip-path: polygon(0 25%, 100% 0, 100% 100%, 0% 100%);
		}
	}

	/* ── Laser sweep — desktop only ── */
	.hero-sweep {
		display: none;
	}

	@media (min-width: 1024px) {
		.hero-sweep {
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			height: 1px;
			background: linear-gradient(90deg, transparent 0%, var(--ft-primary) 25%, var(--ft-primary) 75%, transparent 100%);
			opacity: 0.1;
			z-index: 2;
			animation: laser-sweep 10s ease-in-out infinite;
		}
	}

	@keyframes laser-sweep {
		0%, 100% { top: 15%; }
		50% { top: 85%; }
	}

	/* ── Corner marks — desktop only ── */
	.corner-mark {
		display: none;
	}

	@media (min-width: 1024px) {
		.corner-mark {
			display: block;
			position: absolute;
			width: 20px;
			height: 20px;
			z-index: 5;
			opacity: 0.2;
		}

		.corner-tl { top: 2.5rem; left: 2.5rem; border-top: 2px solid var(--ft-primary); border-left: 2px solid var(--ft-primary); }
		.corner-tr { top: 2.5rem; right: 2.5rem; border-top: 2px solid var(--ft-primary); border-right: 2px solid var(--ft-primary); }
		.corner-bl { bottom: 2.5rem; left: 2.5rem; border-bottom: 2px solid var(--ft-primary); border-left: 2px solid var(--ft-primary); }
		.corner-br { bottom: 2.5rem; right: 2.5rem; border-bottom: 2px solid var(--ft-primary); border-right: 2px solid var(--ft-primary); }
	}

	/* ── Grid layout ── */
	.hero-inner {
		position: relative;
		z-index: 4;
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
		/* Account for fixed nav: 5rem layout padding absorbed + ~5.5rem nav height */
		padding: 7rem 0 1.5rem;
		color: white;
	}

	@media (min-width: 768px) {
		.hero-copy { padding: 8rem 0 2rem; }
	}

	@media (min-width: 1024px) {
		.hero-copy { padding: 8.5rem 4rem 6rem 0; }
	}

	/* ── Brand trust bar ── */
	.brand-bar {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	@media (min-width: 640px) {
		.brand-bar { gap: 0.625rem; margin-bottom: 1.5rem; }
	}

	.brand-name {
		font-family: var(--font-heading);
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.35);
	}

	@media (min-width: 640px) {
		.brand-name { font-size: 0.7rem; letter-spacing: 0.15em; }
	}

	.brand-pipe {
		color: rgba(255, 255, 255, 0.1);
		font-size: 0.65rem;
		font-weight: 300;
	}

	/* ── Title accent bar ── */
	.title-accent-bar {
		width: 2.5rem;
		height: 3px;
		background: var(--ft-primary);
		margin-bottom: 1rem;
	}

	@media (min-width: 640px) {
		.title-accent-bar { width: 3rem; margin-bottom: 1.25rem; }
	}

	/* ── Title — BIG, angular, industrial ── */
	.hero-title {
		margin-bottom: 1rem;
		line-height: 0.9;
		font-family: var(--font-heading);
	}

	@media (min-width: 640px) {
		.hero-title { margin-bottom: 1.5rem; }
	}

	.hero-title-line {
		display: block;
		font-size: clamp(2.5rem, 8vw, 6rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: white;
		text-transform: uppercase;
	}

	.hero-title-accent {
		display: block;
		font-size: clamp(2.5rem, 8vw, 6rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--ft-primary, #378A92);
		text-transform: uppercase;
		margin-left: 0.1em;
	}

	/* ── Horizontal rule ── */
	.hero-rule {
		width: 3rem;
		height: 1px;
		background: linear-gradient(90deg, var(--ft-primary), transparent);
		margin-bottom: 1rem;
	}

	@media (min-width: 640px) {
		.hero-rule { width: 4rem; margin-bottom: 1.5rem; }
	}

	/* ── Subtitle ── */
	.hero-subtitle {
		font-size: 1rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.4);
		max-width: 28rem;
		margin-bottom: 1.75rem;
	}

	@media (min-width: 640px) {
		.hero-subtitle { font-size: 1.125rem; line-height: 1.7; margin-bottom: 2.5rem; }
	}

	/* ── Actions — full-width on mobile ── */
	.hero-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.hero-actions :global(a),
	.hero-actions :global(button) {
		width: 100%;
	}

	@media (min-width: 480px) {
		.hero-actions {
			flex-direction: row;
			gap: 1rem;
			margin-bottom: 3rem;
		}

		.hero-actions :global(a),
		.hero-actions :global(button) {
			width: auto;
		}
	}

	/* ── Stats — industrial spec sheet ── */
	.hero-stats {
		display: flex;
	}

	.stat-cell {
		display: flex;
		flex-direction: column;
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-right: none;
		position: relative;
		flex: 1;
	}

	@media (min-width: 640px) {
		.stat-cell { padding: 1rem 1.5rem; flex: none; }
	}

	.stat-cell:last-child {
		border-right: 1px solid rgba(255, 255, 255, 0.07);
	}

	.stat-cell::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--ft-primary);
		opacity: 0.4;
	}

	.stat-value {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: white;
	}

	@media (min-width: 640px) {
		.stat-value { font-size: 1.5rem; }
	}

	.stat-label {
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.3);
		margin-top: 0.125rem;
	}

	@media (min-width: 640px) {
		.stat-label { font-size: 0.65rem; margin-top: 0.25rem; }
	}

	/* ── Right: Product ── */
	.hero-product {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 0 1.5rem;
	}

	@media (min-width: 640px) {
		.hero-product { padding: 1.5rem 0 2rem; }
	}

	@media (min-width: 1024px) {
		.hero-product { padding: 2rem 0 2rem 1rem; }
	}

	.product-stage {
		position: relative;
		width: 100%;
		max-width: 34rem;
	}

	/* Radial glow behind product */
	.product-backdrop {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 85%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(55, 138, 146, 0.08) 0%, transparent 70%);
		z-index: 0;
	}

	.product-card {
		position: relative;
		z-index: 1;
		display: block;
		text-decoration: none;
		color: inherit;
		background-color: white;
		border: 1px solid rgba(255, 255, 255, 0.1);
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.4s ease, box-shadow 0.4s ease;
	}

	.product-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);
	}

	/* Teal accent bar at top of card */
	.product-card-accent {
		height: 3px;
		background: linear-gradient(90deg, var(--ft-primary), var(--color-accent-500, #14b8a6));
	}

	.product-img {
		width: 100%;
		height: 14rem;
		object-fit: contain;
		padding: 0;
	}

	@media (min-width: 640px) {
		.product-img { height: 20rem; }
	}

	@media (min-width: 1024px) {
		.product-img { height: 26rem; }
	}

	.product-meta {
		padding: 1.25rem;
		background-color: white;
	}

	@media (min-width: 640px) {
		.product-meta { padding: 1.5rem; }
	}

	.product-badge {
		display: inline-block;
		font-family: var(--font-heading);
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		background-color: var(--ft-primary, #378A92);
		color: white;
		padding: 0.25rem 0.75rem;
		margin-bottom: 0.5rem;
	}

	.product-name {
		font-family: var(--font-heading);
		font-size: 1rem;
		font-weight: 600;
		color: var(--ft-text, #0f172a);
		line-height: 1.3;
		margin-bottom: 0.375rem;
	}

	@media (min-width: 640px) {
		.product-name { font-size: 1.1rem; margin-bottom: 0.5rem; }
	}

	.product-price-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.product-price {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--ft-primary, #378A92);
		font-variant-numeric: tabular-nums;
	}

	@media (min-width: 640px) {
		.product-price { font-size: 1.5rem; }
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
		font-family: var(--font-heading);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ft-primary, #378A92);
		transition: gap 0.3s;
		cursor: pointer;
	}

	.product-cta:hover { gap: 0.75rem; }

	.cta-arrow { transition: transform 0.3s; }
	.product-cta:hover .cta-arrow { transform: translateX(3px); }
</style>
