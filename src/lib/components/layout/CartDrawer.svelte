<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { FiniteStateMachine } from 'runed';

    import Button from '$lib/components/ui/Button.svelte';
    import type { TranslationKey } from '$lib/i18n/translations';
    import { cart } from '$lib/stores';
    import type { CartItem as StoreCartItem } from '$lib/stores';
    import type { CartItem } from '$lib/types';

    // Simplified 2-state FSM — Svelte transitions handle opening/closing animations
    const drawerState = new FiniteStateMachine<"open" | "closed", "toggle" | "open" | "close">("closed", {
        closed: {
            toggle: "open",
            open: "open"
        },
        open: {
            toggle: "closed",
            close: "closed"
        }
    });

    // Derived from FSM — no $effect anti-pattern
    let isOpen = $derived(drawerState.current === "open");

    // Track CSS transition state
    let isTransitioning = $state(false);

    function handleTransitionStart() {
        isTransitioning = true;
    }

    function handleTransitionEnd() {
        isTransitioning = false;
    }

    // Props
    const {
        toggleCart = () => {},
        currentLanguage = 'en',
        t = (key: TranslationKey) => key
    } = $props();

    let cartDrawerElement = $state<HTMLDivElement | null>(null);

    onMount(() => {
        function handleDocumentClick(event: MouseEvent) {
            if (!isOpen || isTransitioning || !cartDrawerElement) return;

            const target = event.target as HTMLElement;

            if (target.closest('[data-cart-toggle]')) return;

            if (!cartDrawerElement.contains(target)) {
                closeDrawer();
                toggleCart();
            }
        }

        document.addEventListener('click', handleDocumentClick, true);

        return () => {
            document.removeEventListener('click', handleDocumentClick, true);
        };
    });

    export function openDrawer() {
        drawerState.send("open");
    }

    export function closeDrawer() {
        drawerState.send("close");
    }

    export function toggleDrawer() {
        if (!isTransitioning) {
            drawerState.send("toggle");
        }
    }

    // Handle keyboard events
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && isOpen && !isTransitioning) {
            closeDrawer();
            toggleCart();
        }
    }

    // Sync with external cart state events (no browser guard needed — $effect only runs client-side)
    $effect(() => {
        const handleCartStateChange = (e: Event) => {
            const customEvent = e as CustomEvent<{isOpen: boolean}>;

            if (customEvent.detail && typeof customEvent.detail.isOpen === 'boolean') {
                if (customEvent.detail.isOpen) {
                    drawerState.send("open");
                } else {
                    drawerState.send("close");
                }
            }
        };

        window.addEventListener('cartStateChange', handleCartStateChange);

        return () => {
            window.removeEventListener('cartStateChange', handleCartStateChange);
        };
    });

    // Helper to convert flat store items to nested CartItem structure
    function toCartItems(storeItems: StoreCartItem[]): CartItem[] {
        return storeItems.map(item => ({
            id: item.productId,
            product: {
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image ?? '',
                category: ''
            },
            quantity: item.quantity
        }));
    }

    // Use direct rune-based store access — no $store needed
    let currentItems = $derived(toCartItems(cart.items));
    let cartTotal = $derived(cart.total);
    let cartItemCount = $derived(cart.count);

    function clearCart() {
        cart.clear();
    }

    function removeItem(productId: string) {
        cart.removeItem(productId);
    }

    function updateQuantity(productId: string, quantity: number) {
        cart.updateQuantity(productId, quantity);
    }

    function handleButtonClick(e: MouseEvent) {
        toggleCart();
    }

    function handleBackdropClick(e: MouseEvent) {
        toggleCart();
    }

    function getItemTotal(item: CartItem): string {
        const price = parseFloat(item.product.price.toString());
        return (price * item.quantity).toFixed(2);
    }
</script>

