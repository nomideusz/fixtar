<script lang="ts">
	import type { Snippet } from 'svelte';

	type SizeType = 'xs' | 'sm' | 'md' | 'lg';
	type RoundedType = 'none' | 'sm' | 'md' | 'lg' | 'full';

	const {
		size = 'md' as SizeType,
		rounded = 'md' as RoundedType,
		customClass = '',
		children
	}: {
		size?: SizeType;
		rounded?: RoundedType;
		customClass?: string;
		children?: Snippet;
	} = $props();

	const sizeClasses: Record<SizeType, string> = {
		xs: 'text-xs py-0.5 px-2',
		sm: 'text-sm py-0.5 px-2.5',
		md: 'text-base py-1 px-3',
		lg: 'text-lg py-1.5 px-4'
	};

	const roundedClasses: Record<RoundedType, string> = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-full'
	};

	const badgeClasses = $derived(
		[
			'inline-flex items-center justify-center font-medium',
			sizeClasses[size],
			roundedClasses[rounded],
			customClass
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<span class={badgeClasses}>
	{#if children}{@render children()}{/if}
</span>
