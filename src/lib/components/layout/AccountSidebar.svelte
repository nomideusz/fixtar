<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { page } from '$app/stores';

	const menuItems = [
		{ href: '/account', label: 'Overview', icon: '👤' },
		{ href: '/account/orders', label: 'Orders', icon: '📦' },
		{ href: '/account/favorites', label: 'Favorites', icon: '❤️' },
		{ href: '/account/addresses', label: 'Addresses', icon: '📍' },
		{ href: '/account/settings', label: 'Settings', icon: '⚙️' }
	];
</script>

<Card class="account-sidebar">
	<nav class="space-y-2">
		{#each menuItems as item (item)}
			<a
				href={item.href}
				class="flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors duration-200 {$page
					.url.pathname === item.href
					? 'bg-brand-500/15 text-brand-400 border-brand-500 border-l-4'
					: 'text-neutral-300 hover:bg-white/5'}"
			>
				<span class="text-lg">{item.icon}</span>
				<span class="font-medium">{item.label}</span>
			</a>
		{/each}
	</nav>
</Card>

<style>
	:global(.account-sidebar) {
		min-width: 250px;
		padding: 1rem;
	}
</style>
