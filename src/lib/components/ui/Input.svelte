<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	
	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		label?: string;
		error?: string;
		helperText?: string;
		value?: string;
		variant?: 'default' | 'glass' | 'outline' | 'filled';
		size?: 'sm' | 'md' | 'lg';
		icon?: string;
		floating?: boolean;
	}
	
	let {
		label,
		error,
		helperText,
		variant = 'default',
		size = 'md',
		icon,
		floating = false,
		class: className = '',
		id,
		value = $bindable(''),
		...restProps
	}: Props = $props();
	
	// Generate a unique ID if not provided
	const inputId = $derived(id || `input-${Math.random().toString(36).substr(2, 9)}`);
	
	const hasValue = $derived(value && value.length > 0);
	const isFloating = $derived(floating && label);
	
	const sizeClasses = {
		sm: 'px-3 py-2 text-sm',
		md: 'px-4 py-3 text-base',
		lg: 'px-6 py-4 text-lg'
	};
	
	const variantClasses = {
		default: `
			bg-white border border-neutral-300 
			focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:border-neutral-400
		`,
		glass: `
			bg-white/80 backdrop-blur-md border border-white/30 
			focus:border-white/60 focus:ring-2 focus:ring-white/30
			hover:border-white/50
		`,
		outline: `
			bg-transparent border-2 border-neutral-300 
			focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:border-neutral-400
		`,
		filled: `
			bg-neutral-50 border border-transparent 
			focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:bg-neutral-100
		`
	};
	
	const inputClasses = $derived(`
		w-full rounded-2xl transition-all duration-300 focus:outline-none
		${isFloating ? 'pt-6 pb-2' : ''}
		${sizeClasses[size]}
		${variantClasses[variant]}
		${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
		${icon ? 'pl-12' : ''}
		${className}
	`.replace(/\s+/g, ' ').trim());
	
	const labelClasses = $derived(`
		absolute left-4 transition-all duration-300 cursor-text pointer-events-none
		${isFloating && (hasValue || restProps.placeholder) 
			? 'top-2 text-xs text-neutral-500 font-medium' 
			: 'top-1/2 -translate-y-1/2 text-neutral-400'
		}
		${error ? 'text-danger' : ''}
	`);
</script>

<div class="relative w-full group">
	{#if label && !isFloating}
		<label for={inputId} class="block text-sm font-medium text-neutral-700 mb-2">
			{label}
			{#if restProps.required}
			<span class="text-danger ml-1">*</span>
		{/if}
	</label>
	{/if}
	
	<div class="relative">
		<!-- Icon -->
		{#if icon}
			<div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-500 transition-colors">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icon} />
				</svg>
			</div>
		{/if}
		
		<!-- Input -->
		<input
			{id}
			bind:value
			class={inputClasses}
			aria-invalid={!!error}
			aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
			{...restProps}
		/>
		
		<!-- Floating Label -->
		{#if isFloating}
			<label for={inputId} class={labelClasses}>
				{label}
				{#if restProps.required}
				<span class="text-danger ml-1">*</span>
			{/if}
		</label>
		{/if}
		
		<!-- Focus ring effect -->
		<div class="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-brand-500/20 group-focus-within:ring-offset-1"></div>
	</div>
	
	<!-- Error or Helper Text -->
	{#if error}
		<div class="flex items-center mt-2">
			<svg class="w-4 h-4 text-danger mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<p id="{inputId}-error" class="text-sm text-danger">
				{error}
			</p>
		</div>
	{:else if helperText}
		<p id="{inputId}-helper" class="mt-2 text-sm text-neutral-500 flex items-center">
			<svg class="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{helperText}
		</p>
	{/if}
</div> 


