<script lang="ts">
	import { cart, notifications, wishlist } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import ProductGallery from '$lib/components/products/ProductGallery.svelte';
	import ImageZoomModal from '$lib/components/products/ImageZoomModal.svelte';
	import SpecTable from '$lib/components/products/SpecTable.svelte';
	import RelatedProducts from '$lib/components/products/RelatedProducts.svelte';
	import PurchaseCard from '$lib/components/products/PurchaseCard.svelte';
	import { getStockInfo } from '$lib/utils/inventory';
	import { formatProductDescription } from '$lib/utils/html';
	import { extractSpecTable } from '$lib/utils/specs';
	import type { Product } from '$lib/stores/products.svelte';
	import { HeartIcon, TagIcon, WarningCircleIcon } from 'phosphor-svelte';

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

	let zoomOpen = $state(false);
	let zoomIndex = $state(0);

	function openZoom(index: number) {
		zoomIndex = index;
		zoomOpen = true;
	}

	const breadcrumbItems = $derived.by(() => {
		const items = [
			{ label: 'Strona główna', href: '/' },
			{ label: 'Produkty', href: '/products' }
		];
		if (primaryCategory) {
			items.push({ label: primaryCategory.name, href: `/products?category=${primaryCategory.slug}` });
		}
		items.push({ label: product.name, href: '#' });
		return items;
	});

	function addToCart(quantity: number) {
		cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.mainImage }, quantity);
		notifications.success(`Dodano ${quantity} ${product.name} do koszyka`);
	}

	function buyNow(quantity: number) {
		cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.mainImage }, quantity);
		window.location.href = '/checkout';
	}

	function toggleWishlist() {
		const added = wishlist.toggle(product.id);
		notifications.success(added ? `Dodano ${product.name} do ulubionych` : `Usunięto ${product.name} z ulubionych`);
	}
</script>

<svelte:head>
	<title>{product.name} - FixTar</title>
	<meta name="description" content={product.description || product.shortDescription || `${product.name} - Dostępny w FixTar`} />
</svelte:head>

