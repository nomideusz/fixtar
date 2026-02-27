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
			case 'sm':
				return 'w-4 h-4';
			case 'lg':
				return 'w-8 h-8';
			default:
				return 'w-6 h-6';
		}
	});

	const textSizeClasses = $derived.by(() => {
		switch (size) {
			case 'sm':
				return 'text-xs';
			case 'lg':
				return 'text-base';
			default:
				return 'text-sm';
		}
	});

	const spinnerColorStyles = $derived.by(() => {
		switch (color) {
			case 'white':
				return '--spinner-color: var(--ft-text-inverse);';
			case 'muted':
				return '--spinner-color: var(--ft-text-muted);';
			default:
				return '--spinner-color: var(--ft-primary);';
		}
	});
</script>

{#if visible}
	{#if variant === 'overlay'}
		<!-- Full screen overlay version -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
			style="background-color: color-mix(in srgb, var(--ft-surface) 82%, transparent);"
		>
			<div class="flex flex-col items-center">
				<div class="relative">
					<!-- Outer ring -->
					<div
						class="h-12 w-12 rounded-full border-4"
						style="border-color: var(--ft-border);"
					></div>
					<!-- Spinning ring -->
					<div
						class="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
						style="{spinnerColorStyles} border-color: var(--spinner-color); border-top-color: transparent;"
					></div>
				</div>
				{#if message}
					<p class="mt-4 font-medium" style="color: var(--ft-text-secondary);">{message}</p>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Inline version -->
		<div class="flex items-center justify-center">
			<div class="relative">
				<!-- Outer ring -->
				<div
					class="{sizeClasses} rounded-full border-2"
					style="border-color: var(--ft-border);"
				></div>
				<!-- Spinning ring -->
				<div
					class="absolute inset-0 {sizeClasses} animate-spin rounded-full border-2 border-t-transparent"
					style="{spinnerColorStyles} border-color: var(--spinner-color); border-top-color: transparent;"
				></div>
			</div>
			{#if message}
				<span
					class="ml-2 {textSizeClasses} font-medium"
					style="{spinnerColorStyles} color: var(--spinner-color);">{message}</span
				>
			{/if}
		</div>
	{/if}
{/if}
