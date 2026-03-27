<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import type { Snippet } from 'svelte';
	import { cart, notifications } from '$lib/stores';
	import { ImageSquareIcon } from 'phosphor-svelte';

	interface Props {
		product: Product;
		onQuickView?: (product: Product) => void;
		actions?: Snippet;
		showBadges?: boolean;
	}

	let { product, onQuickView, actions, showBadges = false }: Props = $props();

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
	const vtName = $derived(`product-img-${product.id.slice(0, 8)}`);
	const hasActions = $derived(!!actions);
</script>

<div class="card" class:is-out={!inStock} style="--vt-name:{vtName}">
	<!-- Image as link -->
	<a href={productUrl} class="card-img-link" aria-label={product.name}>
		<div class="card-img">
			{#if mainImageUrl}
				<img src={mainImageUrl} alt="" loading="lazy" width="320" height="240" />
			{:else}
				<div class="card-img-empty" aria-hidden="true">
					<ImageSquareIcon size={28} weight="light" aria-hidden="true" />
				</div>
			{/if}

			{#if hasDiscount}
				<span class="discount-tag">-{discountPercent}%</span>
			{/if}

			{#if showBadges && product.featured}
				<span class="featured-tag">Polecany</span>
			{/if}
		</div>
	</a>

	<!-- InfoIcon -->
	<div class="card-info">
		<h3 class="card-name">
			<a href={productUrl} class="card-name-link">{product.name}</a>
		</h3>

		<div class="card-meta">
			{#if inStock}
				<span class="card-availability">✓ Dostępny od ręki</span>
			{:else}
				<span class="card-availability card-availability--out">Niedostępny</span>
			{/if}
		</div>

		<div class="card-price-row">
			<span class="card-price" class:is-discounted={hasDiscount}>{product.price.toFixed(2)}&nbsp;zł</span>
			{#if hasDiscount}
				<span class="card-old-price">{product.compareAtPrice?.toFixed(2)}&nbsp;zł</span>
			{/if}
		</div>

		<!-- Actions slot or default Add to Cart -->
		<div class="card-actions">
			{#if actions}
				{@render actions()}
			{:else}
				<button 
					class="btn-primary card-add-btn" 
					onclick={addToCart} 
					disabled={!inStock}
					aria-label="Dodaj do koszyka"
				>
					DO KOSZYKA
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
		height: 100%;
		padding: 16px;
	}

	.card:hover {
		background: var(--ft-surface);
		border-color: var(--ft-line);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	}

	.card.is-out {
		opacity: 0.55;
	}

	/* ── Image ── */
	.card-img-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.card-img {
		position: relative;
		aspect-ratio: 1;
		background: transparent;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		view-transition-name: var(--vt-name);
		margin-bottom: 12px;
	}

	.card-img img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 12px;
		transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.card:hover .card-img img {
		transform: scale(1.04);
	}

	.card-img-empty {
		color: var(--ft-text-faint);
	}

	.discount-tag {
		position: absolute;
		top: 8px;
		left: 8px;
		font-family: var(--font-display);
		font-size: 0.68rem;
		font-weight: 700;
		padding: 3px 8px;
		background: var(--color-danger);
		color: white;
		border-radius: var(--radius-sm);
	}

	.featured-tag {
		position: absolute;
		top: 8px;
		right: 8px;
		font-family: var(--font-display);
		font-size: 0.68rem;
		font-weight: 700;
		padding: 3px 8px;
		background: var(--ft-accent);
		color: white;
		border-radius: var(--radius-sm);
	}

	/* ── InfoIcon ── */
	.card-info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-name {
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--ft-dark);
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 6px;
	}

	.card-name-link {
		color: inherit;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.card-name-link:hover {
		color: var(--ft-accent);
	}

	.card-meta {
		margin-bottom: 10px;
	}

	.card-availability {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--color-success);
	}

	.card-availability--out {
		color: var(--color-danger);
	}

	.card-price-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 4px;
	}

	.card-price {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.15rem;
		color: var(--ft-dark);
		font-variant-numeric: tabular-nums;
	}

	.card-price.is-discounted {
		color: var(--color-danger);
	}

	.card-old-price {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ft-text-faint);
		text-decoration: line-through;
	}

	.card-actions {
		margin-top: auto;
		padding-top: 16px;
	}

	.card-add-btn {
		width: 100%;
		justify-content: center;
		padding: 10px;
		font-size: 0.8rem;
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--ft-cta);
		background: transparent;
		border: 2px solid var(--ft-cta);
		transition: all 0.2s ease;
		text-transform: uppercase;
		cursor: pointer;
	}

	.card:hover .card-add-btn {
		background: var(--ft-cta);
		color: #ffffff;
	}

	.card-add-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		border-color: var(--ft-text-faint);
		color: var(--ft-text-faint);
	}

	.card:hover .card-add-btn:disabled {
		background: transparent;
		color: var(--ft-text-faint);
	}
</style>
