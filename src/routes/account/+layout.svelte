<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import AccountNavIcon from '$lib/components/account/AccountNavIcon.svelte';
	import { UserIcon, CheckIcon, CheckCircleIcon, CaretRightIcon, ListIcon, XIcon } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();

	const user = $derived(data.user || userStore.current);

	$effect(() => {
		if (!user) goto('/auth/login');
	});

	const navItems = [
		{ label: 'Przegląd', href: '/account', icon: 'overview', description: 'Panel główny konta' },
		{ label: 'Zamówienia', href: '/account/orders', icon: 'orders', description: 'Historia zamówień' },
		{ label: 'Adresy', href: '/account/addresses', icon: 'addresses', description: 'Adresy dostawy' },
		{ label: 'Ulubione', href: '/account/favorites', icon: 'favorites', description: 'Zapisane produkty' },
		{ label: 'Ustawienia', href: '/account/settings', icon: 'settings', description: 'Preferencje konta' }
	];

	const quickActions = [
		{ label: 'Kontynuuj zakupy', href: '/products', icon: 'orders' },
		{ label: 'Centrum pomocy', href: '/contact', icon: 'overview' }
	];

	function isActive(href: string) {
		return href === '/account' ? $page.url.pathname === href : $page.url.pathname.startsWith(href);
	}

	let mobileMenuOpen = $state(false);
</script>

