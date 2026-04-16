<script lang="ts">
	import { cart, notifications, wishlist } from '$lib/stores';
	import { afterNavigate } from '$app/navigation';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import ProductGallery from '$lib/components/products/ProductGallery.svelte';
	import ImageZoomModal from '$lib/components/products/ImageZoomModal.svelte';
	import SpecTable from '$lib/components/products/SpecTable.svelte';
	import RelatedProducts from '$lib/components/products/RelatedProducts.svelte';
	import { getStockInfo } from '$lib/utils/inventory';
	import { parseProductDescription } from '$lib/utils/html';
	import type { Product } from '$lib/stores/products.svelte';
	import { HeartIcon, ShoppingCartSimpleIcon, MinusIcon, PlusIcon } from 'phosphor-svelte';

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
		hasDiscount
			? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
			: 0
	);
	const allImages = $derived(
		[product.mainImage, ...(product.gallery || [])].filter(Boolean) as string[]
	);
	const imageBadges = $derived.by(() => {
		const badges: Array<{ label: string; class: string }> = [];
		if (product.featured) badges.push({ label: 'Polecany', class: 'bg-[--ft-accent]' });
		if (hasDiscount) badges.push({ label: `-${discountPercent}%`, class: 'bg-[--ft-danger]' });
		if (!stock.inStock) badges.push({ label: 'Wyprzedane', class: 'bg-[--ft-text-muted]' });
		return badges;
	});
	const maxQuantity = $derived(product.inventory?.trackQuantity ? product.inventory.quantity : 99);
	const primaryCategory = $derived(product.expand?.categories?.[0]);
	const parsed = $derived(parseProductDescription(product.description || ''));
	const specTable = $derived(parsed.specs);
	const contents = $derived(parsed.contents);
	const descriptionHtml = $derived(parsed.html);
	const isWishlisted = $derived(wishlist.has(product.id));

	let zoomOpen = $state(false);
	let zoomIndex = $state(0);
	let quantity = $state(1);
	let descExpanded = $state(false);

	// Force scroll to top when navigating between products
	afterNavigate(() => {
		window.scrollTo({ top: 0, behavior: 'instant' });
		quantity = 1;
		descExpanded = false;
	});

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
			items.push({
				label: primaryCategory.name,
				href: `/products?category=${primaryCategory.slug}`
			});
		}
		items.push({
			label: product.name,
			href: `/products/${product.slug?.trim() || product.id}`
		});
		return items;
	});

	function addToCart() {
		cart.addItem(
			{ productId: product.id, name: product.name, price: product.price, image: product.mainImage },
			quantity
		);
		notifications.success(`Dodano ${product.name} do koszyka`);
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
	<meta
		name="description"
		content={product.description?.slice(0, 160) || `${product.name} — dostępny w FixTar`}
	/>
</svelte:head>

<div class="ft-container pdp">
	<nav class="pdp-breadcrumbs">
		<Breadcrumbs items={breadcrumbItems} />
	</nav>

	<div class="pdp-grid">
		<!-- Gallery -->
		<div
			class="pdp-gallery"
			style="view-transition-name:product-img-{product.id.slice(0, 8)};min-width:0"
		>
			<ProductGallery
				images={allImages}
				productName={product.name}
				badges={imageBadges}
				onZoomRequest={openZoom}
			/>
		</div>

		<!-- Info -->
		<div class="pdp-info" style="min-width:0">
			{#if primaryCategory}
				<a class="pdp-category-tag" href="/products?category={primaryCategory.slug}">
					{primaryCategory.name}
				</a>
			{/if}

			<h1 class="pdp-name">{product.name}</h1>

			<!-- Price -->
			<div class="pdp-price-row">
				<span class="pdp-price" class:is-discounted={hasDiscount}
					>{formatPrice(product.price)}</span
				>
				{#if hasDiscount}
					<span class="pdp-compare">{formatPrice(product.compareAtPrice!)}</span>
					<span class="pdp-discount">−{discountPercent}%</span>
				{/if}
			</div>

			<!-- Stock -->
			<div class="pdp-stock-row">
				<span class="pdp-stock" class:in-stock={stock.inStock} class:out-of-stock={!stock.inStock}>
					<span class="stock-dot" aria-hidden="true"></span>
					{stock.label}
				</span>
			</div>

			<!-- Inline Actions -->
			{#if stock.inStock}
				<div class="pdp-actions">
					<div class="pdp-qty">
						<button
							class="qty-btn"
							onclick={() => adjustQuantity(-1)}
							disabled={quantity <= 1}
							aria-label="Zmniejsz ilość"
						>
							<MinusIcon size={14} weight="bold" aria-hidden="true" />
						</button>
						<span class="qty-value" aria-live="polite">{quantity}</span>
						<button
							class="qty-btn"
							onclick={() => adjustQuantity(1)}
							disabled={quantity >= maxQuantity}
							aria-label="Zwiększ ilość"
						>
							<PlusIcon size={14} weight="bold" aria-hidden="true" />
						</button>
					</div>

					<button class="pdp-cart" onclick={addToCart}>
						<ShoppingCartSimpleIcon size={18} weight="bold" aria-hidden="true" />
						<span>Do koszyka</span>
					</button>

					<button
						class="pdp-heart"
						class:is-active={isWishlisted}
						onclick={toggleWishlist}
						aria-pressed={isWishlisted}
						aria-label={isWishlisted ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
					>
						<HeartIcon size={18} weight={isWishlisted ? 'fill' : 'regular'} aria-hidden="true" />
					</button>
				</div>
			{:else}
				<div class="pdp-actions">
					<span class="pdp-oos">Produkt chwilowo niedostępny</span>
					<button
						class="pdp-heart"
						class:is-active={isWishlisted}
						onclick={toggleWishlist}
						aria-pressed={isWishlisted}
						aria-label={isWishlisted ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
					>
						<HeartIcon size={18} weight={isWishlisted ? 'fill' : 'regular'} aria-hidden="true" />
					</button>
				</div>
			{/if}

			<!-- Specs + Contents -->
			{#if specTable.length > 0 || contents.length > 0}
				<div class="pdp-specs">
					<SpecTable specs={specTable} {contents} />
				</div>
			{/if}

			<!-- Description -->
			{#if descriptionHtml}
				<div class="pdp-description" class:collapsed={descIsLong && !descExpanded}>
					{@html descriptionHtml}
				</div>
				{#if descIsLong}
					<button class="pdp-expand-btn" onclick={() => (descExpanded = !descExpanded)}>
						{descExpanded ? 'Zwiń opis' : 'Czytaj więcej'}
					</button>
				{/if}
			{/if}
		</div>
	</div>

	<!-- Related Products -->
	<RelatedProducts products={relatedProducts} categorySlug={primaryCategory?.slug} />
</div>

<!-- Mobile-only sticky bar: minimal price + CTA -->
<div class="mobile-bar">
	<div class="mobile-bar-inner ft-container">
		<div class="mobile-bar-price">
			<span class="mobile-bar-amount">{formatPrice(product.price * quantity)}</span>
			{#if hasDiscount && stock.inStock}
				<span class="mobile-bar-compare">{formatPrice(product.compareAtPrice! * quantity)}</span>
			{/if}
		</div>
		{#if stock.inStock}
			<button class="mobile-bar-cart" onclick={addToCart} aria-label="Do koszyka">
				<ShoppingCartSimpleIcon size={16} weight="bold" aria-hidden="true" />
				<span>Do koszyka</span>
			</button>
		{:else}
			<span class="mobile-bar-oos">Niedostępny</span>
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
		padding-bottom: clamp(40px, 6vh, 80px);
		overflow-x: clip;
	}

	/* Make room for mobile sticky bar when visible */
	@media (max-width: 1023px) {
		.pdp {
			padding-bottom: 96px;
		}
	}

	.pdp-breadcrumbs {
		margin-bottom: 20px;
	}

	/* ── Grid ── */
	.pdp-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
		min-width: 0;
	}

	@media (min-width: 1024px) {
		.pdp-grid {
			grid-template-columns: 1fr 1fr;
			gap: 64px;
			align-items: start;
		}

		.pdp-gallery {
			position: sticky;
			top: 112px;
		}
	}

	/* ── Category pill ── */
	.pdp-category-tag {
		display: inline-flex;
		align-items: center;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ft-text-muted);
		text-decoration: none;
		margin-bottom: 12px;
		transition: color 150ms ease;
	}

	.pdp-category-tag:hover {
		color: var(--ft-accent);
	}

	/* ── Name ── */
	.pdp-name {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3.2vw, 2rem);
		font-weight: 500;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.2;
		overflow-wrap: anywhere;
		word-break: break-word;
		margin: 0;
	}

	/* ── Price ── */
	.pdp-price-row {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-top: 20px;
		flex-wrap: wrap;
	}

	.pdp-price {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2rem);
		font-weight: 600;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.pdp-price.is-discounted {
		color: var(--color-danger);
	}

	.pdp-compare {
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--ft-text-faint);
		text-decoration: line-through;
		font-variant-numeric: tabular-nums;
	}

	.pdp-discount {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.01em;
		color: #ffffff;
		background: var(--color-danger);
		padding: 3px 8px;
		border-radius: 2px;
		font-variant-numeric: tabular-nums;
	}

	/* ── Stock ── */
	.pdp-stock-row {
		margin-top: 12px;
	}

	.pdp-stock {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
	}

	.pdp-stock.in-stock {
		color: var(--color-success);
	}
	.pdp-stock.out-of-stock {
		color: var(--ft-text-muted);
	}

	.stock-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}

	/* ── Inline Actions ── */
	.pdp-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 24px;
		padding-top: 24px;
		border-top: 1px solid var(--ft-line);
	}

	.pdp-qty {
		display: inline-flex;
		align-items: stretch;
		border: 1px solid var(--ft-line);
		border-radius: 999px;
		background: var(--ft-surface);
		height: 44px;
		overflow: hidden;
	}

	.qty-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 100%;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--ft-text-strong);
		transition:
			color 150ms ease,
			background 150ms ease;
	}

	.qty-btn:hover:not(:disabled) {
		background: var(--ft-frost);
	}

	.qty-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.qty-btn:focus-visible {
		outline: 2px solid var(--ft-focus-ring);
		outline-offset: -2px;
	}

	.qty-value {
		min-width: 32px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--ft-text-strong);
		font-variant-numeric: tabular-nums;
	}

	.pdp-cart {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex: 1;
		min-width: 0;
		height: 44px;
		padding: 0 20px;
		background: var(--ft-cta);
		color: var(--ft-cta-text);
		border: none;
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: -0.005em;
		cursor: pointer;
		white-space: nowrap;
		transition:
			background 150ms ease,
			transform 150ms ease;
	}

	.pdp-cart:hover {
		background: var(--ft-cta-hover);
	}

	.pdp-cart:active {
		transform: scale(0.98);
	}

	.pdp-cart:focus-visible {
		outline: 2px solid var(--ft-focus-ring);
		outline-offset: 2px;
	}

	.pdp-heart {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: 999px;
		color: var(--ft-text-strong);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			color 150ms ease,
			border-color 150ms ease,
			transform 150ms ease;
	}

	.pdp-heart:hover,
	.pdp-heart.is-active {
		color: var(--color-danger);
		border-color: var(--color-danger);
	}

	.pdp-heart:active {
		transform: scale(0.94);
	}

	.pdp-heart:focus-visible {
		outline: 2px solid var(--ft-focus-ring);
		outline-offset: 2px;
	}

	.pdp-oos {
		flex: 1;
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--ft-text-muted);
	}

	/* ── Specs ── */
	.pdp-specs {
		margin-top: 28px;
	}

	/* ── Description ── */
	.pdp-description {
		margin-top: 24px;
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--ft-text);
		overflow-wrap: anywhere;
		word-break: break-word;
		overflow-x: hidden;
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
		font-weight: 500;
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

	.pdp-description :global(table) {
		width: 100%;
		table-layout: fixed;
		word-break: break-word;
	}

	.pdp-description :global(pre),
	.pdp-description :global(code) {
		white-space: pre-wrap;
		word-break: break-all;
	}

	.pdp-description :global(img) {
		max-width: 100%;
		height: auto;
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
		top: 0.65em;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--ft-text-muted);
	}

	.pdp-expand-btn {
		margin-top: 12px;
		background: none;
		border: none;
		font-family: var(--font-sans);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-text-strong);
		cursor: pointer;
		padding: 4px 0;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: var(--ft-line);
		transition:
			color 150ms ease,
			text-decoration-color 150ms ease;
	}

	.pdp-expand-btn:hover {
		color: var(--ft-accent);
		text-decoration-color: var(--ft-accent);
	}

	/* ── Mobile Sticky Bar ── */
	.mobile-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 40;
		background: var(--ft-surface);
		border-top: 1px solid var(--ft-line);
		padding: 10px 0;
		padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
	}

	@media (min-width: 1024px) {
		.mobile-bar {
			display: none;
		}
	}

	.mobile-bar-inner {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	.mobile-bar-price {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		margin-right: auto;
	}

	.mobile-bar-amount {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--ft-text-strong);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.01em;
	}

	.mobile-bar-compare {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--ft-text-faint);
		text-decoration: line-through;
		font-variant-numeric: tabular-nums;
	}

	.mobile-bar-cart {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		padding: 0 20px;
		background: var(--ft-cta);
		color: var(--ft-cta-text);
		border: none;
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
		transition: background 150ms ease;
	}

	.mobile-bar-cart:hover {
		background: var(--ft-cta-hover);
	}

	.mobile-bar-oos {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--ft-text-muted);
	}
</style>
