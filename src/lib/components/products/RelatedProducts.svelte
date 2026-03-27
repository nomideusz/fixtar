<script lang="ts">
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import type { Product } from '$lib/stores/products.svelte';
	import { ArrowRightIcon } from 'phosphor-svelte';

	interface Props {
		products: Product[];
		categorySlug?: string;
	}

	let { products, categorySlug = '' }: Props = $props();
</script>

{#if products?.length > 0}
	<section class="mt-16 border-t border-[--ft-line] pt-12">
		<div class="mb-8 flex items-end justify-between">
			<div>
				<h4 class="ft-label mb-2">Polecane</h4>
				<h2 class="text-2xl font-bold text-[--ft-text-strong]" style="font-family:var(--font-display);letter-spacing:-0.02em">Podobne produkty</h2>
			</div>
			<a href="/products?category={categorySlug}" class="see-all">
				Zobacz wszystkie
				<ArrowRightIcon size={14} weight="light" aria-hidden="true" />
			</a>
		</div>
		<div class="carousel ft-stagger">
			{#each products as product (product.id)}
				<div class="card">
					<ProductCard {product} />
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	.carousel {
		display: flex;
		gap: 20px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 8px;
		scrollbar-width: thin;
		scrollbar-color: var(--ft-line) transparent;
	}

	.carousel::-webkit-scrollbar {
		height: 6px;
	}

	.carousel::-webkit-scrollbar-track {
		background: transparent;
	}

	.carousel::-webkit-scrollbar-thumb {
		background: var(--ft-line);
		border-radius: 3px;
	}

	.card {
		flex: 0 0 280px;
		scroll-snap-align: start;
	}

	@media (min-width: 640px) {
		.card {
			flex: 0 0 300px;
		}
	}

	.see-all {
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

	.see-all:hover {
		gap: 10px;
	}
</style>
