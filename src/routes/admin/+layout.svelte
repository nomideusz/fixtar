<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';

	const { children } = $props<{ children?: Snippet }>();

	// Check if user is admin
	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) {
			goto('/');
		}
	});

	// Navigation items
	const navItems = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			href: '/admin/products',
			label: 'Products',
			icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
		},
		{
			href: '/admin/baselinker',
			label: 'BaseLinker',
			icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
		},
		{
			href: '/admin/orders',
			label: 'Orders',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
		},
		{
			href: '/admin/customers',
			label: 'Customers',
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
		}
	];
</script>

<div class="min-h-screen bg-neutral-50">
	<!-- Admin Header -->
	<header class="border-b bg-white shadow-sm">
		<div class="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold text-neutral-900">FixTar Admin</h1>
				</div>
				<div class="flex items-center gap-4">
					<span class="text-sm text-neutral-600">
						{userStore.current?.email}
					</span>
					<a href="/" class="text-brand-600 hover:text-brand-800 text-sm"> Back to Store </a>
				</div>
			</div>
		</div>
	</header>

	<!-- Admin Navigation -->
	<nav class="bg-white shadow-sm">
		<div class="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
			<div class="flex space-x-8">
				{#each navItems as item (item)}
					<a
						href={item.href}
						class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors {$page
							.url.pathname === item.href
							? 'border-brand-500 text-neutral-900'
							: 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'}"
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
						</svg>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	</nav>

	<!-- Page Content -->
	<main>
		{@render children?.()}
	</main>
</div>

<style>
	/* Override dark semantic tokens for admin light theme */
	div {
		--card-bg: #ffffff;
		--card-border: #e5e5e5;
		--card-text: #171717;
		--card-bg-hover: #fafafa;
		--card-border-hover: #d4d4d4;
		--ft-surface: #ffffff;
		--ft-surface-secondary: #fafafa;
		--ft-surface-tertiary: #f5f5f5;
		--ft-surface-elevated: #ffffff;
		--ft-text: #171717;
		--ft-text-secondary: #525252;
		--ft-text-muted: #a3a3a3;
		--ft-border: #e5e5e5;
		--ft-border-hover: #d4d4d4;
	}
</style>
