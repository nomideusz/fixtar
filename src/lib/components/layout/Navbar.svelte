<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { cart, userStore } from '$lib/stores';
	import FixTarLogo from '$lib/images/logo/fixtar-logo-primary.webp';
	import NavSearch from './NavSearch.svelte';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let searchOpen = $state(false);

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

	function toggleSearch() {
		searchOpen = !searchOpen;
		
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
		{ href: '/products', label: 'Produkty' },
		{ href: '/deals', label: 'Promocje' },
		{ href: '/about', label: 'O Nas' },
		{ href: '/contact', label: 'Kontakt' }
	]}
	{#each links as link (link.href)}
		{@const isActive = $page.url.pathname.startsWith(link.href)}
		<a
			href={link.href}
			class="{mobile ? 'mobile-link' : 'nav-link'} {isActive ? 'is-active' : ''}"
			onclick={mobile ? closeMobileMenu : undefined}
			aria-current={isActive ? 'page' : undefined}
		>
			{link.label}
		</a>
	{/each}
{/snippet}

<nav class="nav" class:is-scrolled={scrolled} aria-label="Nawigacja główna">
	<div class="nav-inner">
		<!-- Logo -->
		<a href="/" class="nav-logo" aria-label="FixTar — Strona główna">
			<img src={FixTarLogo} alt="" class="logo-img" width="120" height="32" />
		</a>

		<!-- Desktop links — clean text, no icons -->
		<div class="nav-links" role="menubar">
			{@render navLinks()}
		</div>

		<!-- Desktop inline search -->
		{#if searchOpen}
			<div class="nav-search-wrap">
				<NavSearch onClose={() => (searchOpen = false)} />
			</div>
		{/if}

		<!-- Actions — minimal icon buttons -->
		<div class="nav-actions">
			<button
				onclick={toggleSearch}
				class="nav-icon-btn"
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

			<!-- Cart -->
			<button
				onclick={() => onCartOpen?.()}
				class="nav-icon-btn"
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

			<!-- Account -->
			{#if userStore.current}
				<a href="/account" class="nav-icon-btn" aria-label="Moje konto" title="Moje konto">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
					</svg>
				</a>
			{:else}
				<a href="/auth/login" class="nav-icon-btn desktop-only" aria-label="Zaloguj się" title="Zaloguj się">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
					</svg>
				</a>
			{/if}

			<!-- Mobile burger -->
			<button
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="nav-icon-btn burger"
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
				<a href="/search" class="mobile-link" onclick={closeMobileMenu}>Szukaj</a>
				{@render navLinks(true)}

				<div class="mobile-sep" aria-hidden="true"></div>

				{#if userStore.current}
					<a href="/account" class="mobile-link" onclick={closeMobileMenu}>Moje Konto</a>
					{#if userStore.current.isAdmin}
						<a href="/admin" class="mobile-link" onclick={closeMobileMenu}>Admin</a>
					{/if}
					<button onclick={handleLogout} class="mobile-link mobile-link--danger">Wyloguj</button>
				{:else}
					<a href="/auth/login" class="mobile-link" onclick={closeMobileMenu}>Zaloguj się</a>
				{/if}
			</div>
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
		border-bottom: 1px solid var(--ft-line);
		transition: box-shadow 0.2s ease;
	}

	.nav.is-scrolled {
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
	}

	.nav-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		height: 60px;
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
		transition: opacity var(--dur-fast) ease;
	}

	.nav-logo:hover { opacity: 0.8; }

	.nav-logo:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.logo-img {
		height: 28px;
		width: auto;
		display: block;
	}

	/* ── Desktop nav links — plain text, no icons ── */
	.nav-links {
		display: none;
		align-items: center;
		gap: 4px;
		flex: 1;
	}

	@media (min-width: 768px) {
		.nav-links { display: flex; }
	}

	.nav-link {
		position: relative;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--ft-text-muted);
		padding: 8px 14px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.nav-link:hover {
		color: var(--ft-dark);
	}

	.nav-link.is-active {
		color: var(--ft-dark);
		font-weight: 600;
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	/* ── Search wrap ── */
	.nav-search-wrap {
		display: none;
		flex: 1;
		max-width: 480px;
	}

	@media (min-width: 768px) {
		.nav-search-wrap { display: block; }
	}

	/* ── Action icons ── */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: auto;
	}

	.nav-icon-btn {
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
		position: relative;
		transition: color var(--dur-fast) ease;
	}

	.nav-icon-btn:hover { color: var(--ft-dark); }

	.nav-icon-btn.is-active { color: var(--ft-dark); }

	.nav-icon-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.desktop-only { display: none; }
	@media (min-width: 768px) { .desktop-only { display: flex; } }

	/* ── Cart badge ── */
	.cart-badge {
		position: absolute;
		top: 6px;
		right: 6px;
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

	/* ── Burger ── */
	.burger { display: flex; }
	@media (min-width: 768px) { .burger { display: none; } }

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
		transition: transform 0.25s var(--ease-out), opacity 0.25s var(--ease-out);
		transform-origin: center;
	}

	.burger-lines.is-open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
	.burger-lines.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
	.burger-lines.is-open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

	/* ── Mobile menu ── */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		top: 0;
		background: var(--ft-bg);
		z-index: 45;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding-top: 60px;
		animation: mobileSlideIn 0.2s var(--ease-out);
	}

	@keyframes mobileSlideIn {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-overlay { animation: none; }
	}

	@media (min-width: 768px) {
		.mobile-overlay { display: none; }
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
		font-size: 0.88rem;
		font-weight: 500;
		color: var(--ft-text-muted);
		transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
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
		color: var(--ft-dark);
		font-weight: 600;
	}

	.mobile-link--danger {
		color: var(--color-danger);
	}

	.mobile-sep {
		height: 1px;
		background: var(--ft-line);
		margin: 8px 16px;
	}
</style>
