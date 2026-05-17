<script lang="ts">
	import type { Product } from '$lib/stores/products.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import { ArrowRightIcon, CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';

	interface Props {
		products?: Product[];
		error?: string;
	}

	let { products = [], error }: Props = $props();

	let page = $state(0);
	const pageSize = 4;

	const totalPages = $derived(Math.max(1, Math.ceil(products.length / pageSize)));
	const visible = $derived(products.slice(page * pageSize, page * pageSize + pageSize));

	function next() {
		page = (page + 1) % totalPages;
	}
	function prev() {
		page = (page - 1 + totalPages) % totalPages;
	}
</script>

<section class="featured" aria-label="Polecane">
	<div class="ft-container">
		<div class="section-head">
			<div>
				<p class="kicker">Polecane</p>
				<h2>Nowe i wybrane</h2>
			</div>
			<a href="/products" class="see-all">
				Zobacz wszystkie
				<ArrowRightIcon size={12} weight="bold" aria-hidden="true" />
			</a>
		</div>

		{#if error}
			<p class="empty">{error}</p>
		{:else if products.length === 0}
			<p class="empty">Brak polecanych produktów.</p>
		{:else}
			<div class="products-wrap">
				{#if totalPages > 1}
					<button class="car-btn prev" aria-label="Poprzedni" onclick={prev}>
						<CaretLeftIcon size={18} weight="bold" aria-hidden="true" />
					</button>
					<button class="car-btn next" aria-label="Następny" onclick={next}>
						<CaretRightIcon size={18} weight="bold" aria-hidden="true" />
					</button>
				{/if}

				<div class="products ft-stagger">
					{#each visible as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>

				{#if totalPages > 1}
					<div class="car-dots" role="tablist" aria-label="Strony">
						{#each Array(totalPages) as _, i (i)}
							<button
								class="dot"
								class:is-active={i === page}
								aria-label="Strona {i + 1}"
								aria-selected={i === page}
								role="tab"
								onclick={() => (page = i)}
							></button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.featured {
		padding: 0 0 56px;
	}

	.section-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		margin-bottom: 28px;
		gap: 24px;
		flex-wrap: wrap;
	}

	.kicker {
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--ft-text-faint);
		font-weight: 600;
		margin: 0 0 8px;
	}

	.section-head h2 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(30px, 3.2vw, 40px);
		letter-spacing: 0.01em;
		text-transform: uppercase;
		margin: 0;
		line-height: 1;
	}

	.see-all {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ft-cta);
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-bottom: 2px solid var(--ft-cta);
		padding-bottom: 4px;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.see-all:hover {
		color: var(--ft-cta-hover);
	}

	.products-wrap {
		position: relative;
	}

	.products {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 18px;
	}

	.empty {
		padding: 48px 0;
		text-align: center;
		font-size: 0.9375rem;
		color: var(--ft-text-muted);
	}

	.car-btn {
		position: absolute;
		top: 110px;
		transform: translateY(-50%);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--ft-line);
		box-shadow: var(--ft-shadow-md);
		display: grid;
		place-items: center;
		color: var(--ft-text);
		z-index: 2;
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.car-btn:hover {
		background: var(--ft-dark);
		color: #fff;
		border-color: var(--ft-dark);
	}

	.car-btn.prev {
		left: -22px;
	}

	.car-btn.next {
		right: -22px;
	}

	.car-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 28px;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ft-line);
		border: 0;
		padding: 0;
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			width var(--dur-fast) ease;
	}

	.dot.is-active {
		background: var(--ft-text);
		width: 20px;
		border-radius: 4px;
	}

	@media (max-width: 1024px) {
		.products {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.products {
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
		}

		.car-btn {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.products {
			grid-template-columns: 1fr;
		}
	}
</style>
