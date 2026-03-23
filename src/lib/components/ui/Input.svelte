<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		label?: string;
		error?: string;
		helperText?: string;
		value?: string;
		variant?: 'default' | 'glass' | 'outline' | 'filled';
		size?: 'sm' | 'md' | 'lg';
	}

	let {
		label,
		error,
		helperText,
		variant = 'default',
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
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ft-dark);
	}

	.input-field {
		width: 100%;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm, 6px);
		background: var(--ft-surface);
		color: var(--ft-dark);
		font-family: var(--font-sans);
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}

	.input-field::placeholder {
		color: var(--ft-text-faint);
	}

	.input-field:focus {
		outline: none;
		border-color: var(--ft-cta);
		box-shadow: 0 0 0 3px var(--ft-cta-light);
	}

	.input-field:hover {
		border-color: var(--ft-text-faint);
	}

	.input--sm { padding: 8px 12px; font-size: 0.85rem; }
	.input--md { padding: 10px 14px; font-size: 0.95rem; }
	.input--lg { padding: 14px 18px; font-size: 1rem; }

	.input--error {
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
