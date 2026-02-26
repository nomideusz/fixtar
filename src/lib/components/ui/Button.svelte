<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	
	interface CommonProps {
		variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'outline' | 'glass';
		size?: 'sm' | 'md' | 'lg' | 'xl';
		fullWidth?: boolean;
		loading?: boolean;
		icon?: boolean;
		children?: Snippet;
	}
	
	type ButtonProps = CommonProps & HTMLButtonAttributes & { href?: never };
	type AnchorProps = CommonProps & HTMLAnchorAttributes & { href: string };
	
	type Props = ButtonProps | AnchorProps;
	
	let {
		variant = 'primary',
		size = 'md',
		fullWidth = false,
		loading = false,
		icon = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
	
	const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
	
	const variantClasses = {
		primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-lg hover:shadow-xl',
		secondary: 'bg-white text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-500 shadow-md hover:shadow-lg border border-neutral-200 hover:border-neutral-300',
		ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 hover:text-neutral-900',
		gradient: 'bg-linear-to-r from-brand-600 to-accent-600 text-white hover:from-brand-700 hover:to-accent-700 focus:ring-brand-500 shadow-lg hover:shadow-xl',
		outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white focus:ring-brand-500 bg-transparent',
		glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus:ring-white/50 shadow-lg'
	};
	
	const sizeClasses = $derived({
		sm: icon ? 'p-2' : 'px-4 py-2 text-sm',
		md: icon ? 'p-3' : 'px-6 py-3 text-base',
		lg: icon ? 'p-4' : 'px-8 py-4 text-lg',
		xl: icon ? 'p-5' : 'px-10 py-5 text-xl'
	});
	
	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`);
	
	const isAnchor = $derived('href' in restProps);
</script>

{#if isAnchor}
	<a class={classes} {...restProps as HTMLAnchorAttributes}>
		<span class="flex items-center gap-2">
			{#if loading}
				<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{/if}
			{@render children?.()}
		</span>
	</a>
{:else}
	<button class={classes} disabled={loading} {...restProps as HTMLButtonAttributes}>
		<span class="flex items-center gap-2">
			{#if loading}
				<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{/if}
			{@render children?.()}
		</span>
	</button>
{/if} 
