<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		iconBgClass?: string;
		iconColorClass?: string;
		icon: Snippet;
	}

	let { title, iconBgClass = 'bg-[--ft-frost]', iconColorClass = 'text-[--ft-text-muted]', icon }: Props =
		$props();
</script>

<div class="mb-6 flex items-center">
	<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg {iconBgClass}">
		<span class="{iconColorClass} h-4 w-4">
			{@render icon()}
		</span>
	</div>
	<h2 class="text-2xl font-bold text-[--ft-text]">{title}</h2>
</div>
