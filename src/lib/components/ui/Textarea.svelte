<script lang="ts">
	interface Props {
		value?: string;
		id?: string;
		name?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		hasError?: boolean;
		minHeight?: string;
		rows?: number;
	}

	let {
		value = $bindable(''),
		id,
		name,
		placeholder,
		disabled = false,
		required = false,
		hasError = false,
		minHeight = '110px',
		rows = 4
	}: Props = $props();
</script>

<textarea
	class="textarea"
	class:is-error={hasError}
	bind:value
	{id}
	{name}
	{placeholder}
	{disabled}
	{required}
	{rows}
	style="min-height: {minHeight};"
></textarea>

<style>
	.textarea {
		width: 100%;
		resize: vertical;
		background: #fff;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		padding: 12px 14px;
		font-family: var(--font-sans);
		font-size: 15px;
		color: var(--ft-ink-900);
		outline: 0;
		line-height: 1.5;
		transition:
			border-color var(--dur-fast) ease,
			box-shadow var(--dur-fast) ease;
	}

	.textarea::placeholder {
		color: var(--ft-ink-400);
	}

	.textarea:focus {
		border-color: var(--ft-cyan);
		box-shadow: 0 0 0 3px var(--ft-cyan-050);
	}

	.textarea.is-error {
		border-color: var(--ft-danger);
	}

	.textarea.is-error:focus {
		box-shadow: 0 0 0 3px rgba(214, 51, 51, 0.12);
	}

	.textarea:disabled {
		background: var(--ft-frost);
		color: var(--ft-ink-400);
		cursor: not-allowed;
	}
</style>
