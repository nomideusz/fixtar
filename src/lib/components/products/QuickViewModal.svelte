<script lang="ts">
	import { onMount } from 'svelte';
	import type { Product } from '$lib/stores/products.svelte';
	import { cart, notifications, wishlist } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		product: Product | null;
		onClose: () => void;
	}

	let { product, onClose }: Props = $props();

	let quantity = $state(1);
	let selectedImageIndex = $state(0);
	let dialogRef = $state<HTMLDialogElement | null>(null);

	const images = $derived.by(() => {
		if (!product) return [];
		const imgs: string[] = [];
		if (product.mainImage) imgs.push(product.mainImage);
		if (product.gallery) imgs.push(...product.gallery.filter((g) => g !== product.mainImage));
		return imgs.length > 0 ? imgs : [];
	});

	const inStock = $derived.by(() => {
		if (!product?.inventory?.trackQuantity) return true;
		return product.inventory.quantity > 0;
	});

	const stockLabel = $derived.by(() => {
		if (!product?.inventory?.trackQuantity) return 'Dostępny';
		const q = product.inventory.quantity;
		const low = product.inventory.lowStockThreshold || 10;
		if (q === 0) return 'Wyprzedany';
		if (q <= low) return `Ostatnie ${q} szt.`;
		return 'Dostępny';
	});

	const stockType = $derived.by(() => {
		if (!product?.inventory?.trackQuantity) return 'in';
		const q = product.inventory.quantity;
		const low = product.inventory.lowStockThreshold || 10;
		if (q === 0) return 'out';
		if (q <= low) return 'low';
		return 'in';
	});

	const hasDiscount = $derived(product?.compareAtPrice && product.compareAtPrice > (product?.price ?? 0));
	const discountPercent = $derived(
		hasDiscount ? Math.round(((product!.compareAtPrice! - product!.price) / product!.compareAtPrice!) * 100) : 0
	);
	const categoryName = $derived(product?.expand?.categories?.[0]?.name || product?.categories?.[0] || '');
	const productUrl = $derived(`/products/${product?.slug?.trim() || product?.id}`);
	const isWishlisted = $derived(product ? wishlist.has(product.id) : false);

	function toggleWishlist() {
		if (!product) return;
		const added = wishlist.toggle(product.id);
		notifications.success(added ? `Dodano ${product.name} do ulubionych` : `Usunięto ${product.name} z ulubionych`);
	}

	const shortDesc = $derived.by(() => {
		if (!product?.description) return '';
		const text = product.description.replace(/<[^>]*>/g, '');
		return text.length > 200 ? text.slice(0, 200) + '…' : text;
	});

	function addToCart() {
		if (!product || !inStock) return;
		for (let i = 0; i < quantity; i++) {
			cart.addItem({
				productId: product.id,
				name: product.name,
				price: product.price,
				image: product.mainImage || undefined
			});
		}
		notifications.success(`Dodano ${product.name} do koszyka (${quantity} szt.)`);
		onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if ((e.target as HTMLElement).classList.contains('qv-backdrop')) {
			onClose();
		}
	}

	// Focus trap
	let previousActiveElement: HTMLElement | null = null;

	onMount(() => {
		previousActiveElement = document.activeElement as HTMLElement;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
			previousActiveElement?.focus();
		};
	});
</script>

