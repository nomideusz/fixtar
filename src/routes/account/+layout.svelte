<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();

	// Get user from server data (from layout server load)
	const user = $derived(data.user || userStore.current);

	// Redirect if not logged in
	$effect(() => {
		if (!user) {
			goto('/auth/login');
		}
	});

	// Enhanced navigation items with Polish labels and icons
	const navItems = [
		{
			label: 'Przegląd',
			href: '/account',
			icon: 'overview',
			description: 'Panel główny konta'
		},
		{
			label: 'Zamówienia',
			href: '/account/orders',
			icon: 'orders',
			description: 'Historia zamówień'
		},
		{
			label: 'Adresy',
			href: '/account/addresses',
			icon: 'addresses',
			description: 'Adresy dostawy'
		},
		{
			label: 'Ulubione',
			href: '/account/favorites',
			icon: 'favorites',
			description: 'Zapisane produkty'
		},
		{
			label: 'Ustawienia',
			href: '/account/settings',
			icon: 'settings',
			description: 'Preferencje konta'
		}
	];

	function isActive(href: string) {
		if (href === '/account') {
			return $page.url.pathname === href;
		}
		return $page.url.pathname.startsWith(href);
	}

	// Mobile menu state
	let mobileMenuOpen = $state(false);
</script>

{#if user}
	<div class="min-h-screen bg-white/5">
		<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
			<div class="flex flex-col gap-8 lg:flex-row">
				<!-- Enhanced Desktop Sidebar -->
				<div class="shrink-0 lg:w-80">
					<div class="sticky top-8">
						<Card class="p-6">
							<!-- Enhanced User Profile Section -->
							<div class="mb-8 text-center">
								<div class="relative mb-4 inline-block">
									<div
										class="from-brand-500/100/20 to-accent-500/100/20 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br ring-4 ring-white/10"
									>
										<svg
											class="text-brand-600 h-10 w-10"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									<div
										class="bg-success absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-3 border-white"
									>
										<svg
											class="h-3 w-3 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								</div>
								<h3 class="mb-1 text-xl font-bold text-white">
									{user.name || 'Użytkownik'}
								</h3>
								<p class="mb-3 text-sm text-neutral-400">{user.email}</p>
								<div
									class="bg-brand-100 text-brand-800 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
								>
									<svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Aktywne konto
								</div>
							</div>

							<!-- Enhanced Navigation -->
							<nav class="space-y-2">
								{#each navItems as item (item)}
									<a
										href={item.href}
										class="nav-item group {isActive(item.href)
											? 'nav-item-active'
											: 'nav-item-inactive'}"
									>
										<div class="flex items-center">
											<div
												class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg {isActive(
													item.href
												)
													? 'bg-brand-500/20'
													: 'group-hover:bg-brand-50 bg-white/10'} transition-colors duration-200"
											>
												{#if item.icon === 'overview'}
													<svg
														class="h-5 w-5 {isActive(item.href)
															? 'text-brand-600'
															: 'group-hover:text-brand-600 text-neutral-400'}"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
														/>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="m8 5l4-4 4 4"
														/>
													</svg>
												{:else if item.icon === 'orders'}
													<svg
														class="h-5 w-5 {isActive(item.href)
															? 'text-brand-600'
															: 'group-hover:text-brand-600 text-neutral-400'}"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
														/>
													</svg>
												{:else if item.icon === 'addresses'}
													<svg
														class="h-5 w-5 {isActive(item.href)
															? 'text-brand-600'
															: 'group-hover:text-brand-600 text-neutral-400'}"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														/>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
												{:else if item.icon === 'favorites'}
													<svg
														class="h-5 w-5 {isActive(item.href)
															? 'text-brand-600'
															: 'group-hover:text-brand-600 text-neutral-400'}"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
														/>
													</svg>
												{:else if item.icon === 'settings'}
													<svg
														class="h-5 w-5 {isActive(item.href)
															? 'text-brand-600'
															: 'group-hover:text-brand-600 text-neutral-400'}"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
														/>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
												{/if}
											</div>
											<div class="min-w-0 flex-1">
												<div
													class="group-hover:text-brand-600 font-semibold text-white transition-colors duration-200"
												>
													{item.label}
												</div>
												<div class="truncate text-xs text-neutral-500">
													{item.description}
												</div>
											</div>
											{#if isActive(item.href)}
												<div class="ml-2">
													<svg
														class="text-brand-600 h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M9 5l7 7-7 7"
														/>
													</svg>
												</div>
											{/if}
										</div>
									</a>
								{/each}
							</nav>

							<!-- Account Actions -->
							<div class="mt-8 border-t border-white/10 pt-6">
								<div class="space-y-2">
									<a
										href="/products"
										class="hover:text-brand-600 hover:bg-brand-50 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors duration-200"
									>
										<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
											/>
										</svg>
										Kontynuuj zakupy
									</a>
									<a
										href="/contact"
										class="hover:text-brand-600 hover:bg-brand-50 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors duration-200"
									>
										<svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Centrum pomocy
									</a>
								</div>
							</div>
						</Card>
					</div>
				</div>

				<!-- Mobile Navigation Button -->
				<div class="fixed right-6 bottom-6 z-50 lg:hidden">
					<button
						onclick={() => (mobileMenuOpen = true)}
						class="bg-brand-600 hover:bg-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-colors duration-200"
						aria-label="Otwórz menu konta"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				<!-- Mobile Navigation Menu -->
				{#if mobileMenuOpen}
					<div class="fixed inset-0 z-50 lg:hidden">
						<!-- Backdrop -->
						<div
							class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
							role="button"
							tabindex="0"
							onclick={() => (mobileMenuOpen = false)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') mobileMenuOpen = false;
							}}
						></div>

						<!-- Panel -->
						<div class="fixed inset-y-0 left-0 w-full max-w-sm bg-white/5 shadow-2xl">
							<div class="flex h-full flex-col">
								<!-- Header -->
								<div
									class="flex items-center justify-between border-b border-white/10 bg-white/5 p-6"
								>
									<h3 class="text-lg font-bold text-white">Menu konta</h3>
									<button
										onclick={() => (mobileMenuOpen = false)}
										class="rounded-lg p-2 transition-colors duration-200 hover:bg-white/10"
										aria-label="Zamknij menu konta"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>

								<!-- User Profile -->
								<div class="border-b border-white/10 p-6">
									<div class="flex items-center">
										<div
											class="from-brand-500/100/20 to-accent-500/100/20 mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br"
										>
											<svg
												class="text-brand-600 h-6 w-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
										</div>
										<div>
											<h4 class="font-semibold text-white">
												{user.name || 'Użytkownik'}
											</h4>
											<p class="text-sm text-neutral-400">{user.email}</p>
										</div>
									</div>
								</div>

								<!-- Navigation -->
								<div class="flex-1 overflow-y-auto p-6">
									<nav class="space-y-2">
										{#each navItems as item (item)}
											<a
												href={item.href}
												onclick={() => (mobileMenuOpen = false)}
												class="mobile-nav-item {isActive(item.href)
													? 'mobile-nav-item-active'
													: 'mobile-nav-item-inactive'}"
											>
												<div
													class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg {isActive(
														item.href
													)
														? 'bg-brand-500/20'
														: 'bg-white/10'}"
												>
													{#if item.icon === 'overview'}
														<svg
															class="h-4 w-4 {isActive(item.href)
																? 'text-brand-600'
																: 'text-neutral-400'}"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
															/>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="m8 5l4-4 4 4"
															/>
														</svg>
													{:else if item.icon === 'orders'}
														<svg
															class="h-4 w-4 {isActive(item.href)
																? 'text-brand-600'
																: 'text-neutral-400'}"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
															/>
														</svg>
													{:else if item.icon === 'addresses'}
														<svg
															class="h-4 w-4 {isActive(item.href)
																? 'text-brand-600'
																: 'text-neutral-400'}"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
															/>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
															/>
														</svg>
													{:else if item.icon === 'favorites'}
														<svg
															class="h-4 w-4 {isActive(item.href)
																? 'text-brand-600'
																: 'text-neutral-400'}"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
															/>
														</svg>
													{:else if item.icon === 'settings'}
														<svg
															class="h-4 w-4 {isActive(item.href)
																? 'text-brand-600'
																: 'text-neutral-400'}"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
															/>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
															/>
														</svg>
													{/if}
												</div>
												<div>
													<div class="font-medium">{item.label}</div>
													<div class="text-xs text-neutral-500">{item.description}</div>
												</div>
											</a>
										{/each}
									</nav>

									<!-- Mobile Quick Actions -->
									<div class="mt-8 border-t border-white/10 pt-6">
										<div class="space-y-2">
											<a
												href="/products"
												onclick={() => (mobileMenuOpen = false)}
												class="mobile-nav-item mobile-nav-item-inactive"
											>
												<div
													class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"
												>
													<svg
														class="h-4 w-4 text-neutral-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
														/>
													</svg>
												</div>
												<div>Kontynuuj zakupy</div>
											</a>
											<a
												href="/contact"
												onclick={() => (mobileMenuOpen = false)}
												class="mobile-nav-item mobile-nav-item-inactive"
											>
												<div
													class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"
												>
													<svg
														class="h-4 w-4 text-neutral-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												</div>
												<div>Centrum pomocy</div>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Main Content -->
				<div class="min-w-0 flex-1">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.nav-item {
		display: block;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		transition: all 0.2s;
		text-decoration: none;
	}

	.nav-item-active {
		background-color: rgb(219 234 254);
		color: rgb(29 78 216);
		border: 1px solid rgb(147 197 253);
	}

	.nav-item-inactive {
		color: rgb(55 65 81);
	}

	.nav-item-inactive:hover {
		background-color: rgb(239 246 255);
		color: rgb(37 99 235);
	}

	.mobile-nav-item {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		transition: all 0.2s;
		text-decoration: none;
	}

	.mobile-nav-item-active {
		background-color: rgb(219 234 254);
		color: rgb(29 78 216);
	}

	.mobile-nav-item-inactive {
		color: rgb(55 65 81);
	}

	.mobile-nav-item-inactive:hover {
		background-color: rgb(239 246 255);
		color: rgb(37 99 235);
	}
</style>