{#if isOpen}
    <!-- Backdrop -->
    <div
        role="button"
        tabindex="0"
        class="cart-backdrop"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
        transition:fade={{ duration: 150 }}
        onintrostart={handleTransitionStart}
        onintroend={handleTransitionEnd}
        onoutrostart={handleTransitionStart}
        onoutroend={handleTransitionEnd}
    ></div>

    <!-- Cart drawer -->
    <div
        bind:this={cartDrawerElement}
        class="cart-drawer"
        in:fly={{ duration: 300, x: 400 }}
        out:fly={{ duration: 300, x: 400 }}
        onintrostart={handleTransitionStart}
        onintroend={handleTransitionEnd}
        onoutrostart={handleTransitionStart}
        onoutroend={handleTransitionEnd}
    >
        <div class="cart-drawer__header">
            <h5 class="cart-drawer__title">
                {t('yourCart')} ({cartItemCount})
            </h5>
            <div class="cart-drawer__actions">
                <button
                    onclick={clearCart}
                    class="cart-drawer__icon-btn text-neutral-300 hover:text-danger"
                    title={t('remove')}
                    aria-label={t('remove')}
                >
                    🗑️
                </button>
                <button
                    onclick={handleButtonClick}
                    class="cart-drawer__icon-btn text-neutral-300 hover:text-white"
                    aria-label="Close cart drawer"
                >
                    ✕
                </button>
            </div>
        </div>

        <div class="cart-drawer__body">
            {#if !Array.isArray(currentItems) || currentItems.length === 0}
                <div class="cart-drawer__empty">
                    <p class="text-neutral-400">{t('cartEmpty')}</p>
                    <Button
                        variant="primary"
                        class="cart-drawer__empty-button"
                        onclick={handleButtonClick}
                    >{t('browseProducts')}</Button>
                </div>
            {:else}
                <div class="cart-drawer__items">
                    {#each currentItems as item (item.product.id)}
                        <div class="cart-item">
                            <div class="cart-item__content">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    class="cart-item__image"
                                />
                                <div class="cart-item__details">
                                    <p class="cart-item__name">{item.product.name}</p>
                                    <p class="cart-item__price">
                                        ${parseFloat(item.product.price.toString()).toFixed(2)} × {item.quantity} = ${getItemTotal(item)}
                                    </p>
                                    <div class="cart-item__quantity">
                                        <button
                                            class="cart-item__quantity-btn cart-item__quantity-btn--minus"
                                            onclick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                            aria-label={t('decreaseQuantity')}
                                        >-</button>
                                        <span class="cart-item__quantity-display">{item.quantity}</span>
                                        <button
                                            class="cart-item__quantity-btn cart-item__quantity-btn--plus"
                                            onclick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            aria-label={t('increaseQuantity')}
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onclick={() => removeItem(item.product.id)}
                                class="cart-drawer__icon-btn text-neutral-400 hover:text-danger"
                                aria-label={t('remove')}
                            >
                                ✕
                            </button>
                        </div>
                    {/each}
                </div>
                <div class="cart-drawer__footer">
                    <div class="cart-drawer__summary">
                        <span class="text-neutral-400">{t('subtotal')}</span>
                        <span class="cart-drawer__summary-price">
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>
                    <p class="cart-drawer__shipping-note">{t('shippingNote')}</p>
                    <Button
                        variant="gradient"
                        fullWidth
                        class="cart-drawer__checkout-btn"
                    >{t('proceedToCheckout')}</Button>
                    <Button
                        variant="outline"
                        fullWidth
                        class="cart-drawer__continue-btn"
                        onclick={handleButtonClick}
                    >{t('continueShopping')}</Button>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* ==========================================================================
       CartDrawer — uses FixTar Design System tokens
       Layer 1: --color-brand-*, --color-accent-*, --color-neutral-* (palette)
       Layer 2: --ft-* (semantic tokens)
       Layer 3: --radius-* (radii from @theme)
       ========================================================================== */

    /* Backdrop overlay */
    .cart-backdrop {
        position: fixed;
        inset: 0;
        z-index: 150;
        background-color: var(--ft-surface-overlay);
        backdrop-filter: blur(4px);
    }

    /* Drawer panel */
    .cart-drawer {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 151;
        display: flex;
        height: 100%;
        width: 100%;
        max-width: 100%;
        flex-direction: column;
        background-color: var(--color-neutral-800);
        backdrop-filter: blur(12px);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border-left: 1px solid var(--color-neutral-700);
    }

    @media (min-width: 768px) {
        .cart-drawer {
            width: 400px;
        }
    }

    /* Header */
    .cart-drawer__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(to right, var(--color-brand-700), var(--color-brand-800));
        padding: 1rem;
        color: var(--ft-text-inverse);
        margin-top: 3.5rem;
        border-bottom: 1px solid color-mix(in srgb, var(--color-brand-600) 30%, transparent);
    }

    @media (min-width: 375px) {
        .cart-drawer__header { margin-top: 4rem; }
    }
    @media (min-width: 640px) {
        .cart-drawer__header { margin-top: 5rem; }
    }
    @media (min-width: 768px) {
        .cart-drawer__header { margin-top: 6rem; }
    }

    .cart-drawer__title {
        font-family: var(--font-heading);
        font-size: 1.25rem;
        font-weight: 600;
    }

    .cart-drawer__actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    /* Shared icon-button style for header + remove */
    .cart-drawer__icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.375rem;
        border-radius: var(--radius-sm);
        font-size: 1rem;
        line-height: 1;
        transition: color 0.2s, background-color 0.2s;
    }
    .cart-drawer__icon-btn:hover {
        background-color: color-mix(in srgb, var(--ft-text-inverse) 10%, transparent);
    }

    /* Body */
    .cart-drawer__body {
        display: flex;
        height: calc(100% - 64px - 3.5rem);
        flex-direction: column;
        background-color: var(--color-neutral-800);
        padding: 1rem;
    }

    @media (min-width: 375px) {
        .cart-drawer__body { height: calc(100% - 64px - 4rem); }
    }
    @media (min-width: 640px) {
        .cart-drawer__body { height: calc(100% - 64px - 5rem); }
    }
    @media (min-width: 768px) {
        .cart-drawer__body { height: calc(100% - 64px - 6rem); }
    }

    /* Empty state */
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

    /* Items list */
    .cart-drawer__items {
        flex: 1;
        overflow-y: auto;
    }

    /* Single cart item */
    .cart-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--color-neutral-700);
        padding: 0.5rem 0.5rem 1rem;
        transition: background-color 0.2s;
    }

    .cart-item:hover {
        background-color: color-mix(in srgb, var(--ft-primary) 8%, transparent);
    }

    .cart-item__content {
        display: flex;
        align-items: center;
    }

    .cart-item__image {
        height: 4rem;
        width: 4rem;
        border-radius: var(--radius-md);
        object-fit: cover;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .cart-item__details {
        margin-left: 0.75rem;
    }

    .cart-item__name {
        font-weight: 500;
        color: var(--ft-text-inverse);
    }

    .cart-item__price {
        color: var(--color-brand-400);
    }

    /* Quantity stepper */
    .cart-item__quantity {
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
    }

    .cart-item__quantity-btn {
        padding: 0.125rem 0.5rem;
        background-color: var(--ft-primary);
        transition: background-color 0.2s;
        border: none;
        cursor: pointer;
        color: var(--ft-text-inverse);
        font-weight: 600;
    }

    .cart-item__quantity-btn:hover {
        background-color: var(--ft-primary-hover);
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
        background-color: var(--ft-primary-active);
        padding: 0.125rem 0.5rem;
        color: var(--ft-text-inverse);
        min-width: 2rem;
        text-align: center;
    }

    /* Footer */
    .cart-drawer__footer {
        margin-top: 1rem;
        border-top: 1px solid var(--color-neutral-700);
        padding-top: 1rem;
    }

    .cart-drawer__summary {
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
    }

    .cart-drawer__summary-price {
        font-weight: 600;
        color: var(--ft-text-inverse);
    }

    .cart-drawer__shipping-note {
        margin-bottom: 1rem;
        font-size: 0.875rem;
        color: var(--ft-text-muted);
    }

    :global(.cart-drawer__checkout-btn) {
        margin-bottom: 0.5rem;
    }
</style>


