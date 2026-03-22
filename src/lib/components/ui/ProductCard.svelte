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

	function getStockInfo(product: Product): { label: string; type: 'in' | 'low' | 'out' } {
		if (!product.inventory?.trackQuantity) return { label: 'Dostępny', type: 'in' };
		const quantity = product.inventory.quantity;
		const lowThreshold = product.inventory.lowStockThreshold || 10;
		if (quantity === 0) return { label: 'Wyprzedany', type: 'out' };
		if (quantity <= lowThreshold) return { label: `Ostatnie ${quantity} szt.`, type: 'low' };
		return { label: 'Dostępny', type: 'in' };
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

	function handleQuickView(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		onQuickView?.(product);
	}

	const mainImageUrl = $derived(product.mainImage || '');
	const inStock = $derived(isInStock(product));
	const stock = $derived(getStockInfo(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0
	);
	const productUrl = $derived(`/products/${product.slug?.trim() || product.id}`);
	const categoryName = $derived(product.expand?.categories?.[0]?.name || product.categories?.[0] || '');
</script>

<div class="product-card">
	<a href={productUrl} class="card-link">
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

			<!-- Badges -->
			<div class="card-badges">
				{#if hasDiscount}
					<span class="badge badge--sale">-{discountPercent}%</span>
				{/if}
				{#if product.featured}
					<span class="badge badge--warm">Polecany</span>
				{/if}
				{#if !inStock}
					<span class="badge badge--out">Wyprzedane</span>
				{/if}
			</div>

			<!-- Stock indicator dot (top-right) -->
			<div class="stock-dot stock-dot--{stock.type}" title={stock.label}></div>

			<!-- Hover overlay with actions -->
			{#if inStock}
				<div class="card-hover-overlay">
					<button class="hover-cart-btn" onclick={addToCart} aria-label="Dodaj do koszyka">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
						</svg>
						Dodaj do koszyka
					</button>
					{#if onQuickView}
						<button class="hover-quick-btn" onclick={handleQuickView} aria-label="Szybki podgląd">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
							</svg>
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</a>

	<div class="card-body">
		{#if categoryName}
			<span class="card-category">{categoryName}</span>
		{/if}
		<a href={productUrl} class="card-name-link">
			<h3 class="card-name">{product.name}</h3>
		</a>

		<div class="card-footer">
			<div class="card-prices">
				<span class="card-price">{product.price.toFixed(2)} zł</span>
				{#if hasDiscount}
					<span class="card-old-price">{product.compareAtPrice?.toFixed(2)} zł</span>
				{/if}
			</div>
			<span class="card-stock card-stock--{stock.type}">
				{#if stock.type === 'in'}
					<span class="stock-indicator"></span>
				{:else if stock.type === 'low'}
					<span class="stock-indicator stock-indicator--low"></span>
				{/if}
				{stock.label}
			</span>
		</div>

		<!-- Mobile: always show add to cart -->
		<div class="card-actions-mobile">
			<button class="cart-btn" onclick={addToCart} disabled={!inStock}>
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
	</div>
</div>

<style>
	.product-card {
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md, 10px);
		overflow: hidden;
		transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
	}

	.product-card:hover {
		border-color: var(--ft-accent);
		box-shadow: var(--ft-shadow-md);
		transform: translateY(-2px);
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

	/* ── Stock dot indicator ── */
	.stock-dot {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 2px solid var(--ft-surface);
		z-index: 2;
	}

	.stock-dot--in { background: var(--color-success); }
	.stock-dot--low { background: #f59e0b; }
	.stock-dot--out { background: var(--color-danger); }

	/* ── Badges ── */
	.card-badges {
		position: absolute;
		top: 10px;
		left: 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		z-index: 2;
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

	/* ── Hover overlay (desktop) ── */
	.card-hover-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.03));
		opacity: 0;
		transform: translateY(8px);
		transition: all 0.25s ease;
		z-index: 3;
	}

	.product-card:hover .card-hover-overlay {
		opacity: 1;
		transform: translateY(0);
	}

	.hover-cart-btn {
		flex: 1;
		display: none;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 40px;
		padding: 8px 14px;
		font-size: 0.7rem;
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

	.hover-cart-btn:hover {
		background: var(--ft-accent-hover);
	}

	.hover-quick-btn {
		display: none;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--ft-surface);
		color: var(--ft-text-muted);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s ease;
		flex-shrink: 0;
	}

	.hover-quick-btn:hover {
		color: var(--ft-accent);
		border-color: var(--ft-accent);
	}

	@media (min-width: 768px) {
		.hover-cart-btn { display: inline-flex; }
		.hover-quick-btn { display: inline-flex; }
	}

	/* ── Body ── */
	.card-body {
		padding: 14px 16px 16px;
	}

	.card-category {
		display: block;
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ft-text-faint);
		margin-bottom: 4px;
	}

	.card-name-link {
		text-decoration: none;
		color: inherit;
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
		color: var(--ft-accent);
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
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

	/* ── Stock label with indicator ── */
	.card-stock {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.65rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.card-stock--in { color: var(--color-success); }
	.card-stock--low { color: #d97706; }
	.card-stock--out { color: var(--color-danger); }

	.stock-indicator {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-success);
		flex-shrink: 0;
	}

	.stock-indicator--low {
		background: #f59e0b;
	}

	/* ── Mobile actions (always visible) ── */
	.card-actions-mobile {
		margin-top: 12px;
	}

	.cart-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		min-height: 44px;
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

	/* Desktop: hide mobile actions, show hover overlay */
	@media (min-width: 768px) {
		.card-actions-mobile {
			display: none;
		}
	}
</style>
