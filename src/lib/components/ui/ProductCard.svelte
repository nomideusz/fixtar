<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import { cart, notifications } from '$lib/stores';

	interface Props {
		product: Product;
		onQuickView?: (product: Product) => void;
	}

	let { product, onQuickView }: Props = $props();

	function isInStock(p: Product): boolean {
		if (!p.inventory?.trackQuantity) return true;
		return p.inventory.quantity > 0;
	}

	function addToCart(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!inStock) return;
		cart.addItem({
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.mainImage || undefined
		});
		notifications.success(`Dodano ${product.name} do koszyka`);
	}

	const mainImageUrl = $derived(product.mainImage || '');
	const inStock = $derived(isInStock(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0
	);
	const productUrl = $derived(`/products/${product.slug?.trim() || product.id}`);
</script>

<a href={productUrl} class="product-card" class:is-out={!inStock}>
	<div class="card-img">
		{#if mainImageUrl}
			<img src={mainImageUrl} alt={product.name} class="card-img-el" loading="lazy" width="320" height="240" />
		{:else}
			<div class="card-img-placeholder">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
					<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
				</svg>
			</div>
		{/if}

		<!-- Discount badge -->
		{#if hasDiscount}
			<span class="badge badge--sale">-{discountPercent}%</span>
		{/if}

		{#if !inStock}
			<span class="badge badge--out">Wyprzedane</span>
		{/if}
	</div>

	<div class="card-body">
		<h3 class="card-name">{product.name}</h3>

		<div class="card-bottom">
			<div class="card-prices">
				<span class="card-price">{product.price.toFixed(2)} zł</span>
				{#if hasDiscount}
					<span class="card-old-price">{product.compareAtPrice?.toFixed(2)} zł</span>
				{/if}
			</div>

			{#if inStock}
				<span class="card-stock">Dostępny</span>
			{/if}
		</div>

		<!-- Mobile: always show add to cart -->
		<button class="cart-btn" onclick={addToCart} disabled={!inStock} aria-label="Dodaj do koszyka">
			{#if inStock}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
				</svg>
				Dodaj do koszyka
			{:else}
				Wyprzedane
			{/if}
		</button>
	</div>
</a>

<style>
	.product-card {
		display: flex;
		flex-direction: column;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
	}

	.product-card:hover {
		border-color: var(--ft-cta);
		box-shadow: 0 8px 28px rgba(1, 71, 131, 0.08);
		transform: translateY(-2px);
	}

	.product-card.is-out {
		opacity: 0.65;
	}

	/* ── Image ── */
	.card-img {
		position: relative;
		aspect-ratio: 4 / 3;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.card-img-el {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 16px;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.product-card:hover .card-img-el {
		transform: scale(1.04);
	}

	.card-img-placeholder {
		color: var(--ft-text-faint);
	}

	/* ── Badges ── */
	.badge {
		position: absolute;
		top: 10px;
		left: 10px;
		font-family: var(--font-display);
		font-size: 0.68rem;
		font-weight: 700;
		padding: 4px 10px;
		border-radius: var(--radius-sm);
		z-index: 2;
	}

	.badge--sale {
		background: var(--color-danger);
		color: white;
	}

	.badge--out {
		background: var(--ft-text-faint);
		color: white;
		top: auto;
		bottom: 10px;
	}

	/* ── Body ── */
	.card-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 14px 16px 16px;
	}

	.card-name {
		font-family: var(--font-sans);
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--ft-dark);
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 10px;
		transition: color 0.15s ease;
	}

	.product-card:hover .card-name {
		color: var(--ft-cta);
	}

	.card-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-top: auto;
	}

	.card-prices {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}

	.card-price {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--ft-cta);
		font-variant-numeric: tabular-nums;
	}

	.card-old-price {
		font-size: 0.78rem;
		color: var(--ft-text-muted);
		text-decoration: line-through;
	}

	.card-stock {
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--color-success);
		white-space: nowrap;
	}

	/* ── Cart button ── */
	.cart-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		min-height: 44px;
		margin-top: 12px;
		padding: 10px 16px;
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: var(--ft-cta);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.cart-btn:hover:not(:disabled) {
		background: var(--ft-cta-hover);
	}

	.cart-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Desktop: hide always-visible cart, only show on hover */
	@media (min-width: 768px) {
		.cart-btn {
			opacity: 0;
			transform: translateY(4px);
			transition: opacity 0.2s ease, transform 0.2s ease, background 0.15s ease;
		}

		.product-card:hover .cart-btn {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
