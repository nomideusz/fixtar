<script lang="ts">
	import type { Snippet } from 'svelte';

	type VariantType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
	type SizeType = 'xs' | 'sm' | 'md' | 'lg';
	type RoundedType = 'none' | 'sm' | 'md' | 'lg' | 'full';

	const {
		variant = 'primary' as VariantType,
		size = 'md' as SizeType,
		rounded = 'md' as RoundedType,
		gradient = true,
		glow = false,
		outline = false,
		customClass = '',
		children
	}: {
		variant?: VariantType;
		size?: SizeType;
		rounded?: RoundedType;
		gradient?: boolean;
		glow?: boolean;
		outline?: boolean;
		customClass?: string;
		children?: Snippet;
	} = $props();

	// Gradient badge variants — use design system palette tokens
	const gradientClasses: Record<VariantType, string> = {
		primary: 'bg-linear-to-r from-brand-600 to-brand-400 text-white',
		secondary: 'bg-linear-to-r from-accent-600 to-accent-400 text-white',
		success: 'bg-linear-to-r from-success to-success-light text-white',
		danger: 'bg-linear-to-r from-danger to-danger-light text-white',
		warning: 'bg-linear-to-r from-warning to-warning-light text-neutral-900',
		info: 'bg-linear-to-r from-info to-info-light text-white'
	};

	// Solid badge variants
	const solidClasses: Record<VariantType, string> = {
		primary: 'bg-brand-600 text-white',
		secondary: 'bg-accent-600 text-white',
		success: 'bg-success text-white',
		danger: 'bg-danger text-white',
		warning: 'bg-warning text-neutral-900',
		info: 'bg-info text-white'
	};

	// Outline badge variants
	const outlineClasses: Record<VariantType, string> = {
		primary: 'bg-transparent border border-brand-600 text-brand-600',
		secondary: 'bg-transparent border border-accent-600 text-accent-600',
		success: 'bg-transparent border border-success text-success',
		danger: 'bg-transparent border border-danger text-danger',
		warning: 'bg-transparent border border-warning text-warning',
		info: 'bg-transparent border border-info text-info'
	};

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

	const badgeClasses = $derived.by(() => {
		const glowClass = glow ? 'shadow-lg' : '';
		let colorClass = '';
		if (outline) {
			colorClass = outlineClasses[variant];
		} else if (gradient) {
			colorClass = gradientClasses[variant];
		} else {
			colorClass = solidClasses[variant];
		}
		return [
			'inline-flex items-center justify-center',
			'font-medium',
			colorClass,
			sizeClasses[size],
			roundedClasses[rounded],
			glowClass,
			customClass
		].filter(Boolean).join(' ');
	});
</script>

<span class={badgeClasses}>
	{#if children}{@render children()}{/if}
</span>

