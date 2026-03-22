<script lang="ts">
	import { onMount } from 'svelte';
	import { cart, userStore } from '$lib/stores';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

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

	async function handleLogout() {
		userStore.logout();
		try {
			await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
		} catch {}
		window.location.href = '/';
	}
</script>

{#snippet navLinks(mobile = false)}
	<a href="/products" class={mobile ? 'mobile-link' : 'nav-link'} onclick={mobile ? closeMobileMenu : undefined}>Produkty</a>
	<a href="/deals" class={mobile ? 'mobile-link' : 'nav-link'} onclick={mobile ? closeMobileMenu : undefined}>Promocje</a>
	<a href="/about" class={mobile ? 'mobile-link' : 'nav-link'} onclick={mobile ? closeMobileMenu : undefined}>O Nas</a>
	<a href="/contact" class={mobile ? 'mobile-link' : 'nav-link'} onclick={mobile ? closeMobileMenu : undefined}>Kontakt</a>
{/snippet}

<nav class="nav" class:is-scrolled={scrolled}>
	<div class="nav-inner">
		<!-- Logo -->
		<a href="/" class="nav-logo">
			<span class="logo-dot"></span>
			<span class="logo-text">FixTar</span>
		</a>

		<!-- Desktop links -->
		<div class="nav-links">
			{@render navLinks()}
		</div>

		<!-- Actions -->
		<div class="nav-actions">
			<a href="/search" class="nav-icon" aria-label="Szukaj">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			</a>

			<button onclick={() => onCartOpen?.()} class="nav-icon cart-icon" aria-label="Koszyk">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
				</svg>
				{#if cartCount > 0}
					<span class="cart-count">{cartCount}</span>
				{/if}
			</button>

			{#if userStore.current}
				<a href="/account" class="nav-icon" aria-label="Konto">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: var(--ft-bg);
		border-bottom: 1px solid transparent;
		transition: all 0.3s ease;
	}

	.nav.is-scrolled {
		background: var(--ft-surface);
		border-bottom-color: var(--ft-line);
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
		gap: 10px;
		text-decoration: none;
		flex-shrink: 0;
	}

	.logo-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ft-accent);
		transition: transform var(--dur-fast) ease;
	}

	.nav-logo:hover .logo-dot {
		transform: scale(1.3);
	}

	.logo-text {
		font-family: var(--font-display);
		font-size: 1.3rem;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
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
		width: 36px;
		height: 36px;
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
		top: 68px;
		background: var(--ft-bg);
		z-index: 40;
		overflow-y: auto;
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
