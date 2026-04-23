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
	<div class="flex items-center justify-center gap-3">
		{#each steps as step, i (step.label)}
			{#if i > 0}
				<div class="h-px w-12 bg-[--ft-line]"></div>
			{/if}
			<div class="flex items-center">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full border text-sm {step.active
						? 'border-[--ft-accent] bg-[--ft-accent]/10 text-[--ft-text]'
						: 'border-[--ft-line] bg-[--ft-surface] text-[--ft-text-muted]'}"
				>
					{i + 1}
				</div>
				<span class="ml-3 text-sm {step.active ? 'text-[--ft-text]' : 'text-[--ft-text-muted]'}">
					{step.label}
				</span>
			</div>
		{/each}
	</div>
</div>
