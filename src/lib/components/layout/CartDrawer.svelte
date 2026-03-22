<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import type { TranslationKey } from '$lib/i18n/translations';
	import { cart } from '$lib/stores';
	import type { CartItem } from '$lib/stores';

	// --- Props ---

	const {
		toggleCart = () => {},
		t = (key: TranslationKey) => key
	} = $props();

	// --- Drawer State ---

	let isOpen = $state(false);
	let isTransitioning = $state(false);
	let drawerElement = $state<HTMLDivElement | null>(null);

	export function openDrawer() {
		isOpen = true;
	}

	export function closeDrawer() {
		isOpen = false;
	}

	export function toggleDrawer() {
		if (!isTransitioning) isOpen = !isOpen;
	}

	// --- Event Handlers ---

	function close() {
		toggleCart();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen && !isTransitioning) close();
	}

	function handleTransitionStart() {
		isTransitioning = true;
	}

	function handleTransitionEnd() {
		isTransitioning = false;
	}

	// Focus trap
	$effect(() => {
		if (!isOpen || !drawerElement) return;

		const focusableSelectors = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

		// Focus the first focusable element
		const firstFocusable = drawerElement.querySelector<HTMLElement>(focusableSelectors);
		firstFocusable?.focus();

		function handleFocusTrap(e: KeyboardEvent) {
			if (e.key !== 'Tab') return;

			const focusableElements = drawerElement!.querySelectorAll<HTMLElement>(focusableSelectors);
			const first = focusableElements[0];
			const last = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last?.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first?.focus();
				}
			}
		}

		document.addEventListener('keydown', handleFocusTrap);
		return () => document.removeEventListener('keydown', handleFocusTrap);
	});

	// Close on outside click
	$effect(() => {
		if (!isOpen) return;

		function handleOutsideClick(event: MouseEvent) {
			if (isTransitioning || !drawerElement) return;

			const target = event.target as HTMLElement;
			if (target.closest('[data-cart-toggle]')) return;
			if (!drawerElement.contains(target)) close();
		}

		document.addEventListener('click', handleOutsideClick, true);
		return () => document.removeEventListener('click', handleOutsideClick, true);
	});

	// Sync with external cart state events
	$effect(() => {
		function handleCartStateChange(e: Event) {
			const detail = (e as CustomEvent<{ isOpen: boolean }>).detail;
			if (detail && typeof detail.isOpen === 'boolean') {
				isOpen = detail.isOpen;
			}
		}

		window.addEventListener('cartStateChange', handleCartStateChange);
		return () => window.removeEventListener('cartStateChange', handleCartStateChange);
	});

	// --- Cart Helpers ---

	function formatPrice(value: number): string {
		return '$' + value.toFixed(2);
	}

	function itemTotal(item: CartItem): string {
		return formatPrice(item.price * item.quantity);
	}

	function productHref(item: CartItem): string {
		return `/products/${encodeURIComponent(item.productId)}`;
	}
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		role="button"
		tabindex="0"
		class="cart-backdrop"
		onclick={close}
		onkeydown={handleKeydown}
		transition:fade={{ duration: 150 }}
		onintrostart={handleTransitionStart}
		onintroend={handleTransitionEnd}
		onoutrostart={handleTransitionStart}
		onoutroend={handleTransitionEnd}
	></div>

	<!-- Drawer -->
	<div
		bind:this={drawerElement}
		class="cart-drawer"
		role="dialog"
		aria-label={t('yourCart')}
		in:fly={{ duration: 300, x: 400 }}
		out:fly={{ duration: 300, x: 400 }}
		onintrostart={handleTransitionStart}
		onintroend={handleTransitionEnd}
		onoutrostart={handleTransitionStart}
		onoutroend={handleTransitionEnd}
	>
		<!-- Header -->
		<div class="cart-drawer__header">
			<h5 class="cart-drawer__title">
				{t('yourCart')} ({cart.count})
			</h5>
			<div class="cart-drawer__actions">
				<button
					onclick={() => cart.clear()}
					class="cart-drawer__icon-btn cart-drawer__icon-btn--clear"
					title={t('clearCart')}
					aria-label={t('clearCart')}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
				<button
					onclick={close}
					class="cart-drawer__icon-btn cart-drawer__icon-btn--close"
					aria-label={t('closeCartDrawer')}
				>
					✕
				</button>
			</div>
		</div>

		<!-- Body -->
		<div class="cart-drawer__body">
			{#if cart.items.length === 0}
				<div class="cart-drawer__empty">
					<p class="cart-drawer__empty-text">{t('cartEmpty')}</p>
					<Button variant="primary" class="cart-drawer__empty-button" onclick={close}>
						{t('browseProducts')}
					</Button>
				</div>
			{:else}
				<!-- Items -->
				<div class="cart-drawer__items">
					{#each cart.items as item (item.productId)}
						<div class="cart-item">
							<div class="cart-item__content">
								<a
									href={productHref(item)}
									class="cart-item__image-link"
									onclick={close}
									aria-label={item.name}
								>
									<img src={item.image} alt={item.name} class="cart-item__image" />
								</a>
								<div class="cart-item__details">
									<a href={productHref(item)} class="cart-item__name-link" onclick={close}>
										<p class="cart-item__name">{item.name}</p>
									</a>
									<p class="cart-item__price">
										{formatPrice(item.price)} × {item.quantity} = {itemTotal(item)}
									</p>
									<div class="cart-item__quantity">
										<button
											class="cart-item__quantity-btn cart-item__quantity-btn--minus"
											onclick={() =>
												cart.updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
											aria-label={t('decreaseQuantity')}
										>
											-
										</button>
										<span class="cart-item__quantity-display">{item.quantity}</span>
										<button
											class="cart-item__quantity-btn cart-item__quantity-btn--plus"
											onclick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
											aria-label={t('increaseQuantity')}
										>
											+
										</button>
									</div>
								</div>
							</div>
							<button
								onclick={() => cart.removeItem(item.productId)}
								class="cart-drawer__icon-btn cart-drawer__icon-btn--remove"
								aria-label={t('remove')}
							>
								✕
							</button>
						</div>
					{/each}
				</div>

				<!-- Footer -->
				<div class="cart-drawer__footer">
					<div class="cart-drawer__summary">
						<span class="cart-drawer__summary-label">{t('subtotal')}</span>
						<span class="cart-drawer__summary-price">
							{formatPrice(cart.total)}
						</span>
					</div>
					<p class="cart-drawer__shipping-note">{t('shippingNote')}</p>
					<Button
						variant="primary"
						fullWidth
						href="/checkout"
						onclick={close}
						class="cart-drawer__checkout-btn"
					>
						{t('proceedToCheckout')}
					</Button>
					<Button variant="outline" fullWidth onclick={close}>
						{t('continueShopping')}
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.cart-backdrop {
		position: fixed;
		inset: 0;
		z-index: 150;
		background-color: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
	}

	.cart-drawer {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 151;
		display: flex;
		height: 100%;
		width: min(100%, 36rem);
		flex-direction: column;
		background-color: var(--ft-surface);
		box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.22);
		border-left: 1px solid var(--ft-line);
	}

	@media (min-width: 1280px) {
		.cart-drawer {
			width: min(100%, 38rem);
		}
	}

	.cart-drawer__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--ft-frost);
		padding: 1rem 1.25rem;
		color: var(--ft-text);
		border-bottom: 1px solid var(--ft-line);
	}

	.cart-drawer__title {
		font-family: var(--font-heading);
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.cart-drawer__actions {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.cart-drawer__icon-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.45rem;
		border-radius: var(--radius-md);
		font-size: 0.95rem;
		line-height: 1;
		transition:
			color 0.2s,
			background-color 0.2s;
		color: var(--ft-text-muted);
	}

	.cart-drawer__icon-btn:hover {
		background-color: var(--ft-frost);
		transform: translateY(-1px);
	}

	.cart-drawer__icon-btn--close:hover {
		color: var(--ft-text);
	}

	.cart-drawer__icon-btn--clear:hover,
	.cart-drawer__icon-btn--remove:hover {
		color: var(--ft-danger);
		background-color: color-mix(in srgb, var(--ft-danger) 12%, transparent);
	}

	.cart-drawer__body {
		display: flex;
		flex: 1;
		min-height: 0;
		flex-direction: column;
		padding: 1rem 1.25rem;
	}

	.cart-drawer__empty {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	:global(.cart-drawer__empty-button) {
		margin-top: 0.5rem;
	}

	.cart-drawer__items {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.cart-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid var(--ft-line);
		background-color: var(--ft-surface);
		padding: 0.875rem;
		border-radius: var(--radius-md);
	}

	.cart-item__content {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.cart-item__image {
		height: 6rem;
		width: 6rem;
		border-radius: var(--radius-md);
		object-fit: cover;
		border: 1px solid var(--ft-line);
	}

	.cart-item__image-link {
		display: inline-flex;
		border-radius: var(--radius-md);
	}

	.cart-item__image-link:focus-visible,
	.cart-item__name-link:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.cart-item__details {
		margin-left: 0.875rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		min-width: 0;
	}

	.cart-item__name {
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.35;
		color: var(--ft-text);
	}

	.cart-item__name-link {
		text-decoration: none;
	}

	.cart-item__name-link:hover .cart-item__name {
		color: var(--ft-accent);
	}

	.cart-item__price {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ft-accent);
	}

	.cart-item__quantity {
		margin-top: 0.375rem;
		display: flex;
		align-items: center;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		overflow: hidden;
		width: fit-content;
	}

	.cart-item__quantity-btn {
		min-width: 2rem;
		min-height: 2rem;
		padding: 0 0.5rem;
		background-color: var(--ft-frost);
		transition:
			background-color 0.2s,
			color 0.2s;
		border: none;
		cursor: pointer;
		color: var(--ft-text);
		font-weight: 600;
		font-size: 0.95rem;
		line-height: 1;
		box-shadow: inset 0 0 0 1px transparent;
	}

	.cart-item__quantity-btn:hover {
		background-color: rgba(55, 138, 146, 0.1);
		color: var(--ft-accent);
		box-shadow: inset 0 0 0 1px var(--ft-accent);
	}

	:global(.cart-drawer__checkout-btn:hover),
	:global(.cart-drawer__footer .btn-outline:hover) {
		transform: translateY(-1px);
	}

	.cart-item__quantity-btn--minus {
		border-top-left-radius: var(--radius-sm);
		border-bottom-left-radius: var(--radius-sm);
	}

	.cart-item__quantity-btn--plus {
		border-top-right-radius: var(--radius-sm);
		border-bottom-right-radius: var(--radius-sm);
	}

	.cart-item__quantity-display {
		background-color: var(--ft-surface);
		min-height: 2rem;
		padding: 0.2rem 0.5rem;
		color: var(--ft-text);
		min-width: 2rem;
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-left: 1px solid var(--ft-line);
		border-right: 1px solid var(--ft-line);
	}

	.cart-drawer__footer {
		margin-top: 1rem;
		border-top: 1px solid var(--ft-line);
		padding-top: 1rem;
	}

	.cart-drawer__summary-label,
	.cart-drawer__empty-text {
		color: var(--ft-text-muted);
		font-size: 0.875rem;
	}

	.cart-drawer__summary {
		margin-bottom: 0.375rem;
		display: flex;
		justify-content: space-between;
	}

	.cart-drawer__summary-price {
		font-weight: 600;
		color: var(--ft-text);
		font-size: 1.125rem;
		line-height: 1.2;
	}

	.cart-drawer__shipping-note {
		margin-bottom: 0.875rem;
		font-size: 0.875rem;
		line-height: 1.4;
		color: var(--ft-text-muted);
	}

	:global(.cart-drawer__checkout-btn) {
		margin-bottom: 0.5rem;
	}
</style>
