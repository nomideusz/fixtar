<script lang="ts">
	import { cart, notifications, wishlist } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import ProductGallery from '$lib/components/products/ProductGallery.svelte';
	import { getStockInfo } from '$lib/utils/inventory';
	import { formatProductDescription } from '$lib/utils/html';
	import { extractSpecTable } from '$lib/utils/specs';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		data: {
			product: Product;
			relatedProducts: Product[];
		};
	}

	let { data }: Props = $props();
	const product = $derived(data.product);
	const relatedProducts = $derived(data.relatedProducts);

	let quantity = $state(1);

	// --- Derived Values ---

	const stock = $derived(getStockInfo(product));

	const hasDiscount = $derived(
		!!product.compareAtPrice && product.compareAtPrice > product.price
	);
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
		if (hasDiscount) badges.push({ label: `-${discountPercent}%`, class: 'bg-danger' });
		if (!stock.inStock) badges.push({ label: 'Wyprzedane', class: 'bg-[--ft-text-muted]' });
		return badges;
	});

	const maxQuantity = $derived(
		product.inventory?.trackQuantity ? product.inventory.quantity : 99
	);

	const primaryCategory = $derived(product.expand?.categories?.[0]);
	const specTable = $derived(extractSpecTable(product.description));
	const isWishlisted = $derived(wishlist.has(product.id));

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
		items.push({ label: product.name, href: '#' });
		return items;
	});

	// --- Actions ---

	function addToCart() {
		cart.addItem(
			{
				productId: product.id,
				name: product.name,
				price: product.price,
				image: product.mainImage
			},
			quantity
		);
		notifications.success(`Dodano ${quantity} ${product.name} do koszyka`);
	}

	function buyNow() {
		cart.addItem(
			{
				productId: product.id,
				name: product.name,
				price: product.price,
				image: product.mainImage
			},
			quantity
		);
		window.location.href = '/checkout';
	}

	function toggleWishlist() {
		const added = wishlist.toggle(product.id);
		notifications.success(added ? `Dodano ${product.name} do ulubionych` : `Usunięto ${product.name} z ulubionych`);
	}

	function adjustQuantity(delta: number) {
		const newQty = quantity + delta;
		if (newQty >= 1 && newQty <= maxQuantity) {
			quantity = newQty;
		}
	}
</script>

<svelte:head>
	<title>{product.name} - FixTar</title>
	<meta
		name="description"
		content={product.description ||
			product.shortDescription ||
			`${product.name} - Dostępny w FixTar`}
	/>
</svelte:head>

