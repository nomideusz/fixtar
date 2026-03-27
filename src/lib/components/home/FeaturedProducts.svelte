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
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		border-left: 4px solid var(--ft-accent);
		padding-left: 12px;
		text-transform: uppercase;
	}

	.featured-link {
		font-size: 0.8rem;
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.featured-link:hover {
		color: var(--ft-text-strong);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
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
