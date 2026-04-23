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
	<section class="related ft-section-sm">
		<div class="related-header">
			<div class="related-heading-group">
				<span class="ft-label">podobne produkty</span>
				<h2 class="related-title">Zobacz też</h2>
			</div>
			<a href="/products?category={categorySlug}" class="related-link">Wszystkie w kategorii</a>
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
	.related {
		margin-top: 64px;
		border-top: 1px solid var(--ft-line);
		padding-top: 32px;
	}

	.carousel {
		display: flex;
		flex-wrap: nowrap;
		gap: 16px;
		overflow-x: auto;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		margin-right: calc(-1 * var(--ft-gutter, clamp(20px, 4vw, 64px)));
		padding-right: var(--ft-gutter, clamp(20px, 4vw, 64px));
		padding-bottom: 8px;
	}

	.carousel::-webkit-scrollbar {
		display: none;
	}

	.card {
		flex: 0 0 78%;
		scroll-snap-align: start;
	}

	@media (min-width: 640px) {
		.carousel {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
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
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 1440px) {
		.carousel {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	.related-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 32px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--ft-line);
	}

	.related-heading-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.related-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.related-link {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--ft-text-muted);
		text-transform: lowercase;
		letter-spacing: 0.02em;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.related-link:hover {
		color: var(--ft-accent-text);
	}

	@media (max-width: 639px) {
		.related-header {
			flex-direction: column;
			align-items: start;
		}
	}
</style>
