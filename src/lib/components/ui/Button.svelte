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
		font-weight: 600;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		border-radius: var(--radius-sm, 6px);
		cursor: pointer;
		transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
		text-decoration: none;
		border: 1px solid transparent;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.btn--sm { padding: 8px 16px; font-size: 0.68rem; min-height: 36px; }
	.btn--md { padding: 12px 24px; min-height: 44px; }
	.btn--lg { padding: 14px 28px; font-size: 0.75rem; min-height: 48px; }
	.btn--full { width: 100%; }

	/* Variants */
	.btn--primary {
		background: var(--ft-accent);
		color: white;
		border-color: var(--ft-accent);
	}
	.btn--primary:hover {
		background: var(--ft-accent-hover);
		border-color: var(--ft-accent-hover);
		box-shadow: var(--ft-shadow-md);
	}

	.btn--secondary {
		background: transparent;
		color: var(--ft-accent);
		border-color: var(--ft-line);
	}
	.btn--secondary:hover {
		border-color: var(--ft-accent);
	}

	.btn--outline {
		background: transparent;
		color: var(--ft-accent);
		border-color: var(--ft-accent);
	}
	.btn--outline:hover {
		background: var(--ft-accent);
		color: white;
	}

	.btn--ghost {
		background: transparent;
		color: var(--ft-text-muted);
	}
	.btn--ghost:hover {
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
</style>
