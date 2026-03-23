<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		name: string;
		value: string;
		selected: boolean;
		onSelect: () => void;
		variant?: 'brand' | 'accent';
		details: Snippet;
	}

	let { name, value, selected, onSelect, variant = 'brand', details }: Props = $props();
</script>

<label class="method-card {variant} {selected ? 'selected' : ''}">
	<input
		type="radio"
		{name}
		{value}
		checked={selected}
		onchange={onSelect}
		class="sr-only"
	/>
	<div class="flex items-start p-6">
		<div class="mt-1 shrink-0">
			<div
				class="radio-dot {selected ? 'checked' : ''}"
			>
				{#if selected}
					<div class="dot"></div>
				{/if}
			</div>
		</div>
		<div class="ml-4 flex-1">
			{@render details()}
		</div>
	</div>
</label>

<style>
	.method-card {
		display: block;
		border: 2px solid var(--ft-line);
		border-radius: 1rem;
		cursor: pointer;
		transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
		background: var(--ft-surface);
	}

	.method-card.accent:hover {
		border-color: var(--ft-accent);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.method-card.accent.selected {
		border-color: var(--ft-accent);
		background: var(--ft-frost);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--ft-accent) 10%, transparent);
	}

	.method-card.brand:hover {
		border-color: var(--ft-cta);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.method-card.brand.selected {
		border-color: var(--ft-cta);
		background: var(--ft-cta-light);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--ft-cta) 10%, transparent);
	}

	.radio-dot {
		position: relative;
		height: 1rem;
		width: 1rem;
		border-radius: 9999px;
		border: 2px solid var(--ft-line);
	}

	.method-card.accent .radio-dot.checked {
		border-color: var(--ft-accent);
	}

	.method-card.brand .radio-dot.checked {
		border-color: var(--ft-cta);
	}

	.dot {
		position: absolute;
		top: 2px;
		left: 2px;
		height: 0.5rem;
		width: 0.5rem;
		border-radius: 9999px;
	}

	.method-card.accent .dot {
		background-color: var(--ft-accent);
	}

	.method-card.brand .dot {
		background-color: var(--ft-cta);
	}
</style>
