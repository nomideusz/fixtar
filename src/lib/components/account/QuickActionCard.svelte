<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		href: string;
		gradientClass: string;
		icon: Snippet;
	}

	let { title, description, href, gradientClass, icon }: Props = $props();
</script>

<Card hover class="group">
	<div class="relative overflow-hidden">
		<div
			class="absolute inset-0 bg-linear-to-br {gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-10"
		></div>
		<div class="relative p-6">
			<div
				class="h-12 w-12 bg-linear-to-br {gradientClass} mb-4 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
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
