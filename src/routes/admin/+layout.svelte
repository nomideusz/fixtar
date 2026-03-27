<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { SquaresFourIcon, PackageIcon, LinkIcon, ReceiptIcon, UsersIcon } from 'phosphor-svelte';

	const { children } = $props<{ children?: Snippet }>();

	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) goto('/');
	});

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: SquaresFourIcon },
		{ href: '/admin/products', label: 'Products', icon: PackageIcon },
		{ href: '/admin/baselinker', label: 'BaseLinker', icon: LinkIcon },
		{ href: '/admin/orders', label: 'Orders', icon: ReceiptIcon },
		{ href: '/admin/customers', label: 'Customers', icon: UsersIcon }
	];
</script>

<div class="min-h-screen bg-[--ft-bg]">
	<!-- Admin Header -->
	<header class="border-b border-[--ft-line] bg-[--ft-surface] shadow-sm">
		<div class="ft-container">
			<div class="flex h-16 items-center justify-between">
				<h1 class="text-xl font-semibold text-[--ft-text-strong]">FixTar Admin</h1>
				<div class="flex items-center gap-4">
					<span class="text-sm text-[--ft-text-muted]">{userStore.current?.email}</span>
					<a href="/" class="text-sm text-[--ft-accent] hover:text-[--ft-accent-hover]">Back to Store</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Admin Navigation -->
	<nav class="border-b border-[--ft-line] bg-[--ft-surface] shadow-sm">
		<div class="ft-container">
			<div class="flex space-x-8">
				{#each navItems as item (item.href)}
					{@const Icon = item.icon}
					<a
						href={item.href}
						class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors {$page.url.pathname === item.href
							? 'border-[--ft-accent] text-[--ft-text-strong]'
							: 'border-transparent text-[--ft-text-muted] hover:border-[--ft-line] hover:text-[--ft-text]'}"
					>
						<Icon class="mr-2 h-4 w-4" aria-hidden="true" />
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	</nav>

	<main>
		{@render children?.()}
	</main>
</div>
