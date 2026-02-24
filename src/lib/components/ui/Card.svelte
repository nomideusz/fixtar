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
		shadow = 'md',
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
	
	const shadowClasses = {
		none: '',
		sm: 'shadow-sm',
		md: 'shadow-lg',
		lg: 'shadow-xl',
		xl: 'shadow-2xl'
	};
	
	const baseClasses = $derived(`
		relative overflow-hidden transition-all duration-300 rounded-3xl
		${glass ? 'bg-white/80 backdrop-blur-xl border border-white/20' : 'bg-white'}
		${gradient ? 'bg-linear-to-br from-white via-brand-50/20 to-neutral-50/20' : ''}
		${bordered ? 'border border-neutral-200' : ''}
		${elevated ? 'transform hover:-translate-y-2' : ''}
		${paddingClasses[padding]}
		${shadowClasses[shadow]}
		${hover ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer' : ''}
		${className}
	`.replace(/\s+/g, ' ').trim());
</script>

<div class={baseClasses} {...restProps}>
	<!-- Subtle accent overlay for special cards -->
	{#if gradient}
		<div class="absolute top-0 left-0 right-0 h-1 bg-brand-600"></div>
	{/if}
	
	<!-- Glassmorphism shine effect -->
	{#if glass}
		<div class="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
	{/if}
	
	<!-- Hover glow effect -->
	{#if hover}
		<div class="absolute -inset-0.5 bg-brand-600/20 rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 -z-10"></div>
	{/if}
	
	<!-- Content -->
	<div class="relative z-10">
		{@render children?.()}
	</div>
</div> 
