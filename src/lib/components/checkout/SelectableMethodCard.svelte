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
	<input type="radio" {name} {value} checked={selected} onchange={onSelect} class="sr-only" />
	<div class="flex items-start p-6">
		<div class="mt-1 shrink-0">
			<div class="radio-dot {selected ? 'checked' : ''}">
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
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
		background: var(--ft-surface);
	}

	.method-card.accent:hover,
	.method-card.brand:hover {
		border-color: var(--ft-line-strong);
		background: var(--ft-frost);
	}

	.method-card.accent.selected,
	.method-card.brand.selected {
		border-color: var(--ft-accent);
		background: color-mix(in srgb, var(--ft-accent) 8%, white);
	}

	.radio-dot {
		position: relative;
		height: 1rem;
		width: 1rem;
		border-radius: 9999px;
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.method-card.accent .radio-dot.checked,
	.method-card.brand .radio-dot.checked {
		border-color: var(--ft-accent);
		background: color-mix(in srgb, var(--ft-accent) 10%, white);
	}

	.dot {
		position: absolute;
		top: 3px;
		left: 3px;
		height: 0.375rem;
		width: 0.375rem;
		border-radius: 9999px;
		background-color: var(--ft-accent);
	}
</style>
