<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		value: string | number;
		label: string;
		valueClass?: string;
		icon: Snippet;
	}

	let { value, label, valueClass = 'text-[--ft-accent]', icon }: Props = $props();
</script>

<Card hover class="group p-6 text-center">
	<div
		class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[--ft-cyan-050] text-[--ft-cyan-600]"
	>
		{@render icon()}
	</div>
	<div class="stat-value {valueClass}">
		{value}
	</div>
	<div class="stat-label">{label}</div>
</Card>

<style>
	.stat-value {
		font-family: var(--font-display);
		font-size: clamp(28px, 3vw, 36px);
		font-weight: 500;
		line-height: 1;
		text-transform: uppercase;
		letter-spacing: -0.005em;
		margin-bottom: 8px;
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ft-ink-500);
		font-weight: 500;
	}
</style>
