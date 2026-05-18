<script lang="ts">
	import { CheckIcon } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		checked?: boolean;
		disabled?: boolean;
		name?: string;
		value?: string;
		onChange?: (checked: boolean) => void;
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		name,
		value,
		onChange,
		children
	}: Props = $props();
</script>

<label class="check" class:is-disabled={disabled}>
	<input
		type="checkbox"
		bind:checked
		{disabled}
		{name}
		{value}
		onchange={() => onChange?.(checked)}
	/>
	<span class="box" aria-hidden="true">
		<CheckIcon size={12} weight="bold" />
	</span>
	{#if children}<span class="label">{@render children()}</span>{/if}
</label>

<style>
	.check {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--ft-ink-900);
		line-height: 1.4;
	}

	.check.is-disabled {
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
		border-radius: var(--radius-xs);
		display: inline-grid;
		place-items: center;
		flex-shrink: 0;
		transition:
			background var(--dur-fast) ease,
			border-color var(--dur-fast) ease;
	}

	.box :global(svg) {
		color: #fff;
		opacity: 0;
		transition: opacity var(--dur-fast) ease;
	}

	input:checked + .box {
		background: var(--ft-cyan);
		border-color: var(--ft-cyan);
	}

	input:checked + .box :global(svg) {
		opacity: 1;
	}

	.check:hover .box {
		border-color: var(--ft-ink-500);
	}

	input:focus-visible + .box {
		outline: 2px solid var(--ft-cyan);
		outline-offset: 2px;
	}
</style>
