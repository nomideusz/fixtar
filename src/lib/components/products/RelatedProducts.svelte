<script lang="ts">
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import type { Product } from '$lib/stores/products.svelte';

	interface Props {
		products: Product[];
		categorySlug?: string;
	}

	let { products, categorySlug = '' }: Props = $props();
</script>

{#if products?.length > 0}
	<section class="mt-16 border-t border-[--ft-line] pt-12">
		<div class="related-header">
			<h2 class="related-title">Podobne produkty</h2>
			<a href="/products?category={categorySlug}" class="related-link">Zobacz wszystkie</a>
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

	.related-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 32px;
	}

	.related-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-top: 6px;
		border-left: 4px solid var(--ft-accent);
		padding-left: 14px;
		text-transform: uppercase;
		line-height: 1;
	}

	.related-link {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--ft-text-strong);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-decoration: none;
		border-bottom: 2px solid var(--ft-accent);
		padding-bottom: 2px;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.related-link:hover {
		color: var(--ft-accent);
		border-color: var(--ft-dark);
	}
</style>
