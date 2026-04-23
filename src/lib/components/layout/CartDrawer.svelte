<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import { TrashIcon, XIcon, UserIcon, UserGearIcon, SignOutIcon } from 'phosphor-svelte';
	import type { TranslationKey } from '$lib/i18n/translations';
	import { cart, userStore } from '$lib/stores';
	import type { CartItem } from '$lib/stores';

	// --- Props ---

	const { toggleCart = () => {}, t = (key: TranslationKey) => key } = $props();

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

	async function handleLogout() {
		userStore.logout();
		try {
			await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
		} catch {
			// Ignore network/logout endpoint failures and continue local sign-out redirect.
		}
		window.location.href = '/';
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

		const focusableSelectors =
			'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

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

	// --- Removal Confirmation ---

	let pendingRemoveId = $state<string | null>(null);
	let pendingClearAll = $state(false);

	function requestRemove(productId: string) {
		pendingRemoveId = productId;
	}

	function confirmRemove() {
		if (pendingRemoveId) {
			cart.removeItem(pendingRemoveId);
			pendingRemoveId = null;
		}
	}

	function cancelRemove() {
		pendingRemoveId = null;
	}

	function requestClearAll() {
		pendingClearAll = true;
	}

	function confirmClearAll() {
		cart.clear();
		pendingClearAll = false;
	}

	function cancelClearAll() {
		pendingClearAll = false;
	}

	// --- Cart Helpers ---

	function formatPrice(value: number): string {
		return value.toFixed(2).replace('.', ',') + ' zł';
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
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
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
		class="bg-surface border-border fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l shadow-2xl sm:max-w-md"
		role="dialog"
		aria-label={t('yourCart')}
		in:fly={{ duration: 250, x: 400, opacity: 1 }}
		out:fly={{ duration: 200, x: 400, opacity: 1 }}
		onintrostart={handleTransitionStart}
		onintroend={handleTransitionEnd}
		onoutrostart={handleTransitionStart}
		onoutroend={handleTransitionEnd}
	>
		<!-- Header -->
		<div class="border-border bg-surface/50 flex shrink-0 items-start justify-between border-b p-6">
			{#if pendingClearAll}
				<div class="flex w-full items-center justify-between">
					<p class="text-text font-medium">Usunąć wszystko?</p>
					<div class="flex gap-2">
						<button
							onclick={confirmClearAll}
							class="bg-danger hover:bg-danger/90 rounded px-4 py-1.5 text-sm font-medium text-white transition-colors"
						>
							Tak
						</button>
						<button
							onclick={cancelClearAll}
							class="border-border text-text hover:bg-surface-subtle rounded border px-4 py-1.5 text-sm font-medium transition-colors"
						>
							Nie
						</button>
					</div>
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					<div class="text-text-muted font-mono text-xs tracking-wider uppercase">
						Koszyk i konto
					</div>
					<div class="flex items-baseline gap-3">
						<h5 class="text-text font-display text-2xl">
							{t('yourCart')} <span class="text-text-muted">({cart.count})</span>
						</h5>
						<span class="bg-success/10 text-success rounded-full px-2.5 py-0.5 text-xs font-medium">
							Bezpieczne zamówienie
						</span>
					</div>

					{#if userStore.current}
						<div class="mt-2 flex flex-wrap items-center gap-4 text-sm">
							<a
								href="/account"
								class="text-text-muted hover:text-accent-text flex items-center gap-1.5 transition-colors"
								onclick={close}
							>
								<UserGearIcon size={16} weight="regular" aria-hidden="true" />
								Moje konto
							</a>
							{#if userStore.current.isAdmin}
								<a
									href="/admin/products"
									class="text-text-muted hover:text-accent-text flex items-center gap-1.5 transition-colors"
									onclick={close}
								>
									<UserGearIcon size={16} weight="regular" aria-hidden="true" />
									Produkty admin
								</a>
							{/if}
							<button
								class="text-text-muted hover:text-danger flex items-center gap-1.5 transition-colors"
								onclick={handleLogout}
							>
								<SignOutIcon size={16} weight="regular" aria-hidden="true" />
								Wyloguj
							</button>
						</div>
					{:else}
						<div class="bg-surface-subtle mt-2 flex flex-col gap-2 rounded-md p-3 text-sm">
							<p class="text-text-muted">
								Zaloguj się, aby szybciej finalizować zamówienia i śledzić historię.
							</p>
							<a
								href="/auth/login"
								class="text-accent-text hover:text-accent-text-hover flex w-fit items-center gap-1.5 font-medium transition-colors"
								onclick={close}
							>
								<UserIcon size={16} weight="regular" aria-hidden="true" />
								Zaloguj się
							</a>
						</div>
					{/if}
				</div>

				<div class="flex items-center gap-2">
					{#if cart.items.length > 0}
						<button
							onclick={requestClearAll}
							class="text-text-muted hover:bg-danger/10 hover:text-danger flex h-8 w-8 items-center justify-center rounded-full transition-colors"
							title={t('clearCart')}
							aria-label={t('clearCart')}
						>
							<TrashIcon size={18} aria-hidden="true" />
						</button>
					{/if}
					<button
						onclick={close}
						class="bg-surface-subtle text-text hover:bg-border flex h-8 w-8 items-center justify-center rounded-full transition-colors"
						aria-label={t('closeCartDrawer')}
					>
						<XIcon size={18} aria-hidden="true" />
					</button>
				</div>
			{/if}
		</div>

		<!-- Body -->
		<div class="flex flex-1 flex-col overflow-hidden">
			{#if cart.items.length === 0}
				<div class="flex flex-1 flex-col items-center justify-center p-8 text-center">
					<div
						class="bg-surface-subtle text-text-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full"
					>
						<TrashIcon size={32} weight="light" aria-hidden="true" />
					</div>
					<p class="text-text-muted mb-6 text-lg">{t('cartEmpty')}</p>
					<Button variant="primary" onclick={close} class="w-full sm:w-auto">
						{t('browseProducts')}
					</Button>
				</div>
			{:else}
				<!-- Items List -->
				<div class="flex-1 space-y-4 overflow-y-auto p-6">
					{#each cart.items as item (item.productId)}
						<div
							class="group border-border bg-surface hover:border-border-strong relative flex gap-4 rounded-md border p-4 shadow-sm transition-colors {pendingRemoveId ===
							item.productId
								? 'border-danger/30 bg-danger/5'
								: ''}"
						>
							<a
								href={productHref(item)}
								class="border-border shrink-0 overflow-hidden rounded-md border bg-white"
								onclick={close}
								aria-label={item.name}
							>
								<img
									src={item.image}
									alt={item.name}
									class="h-20 w-20 object-cover object-center"
									loading="lazy"
								/>
							</a>
							<div class="flex flex-1 flex-col justify-between">
								<div class="pr-6">
									<a
										href={productHref(item)}
										class="text-text hover:text-accent-text line-clamp-2 text-sm leading-snug font-medium transition-colors"
										onclick={close}
									>
										{item.name}
									</a>
									<p class="text-text-muted mt-1 font-mono text-xs">
										{formatPrice(item.price)} szt.
									</p>
								</div>

								<div class="mt-3 flex items-center justify-between">
									<div
										class="border-border bg-surface-subtle flex items-center overflow-hidden rounded border"
									>
										<button
											class="text-text-muted hover:bg-border hover:text-text flex h-8 w-8 items-center justify-center transition-colors"
											onclick={() =>
												cart.updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
											aria-label={t('decreaseQuantity')}
										>
											-
										</button>
										<span class="w-8 text-center font-mono text-sm font-medium"
											>{item.quantity}</span
										>
										<button
											class="text-text-muted hover:bg-border hover:text-text flex h-8 w-8 items-center justify-center transition-colors"
											onclick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
											aria-label={t('increaseQuantity')}
										>
											+
										</button>
									</div>
									<span class="text-text font-mono text-sm font-bold">{itemTotal(item)}</span>
								</div>
							</div>

							<!-- Item Actions -->
							{#if pendingRemoveId === item.productId}
								<div
									class="bg-surface/95 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-md p-4 text-center backdrop-blur-sm"
								>
									<span class="text-text mb-1 text-sm font-medium">Na pewno usunąć?</span>
									<div class="flex gap-2">
										<button
											onclick={confirmRemove}
											class="bg-danger hover:bg-danger/90 rounded px-4 py-1.5 text-sm font-medium text-white transition-colors"
										>
											Usuń
										</button>
										<button
											onclick={cancelRemove}
											class="border-border text-text hover:bg-surface-subtle rounded border px-4 py-1.5 text-sm font-medium transition-colors"
										>
											Anuluj
										</button>
									</div>
								</div>
							{:else}
								<button
									onclick={() => requestRemove(item.productId)}
									class="text-text-muted/50 hover:bg-danger/10 hover:text-danger absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100"
									aria-label={t('remove')}
								>
									<XIcon size={16} aria-hidden="true" />
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<!-- Footer -->
				<div class="border-border bg-surface-subtle/30 shrink-0 border-t p-6">
					<div class="mb-4 flex items-center justify-between text-lg">
						<span class="text-text-muted font-medium">{t('subtotal')}</span>
						<span class="text-text font-mono text-xl font-bold">
							{formatPrice(cart.total)}
						</span>
					</div>
					<p class="text-text-muted mb-4 text-center text-xs">{t('shippingNote')}</p>

					<div class="flex flex-col gap-3">
						<Button
							variant="primary"
							href="/checkout"
							onclick={close}
							class="w-full justify-center"
						>
							{t('proceedToCheckout')}
						</Button>
						<Button variant="outline" onclick={close} class="bg-surface w-full justify-center">
							{t('continueShopping')}
						</Button>
					</div>

					<!-- Trust Badges -->
					<div
						class="text-text-faint mt-6 flex items-center justify-center gap-4"
						aria-label="Zaufane metody płatności"
					>
						<span aria-label="Apple Pay">
							<svg width="24" height="24" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-apple" />
							</svg>
						</span>
						<span aria-label="Google Pay">
							<svg width="24" height="24" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-google-icon" />
							</svg>
						</span>
						<span aria-label="Visa">
							<svg width="32" height="12" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-visa" />
							</svg>
						</span>
						<span aria-label="Mastercard">
							<svg width="24" height="16" fill="currentColor" aria-hidden="true">
								<use href="/sprite.svg#icon-mastercard" />
							</svg>
						</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
