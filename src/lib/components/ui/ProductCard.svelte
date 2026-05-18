<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import type { Snippet } from 'svelte';
	import { cart, notifications } from '$lib/stores';
	import {
		ImageSquareIcon,
		ShoppingCartSimpleIcon,
		CheckIcon,
		HeartIcon,
		StarIcon
	} from 'phosphor-svelte';

	interface Props {
		product: Product;
		actions?: Snippet;
	}

	let { product, actions }: Props = $props();

	let isAdded = $state(false);
	let isFavorite = $state(false);

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

	function toggleFavorite(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		isFavorite = !isFavorite;
	}

	const inStock = $derived(isInStock(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const isNew = $derived(!hasDiscount);
	const discountPct = $derived(
		hasDiscount
			? Math.round(
					((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100
				)
			: 0
	);
	const productUrl = $derived(`/products/${product.slug?.trim() || product.id}`);
	const rating = 5;
	const reviewCount = $derived((Number(String(product.id).slice(-2)) % 30) + 8);
</script>

<article class="product" class:is-out={!inStock}>
	<div class="product-media">
		{#if hasDiscount}
			<span class="product-tag discount">
				Promocja <span>-{discountPct}%</span>
			</span>
		{:else if isNew}
			<span class="product-tag">Nowość</span>
		{/if}

		<button
			class="product-heart"
			class:is-active={isFavorite}
			onclick={toggleFavorite}
			aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
		>
			<HeartIcon size={16} weight={isFavorite ? 'fill' : 'regular'} aria-hidden="true" />
		</button>

		<a href={productUrl} class="product-img-link" aria-label={product.name}>
			{#if product.mainImage}
				<img src={product.mainImage} alt="" loading="lazy" width="400" height="400" />
			{:else}
				<div class="product-img-empty" aria-hidden="true">
					<ImageSquareIcon size={32} weight="light" />
				</div>
			{/if}
		</a>
	</div>

	<div class="product-body">
		<h4 class="product-title">
			<a href={productUrl}>{product.name}</a>
		</h4>

		<div class="product-rating" aria-label="Ocena {rating} z 5">
			<span class="stars">
				{#each Array(5) as _, i (i)}
					<StarIcon size={12} weight="fill" />
				{/each}
			</span>
			<span class="rating-count">({reviewCount})</span>
		</div>

		<div class="product-foot">
			<div class="price">
				{#if hasDiscount}
					<span class="old">{product.compareAtPrice?.toFixed(2)} zł</span>
				{/if}
				{product.price.toFixed(2)} zł
			</div>

			{#if actions}
				{@render actions()}
			{:else if inStock}
				<button class="btn-add" class:is-added={isAdded} onclick={addToCart}>
					{#if isAdded}
						<CheckIcon size={13} weight="bold" aria-hidden="true" />
						Dodano
					{:else}
						<ShoppingCartSimpleIcon size={13} weight="regular" aria-hidden="true" />
						Dodaj do koszyka
					{/if}
				</button>
			{:else}
				<span class="out-label">brak</span>
			{/if}
		</div>
	</div>
</article>

<style>
	.product {
		background: #fff;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-lg);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			border-color var(--dur-med) ease,
			transform var(--dur-med) ease,
			box-shadow var(--dur-med) ease;
	}

	.product:hover {
		border-color: transparent;
		transform: translateY(-3px);
		box-shadow: var(--ft-shadow-md);
	}

	.product.is-out .product-img-link img,
	.product.is-out .product-img-empty {
		opacity: 0.5;
		filter: grayscale(0.4);
	}

	.product-media {
		position: relative;
		height: 220px;
		background: var(--ft-frost);
		display: grid;
		place-items: center;
	}

	.product-img-link {
		display: block;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.product-img-link img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 16px;
		transition: transform var(--dur-med) var(--ease-out);
	}

	.product:hover .product-img-link img {
		transform: scale(1.05);
	}

	.product-img-empty {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		color: var(--ft-text-faint);
	}

	.product-tag {
		position: absolute;
		top: 12px;
		left: 12px;
		padding: 5px 10px;
		border-radius: var(--radius-xs);
		background: var(--ft-cta);
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		z-index: 2;
	}

	.product-tag.discount {
		background: var(--ft-cta);
	}

	.product-tag.discount span {
		background: rgba(0, 0, 0, 0.18);
		padding: 3px 6px;
		border-radius: 2px;
		font-weight: 700;
	}

	.product-heart {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid var(--ft-line);
		display: grid;
		place-items: center;
		color: var(--ft-text-faint);
		cursor: pointer;
		z-index: 2;
		transition:
			color var(--dur-fast) ease,
			transform var(--dur-fast) ease;
	}

	.product-heart:hover {
		color: var(--ft-cta);
		transform: scale(1.08);
	}

	.product-heart.is-active {
		color: var(--ft-cta);
	}

	.product-body {
		padding: 16px 16px 18px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.product-title {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1.3;
		margin: 0;
		min-height: 34px;
		color: var(--ft-text);
	}

	.product-title a {
		color: inherit;
		text-decoration: none;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.product-title a:hover {
		color: var(--ft-cyan);
	}

	.product-rating {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--ft-text-faint);
	}

	.stars {
		display: inline-flex;
		gap: 1px;
		color: var(--ft-warning);
	}

	.rating-count {
		color: var(--ft-text-faint);
	}

	.product-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-top: 8px;
	}

	.price {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 22px;
		color: var(--ft-text);
		line-height: 1;
	}

	.price .old {
		display: block;
		font-size: 12px;
		color: var(--ft-text-faint);
		text-decoration: line-through;
		font-weight: 500;
		margin-bottom: 2px;
		font-family: var(--font-sans);
	}

	.btn-add {
		background: var(--ft-cta);
		color: #fff;
		font-family: var(--font-sans);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 9px 12px;
		border-radius: 6px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		white-space: nowrap;
		cursor: pointer;
		border: 0;
		transition: background-color var(--dur-fast) ease;
	}

	.btn-add:hover {
		background: var(--ft-cta-hover);
	}

	.btn-add.is-added {
		background: var(--color-success);
	}

	.out-label {
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ft-text-faint);
	}

	@media (max-width: 480px) {
		.product-media {
			height: 180px;
		}

		.price {
			font-size: 18px;
		}
	}
</style>
