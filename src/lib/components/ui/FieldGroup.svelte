<script lang="ts">
	import { WarningCircleIcon } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		required?: boolean;
		helper?: string;
		error?: string;
		htmlFor?: string;
		children?: Snippet;
	}

	let { label, required = false, helper, error, htmlFor, children }: Props = $props();
</script>

<div class="field-group">
	{#if label}
		<label class="field-label" for={htmlFor}>
			{label}
			{#if required}<span class="req" aria-hidden="true">*</span>{/if}
		</label>
	{/if}
	{#if children}{@render children()}{/if}
	{#if error}
		<div class="field-error" role="alert">
			<WarningCircleIcon size={12} weight="regular" aria-hidden="true" />
			<span>{error}</span>
		</div>
	{:else if helper}
		<div class="field-helper">{helper}</div>
	{/if}
</div>

<style>
	.field-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ft-ink-700);
	}

	.req {
		color: var(--ft-orange);
		margin-left: 2px;
	}

	.field-helper {
		font-size: 12px;
		color: var(--ft-ink-500);
		line-height: 1.4;
	}

	.field-error {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--ft-danger);
		line-height: 1.4;
	}
</style>
