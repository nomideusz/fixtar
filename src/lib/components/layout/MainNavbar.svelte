<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { cart, userStore } from '$lib/stores';
	import FixTarLogo from '$lib/img/logo-FixTar.png';

	const {
		mobileMenuOpen,
		scrollY,
		toggleMobileMenu,
		toggleSearch,
		toggleCart,
		currentLanguage,
		t,
		toggleLanguage
	}: {
		mobileMenuOpen: boolean;
		scrollY: number;
		toggleMobileMenu: () => void;
		toggleSearch: () => void;
		toggleCart: () => void;
		currentLanguage: string;
		t: (key: string) => string;
		toggleLanguage: () => void;
	} = $props();

	// Local state
	let userMenuOpen = $state(false);

	// Navigation items
	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'Products', href: '/products' },
		{ name: 'Categories', href: '/categories' },
		{ name: 'Deals', href: '/deals' },
		{ name: 'About', href: '/about' },
		{ name: 'Contact', href: '/contact' }
	];

	// Derived values
	const isScrolled = $derived(scrollY > 20);
	const cartItemCount = $derived(cart.items.reduce((sum, item) => sum + item.quantity, 0));
	const isAuthenticated = $derived(!!userStore.current);

	function handleNavLinkClick() {
		if (mobileMenuOpen) {
			toggleMobileMenu();
		}
	}

	function handleLogout() {
		userStore.logout();
		userMenuOpen = false;
		goto('/');
	}

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	function closeUserMenu() {
		userMenuOpen = false;
	}
</script>

<!-- Close user menu when clicking outside -->
{#if userMenuOpen}
	<div 
		class="fixed inset-0 z-40" 
		role="presentation"
		onclick={closeUserMenu}
		onkeydown={(e) => e.key === 'Escape' && closeUserMenu()}
	></div>
{/if}

<nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200 transition-all duration-300 {isScrolled ? 'shadow-lg' : ''}">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo -->
			<div class="shrink-0">
				<a href="/" class="flex items-center">
					<img src={FixTarLogo} alt="FixTar" class="h-8 w-auto" />
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					{#each navItems as item (item)}
						<a
							href={item.href}
							class="px-3 py-2 rounded-md text-sm font-medium transition-colors {
								$page.url.pathname === item.href
									? 'bg-brand-100 text-brand-700'
									: 'text-neutral-700 hover:text-brand-600 hover:bg-neutral-100'
							}"
						>
							{item.name}
						</a>
					{/each}
				</div>
			</div>

			<!-- Right side actions -->
			<div class="flex items-center space-x-4">
				<!-- Search -->
				<button
					onclick={toggleSearch}
					class="p-2 text-neutral-600 hover:text-brand-600 transition-colors"
					aria-label="Search"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</button>

				<!-- Cart -->
				<button
					onclick={toggleCart}
					class="relative p-2 text-neutral-600 hover:text-brand-600 transition-colors"
					aria-label="Shopping cart"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
					</svg>
					{#if cartItemCount > 0}
						<span class="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							{cartItemCount}
						</span>
					{/if}
				</button>

				<!-- User menu -->
				{#if isAuthenticated}
					<div class="relative">
						<button
							onclick={toggleUserMenu}
						class="flex items-center p-2 text-neutral-600 hover:text-brand-600 transition-colors"
							aria-label="User menu"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							<svg class="w-4 h-4 ml-1 transition-transform {userMenuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						<!-- Dropdown Menu -->
						{#if userMenuOpen}
							<div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-neutral-200">
								<div class="px-4 py-2 text-sm text-neutral-500 border-b border-neutral-100">
									{userStore.current?.email}
								</div>
								<a
									href="/account"
									onclick={closeUserMenu}
									class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
								>
									My Account
								</a>
								{#if userStore.current?.isAdmin}
									<a
										href="/admin"
										onclick={closeUserMenu}
										class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
									>
										Admin Panel
									</a>
								{/if}
								<button
									onclick={handleLogout}
									class="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
								>
									Logout
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/auth/login"
						class="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors"
					>
						Login
					</a>
				{/if}

				<!-- Mobile menu button -->
				<button
					onclick={toggleMobileMenu}
					class="md:hidden p-2 text-neutral-600 hover:text-brand-600 transition-colors"
					aria-label="Menu"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="md:hidden">
				<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-neutral-200">
					{#each navItems as item (item)}
						<a
							href={item.href}
							onclick={handleNavLinkClick}
							class="block px-3 py-2 rounded-md text-base font-medium transition-colors {
								$page.url.pathname === item.href
									? 'bg-brand-100 text-brand-700'
									: 'text-neutral-700 hover:text-brand-600 hover:bg-neutral-100'
							}"
						>
							{item.name}
						</a>
					{/each}
					
					{#if isAuthenticated}
						<div class="border-t border-neutral-200 pt-3 mt-3">
							<a
								href="/account"
								onclick={handleNavLinkClick}
								class="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-brand-600 hover:bg-neutral-100"
							>
								My Account
							</a>
							<button
								onclick={handleLogout}
								class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-brand-600 hover:bg-neutral-100"
							>
								Logout
							</button>
						</div>
					{:else}
						<div class="border-t border-neutral-200 pt-3 mt-3">
							<a
								href="/auth/login"
								onclick={handleNavLinkClick}
								class="block px-3 py-2 rounded-md text-base font-medium bg-brand-600 text-white hover:bg-brand-700"
							>
								Login
							</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</nav>


