<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		checked?: boolean;
		disabled?: boolean;
		name?: string;
		onChange?: (checked: boolean) => void;
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		name,
		onChange,
		children
	}: Props = $props();
</script>

<label class="switch" class:is-disabled={disabled}>
	<input
		type="checkbox"
		bind:checked
		{disabled}
		{name}
		role="switch"
		onchange={() => onChange?.(checked)}
	/>
	<span class="track" aria-hidden="true"></span>
	{#if children}<span class="label">{@render children()}</span>{/if}
</label>

<style>
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--ft-ink-900);
		line-height: 1.4;
	}

	.switch.is-disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	input {
		display: none;
	}

	.track {
		width: 40px;
		height: 22px;
		background: var(--ft-ink-300);
		border-radius: 999px;
		position: relative;
		flex-shrink: 0;
		transition: background var(--dur-fast) ease;
	}

	.track::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		background: #fff;
		border-radius: 999px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform var(--dur-fast) ease;
	}

	input:checked + .track {
		background: var(--ft-cyan);
	}

	input:checked + .track::after {
		transform: translateX(18px);
	}

	input:focus-visible + .track {
		outline: 2px solid var(--ft-cyan);
		outline-offset: 2px;
	}
</style>
