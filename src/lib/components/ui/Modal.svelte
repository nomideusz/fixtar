<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { XIcon } from 'phosphor-svelte';

	interface Props {
		open: boolean;
		onClose?: () => void;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		children?: Snippet;
	}

	let { open = false, onClose, title, size = 'md', children }: Props = $props();

	let dialog: HTMLDialogElement;

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-2xl'
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
	class="ft-dialog rounded-lg p-0 shadow-xl backdrop:bg-black/50 {sizeClasses[size]} w-full"
	onclick={handleBackdropClick}
	onkeydown={handleEscape}
>
	<div class="rounded-lg bg-[var(--ft-surface)] border border-[--ft-line]">
		{#if title}
			<div class="flex items-center justify-between border-b border-[--ft-line] p-4">
				<h3 class="text-lg font-semibold text-[--ft-text]">{title}</h3>
				<button
					type="button"
					onclick={onClose}
					class="focus:ring-[--ft-accent] rounded-lg p-1 text-[--ft-text-muted] hover:text-[--ft-text] focus:ring-2 focus:outline-none"
					aria-label="Zamknij"
				>
					<XIcon size={20} weight="light" aria-hidden="true" />
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

	dialog.ft-dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		margin: 0;
		transform: translate(-50%, -50%);
		max-height: min(90dvh, 90vh);
		overscroll-behavior: contain;
	}

	dialog.ft-dialog > div {
		max-height: inherit;
		overflow-y: auto;
	}
</style>
