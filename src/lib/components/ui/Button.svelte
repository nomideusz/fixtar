<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Button variants — aligned with Fixtar v1.2 design system.
	 *
	 * - `cta`        — orange conversion button (Add to cart, Buy now, Subscribe). Use sparingly.
	 * - `teal`       — cyan brand button (View products, Catalog, content navigation).
	 * - `dark`       — solid ink-900 button (View all, neutral primary action).
	 * - `primary`    — alias for `dark` (legacy back-compat — prefer `dark` or a more specific variant).
	 * - `outline`    — white background + ink-300 border on light surfaces.
	 * - `secondary`  — alias for `outline` (legacy back-compat).
	 * - `ghost`      — text-only, no background or border. Quiet inline action.
	 * - `ghost-dark` — transparent + white border, for use on dark surfaces.
	 */
	type Variant = 'cta' | 'teal' | 'dark' | 'primary' | 'outline' | 'secondary' | 'ghost' | 'ghost-dark';

	interface CommonProps {
		variant?: Variant;
		size?: 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
		loading?: boolean;
		children?: Snippet;
	}

	type ButtonProps = CommonProps & HTMLButtonAttributes & { href?: never };
	type AnchorProps = CommonProps & HTMLAnchorAttributes & { href: string };
	type Props = ButtonProps | AnchorProps;

	let {
		variant = 'dark',
		size = 'md',
		fullWidth = false,
		loading = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const isAnchor = $derived('href' in restProps);
</script>

{#if isAnchor}
	<a
		class="btn btn--{variant} btn--{size} {fullWidth ? 'btn--full' : ''} {className}"
		{...restProps as HTMLAnchorAttributes}
	>
		{#if loading}<span class="spinner"></span>{/if}
		{@render children?.()}
	</a>
{:else}
	<button
		class="btn btn--{variant} btn--{size} {fullWidth ? 'btn--full' : ''} {className}"
		disabled={loading}
		{...restProps as HTMLButtonAttributes}
	>
		{#if loading}<span class="spinner"></span>{/if}
		{@render children?.()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		line-height: 1;
		white-space: nowrap;
		padding: 12px 20px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
		border: 1px solid transparent;
		min-height: 44px;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn--sm {
		padding: 8px 14px;
		font-size: 11px;
		min-height: 36px;
	}

	.btn--md {
		padding: 12px 20px;
		min-height: 44px;
	}

	.btn--lg {
		padding: 16px 24px;
		font-size: 14px;
		min-height: 52px;
	}

	.btn--full {
		width: 100%;
	}

	/* CTA — orange (conversion only) */
	.btn--cta {
		background: var(--ft-cta);
		color: #fff;
		border-color: var(--ft-cta);
	}
	.btn--cta:hover:not(:disabled) {
		background: var(--ft-cta-hover);
		border-color: var(--ft-cta-hover);
	}

	/* Teal — cyan brand button */
	.btn--teal {
		background: var(--ft-cyan);
		color: #fff;
		border-color: var(--ft-cyan);
	}
	.btn--teal:hover:not(:disabled) {
		background: var(--ft-cyan-600);
		border-color: var(--ft-cyan-600);
	}

	/* Dark / Primary (alias) — ink-900 */
	.btn--dark,
	.btn--primary {
		background: var(--ft-ink-900);
		color: #fff;
		border-color: var(--ft-ink-900);
	}
	.btn--dark:hover:not(:disabled),
	.btn--primary:hover:not(:disabled) {
		background: var(--ft-ink-800);
		border-color: var(--ft-ink-800);
	}

	/* Outline / Secondary (alias) — white + ink-300 border */
	.btn--outline,
	.btn--secondary {
		background: #fff;
		color: var(--ft-ink-900);
		border-color: var(--ft-ink-300);
	}
	.btn--outline:hover:not(:disabled),
	.btn--secondary:hover:not(:disabled) {
		border-color: var(--ft-ink-900);
	}

	/* Ghost — text only */
	.btn--ghost {
		background: transparent;
		color: var(--ft-ink-700);
		border-color: transparent;
	}
	.btn--ghost:hover:not(:disabled) {
		color: var(--ft-ink-900);
		background: var(--ft-frost);
	}

	/* Ghost on dark surfaces */
	.btn--ghost-dark {
		background: transparent;
		color: #fff;
		border-color: rgba(255, 255, 255, 0.4);
	}
	.btn--ghost-dark:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.08);
		border-color: #fff;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
			border-top-color: currentColor;
			opacity: 0.6;
		}
	}
</style>
