<script lang="ts">
	import { page } from '$app/stores';
	import { cart } from '$lib/stores';
	import { MAIN_NAV } from '$lib/config/navigation';
	import FixTarLogo from '$lib/images/logo/fixtar-logo-black-trimmed.png';
	import FixTarIcon from '$lib/images/logo/fixtar-icon-black.png';
	import { ShoppingCartSimpleIcon } from 'phosphor-svelte';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	const cartCount = $derived(cart.count);
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
</script>

<nav class="nav" aria-label="Nawigacja główna">
	<div class="nav-inner">
		<a href="/" class="nav-logo" aria-label="FixTar — Strona główna">
			<img src={FixTarLogo} alt="" class="logo-img logo-full" />
			<img src={FixTarIcon} alt="" class="logo-img logo-icon" />
		</a>

		<div class="nav-links" role="menubar">
			{#each MAIN_NAV as link (link.href)}
				{@const isActive = $page.url.pathname.startsWith(link.href)}
				<a
					href={link.href}
					class="nav-link"
					class:is-active={isActive}
					aria-current={isActive ? 'page' : undefined}
				>
					{link.label}
					{#if link.badge}
						<span class="promo-dot" aria-hidden="true"></span>
					{/if}
				</a>
			{/each}
		</div>

		<div class="nav-actions">
			<button
				onclick={() => onCartOpen?.()}
				class="nav-icon-btn nav-action-btn cart-btn"
				aria-label="Koszyk{cartCount > 0 ? ` (${cartCount})` : ''}"
				title="Koszyk"
				data-cart-toggle
			>
				<div class="nav-action-icon-wrap" class:is-bouncing={cartBouncing}>
					<ShoppingCartSimpleIcon size={20} weight="regular" aria-hidden="true" />
					{#if cartCount > 0}
						<span class="cart-badge" aria-hidden="true">{cartCount > 99 ? '99+' : cartCount}</span>
					{/if}
				</div>
			</button>
		</div>
	</div>
</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--ft-surface) 92%, white);
		border-bottom: 1px solid color-mix(in srgb, var(--ft-line) 78%, white);
		backdrop-filter: saturate(1.1) blur(10px);
		view-transition-name: navbar;
	}

	.nav-inner {
		max-width: var(--ft-container);
		margin-inline: auto;
		padding-inline: 12px;
		height: 64px;
		display: flex;
		align-items: center;
		gap: 16px;
	}

	@media (min-width: 768px) {
		.nav-inner {
			padding-inline: var(--ft-gutter);
			height: 78px;
			gap: 32px;
		}
	}

	.nav-logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		flex-shrink: 0;
		transition: opacity var(--dur-fast) ease;
	}

	.nav-logo:hover {
		opacity: 0.78;
	}

	.nav-logo:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.logo-img {
		width: auto;
		display: block;
		object-fit: contain;
	}

	.logo-full {
		display: none;
	}

	.logo-icon {
		display: block;
		height: 34px;
	}

	@media (min-width: 768px) {
		.logo-full {
			display: block;
			height: 46px;
		}

		.logo-icon {
			display: none;
		}
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-left: auto;
	}

	@media (min-width: 768px) {
		.nav-links {
			gap: 8px;
		}
	}

	.nav-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--ft-text);
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition:
			color var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.nav-link:hover {
		color: var(--ft-text-strong);
		background: color-mix(in srgb, var(--ft-frost) 72%, white);
	}

	.nav-link.is-active {
		color: var(--ft-text-strong);
	}

	.nav-link.is-active::after {
		content: '';
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: -1px;
		height: 2px;
		background: var(--ft-accent);
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.promo-dot {
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ft-accent);
		flex-shrink: 0;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	@media (min-width: 768px) {
		.nav-actions {
			gap: 6px;
		}
	}

	.nav-icon-btn {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		min-width: 42px;
		min-height: 42px;
		padding: 0 10px;
		border-radius: var(--radius-sm);
		color: var(--ft-text);
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		text-decoration: none;
		position: relative;
		transition:
			color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	@media (min-width: 768px) {
		.nav-icon-btn {
			min-width: 46px;
			min-height: 46px;
		}
	}

	.nav-action-btn:hover {
		color: var(--ft-text-strong);
		background: color-mix(in srgb, var(--ft-frost) 72%, white);
		border-color: color-mix(in srgb, var(--ft-line) 72%, white);
	}

	.nav-action-icon-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-action-icon-wrap.is-bouncing {
		animation: cartBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes cartBounce {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.25);
		}
		100% {
			transform: scale(1);
		}
	}

	.nav-icon-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.cart-btn {
		width: 44px;
		min-width: 44px;
		padding: 0;
		margin-left: 2px;
	}

	@media (min-width: 768px) {
		.cart-btn {
			width: 46px;
			min-width: 46px;
		}
	}

	.cart-badge {
		position: absolute;
		top: -8px;
		right: -12px;
		min-width: 20px;
		height: 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--ft-accent);
		color: var(--ft-cta-text);
		font-size: 0.625rem;
		font-weight: 500;
		font-family: var(--font-mono);
		border-radius: var(--radius-full);
		padding: 0 6px;
		line-height: 1;
		pointer-events: none;
		border: 2px solid var(--ft-surface);
	}
</style>
