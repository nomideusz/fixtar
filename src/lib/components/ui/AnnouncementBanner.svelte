<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	const {
		message = 'Welcome to our store!',
		actionText = 'Shop Now',
		actionUrl = '/products',
		dismissible = true
	}: {
		message?: string;
		actionText?: string;
		actionUrl?: string;
		dismissible?: boolean;
	} = $props();

	let visible = $state(true);

	function dismiss() {
		visible = false;
	}
</script>

{#if visible}
	<div class="announcement-banner">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-3">
				<div class="flex items-center space-x-4">
					<span class="text-sm font-medium">{message}</span>
					{#if actionUrl}
						<Button 
							href={actionUrl}
							variant="ghost"
							size="sm"
							class="announcement-action"
						>
							{actionText}
						</Button>
					{/if}
				</div>
				
				{#if dismissible}
					<button 
						onclick={dismiss}
						class="announcement-dismiss"
						aria-label="Dismiss announcement"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.announcement-banner {
		position: relative;
		z-index: 40;
		background-color: var(--ft-primary);
		color: var(--ft-text-inverse);
	}

	:global(.announcement-action) {
		color: var(--ft-text-inverse);
		border: 1px solid color-mix(in srgb, var(--ft-text-inverse) 60%, transparent);
	}

	:global(.announcement-action:hover) {
		background-color: var(--ft-surface);
		color: var(--ft-primary);
	}

	.announcement-dismiss {
		color: color-mix(in srgb, var(--ft-text-inverse) 90%, transparent);
		transition: color 0.2s;
	}

	.announcement-dismiss:hover {
		color: var(--ft-text-inverse);
	}
</style>



