<script lang="ts">
	import { MinusIcon, PlusIcon } from 'phosphor-svelte';

	interface Props {
		value: number;
		min?: number;
		max?: number;
		onChange?: (next: number) => void;
		label?: string;
	}

	let { value = $bindable(1), min = 1, max = 999, onChange, label = 'Ilość' }: Props = $props();

	function set(next: number) {
		const clamped = Math.max(min, Math.min(max, next));
		value = clamped;
		onChange?.(clamped);
	}

	function dec() {
		set(value - 1);
	}

	function inc() {
		set(value + 1);
	}

	function onInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const n = parseInt(target.value, 10);
		if (!isNaN(n)) set(n);
	}
</script>

<div class="stepper" role="group" aria-label={label}>
	<button type="button" class="btn" aria-label="Zmniejsz" disabled={value <= min} onclick={dec}>
		<MinusIcon size={14} weight="bold" aria-hidden="true" />
	</button>
	<input
		type="number"
		{value}
		{min}
		{max}
		oninput={onInput}
		aria-label={label}
	/>
	<button type="button" class="btn" aria-label="Zwiększ" disabled={value >= max} onclick={inc}>
		<PlusIcon size={14} weight="bold" aria-hidden="true" />
	</button>
</div>

<style>
	.stepper {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: #fff;
		height: 44px;
		overflow: hidden;
	}

	.btn {
		width: 40px;
		height: 100%;
		border: 0;
		background: #fff;
		display: grid;
		place-items: center;
		cursor: pointer;
		color: var(--ft-ink-700);
		transition:
			background var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.btn:hover:not(:disabled) {
		background: var(--ft-frost);
		color: var(--ft-ink-900);
	}

	.btn:disabled {
		color: var(--ft-ink-300);
		cursor: not-allowed;
	}

	input {
		width: 56px;
		border: 0;
		outline: 0;
		text-align: center;
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 15px;
		color: var(--ft-ink-900);
		background: transparent;
		height: 100%;
		appearance: textfield;
		-moz-appearance: textfield;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
