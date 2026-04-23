<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		label?: string;
		error?: string;
		helperText?: string;
		value?: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let {
		label,
		error,
		helperText,
		size = 'md',
		class: className = '',
		id,
		value = $bindable(''),
		...restProps
	}: Props = $props();

	const inputId = $derived(id || `input-${Math.random().toString(36).substr(2, 9)}`);
</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="input-label">
			{label}
			{#if restProps.required}
				<span class="text-[var(--color-danger)]">*</span>
			{/if}
		</label>
	{/if}

	<input
		id={inputId}
		bind:value
		class="input-field input--{size} {error ? 'input--error' : ''} {className}"
		aria-invalid={!!error}
		{...restProps}
	/>

	{#if error}
		<p class="input-error">{error}</p>
	{:else if helperText}
		<p class="input-helper">{helperText}</p>
	{/if}
</div>

<style>
	.input-label {
		display: block;
		margin-bottom: 6px;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--ft-text);
	}

	.input-field {
		width: 100%;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text);
		font-family: var(--font-sans);
		transition: border-color var(--dur-fast) ease;
	}

	.input-field::placeholder {
		color: var(--ft-text-faint);
	}

	.input-field:focus {
		outline: none;
		border-color: var(--ft-dark);
		box-shadow: none;
	}

	.input-field:hover {
		border-color: var(--ft-line-strong, var(--ft-dark));
	}

	.input--sm {
		padding: 8px 12px;
		font-size: 0.85rem;
	}
	.input--md {
		padding: 10px 14px;
		font-size: 0.9375rem;
	}
	.input--lg {
		padding: 14px 18px;
		font-size: 1rem;
	}

	.input--error {
		border-color: var(--color-danger);
	}

	.input--error:focus {
		border-color: var(--color-danger);
	}

	.input-error {
		margin-top: 4px;
		font-size: 0.78rem;
		color: var(--color-danger);
	}

	.input-helper {
		margin-top: 4px;
		font-size: 0.78rem;
		color: var(--ft-text-muted);
	}
</style>
