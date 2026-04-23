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
			<div class="featured-heading-group">
				<span class="ft-label">polecane</span>
				<h2 class="featured-title">Nowe i wybrane</h2>
			</div>
			<a href="/products" class="featured-link">Zobacz wszystkie</a>
		</div>

		{#if error}
			<p class="featured-empty">{error}</p>
		{:else if products.length === 0}
			<p class="featured-empty">Brak polecanych produktów.</p>
		{:else}
			<div class="ft-stagger grid">
				{#each products.slice(0, 8) as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.featured-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.featured-heading-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.featured-title {
		font-family: var(--font-sans);
		font-size: clamp(1.35rem, 2.6vw, 1.8rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.12;
	}

	.featured-link {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: var(--ft-text-muted);
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.featured-link:hover {
		color: var(--ft-accent-text);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 14px;
		}
	}

	@media (min-width: 1024px) {
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.featured-empty {
		padding: 48px 0;
		text-align: center;
		font-size: 0.9375rem;
		color: var(--ft-text-muted);
	}

	@media (max-width: 639px) {
		.featured-header {
			align-items: start;
			flex-direction: column;
		}
	}
</style>
