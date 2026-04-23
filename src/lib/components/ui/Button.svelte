<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface CommonProps {
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
		loading?: boolean;
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
		gap: 8px;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 400;
		padding: 12px 24px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
		text-decoration: none;
		border: 1px solid transparent;
		min-height: 44px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn--sm {
		padding: 10px 16px;
		font-size: 0.875rem;
		min-height: 40px;
	}

	.btn--md {
		padding: 12px 24px;
		min-height: 44px;
	}

	.btn--lg {
		padding: 14px 32px;
		font-size: 1rem;
		min-height: 48px;
	}

	.btn--full {
		width: 100%;
	}

	.btn--primary {
		background: var(--ft-dark);
		color: var(--ft-bg);
		border-color: var(--ft-dark);
	}

	.btn--primary:hover:not(:disabled) {
		background: var(--ft-accent);
		border-color: var(--ft-accent);
		color: var(--ft-cta-text);
	}

	.btn--secondary {
		background: transparent;
		color: var(--ft-text);
		border-color: var(--ft-line);
	}

	.btn--secondary:hover:not(:disabled) {
		border-color: var(--ft-dark);
		color: var(--ft-text);
	}

	.btn--outline {
		background: transparent;
		color: var(--ft-accent-text);
		border-color: var(--ft-accent-text);
	}

	.btn--outline:hover:not(:disabled) {
		background: var(--ft-accent-text);
		border-color: var(--ft-accent-text);
		color: var(--ft-surface);
	}

	.btn--ghost {
		background: transparent;
		color: var(--ft-text-muted);
		border-color: transparent;
	}

	.btn--ghost:hover:not(:disabled) {
		color: var(--ft-text);
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
