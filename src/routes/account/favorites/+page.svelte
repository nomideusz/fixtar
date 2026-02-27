<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { enhance } from '$app/forms';

	const { data } = $props<{ data: PageData }>();

	// Extract data
	const favorites = $derived(data.favorites || []);

	// Animation control
	let visible = $state(false);

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	// Track removal state
	let removing = $state<Record<string, boolean>>({});

	// Mark product as being removed
	function startRemoving(productId: string) {
		removing = { ...removing, [productId]: true };
	}

	// Format discount percentage
	function calculateDiscount(price: number, compareAtPrice: number): number {
		if (!compareAtPrice || compareAtPrice <= price) return 0;
		return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
	}

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>My Favorites | FixTar</title>
	<meta name="description" content="View and manage your favorite products" />
</svelte:head>

<div class="favorites-page">
	<!-- Background elements -->
	<div class="account-bg-elements">
		<div class="account-bg-element account-bg-element-1"></div>
		<div class="account-bg-element account-bg-element-2"></div>
		<div class="account-bg-element account-bg-element-3"></div>
	</div>

	<div class="page-container" in:fade={{ duration: 300 }}>
		<div class="page-header" in:fly={{ y: -20, duration: 400, delay: 200 }}>
			<h1 class="page-title">My Favorites</h1>
			<p class="text-neutral-500">Products you've saved for later</p>
		</div>

		<div class="favorites-container">
			{#if favorites.length === 0}
				<div class="card empty-state-card" in:fly={{ y: 20, duration: 500, delay: 400 }}>
					<div class="cyber-grid"></div>
					<div class="empty-state">
						<p class="text-neutral-500">You don't have any favorites yet.</p>
						<a href="/products" class="btn btn-primary"> Browse Products </a>
					</div>
				</div>
			{:else}
				<div class="products-grid">
					{#each favorites as product, i (product.id)}
						{#if visible}
							<div
								class="product-card-wrapper"
								in:scale={{
									duration: 400,
									delay: 300 + i * 100,
									start: 0.8,
									easing: elasticOut
								}}
							>
								<div class="card product-card">
									<div class="product-badge-container">
										{#if product.featured}
											<span class="product-badge product-badge-indigo">Featured</span>
										{/if}
										{#if product.compareAtPrice && product.compareAtPrice > product.price}
											<span class="product-badge product-badge-red">
												{calculateDiscount(product.price, product.compareAtPrice)}% Off
											</span>
										{/if}
									</div>

									<a href="/products/{product.slug || product.id}" class="product-image-link">
										<img src={product.mainImage} alt={product.name} class="product-image" />
									</a>

									<div class="product-details">
										<h3 class="product-name">
											<a href="/products/{product.slug || product.id}">{product.name}</a>
										</h3>

										<div class="product-price">
											<span class="current-price">{formatCurrency(product.price)}</span>
											{#if product.compareAtPrice && product.compareAtPrice > product.price}
												<span class="compare-price">{formatCurrency(product.compareAtPrice)}</span>
											{/if}
										</div>

										<div class="product-actions">
											<form
												method="POST"
												action="?/removeFavorite"
												use:enhance={() => {
													startRemoving(product.id);
													return ({ update }) => {
														update();
													};
												}}
											>
												<input type="hidden" name="productId" value={product.id} />

												<div class="button-group">
													<a
														href="/products/{product.slug || product.id}"
														class="btn btn-secondary view-button"
													>
														View Details
													</a>

													<button
														type="submit"
														class="btn btn-outline remove-button"
														disabled={removing[product.id]}
													>
														{#if removing[product.id]}
															Removing...
														{:else}
															Remove
														{/if}
													</button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Page layout */
	.favorites-page {
		min-height: calc(100vh - var(--navbar-height) - var(--footer-height));
		position: relative;
	}

	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	/* Page header */
	.page-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.page-title {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
		background: linear-gradient(to right, var(--color-brand-500), var(--color-accent-500));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	/* Card base */
	.card {
		border-radius: var(--radius-lg, 0.5rem);
		overflow: hidden;
	}

	/* Empty state */
	.empty-state-card {
		position: relative;
		overflow: hidden;
		background-color: var(--ft-surface-overlay, rgba(17, 24, 39, 0.9));
		border: 1px solid color-mix(in srgb, var(--color-danger-dark) 30%, transparent);
		backdrop-filter: blur(12px);
		padding: 1.5rem;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		gap: 1rem;
	}

	/* Button */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md, 0.375rem);
		padding: 0.5rem 1rem;
		font-weight: 500;
		transition: all 0.2s ease;
		text-decoration: none;
		cursor: pointer;
	}

	/* Products grid */
	.products-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.products-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.products-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Product card */
	.product-card {
		position: relative;
		overflow: hidden;
		height: 100%;
		background-color: var(--ft-surface-overlay, rgba(17, 24, 39, 0.9));
		border: 1px solid color-mix(in srgb, var(--color-danger-dark) 20%, transparent);
		backdrop-filter: blur(12px);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
		padding: 1rem;
	}

	.product-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--color-danger-dark) 20%, transparent);
	}

	.product-badge-container {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.product-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		border-radius: 9999px;
	}

	.product-badge-indigo {
		background-color: color-mix(in srgb, var(--color-accent-800) 30%, transparent);
		color: var(--color-accent-300, #a5b4fc);
		border: 1px solid color-mix(in srgb, var(--color-accent-700) 30%, transparent);
	}

	.product-badge-red {
		background-color: color-mix(in srgb, var(--color-danger-dark) 30%, transparent);
		color: var(--color-danger-light, #fca5a5);
		border: 1px solid color-mix(in srgb, var(--color-danger-dark) 30%, transparent);
	}

	.product-image-link {
		display: block;
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-md, 0.375rem);
		aspect-ratio: 1 / 1;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s;
	}

	.product-image-link:hover .product-image {
		transform: scale(1.05);
	}

	.product-details {
		padding: 1rem 0 0;
	}

	.product-name {
		font-size: 1.125rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.product-name a {
		color: var(--ft-text);
		text-decoration: none;
		transition: color 0.2s;
	}

	.product-name a:hover {
		color: var(--color-danger-light, #fca5a5);
	}

	.product-price {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.current-price {
		font-weight: 600;
		color: var(--ft-danger);
	}

	.compare-price {
		font-size: 0.875rem;
		color: var(--ft-text-secondary);
		text-decoration: line-through;
	}

	.product-actions {
		margin-top: 1rem;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (min-width: 640px) {
		.button-group {
			flex-direction: row;
		}
	}

	.view-button {
		flex: 1;
		background: linear-gradient(to right, var(--color-danger-dark), var(--color-danger));
		color: white;
	}

	.remove-button {
		flex: 1;
		border: 1px solid color-mix(in srgb, var(--color-danger-dark) 50%, transparent);
		color: var(--ft-danger);
		background-color: transparent;
	}

	.remove-button:hover:not(:disabled) {
		background-color: color-mix(in srgb, var(--color-danger-dark) 30%, transparent);
	}

	/* Background elements */
	.account-bg-elements {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: -10;
		opacity: 0.2;
		pointer-events: none;
	}

	.account-bg-element {
		position: absolute;
		border-radius: 50%;
	}

	.account-bg-element-1 {
		top: 10%;
		left: 20%;
		height: 24rem;
		width: 24rem;
		background-color: var(--color-accent-800, #312e81);
		filter: blur(120px);
	}

	.account-bg-element-2 {
		right: 10%;
		bottom: 20%;
		height: 16rem;
		width: 16rem;
		background-color: var(--color-danger-dark, #7f1d1d);
		filter: blur(100px);
	}

	.account-bg-element-3 {
		top: 40%;
		right: 30%;
		height: 18rem;
		width: 18rem;
		background-color: var(--color-accent-900, #581c87);
		filter: blur(100px);
	}

	/* Cyber grid */
	.cyber-grid {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image:
			linear-gradient(to right, rgba(185, 28, 28, 0.1) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(185, 28, 28, 0.1) 1px, transparent 1px);
		background-size: 20px 20px;
		mask-image: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0.8) 50%,
			rgba(0, 0, 0, 0) 100%
		);
		z-index: -1;
		pointer-events: none;
	}

	/* Set height variables */
	:root {
		--navbar-height: 4rem;
		--footer-height: 25rem;
	}

	/* Responsive adjustments */
	@media (min-width: 640px) {
		:root {
			--navbar-height: 5rem;
		}
	}

	@media (min-width: 768px) {
		:root {
			--navbar-height: 6rem;
			--footer-height: 22rem;
		}
	}
</style>
