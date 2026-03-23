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
		}, 200);
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
		{ href: '/products', label: 'Produkty', hasMega: true, icon: 'grid' },
		{ href: '/deals', label: 'Promocje', hasMega: false, icon: 'tag' },
		{ href: '/about', label: 'O Nas', hasMega: false, icon: 'info' },
		{ href: '/contact', label: 'Kontakt', hasMega: false, icon: 'mail' }
	]}
	{#each links as link (link.href)}
		{@const isActive = $page.url.pathname.startsWith(link.href)}
		{#if link.hasMega && !mobile}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="nav-link-mega-wrap"
				onmouseenter={showMegaMenu}
				onmouseleave={hideMegaMenu}
				onfocusin={showMegaMenu}
				onfocusout={hideMegaMenu}
			>
				<a
					href={link.href}
					class="nav-link {isActive ? 'is-active' : ''}"
					aria-current={isActive ? 'page' : undefined}
					aria-haspopup="true"
					aria-expanded={megaMenuVisible}
				>
					<svg class="nav-link-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
					</svg>
					{link.label}
					<svg class="nav-link-chevron" class:is-open={megaMenuVisible} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</a>
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
			>
				{#if !mobile}
					{#if link.icon === 'tag'}
						<svg class="nav-link-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
						</svg>
					{:else if link.icon === 'info'}
						<svg class="nav-link-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
						</svg>
					{:else if link.icon === 'mail'}
						<svg class="nav-link-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
						</svg>
					{/if}
				{:else}
					{#if link.icon === 'grid'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
						</svg>
					{:else if link.icon === 'tag'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
						</svg>
					{:else if link.icon === 'info'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
						</svg>
					{:else if link.icon === 'mail'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
						</svg>
					{/if}
				{/if}
				{link.label}
			</a>
		{/if}
	{/each}
{/snippet}

<nav class="nav" class:is-scrolled={scrolled} aria-label="Nawigacja główna">
	<div class="nav-inner">
		<!-- Logo -->
		<a href="/" class="nav-logo" aria-label="FixTar — Strona główna">
			<img src={FixTarLogo} alt="" class="logo-img" width="120" height="32" />
		</a>

		<!-- Desktop links -->
		<div class="nav-links" role="menubar">
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
			<!-- Search toggle -->
			<button
				onclick={toggleSearch}
				class="nav-action-btn"
				class:is-active={searchOpen}
				aria-label="Szukaj"
				title="Szukaj"
			>
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

			<!-- Divider -->
			<div class="nav-divider" aria-hidden="true"></div>

			<!-- Cart -->
			<button
				onclick={() => onCartOpen?.()}
				class="nav-action-btn cart-btn"
				aria-label="Koszyk{cartCount > 0 ? ` (${cartCount})` : ''}"
				title="Koszyk"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
				</svg>
				{#if cartCount > 0}
					<span class="cart-badge" aria-hidden="true">{cartCount}</span>
				{/if}
			</button>

			<!-- Account / Login -->
			{#if userStore.current}
				<a href="/account" class="nav-action-btn" aria-label="Moje konto" title="Moje konto">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
					</svg>
				</a>
			{:else}
				<a href="/auth/login" class="login-btn">
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
					</svg>
					Zaloguj
				</a>
			{/if}

			<!-- Mobile toggle -->
			<button
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="nav-action-btn burger"
				aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
				aria-expanded={mobileMenuOpen}
			>
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
		<div class="mobile-overlay" role="dialog" aria-modal="true" aria-label="Menu nawigacji">
			<div class="mobile-menu">
				<a href="/search" class="mobile-link" onclick={closeMobileMenu}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					Szukaj
				</a>
				{@render navLinks(true)}

				<div class="mobile-sep" aria-hidden="true"></div>

				{#if userStore.current}
					<a href="/account" class="mobile-link" onclick={closeMobileMenu}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
						</svg>
						Moje Konto
					</a>
					{#if userStore.current.isAdmin}
						<a href="/admin" class="mobile-link" onclick={closeMobileMenu}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
							</svg>
							Admin
						</a>
					{/if}
					<button onclick={handleLogout} class="mobile-link mobile-link--danger">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
						</svg>
						Wyloguj
					</button>
				{:else}
					<a href="/auth/login" class="mobile-login" onclick={closeMobileMenu}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
						</svg>
						Zaloguj się
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
	/* ══════════════════════════════════════════
	   NAV SHELL
	   ══════════════════════════════════════════ */
	.nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--ft-surface);
		border-bottom: 1px solid var(--ft-line);
		transition: box-shadow 0.25s var(--ease-out);
	}

	.nav.is-scrolled {
		box-shadow: 0 1px 8px rgba(21, 29, 43, 0.06), 0 0 1px rgba(21, 29, 43, 0.08);
	}

	.nav-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		height: 64px;
		display: flex;
		align-items: center;
		gap: 24px;
	}

	/* ── Logo ── */
	.nav-logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		flex-shrink: 0;
		border-radius: var(--radius-sm);
		padding: 4px;
		margin: -4px;
		cursor: pointer;
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
		height: 30px;
		width: auto;
		display: block;
	}

	/* ══════════════════════════════════════════
	   DESKTOP NAV LINKS
	   ══════════════════════════════════════════ */
	.nav-links {
		display: none;
		align-items: center;
		gap: 2px;
		flex: 1;
	}

	@media (min-width: 768px) {
		.nav-links {
			display: flex;
		}
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		position: relative;
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ft-text-muted);
		padding: 8px 14px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition:
			color var(--dur-fast) ease,
			background var(--dur-fast) ease;
	}

	.nav-link:hover {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.nav-link.is-active {
		color: var(--ft-cta);
	}

	/* Active underline indicator */
	.nav-link.is-active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 14px;
		right: 14px;
		height: 2px;
		background: var(--ft-cta);
		border-radius: 1px;
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	/* ── Nav link icon ── */
	.nav-link-icon {
		flex-shrink: 0;
		opacity: 0.5;
		transition: opacity var(--dur-fast) ease;
	}

	.nav-link:hover .nav-link-icon,
	.nav-link.is-active .nav-link-icon {
		opacity: 0.85;
	}

	/* ── Mega menu trigger ── */
	.nav-link-mega-wrap {
		position: static;
	}

	.nav-link-chevron {
		margin-left: -2px;
		opacity: 0.45;
		transition: transform 0.2s ease, opacity var(--dur-fast) ease;
	}

	.nav-link:hover .nav-link-chevron {
		opacity: 0.7;
	}

	.nav-link-chevron.is-open {
		transform: rotate(180deg);
		opacity: 0.85;
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

	/* ══════════════════════════════════════════
	   ACTION BUTTONS (right side)
	   ══════════════════════════════════════════ */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: auto;
	}

	.nav-divider {
		width: 1px;
		height: 20px;
		background: var(--ft-line);
		margin: 0 6px;
	}

	@media (max-width: 767px) {
		.nav-divider {
			display: none;
		}
	}

	.nav-action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		border-radius: var(--radius-sm);
		color: var(--ft-text-muted);
		background: transparent;
		border: none;
		cursor: pointer;
		text-decoration: none;
		transition:
			color var(--dur-fast) ease,
			background var(--dur-fast) ease;
	}

	.nav-action-btn:hover {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.nav-action-btn.is-active {
		color: var(--ft-cta);
		background: rgba(255, 107, 0, 0.06);
	}

	.nav-action-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	/* ── Cart ── */
	.cart-btn {
		position: relative;
	}

	.cart-badge {
		position: absolute;
		top: 4px;
		right: 4px;
		min-width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--ft-cta);
		color: white;
		font-size: 0.6rem;
		font-weight: 700;
		border-radius: var(--radius-full);
		padding: 0 4px;
		line-height: 1;
		pointer-events: none;
		box-shadow: 0 0 0 2px var(--ft-surface);
	}

	/* ── Login button (desktop) ── */
	.login-btn {
		display: none;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-cta);
		padding: 8px 18px;
		border: 1.5px solid var(--ft-line);
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition:
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			background var(--dur-fast) ease,
			box-shadow var(--dur-fast) ease;
	}

	@media (min-width: 768px) {
		.login-btn {
			display: inline-flex;
		}
	}

	.login-btn:hover {
		border-color: var(--ft-cta);
		color: var(--ft-cta);
		background: rgba(255, 107, 0, 0.04);
		box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.06);
	}

	.login-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.login-btn svg {
		opacity: 0.6;
		transition: opacity var(--dur-fast) ease;
	}

	.login-btn:hover svg {
		opacity: 1;
	}

	/* ══════════════════════════════════════════
	   BURGER (mobile only)
	   ══════════════════════════════════════════ */
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
		width: 18px;
	}

	.burger-lines span {
		display: block;
		height: 2px;
		background: currentColor;
		border-radius: 1px;
		transition: all 0.25s var(--ease-out);
		transform-origin: center;
	}

	.burger-lines.is-open span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}
	.burger-lines.is-open span:nth-child(2) {
		opacity: 0;
		transform: scaleX(0);
	}
	.burger-lines.is-open span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	/* ══════════════════════════════════════════
	   MOBILE MENU
	   ══════════════════════════════════════════ */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		top: 0;
		background: var(--ft-bg);
		z-index: 45;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding-top: 64px;
		animation: mobileSlideIn 0.2s var(--ease-out);
	}

	@keyframes mobileSlideIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-overlay {
			animation: none;
		}
	}

	@media (min-width: 768px) {
		.mobile-overlay {
			display: none;
		}
	}

	.mobile-menu {
		padding: 20px var(--ft-gutter);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		min-height: 48px;
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: var(--ft-text-muted);
		transition: all var(--dur-fast) ease;
		border-radius: var(--radius-sm);
		border: none;
		background: none;
		cursor: pointer;
		width: 100%;
		text-align: left;
		text-decoration: none;
	}

	.mobile-link:hover,
	.mobile-link:focus-visible {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.mobile-link:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: -2px;
	}

	.mobile-link.is-active {
		color: var(--ft-cta);
		background: rgba(255, 107, 0, 0.06);
	}

	.mobile-link.is-active svg {
		color: var(--ft-cta);
	}

	.mobile-link svg {
		flex-shrink: 0;
		color: var(--ft-text-faint);
		transition: color var(--dur-fast) ease;
	}

	.mobile-link:hover svg {
		color: var(--ft-text-muted);
	}

	.mobile-link--danger {
		color: var(--color-danger);
	}

	.mobile-link--danger svg {
		color: var(--color-danger);
		opacity: 0.7;
	}

	.mobile-sep {
		height: 1px;
		background: var(--ft-line);
		margin: 8px 16px;
	}

	.mobile-login {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 14px;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-cta);
		border: 1.5px solid var(--ft-line);
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition: all var(--dur-fast) ease;
	}

	.mobile-login:hover {
		border-color: var(--ft-cta);
		background: rgba(255, 107, 0, 0.04);
	}

	.mobile-login:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.mobile-login svg {
		opacity: 0.6;
	}
</style>
