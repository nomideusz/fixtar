<script lang="ts">
	import { wishlist } from '$lib/stores';
	import { notifications } from '$lib/stores';
	import type { Product } from '$lib/stores/products.svelte';
	import { HeartIcon, ShoppingCartSimpleIcon, TrashIcon, ImageSquareIcon } from 'phosphor-svelte';
	import { cart } from '$lib/stores';
	import { onMount } from 'svelte';

	let products = $state<Product[]>([]);
	let loading = $state(true);
	let removingId = $state<string | null>(null);

	const isEmpty = $derived(wishlist.count === 0 && !loading);

	async function loadProducts() {
		const currentIds = [...wishlist.items];
		if (currentIds.length === 0) {
			products = [];
			loading = false;
			return;
		}

		try {
			const res = await fetch('/api/products/by-ids', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ids: currentIds })
			});
			const data = await res.json();
			products = data.products || [];
		} catch {
			products = [];
		}
		loading = false;
	}

	onMount(() => {
		loadProducts();
	});

	function removeFromWishlist(product: Product) {
		removingId = product.id;
		setTimeout(() => {
			wishlist.remove(product.id);
			products = products.filter(p => p.id !== product.id);
			notifications.success(`Usunięto ${product.name} z ulubionych`);
			removingId = null;
		}, 200);
	}

	function addToCart(product: Product) {
		cart.addItem({
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.mainImage || undefined
		});
		notifications.success(`Dodano ${product.name} do koszyka`);
	}

	function clearAll() {
		wishlist.clear();
		products = [];
		notifications.success('Wyczyszczono listę ulubionych');
	}

	function formatPrice(v: number): string {
		return v.toFixed(2).replace('.', ',') + '\u00a0zł';
	}
</script>

<svelte:head>
	<title>Ulubione — FixTar</title>
	<meta name="description" content="Twoje ulubione produkty" />
</svelte:head>

