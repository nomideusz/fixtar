<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		position?: 'top' | 'bottom';
		children?: Snippet;
	}

	let { label, position = 'top', children }: Props = $props();
</script>

<span class="wrap">
	{#if children}{@render children()}{/if}
	<span class="bubble bubble-{position}" role="tooltip">{label}</span>
</span>

<style>
	.wrap {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.wrap:hover .bubble,
	.wrap:focus-within .bubble {
		opacity: 1;
		transform: translateY(0);
	}

	.bubble {
		position: absolute;
		left: 50%;
		display: inline-block;
		background: var(--ft-ink-900);
		color: #fff;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 6px 10px;
		border-radius: var(--radius-xs);
		box-shadow: var(--ft-shadow-card);
		opacity: 0;
		pointer-events: none;
		white-space: nowrap;
		z-index: 50;
		transition:
			opacity var(--dur-fast) ease,
			transform var(--dur-fast) ease;
	}

	.bubble-top {
		bottom: calc(100% + 8px);
		transform: translate(-50%, 4px);
	}

	.bubble-top::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: var(--ft-ink-900);
	}

	.bubble-bottom {
		top: calc(100% + 8px);
		transform: translate(-50%, -4px);
	}

	.bubble-bottom::after {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-bottom-color: var(--ft-ink-900);
	}

	.wrap:hover .bubble-top,
	.wrap:focus-within .bubble-top {
		transform: translate(-50%, 0);
	}

	.wrap:hover .bubble-bottom,
	.wrap:focus-within .bubble-bottom {
		transform: translate(-50%, 0);
	}
</style>