<div class="min-h-screen">
	<div class="ft-container ft-section-sm">
		<nav class="mb-6">
			<Breadcrumbs items={breadcrumbItems} />
		</nav>

		<div class="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-2">
			<!-- Product Images -->
			<div style="view-transition-name:product-img-{product.id.slice(0, 8)}">
				<ProductGallery images={allImages} productName={product.name} badges={imageBadges} onZoomRequest={openZoom} />
			</div>

			<!-- Product InfoIcon -->
			<div class="flex flex-col gap-5">
				<!-- Header -->
				<div class="pb-5 border-b border-[--ft-line]">
					<h1 class="mb-4 text-2xl leading-tight font-bold text-[--ft-text] sm:text-3xl lg:text-4xl">{product.name}</h1>

					<div class="mb-4 flex flex-wrap items-center gap-3 sm:gap-4">
						<span class="text-[--ft-accent] text-2xl font-bold sm:text-4xl">{product.price.toFixed(2)} zł</span>
						{#if hasDiscount}
							<span class="text-xl text-[--ft-text-muted] line-through">{product.compareAtPrice?.toFixed(2)} zł</span>
							<span class="bg-danger rounded-lg px-2 py-1 text-sm font-semibold !text-white">-{discountPercent}%</span>
						{/if}
					</div>

					<div class="flex flex-wrap items-center gap-3">
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full {stock.inStock ? 'bg-success' : 'bg-danger'}"></div>
							<span class="text-sm font-semibold {stock.colorClass}">{stock.label}</span>
						</div>
						{#if product.sku}
							<div class="text-sm text-[--ft-text-muted]">SKU: <span class="font-mono">{product.sku}</span></div>
						{/if}
						<button class="wishlist-btn" class:is-active={isWishlisted} onclick={toggleWishlist}>
							<HeartIcon weight={isWishlisted ? 'fill' : 'regular'} class="h-4 w-4" aria-hidden="true" />
							{isWishlisted ? 'W ulubionych' : 'Dodaj do ulubionych'}
						</button>
					</div>
				</div>

				<!-- Categories -->
				{#if product.expand?.categories?.length}
					<div class="pb-5 border-b border-[--ft-line]">
						<h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-[--ft-text-muted]">Kategorie</h3>
						<div class="flex flex-wrap gap-2">
							{#each product.expand.categories as category (category.id)}
								<a href="/products?category={category.slug}" class="category-pill">
									<TagIcon class="h-3.5 w-3.5" aria-hidden="true" />
									{category.name}
								</a>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Description -->
				{#if product.description || product.shortDescription}
					<div class="pb-5 border-b border-[--ft-line]">
						<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[--ft-text-muted]">Opis produktu</h3>
						<div class="product-description text-sm leading-relaxed text-[--ft-text]">
							{#if product.description}
								{@html formatProductDescription(product.description)}
							{:else}
								<p>{product.shortDescription}</p>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Specification Table -->
				<SpecTable specs={specTable} />

				<!-- Purchase / Out of Stock -->
				{#if stock.inStock}
					<PurchaseCard
						price={product.price}
						{maxQuantity}
						lowStockQuantity={product.inventory?.trackQuantity ? product.inventory.quantity : undefined}
						onAddToCart={addToCart}
						onBuyNow={buyNow}
					/>
				{:else}
					<Card class="bg-danger-500/10 border-danger-500/20 border p-6">
						<div class="text-center">
							<WarningCircleIcon class="text-danger mx-auto mb-4 h-12 w-12" aria-hidden="true" />
							<h3 class="mb-2 text-lg font-semibold text-[--ft-text]">Produkt niedostępny</h3>
							<p class="mb-4 text-[--ft-text-faint]">Ten produkt jest obecnie wyprzedany</p>
							<Button disabled class="w-full" size="lg">Wyprzedane</Button>
						</div>
					</Card>
				{/if}
			</div>
		</div>

		<!-- Related Products -->
		<RelatedProducts products={relatedProducts} categorySlug={primaryCategory?.slug} />
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
	.product-description :global(p) {
		margin-bottom: 0.75rem;
	}

	.product-description :global(p:last-child) {
		margin-bottom: 0;
	}

	.product-description :global(h3) {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 1.5rem 0 0.75rem 0;
		color: var(--ft-text-strong);
		border-bottom: 1px solid var(--ft-line);
		padding-bottom: 0.5rem;
	}

	.product-description :global(h4) {
		font-size: 1rem;
		font-weight: 600;
		margin: 1rem 0 0.5rem 0;
		color: var(--ft-text);
	}

	.product-description :global(ul),
	.product-description :global(ol) {
		margin: 0.75rem 0;
		padding-left: 1.5rem;
	}

	.product-description :global(li) {
		margin-bottom: 0.25rem;
		color: var(--ft-text);
	}

	.product-description :global(strong) {
		font-weight: 600;
		color: var(--ft-text-strong);
	}

	.product-description :global(em) {
		font-style: italic;
		color: var(--ft-text-muted);
	}

	.product-description :global(.measurement) {
		font-family: 'Courier New', monospace;
		background: var(--ft-frost);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--ft-accent);
		font-weight: 600;
	}

	.product-description :global(.model) {
		font-family: 'Courier New', monospace;
		background: var(--ft-frost);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--ft-text);
		font-weight: 500;
	}

	.category-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		min-height: 40px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		color: var(--ft-text);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-decoration: none;
		transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
	}

	.category-pill:hover {
		border-color: var(--ft-cta);
		color: var(--ft-cta);
		background: var(--ft-frost);
		box-shadow: var(--ft-shadow-sm);
	}

	.category-pill :global(svg) {
		color: var(--ft-text-muted);
		transition: color 0.15s ease;
	}

	.category-pill:hover :global(svg) {
		color: var(--ft-cta);
	}

	.wishlist-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		background: transparent;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
		min-height: 44px;
	}

	.wishlist-btn:hover,
	.wishlist-btn.is-active {
		color: var(--ft-cta);
		border-color: var(--ft-cta);
		background: var(--ft-cta-light);
	}
</style>
