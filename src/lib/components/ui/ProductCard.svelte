<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import type { Snippet } from 'svelte';
	import { cart, notifications } from '$lib/stores';
	import { ImageSquareIcon, ShoppingCartSimpleIcon, CheckIcon } from 'phosphor-svelte';

	interface Props {
		product: Product;
		actions?: Snippet;
	}

	let { product, actions }: Props = $props();

	let isAdded = $state(false);

	function isInStock(p: Product): boolean {
		if (!p.inventory?.trackQuantity) return true;
		return p.inventory.quantity > 0;
	}

	function addToCart(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!inStock || isAdded) return;

		isAdded = true;
		cart.addItem({
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.mainImage || undefined
		});
		notifications.success(`Dodano ${product.name} do koszyka`);

		setTimeout(() => {
			isAdded = false;
		}, 1500);
	}

	const inStock = $derived(isInStock(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const productUrl = $derived(`/products/${product.slug?.trim() || product.id}`);
</script>

<article class="card" class:is-out={!inStock}>
	<a href={productUrl} class="card-img" aria-label={product.name}>
		{#if product.mainImage}
			<img src={product.mainImage} alt="" loading="lazy" width="400" height="400" />
		{:else}
			<div class="card-img-empty" aria-hidden="true">
				<ImageSquareIcon size={28} weight="light" />
			</div>
		{/if}
	</a>

	<div class="card-body">
		<h3 class="card-name">
			<a href={productUrl}>{product.name}</a>
		</h3>

		<div class="card-foot">
			<div class="card-price">
				<span class="price-value" class:is-discounted={hasDiscount}>
					{product.price.toFixed(2)}&nbsp;zł
				</span>
				{#if hasDiscount}
					<span class="price-old">{product.compareAtPrice?.toFixed(2)}&nbsp;zł</span>
				{/if}
			</div>

			{#if actions}
				{@render actions()}
			{:else if inStock}
				<button
					class="cart-btn"
					class:is-added={isAdded}
					onclick={addToCart}
					aria-label="Dodaj do koszyka"
					title="Dodaj do koszyka"
				>
					{#if isAdded}
						<CheckIcon size={18} weight="bold" />
					{:else}
						<ShoppingCartSimpleIcon size={18} weight="regular" />
					{/if}
				</button>
			{:else}
				<span class="out-label">brak</span>
			{/if}
		</div>
	</div>
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
		transition: border-color var(--dur-med) ease;
	}

	.card:hover {
		border-color: var(--ft-text-strong);
	}

	.card.is-out .card-img img,
	.card.is-out .card-img-empty {
		opacity: 0.5;
		filter: grayscale(0.4);
	}

	.card-img {
		position: relative;
		display: block;
		aspect-ratio: 1;
		background: var(--ft-frost);
		overflow: hidden;
	}

	.card-img img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 16px;
		transition: transform var(--dur-med) var(--ease-out);
	}

	.card:hover .card-img img {
		transform: scale(1.03);
	}

	.card-img-empty {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ft-text-faint);
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px;
		flex: 1;
	}

	.card-name {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--ft-text-strong);
		line-height: 1.3;
		letter-spacing: -0.01em;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 2.4em;
	}

	.card-name a {
		color: inherit;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.card-name a:hover {
		color: var(--ft-accent-text);
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-top: auto;
		padding-top: 6px;
	}

	.card-price {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.price-value {
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		font-variant-numeric: tabular-nums;
		color: var(--ft-text-strong);
	}

	.price-value.is-discounted {
		color: var(--color-danger);
	}

	.price-old {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
		color: var(--ft-text-faint);
		text-decoration: line-through;
	}

	.cart-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		color: var(--ft-text);
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.cart-btn:hover {
		background: var(--ft-accent);
		border-color: var(--ft-accent);
		color: var(--ft-cta-text);
	}

	.cart-btn.is-added {
		background: var(--color-success);
		border-color: var(--color-success);
		color: white;
	}

	.out-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--ft-text-faint);
		letter-spacing: 0.02em;
	}
</style>
