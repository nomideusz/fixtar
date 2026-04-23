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
	<a class="btn btn--{variant} btn--{size} {fullWidth ? 'btn--full' : ''} {className}" {...restProps as HTMLAnchorAttributes}>
		{#if loading}<span class="spinner"></span>{/if}
		{@render children?.()}
	</a>
{:else}
	<button class="btn btn--{variant} btn--{size} {fullWidth ? 'btn--full' : ''} {className}" disabled={loading} {...restProps as HTMLButtonAttributes}>
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
		font-weight: 600;
		font-size: 0.95rem;
		text-transform: none;
		letter-spacing: 0;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
		text-decoration: none;
		border: 1px solid transparent;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.btn--sm { padding: 8px 16px; font-size: 0.85rem; min-height: 36px; }
	.btn--md { padding: 12px 24px; min-height: 44px; }
	.btn--lg { padding: 14px 32px; font-size: 1rem; min-height: 48px; }
	.btn--full { width: 100%; }

	/* Variants */
	.btn--primary {
		background: var(--ft-cta);
		color: var(--ft-cta-text);
		border-color: var(--ft-cta);
	}
	.btn--primary:hover:not(:disabled) {
		background: var(--ft-cta-hover);
		border-color: var(--ft-cta-hover);
	}

	.btn--secondary {
		background: transparent;
		color: var(--ft-dark);
		border-color: var(--ft-line);
	}
	.btn--secondary:hover:not(:disabled) {
		border-color: var(--ft-dark);
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.btn--outline {
		background: transparent;
		color: var(--ft-cta);
		border-color: var(--ft-cta);
	}
	.btn--outline:hover:not(:disabled) {
		background: var(--ft-cta);
		color: var(--ft-cta-text);
	}

	.btn--ghost {
		background: transparent;
		color: var(--ft-text-muted);
	}
	.btn--ghost:hover:not(:disabled) {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	/* Spinner */
	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
			border-top-color: currentColor;
			opacity: 0.6;
		}
	}
</style>
