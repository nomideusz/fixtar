<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';

	interface Props {
		products?: Product[];
		error?: string;
	}

	let { products = [], error }: Props = $props();
</script>

<section class="featured">
	<div class="featured-inner">
		<div class="featured-header">
			<div>
				<span class="featured-label">Polecane</span>
				<h2 class="featured-title">Najlepiej Oceniane</h2>
			</div>
			<a href="/products" class="see-all">
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
		padding: clamp(48px, 6vh, 72px) 0;
	}

	.featured-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
	}

	/* ── Header ── */
	.featured-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 32px;
	}

	.featured-label {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--ft-accent);
		display: block;
		margin-bottom: 6px;
	}

	.featured-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.03em;
	}

	/* ── Grid ── */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 16px;
	}

	/* ── See all link ── */
	.see-all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.15s ease, gap 0.15s ease;
	}

	.see-all:hover {
		color: var(--ft-cta);
		gap: 10px;
	}

	/* ── Empty state ── */
	.featured-empty {
		text-align: center;
		padding: 64px 0;
		color: var(--ft-text-muted);
	}

	.featured-link {
		display: inline-block;
		margin-top: 16px;
		color: var(--ft-accent);
		font-weight: 600;
		font-size: 0.85rem;
	}
</style>
