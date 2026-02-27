<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import { cart, notifications } from '$lib/stores';

	interface Props {
		product: Product;
		onQuickView?: (product: Product) => void;
	}

	let { product, onQuickView }: Props = $props();

	// Check if product is in stock
	function isInStock(product: Product): boolean {
		if (!product.inventory?.trackQuantity) return true;
		return product.inventory.quantity > 0;
	}

	// Get stock status text
	function getStockStatus(product: Product): string {
		if (!product.inventory?.trackQuantity) return 'Dostępny';

		const quantity = product.inventory.quantity;
		const lowThreshold = product.inventory.lowStockThreshold || 10;

		if (quantity === 0) return 'Wyprzedany';
		if (quantity <= lowThreshold) return `Mało sztuk (${quantity})`;
		return 'Dostępny';
	}

	// Get stock status color
	function getStockColor(product: Product): string {
		if (!product.inventory?.trackQuantity) return 'text-success';

		const quantity = product.inventory.quantity;
		const lowThreshold = product.inventory.lowStockThreshold || 10;

		if (quantity === 0) return 'text-danger';
		if (quantity <= lowThreshold) return 'text-warning';
		return 'text-success';
	}

	function addToCart() {
		if (!isInStock(product)) return;

		cart.addItem({
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.mainImage || undefined
		});

		notifications.success(`Dodano ${product.name} do koszyka`);
	}

	// Get main image URL - now it's already processed on the server
	const mainImageUrl = $derived(product.mainImage || '');
	const inStock = $derived(isInStock(product));
	const stockStatus = $derived(getStockStatus(product));
	const stockColor = $derived(getStockColor(product));
	const hasDiscount = $derived(product.compareAtPrice && product.compareAtPrice > product.price);
	const discountPercent = $derived(
		hasDiscount
			? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
			: 0
	);

	// Generate product link with better slug handling
	const productLink = $derived(
		// Use slug if it exists and is not empty, otherwise fall back to ID
		product.slug && product.slug.trim() ? product.slug : product.id
	);

	// Create the full URL
	const productUrl = $derived(`/products/${productLink}`);
</script>

<div
	class="group relative overflow-hidden border border-white/6 bg-[rgba(255,255,255,0.03)] transition-all duration-300 hover:border-[rgba(55,138,146,0.15)] hover:bg-[rgba(255,255,255,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
>
	<!-- Product Link -->
	<a href={productUrl} class="block cursor-pointer">
		<div class="relative w-full overflow-hidden bg-white/5" style="aspect-ratio: 4/3;">
			{#if mainImageUrl}
				<img
					src={mainImageUrl}
					alt={product.name}
					class="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
					loading="lazy"
					onerror={(e) => {
						console.warn('Image failed to load:', mainImageUrl);
						const target = e.target as HTMLImageElement;
						if (target) {
							target.style.display = 'none';
							const nextElement = target.nextElementSibling as HTMLElement;
							if (nextElement) {
								nextElement.style.display = 'flex';
							}
						}
					}}
				/>
				<!-- Fallback placeholder shown when image fails to load -->
				<div class="hidden h-full items-center justify-center bg-white/5">
					<div class="text-center">
						<svg
							class="mx-auto mb-2 h-12 w-12 text-neutral-400"
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
						<p class="text-sm text-neutral-500">Zdjęcie niedostępne</p>
					</div>
				</div>
			{:else}
				<!-- Show placeholder when no image URL -->
				<div class="flex h-full items-center justify-center bg-white/5">
					<div class="text-center">
						<svg
							class="mx-auto mb-2 h-12 w-12 text-neutral-400"
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
						<p class="text-sm text-neutral-500">Brak zdjęcia</p>
					</div>
				</div>
			{/if}

			<!-- Professional Badges -->
			<div class="absolute top-3 left-3 flex flex-col gap-2">
				{#if product.featured}
					<span class="bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
						>Polecany</span
					>
				{/if}
				{#if hasDiscount}
					<span class="bg-danger px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
						>-{discountPercent}%</span
					>
				{/if}
				{#if !inStock}
					<span class="bg-neutral-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
						>Wyprzedane</span
					>
				{/if}
			</div>
		</div>
	</a>

	<div class="p-5">
		<!-- Product Info -->
		<a href={productUrl} class="block">
			<h3
				class="group-hover:text-brand-400 mb-1 line-clamp-2 text-base font-semibold text-white transition-colors"
			>
				{product.name}
			</h3>
			{#if product.shortDescription}
				<p class="line-clamp-2 text-sm text-neutral-400">{product.shortDescription}</p>
			{/if}
		</a>

		<!-- Categories -->
		{#if product.expand?.categories && product.expand.categories.length > 0}
			<div class="mt-3 flex flex-wrap gap-1">
				{#each product.expand.categories.slice(0, 2) as category (category)}
					<span class="bg-white/10 px-2 py-0.5 text-xs text-neutral-300">
						{category.name}
					</span>
				{/each}
			</div>
		{/if}

		<!-- Price and Stock -->
		<div class="mt-3 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="text-lg font-bold text-white">{product.price.toFixed(2)} zł</span>
				{#if hasDiscount}
					<span class="text-sm text-neutral-500 line-through"
						>{product.compareAtPrice?.toFixed(2)} zł</span
					>
				{/if}
			</div>
			<span class="text-xs font-medium {stockColor}">
				{stockStatus}
			</span>
		</div>

		<!-- SKU -->
		{#if product.sku}
			<div class="mt-1">
				<span class="text-xs text-neutral-400">SKU: {product.sku}</span>
			</div>
		{/if}

		<!-- Professional Actions -->
		<div class="mt-4 flex gap-2">
			<button
				onclick={addToCart}
				disabled={!inStock}
				class="bg-brand-600 hover:bg-brand-700 flex-1 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-neutral-300"
			>
				{inStock ? 'Dodaj do Koszyka' : 'Wyprzedane'}
			</button>
			{#if onQuickView}
				<button
					onclick={() => onQuickView?.(product)}
					aria-label="Szybki podgląd"
					class="border border-white/15 bg-white/5 px-3 py-2 text-neutral-300 transition-colors duration-200 hover:border-white/25 hover:text-white"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</div>
</div>
