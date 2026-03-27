<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import type { Snippet } from 'svelte';
	import { cart, notifications } from '$lib/stores';

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

<!--
	When `actions` snippet is provided, render as <div> so nested links/forms/buttons work.
	Otherwise render as a single <a> link card.
-->
{#if hasActions}
	<div class="card" class:is-out={!inStock} style="--vt-name:{vtName}">
		<!-- Image as link -->
		<a href={productUrl} class="card-img-link">
			<div class="card-img">
				{#if mainImageUrl}
					<img src={mainImageUrl} alt={product.name} loading="lazy" width="320" height="240" />
				{:else}
					<div class="card-img-empty" aria-hidden="true">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
						</svg>
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

		<!-- Info -->
		<div class="card-info">
			<h3 class="card-name">
				<a href={productUrl} class="card-name-link">{product.name}</a>
			</h3>

			<div class="card-meta">
				{#if inStock}
					<span class="card-availability">Dostępny, wysyłka 1-3 dni</span>
				{:else}
					<span class="card-availability card-availability--out">Niedostępny</span>
				{/if}
			</div>

			<div class="card-price-row">
				<span class="card-price">{product.price.toFixed(2)}&nbsp;zł</span>
				{#if hasDiscount}
					<span class="card-old-price">{product.compareAtPrice?.toFixed(2)}&nbsp;zł</span>
				{/if}
			</div>

			<!-- Custom actions slot -->
			{#if actions}
				<div class="card-actions">
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
{:else}
	<a href={productUrl} class="card" class:is-out={!inStock} style="--vt-name:{vtName}">
		<!-- Image -->
		<div class="card-img">
			{#if mainImageUrl}
				<img src={mainImageUrl} alt={product.name} loading="lazy" width="320" height="240" />
			{:else}
				<div class="card-img-empty" aria-hidden="true">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
					</svg>
				</div>
			{/if}

			{#if hasDiscount}
				<span class="discount-tag">-{discountPercent}%</span>
			{/if}
		</div>

		<!-- Info -->
		<div class="card-info">
			<h3 class="card-name">{product.name}</h3>

			<div class="card-meta">
				{#if inStock}
					<span class="card-availability">Dostępny, wysyłka 1-3 dni</span>
				{:else}
					<span class="card-availability card-availability--out">Niedostępny</span>
				{/if}
			</div>

			<div class="card-price-row">
				<span class="card-price">{product.price.toFixed(2)}&nbsp;zł</span>
				{#if hasDiscount}
					<span class="card-old-price">{product.compareAtPrice?.toFixed(2)}&nbsp;zł</span>
				{/if}
			</div>
		</div>
	</a>
{/if}

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--ft-surface);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: inherit;
		transition: transform 0.25s var(--ease-out);
	}

	.card:hover {
		transform: translateY(-3px);
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
		background: var(--ft-frost);
		border-radius: var(--radius-md);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		view-transition-name: var(--vt-name);
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

	/* ── Info ── */
	.card-info {
		padding: 12px 4px 4px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-name {
		font-family: var(--font-sans);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-dark);
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 4px;
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
		margin-bottom: 6px;
	}

	.card-availability {
		font-size: 0.7rem;
		color: var(--color-success);
	}

	.card-availability--out {
		color: var(--ft-text-faint);
	}

	.card-price-row {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}

	.card-price {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1rem;
		color: var(--ft-dark);
		font-variant-numeric: tabular-nums;
	}

	.card-old-price {
		font-size: 0.75rem;
		color: var(--ft-text-muted);
		text-decoration: line-through;
	}

	.card-actions {
		margin-top: auto;
		padding-top: 12px;
	}
</style>
