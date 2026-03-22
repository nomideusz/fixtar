<script lang="ts">
	import { onMount } from 'svelte';
	import { cart, userStore } from '$lib/stores';
	import FixTarLogoWhite from '$lib/img/logo-FixTar-white.webp';
	import FixTarLogo from '$lib/img/logo-FixTar.webp';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);
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
		userMenuOpen = false;
		userStore.logout();
		try {
			await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
		} catch {
			// Logout request failed, but user is already logged out locally
		}
		window.location.href = '/';
	}
</script>

{#if userMenuOpen}
	<div
		class="fixed inset-0 z-30"
		role="button"
		tabindex="0"
		aria-label="Zamknij menu"
		onclick={() => (userMenuOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (userMenuOpen = false)}
	></div>
{/if}

<nav class="fixed top-0 right-0 left-0 z-50" class:is-scrolled={scrolled}>
	<!-- Precision accent line -->
	<div class="nav-accent"></div>

	<!-- Nav body -->
	<div class="nav-body">
		<div class="mx-auto max-w-screen-2xl px-3 sm:px-8 lg:px-12">
			<div class="flex items-center justify-between">
				<!-- Logo -->
				<a href="/" class="group shrink-0">
					<img
						src={FixTarLogoWhite}
						alt="FixTar"
						class="logo-dark h-9 w-auto transition-all duration-300 group-hover:brightness-125 md:h-10"
					/>
					<img
						src={FixTarLogo}
						alt="FixTar"
						class="logo-light h-9 w-auto transition-all duration-300 group-hover:brightness-125 md:h-10"
					/>
				</a>

				<!-- Desktop nav -->
				<div class="hidden items-center gap-0.5 lg:flex">
					<a href="/products" class="nav-link">Produkty</a>
					<a href="/categories" class="nav-link">Kategorie</a>
					<a href="/deals" class="nav-link">Promocje</a>
					<a href="/about" class="nav-link">O Nas</a>
					<a href="/contact" class="nav-link">Kontakt</a>
				</div>

				<!-- Actions -->
				<div class="flex items-center gap-1 sm:gap-1.5 md:gap-2.5">
					<a href="/search" class="nav-icon" aria-label="Szukaj">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</a>

					<button onclick={() => onCartOpen?.()} class="nav-icon relative" aria-label="Koszyk">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						{#if cartCount > 0}
							<span class="cart-badge">{cartCount}</span>
						{/if}
					</button>

					{#if userStore.current}
						<div class="relative">
							<button
								onclick={() => (userMenuOpen = !userMenuOpen)}
								class="nav-icon"
								aria-label="Menu użytkownika"
							>
								<div class="flex items-center gap-1.5">
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									<svg
										class="h-3 w-3 transition-transform duration-300 {userMenuOpen
											? 'rotate-180'
											: ''}"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</button>

							{#if userMenuOpen}
								<div
									class="user-dropdown animate-drop-in absolute right-0 mt-3 w-64 overflow-hidden"
								>
									<div class="user-dropdown-header px-5 py-4">
										<p
											class="font-heading text-xs tracking-wider uppercase"
											style="color: var(--ft-text-muted)"
										>
											Zalogowany jako
										</p>
										<p class="mt-1 truncate font-semibold text-[--ft-text]">{userStore.current.email}</p>
									</div>
									<div class="p-2">
										<a href="/account" onclick={() => (userMenuOpen = false)} class="dropdown-item">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/></svg
											>
											Moje Konto
										</a>
										{#if userStore.current.isAdmin}
											<a href="/admin" onclick={() => (userMenuOpen = false)} class="dropdown-item">
												<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
													/></svg
												>
												Panel Administratora
											</a>
										{/if}
										<div class="dropdown-separator my-1"></div>
										<button
											onclick={handleLogout}
											class="dropdown-item dropdown-item--danger w-full"
										>
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17 16l4-8m0 0l-4-8m4 8H3"
												/></svg
											>
											Wyloguj
										</button>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<a href="/auth/login" class="nav-icon lg:hidden" aria-label="Zaloguj">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</a>
						<a href="/auth/login" class="login-btn hidden lg:inline-flex">Zaloguj</a>
					{/if}

					<!-- Mobile toggle -->
					<button
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						class="nav-icon lg:hidden"
						aria-label="Menu"
					>
						<div class="flex h-5 w-5 flex-col justify-center gap-1.5">
							<span
								class="block h-0.5 w-full bg-current transition-all duration-300 {mobileMenuOpen
									? 'translate-y-2 rotate-45'
									: ''}"
							></span>
							<span
								class="block h-0.5 w-full bg-current transition-all duration-300 {mobileMenuOpen
									? 'opacity-0'
									: ''}"
							></span>
							<span
								class="block h-0.5 w-full bg-current transition-all duration-300 {mobileMenuOpen
									? '-translate-y-2 -rotate-45'
									: ''}"
							></span>
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu — full-screen overlay -->
	{#if mobileMenuOpen}
		<div class="mobile-overlay fixed inset-x-0 bottom-0 lg:hidden" style="top: calc(2px + 4.25rem)">
			<div class="mobile-menu animate-slide-down">
				<a href="/search" class="mobile-link" style="animation-delay: 0.03s" onclick={closeMobileMenu}>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
					Szukaj
				</a>
				<a href="/products" class="mobile-link" style="animation-delay: 0.06s" onclick={closeMobileMenu}>Produkty</a>
				<a href="/categories" class="mobile-link" style="animation-delay: 0.09s" onclick={closeMobileMenu}>Kategorie</a>
				<a href="/deals" class="mobile-link" style="animation-delay: 0.12s" onclick={closeMobileMenu}>Promocje</a>
				<a href="/about" class="mobile-link" style="animation-delay: 0.15s" onclick={closeMobileMenu}>O Nas</a>
				<a href="/contact" class="mobile-link" style="animation-delay: 0.18s" onclick={closeMobileMenu}>Kontakt</a>

				{#if userStore.current}
					<div class="mobile-separator">
						<a href="/account" class="mobile-link" onclick={closeMobileMenu}>Moje Konto</a>
						{#if userStore.current.isAdmin}
							<a href="/admin" class="mobile-link" onclick={closeMobileMenu}>Panel Administratora</a>
						{/if}
						<button onclick={handleLogout} class="mobile-link mobile-link--danger w-full"
							>Wyloguj</button
						>
					</div>
				{:else}
					<div class="mobile-separator">
						<a href="/auth/login" class="mobile-login-btn" onclick={closeMobileMenu}>Zaloguj</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
	/* ── Logo theme switching ── */
	.logo-light { display: none; }
	.logo-dark { display: block; }
	:global(.light) .logo-light { display: block; }
	:global(.light) .logo-dark { display: none; }

	/* ── Accent line — precision brand stripe ── */
	.nav-accent {
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(55, 138, 146, 0.8) 22%,
			var(--ft-brand-border) 50%,
			rgba(55, 138, 146, 0.8) 78%,
			transparent 100%
		);
		opacity: 0.65;
		transition: opacity 0.4s ease;
	}

	nav.is-scrolled .nav-accent {
		opacity: 1;
	}

	:global(.light) .nav-accent {
		height: 0;
	}

	/* ── Nav body — transparent glass over hero ── */
	.nav-body {
		position: relative;
		background: var(--ft-surface);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		padding: 0.95rem 0;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		border-bottom: 1px solid var(--ft-card-hover);
	}

	.nav-body::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			90deg,
			rgba(55, 138, 146, 0) 0%,
			var(--ft-brand-subtle) 35%,
			rgba(55, 138, 146, 0) 70%
		);
		opacity: 0.7;
	}

	nav.is-scrolled .nav-body {
		padding: 0.6rem 0;
		background: var(--ft-surface);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom-color: var(--ft-border);
		box-shadow:
			0 6px 24px var(--ft-shadow-heavy),
			0 1px 0 var(--ft-brand-glow);
	}

	/* ── Nav links — industrial uppercase ── */
	.nav-link {
		font-family: var(--font-heading);
		text-transform: uppercase;
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--ft-text-muted);
		padding: 0.5rem 1.05rem;
		position: relative;
		transition: color 0.3s;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -0.1rem;
		left: 1.05rem;
		right: 1.05rem;
		height: 1px;
		background: var(--ft-primary);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 0 10px var(--ft-brand-border);
	}

	.nav-link:hover {
		color: var(--ft-text);
	}
	.nav-link:hover::after {
		transform: scaleX(1);
	}

	/* ── Icon buttons ── */
	.nav-icon {
		padding: 0.45rem;
		color: var(--ft-text-secondary);
		transition: color 0.2s, background-color 0.2s, border-color 0.2s;
		cursor: pointer;
		border: 1px solid var(--ft-border-subtle);
		background: var(--ft-card);
	}

	@media (min-width: 640px) {
		.nav-icon {
			padding: 0.57rem;
		}
	}

	.nav-icon:hover {
		color: var(--ft-text);
		border-color: var(--ft-brand-border);
		background: var(--ft-brand-muted);
	}

	/* ── Cart badge — sharp, no radius ── */
	.cart-badge {
		position: absolute;
		top: -0.2rem;
		right: -0.25rem;
		background: var(--ft-primary);
		color: var(--ft-text);
		font-size: 0.58rem;
		font-weight: 700;
		min-width: 1rem;
		height: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.2rem;
		font-variant-numeric: tabular-nums;
	}

	/* ── Login button — precision outlined ── */
	.login-btn {
		font-family: var(--font-heading);
		text-transform: uppercase;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--ft-primary);
		border: 1px solid var(--ft-brand-border);
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		padding: 0 1.2rem;
		transition: all 0.25s ease;
		background: transparent;
	}

	.login-btn:hover {
		background: var(--ft-primary);
		color: white;
		border-color: var(--ft-primary);
		box-shadow: 0 0 16px var(--ft-brand-border);
	}

	/* ── User dropdown — glass-morphism ── */
	.user-dropdown {
		background: var(--ft-surface);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid var(--ft-border);
		box-shadow: 0 8px 32px var(--ft-shadow-heavy);
	}

	.user-dropdown-header {
		background: var(--ft-card);
		border-bottom: 1px solid var(--ft-border-subtle);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 1rem;
		color: var(--ft-text-secondary);
		font-size: 0.875rem;
		transition: all 0.2s;
		cursor: pointer;
	}

	.dropdown-item:hover {
		color: var(--ft-text);
		background-color: var(--ft-border-subtle);
	}

	.dropdown-item--danger {
		color: var(--color-danger);
	}
	.dropdown-item--danger:hover {
		color: var(--color-danger);
		background-color: rgba(220, 38, 38, 0.1);
	}

	.dropdown-separator {
		border-top: 1px solid var(--ft-border);
	}

	/* ── Mobile menu — full-screen dark overlay ── */
	.mobile-overlay {
		background: var(--ft-surface);
		z-index: 40;
		overflow-y: auto;
	}

	.mobile-menu {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		color: var(--ft-text-secondary);
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition: all 0.2s ease;
		cursor: pointer;
		animation: slideIn 0.25s ease-out both;
		-webkit-tap-highlight-color: transparent;
		min-height: 3rem;
	}

	.mobile-link:hover,
	.mobile-link:active {
		color: var(--ft-text);
		background: var(--ft-border-subtle);
	}

	.mobile-login-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0.875rem 1.25rem;
		min-height: 3rem;
		font-family: var(--font-heading);
		text-transform: uppercase;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--ft-primary);
		border: 1px solid var(--ft-brand-border);
		background: var(--ft-surface-overlay);
		transition: all 0.25s ease;
		-webkit-tap-highlight-color: transparent;
		cursor: pointer;
	}

	.mobile-login-btn:hover,
	.mobile-login-btn:active {
		background: var(--ft-primary-hover);
		color: var(--ft-text);
		border-color: var(--ft-primary-hover);
	}

	.mobile-link--danger {
		color: var(--color-danger);
	}
	.mobile-link--danger:hover {
		color: var(--color-danger);
		background-color: rgba(220, 38, 38, 0.08);
	}

	.mobile-separator {
		border-top: 1px solid var(--ft-border);
		padding-top: 0.75rem;
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	/* ── Animations ── */
	.animate-drop-in {
		animation: dropIn 0.2s ease-out;
	}
	@keyframes dropIn {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.animate-slide-down {
		animation: slideDown 0.25s ease-out;
	}
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