{#if user}
	<div class="min-h-screen">
		<div class="ft-container ft-section-sm">
			<div class="flex flex-col gap-8 lg:flex-row">
				<!-- Desktop Sidebar -->
				<div class="hidden shrink-0 lg:block lg:w-80">
					<div class="sticky top-8">
						<Card class="p-6">
							<!-- UserIcon Profile -->
							<div class="mb-8 text-center">
								<div class="relative mb-4 inline-block">
									<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[--ft-accent]/20 ring-4 ring-[--ft-line]">
										<UserIcon class="text-[--ft-accent] h-10 w-10" aria-hidden="true" />
									</div>
									<div class="bg-success absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-3 border-[--ft-surface]">
										<CheckIcon class="h-3 w-3 text-[--ft-text]" aria-hidden="true" />
									</div>
								</div>
								<h3 class="mb-1 text-xl font-bold text-[--ft-text]">{user.name || 'Użytkownik'}</h3>
								<p class="mb-3 text-sm text-[--ft-text-muted]">{user.email}</p>
								<div class="bg-[--ft-frost] text-[--ft-accent] inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
									<CheckCircleIcon class="mr-1 h-3 w-3" aria-hidden="true" />
									Aktywne konto
								</div>
							</div>

							<!-- Navigation -->
							<nav class="space-y-2">
								{#each navItems as item (item.href)}
									<a href={item.href} class="nav-item group {isActive(item.href) ? 'nav-item-active' : 'nav-item-inactive'}">
										<div class="flex items-center">
											<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg {isActive(item.href) ? 'bg-[--ft-accent]/20' : 'bg-[--ft-frost] group-hover:bg-[--ft-frost]'} transition-colors duration-200">
												<AccountNavIcon icon={item.icon} class="h-5 w-5 {isActive(item.href) ? 'text-[--ft-accent]' : 'text-[--ft-text-muted] group-hover:text-[--ft-accent]'}" />
											</div>
											<div class="min-w-0 flex-1">
												<div class="group-hover:text-[--ft-accent] font-semibold text-[--ft-text] transition-colors duration-200">{item.label}</div>
												<div class="truncate text-xs text-[--ft-text-muted]">{item.description}</div>
											</div>
											{#if isActive(item.href)}
												<CaretRightIcon class="ml-2 h-4 w-4 text-[--ft-accent]" aria-hidden="true" />
											{/if}
										</div>
									</a>
								{/each}
							</nav>

							<!-- Quick Actions -->
							<div class="mt-8 border-t border-[--ft-line] pt-6">
								<div class="space-y-2">
									{#each quickActions as action (action.href)}
										<a href={action.href} class="hover:text-[--ft-accent] hover:bg-[--ft-frost] flex items-center rounded-lg px-3 py-2 text-sm font-medium text-[--ft-text-muted] transition-colors duration-200">
											<span class="mr-3"><AccountNavIcon icon={action.icon} class="h-4 w-4" /></span>
											{action.label}
										</a>
									{/each}
								</div>
							</div>
						</Card>
					</div>
				</div>

				<!-- Mobile Navigation Button -->
				<div class="fixed right-6 bottom-6 z-50 lg:hidden">
					<button onclick={() => (mobileMenuOpen = true)} class="bg-[--ft-accent] hover:bg-[--ft-accent-hover] flex h-14 w-14 items-center justify-center rounded-full !text-white shadow-lg transition-colors duration-200" aria-label="Otwórz menu konta">
						<ListIcon class="h-6 w-6" aria-hidden="true" />
					</button>
				</div>

				<!-- Mobile Navigation Menu -->
				{#if mobileMenuOpen}
					<div class="fixed inset-0 z-50 lg:hidden">
						<div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" role="button" tabindex="0" onclick={() => (mobileMenuOpen = false)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') mobileMenuOpen = false; }}></div>

						<div class="fixed inset-y-0 left-0 w-full max-w-sm bg-[--ft-surface] shadow-2xl">
							<div class="flex h-full flex-col">
								<!-- Header -->
								<div class="flex items-center justify-between border-b border-[--ft-line] bg-[--ft-surface] p-6">
									<h3 class="text-lg font-bold text-[--ft-text]">Menu konta</h3>
									<button onclick={() => (mobileMenuOpen = false)} class="rounded-lg p-2 transition-colors duration-200 hover:bg-[--ft-frost]" aria-label="Zamknij menu konta">
										<XIcon class="h-5 w-5" aria-hidden="true" />
									</button>
								</div>

								<!-- UserIcon Profile -->
								<div class="border-b border-[--ft-line] p-6">
									<div class="flex items-center">
										<div class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-[--ft-accent]/20">
											<UserIcon class="text-[--ft-accent] h-6 w-6" aria-hidden="true" />
										</div>
										<div>
											<h4 class="font-semibold text-[--ft-text]">{user.name || 'Użytkownik'}</h4>
											<p class="text-sm text-[--ft-text-muted]">{user.email}</p>
										</div>
									</div>
								</div>

								<!-- Navigation -->
								<div class="flex-1 overflow-y-auto p-6">
									<nav class="space-y-2">
										{#each navItems as item (item.href)}
											<a href={item.href} onclick={() => (mobileMenuOpen = false)} class="mobile-nav-item {isActive(item.href) ? 'mobile-nav-item-active' : 'mobile-nav-item-inactive'}">
												<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg {isActive(item.href) ? 'bg-[--ft-accent]/20' : 'bg-[--ft-frost]'}">
													<AccountNavIcon icon={item.icon} class="h-4 w-4 {isActive(item.href) ? 'text-[--ft-accent]' : 'text-[--ft-text-muted]'}" />
												</div>
												<div>
													<div class="font-medium">{item.label}</div>
													<div class="text-xs text-[--ft-text-muted]">{item.description}</div>
												</div>
											</a>
										{/each}
									</nav>

									<!-- Mobile Quick Actions -->
									<div class="mt-8 border-t border-[--ft-line] pt-6">
										<div class="space-y-2">
											{#each quickActions as action (action.href)}
												<a href={action.href} onclick={() => (mobileMenuOpen = false)} class="mobile-nav-item mobile-nav-item-inactive">
													<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[--ft-frost]">
														<AccountNavIcon icon={action.icon} class="h-4 w-4 text-[--ft-text-muted]" />
													</div>
													<div>{action.label}</div>
												</a>
											{/each}
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
		transition: background-color 0.2s, color 0.2s;
		text-decoration: none;
	}

	.nav-item-active {
		background-color: var(--ft-cta-light);
		color: var(--ft-cta);
		border: 1px solid color-mix(in srgb, var(--ft-cta) 20%, transparent);
	}

	.nav-item-inactive {
		color: var(--ft-text);
	}

	.nav-item-inactive:hover {
		background-color: color-mix(in srgb, var(--ft-cta) 4%, transparent);
		color: var(--ft-cta);
	}

	.mobile-nav-item {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		transition: background-color 0.2s, color 0.2s;
		text-decoration: none;
	}

	.mobile-nav-item-active {
		background-color: var(--ft-cta-light);
		color: var(--ft-cta);
	}

	.mobile-nav-item-inactive {
		color: var(--ft-text);
	}

	.mobile-nav-item-inactive:hover {
		background-color: color-mix(in srgb, var(--ft-cta) 4%, transparent);
		color: var(--ft-cta);
	}
</style>
