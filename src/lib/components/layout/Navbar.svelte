<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { cart, userStore } from '$lib/stores';
	import FixTarLogo from '$lib/images/logo/fixtar-logo-black-trimmed.png';
	import FixTarIcon from '$lib/images/logo/fixtar-icon-black.png';
	import NavSearch from './NavSearch.svelte';
	import { SunIcon, MoonIcon, XIcon, MagnifyingGlassIcon, ToteIcon, UserCircleIcon, UserGearIcon, SignOutIcon } from 'phosphor-svelte';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let mobileSearchOpen = $state(false);
	let darkMode = $state(false);
	let accountMenuOpen = $state(false);

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		// Init dark mode from localStorage or system preference
		const stored = localStorage.getItem('ft-theme');
		if (stored === 'dark') {
			darkMode = true;
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		} else if (stored === 'light') {
			darkMode = false;
			document.documentElement.classList.add('light-forced');
		} else {
			// Follow system preference
			darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

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

	function toggleMobileSearch() {
		mobileSearchOpen = !mobileSearchOpen;
	}

	function toggleDarkMode() {
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light', 'light-forced');
			localStorage.setItem('ft-theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light-forced');
			localStorage.setItem('ft-theme', 'light');
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
		{ href: '/products', label: 'Produkty', badge: false },
		{ href: '/deals', label: 'Promocje', badge: true },
		{ href: '/contact', label: 'Kontakt', badge: false }
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
			{#if link.badge && !mobile}
				<span class="promo-dot" aria-label="Aktywne promocje"></span>
			{/if}
		</a>
	{/each}
{/snippet}

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

		<!-- Desktop links — clean text -->
		<div class="nav-links" role="menubar">
			{@render navLinks()}
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

			<!-- Cart -->
			<button
				onclick={() => onCartOpen?.()}
				class="nav-icon-btn nav-action-btn"
				aria-label="Koszyk{cartCount > 0 ? ` (${cartCount})` : ''}"
				title="Koszyk"
			>
				<div class="nav-action-icon-wrap">
					<ToteIcon size={24} weight="bold" aria-hidden="true" />
					{#if cartCount > 0}
						<span class="cart-badge" aria-hidden="true">{cartCount}</span>
					{/if}
				</div>
				<span class="nav-action-label desktop-only">Koszyk</span>
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
							<UserCircleIcon size={24} weight="bold" aria-hidden="true" />
						</div>
						<span class="nav-action-label">Konto</span>
					</button>

					{#if accountMenuOpen}
						<div class="account-dropdown">
							<a href="/account" class="account-dropdown-item" onclick={() => (accountMenuOpen = false)}>
								<UserGearIcon size={16} weight="bold" aria-hidden="true" />
								Moje konto
							</a>
							<button class="account-dropdown-item account-dropdown-item--danger" onclick={() => { accountMenuOpen = false; handleLogout(); }}>
								<SignOutIcon size={16} weight="bold" aria-hidden="true" />
								Wyloguj
							</button>
						</div>
					{/if}
				</div>

				<!-- Mobile: icon only, no dropdown -->
				<a href="/account" class="nav-icon-btn nav-action-btn mobile-only" aria-label="Moje konto" title="Moje konto">
					<div class="nav-action-icon-wrap">
						<UserCircleIcon size={24} weight="bold" aria-hidden="true" />
					</div>
				</a>
			{:else}
				<a href="/auth/login" class="nav-icon-btn nav-action-btn desktop-only" aria-label="Zaloguj się" title="Zaloguj się">
					<div class="nav-action-icon-wrap">
						<UserCircleIcon size={24} weight="bold" aria-hidden="true" />
					</div>
					<span class="nav-action-label">Zaloguj</span>
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

	<!-- Mobile dropdown search -->
	{#if mobileSearchOpen}
		<div class="mobile-search-bar">
			<NavSearch onClose={() => (mobileSearchOpen = false)} />
		</div>
	{/if}

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="mobile-overlay" role="dialog" aria-modal="true" aria-label="Menu nawigacji">
			<div class="mobile-menu-header">
				<a href="/" class="nav-logo" aria-label="FixTar — Strona główna" onclick={closeMobileMenu}>
					<img src={FixTarIcon} alt="" class="logo-img logo-icon" style="display:block" />
				</a>
				<button
					onclick={closeMobileMenu}
					class="nav-icon-btn"
					aria-label="Zamknij menu"
				>
					<XIcon size={24} weight="bold" aria-hidden="true" />
				</button>
			</div>
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
		view-transition-name: navbar;
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
		gap: 12px;
	}

	@media (min-width: 768px) {
		.nav-inner {
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

	.nav-logo:hover { opacity: 0.8; }

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

	/* ── Desktop nav links — plain text, no icons ── */
	.nav-links {
		display: none;
		align-items: center;
		gap: 8px;
	}

	@media (min-width: 1024px) {
		.nav-links { display: flex; }
	}

	.nav-link {
		position: relative;
		font-family: var(--font-display);
		font-size: 0.88rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ft-text-strong);
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
	}

	.nav-link:hover {
		color: var(--color-brand-500);
		background: var(--ft-frost);
	}

	.nav-link.is-active {
		color: var(--color-brand-500);
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
		.nav-search-wrap { display: block; }
	}

	.mobile-search-bar {
		display: block;
		padding: 12px var(--ft-gutter);
		background: var(--ft-surface);
		border-bottom: 1px solid var(--ft-line);
	}
	@media (min-width: 768px) {
		.mobile-search-bar { display: none; }
	}

	/* ── Action icons ── */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 4px;
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
		min-width: 44px;
		min-height: 44px;
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

	.nav-action-btn:hover { color: var(--color-brand-500); }

	.nav-action-icon-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-action-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.mobile-search-btn { display: flex; }
	@media (min-width: 768px) { .mobile-search-btn { display: none; } }

	.nav-icon-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.desktop-only { display: none !important; }
	@media (min-width: 768px) { .desktop-only { display: flex !important; } }

	.mobile-only { display: flex; }
	@media (min-width: 768px) { .mobile-only { display: none !important; } }

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
		from { opacity: 0; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
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
		transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
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
		background: var(--ft-bg);
		z-index: 55;
		display: flex;
		flex-direction: column;
		overscroll-behavior: contain;
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

	.mobile-menu-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--ft-gutter);
		height: 60px;
		border-bottom: 1px solid var(--ft-line);
		flex-shrink: 0;
	}

	.mobile-menu {
		padding: 12px var(--ft-gutter);
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow-y: auto;
		flex: 1;
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
