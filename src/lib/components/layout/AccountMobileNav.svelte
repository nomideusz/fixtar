<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';

	const {
		isOpen = false,
		onClose = () => {}
	}: {
		isOpen?: boolean;
		onClose?: () => void;
	} = $props();

	const menuItems = [
		{ href: '/account', label: 'Przegląd', icon: 'overview' },
		{ href: '/account/orders', label: 'Zamówienia', icon: 'orders' },
		{ href: '/account/favorites', label: 'Ulubione', icon: 'favorites' },
		{ href: '/account/addresses', label: 'Adresy', icon: 'addresses' },
		{ href: '/account/settings', label: 'Ustawienia', icon: 'settings' }
	];

	function handleItemClick() {
		onClose();
	}

	// Focus trap
	let dialogElement = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!isOpen || !dialogElement) return;

		const focusableSelectors = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
		const focusableElements = dialogElement.querySelectorAll<HTMLElement>(focusableSelectors);
		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];

		firstFocusable?.focus();

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				onClose();
				return;
			}
			if (e.key === 'Tab') {
				if (e.shiftKey) {
					if (document.activeElement === firstFocusable) {
						e.preventDefault();
						lastFocusable?.focus();
					}
				} else {
					if (document.activeElement === lastFocusable) {
						e.preventDefault();
						firstFocusable?.focus();
					}
				}
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if isOpen}
	<div
		class="mobile-nav-overlay"
		onclick={onClose}
		role="presentation"
	>
		<div
			bind:this={dialogElement}
			role="dialog"
			aria-label="Menu konta"
			aria-modal="true"
			tabindex="-1"
			class="mobile-nav-content"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === 'Escape' && onClose()}
		>
			<Card class="p-6">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-[--ft-text]">Menu konta</h2>
					<Button variant="ghost" size="sm" onclick={onClose} aria-label="Zamknij menu konta">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</Button>
				</div>

				<nav class="space-y-2">
					{#each menuItems as item (item.href)}
						<a
							href={item.href}
							class="flex items-center space-x-3 rounded-lg px-4 py-3 text-[--ft-text] transition-colors hover:bg-[--ft-frost]"
							onclick={handleItemClick}
						>
							<span class="flex h-6 w-6 items-center justify-center text-[--ft-text-muted]">
								{#if item.icon === 'overview'}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								{:else if item.icon === 'orders'}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
									</svg>
								{:else if item.icon === 'favorites'}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
									</svg>
								{:else if item.icon === 'addresses'}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								{:else if item.icon === 'settings'}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								{/if}
							</span>
							<span class="font-medium">{item.label}</span>
						</a>
					{/each}
				</nav>
			</Card>
		</div>
	</div>
{/if}

<style>
	.mobile-nav-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 50;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem;
	}

	.mobile-nav-content {
		width: 100%;
		max-width: 24rem;
	}
</style>
