<script lang="ts">
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

<section class="featured">
	<div class="featured-inner">
		<div class="featured-header">
			<h4 class="featured-label">Polecane</h4>
			<h2 class="featured-title">Wybrane Produkty</h2>
		</div>

		{#if error}
			<div class="featured-empty">
				<p>{error}</p>
				<a href="/products" class="featured-link">Spróbuj ponownie →</a>
			</div>
		{:else if items.length > 0}
			<div class="grid">
				{#each items as product, i (product.id)}
					<a
						href="/products/{product.slug || product.id}"
						class="card ft-card ft-animate"
						style="animation-delay: {i * 40}ms"
					>
						<div class="card-img">
							{#if product.mainImage}
								<img src={product.mainImage} alt={product.name} loading="lazy" />
							{:else}
								<div class="card-img-placeholder">
									<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
										<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
									</svg>
								</div>
							{/if}

							{#if product.compareAtPrice && product.compareAtPrice > product.price}
								<span class="card-sale">
									-{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
								</span>
							{/if}
						</div>

						<div class="card-body">
							<h3 class="card-name">{product.name}</h3>
							<div class="card-footer">
								<div class="card-prices">
									<span class="card-price">{product.price.toFixed(2)} zł</span>
									{#if product.compareAtPrice && product.compareAtPrice > product.price}
										<span class="card-old-price">{product.compareAtPrice.toFixed(2)} zł</span>
									{/if}
								</div>
								<button
									class="card-cart"
									onclick={(e) => { e.stopPropagation(); e.preventDefault(); addToCart(product); }}
									aria-label="Dodaj do koszyka"
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
									</svg>
								</button>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<div class="featured-cta">
				<a href="/products" class="see-all">
					Wszystkie Produkty
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
				</a>
			</div>
		{:else}
			<div class="featured-empty">
				<p>Przygotowujemy kolekcję produktów.</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.featured {
		padding: 64px 0 80px;
	}

	.featured-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
	}

	/* ── Header ── */
	.featured-header {
		margin-bottom: 40px;
	}

	.featured-label {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ft-accent);
		margin-bottom: 8px;
	}

	.featured-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
	}

	/* ── Grid ── */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 16px;
	}

	/* ── Card ── */
	.card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
		overflow: hidden;
	}

	.card-img {
		position: relative;
		background: #ffffff;
		border-radius: var(--radius-md) var(--radius-md) 0 0;
		padding: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}

	.card-img img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		transition: transform 0.4s var(--ease-out);
	}

	.card:hover .card-img img {
		transform: scale(1.04);
	}

	.card-img-placeholder {
		color: var(--ft-text-faint);
	}

	.card-sale {
		position: absolute;
		top: 12px;
		left: 12px;
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: white;
		background: var(--color-danger);
		padding: 3px 8px;
		border-radius: var(--radius-full);
	}

	/* ── Card body ── */
	.card-body {
		padding: 16px 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}

	.card-name {
		font-family: var(--font-sans);
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--ft-dark);
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color var(--dur-fast) ease;
	}

	.card:hover .card-name {
		color: var(--ft-accent);
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
	}

	.card-prices {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}

	.card-price {
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--ft-dark);
		font-variant-numeric: tabular-nums;
	}

	.card-old-price {
		font-size: 0.78rem;
		color: var(--ft-text-muted);
		text-decoration: line-through;
	}

	.card-cart {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--ft-line);
		background: transparent;
		color: var(--ft-text-muted);
		cursor: pointer;
		transition: all var(--dur-fast) ease;
	}

	.card-cart:hover {
		border-color: var(--ft-accent);
		background: var(--ft-accent);
		color: white;
	}

	/* ── CTA ── */
	.featured-cta {
		text-align: center;
		margin-top: 48px;
	}

	.see-all {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
		padding: 12px 24px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		transition: all var(--dur-fast) ease;
	}

	.see-all:hover {
		border-color: var(--ft-accent);
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	/* ── Empty ── */
	.featured-empty {
		text-align: center;
		padding: 64px 0;
		color: var(--ft-text-muted);
	}

	.featured-link {
		display: inline-block;
		margin-top: 16px;
		color: var(--ft-accent);
		font-weight: 600;
		font-size: 0.85rem;
	}
</style>
