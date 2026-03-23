<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		hover?: boolean;
		glass?: boolean;
		gradient?: boolean;
		bordered?: boolean;
		elevated?: boolean;
	}

	let {
		padding = 'md',
		shadow = 'none',
		hover = false,
		glass = false,
		gradient = false,
		bordered = false,
		elevated = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
		xl: 'p-12'
	};
</script>

<div
	class="ft-card {paddingClasses[padding]} {hover ? 'ft-card--hover' : ''} {className}"
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.ft-card {
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md, 10px);
		transition: border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.ft-card--hover {
		cursor: pointer;
	}

	.ft-card--hover:hover {
		border-color: var(--ft-cta);
		box-shadow: 0 4px 16px color-mix(in srgb, var(--ft-cta) 10%, transparent);
	}
</style>
