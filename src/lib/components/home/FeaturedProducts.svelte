<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';

	interface Props {
		products?: Product[];
		error?: string;
		title?: string;
	}

	let { products = [], error, title = 'Bestsellery' }: Props = $props();
</script>

<section class="featured">
	<div class="featured-inner">
		<div class="featured-header">
			<h2 class="featured-title">{title}</h2>
			<a href="/products" class="featured-all">
				Wszystkie produkty
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
			</a>
		</div>

		{#if error}
			<p class="featured-empty">{error}</p>
		{:else if products.length === 0}
			<div class="featured-empty">
				<p>Brak polecanych produktów.</p>
				<a href="/products" class="featured-link">Zobacz wszystkie produkty →</a>
			</div>
		{:else}
			<div class="grid">
				{#each products.slice(0, 8) as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.featured {
		padding: clamp(40px, 5vh, 56px) 0;
	}

	.featured-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
	}

	.featured-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.featured-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.5rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
	}

	.featured-all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.15s ease, gap 0.15s ease;
	}

	.featured-all:hover {
		color: var(--ft-dark);
		gap: 10px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 12px;
	}

	.featured-empty {
		text-align: center;
		padding: 48px 0;
		color: var(--ft-text-muted);
		font-size: 0.9rem;
	}

	.featured-link {
		display: inline-block;
		margin-top: 12px;
		color: var(--ft-accent);
		font-weight: 600;
		font-size: 0.85rem;
	}
</style>
