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

    function handleButtonClick() {
        toggleCart();
    }

    function handleBackdropClick() {
        toggleCart();
    }

    function getItemTotal(item: CartItem): string {
        const price = parseFloat(item.product.price.toString());
        return (price * item.quantity).toFixed(2);
    }

    function getProductHref(item: CartItem): string {
        return `/products/${encodeURIComponent(item.product.id)}`;
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
                    class="cart-drawer__icon-btn cart-drawer__icon-btn--clear"
                    title={t('clearCart')}
                    aria-label={t('clearCart')}
                >
                    🗑️
                </button>
                <button
                    onclick={handleButtonClick}
                    class="cart-drawer__icon-btn cart-drawer__icon-btn--close"
                    aria-label={t('closeCartDrawer')}
                >
                    ✕
                </button>
            </div>
        </div>

        <div class="cart-drawer__body">
            {#if !Array.isArray(currentItems) || currentItems.length === 0}
                <div class="cart-drawer__empty">
                    <p class="cart-drawer__empty-text">{t('cartEmpty')}</p>
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
                                <a
                                    href={getProductHref(item)}
                                    class="cart-item__image-link"
                                    onclick={handleButtonClick}
                                    aria-label={item.product.name}
                                >
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        class="cart-item__image"
                                    />
                                </a>
                                <div class="cart-item__details">
                                    <a
                                        href={getProductHref(item)}
                                        class="cart-item__name-link"
                                        onclick={handleButtonClick}
                                    >
                                        <p class="cart-item__name">{item.product.name}</p>
                                    </a>
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
                                class="cart-drawer__icon-btn cart-drawer__icon-btn--remove"
                                aria-label={t('remove')}
                            >
                                ✕
                            </button>
                        </div>
                    {/each}
                </div>
                <div class="cart-drawer__footer">
                    <div class="cart-drawer__summary">
                        <span class="cart-drawer__summary-label">{t('subtotal')}</span>
                        <span class="cart-drawer__summary-price">
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>
                    <p class="cart-drawer__shipping-note">{t('shippingNote')}</p>
                    <Button
                        variant="primary"
                        fullWidth
                        class="cart-drawer__checkout-btn"
                    >{t('proceedToCheckout')}</Button>
                    <Button
                        variant="outline"
                        fullWidth
                        onclick={handleButtonClick}
                    >{t('continueShopping')}</Button>
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
        background-color: var(--ft-surface-overlay);
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
        background-color: var(--ft-surface-elevated);
        box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.22);
        border-left: 1px solid var(--ft-border);
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
        background-color: var(--ft-surface-secondary);
        padding: 1rem 1.25rem;
        color: var(--ft-text);
        border-bottom: 1px solid var(--ft-border);
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
        transition: color 0.2s, background-color 0.2s;
        color: var(--ft-text-secondary);
    }

    .cart-drawer__icon-btn:hover {
        background-color: var(--ft-surface-tertiary);
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
        border: 1px solid var(--ft-border);
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
        border: 1px solid var(--ft-border);
    }

    .cart-item__image-link {
        display: inline-flex;
        border-radius: var(--radius-md);
    }

    .cart-item__image-link:focus-visible,
    .cart-item__name-link:focus-visible {
        outline: 2px solid var(--ft-primary);
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
        color: var(--ft-primary);
    }

    .cart-item__price {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ft-primary);
    }

    .cart-item__quantity {
        margin-top: 0.375rem;
        display: flex;
        align-items: center;
        border: 1px solid var(--ft-border);
        border-radius: var(--radius-sm);
        overflow: hidden;
        width: fit-content;
    }

    .cart-item__quantity-btn {
        min-width: 2rem;
        min-height: 2rem;
        padding: 0 0.5rem;
        background-color: var(--ft-surface-secondary);
        transition: background-color 0.2s, color 0.2s;
        border: none;
        cursor: pointer;
        color: var(--ft-text);
        font-weight: 600;
        font-size: 0.95rem;
        line-height: 1;
        box-shadow: inset 0 0 0 1px transparent;
    }

    .cart-item__quantity-btn:hover {
        background-color: var(--ft-primary-light);
        color: var(--ft-primary);
        box-shadow: inset 0 0 0 1px var(--ft-primary);
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
        border-left: 1px solid var(--ft-border);
        border-right: 1px solid var(--ft-border);
    }

    .cart-drawer__footer {
        margin-top: 1rem;
        border-top: 1px solid var(--ft-border);
        padding-top: 1rem;
    }

    .cart-drawer__summary-label,
    .cart-drawer__empty-text {
        color: var(--ft-text-secondary);
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


