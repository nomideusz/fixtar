<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import type { Snippet } from 'svelte';
	import { cart, notifications, wishlist } from '$lib/stores';
	import {
		ImageSquareIcon,
		ShoppingCartSimpleIcon,
		CheckIcon,
		HeartIcon
	} from 'phosphor-svelte';

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

	function toggleWishlist(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		wishlist.toggle(product.id);
	}

	const mainImageUrl = $derived(product.mainImage || '');
	const hoverImageUrl = $derived(
		product.gallery?.find((url) => url && url !== product.mainImage) || ''
	);
	const inStock = $derived(isInStock(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount
			? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
			: 0
	);
	const productUrl = $derived(`/products/${product.slug?.trim() || product.id}`);
	const isFavorite = $derived(wishlist.has(product.id));
	const vtName = $derived(`product-img-${product.id.slice(0, 8)}`);
</script>

<div class="card" class:is-out={!inStock}>
	<div class="card-img-wrap" style="view-transition-name:{vtName}">
		<a
			href={productUrl}
			class="card-img-link"
			aria-label={product.name}
			data-sveltekit-preload-data="hover"
		>
			<div class="card-img">
				{#if mainImageUrl}
					<img
						src={mainImageUrl}
						alt=""
						loading="lazy"
						width="320"
						height="320"
						class="img-primary"
					/>
					{#if hoverImageUrl}
						<img
							src={hoverImageUrl}
							alt=""
							loading="lazy"
							width="320"
							height="320"
							aria-hidden="true"
							class="img-hover"
						/>
					{/if}
				{:else}
					<div class="card-img-empty" aria-hidden="true">
						<ImageSquareIcon size={28} weight="light" />
					</div>
				{/if}
			</div>
		</a>

		{#if hasDiscount}
			<span class="tag-discount">−{discountPercent}%</span>
		{/if}

		<button
			type="button"
			class="wishlist-btn"
			class:is-active={isFavorite}
			onclick={toggleWishlist}
			aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
			aria-pressed={isFavorite}
		>
			<HeartIcon size={18} weight={isFavorite ? 'fill' : 'regular'} />
		</button>

		{#if actions}
			<div class="card-actions">{@render actions()}</div>
		{:else if inStock}
			<button
				type="button"
				class="cart-btn"
				class:is-added={isAdded}
				onclick={addToCart}
				aria-label="Dodaj do koszyka"
			>
				{#if isAdded}
					<CheckIcon size={18} weight="bold" />
				{:else}
					<ShoppingCartSimpleIcon size={18} weight="bold" />
				{/if}
			</button>
		{/if}
	</div>

	<div class="card-info">
		<h3 class="card-name">
			<a href={productUrl} class="card-name-link" data-sveltekit-preload-data="hover">
				{product.name}
			</a>
		</h3>

		<div class="card-price-row">
			<span class="card-price" class:is-discounted={hasDiscount}
				>{product.price.toFixed(2)}&nbsp;zł</span
			>
			{#if hasDiscount}
				<span class="card-old-price">{product.compareAtPrice?.toFixed(2)}&nbsp;zł</span>
			{/if}
			{#if !inStock}
				<span class="card-oos">Niedostępny</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: transparent;
		color: inherit;
		height: 100%;
	}

	/* ── Image Area ── */
	.card-img-wrap {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		margin-bottom: 14px;
	}

	.card-img-link {
		position: absolute;
		inset: 0;
		display: block;
		text-decoration: none;
		color: inherit;
		z-index: 1;
	}

	.card-img {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 20px;
	}

	.card-img > img {
		grid-area: 1 / 1;
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
		clip-path: inset(2px);
		transition:
			transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 300ms ease;
	}

	.card-img > .img-hover {
		opacity: 0;
	}

	.card:hover .card-img > .img-primary {
		transform: scale(1.04);
	}

	.card:hover .card-img:has(.img-hover) > .img-primary {
		opacity: 0;
	}

	.card:hover .card-img > .img-hover {
		opacity: 1;
	}

	.card-img-empty {
		color: var(--ft-text-faint);
	}

	.card.is-out .card-img img,
	.card.is-out .card-img-empty {
		opacity: 0.45;
		filter: grayscale(0.6);
	}

	.card.is-out .card-info {
		opacity: 0.7;
	}

	/* ── Discount tag (only when meaningful) ── */
	.tag-discount {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 2;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		padding: 4px 8px;
		color: #ffffff;
		background: var(--color-danger);
		border-radius: 2px;
		font-variant-numeric: tabular-nums;
	}

	/* ── Wishlist — reveals on hover (desktop), always on touch ── */
	.wishlist-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		color: var(--ft-text-strong);
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(6px);
		border: 1px solid var(--ft-line);
		border-radius: 999px;
		cursor: pointer;
		opacity: 0;
		transform: translateY(-4px);
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			color 150ms ease,
			border-color 150ms ease;
	}

	.card:hover .wishlist-btn,
	.wishlist-btn:focus-visible,
	.wishlist-btn.is-active {
		opacity: 1;
		transform: translateY(0);
	}

	.wishlist-btn:hover {
		color: var(--color-danger);
		border-color: var(--color-danger);
	}

	.wishlist-btn.is-active {
		color: var(--color-danger);
		border-color: var(--color-danger);
	}

	.wishlist-btn:focus-visible {
		outline: 2px solid var(--ft-focus-ring);
		outline-offset: 2px;
	}

	/* ── Cart — reveals on hover (desktop), always on touch ── */
	.cart-btn,
	.card-actions {
		position: absolute;
		right: 10px;
		bottom: 10px;
		z-index: 3;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 180ms ease,
			transform 180ms ease;
	}

	.card:hover .cart-btn,
	.card:hover .card-actions,
	.cart-btn:focus-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.cart-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42px;
		height: 42px;
		padding: 0;
		color: var(--ft-cta-text);
		background: var(--ft-cta);
		border: none;
		border-radius: 999px;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			background 150ms ease,
			color 150ms ease;
	}

	.cart-btn:hover {
		background: var(--ft-cta-hover);
	}

	.cart-btn.is-added {
		background: var(--color-success);
		color: #ffffff;
		opacity: 1;
		transform: translateY(0) scale(1.05);
	}

	.cart-btn:active {
		transform: translateY(0) scale(0.94);
	}

	.cart-btn:focus-visible {
		outline: 2px solid var(--ft-focus-ring);
		outline-offset: 2px;
	}

	/* Touch devices: show actions by default (no hover) */
	@media (hover: none) {
		.wishlist-btn,
		.cart-btn,
		.card-actions {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── Text Area ── */
	.card-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 6px;
	}

	.card-name {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--ft-text-strong);
		line-height: 1.4;
		letter-spacing: -0.005em;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-name-link {
		color: inherit;
		text-decoration: none;
		transition: color 150ms ease;
	}

	.card-name-link:hover {
		color: var(--ft-accent);
	}

	.card-name-link:focus-visible {
		outline: 2px solid var(--ft-focus-ring);
		outline-offset: 2px;
		border-radius: 2px;
	}

	.card-price-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-top: auto;
	}

	.card-price {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 1rem;
		color: var(--ft-text-strong);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.01em;
	}

	.card-price.is-discounted {
		color: var(--color-danger);
	}

	.card-old-price {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--ft-text-faint);
		text-decoration: line-through;
		font-variant-numeric: tabular-nums;
	}

	.card-oos {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--ft-text-muted);
		margin-left: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.card-img img,
		.wishlist-btn,
		.cart-btn {
			transition: none;
		}
		.card:hover .card-img .img-primary {
			transform: none;
		}
	}
</style>
