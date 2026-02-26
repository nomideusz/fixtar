<script lang="ts">
	import { onMount } from 'svelte';
	import { cart, userStore } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import FixTarLogo from '$lib/img/logo-FixTar.webp';

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

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'py-3' : 'py-5'}">
	<div class="absolute inset-0 nav-shell backdrop-blur-md {scrolled ? 'shadow-xl' : 'shadow-lg'} transition-all duration-300"></div>

	<div class="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
		<div class="flex justify-between items-center">
			<!-- Logo -->
			<a href="/" class="group">
				<img src={FixTarLogo} alt="FixTar" class="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
			</a>

			<!-- Desktop nav -->
			<div class="hidden lg:flex items-center gap-1">
				<a href="/products" class="nav-link">Produkty</a>
				<a href="/about" class="nav-link">O Nas</a>
				<a href="/contact" class="nav-link">Kontakt</a>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-3 md:gap-4">
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
						<span class="absolute -top-2 -right-2 bg-brand-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold shadow-md">
							{cartCount}
						</span>
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
							<div class="absolute right-0 mt-3 w-64 menu-panel shadow-xl overflow-hidden animate-drop-in">
								<div class="p-5 menu-panel-header border-b">
									<p class="text-sm text-neutral-600">Zalogowany jako</p>
									<p class="font-semibold text-neutral-900 truncate">{userStore.current.email}</p>
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
									<div class="menu-separator my-2"></div>
									<button onclick={handleLogout} class="dropdown-item text-danger hover:text-danger-dark hover:bg-danger/5 w-full">
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-8m0 0l-4-8m4 8H3" /></svg>
										Wyloguj
									</button>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<Button href="/auth/login" variant="primary" class="hidden md:flex">Zaloguj</Button>
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

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4">
			<div class="mobile-panel shadow-xl overflow-hidden p-6 space-y-2">
				<a href="/search" class="mobile-link"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>Szukaj</a>
				<a href="/products" class="mobile-link">Produkty</a>
				<a href="/about" class="mobile-link">O Nas</a>
				<a href="/contact" class="mobile-link">Kontakt</a>

				{#if userStore.current}
					<div class="menu-separator pt-4 mt-4 space-y-2">
						<a href="/account" class="mobile-link">Moje Konto</a>
						{#if userStore.current.isAdmin}
							<a href="/admin" class="mobile-link">Panel Administratora</a>
						{/if}
						<button onclick={handleLogout} class="mobile-link text-danger hover:text-danger hover:bg-danger-light w-full">Wyloguj</button>
					</div>
				{:else}
					<div class="menu-separator pt-4 mt-4">
						<Button href="/auth/login" fullWidth>Zaloguj</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
	.nav-shell {
		background-color: color-mix(in srgb, var(--ft-surface) 95%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--ft-border) 65%, transparent);
	}

	.menu-panel,
	.mobile-panel {
		background-color: var(--ft-surface-elevated);
		border: 1px solid var(--ft-border);
	}

	.menu-panel-header {
		background-color: var(--ft-surface-secondary);
		border-color: var(--ft-border);
	}

	.menu-separator {
		border-top: 1px solid var(--ft-border);
	}

	.nav-link {
		padding: 0.5rem 1rem;
		color: var(--ft-text-secondary);
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: all 0.2s;
	}
	.nav-link:hover { color: var(--ft-primary); background-color: var(--ft-primary-light); }

	.nav-icon {
		padding: 0.5rem;
		color: var(--ft-text-muted);
		border-radius: var(--radius-md);
		transition: all 0.2s;
		cursor: pointer;
	}
	.nav-icon:hover { color: var(--ft-primary); background-color: var(--ft-primary-light); }

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 1rem;
		color: var(--ft-text-secondary);
		border-radius: var(--radius-md);
		transition: all 0.2s;
		cursor: pointer;
	}
	.dropdown-item:hover { color: var(--ft-primary); background-color: var(--ft-primary-light); }

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		color: var(--ft-text-secondary);
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: all 0.2s;
		cursor: pointer;
	}
	.mobile-link:hover { color: var(--ft-primary); background-color: var(--ft-primary-light); }

	.animate-drop-in { animation: dropIn 0.2s ease-out; }
	@keyframes dropIn {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
