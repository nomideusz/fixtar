<script lang="ts">
	import { page } from '$app/stores';
	import { cart } from '$lib/stores';
	import { MAIN_NAV } from '$lib/config/navigation';
	import {
		ShoppingCartSimpleIcon,
		CaretDownIcon,
		DownloadSimpleIcon
	} from 'phosphor-svelte';
	import FixtarLogo from './FixtarLogo.svelte';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	const cartCount = $derived(cart.count);
	const cartTotal = $derived(cart.total);
	let prevCartCount = cart.count;
	let cartBouncing = $state(false);

	$effect(() => {
		if (cartCount > prevCartCount) {
			cartBouncing = true;
			const timer = setTimeout(() => {
				cartBouncing = false;
			}, 300);
			return () => clearTimeout(timer);
		}
		prevCartCount = cartCount;
	});

	function formatPrice(value: number): string {
		return value.toFixed(2).replace('.', ',') + ' zł';
	}
</script>

<header class="header">
	<div class="ft-container">
		<nav class="nav" aria-label="Nawigacja główna">
			<a href="/" class="brand-mark" aria-label="FIXTAR — Strona główna">
				<FixtarLogo />
			</a>

			<div class="nav-links" role="menubar">
				{#each MAIN_NAV as link (link.href + link.label)}
					{@const isActive = $page.url.pathname.startsWith(link.href)}
					<a
						href={link.href}
						class="nav-link"
						class:has-caret={link.hasCaret}
						class:is-active={isActive}
						aria-current={isActive ? 'page' : undefined}
					>
						{link.label}
						{#if link.hasCaret}
							<CaretDownIcon size={10} weight="bold" aria-hidden="true" />
						{/if}
						{#if link.badge}
							<span class="promo-dot" aria-hidden="true"></span>
						{/if}
					</a>
				{/each}
			</div>

			<div class="nav-right">
				<a href="/catalog-2026.pdf" class="btn-katalog" target="_blank" rel="noopener">
					Katalog 2026
					<DownloadSimpleIcon size={14} weight="bold" aria-hidden="true" />
				</a>

				<button
					onclick={() => onCartOpen?.()}
					class="cart-btn"
					aria-label="Koszyk{cartCount > 0 ? ` (${cartCount})` : ''}"
					title="Koszyk"
					data-cart-toggle
				>
					<span class="cart-icon" class:is-bouncing={cartBouncing}>
						<ShoppingCartSimpleIcon size={18} weight="regular" aria-hidden="true" />
						{#if cartCount > 0}
							<span class="cart-badge" aria-hidden="true">{cartCount > 99 ? '99+' : cartCount}</span>
						{/if}
					</span>
					{#if cartCount > 0}
						<span class="cart-total">{formatPrice(cartTotal)}</span>
					{/if}
				</button>
			</div>
		</nav>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: #fff;
		border-bottom: 1px solid var(--ft-line);
		view-transition-name: navbar;
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 0;
	}

	.brand-mark {
		flex: 1;
		display: flex;
		align-items: center;
		transition: opacity var(--dur-fast) ease;
	}

	.brand-mark:hover {
		opacity: 0.82;
		color: inherit;
	}

	.brand-mark:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 4px;
		border-radius: 4px;
	}

	.nav-links {
		flex: none;
		display: flex;
		align-items: center;
		gap: 36px;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.nav-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--ft-text);
		padding: 8px 0;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.nav-link:hover {
		color: var(--ft-cyan);
	}

	.nav-link.is-active {
		color: var(--ft-cyan);
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.promo-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ft-cta);
		margin-left: 4px;
		flex-shrink: 0;
	}

	.nav-right {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 20px;
	}

	.btn-katalog {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 18px;
		border-radius: var(--radius-sm);
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: var(--ft-cyan);
		color: #fff;
		text-decoration: none;
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.btn-katalog:hover {
		background: var(--ft-cyan-600);
		color: #fff;
	}

	.btn-katalog :global(svg) {
		transition: transform var(--dur-fast) ease;
	}

	.btn-katalog:hover :global(svg) {
		transform: translateY(2px);
	}

	.btn-katalog:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.cart-btn {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		font-size: 14px;
		background: transparent;
		border: 0;
		padding: 0;
		cursor: pointer;
		color: var(--ft-text);
	}

	.cart-icon {
		position: relative;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--ft-frost);
		color: var(--ft-text);
		transition: background-color var(--dur-fast) ease;
	}

	.cart-btn:hover .cart-icon {
		background: var(--ft-dark);
		color: #fff;
	}

	.cart-icon.is-bouncing {
		animation: cartBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes cartBounce {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.18);
		}
		100% {
			transform: scale(1);
		}
	}

	.cart-badge {
		position: absolute;
		top: -3px;
		right: -3px;
		min-width: 18px;
		height: 18px;
		display: grid;
		place-items: center;
		background: var(--ft-cta);
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		border-radius: 9px;
		padding: 0 4px;
		border: 2px solid #fff;
		line-height: 1;
	}

	.cart-total {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 14px;
		letter-spacing: 0.01em;
	}

	.cart-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
		border-radius: 4px;
	}

	@media (max-width: 1024px) {
		.nav {
			gap: 24px;
		}

		.nav-links {
			gap: 24px;
			font-size: 13px;
		}

		.btn-katalog {
			padding: 10px 14px;
		}
	}

	@media (max-width: 860px) {
		.nav-links {
			display: none;
		}

		.btn-katalog {
			display: none;
		}

		.nav {
			padding: 14px 0;
		}
	}

	@media (max-width: 480px) {
		.cart-total {
			display: none;
		}
	}
</style>
