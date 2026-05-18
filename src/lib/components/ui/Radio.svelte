<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		group: string | undefined;
		value: string;
		name: string;
		disabled?: boolean;
		onChange?: (value: string) => void;
		children?: Snippet;
	}

	let { group = $bindable(), value, name, disabled = false, onChange, children }: Props = $props();
</script>

<label class="radio" class:is-disabled={disabled}>
	<input
		type="radio"
		bind:group
		{value}
		{name}
		{disabled}
		onchange={() => onChange?.(value)}
	/>
	<span class="box" aria-hidden="true"></span>
	{#if children}<span class="label">{@render children()}</span>{/if}
</label>

<style>
	.radio {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--ft-ink-900);
		line-height: 1.4;
	}

	.radio.is-disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	input {
		display: none;
	}

	.box {
		width: 18px;
		height: 18px;
		border: 1.5px solid var(--ft-ink-300);
		background: #fff;
		border-radius: 999px;
		display: inline-grid;
		place-items: center;
		flex-shrink: 0;
		position: relative;
		transition:
			background var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.box::after {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: #fff;
		transform: scale(0);
		transition: transform var(--dur-fast) ease;
	}

	input:checked + .box {
		background: var(--ft-cyan);
		border-color: var(--ft-cyan);
	}

	input:checked + .box::after {
		transform: scale(1);
	}

	.radio:hover .box {
		border-color: var(--ft-ink-500);
	}

	input:focus-visible + .box {
		outline: 2px solid var(--ft-cyan);
		outline-offset: 2px;
	}
</style>
