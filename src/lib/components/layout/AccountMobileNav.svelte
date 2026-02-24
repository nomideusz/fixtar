<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const {
		isOpen = false,
		onClose = () => {}
	}: {
		isOpen?: boolean;
		onClose?: () => void;
	} = $props();

	const menuItems = [
		{ href: '/account', label: 'Overview', icon: '👤' },
		{ href: '/account/orders', label: 'Orders', icon: '📦' },
		{ href: '/account/favorites', label: 'Favorites', icon: '❤️' },
		{ href: '/account/addresses', label: 'Addresses', icon: '📍' },
		{ href: '/account/settings', label: 'Settings', icon: '⚙️' }
	];

	function handleItemClick() {
		onClose();
	}
</script>

{#if isOpen}
	<div 
		class="mobile-nav-overlay" 
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		role="presentation"
	>
		<Card class="mobile-nav-content" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-semibold">Account Menu</h2>
				<Button variant="ghost" size="sm" onclick={onClose}>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
					</svg>
				</Button>
			</div>
			
			<nav class="space-y-2">
				{#each menuItems as item (item)}
					<a 
						href={item.href}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
						onclick={handleItemClick}
					>
						<span class="text-lg">{item.icon}</span>
						<span class="font-medium">{item.label}</span>
					</a>
				{/each}
			</nav>
		</Card>
	</div>
{/if}

<style>
	.mobile-nav-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--ft-surface-overlay);
		z-index: 50;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem;
	}
</style>


