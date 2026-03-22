<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();

	function handleImageError(e: Event) {
		const target = e.target as HTMLImageElement;
		if (target) {
			target.style.display = 'none';
			const nextElement = target.nextElementSibling as HTMLElement;
			if (nextElement) {
				nextElement.style.display = 'flex';
			}
		}
	}
</script>

{#snippet imagePlaceholder()}
	<div class="flex h-full w-full items-center justify-center">
		<svg
			class="h-8 w-8 text-[--ft-text-faint]"
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
	</div>
{/snippet}

<Card class="p-6">
	<div class="flex items-center gap-6">
		<div class="shrink-0">
			<div class="h-24 w-24 overflow-hidden rounded-xl bg-[--ft-frost]">
				{#if product.mainImage}
					<img
						src={product.mainImage}
						alt={product.name}
						class="h-full w-full object-cover"
						loading="lazy"
						width="96"
						height="96"
						onerror={handleImageError}
					/>
					<div class="hidden h-full w-full items-center justify-center">
						{@render imagePlaceholder()}
					</div>
				{:else}
					{@render imagePlaceholder()}
				{/if}
			</div>
		</div>
		<div class="min-w-0 flex-1">
			<h3 class="mb-1 text-lg font-semibold text-[--ft-text]">{product.name}</h3>
			{#if product.shortDescription}
				<p class="mb-3 line-clamp-2 text-sm text-[--ft-text-faint]">
					{product.shortDescription}
				</p>
			{/if}

			{#if product.expand?.categories && product.expand.categories.length > 0}
				<div class="mb-3 flex flex-wrap gap-1">
					{#each product.expand.categories.slice(0, 3) as category (category)}
						<span class="bg-brand-50 text-brand-600 rounded-md px-2 py-1 text-xs font-medium">
							{category.name}
						</span>
					{/each}
				</div>
			{/if}

			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span class="text-brand-600 text-xl font-bold">{product.price.toFixed(2)} zł</span>
					{#if product.compareAtPrice && product.compareAtPrice > product.price}
						<span class="text-sm text-[--ft-text-muted] line-through"
							>{product.compareAtPrice.toFixed(2)} zł</span
						>
					{/if}
				</div>
				<Button href="/products/{product.slug || product.id}" size="sm">
					Zobacz szczegóły
				</Button>
			</div>
		</div>
	</div>
</Card>