<div class="min-h-screen">
	<div class="ft-container ft-section-sm">
		<!-- Breadcrumb -->
		<nav class="mb-6">
			<Breadcrumbs items={breadcrumbItems} />
		</nav>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Product Images -->
			<div>
				<ProductGallery images={allImages} productName={product.name} badges={imageBadges} />
			</div>

			<!-- Product Info -->
			<div class="flex flex-col gap-5">
				<!-- Header -->
				<div class="pb-5 border-b border-[--ft-line]">
					<h1 class="mb-4 text-3xl leading-tight font-bold text-[--ft-text] lg:text-4xl">
						{product.name}
					</h1>

					<!-- Price -->
					<div class="mb-4 flex items-center gap-4">
						<span class="text-[--ft-accent] text-4xl font-bold">
							{product.price.toFixed(2)} zł
						</span>
						{#if hasDiscount}
							<span class="text-xl text-[--ft-text-muted] line-through">
								{product.compareAtPrice?.toFixed(2)} zł
							</span>
							<span class="bg-danger rounded-lg px-2 py-1 text-sm font-semibold !text-white">
								-{discountPercent}%
							</span>
						{/if}
					</div>

					<!-- Stock & SKU -->
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full {stock.inStock ? 'bg-success' : 'bg-danger'}"></div>
							<span class="text-sm font-semibold {stock.colorClass}">
								{stock.label}
							</span>
						</div>

						{#if product.sku}
							<div class="text-sm text-[--ft-text-muted]">
								SKU: <span class="font-mono">{product.sku}</span>
							</div>
						{/if}

						<!-- Wishlist button -->
						<button class="wishlist-detail-btn" class:is-active={isWishlisted} onclick={toggleWishlist}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
							</svg>
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
								<a
									href="/products?category={category.slug}"
									class="category-pill"
								>
									<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
									</svg>
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
				{#if specTable.length > 0}
					<div class="pb-5 border-b border-[--ft-line]">
						<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[--ft-text-muted]">Specyfikacja</h3>
						<div class="spec-table">
							{#each specTable as spec (spec.key)}
								<div class="spec-row">
									<span class="spec-key">{spec.key}</span>
									<span class="spec-value">{spec.value}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Purchase / Out of Stock -->
				{#if stock.inStock}
					<Card
						class="border-[--ft-accent]/20 border bg-[--ft-frost] p-6"
					>
						<div class="space-y-6">
							<!-- Quantity Selector -->
							<div>
								<label
									for="quantity"
									class="mb-3 block text-sm font-semibold text-[--ft-text]"
								>
									Ilość
								</label>
								<div class="flex items-center gap-4">
									<div
										class="flex items-center rounded-xl border border-[--ft-line] bg-[--ft-surface] shadow-sm"
									>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => adjustQuantity(-1)}
											disabled={quantity <= 1}
											class="rounded-l-xl rounded-r-none border-0"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M20 12H4"
												/>
											</svg>
										</Button>
										<div
											class="min-w-15 px-4 py-2 text-center text-lg font-semibold text-[--ft-text]"
										>
											{quantity}
										</div>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => adjustQuantity(1)}
											disabled={quantity >= maxQuantity}
											class="rounded-l-none rounded-r-xl border-0"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 4v16m8-8H4"
												/>
											</svg>
										</Button>
									</div>

									{#if product.inventory?.trackQuantity && product.inventory.quantity <= 10}
										<span class="text-warning text-sm font-medium">
											Tylko {product.inventory.quantity} sztuk w magazynie
										</span>
									{/if}
								</div>
							</div>

							<!-- Total Price -->
							<div
								class="flex items-center justify-between rounded-xl border border-[--ft-line] bg-[--ft-surface] px-4 py-4"
							>
								<span class="text-lg font-semibold text-[--ft-text]">Łączna cena:</span>
								<span class="text-[--ft-accent] text-2xl font-bold">
									{(product.price * quantity).toFixed(2)} zł
								</span>
							</div>

							<!-- Add to Cart -->
							<Button
								onclick={addToCart}
								class="w-full py-4 text-lg font-semibold transition-colors duration-200"
								size="lg"
							>
								<svg
									class="mr-2 h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								Dodaj do koszyka
							</Button>

							<!-- Buy Now -->
							<button class="buy-now-btn" onclick={buyNow}>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
								Kup teraz
							</button>

							<!-- Perks -->
							<div
								class="grid grid-cols-1 gap-4 text-sm text-[--ft-text-faint] sm:grid-cols-2"
							>
								<div class="flex items-center gap-2">
									<svg
										class="text-success h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Darmowa dostawa od 200 zł
								</div>
								<div class="flex items-center gap-2">
									<svg
										class="text-[--ft-accent] h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Gwarancja producenta
								</div>
							</div>
						</div>
					</Card>
				{:else}
					<Card class="bg-danger-500/10 border-danger-500/20 border p-6">
						<div class="text-center">
							<svg
								class="text-danger mx-auto mb-4 h-12 w-12"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<h3 class="mb-2 text-lg font-semibold text-[--ft-text]">
								Produkt niedostępny
							</h3>
							<p class="mb-4 text-[--ft-text-faint]">
								Ten produkt jest obecnie wyprzedany
							</p>
							<Button disabled class="w-full" size="lg">Wyprzedane</Button>
						</div>
					</Card>
				{/if}
			</div>
		</div>

		<!-- Related Products Carousel -->
		{#if relatedProducts?.length > 0}
			<section class="mt-16 border-t border-[--ft-line] pt-12">
				<div class="mb-8 flex items-end justify-between">
					<div>
						<h4 class="ft-label mb-2">Polecane</h4>
						<h2 class="text-2xl font-bold text-[--ft-text-strong]" style="font-family:var(--font-display);letter-spacing:-0.02em">Podobne produkty</h2>
					</div>
					<a href="/products?category={primaryCategory?.slug || ''}" class="related-see-all">
						Zobacz wszystkie
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
						</svg>
					</a>
				</div>
				<div class="related-carousel">
					{#each relatedProducts as relatedProduct (relatedProduct.id)}
						<div class="related-card">
							<ProductCard product={relatedProduct} />
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>

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

	.category-pill svg {
		color: var(--ft-text-muted);
		transition: color 0.15s ease;
	}

	.category-pill:hover svg {
		color: var(--ft-cta);
	}

	/* ── Wishlist button (detail page) ── */
	.wishlist-detail-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		background: transparent;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
		min-height: 36px;
	}

	.wishlist-detail-btn:hover {
		color: var(--ft-cta);
		border-color: var(--ft-cta);
		background: var(--ft-cta-light);
	}

	.wishlist-detail-btn.is-active {
		color: var(--ft-cta);
		border-color: var(--ft-cta);
		background: var(--ft-cta-light);
	}

	/* ── Specification table ── */
	.spec-table {
		display: flex;
		flex-direction: column;
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		padding: 8px 0;
		border-bottom: 1px solid var(--ft-line);
		font-size: 0.85rem;
	}

	.spec-row:last-child {
		border-bottom: none;
	}

	.spec-key {
		color: var(--ft-text-muted);
		font-weight: 500;
		flex-shrink: 0;
	}

	.spec-value {
		color: var(--ft-text-strong);
		font-weight: 600;
		text-align: right;
	}

	/* ── Buy Now button ── */
	.buy-now-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		min-height: 48px;
		padding: 12px 20px;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ft-accent);
		background: transparent;
		border: 2px solid var(--ft-accent);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.buy-now-btn:hover {
		background: var(--ft-accent);
		color: white;
	}

	/* ── Related products carousel ── */
	.related-carousel {
		display: flex;
		gap: 20px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 8px;
		scrollbar-width: thin;
		scrollbar-color: var(--ft-line) transparent;
	}

	.related-carousel::-webkit-scrollbar {
		height: 6px;
	}

	.related-carousel::-webkit-scrollbar-track {
		background: transparent;
	}

	.related-carousel::-webkit-scrollbar-thumb {
		background: var(--ft-line);
		border-radius: 3px;
	}

	.related-card {
		flex: 0 0 280px;
		scroll-snap-align: start;
	}

	@media (min-width: 640px) {
		.related-card {
			flex: 0 0 300px;
		}
	}

	.related-see-all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-accent);
		text-decoration: none;
		transition: gap 0.2s ease;
		white-space: nowrap;
	}

	.related-see-all:hover {
		gap: 10px;
	}
</style>
