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
				<h2
					class="text-2xl font-bold text-[--ft-text-strong]"
					style="font-family:var(--font-display);letter-spacing:-0.02em"
				>
					Podobne produkty
				</h2>
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
		flex-wrap: nowrap;
		gap: 16px;
		overflow-x: auto;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		margin-right: calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding-right: var(--ft-gutter, clamp(24px, 5vw, 80px));
		padding-bottom: 16px;
	}

	.carousel::-webkit-scrollbar {
		display: none;
	}

	.card {
		flex: 0 0 75%;
		scroll-snap-align: start;
	}

	@media (min-width: 640px) {
		.carousel {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			margin: 0;
			padding: 0;
			overflow: visible;
		}

		.card {
			flex: auto;
		}
	}

	@media (min-width: 1024px) {
		.carousel {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 1440px) {
		.carousel {
			grid-template-columns: repeat(6, 1fr);
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
