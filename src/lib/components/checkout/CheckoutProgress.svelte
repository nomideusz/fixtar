<script lang="ts">
	interface Step {
		label: string;
		active: boolean;
	}

	interface Props {
		steps: Step[];
	}

	let { steps }: Props = $props();
</script>

<div class="mb-12">
	<div class="flex items-center justify-center space-x-4">
		{#each steps as step, i (step.label)}
			{#if i > 0}
				<div class="h-1 w-16 rounded {step.active ? 'bg-[--ft-accent]' : 'bg-[--ft-line]'}"></div>
			{/if}
			<div class="flex items-center">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold {step.active
						? 'bg-[--ft-accent] !text-white'
						: 'bg-[--ft-line] text-[--ft-text-muted]'}"
				>
					{i + 1}
				</div>
				<span
					class="ml-3 text-sm font-medium {step.active ? 'text-[--ft-accent]' : 'text-[--ft-text-muted]'}"
				>
					{step.label}
				</span>
			</div>
		{/each}
	</div>
</div>
