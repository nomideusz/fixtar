<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';

	interface Props {
		products?: Product[];
		error?: string;
	}

	let { products = [], error }: Props = $props();
</script>

<section class="featured ft-section">
	<div class="ft-container">
		<div class="featured-header">
			<h2 class="featured-title">Polecane</h2>
			<a href="/products" class="featured-link">Wszystkie produkty</a>
		</div>

		{#if error}
			<p class="featured-empty">{error}</p>
		{:else if products.length === 0}
			<p class="featured-empty">Brak polecanych produktów.</p>
		{:else}
			<div class="grid ft-stagger">
				{#each products.slice(0, 12) as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.featured-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 32px;
	}

	.featured-title {
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

	.featured-link {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--ft-text-strong);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-decoration: none;
		border-bottom: 2px solid var(--ft-accent);
		padding-bottom: 2px;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.featured-link:hover {
		color: var(--ft-accent);
		border-color: var(--ft-dark);
	}

	.grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 16px;
		overflow-x: auto;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		margin: 0 calc(-1 * var(--ft-gutter, clamp(24px, 5vw, 80px)));
		padding: 0 var(--ft-gutter, clamp(24px, 5vw, 80px)) 16px;
	}

	.grid::-webkit-scrollbar {
		display: none;
	}

	:global(.grid > *) {
		flex: 0 0 75%;
		scroll-snap-align: start;
	}

	@media (min-width: 640px) {
		.grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			margin: 0;
			padding: 0;
			overflow: visible;
		}

		:global(.grid > *) {
			flex: auto;
		}
	}

	@media (min-width: 1024px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 1440px) {
		.grid {
			grid-template-columns: repeat(6, 1fr);
		}
	}

	.featured-empty {
		text-align: center;
		padding: 48px 0;
		color: var(--ft-text-muted);
		font-size: 0.88rem;
	}
</style>
