<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { cart, userStore } from '$lib/stores';
	import FixTarLogo from '$lib/img/logo-FixTar.webp';
	import MegaMenu from './MegaMenu.svelte';
	import NavSearch from './NavSearch.svelte';

	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		onCartOpen?: () => void;
		categories?: Category[];
	}

	let { onCartOpen, categories = [] }: Props = $props();

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let megaMenuVisible = $state(false);
	let searchOpen = $state(false);
	let megaMenuTimer: ReturnType<typeof setTimeout>;

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	const cartCount = $derived(cart.count);

	function showMegaMenu() {
		clearTimeout(megaMenuTimer);
		megaMenuVisible = true;
	}

	function hideMegaMenu() {
		clearTimeout(megaMenuTimer);
		megaMenuTimer = setTimeout(() => {
			megaMenuVisible = false;
		}, 150);
	}

	function toggleSearch() {
		searchOpen = !searchOpen;
		if (searchOpen) {
			megaMenuVisible = false;
		}
	}

	async function handleLogout() {
		userStore.logout();
		try {
			await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
		} catch {}
		window.location.href = '/';
	}
</script>

{#snippet navLinks(mobile = false)}
	{@const links = [
		{ href: '/products', label: 'Produkty', hasMega: true },
		{ href: '/deals', label: 'Promocje', hasMega: false },
		{ href: '/about', label: 'O Nas', hasMega: false },
		{ href: '/contact', label: 'Kontakt', hasMega: false }
	]}
	{#each links as link (link.href)}
		{@const isActive = $page.url.pathname.startsWith(link.href)}
		{#if link.hasMega && !mobile}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="nav-link-mega-wrap"
				onmouseenter={showMegaMenu}
				onmouseleave={hideMegaMenu}
			>
				<a
					href={link.href}
					class="nav-link {isActive ? 'is-active' : ''}"
					aria-current={isActive ? 'page' : undefined}
					aria-haspopup="true"
					aria-expanded={megaMenuVisible}
				>
					{link.label}
					<svg class="nav-link-chevron" class:is-open={megaMenuVisible} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</a>
				<!-- Mega menu lives inside the hover wrapper so mouseleave covers both -->
				<MegaMenu
					{categories}
					visible={megaMenuVisible}
					onClose={() => (megaMenuVisible = false)}
				/>
			</div>
		{:else}
			<a
				href={link.href}
				class="{mobile ? 'mobile-link' : 'nav-link'} {isActive ? 'is-active' : ''}"
				onclick={mobile ? closeMobileMenu : undefined}
				aria-current={isActive ? 'page' : undefined}
			>{link.label}</a>
		{/if}
	{/each}
{/snippet}

<nav class="nav" class:is-scrolled={scrolled}>
	<div class="nav-inner">
		<!-- Logo -->
		<a href="/" class="nav-logo">
			<img src={FixTarLogo} alt="FixTar" class="logo-img" />
		</a>

		<!-- Desktop links -->
		<div class="nav-links">
			{@render navLinks()}
		</div>

		<!-- Desktop inline search -->
		{#if searchOpen}
			<div class="nav-search-wrap">
				<NavSearch onClose={() => (searchOpen = false)} />
			</div>
		{/if}

		<!-- Actions -->
		<div class="nav-actions">
			<button onclick={toggleSearch} class="nav-icon" class:is-search-active={searchOpen} aria-label="Szukaj">
				{#if searchOpen}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
				{/if}
			</button>

			<button onclick={() => onCartOpen?.()} class="nav-icon cart-icon" aria-label="Koszyk">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
				</svg>
				{#if cartCount > 0}
					<span class="cart-count">{cartCount}</span>
				{/if}
			</button>

			{#if userStore.current}
				<a href="/account" class="nav-icon" aria-label="Konto">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
					</svg>
				</a>
			{:else}
				<a href="/auth/login" class="login-link">Zaloguj</a>
			{/if}

			<!-- Mobile toggle -->
			<button onclick={() => (mobileMenuOpen = !mobileMenuOpen)} class="nav-icon burger" aria-label="Menu">
				<div class="burger-lines" class:is-open={mobileMenuOpen}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="mobile-overlay">
			<div class="mobile-menu">
				<a href="/search" class="mobile-link" onclick={closeMobileMenu}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					Szukaj
				</a>
				{@render navLinks(true)}

				<div class="mobile-sep"></div>

				{#if userStore.current}
					<a href="/account" class="mobile-link" onclick={closeMobileMenu}>Moje Konto</a>
					{#if userStore.current.isAdmin}
						<a href="/admin" class="mobile-link" onclick={closeMobileMenu}>Admin</a>
					{/if}
					<button onclick={handleLogout} class="mobile-link mobile-link--danger">Wyloguj</button>
				{:else}
					<a href="/auth/login" class="mobile-login" onclick={closeMobileMenu}>Zaloguj</a>
				{/if}
			</div>
		</div>
	{/if}

</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--ft-surface);
		border-bottom: 1px solid var(--ft-line);
		transition: all 0.3s ease;
	}

	.nav.is-scrolled {
		box-shadow: var(--ft-shadow-sm);
	}

	.nav-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 16px var(--ft-gutter);
		display: flex;
		align-items: center;
		gap: 32px;
	}

	/* ── Logo ── */
	.nav-logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		flex-shrink: 0;
	}

	.logo-img {
		height: 32px;
		width: auto;
		transition: opacity var(--dur-fast) ease;
	}

	.nav-logo:hover .logo-img {
		opacity: 0.8;
	}

	/* ── Desktop links ── */
	.nav-links {
		display: none;
		align-items: center;
		gap: 4px;
		flex: 1;
	}

	@media (min-width: 768px) {
		.nav-links {
			display: flex;
		}
	}

	.nav-link {
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
		padding: 8px 14px;
		transition: color var(--dur-fast) ease;
	}

	.nav-link:hover {
		color: var(--ft-dark);
	}

	.nav-link.is-active {
		color: var(--ft-accent);
	}

	/* ── Mega menu trigger ── */
	.nav-link-mega-wrap {
		position: static; /* mega-menu absolute positioning resolves against <nav> */
	}

	.nav-link-chevron {
		margin-left: 2px;
		transition: transform 0.2s ease;
	}

	.nav-link-chevron.is-open {
		transform: rotate(180deg);
	}

	/* ── Inline search ── */
	.nav-search-wrap {
		display: none;
		flex: 1;
		max-width: 480px;
	}

	@media (min-width: 768px) {
		.nav-search-wrap {
			display: block;
		}
	}

	.is-search-active {
		color: var(--ft-accent) !important;
		background: var(--ft-frost) !important;
	}

	.mobile-link.is-active {
		color: var(--ft-accent);
		background: var(--ft-frost);
	}

	/* ── Actions ── */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-left: auto;
	}

	.nav-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		border-radius: 50%;
		color: var(--ft-text-muted);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all var(--dur-fast) ease;
	}

	.nav-icon:hover {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.cart-icon {
		position: relative;
	}

	.cart-count {
		position: absolute;
		top: 2px;
		right: 2px;
		min-width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--ft-accent);
		color: white;
		font-size: 0.55rem;
		font-weight: 700;
		border-radius: 50%;
		padding: 0 3px;
	}

	.login-link {
		display: none;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-accent);
		padding: 8px 16px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-full);
		transition: all var(--dur-fast) ease;
	}

	@media (min-width: 768px) {
		.login-link {
			display: inline-flex;
		}
	}

	.login-link:hover {
		border-color: var(--ft-accent);
		background: var(--ft-frost);
	}

	/* ── Burger ── */
	.burger {
		display: flex;
	}

	@media (min-width: 768px) {
		.burger {
			display: none;
		}
	}

	.burger-lines {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 16px;
	}

	.burger-lines span {
		display: block;
		height: 1.5px;
		background: currentColor;
		transition: all 0.25s ease;
	}

	.burger-lines.is-open span:nth-child(1) {
		transform: translateY(5.5px) rotate(45deg);
	}
	.burger-lines.is-open span:nth-child(2) {
		opacity: 0;
	}
	.burger-lines.is-open span:nth-child(3) {
		transform: translateY(-5.5px) rotate(-45deg);
	}

	/* ── Mobile menu ── */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		top: 0;
		background: var(--ft-bg);
		z-index: 40;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding-top: 68px;
	}

	@media (min-width: 768px) {
		.mobile-overlay {
			display: none;
		}
	}

	.mobile-menu {
		padding: 24px var(--ft-gutter);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		min-height: 48px;
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ft-text-muted);
		transition: all var(--dur-fast) ease;
		border-radius: var(--radius-sm);
		border: none;
		background: none;
		cursor: pointer;
		width: 100%;
		text-align: left;
	}

	.mobile-link:hover {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.mobile-link--danger {
		color: var(--color-danger);
	}

	.mobile-sep {
		height: 1px;
		background: var(--ft-line);
		margin: 12px 0;
	}

	.mobile-login {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 14px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-accent);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		transition: all var(--dur-fast) ease;
	}

	.mobile-login:hover {
		border-color: var(--ft-accent);
		background: var(--ft-frost);
	}
</style>
