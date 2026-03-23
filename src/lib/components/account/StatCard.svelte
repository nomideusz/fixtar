<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		value: string | number;
		label: string;
		valueClass?: string;
		icon: Snippet;
	}

	let {
		value,
		label,
		valueClass = 'text-[--ft-accent]',
		icon
	}: Props = $props();
</script>

<Card hover class="group p-6 text-center">
	<div
		class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--ft-accent]/20"
	>
		{@render icon()}
	</div>
	<div
		class="{valueClass} mb-2 text-3xl font-bold transition-transform duration-200 group-hover:scale-105"
	>
		{value}
	</div>
	<div class="font-medium text-[--ft-text-muted]">{label}</div>
</Card>
