<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import { cart, notifications } from '$lib/stores';

	interface Props {
		product: Product;
		onQuickView?: (product: Product) => void;
	}

	let { product, onQuickView }: Props = $props();

	function isInStock(product: Product): boolean {
		if (!product.inventory?.trackQuantity) return true;
		return product.inventory.quantity > 0;
	}

	function getStockStatus(product: Product): string {
		if (!product.inventory?.trackQuantity) return 'Dostępny';
		const quantity = product.inventory.quantity;
		const lowThreshold = product.inventory.lowStockThreshold || 10;
		if (quantity === 0) return 'Wyprzedany';
		if (quantity <= lowThreshold) return `Mało sztuk (${quantity})`;
		return 'Dostępny';
	}

	function addToCart() {
		if (!isInStock(product)) return;
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
	const stockStatus = $derived(getStockStatus(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0
	);
	const productUrl = $derived(`/products/${product.slug?.trim() || product.id}`);
</script>

<div class="product-card">
	<a href={productUrl} class="card-link">
		<div class="card-img">
			{#if mainImageUrl}
				<img src={mainImageUrl} alt={product.name} class="card-img-el" loading="lazy" />
			{:else}
				<div class="card-img-placeholder">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
					</svg>
				</div>
			{/if}

			<!-- Badges -->
			<div class="card-badges">
				{#if product.featured}
					<span class="badge badge--warm">Polecany</span>
				{/if}
				{#if hasDiscount}
					<span class="badge badge--sale">-{discountPercent}%</span>
				{/if}
				{#if !inStock}
					<span class="badge badge--out">Wyprzedane</span>
				{/if}
			</div>
		</div>
	</a>

	<div class="card-body">
		<a href={productUrl}>
			<h3 class="card-name">{product.name}</h3>
		</a>

		<div class="card-footer">
			<div class="card-prices">
				<span class="card-price">{product.price.toFixed(2)} zł</span>
				{#if hasDiscount}
					<span class="card-old-price">{product.compareAtPrice?.toFixed(2)} zł</span>
				{/if}
			</div>
			<span class="card-stock" class:in-stock={inStock} class:out-of-stock={!inStock}>
				{stockStatus}
			</span>
		</div>

		<div class="card-actions">
			<button class="cart-btn" onclick={addToCart} disabled={!inStock}>
				{inStock ? 'Dodaj do koszyka' : 'Wyprzedane'}
			</button>
		</div>
	</div>
</div>

<style>
	.product-card {
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md, 10px);
		overflow: hidden;
		transition: border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.product-card:hover {
		border-color: var(--ft-accent);
		box-shadow: var(--ft-shadow-md);
	}

	.card-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}

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

	/* Badges */
	.card-badges {
		position: absolute;
		top: 10px;
		left: 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.badge {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 3px 8px;
		border-radius: var(--radius-full);
	}

	.badge--warm {
		background: var(--ft-warm-bg);
		color: var(--ft-warm);
		border: 1px solid var(--ft-warm);
	}

	.badge--sale {
		background: var(--color-danger);
		color: white;
	}

	.badge--out {
		background: var(--ft-text-faint);
		color: white;
	}

	/* Body */
	.card-body {
		padding: 16px;
	}

	.card-name {
		font-family: var(--font-sans);
		font-size: 0.9rem;
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
		color: var(--ft-accent);
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
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

	.card-stock {
		font-size: 0.68rem;
		font-weight: 600;
	}

	.card-stock.in-stock { color: var(--color-success); }
	.card-stock.out-of-stock { color: var(--color-danger); }

	/* Actions */
	.card-actions {
		display: flex;
		gap: 8px;
	}

	.cart-btn {
		flex: 1;
		padding: 10px 16px;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: var(--ft-accent);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.cart-btn:hover:not(:disabled) {
		background: var(--ft-accent-hover);
	}

	.cart-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
