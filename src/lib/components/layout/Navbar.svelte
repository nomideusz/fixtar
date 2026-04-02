<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { cart, userStore } from '$lib/stores';
	import { MAIN_NAV } from '$lib/config/navigation';
	import FixTarLogo from '$lib/images/logo/fixtar-logo-black-trimmed.png';
	import FixTarIcon from '$lib/images/logo/fixtar-icon-black.png';
	import NavSearch from './NavSearch.svelte';
	import {
		XIcon,
		MagnifyingGlassIcon,
		ShoppingCartSimpleIcon,
		UserIcon,
		UserGearIcon,
		SignOutIcon
	} from 'phosphor-svelte';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	let scrolled = $state(false);
	let mobileSearchOpen = $state(false);
	let accountMenuOpen = $state(false);

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

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

	function toggleMobileSearch() {
		mobileSearchOpen = !mobileSearchOpen;
	}

	async function handleLogout() {
		userStore.logout();
		try {
			await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
		} catch {}
		window.location.href = '/';
	}
</script>

<nav class="nav" class:is-scrolled={scrolled} aria-label="Nawigacja główna">
	<div class="nav-inner">
		<!-- Logo -->
		<a href="/" class="nav-logo" aria-label="FixTar — Strona główna">
			<img src={FixTarLogo} alt="" class="logo-img logo-full" />
			<img src={FixTarIcon} alt="" class="logo-img logo-icon" />
		</a>

		<!-- Desktop inline search (Always visible) -->
		<div class="nav-search-wrap">
			<NavSearch />
		</div>

		<!-- Links (Mobile & Desktop) -->
		<div class="nav-links" role="menubar">
			{#each MAIN_NAV as link, index (link.href)}
				{@const isActive = $page.url.pathname.startsWith(link.href)}
				<a
					href={link.href}
					class="nav-link {isActive ? 'is-active' : ''} {index >= 2 ? 'desktop-only' : ''}"
					aria-current={isActive ? 'page' : undefined}
				>
					{link.label}
					{#if link.badge}
						<span class="promo-dot" aria-label="Aktywne promocje"></span>
					{/if}
				</a>
			{/each}
		</div>

		<!-- Actions -->
		<div class="nav-actions">
			<button
				onclick={toggleMobileSearch}
				class="nav-icon-btn mobile-search-btn"
				class:is-active={mobileSearchOpen}
				aria-label="Szukaj"
				title="Szukaj"
			>
				{#if mobileSearchOpen}
					<XIcon size={22} weight="bold" aria-hidden="true" />
				{:else}
					<MagnifyingGlassIcon size={22} weight="bold" aria-hidden="true" />
				{/if}
			</button>

			<!-- Account -->
			{#if userStore.current}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="account-dropdown-wrap desktop-only"
					onmouseenter={() => (accountMenuOpen = true)}
					onmouseleave={() => (accountMenuOpen = false)}
				>
					<button
						class="nav-icon-btn nav-action-btn"
						aria-label="Moje konto"
						aria-expanded={accountMenuOpen}
						aria-haspopup="true"
						onclick={() => (accountMenuOpen = !accountMenuOpen)}
					>
						<div class="nav-action-icon-wrap">
							<UserIcon size={22} weight="bold" aria-hidden="true" />
						</div>
						<span class="nav-action-label">Konto</span>
					</button>

					{#if accountMenuOpen}
						<div class="account-dropdown">
							<a
								href="/account"
								class="account-dropdown-item"
								onclick={() => (accountMenuOpen = false)}
							>
								<UserGearIcon size={16} weight="bold" aria-hidden="true" />
								Moje konto
							</a>
							<button
								class="account-dropdown-item account-dropdown-item--danger"
								onclick={() => {
									accountMenuOpen = false;
									handleLogout();
								}}
							>
								<SignOutIcon size={16} weight="bold" aria-hidden="true" />
								Wyloguj
							</button>
						</div>
					{/if}
				</div>

				<!-- Mobile: icon only, no dropdown -->
				<a
					href="/account"
					class="nav-icon-btn nav-action-btn mobile-only"
					aria-label="Moje konto"
					title="Moje konto"
				>
					<div class="nav-action-icon-wrap">
						<UserIcon size={22} weight="bold" aria-hidden="true" />
					</div>
				</a>
			{:else}
				<a
					href="/auth/login"
					class="nav-icon-btn nav-action-btn"
					aria-label="Zaloguj się"
					title="Zaloguj się"
				>
					<div class="nav-action-icon-wrap">
						<UserIcon size={22} weight="bold" aria-hidden="true" />
					</div>
					<span class="nav-action-label desktop-only">Zaloguj</span>
				</a>
			{/if}

			<!-- Cart -->
			<button
				onclick={() => onCartOpen?.()}
				class="nav-icon-btn nav-action-btn"
				aria-label="Koszyk{cartCount > 0 ? ` (${cartCount})` : ''}"
				title="Koszyk"
			>
				<div class="nav-action-icon-wrap" class:is-bouncing={cartBouncing}>
					<ShoppingCartSimpleIcon size={22} weight="bold" aria-hidden="true" />
					{#if cartCount > 0}
						<span class="cart-badge" aria-hidden="true">{cartCount}</span>
					{/if}
				</div>
				<span class="nav-action-label desktop-only">Koszyk</span>
			</button>
		</div>
	</div>

	<!-- Mobile dropdown search -->
	{#if mobileSearchOpen}
		<div class="mobile-search-bar">
			<NavSearch onClose={() => (mobileSearchOpen = false)} />
		</div>
	{/if}
</nav>

<style>
	/* ── Shell ── */
	.nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--ft-surface);
		border-top: 4px solid var(--ft-cta);
		border-bottom: 1px solid var(--ft-line);
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
		view-transition-name: navbar;
	}

	.nav.is-scrolled {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
	}

	.nav-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 8px;
		height: 60px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	@media (min-width: 768px) {
		.nav-inner {
			padding: 0 var(--ft-gutter);
			height: 100px;
			gap: 32px;
		}
	}

	/* ── Logo ── */
	.nav-logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		flex-shrink: 0;
		transition: opacity var(--dur-fast) ease;
	}

	.nav-logo:hover {
		opacity: 0.8;
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

	/* Mobile: show icon only */
	.logo-full {
		display: none;
	}

	.logo-icon {
		display: block;
		height: 36px;
	}

	@media (min-width: 768px) {
		.logo-full {
			display: block;
			height: 56px;
		}

		.logo-icon {
			display: none;
		}
	}

	/* ── Desktop & Mobile nav links — plain text ── */
	.nav-links {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-right: auto;
	}

	@media (min-width: 1024px) {
		.nav-links {
			gap: 8px;
			margin-right: 0;
		}
	}

	.nav-link {
		position: relative;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ft-text-strong);
		padding: 8px 6px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	@media (min-width: 768px) {
		.nav-link {
			font-size: 0.88rem;
			padding: 10px 14px;
		}
	}

	.nav-link:hover {
		color: var(--ft-accent);
		background: var(--ft-frost);
	}

	.nav-link.is-active {
		color: var(--ft-accent);
		font-weight: 800;
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.promo-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ft-cta);
		margin-left: 2px;
		vertical-align: super;
		flex-shrink: 0;
	}

	/* ── Search wrap ── */
	.nav-search-wrap {
		display: none;
		flex: 1;
		max-width: 720px;
		margin-right: auto;
	}

	@media (min-width: 768px) {
		.nav-search-wrap {
			display: block;
		}
	}

	.mobile-search-bar {
		display: block;
		padding: 16px var(--ft-gutter);
		background: var(--ft-frost);
		border-top: 1px solid var(--ft-line);
	}
	@media (min-width: 768px) {
		.mobile-search-bar {
			display: none;
		}
	}

	/* ── Action icons ── */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: auto;
	}

	@media (min-width: 768px) {
		.nav-actions {
			gap: 8px;
			margin-left: 12px;
		}
	}

	.nav-icon-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		min-width: 40px;
		min-height: 40px;
		border-radius: var(--radius-sm);
		color: var(--ft-text-strong);
		background: transparent;
		border: none;
		cursor: pointer;
		text-decoration: none;
		position: relative;
		transition: color var(--dur-fast) ease;
	}

	@media (min-width: 768px) {
		.nav-icon-btn {
			gap: 4px;
			min-width: 48px;
			min-height: 48px;
		}
	}

	.nav-action-btn:hover {
		color: var(--ft-accent);
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

	.nav-action-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.mobile-search-btn {
		display: flex;
	}
	@media (min-width: 768px) {
		.mobile-search-btn {
			display: none;
		}
	}

	.nav-icon-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.desktop-only {
		display: none !important;
	}
	@media (min-width: 768px) {
		.desktop-only {
			display: flex !important;
		}
	}

	.mobile-only {
		display: flex;
	}
	@media (min-width: 768px) {
		.mobile-only {
			display: none !important;
		}
	}

	/* ── Account dropdown ── */
	.account-dropdown-wrap {
		position: relative;
	}

	.account-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 4px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		min-width: 180px;
		padding: 4px;
		z-index: 60;
		animation: dropdownIn 0.12s var(--ease-out);
	}

	@keyframes dropdownIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.account-dropdown-item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 14px;
		min-height: 44px;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--ft-text);
		background: none;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.account-dropdown-item:hover {
		background: var(--ft-frost);
		color: var(--ft-accent);
	}

	.account-dropdown-item--danger:hover {
		color: var(--color-danger);
	}

	/* ── Cart badge ── */
	.cart-badge {
		position: absolute;
		top: -6px;
		right: -10px;
		min-width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--ft-cta);
		color: white;
		font-size: 0.58rem;
		font-weight: 700;
		border-radius: var(--radius-full);
		padding: 0 4px;
		line-height: 1;
		pointer-events: none;
		box-shadow: 0 0 0 2px var(--ft-surface);
	}
</style>
