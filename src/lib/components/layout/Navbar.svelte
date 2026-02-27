<script lang="ts">
	import { onMount } from 'svelte';
	import { cart, userStore } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import FixTarLogoWhite from '$lib/img/logo-FixTar-white.webp';

	interface Props {
		onCartOpen?: () => void;
	}

	let { onCartOpen }: Props = $props();

	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);
	let scrolled = $state(false);

	onMount(() => {
		const onScroll = () => { scrolled = window.scrollY > 20; };
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	const cartCount = $derived(cart.count);

	async function handleLogout() {
		userMenuOpen = false;
		userStore.logout();
		try { await fetch('/auth/logout', { method: 'POST', credentials: 'include' }); } catch {
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

<nav class="fixed top-0 left-0 right-0 z-50">
	<!-- Industrial accent line -->
	<div class="nav-accent"></div>

	<!-- Nav body -->
	<div class="nav-body {scrolled ? 'is-scrolled' : ''}">
		<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
			<div class="flex justify-between items-center">
				<!-- Logo -->
				<a href="/" class="group shrink-0">
					<img src={FixTarLogoWhite} alt="FixTar" class="h-9 md:h-11 w-auto transition-all duration-300 group-hover:brightness-125" />
				</a>

				<!-- Desktop nav -->
				<div class="hidden lg:flex items-center gap-1">
					<a href="/products" class="nav-link">Produkty</a>
					<a href="/about" class="nav-link">O Nas</a>
					<a href="/contact" class="nav-link">Kontakt</a>
				</div>

				<!-- Actions -->
				<div class="flex items-center gap-2 md:gap-3">
					<a href="/search" class="nav-icon" aria-label="Szukaj">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</a>

					<button onclick={() => onCartOpen?.()} class="nav-icon relative" aria-label="Koszyk">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						{#if cartCount > 0}
							<span class="cart-badge">{cartCount}</span>
						{/if}
					</button>

					{#if userStore.current}
						<div class="relative">
							<button onclick={() => (userMenuOpen = !userMenuOpen)} class="nav-icon" aria-label="Menu użytkownika">
								<div class="flex items-center gap-1.5">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									<svg class="w-3 h-3 transition-transform duration-300 {userMenuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</button>

							{#if userMenuOpen}
								<div class="absolute right-0 mt-3 w-64 user-dropdown overflow-hidden animate-drop-in">
									<div class="px-5 py-4 user-dropdown-header">
										<p class="text-xs uppercase tracking-wider font-heading" style="color: rgba(255,255,255,0.4)">Zalogowany jako</p>
										<p class="font-semibold text-white truncate mt-1">{userStore.current.email}</p>
									</div>
									<div class="p-2">
										<a href="/account" onclick={() => (userMenuOpen = false)} class="dropdown-item">
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
											Moje Konto
										</a>
										{#if userStore.current.isAdmin}
											<a href="/admin" onclick={() => (userMenuOpen = false)} class="dropdown-item">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
												Panel Administratora
											</a>
										{/if}
										<div class="dropdown-separator my-1"></div>
										<button onclick={handleLogout} class="dropdown-item dropdown-item--danger w-full">
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-8m0 0l-4-8m4 8H3" /></svg>
											Wyloguj
										</button>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<a href="/auth/login" class="login-btn hidden md:inline-flex">Zaloguj</a>
					{/if}

					<!-- Mobile toggle -->
					<button onclick={() => (mobileMenuOpen = !mobileMenuOpen)} class="lg:hidden nav-icon" aria-label="Menu">
						<div class="w-5 h-5 flex flex-col justify-center gap-1.5">
							<span class="block h-0.5 w-full bg-current transition-all duration-300 {mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}"></span>
							<span class="block h-0.5 w-full bg-current transition-all duration-300 {mobileMenuOpen ? 'opacity-0' : ''}"></span>
							<span class="block h-0.5 w-full bg-current transition-all duration-300 {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu — full-screen overlay -->
	{#if mobileMenuOpen}
		<div class="lg:hidden fixed inset-x-0 bottom-0 mobile-overlay" style="top: calc(3px + 4.5rem)">
			<div class="mobile-menu animate-slide-down">
				<a href="/search" class="mobile-link">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
					Szukaj
				</a>
				<a href="/products" class="mobile-link">Produkty</a>
				<a href="/about" class="mobile-link">O Nas</a>
				<a href="/contact" class="mobile-link">Kontakt</a>

				{#if userStore.current}
					<div class="mobile-separator">
						<a href="/account" class="mobile-link">Moje Konto</a>
						{#if userStore.current.isAdmin}
							<a href="/admin" class="mobile-link">Panel Administratora</a>
						{/if}
						<button onclick={handleLogout} class="mobile-link mobile-link--danger w-full">Wyloguj</button>
					</div>
				{:else}
					<div class="mobile-separator">
						<Button href="/auth/login" variant="outline" fullWidth>Zaloguj</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
	/* ── Accent line — brand identity stripe ── */
	.nav-accent {
		height: 3px;
		background: linear-gradient(90deg, var(--ft-primary) 0%, var(--color-accent-500) 50%, var(--ft-primary) 100%);
	}

	/* ── Nav body ── */
	.nav-body {
		background-color: #0c1117;
		padding: 1.25rem 0;
		transition: all 0.3s ease;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.nav-body.is-scrolled {
		padding: 0.75rem 0;
		background-color: rgba(12, 17, 23, 0.97);
		backdrop-filter: blur(12px);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
	}

	/* ── Nav links — industrial uppercase ── */
	.nav-link {
		font-family: var(--font-heading);
		text-transform: uppercase;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		padding: 0.5rem 1.25rem;
		position: relative;
		transition: color 0.3s;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 1.25rem;
		right: 1.25rem;
		height: 2px;
		background-color: var(--ft-primary);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease;
	}

	.nav-link:hover { color: white; }
	.nav-link:hover::after { transform: scaleX(1); }

	/* ── Icon buttons ── */
	.nav-icon {
		padding: 0.5rem;
		color: rgba(255, 255, 255, 0.5);
		transition: color 0.2s;
		cursor: pointer;
	}

	.nav-icon:hover { color: var(--ft-primary); }

	/* ── Cart badge — sharp, industrial ── */
	.cart-badge {
		position: absolute;
		top: -0.25rem;
		right: -0.375rem;
		background-color: var(--ft-primary);
		color: white;
		font-size: 0.625rem;
		font-weight: 700;
		min-width: 1.125rem;
		height: 1.125rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-variant-numeric: tabular-nums;
	}

	/* ── Login button — outlined, industrial ── */
	.login-btn {
		font-family: var(--font-heading);
		text-transform: uppercase;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: var(--ft-primary);
		border: 1px solid rgba(55, 138, 146, 0.4);
		padding: 0.5rem 1.5rem;
		transition: all 0.25s;
	}

	.login-btn:hover {
		background-color: var(--ft-primary);
		color: white;
		border-color: var(--ft-primary);
	}

	/* ── User dropdown — dark themed ── */
	.user-dropdown {
		background-color: #141b24;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.user-dropdown-header {
		background-color: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 1rem;
		color: rgba(255, 255, 255, 0.55);
		font-size: 0.875rem;
		transition: all 0.2s;
		cursor: pointer;
	}

	.dropdown-item:hover {
		color: white;
		background-color: rgba(255, 255, 255, 0.05);
	}

	.dropdown-item--danger { color: var(--color-danger); }
	.dropdown-item--danger:hover {
		color: var(--color-danger);
		background-color: rgba(220, 38, 38, 0.1);
	}

	.dropdown-separator {
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	/* ── Mobile menu — full-screen dark overlay ── */
	.mobile-overlay {
		background-color: #0c1117;
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
		padding: 0.875rem 1rem;
		color: rgba(255, 255, 255, 0.55);
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 0.9rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		transition: all 0.2s;
		cursor: pointer;
	}

	.mobile-link:hover {
		color: white;
		background-color: rgba(255, 255, 255, 0.04);
	}

	.mobile-link--danger { color: var(--color-danger); }
	.mobile-link--danger:hover {
		color: var(--color-danger);
		background-color: rgba(220, 38, 38, 0.08);
	}

	.mobile-separator {
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		padding-top: 0.75rem;
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	/* ── Animations ── */
	.animate-drop-in { animation: dropIn 0.2s ease-out; }
	@keyframes dropIn {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.animate-slide-down { animation: slideDown 0.25s ease-out; }
	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-12px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
