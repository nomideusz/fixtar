<script lang="ts">
	import Button from './Button.svelte';
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
	const discountPercent = $derived(hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0);

	// Generate product link with better slug handling
	const productLink = $derived(
		// Use slug if it exists and is not empty, otherwise fall back to ID
		((product.slug && product.slug.trim()) ? product.slug : product.id)
	);

	// Create the full URL
	const productUrl = $derived(`/products/${productLink}`);
</script>

<div class="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-100">
	<!-- Product Link -->
	<a href={productUrl} class="block cursor-pointer">
		<div class="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-neutral-50">
			{#if mainImageUrl}
				<img 
					src={mainImageUrl} 
					alt={product.name}
					class="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
				<div class="hidden items-center justify-center h-64 bg-neutral-50">
					<div class="text-center">
						<svg class="w-12 h-12 text-neutral-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<p class="text-sm text-neutral-500">Zdjęcie niedostępne</p>
					</div>
				</div>
			{:else}
				<!-- Show placeholder when no image URL -->
				<div class="flex items-center justify-center h-64 bg-neutral-50">
					<div class="text-center">
						<svg class="w-12 h-12 text-neutral-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<p class="text-sm text-neutral-500">Brak zdjęcia</p>
					</div>
				</div>
			{/if}
			
			<!-- Professional Badges -->
			<div class="absolute top-3 left-3 flex flex-col gap-2">
				{#if product.featured}
					<span class="bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">Polecany</span>
				{/if}
				{#if hasDiscount}
					<span class="bg-danger text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">-{discountPercent}%</span>
				{/if}
				{#if !inStock}
					<span class="bg-neutral-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">Wyprzedane</span>
				{/if}
			</div>
		</div>
	</a>
	
	<div class="p-5">
		<!-- Product Info -->
		<a href={productUrl} class="block">
			<h3 class="text-base font-semibold text-neutral-900 line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">{product.name}</h3>
			{#if product.shortDescription}
				<p class="text-sm text-neutral-600 line-clamp-2">{product.shortDescription}</p>
			{/if}
		</a>
		
		<!-- Categories -->
		{#if product.expand?.categories && product.expand.categories.length > 0}
			<div class="mt-3 flex flex-wrap gap-1">
				{#each product.expand.categories.slice(0, 2) as category (category)}
					<span class="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
						{category.name}
					</span>
				{/each}
			</div>
		{/if}
		
		<!-- Price and Stock -->
		<div class="mt-3 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="text-lg font-bold text-neutral-900">{product.price.toFixed(2)} zł</span>
				{#if hasDiscount}
					<span class="text-sm text-neutral-500 line-through">{product.compareAtPrice?.toFixed(2)} zł</span>
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
				class="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-300 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
			>
				{inStock ? 'Dodaj do Koszyka' : 'Wyprzedane'}
			</button>
			{#if onQuickView}
				<button
					onclick={() => onQuickView?.(product)}
					aria-label="Szybki podgląd"
					class="px-3 py-2 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 hover:text-neutral-900 rounded-lg transition-colors duration-200"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
</div> 

