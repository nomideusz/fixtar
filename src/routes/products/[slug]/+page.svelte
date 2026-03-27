<script lang="ts">
	import { cart, notifications, wishlist } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import ProductGallery from '$lib/components/products/ProductGallery.svelte';
	import ImageZoomModal from '$lib/components/products/ImageZoomModal.svelte';
	import SpecTable from '$lib/components/products/SpecTable.svelte';
	import RelatedProducts from '$lib/components/products/RelatedProducts.svelte';
	import { getStockInfo } from '$lib/utils/inventory';
	import { formatProductDescription } from '$lib/utils/html';
	import { extractSpecTable } from '$lib/utils/specs';
	import type { Product } from '$lib/stores/products.svelte';
	import { HeartIcon, TagIcon, ShoppingCartSimpleIcon, MinusIcon, PlusIcon } from 'phosphor-svelte';

	interface Props {
		data: {
			product: Product;
			relatedProducts: Product[];
		};
	}

	let { data }: Props = $props();
	const product = $derived(data.product);
	const relatedProducts = $derived(data.relatedProducts);
	const stock = $derived(getStockInfo(product));
	const hasDiscount = $derived(!!product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0
	);
	const allImages = $derived([product.mainImage, ...(product.gallery || [])].filter(Boolean) as string[]);
	const imageBadges = $derived.by(() => {
		const badges: Array<{ label: string; class: string }> = [];
		if (product.featured) badges.push({ label: 'Polecany', class: 'bg-[--ft-accent]' });
		if (hasDiscount) badges.push({ label: `-${discountPercent}%`, class: 'bg-danger' });
		if (!stock.inStock) badges.push({ label: 'Wyprzedane', class: 'bg-[--ft-text-muted]' });
		return badges;
	});
	const maxQuantity = $derived(product.inventory?.trackQuantity ? product.inventory.quantity : 99);
	const primaryCategory = $derived(product.expand?.categories?.[0]);
	const specTable = $derived(extractSpecTable(product.description));
	const isWishlisted = $derived(wishlist.has(product.id));
	const descriptionHtml = $derived(formatProductDescription(product.description || ''));

	let zoomOpen = $state(false);
	let zoomIndex = $state(0);
	let quantity = $state(1);
	let descExpanded = $state(false);

	// Description is long if > 600 chars
	const descIsLong = $derived((product.description?.length ?? 0) > 600);

	function openZoom(index: number) {
		zoomIndex = index;
		zoomOpen = true;
	}

	function adjustQuantity(delta: number) {
		const newQty = quantity + delta;
		if (newQty >= 1 && newQty <= maxQuantity) quantity = newQty;
	}

	const breadcrumbItems = $derived.by(() => {
		const items = [
			{ label: 'Strona główna', href: '/' },
			{ label: 'Produkty', href: '/products' }
		];
		if (primaryCategory) {
			items.push({ label: primaryCategory.name, href: `/products?category=${primaryCategory.slug}` });
		}
		return items;
	});

	function addToCart() {
		cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.mainImage }, quantity);
		notifications.success(`Dodano ${product.name} do koszyka`);
	}

	function buyNow() {
		cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.mainImage }, quantity);
		window.location.href = '/checkout';
	}

	function toggleWishlist() {
		const added = wishlist.toggle(product.id);
		notifications.success(added ? 'Dodano do ulubionych' : 'Usunięto z ulubionych');
	}

	function formatPrice(v: number): string {
		return v.toFixed(2).replace('.', ',') + ' zł';
	}
</script>

<svelte:head>
	<title>{product.name} — FixTar</title>
	<meta name="description" content={product.description?.slice(0, 160) || `${product.name} — dostępny w FixTar`} />
</svelte:head>

