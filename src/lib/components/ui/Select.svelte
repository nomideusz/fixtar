<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		value?: string;
		options: Option[];
		id?: string;
		name?: string;
		disabled?: boolean;
		hasError?: boolean;
		onChange?: (value: string) => void;
		placeholder?: string;
	}

	let {
		value = $bindable(''),
		options,
		id,
		name,
		disabled = false,
		hasError = false,
		onChange,
		placeholder
	}: Props = $props();
</script>

<select
	class="select"
	class:is-error={hasError}
	bind:value
	{id}
	{name}
	{disabled}
	onchange={() => onChange?.(value)}
>
	{#if placeholder}
		<option value="" disabled selected>{placeholder}</option>
	{/if}
	{#each options as opt (opt.value)}
		<option value={opt.value}>{opt.label}</option>
	{/each}
</select>

<style>
	.select {
		appearance: none;
		-webkit-appearance: none;
		background: #fff
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7682' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
			no-repeat right 14px center;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		height: 44px;
		padding: 0 38px 0 14px;
		font-family: var(--font-sans);
		font-size: 15px;
		color: var(--ft-ink-900);
		width: 100%;
		cursor: pointer;
		outline: 0;
		transition:
			border-color var(--dur-fast) ease,
			box-shadow var(--dur-fast) ease;
	}

	.select:focus {
		border-color: var(--ft-cyan);
		box-shadow: 0 0 0 3px var(--ft-cyan-050);
	}

	.select.is-error {
		border-color: var(--ft-danger);
	}

	.select.is-error:focus {
		box-shadow: 0 0 0 3px rgba(214, 51, 51, 0.12);
	}

	.select:disabled {
		background-color: var(--ft-frost);
		color: var(--ft-ink-400);
		cursor: not-allowed;
	}
</style>
