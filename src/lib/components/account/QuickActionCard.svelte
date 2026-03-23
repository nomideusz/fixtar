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
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[--ft-accent]/20"
			>
				{@render icon()}
			</div>
			<h3
				class="group-hover:text-[--ft-accent] mb-2 text-lg font-bold text-[--ft-text] transition-colors duration-200"
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
				class="group-hover:border-[--ft-accent] group-hover:text-[--ft-accent] w-full transition-colors duration-200"
			>
				Przejdź
			</Button>
		</div>
	</div>
</Card>
