<script lang="ts">
	import {
		CheckCircleIcon,
		InfoIcon,
		WarningIcon,
		XCircleIcon,
		XIcon
	} from 'phosphor-svelte';
	import type { Snippet } from 'svelte';

	type Variant = 'success' | 'info' | 'warning' | 'danger';

	interface Props {
		variant?: Variant;
		title?: string;
		closable?: boolean;
		onClose?: () => void;
		children?: Snippet;
	}

	let {
		variant = 'info',
		title,
		closable = false,
		onClose,
		children
	}: Props = $props();

	const ICONS = {
		success: CheckCircleIcon,
		info: InfoIcon,
		warning: WarningIcon,
		danger: XCircleIcon
	};

	const Icon = $derived(ICONS[variant]);
</script>

<div class="alert alert-{variant}" role={variant === 'danger' ? 'alert' : 'status'}>
	<span class="ico" aria-hidden="true">
		<Icon size={18} weight="regular" />
	</span>
	<div class="body">
		{#if title}<b>{title}</b>{/if}
		{#if children}<p>{@render children()}</p>{/if}
	</div>
	{#if closable}
		<button class="close" aria-label="Zamknij" onclick={() => onClose?.()}>
			<XIcon size={16} weight="bold" aria-hidden="true" />
		</button>
	{/if}
</div>

<style>
	.alert {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 14px 16px;
		border-radius: var(--radius-sm);
		border: 1px solid;
		background: #fff;
		font-size: 14px;
		line-height: 1.45;
	}

	.ico {
		flex-shrink: 0;
		margin-top: 1px;
		display: inline-flex;
	}

	.body {
		flex: 1;
		min-width: 0;
	}

	.body b {
		font-weight: 600;
	}

	.body p {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--ft-ink-600);
	}

	.close {
		margin-left: auto;
		background: none;
		border: 0;
		padding: 2px;
		cursor: pointer;
		color: currentColor;
		opacity: 0.6;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: opacity var(--dur-fast) ease;
	}

	.close:hover {
		opacity: 1;
	}

	.alert-success {
		background: #ecfaf1;
		border-color: #c5ead2;
		color: #1e6a42;
	}
	.alert-success .ico {
		color: var(--ft-success);
	}

	.alert-info {
		background: var(--ft-cyan-050);
		border-color: var(--ft-cyan-200);
		color: var(--ft-cyan-700);
	}
	.alert-info .ico {
		color: var(--ft-cyan);
	}

	.alert-warning {
		background: #fff5e5;
		border-color: #ffdfa8;
		color: #8a5a0e;
	}
	.alert-warning .ico {
		color: var(--ft-warning);
	}

	.alert-danger {
		background: #fcebeb;
		border-color: #f4c6c6;
		color: #952424;
	}
	.alert-danger .ico {
		color: var(--ft-danger);
	}
</style>
