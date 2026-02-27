<script lang="ts">
	import { cart, notifications } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
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
	let selectedImageIndex = $state(0);
	let imageZoomed = $state(false);
	let zoomLevel = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);

	// Check if product is in stock
	function isInStock(product: Product): boolean {
		if (!product.inventory?.trackQuantity) return true;
		return product.inventory.quantity > 0;
	}

	// Get stock status
	function getStockStatus(product: Product): string {
		if (!product.inventory?.trackQuantity) return 'Dostępny';

		const qty = product.inventory.quantity;
		const lowThreshold = product.inventory.lowStockThreshold || 10;

		if (qty === 0) return 'Wyprzedany';
		if (qty <= lowThreshold) return `Mało sztuk (${qty})`;
		return 'Dostępny';
	}

	// Get stock color
	function getStockColor(product: Product): string {
		if (!product.inventory?.trackQuantity) return 'text-success';

		const qty = product.inventory.quantity;
		const lowThreshold = product.inventory.lowStockThreshold || 10;

		if (qty === 0) return 'text-danger';
		if (qty <= lowThreshold) return 'text-warning';
		return 'text-success';
	}

	function addToCart() {
		cart.addItem(
			{
				productId: product.id,
				name: product.name,
				price: product.price,
				image: product.mainImage // Use the already processed URL
			},
			quantity
		);

		notifications.success(`Dodano ${quantity} ${product.name} do koszyka`);
	}

	function increaseQuantity() {
		const maxQuantity = product.inventory?.trackQuantity ? product.inventory.quantity : 99;
		if (quantity < maxQuantity) {
			quantity++;
		}
	}

	function decreaseQuantity() {
		if (quantity > 1) {
			quantity--;
		}
	}

	// Computed values - use the already processed URLs from server
	const inStock = $derived(isInStock(product));
	const stockStatus = $derived(getStockStatus(product));
	const stockColor = $derived(getStockColor(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount
			? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
			: 0
	);
	const mainImageUrl = $derived(product.mainImage || '');
	const galleryImages = $derived(product.gallery || []);
	const allImages = $derived([mainImageUrl, ...galleryImages].filter(Boolean));

	// Zoom functionality
	function zoomIn() {
		zoomLevel = Math.min(zoomLevel * 1.5, 5);
	}

	function zoomOut() {
		zoomLevel = Math.max(zoomLevel / 1.5, 0.5);
	}

	function resetZoom() {
		zoomLevel = 1;
		panX = 0;
		panY = 0;
	}

	function closeZoom() {
		imageZoomed = false;
		resetZoom();
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		if (event.deltaY < 0) {
			zoomIn();
		} else {
			zoomOut();
		}
	}

	function handleMouseDown(event: MouseEvent) {
		if (zoomLevel > 1) {
			isDragging = true;
			dragStartX = event.clientX - panX;
			dragStartY = event.clientY - panY;
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging && zoomLevel > 1) {
			panX = event.clientX - dragStartX;
			panY = event.clientY - dragStartY;
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!imageZoomed) return;

		switch (event.key) {
			case 'Escape':
				closeZoom();
				break;
			case '+':
			case '=':
				event.preventDefault();
				zoomIn();
				break;
			case '-':
				event.preventDefault();
				zoomOut();
				break;
			case '0':
				event.preventDefault();
				resetZoom();
				break;
			case 'ArrowLeft':
				if (selectedImageIndex > 0) {
					selectedImageIndex--;
					resetZoom();
				}
				break;
			case 'ArrowRight':
				if (selectedImageIndex < allImages.length - 1) {
					selectedImageIndex++;
					resetZoom();
				}
				break;
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

<!-- Background -->
<div class="min-h-screen">
	<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
		<!-- Enhanced Breadcrumb -->
		<nav class="mb-8">
			<ol class="flex items-center space-x-2 text-sm">
				<li>
					<a href="/" class="hover:text-brand-600 font-medium text-neutral-500 transition-colors">
						Strona główna
					</a>
				</li>
				<li>
					<svg class="h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</li>
				<li>
					<a
						href="/products"
						class="hover:text-brand-600 font-medium text-neutral-500 transition-colors"
					>
						Produkty
					</a>
				</li>
				{#if product.expand?.categories && product.expand.categories.length > 0}
					<li>
						<svg class="h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</li>
					<li>
						<a
							href="/products?category={product.expand.categories[0].slug}"
							class="hover:text-brand-600 font-medium text-neutral-500 transition-colors"
						>
							{product.expand.categories[0].name}
						</a>
					</li>
				{/if}
				<li>
					<svg class="h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</li>
				<li class="font-medium text-white">{product.name}</li>
			</ol>
		</nav>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<!-- Enhanced Product Images -->
			<div class="space-y-6">
				<Card class="overflow-hidden">
					{#if allImages.length > 0}
						<div class="space-y-4">
							<!-- Main Image with Enhanced Design -->
							<div class="group relative">
								<div class="aspect-square w-full overflow-hidden rounded-xl bg-white/10">
									<button
										onclick={() => (imageZoomed = true)}
										class="focus:ring-brand-500 h-full w-full rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
										aria-label="Powiększ zdjęcie produktu"
									>
										<img
											src={allImages[selectedImageIndex]}
											alt={product.name}
											class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											onerror={(e) => {
												console.error('Image failed to load:', allImages[selectedImageIndex]);
												console.error('Error event:', e);
											}}
											onload={() => {
												console.log('Image loaded successfully:', allImages[selectedImageIndex]);
											}}
										/>
									</button>
								</div>

								<!-- Zoom overlay -->
								<div
									class="bg-opacity-0 group-hover:bg-opacity-10 pointer-events-none absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-all duration-300 group-hover:opacity-100"
								>
									<div
										class="rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm"
									>
										<svg
											class="mr-1 inline h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
										Kliknij aby powiększyć
									</div>
								</div>

								<!-- Enhanced Badges -->
								<div class="pointer-events-none absolute top-4 left-4 flex flex-col gap-2">
									{#if product.featured}
										<span
											class="bg-brand-600 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
										>
											Polecany
										</span>
									{/if}
									{#if hasDiscount}
										<span
											class="bg-danger rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
										>
											-{discountPercent}%
										</span>
									{/if}
									{#if !inStock}
										<span
											class="rounded-lg bg-neutral-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
										>
											Wyprzedane
										</span>
									{/if}
								</div>
							</div>

							<!-- Enhanced Image Thumbnails -->
							{#if allImages.length > 1}
								<div class="flex space-x-3 overflow-x-auto pb-2">
									{#each allImages as image, index (image)}
										<button
											onclick={() => (selectedImageIndex = index)}
											class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 {selectedImageIndex ===
											index
												? 'border-brand-500 ring-brand-200 ring-2'
												: 'border-white/10 hover:border-white/15'}"
										>
											<img
												src={image}
												alt={`${product.name} widok ${index + 1}`}
												class="h-full w-full object-cover"
											/>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{:else}
						<div class="flex h-96 items-center justify-center rounded-xl bg-white/10">
							<div class="text-center">
								<svg
									class="mx-auto mb-4 h-16 w-16 text-neutral-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<p class="text-neutral-500">Brak zdjęcia produktu</p>
							</div>
						</div>
					{/if}
				</Card>
			</div>

			<!-- Enhanced Product Info -->
			<div class="space-y-8">
				<!-- Header -->
				<div>
					<div class="mb-4 flex items-start justify-between">
						<h1 class="text-3xl leading-tight font-bold text-white lg:text-4xl">
							{product.name}
						</h1>
					</div>

					<!-- Enhanced Price and Stock -->
					<div class="space-y-4">
						<div class="flex items-center gap-4">
							<span class="text-brand-600 text-4xl font-bold">
								{product.price.toFixed(2)} zł
							</span>
							{#if hasDiscount}
								<div class="flex items-center gap-2">
									<span class="text-xl text-neutral-500 line-through">
										{product.compareAtPrice?.toFixed(2)} zł
									</span>
									<span class="bg-danger rounded-lg px-2 py-1 text-sm font-semibold text-white">
										-{discountPercent}%
									</span>
								</div>
							{/if}
						</div>

						<div class="flex items-center gap-3">
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full {inStock ? 'bg-success' : 'bg-danger'}"></div>
								<span class="text-sm font-semibold {stockColor}">
									{stockStatus}
								</span>
							</div>

							{#if product.sku}
								<div class="text-sm text-neutral-500">
									SKU: <span class="font-mono">{product.sku}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Enhanced Categories -->
				{#if product.expand?.categories && product.expand.categories.length > 0}
					<Card glass={true} class="p-4">
						<h3 class="mb-3 text-sm font-semibold text-white">Kategorie</h3>
						<div class="flex flex-wrap gap-2">
							{#each product.expand.categories as category (category.id)}
								<a
									href="/products?category={category.slug}"
									class="bg-brand-50 hover:bg-brand-100 text-brand-700 inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
								>
									<svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
										/>
									</svg>
									{category.name}
								</a>
							{/each}
						</div>
					</Card>
				{/if}

				<!-- Enhanced Description -->
				{#if product.description || product.shortDescription}
					<Card class="p-6">
						<h3 class="mb-4 text-lg font-semibold text-white">Opis produktu</h3>
						<div class="leading-relaxed text-neutral-300">
							{#if product.description}
								<div class="prose prose-sm max-w-none">
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html product.description.replace(/\n/g, '<br>')}
								</div>
							{:else}
								<p>{product.shortDescription}</p>
							{/if}
						</div>
					</Card>
				{/if}

				{#if inStock}
					<!-- Enhanced Purchase Section -->
					<Card class="from-brand-500/100/8 to-accent-500/100/8 border-brand-500/20 border bg-linear-to-br p-6">
						<div class="space-y-6">
							<!-- Quantity Selector -->
							<div>
								<label for="quantity" class="mb-3 block text-sm font-semibold text-white">
									Ilość
								</label>
								<div class="flex items-center gap-4">
									<div
										class="flex items-center rounded-xl border border-white/15 bg-white/5 shadow-sm"
									>
										<Button
											variant="ghost"
											size="sm"
											onclick={decreaseQuantity}
											disabled={quantity <= 1}
											class="rounded-l-xl rounded-r-none border-0"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M20 12H4"
												/>
											</svg>
										</Button>
										<div
											class="min-w-15 px-4 py-2 text-center text-lg font-semibold text-white"
										>
											{quantity}
										</div>
										<Button
											variant="ghost"
											size="sm"
											onclick={increaseQuantity}
											disabled={product.inventory?.trackQuantity &&
												quantity >= product.inventory.quantity}
											class="rounded-l-none rounded-r-xl border-0"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

							<!-- Total Price Display -->
							<div
								class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4"
							>
								<span class="text-lg font-semibold text-white"> Łączna cena: </span>
								<span class="text-brand-600 text-2xl font-bold">
									{(product.price * quantity).toFixed(2)} zł
								</span>
							</div>

							<!-- Add to Cart Button -->
							<Button
								onclick={addToCart}
								class="w-full transform py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
								size="lg"
							>
								<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								Dodaj do koszyka
							</Button>

							<!-- Additional Info -->
							<div class="grid grid-cols-1 gap-4 text-sm text-neutral-400 sm:grid-cols-2">
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
										class="text-brand-500 h-4 w-4"
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
					<!-- Out of Stock -->
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
							<h3 class="mb-2 text-lg font-semibold text-white">Produkt niedostępny</h3>
							<p class="mb-4 text-neutral-400">Ten produkt jest obecnie wyprzedany</p>
							<Button disabled class="w-full" size="lg">Wyprzedane</Button>
						</div>
					</Card>
				{/if}
			</div>
		</div>

		<!-- Enhanced Related Products -->
		{#if relatedProducts && relatedProducts.length > 0}
			<div class="mt-20">
				<Card class="p-8">
					<div class="mb-10 text-center">
						<h2 class="mb-4 text-3xl font-bold text-white">Podobne produkty</h2>
						<p class="mx-auto max-w-2xl text-neutral-400">
							Sprawdź inne produkty, które mogą Cię zainteresować
						</p>
					</div>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each relatedProducts as relatedProduct (relatedProduct.id)}
							<ProductCard product={relatedProduct} />
						{/each}
					</div>
				</Card>
			</div>
		{/if}
	</div>
</div>

<!-- Image Zoom Modal -->
{#if imageZoomed && allImages.length > 0}
	<div
		class="bg-opacity-95 fixed inset-0 z-50 flex items-center justify-center bg-black"
		onkeydown={handleKeyDown}
		role="dialog"
		aria-modal="true"
		aria-label="Podgląd zdjęcia produktu"
		tabindex="-1"
	>
		<!-- Controls Bar -->
		<div class="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
			<div class="flex items-center gap-2 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
				<!-- Navigation arrows for multiple images -->
				{#if allImages.length > 1}
					<button
						onclick={() => {
							selectedImageIndex = Math.max(0, selectedImageIndex - 1);
							resetZoom();
						}}
						disabled={selectedImageIndex === 0}
						class="p-2 text-white transition-colors hover:text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Poprzednie zdjęcie"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				{/if}

				<!-- Zoom controls -->
				<button
					onclick={zoomOut}
					class="p-2 text-white transition-colors hover:text-neutral-300"
					aria-label="Pomniejsz"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
					</svg>
				</button>

				<span class="min-w-15 px-2 text-center text-sm font-medium text-white">
					{Math.round(zoomLevel * 100)}%
				</span>

				<button
					onclick={zoomIn}
					class="p-2 text-white transition-colors hover:text-neutral-300"
					aria-label="Powiększ"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>

				<button
					onclick={resetZoom}
					class="p-2 text-white transition-colors hover:text-neutral-300"
					aria-label="Resetuj powiększenie"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				</button>

				{#if allImages.length > 1}
					<button
						onclick={() => {
							selectedImageIndex = Math.min(allImages.length - 1, selectedImageIndex + 1);
							resetZoom();
						}}
						disabled={selectedImageIndex === allImages.length - 1}
						class="p-2 text-white transition-colors hover:text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Następne zdjęcie"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<!-- Close button -->
		<button
			onclick={closeZoom}
			class="absolute top-4 right-4 z-10 rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:text-neutral-300"
			aria-label="Zamknij podgląd"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		<!-- Image container -->
		<div
			class="relative flex h-full w-full items-center justify-center overflow-hidden p-4 cursor-{zoomLevel >
			1
				? 'grab'
				: 'zoom-in'} {isDragging ? 'cursor-grabbing' : ''}"
			role="button"
			tabindex="0"
			onwheel={handleWheel}
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			onmouseup={handleMouseUp}
			onmouseleave={handleMouseUp}
			onclick={zoomLevel === 1 ? zoomIn : undefined}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					if (zoomLevel === 1) zoomIn();
				}
			}}
			aria-label="Obraz produktu, kliknij aby powiększyć"
		>
			<img
				src={allImages[selectedImageIndex]}
				alt={product.name}
				class="max-w-none transition-transform duration-200 select-none"
				style="transform: scale({zoomLevel}) translate({panX / zoomLevel}px, {panY / zoomLevel}px)"
				draggable="false"
			/>
		</div>

		<!-- Image counter -->
		{#if allImages.length > 1}
			<div class="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
				<div class="rounded-lg bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
					{selectedImageIndex + 1} / {allImages.length}
				</div>
			</div>
		{/if}

		<!-- Instructions -->
		<div class="absolute right-4 bottom-4 space-y-1 text-xs text-white/70">
			<div>Kliknij aby powiększyć</div>
			<div>Przewiń aby zmienić powiększenie</div>
			<div>Przeciągnij aby przesunąć</div>
			<div>ESC aby zamknąć</div>
		</div>
	</div>
{/if}
