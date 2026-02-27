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
	class="ft-card {paddingClasses[padding]} {hover ? 'ft-card--hover' : ''} {glass ? 'ft-card--glass' : ''} {gradient ? 'ft-card--gradient' : ''} {bordered ? 'ft-card--bordered' : ''} {elevated ? 'ft-card--elevated' : ''} {className}"
	{...restProps}
>
	<!-- Teal accent top line (visible on hover for hover cards) -->
	{#if hover}
		<div class="ft-card__accent"></div>
	{/if}

	<!-- Gradient top bar -->
	{#if gradient}
		<div class="ft-card__gradient-bar"></div>
	{/if}

	<!-- Content -->
	<div class="relative z-10">
		{@render children?.()}
	</div>
</div>

<style>
	/* ══════════════════════════════════════
	   CARD — Dark Industrial Theme
	   Uses CSS custom properties for admin override
	   ══════════════════════════════════════ */

	.ft-card {
		position: relative;
		overflow: hidden;
		background: var(--card-bg, var(--ft-dark-card, rgba(255, 255, 255, 0.03)));
		border: 1px solid var(--card-border, var(--ft-dark-border, rgba(255, 255, 255, 0.06)));
		border-radius: 0.25rem;
		color: var(--card-text, var(--ft-dark-text, #ffffff));
		transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
	}

	/* ── Hover variant ── */
	.ft-card--hover {
		cursor: pointer;
	}

	.ft-card--hover:hover {
		background: var(--card-bg-hover, var(--ft-dark-card-hover, rgba(255, 255, 255, 0.05)));
		border-color: var(--card-border-hover, var(--ft-dark-border-hover, rgba(55, 138, 146, 0.15)));
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(55, 138, 146, 0.06);
		transform: translateY(-3px);
	}

	.ft-card__accent {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--color-brand-500, #378a92), transparent);
		opacity: 0;
		transition: opacity 0.35s ease;
		z-index: 3;
	}

	.ft-card--hover:hover .ft-card__accent {
		opacity: 1;
	}

	/* ── Glass variant ── */
	.ft-card--glass {
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-color: rgba(255, 255, 255, 0.08);
	}

	/* ── Gradient variant ── */
	.ft-card--gradient {
		background: linear-gradient(135deg, rgba(55, 138, 146, 0.06) 0%, var(--ft-dark-card, rgba(255, 255, 255, 0.02)) 100%);
	}

	.ft-card__gradient-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-brand-500, #378a92);
		z-index: 3;
	}

	/* ── Bordered variant ── */
	.ft-card--bordered {
		border-color: rgba(255, 255, 255, 0.1);
	}

	/* ── Elevated variant ── */
	.ft-card--elevated:hover {
		transform: translateY(-6px);
	}
</style>