<div class="fav">
	<!-- Header -->
	<div class="fav-header">
		<div>
			<h1 class="fav-title">Ulubione</h1>
			{#if products.length > 0}
				<p class="fav-count">{products.length} {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktów'}</p>
			{/if}
		</div>
		{#if products.length > 1}
			<button class="fav-clear" onclick={clearAll}>
				<TrashIcon size={14} weight="bold" aria-hidden="true" />
				Wyczyść wszystko
			</button>
		{/if}
	</div>

	<!-- Loading -->
	{#if loading}
		<div class="fav-grid">
			{#each Array(3) as _, i}
				<div class="fav-item fav-skeleton">
					<div class="fav-item-img skeleton-pulse"></div>
					<div class="fav-item-body">
						<div class="skeleton-line skeleton-line--wide"></div>
						<div class="skeleton-line skeleton-line--narrow"></div>
					</div>
				</div>
			{/each}
		</div>

	<!-- Empty state -->
	{:else if isEmpty}
		<div class="fav-empty">
			<span class="fav-empty-icon"><HeartIcon size={48} weight="light" aria-hidden="true" /></span>
			<p class="fav-empty-title">Brak ulubionych produktów</p>
			<p class="fav-empty-text">
				Kliknij ikonę serca na stronie produktu,<br />aby dodać go do ulubionych.
			</p>
			<a href="/products" class="fav-empty-link">Przeglądaj produkty →</a>
		</div>

	<!-- Products -->
	{:else}
		<div class="fav-grid">
			{#each products as product (product.id)}
				<div class="fav-item" class:is-removing={removingId === product.id}>
					<!-- Image -->
					<a href="/products/{product.slug || product.id}" class="fav-item-img-link">
						<div class="fav-item-img">
							{#if product.mainImage}
								<img src={product.mainImage} alt={product.name} loading="lazy" width="200" height="200" />
							{:else}
								<span style="color:var(--ft-text-faint)"><ImageSquareIcon size={32} weight="light" aria-hidden="true" /></span>
							{/if}
						</div>
					</a>

					<!-- Info -->
					<div class="fav-item-body">
						<a href="/products/{product.slug || product.id}" class="fav-item-name">
							{product.name}
						</a>

						<div class="fav-item-price-row">
							<span class="fav-item-price">{formatPrice(product.price)}</span>
							{#if product.compareAtPrice && product.compareAtPrice > product.price}
								<span class="fav-item-old-price">{formatPrice(product.compareAtPrice)}</span>
							{/if}
						</div>

						{#if product.inventory?.trackQuantity && product.inventory.quantity <= 0}
							<span class="fav-item-stock fav-item-stock--out">Niedostępny</span>
						{:else}
							<span class="fav-item-stock">Dostępny</span>
						{/if}

						<!-- Actions -->
						<div class="fav-item-actions">
							<button
								class="fav-btn-cart"
								onclick={() => addToCart(product)}
								disabled={product.inventory?.trackQuantity && product.inventory.quantity <= 0}
							>
								<ShoppingCartSimpleIcon size={16} weight="bold" aria-hidden="true" />
								Do koszyka
							</button>
							<button
								class="fav-btn-remove"
								onclick={() => removeFromWishlist(product)}
								aria-label="Usuń z ulubionych"
							>
								<TrashIcon size={16} weight="bold" aria-hidden="true" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* ── Page ── */
	.fav {
		min-height: 300px;
	}

	/* ── Header ── */
	.fav-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
	}

	.fav-title {
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 3vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
	}

	.fav-count {
		font-size: 0.8rem;
		color: var(--ft-text-muted);
		margin-top: 2px;
	}

	.fav-clear {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		min-height: 44px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		background: none;
		border: 1px solid var(--ft-line);
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
		white-space: nowrap;
	}

	.fav-clear:hover {
		color: var(--ft-cta);
		border-color: var(--ft-cta);
	}

	/* ── Grid ── */
	.fav-grid {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: var(--ft-line);
		border: 1px solid var(--ft-line);
	}

	/* ── Item ── */
	.fav-item {
		display: flex;
		gap: 16px;
		padding: 16px;
		background: var(--ft-surface);
		transition: opacity 0.2s ease, background-color 0.15s ease;
	}

	.fav-item:hover {
		background: var(--ft-frost);
	}

	.fav-item.is-removing {
		opacity: 0.3;
		pointer-events: none;
	}

	@media (min-width: 640px) {
		.fav-item {
			gap: 20px;
			padding: 20px;
		}
	}

	/* ── Image ── */
	.fav-item-img-link {
		display: block;
		flex-shrink: 0;
		text-decoration: none;
	}

	.fav-item-img {
		width: 96px;
		height: 96px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		overflow: hidden;
	}

	@media (min-width: 640px) {
		.fav-item-img {
			width: 120px;
			height: 120px;
		}
	}

	.fav-item-img img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 8px;
	}

	/* ── Body ── */
	.fav-item-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.fav-item-name {
		font-family: var(--font-display);
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--ft-dark);
		text-decoration: none;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.15s;
	}

	.fav-item-name:hover {
		color: var(--ft-accent);
	}

	/* ── Price ── */
	.fav-item-price-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-top: 2px;
	}

	.fav-item-price {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 800;
		color: var(--ft-cta);
		letter-spacing: -0.02em;
	}

	.fav-item-old-price {
		font-size: 0.78rem;
		color: var(--ft-text-faint);
		text-decoration: line-through;
	}

	/* ── Stock ── */
	.fav-item-stock {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--color-success);
	}

	.fav-item-stock--out {
		color: var(--color-danger);
	}

	/* ── Actions ── */
	.fav-item-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: auto;
		padding-top: 8px;
	}

	.fav-btn-cart {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0 16px;
		height: 38px;
		min-height: 44px;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--ft-cta);
		background: transparent;
		border: 2px solid var(--ft-cta);
		cursor: pointer;
		transition: background-color 0.15s, color 0.15s;
		white-space: nowrap;
	}

	.fav-btn-cart:hover {
		background: var(--ft-cta);
		color: white;
	}

	.fav-btn-cart:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		border-color: var(--ft-text-faint);
		color: var(--ft-text-faint);
	}

	.fav-btn-cart:disabled:hover {
		background: transparent;
		color: var(--ft-text-faint);
	}

	.fav-btn-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		min-height: 44px;
		min-width: 44px;
		background: none;
		border: 1px solid var(--ft-line);
		color: var(--ft-text-faint);
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
	}

	.fav-btn-remove:hover {
		color: var(--ft-cta);
		border-color: var(--ft-cta);
	}

	/* ── Empty State ── */
	.fav-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 64px 24px;
		border: 1px solid var(--ft-line);
		background: var(--ft-frost);
	}

	.fav-empty-icon {
		color: var(--ft-text-faint);
		margin-bottom: 16px;
		display: flex;
	}

	.fav-empty-title {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--ft-dark);
		margin-bottom: 6px;
	}

	.fav-empty-text {
		font-size: 0.85rem;
		color: var(--ft-text-muted);
		line-height: 1.6;
		margin-bottom: 20px;
	}

	.fav-empty-link {
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--ft-accent);
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.fav-empty-link:hover {
		opacity: 0.7;
	}

	/* ── Skeleton ── */
	.fav-skeleton {
		pointer-events: none;
	}

	.skeleton-pulse {
		background: linear-gradient(90deg, var(--ft-frost) 25%, var(--ft-line) 50%, var(--ft-frost) 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s ease-in-out infinite;
	}

	.skeleton-line {
		height: 14px;
		border-radius: 2px;
		background: linear-gradient(90deg, var(--ft-frost) 25%, var(--ft-line) 50%, var(--ft-frost) 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s ease-in-out infinite;
	}

	.skeleton-line--wide {
		width: 70%;
		margin-bottom: 8px;
	}

	.skeleton-line--narrow {
		width: 40%;
	}

	@keyframes skeleton-shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
