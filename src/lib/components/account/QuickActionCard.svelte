<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		href: string;
		icon: Snippet;
	}

	let { title, description, href, icon }: Props = $props();
</script>

<Card hover class="group">
	<div class="relative overflow-hidden">
		<div class="relative p-6">
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-[--ft-line] bg-[--ft-frost]"
			>
				{@render icon()}
			</div>
			<h3
				class="mb-2 text-lg font-normal text-[--ft-text] transition-colors duration-200 group-hover:text-[--ft-accent]"
			>
				{title}
			</h3>
			<p class="mb-4 text-sm leading-relaxed text-[--ft-text-muted]">
				{description}
			</p>
			<Button
				{href}
				variant="outline"
				size="sm"
				class="w-full transition-colors duration-200 group-hover:border-[--ft-line-strong] group-hover:text-[--ft-text]"
			>
				Przejdź
			</Button>
		</div>
	</div>
</Card>
