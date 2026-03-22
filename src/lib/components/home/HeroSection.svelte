<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		featuredProduct?: Product;
		totalProducts?: number;
	}

	let { featuredProduct, totalProducts = 0 }: Props = $props();

	const brands = ['Bavaria', 'Magnum', 'Eurotec', 'Sterling'] as const;
</script>

<section class="hero">
	<!-- Background layers -->
	<div class="hero-grid"></div>
	<div class="hero-noise"></div>

	<!-- Accent panel — right side -->
	<div class="hero-accent"></div>
	<div class="hero-glow"></div>

	<div class="hero-inner">
		<!-- Left: Bold copy -->
		<div class="hero-copy">
			<!-- Brand trust bar -->
			<div class="brand-bar">
				<span class="brand-line"></span>
				{#each brands as brand, i (brand)}
					{#if i > 0}<span class="brand-sep">·</span>{/if}
					<span class="brand-name">{brand}</span>
				{/each}
			</div>

			<h1 class="hero-title">
				<span class="hero-title-line">Narzędzia</span>
				<span class="hero-title-accent">Naty i Seby</span>
			</h1>

			<p class="hero-subtitle">
				Szlifierki, wiertarki, młotowiertarki, piły i więcej.<br class="hidden sm:block" />
				Profesjonalne elektronarzędzia w&nbsp;konkurencyjnych cenach.
			</p>

			<div class="hero-actions">
				<Button href="/products" size="lg">Przeglądaj Produkty</Button>
				<Button href="/contact" variant="glass" size="lg">Kontakt</Button>
			</div>

			<!-- Stats -->
			<div class="hero-stats">
				<div class="stat-cell">
					<span class="stat-value">{totalProducts}+</span>
					<span class="stat-label">Produktów</span>
				</div>
				<div class="stat-cell">
					<span class="stat-value">4</span>
					<span class="stat-label">Marki</span>
				</div>
				<div class="stat-cell">
					<span class="stat-value">24h</span>
					<span class="stat-label">Wysyłka</span>
				</div>
			</div>
		</div>

		<!-- Right: Product showcase -->
		<div class="hero-product">
			{#if featuredProduct}
				<a href="/products/{featuredProduct.slug || featuredProduct.id}" class="product-showcase">
					<div class="showcase-image-wrap">
						<!-- Glow behind product -->
						<div class="product-glow"></div>
						{#if featuredProduct.mainImage}
							<img
								src={featuredProduct.mainImage}
								alt={featuredProduct.name}
								class="showcase-img"
							/>
						{:else}
							<img src="/img/chainsaw-hero.png" alt="Profesjonalna pilarka" class="showcase-img" />
						{/if}
					</div>

					<div class="showcase-info">
						<span class="showcase-badge">★ Polecany</span>
						<h2 class="showcase-name">{featuredProduct.name}</h2>
						<div class="showcase-price-row">
							<span class="showcase-price">{featuredProduct.price.toFixed(2)} zł</span>
							{#if featuredProduct.compareAtPrice && featuredProduct.compareAtPrice > featuredProduct.price}
								<span class="showcase-old-price"
									>{featuredProduct.compareAtPrice.toFixed(2)} zł</span
								>
							{/if}
						</div>
						<span class="showcase-cta">
							Zobacz Produkt
							<svg class="cta-chevron" width="18" height="18" viewBox="0 0 20 20" fill="none">
								<path
									d="M7 4l6 6-6 6"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					</div>
				</a>
			{:else}
				<a href="/products" class="product-showcase">
					<div class="showcase-image-wrap">
						<div class="product-glow"></div>
						<img src="/img/chainsaw-hero.png" alt="Profesjonalne narzędzia" class="showcase-img" />
					</div>
					<div class="showcase-info">
						<h2 class="showcase-name">Profesjonalne Narzędzia</h2>
						<span class="showcase-cta">
							Przeglądaj Produkty
							<svg class="cta-chevron" width="18" height="18" viewBox="0 0 20 20" fill="none">
								<path
									d="M7 4l6 6-6 6"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					</div>
				</a>
			{/if}
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="scroll-indicator">
		<div class="scroll-line"></div>
	</div>
</section>

<style>
	/* ══════════════════════════════════════
	   HERO — “Precision Workshop”
	   Immersive dark canvas with blueprint grid,
	   atmospheric lighting, product drama.
	   ══════════════════════════════════════ */

	.hero {
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: stretch;
		background: var(--ft-surface);
		overflow: hidden;
		margin-top: -5rem;
	}

	@media (min-width: 768px) {
		.hero {
			margin-top: -6rem;
		}
	}

	/* Blueprint grid — engineering precision texture */
	.hero-grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-image:
			linear-gradient(var(--ft-grid-line) 1px, transparent 1px),
			linear-gradient(90deg, var(--ft-grid-line) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 70% at 60% 50%, black 20%, transparent 75%);
		-webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 50%, black 20%, transparent 75%);
		pointer-events: none;
	}

	/* Noise grain texture */
	.hero-noise {
		position: absolute;
		inset: 0;
		opacity: 0.025;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 256px 256px;
		z-index: 1;
		pointer-events: none;
	}

	/* Atmospheric glow — ambient teal light */
	.hero-glow {
		position: absolute;
		z-index: 0;
		top: 25%;
		right: 12%;
		width: 40vw;
		height: 40vw;
		background: radial-gradient(circle, var(--ft-brand-glow) 0%, transparent 70%);
		pointer-events: none;
		animation: glow-drift 8s ease-in-out infinite;
	}

	@keyframes glow-drift {
		0%, 100% {
			opacity: 0.6;
			transform: translate(0, 0) scale(1);
		}
		50% {
			opacity: 1;
			transform: translate(-2%, 3%) scale(1.06);
		}
	}

	/* ── Accent panel — right side ── */
	.hero-accent {
		position: absolute;
		top: 0;
		right: 0;
		width: 55%;
		height: 100%;
		background: linear-gradient(160deg, var(--ft-brand-muted) 0%, var(--ft-brand-subtle) 40%, transparent 100%);
		clip-path: polygon(18% 0, 100% 0, 100% 100%, 0% 100%);
		z-index: 0;
	}

	/* Subtle diagonal lines */
	.hero-accent::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 20px,
			var(--ft-brand-subtle) 20px,
			var(--ft-brand-subtle) 21px
		);
	}

	/* Soft edge glow */
	.hero-accent::after {
		content: '';
		position: absolute;
		top: 0;
		left: -4rem;
		width: 4rem;
		height: 100%;
		background: linear-gradient(90deg, transparent, var(--ft-brand-muted));
		pointer-events: none;
	}

	@media (max-width: 1023px) {
		.hero-accent {
			width: 100%;
			height: 50%;
			bottom: 0;
			top: auto;
			clip-path: polygon(0 20%, 100% 0, 100% 100%, 0% 100%);
		}
	}

	/* ── Grid layout ── */
	.hero-inner {
		position: relative;
		z-index: 4;
		display: grid;
		grid-template-columns: 1fr;
		width: 100%;
		/* match navbar container (screen-2xl ~1536px) so the right column aligns */
		max-width: 1536px;
		margin: 0 auto;
		/* horizontal pads mimic nav: px-6 sm:px-8 lg:px-12 */
		padding: 0 1.5rem;
	}

	@media (min-width: 640px) {
		.hero-inner {
			/* sm:px-8 = 2rem */
			padding: 0 2rem;
		}
	}

	@media (min-width: 1024px) {
		.hero-inner {
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
			padding: 0 3rem;
			align-items: center;
			min-height: 100vh;
			min-height: 100dvh;
		}
	}

	@media (min-width: 1280px) {
		.hero-inner {
			gap: 4rem;
		}
	}

	/* ── Left copy column ── */
	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 8rem 0 2rem;
		color: var(--ft-text);
		position: relative;
		z-index: 2;
	}

	@media (min-width: 768px) {
		.hero-copy {
			padding: 9rem 0 2.5rem;
		}
	}

	@media (min-width: 1024px) {
		.hero-copy {
			padding: 7rem 0 5rem;
			max-width: 34rem;
		}
	}

	/* ── Brand trust bar ── */
	.brand-bar {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.brand-line {
		width: 2rem;
		height: 1.5px;
		background: var(--color-brand-500);
		flex-shrink: 0;
		opacity: 0.6;
	}

	.brand-name {
		font-family: var(--font-heading);
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--ft-text-faint);
		transition: color 0.3s;
		white-space: nowrap;
	}

	.brand-name:hover {
		color: var(--ft-text-secondary);
	}

	.brand-sep {
		color: var(--ft-border);
		font-size: 0.5rem;
		user-select: none;
	}

	/* ── Title ── */
	.hero-title {
		margin-bottom: 1.75rem;
		line-height: 0.88;
		font-family: var(--font-heading);
	}

	.hero-title-line {
		display: block;
		font-size: clamp(3.25rem, 8vw, 6rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--ft-text);
		text-transform: uppercase;
	}

	.hero-title-accent {
		display: block;
		font-size: clamp(3.25rem, 8vw, 6rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--color-brand-500, #378a92);
		text-transform: uppercase;
	}

	/* ── Subtitle ── */
	.hero-subtitle {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--ft-text-muted);
		max-width: 24rem;
		margin-bottom: 2.5rem;
	}

	@media (min-width: 640px) {
		.hero-subtitle {
			font-size: 1.1rem;
			margin-bottom: 3rem;
		}
	}

	/* ── Actions ── */
	.hero-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 3.5rem;
	}

	.hero-actions :global(a),
	.hero-actions :global(button) {
		width: 100%;
	}

	@media (min-width: 480px) {
		.hero-actions {
			flex-direction: row;
			gap: 1rem;
		}

		.hero-actions :global(a),
		.hero-actions :global(button) {
			width: auto;
		}
	}

	/* ── Stats ── */
	.hero-stats {
		display: flex;
		gap: 0;
	}

	.stat-cell {
		display: flex;
		flex-direction: column;
		padding: 0.75rem 1rem;
		border: 1px solid var(--ft-border-subtle);
		border-right: none;
		flex: 1;
	}

	@media (min-width: 640px) {
		.stat-cell {
			padding: 1rem 1.5rem;
			flex: none;
		}
	}

	.stat-cell:last-child {
		border-right: 1px solid var(--ft-border-subtle);
	}

	.stat-value {
		font-family: var(--font-heading);
		font-size: 1.375rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--ft-text);
		letter-spacing: -0.02em;
	}

	@media (min-width: 640px) {
		.stat-value {
			font-size: 1.625rem;
		}
	}

	.stat-label {
		font-size: 0.575rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ft-text-faint);
		margin-top: 0.125rem;
	}

	/* ── Product showcase ── */
	.hero-product {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem 0 4rem;
		overflow: visible;
	}

	@media (min-width: 1024px) {
		.hero-product {
			padding: 7rem 0 5rem;
			justify-content: flex-end;
		}
	}

	/* ── Product link wrapper ── */
	.product-showcase {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		width: 100%;
		max-width: 26rem;
	}

	@media (min-width: 1024px) {
		.product-showcase {
			max-width: 30rem;
		}
	}

	/* ── Image container ── */
	.showcase-image-wrap {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		/* allow the inner image to overflow over left column */
		overflow: visible;
	}

	@media (min-width: 1024px) {
		.showcase-image-wrap {
			/* moderate overflow so image overlaps left column but doesn't escape container */
			width: 115%;
			margin-left: -7.5%;
		}
	}

	/* Ambient teal glow behind product */
	.product-glow {
		position: absolute;
		width: 65%;
		aspect-ratio: 1;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			var(--ft-brand-glow) 0%,
			var(--ft-grid-line-subtle) 50%,
			transparent 70%
		);
		pointer-events: none;
		animation: glow-pulse 6s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%,
		100% {
			opacity: 0.7;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.08);
		}
	}

	/* ── Product image ── */
	.showcase-img {
		position: relative;
		z-index: 10;
		width: 100%;
		height: auto;
		max-height: 22rem;
		object-fit: contain;
		filter: drop-shadow(0 20px 40px var(--ft-shadow-heavy)) drop-shadow(0 6px 12px var(--ft-shadow));
		transition:
			transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
			filter 0.5s ease;
	}

	@media (min-width: 1024px) {
		.showcase-img {
			width: 110%; /* enlarge image */
			max-height: none;
		}
	}

	@media (min-width: 640px) {
		.showcase-img {
			max-height: 28rem;
		}
	}

	@media (min-width: 1024px) {
		.showcase-img {
			max-height: 34rem;
		}
	}

	@media (min-width: 1280px) {
		.showcase-img {
			max-height: 38rem;
		}
	}

	.product-showcase:hover .showcase-img {
		transform: scale(1.03) translateY(-8px);
		filter: drop-shadow(0 28px 50px var(--ft-brand-light))
			drop-shadow(0 10px 20px var(--ft-shadow-heavy));
	}

	/* ── Info panel — overlaps image bottom ── */
	.showcase-info {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 100%;
		padding: 1.5rem 2rem;
		margin-top: -2rem;
		transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
	}

	@media (min-width: 1024px) {
		.showcase-info {
			margin-top: -3rem;
			padding: 1.75rem 2.5rem;
		}
	}

	/* Glass panel */
	.showcase-info::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--ft-card);
		border: 1px solid var(--ft-border-subtle);
		border-radius: 0.25rem;
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		z-index: -1;
	}

	.product-showcase:hover .showcase-info {
		transform: translateY(-4px);
	}

	/* ── Badge ── */
	.showcase-badge {
		display: inline-block;
		font-family: var(--font-heading);
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: white;
		padding: 0.2rem 0.7rem;
		border-radius: 0;
		margin-bottom: 0.5rem;
		background: var(--color-brand-600);
	}

	/* ── Product name ── */
	.showcase-name {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--ft-text);
		line-height: 1.3;
		margin-bottom: 0.5rem;
	}

	@media (min-width: 640px) {
		.showcase-name {
			font-size: 1.3rem;
		}
	}

	/* ── Price ── */
	.showcase-price-row {
		display: flex;
		align-items: baseline;
		gap: 0.625rem;
		margin-bottom: 1rem;
	}

	.showcase-price {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--ft-text);
		font-variant-numeric: tabular-nums;
	}

	@media (min-width: 640px) {
		.showcase-price {
			font-size: 2rem;
		}
	}

	.showcase-old-price {
		font-size: 0.9rem;
		color: var(--ft-text-muted);
		text-decoration: line-through;
		font-variant-numeric: tabular-nums;
	}

	/* ── CTA ── */
	.showcase-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-family: var(--font-heading);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
		transition: all 0.3s ease;
		padding: 0.4rem 1rem;
		border: 1px solid var(--ft-border);
		border-radius: 0;
	}

	.product-showcase:hover .showcase-cta {
		color: var(--ft-text);
		border-color: var(--color-brand-500, #378a92);
		background: var(--ft-brand-muted);
		gap: 0.5rem;
	}

	.cta-chevron {
		width: 14px;
		height: 14px;
		transition: transform 0.3s ease;
	}

	.product-showcase:hover .cta-chevron {
		transform: translateX(3px);
	}

	/* ── Scroll indicator ── */
	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		display: none;
	}

	@media (min-width: 768px) {
		.scroll-indicator {
			display: block;
		}
	}

	.scroll-line {
		width: 1px;
		height: 3rem;
		background: linear-gradient(to bottom, var(--ft-primary), transparent);
		animation: scroll-pulse 2s ease-in-out infinite;
	}

	@keyframes scroll-pulse {
		0%, 100% {
			opacity: 0.3;
			transform: scaleY(1);
		}
		50% {
			opacity: 0.7;
			transform: scaleY(1.15);
			transform-origin: top;
		}
	}
</style>
