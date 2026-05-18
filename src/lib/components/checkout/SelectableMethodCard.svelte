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
		background: var(--ft-surface);
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			box-shadow var(--dur-fast) ease;
	}

	.method-card.accent:hover,
	.method-card.brand:hover {
		border-color: var(--ft-ink-500);
	}

	.method-card.accent.selected,
	.method-card.brand.selected {
		border-color: var(--ft-cyan);
		background: var(--ft-cyan-050);
		box-shadow: 0 0 0 3px var(--ft-cyan-050);
	}

	.radio-dot {
		position: relative;
		height: 18px;
		width: 18px;
		border-radius: 999px;
		border: 1.5px solid var(--ft-ink-300);
		background: #fff;
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.method-card.accent .radio-dot.checked,
	.method-card.brand .radio-dot.checked {
		border-color: var(--ft-cyan);
		background: var(--ft-cyan);
	}

	.dot {
		position: absolute;
		top: 4px;
		left: 4px;
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background-color: #fff;
	}
</style>
