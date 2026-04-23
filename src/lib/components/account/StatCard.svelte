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
		class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md border border-[--ft-line] bg-[--ft-accent]/12 text-[--ft-accent]"
	>
		{@render icon()}
	</div>
	<div class="{valueClass} mb-2 text-3xl font-normal transition-colors duration-200">
		{value}
	</div>
	<div class="font-normal text-[--ft-text-muted]">{label}</div>
</Card>
