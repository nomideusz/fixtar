<script lang="ts">
	const {
		visible,
		message,
		size = 'md' as 'sm' | 'md' | 'lg',
		variant = 'overlay' as 'overlay' | 'inline',
		color = 'brand' as 'brand' | 'white' | 'muted'
	}: {
		visible: boolean;
		message?: string;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'overlay' | 'inline';
		color?: 'brand' | 'white' | 'muted';
	} = $props();

	const sizeClasses = $derived.by(() => {
		switch (size) {
			case 'sm': return 'w-4 h-4';
			case 'lg': return 'w-8 h-8';
			default: return 'w-6 h-6';
		}
	});

	const colorClasses = $derived.by(() => {
		switch (color) {
			case 'white': return 'text-white';
			case 'muted': return 'text-neutral-400';
			default: return 'text-brand-600';
		}
	});

	const textSizeClasses = $derived.by(() => {
		switch (size) {
			case 'sm': return 'text-xs';
			case 'lg': return 'text-base';
			default: return 'text-sm';
		}
	});
</script>

{#if visible}
	{#if variant === 'overlay'}
		<!-- Full screen overlay version -->
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
			<div class="flex flex-col items-center">
				<div class="relative">
					<!-- Outer ring -->
					<div class="w-12 h-12 border-4 border-neutral-200 rounded-full"></div>
					<!-- Spinning ring -->
					<div class="absolute inset-0 w-12 h-12 border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
				</div>
				{#if message}
					<p class="mt-4 text-neutral-700 font-medium">{message}</p>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Inline version -->
		<div class="flex items-center justify-center">
			<div class="relative">
				<!-- Outer ring -->
				<div class="{sizeClasses} border-2 border-neutral-200 rounded-full"></div>
				<!-- Spinning ring -->
				<div class="absolute inset-0 {sizeClasses} border-2 {colorClasses} rounded-full border-t-transparent animate-spin"></div>
			</div>
			{#if message}
				<span class="ml-2 {textSizeClasses} {colorClasses} font-medium">{message}</span>
			{/if}
		</div>
	{/if}
{/if}

<style>
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>



