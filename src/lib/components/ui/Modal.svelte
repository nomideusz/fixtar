<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	
	interface Props {
		open: boolean;
		onClose?: () => void;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		children?: Snippet;
	}
	
	let {
		open = false,
		onClose,
		title,
		size = 'md',
		children
	}: Props = $props();
	
	let dialog: HTMLDialogElement;
	
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};
	
	$effect(() => {
		if (dialog) {
			if (open) {
				dialog.showModal();
			} else {
				dialog.close();
			}
		}
	});
	
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialog) {
			onClose?.();
		}
	}
	
	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose?.();
		}
	}
</script>

<dialog
	bind:this={dialog}
	class="p-0 rounded-lg shadow-xl backdrop:bg-black/50 {sizeClasses[size]} w-full"
	onclick={handleBackdropClick}
	onkeydown={handleEscape}
>
	<div class="bg-white rounded-lg">
		{#if title}
			<div class="flex items-center justify-between p-4 border-b border-neutral-200">
				<h3 class="text-lg font-semibold text-neutral-900">{title}</h3>
				<button
					type="button"
					onclick={onClose}
					class="text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
					aria-label="Close modal"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/if}
		
		<div class="p-4">
			{@render children?.()}
		</div>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background-color: var(--ft-surface-overlay);
	}
</style> 