{#if product}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="qv-backdrop"
		role="dialog"
		aria-modal="true"
		aria-label="Szybki podgląd: {product.name}"
		tabindex="-1"
		onkeydown={handleKeydown}
		onclick={handleBackdropClick}
	>
		<div class="qv-panel">
			<!-- Close button -->
			<button class="qv-close" onclick={onClose} aria-label="Zamknij">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>

			<div class="qv-content">
				<!-- Gallery -->
				<div class="qv-gallery">
					<div class="qv-main-img">
						{#if images.length > 0}
							<img
								src={images[selectedImageIndex]}
								alt={product.name}
								width="400"
								height="400"
								class="qv-img"
							/>
						{:else}
							<div class="qv-img-placeholder">
								<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
									<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
								</svg>
							</div>
						{/if}

						{#if hasDiscount}
							<span class="qv-discount-badge">-{discountPercent}%</span>
						{/if}
					</div>

					{#if images.length > 1}
						<div class="qv-thumbs">
							{#each images.slice(0, 5) as img, i (img)}
								<button
									class="qv-thumb"
									class:is-active={selectedImageIndex === i}
									onclick={() => (selectedImageIndex = i)}
									aria-label="Zdjęcie {i + 1}"
								>
									<img src={img} alt="" width="60" height="60" loading="lazy" />
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Details -->
				<div class="qv-details">
					{#if categoryName}
						<span class="qv-category">{categoryName}</span>
					{/if}

					<h2 class="qv-title">{product.name}</h2>

					<!-- Price -->
					<div class="qv-price-row">
						<span class="qv-price">{product.price.toFixed(2)} zł</span>
						{#if hasDiscount}
							<span class="qv-old-price">{product.compareAtPrice?.toFixed(2)} zł</span>
						{/if}
					</div>

					<!-- Stock -->
					<div class="qv-stock qv-stock--{stockType}">
						<span class="qv-stock-dot"></span>
						{stockLabel}
					</div>

					<!-- Description -->
					{#if shortDesc}
						<p class="qv-desc">{shortDesc}</p>
					{/if}

					<!-- SKU -->
					{#if product.sku}
						<div class="qv-meta">
							<span class="qv-meta-label">SKU:</span>
							<span class="qv-meta-value">{product.sku}</span>
						</div>
					{/if}

					<!-- Wishlist -->
					<button class="qv-wishlist" class:is-active={isWishlisted} onclick={toggleWishlist}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
						</svg>
						{isWishlisted ? 'W ulubionych' : 'Dodaj do ulubionych'}
					</button>

					<!-- Actions -->
					<div class="qv-actions">
						{#if inStock}
							<div class="qv-qty">
								<button
									class="qv-qty-btn"
									onclick={() => quantity = Math.max(1, quantity - 1)}
									aria-label="Zmniejsz ilość"
									disabled={quantity <= 1}
								>−</button>
								<span class="qv-qty-value">{quantity}</span>
								<button
									class="qv-qty-btn"
									onclick={() => (quantity += 1)}
									aria-label="Zwiększ ilość"
								>+</button>
							</div>
							<button class="qv-cart-btn" onclick={addToCart}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
								</svg>
								Dodaj do koszyka
							</button>
						{:else}
							<div class="qv-out-of-stock">Produkt chwilowo niedostępny</div>
						{/if}
					</div>

					<!-- Link to full page -->
					<a href={productUrl} class="qv-full-link" onclick={onClose}>
						Zobacz szczegóły produktu
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.qv-backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		overscroll-behavior: contain;
		animation: backdropFadeIn 0.2s ease-out;
	}

	@keyframes backdropFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.qv-panel {
		position: relative;
		max-width: 900px;
		max-height: 90vh;
		width: 100%;
		background: var(--ft-surface);
		border-radius: var(--radius-md);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
		overflow-y: auto;
		overscroll-behavior: contain;
		animation: panelSlideIn 0.25s ease-out;
	}

	@keyframes panelSlideIn {
		from {
			opacity: 0;
			transform: scale(0.97) translateY(8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.qv-close {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		border: none;
		background: var(--ft-surface);
		color: var(--ft-text-muted);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.15s ease;
		box-shadow: var(--ft-shadow-sm);
	}

	.qv-close:hover {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.qv-content {
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 768px) {
		.qv-content {
			flex-direction: row;
		}
	}

	/* ── Gallery ── */
	.qv-gallery {
		flex: 1;
		padding: 24px;
		background: #fafbfc;
		border-bottom: 1px solid var(--ft-line);
	}

	@media (min-width: 768px) {
		.qv-gallery {
			border-bottom: none;
			border-right: 1px solid var(--ft-line);
			max-width: 420px;
		}
	}

	.qv-main-img {
		position: relative;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 12px;
	}

	.qv-img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.qv-img-placeholder {
		color: var(--ft-text-faint);
	}

	.qv-discount-badge {
		position: absolute;
		top: 8px;
		left: 8px;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: var(--radius-full);
		background: var(--color-danger);
		color: white;
	}

	.qv-thumbs {
		display: flex;
		gap: 8px;
	}

	.qv-thumb {
		width: 56px;
		height: 56px;
		border: 2px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
		cursor: pointer;
		padding: 0;
		background: white;
		transition: border-color 0.15s ease;
	}

	.qv-thumb.is-active {
		border-color: var(--ft-accent);
	}

	.qv-thumb img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* ── Details ── */
	.qv-details {
		flex: 1;
		padding: 28px 24px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.qv-category {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ft-text-faint);
		margin-bottom: 2px;
	}

	.qv-title {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--ft-dark);
		line-height: 1.3;
		margin-bottom: 12px;
	}

	.qv-price-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 8px;
	}

	.qv-price {
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--ft-dark);
		font-variant-numeric: tabular-nums;
	}

	.qv-old-price {
		font-size: 0.88rem;
		color: var(--ft-text-muted);
		text-decoration: line-through;
	}

	.qv-stock {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		font-weight: 600;
		margin-bottom: 14px;
	}

	.qv-stock--in { color: var(--color-success); }
	.qv-stock--low { color: #d97706; }
	.qv-stock--out { color: var(--color-danger); }

	.qv-stock-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
	}

	.qv-desc {
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--ft-text-muted);
		margin-bottom: 12px;
	}

	.qv-meta {
		display: flex;
		gap: 6px;
		font-size: 0.72rem;
		margin-bottom: 16px;
	}

	.qv-meta-label {
		color: var(--ft-text-faint);
		font-weight: 600;
	}

	.qv-meta-value {
		color: var(--ft-text-muted);
	}

	/* ── Actions ── */
	.qv-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: auto;
		padding-top: 16px;
		border-top: 1px solid var(--ft-line);
		margin-bottom: 14px;
	}

	.qv-qty {
		display: flex;
		align-items: center;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.qv-qty-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		min-height: 44px;
		border: none;
		background: transparent;
		color: var(--ft-text-muted);
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.qv-qty-btn:hover:not(:disabled) {
		background: var(--ft-frost);
		color: var(--ft-dark);
	}

	.qv-qty-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.qv-qty-value {
		width: 36px;
		text-align: center;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ft-dark);
		font-variant-numeric: tabular-nums;
	}

	.qv-cart-btn {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		padding: 10px 20px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: var(--ft-accent);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.qv-cart-btn:hover {
		background: var(--ft-accent-hover);
	}

	.qv-out-of-stock {
		flex: 1;
		text-align: center;
		padding: 14px;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--color-danger);
		background: rgba(220, 38, 38, 0.05);
		border-radius: var(--radius-sm);
	}

	/* ── Wishlist button ── */
	.qv-wishlist {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		background: transparent;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s ease;
		min-height: 36px;
		margin-bottom: 4px;
	}

	.qv-wishlist:hover,
	.qv-wishlist.is-active {
		color: #ef4444;
		border-color: #ef4444;
		background: rgba(239, 68, 68, 0.04);
	}

	/* ── Full details link ── */
	.qv-full-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-accent);
		text-decoration: none;
		transition: gap 0.2s ease;
	}

	.qv-full-link:hover {
		gap: 10px;
	}
</style>