<div class="ft-container pdp">
	<nav class="pdp-breadcrumbs">
		<Breadcrumbs items={breadcrumbItems} />
	</nav>

	<div class="pdp-grid">
		<!-- Gallery -->
		<div class="pdp-gallery" style="view-transition-name:product-img-{product.id.slice(0, 8)}">
			<ProductGallery images={allImages} productName={product.name} badges={imageBadges} onZoomRequest={openZoom} />
		</div>

		<!-- Info -->
		<div class="pdp-info">
			<!-- Name -->
			<h1 class="pdp-name">{product.name}</h1>

			<!-- Price -->
			<div class="pdp-price-row">
				<span class="pdp-price">{formatPrice(product.price)}</span>
				{#if hasDiscount}
					<span class="pdp-compare">{formatPrice(product.compareAtPrice!)}</span>
					<span class="pdp-discount">-{discountPercent}%</span>
				{/if}
			</div>

			<!-- Meta -->
			<div class="pdp-meta">
				<span class="pdp-stock" class:in-stock={stock.inStock} class:out-of-stock={!stock.inStock}>
					<span class="stock-dot"></span>
					{stock.label}
				</span>
				{#if product.sku}
					<span class="pdp-sku">SKU: {product.sku}</span>
				{/if}
				{#if product.expand?.categories?.length}
					{#each product.expand.categories as cat (cat.id)}
						<a href="/products?category={cat.slug}" class="pdp-category">
							<TagIcon size={12} aria-hidden="true" />
							{cat.name}
						</a>
					{/each}
				{/if}
			</div>

			<!-- Specs (inline, above description) -->
			{#if specTable.length > 0}
				<div class="pdp-specs">
					<SpecTable specs={specTable} />
				</div>
			{/if}

			<!-- Description -->
			{#if descriptionHtml}
				<div class="pdp-description" class:collapsed={descIsLong && !descExpanded}>
					{@html descriptionHtml}
				</div>
				{#if descIsLong}
					<button class="pdp-expand-btn" onclick={() => (descExpanded = !descExpanded)}>
						{descExpanded ? '− Zwiń opis' : '+ Czytaj więcej'}
					</button>
				{/if}
			{/if}
		</div>
	</div>

	<!-- Related Products -->
	<RelatedProducts products={relatedProducts} categorySlug={primaryCategory?.slug} />
</div>

<!-- Sticky action bar — always visible -->
<div class="action-bar">
	<div class="action-bar-inner ft-container">
		{#if stock.inStock}
			<!-- Quantity -->
			<div class="action-qty">
				<button class="qty-btn" onclick={() => adjustQuantity(-1)} disabled={quantity <= 1} aria-label="Mniej">
					<MinusIcon size={14} weight="bold" aria-hidden="true" />
				</button>
				<span class="qty-value">{quantity}</span>
				<button class="qty-btn" onclick={() => adjustQuantity(1)} disabled={quantity >= maxQuantity} aria-label="Więcej">
					<PlusIcon size={14} weight="bold" aria-hidden="true" />
				</button>
			</div>

			<!-- Price -->
			<span class="action-price">{formatPrice(product.price * quantity)}</span>

			<!-- Add to cart -->
			<button class="action-cart" onclick={addToCart}>
				<ShoppingCartSimpleIcon size={18} weight="bold" aria-hidden="true" />
				<span class="action-cart-label">Do koszyka</span>
			</button>

			<!-- Wishlist -->
			<button class="action-heart" class:is-active={isWishlisted} onclick={toggleWishlist} aria-label={isWishlisted ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}>
				<HeartIcon size={18} weight={isWishlisted ? 'fill' : 'bold'} aria-hidden="true" />
			</button>
		{:else}
			<span class="action-price">{formatPrice(product.price)}</span>
			<span class="action-oos">Niedostępny</span>
		{/if}
	</div>
</div>

{#if zoomOpen && allImages.length > 0}
	<ImageZoomModal
		images={allImages}
		bind:selectedIndex={zoomIndex}
		productName={product.name}
		onClose={() => (zoomOpen = false)}
	/>
{/if}

<style>
	/* ── Page ── */
	.pdp {
		padding-top: clamp(16px, 2vh, 24px);
		padding-bottom: 100px; /* space for sticky bar */
	}

	.pdp-breadcrumbs {
		margin-bottom: 16px;
	}

	/* ── Grid ── */
	.pdp-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	@media (min-width: 1024px) {
		.pdp-grid {
			grid-template-columns: 1fr 1fr;
			gap: 40px;
		}
	}

	/* ── Name ── */
	.pdp-name {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 3vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		line-height: 1.25;
	}

	/* ── Price ── */
	.pdp-price-row {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-top: 12px;
	}

	.pdp-price {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		font-weight: 800;
		color: var(--ft-cta);
		letter-spacing: -0.02em;
	}

	.pdp-compare {
		font-size: 1rem;
		color: var(--ft-text-faint);
		text-decoration: line-through;
	}

	.pdp-discount {
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		background: var(--color-danger);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
	}

	/* ── Meta ── */
	.pdp-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin-top: 14px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--ft-line);
	}

	.pdp-stock {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 0.78rem;
		font-weight: 600;
	}

	.pdp-stock.in-stock { color: var(--color-success); }
	.pdp-stock.out-of-stock { color: var(--color-danger); }

	.stock-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}

	.pdp-sku {
		font-size: 0.75rem;
		color: var(--ft-text-faint);
		font-family: monospace;
	}

	.pdp-category {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color 0.15s;
	}

	.pdp-category:hover { color: var(--ft-accent); }

	/* ── Specs ── */
	.pdp-specs {
		margin-top: 16px;
	}

	/* ── Description ── */
	.pdp-description {
		margin-top: 16px;
		font-size: 0.88rem;
		line-height: 1.7;
		color: var(--ft-text);
	}

	.pdp-description.collapsed {
		max-height: 200px;
		overflow: hidden;
		mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
	}

	.pdp-description :global(h3) {
		font-family: var(--font-display);
		font-size: 0.92rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin: 20px 0 8px;
	}

	.pdp-description :global(h3:first-child) {
		margin-top: 0;
	}

	.pdp-description :global(p) {
		margin-bottom: 10px;
	}

	.pdp-description :global(p:last-child) {
		margin-bottom: 0;
	}

	.pdp-description :global(ul) {
		margin: 8px 0;
		padding-left: 0;
		list-style: none;
	}

	.pdp-description :global(li) {
		position: relative;
		padding-left: 16px;
		margin-bottom: 4px;
		font-size: 0.85rem;
		color: var(--ft-text);
	}

	.pdp-description :global(li::before) {
		content: '';
		position: absolute;
		left: 0;
		top: 0.6em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ft-accent);
	}

	.pdp-expand-btn {
		margin-top: 8px;
		background: none;
		border: none;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-accent);
		cursor: pointer;
		padding: 0;
		transition: opacity 0.15s;
	}

	.pdp-expand-btn:hover { opacity: 0.7; }

	/* ── Sticky action bar ── */
	.action-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 40;
		background: var(--ft-surface);
		border-top: 1px solid var(--ft-line);
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
		padding: 10px 0;
		padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
	}

	.action-bar-inner {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	/* Quantity */
	.action-qty {
		display: flex;
		align-items: center;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.qty-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: var(--ft-frost);
		border: none;
		cursor: pointer;
		color: var(--ft-text);
		transition: background-color 0.15s, color 0.15s;
	}

	.qty-btn:hover:not(:disabled) {
		background: var(--ft-accent);
		color: white;
	}

	.qty-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.qty-value {
		min-width: 32px;
		text-align: center;
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--ft-dark);
		border-left: 1px solid var(--ft-line);
		border-right: 1px solid var(--ft-line);
		height: 36px;
		line-height: 36px;
	}

	/* Price */
	.action-price {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--ft-cta);
		letter-spacing: -0.02em;
		margin-right: auto;
	}

	/* Cart button */
	.action-cart {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0 20px;
		height: 40px;
		background: var(--ft-cta);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
		transition: opacity 0.15s;
		white-space: nowrap;
	}

	.action-cart:hover { opacity: 0.9; }

	.action-cart-label {
		display: none;
	}

	@media (min-width: 480px) {
		.action-cart-label { display: inline; }
	}

	/* Wishlist */
	.action-heart {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: none;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		color: var(--ft-text-muted);
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
		flex-shrink: 0;
	}

	.action-heart:hover,
	.action-heart.is-active {
		color: var(--ft-cta);
		border-color: var(--ft-cta);
	}

	/* Out of stock */
	.action-oos {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-text-muted);
	}
</style>
