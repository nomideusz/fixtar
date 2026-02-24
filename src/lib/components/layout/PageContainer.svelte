<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		fullWidth = false,
		paddingX = 'px-2 xs:px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10',
		paddingY = 'py-4 sm:py-5 md:py-6',
		maxWidth = 'max-w-7xl xl:max-w-screen-xl 2xl:max-w-screen-2xl',
		bgColor = '',
		className = '',
		id,
		role,
		ariaLabel,
		dataTestid
	}: {
		children?: Snippet;
		fullWidth?: boolean;
		paddingX?: string;
		paddingY?: string;
		maxWidth?: string;
		bgColor?: string;
		className?: string;
		id?: string;
		role?: string;
		ariaLabel?: string;
		dataTestid?: string;
	} = $props();

	const containerWidthClass = $derived(fullWidth ? 'w-full' : `${maxWidth} mx-auto`);
</script>

<div
	class="{bgColor} {paddingY} {className} theme-transition"
	{id}
	{role}
	aria-label={ariaLabel}
	data-testid={dataTestid}
>
	<div class="{containerWidthClass} {paddingX}">
		{#if children}{@render children()}{/if}
	</div>
</div>

