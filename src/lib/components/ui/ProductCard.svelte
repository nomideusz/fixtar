<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import type { Snippet } from 'svelte';
	import { cart, notifications } from '$lib/stores';
	import { ImageSquareIcon, ShoppingCartSimpleIcon, CheckIcon } from 'phosphor-svelte';

	interface Props {
		product: Product;
		onQuickView?: (product: Product) => void;
		actions?: Snippet;
		showBadges?: boolean;
	}

	let { product, onQuickView, actions, showBadges = false }: Props = $props();

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

	const mainImageUrl = $derived(product.mainImage || '');
	const inStock = $derived(isInStock(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount
			? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
			: 0
	);
	const productUrl = $derived(`/products/${product.slug?.trim() || product.id}`);
</script>

<div class="card" class:is-out={!inStock}>
	<!-- Image Wrapper HUD -->
	<div class="card-img-wrap">
		<!-- The main clickable area -->
		<a href={productUrl} class="card-img-link" aria-label={product.name}>
			<div class="card-img">
				{#if mainImageUrl}
					<img src={mainImageUrl} alt="" loading="lazy" width="320" height="320" />
				{:else}
					<div class="card-img-empty" aria-hidden="true">
						<ImageSquareIcon size={28} weight="light" aria-hidden="true" />
					</div>
				{/if}
			</div>
		</a>

		<!-- TOP LEFT: Availability HUD -->
		<div class="overlay-top-left">
			{#if inStock}
				<div class="hud-pill hud-pill--in" title="Dostępny od ręki">
					<span class="status-dot status-dot--in" aria-hidden="true"></span>
					<span class="hud-text">Dostępny</span>
				</div>
			{:else}
				<div class="hud-pill hud-pill--out" title="Niedostępny">
					<span class="status-dot status-dot--out" aria-hidden="true"></span>
					<span class="hud-text">Brak w magazynie</span>
				</div>
			{/if}
		</div>

		<!-- TOP RIGHT: Tags -->
		<div class="overlay-top-right">
			{#if hasDiscount}
				<span class="hud-tag hud-tag--discount">-{discountPercent}%</span>
			{/if}
			{#if showBadges && product.featured}
				<span class="hud-tag hud-tag--featured">Polecany</span>
			{/if}
		</div>

		<!-- BOTTOM RIGHT: Floating Cart -->
		<div class="overlay-bottom-right">
			{#if actions}
				{@render actions()}
			{:else if inStock}
				<button
					class="floating-cart-btn"
					class:is-added={isAdded}
					onclick={addToCart}
					aria-label="Dodaj do koszyka"
					title="Dodaj do koszyka"
				>
					{#if isAdded}
						<CheckIcon size={20} weight="bold" />
					{:else}
						<ShoppingCartSimpleIcon size={20} weight="bold" />
					{/if}
				</button>
			{/if}
		</div>
	</div>

	<!-- Minimal Text Area Below -->
	<div class="card-info">
		<h3 class="card-name">
			<a href={productUrl} class="card-name-link">{product.name}</a>
		</h3>

		<div class="card-price-wrap">
			<span class="card-price" class:is-discounted={hasDiscount}
				>{product.price.toFixed(2)}&nbsp;zł</span
			>
			{#if hasDiscount}
				<span class="card-old-price">{product.compareAtPrice?.toFixed(2)}&nbsp;zł</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: transparent;
		text-decoration: none;
		color: inherit;
		height: 100%;
		padding: 0;
	}

	.card.is-out .card-img img,
	.card.is-out .card-img-empty {
		opacity: 0.4;
		filter: grayscale(0.5);
		transition:
			opacity 0.2s ease,
			filter 0.2s ease;
	}

	.card.is-out:hover .card-img img,
	.card.is-out:hover .card-img-empty {
		opacity: 0.65;
		filter: grayscale(0.2);
	}

	.card.is-out .card-info {
		opacity: 0.5;
		transition: opacity 0.2s ease;
	}

	.card.is-out:hover .card-info {
		opacity: 0.75;
	}

	/* ── Image Area (The HUD) ── */
	.card-img-wrap {
		position: relative;
		aspect-ratio: 1;
		background: transparent;
		overflow: hidden;
		transition: box-shadow 0.2s ease;
		margin-bottom: 12px;
	}

	.card-img-link {
		position: absolute;
		inset: 0;
		text-decoration: none;
		color: inherit;
		display: block;
		z-index: 1; /* Below overlays */
	}

	.card-img {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 24px; /* Internal breathing room for the tool */
	}

	.card-img img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
		/* Crop 2px off the image boundaries to hide baked-in borders */
		clip-path: inset(2px);
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.card:hover .card-img img {
		transform: scale(1.06);
	}

	.card-img-empty {
		color: var(--ft-text-faint);
	}

	/* ── Floating Overlays ── */
	.overlay-top-left {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 2;
		pointer-events: none; /* Let clicks pass through to the image link */
	}

	.overlay-top-right {
		position: absolute;
		top: 10px;
		right: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
		z-index: 2;
		pointer-events: none;
	}

	.overlay-bottom-right {
		position: absolute;
		bottom: 10px;
		right: 10px;
		z-index: 3; /* Interactive element needs pointer events */
	}

	/* ── HUD Elements ── */
	.hud-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 8px;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(4px);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-full);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
	}

	.hud-text {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0;
		color: var(--ft-text-strong);
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: var(--radius-full);
	}

	.status-dot--in {
		background: var(--color-success);
		box-shadow: 0 0 6px var(--color-success);
	}

	.status-dot--out {
		background: var(--color-danger);
	}

	.hud-tag {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0;
		padding: 4px 8px;
		color: white;
		border-radius: var(--radius-full);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
	}

	.hud-tag--discount {
		background: var(--color-danger);
	}

	.hud-tag--featured {
		background: var(--ft-accent);
	}

	/* ── Floating Cart Button ── */
	.floating-cart-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: var(--ft-cta-text);
		background: var(--ft-cta);
		border: 2px solid var(--ft-cta);
		border-radius: var(--radius-full);
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		cursor: pointer;
		box-shadow: var(--ft-shadow-md);
	}

	.floating-cart-btn:hover:not(:disabled) {
		background: #ffffff;
		color: var(--ft-accent);
		transform: scale(1.08);
		box-shadow: var(--ft-shadow-lg);
	}

	.floating-cart-btn.is-added {
		background: var(--color-success);
		border-color: var(--color-success);
		color: #ffffff;
		transform: scale(1.08);
	}

	.floating-cart-btn:active:not(:disabled) {
		transform: scale(0.92);
	}

	.floating-cart-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		color: var(--ft-text-faint);
		background: rgba(255, 255, 255, 0.7);
		box-shadow: none;
	}

	/* ── Text Area (Minimal) ── */
	.card-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0 4px; /* Slight inset from edges to align text nicely */
	}

	.card-name {
		font-family: var(--font-sans);
		font-size: 1rem;
		font-weight: 600;
		color: var(--ft-dark);
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.card-name-link {
		color: inherit;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.card-name-link:hover {
		color: var(--ft-accent);
	}

	.card-price-wrap {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-top: auto;
	}

	.card-price {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: clamp(0.95rem, 2.5vw, 1.15rem);
		color: var(--ft-text-strong);
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
</style>
