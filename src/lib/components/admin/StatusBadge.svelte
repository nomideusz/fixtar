<script lang="ts">
	import { CheckCircleIcon, WarningCircleIcon, XCircleIcon } from 'phosphor-svelte';

	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	const config: Record<string, { label: string; style: string }> = {
		active: {
			label: 'Active',
			style:
				'border-color: color-mix(in srgb, var(--color-success) 30%, transparent); background: color-mix(in srgb, var(--color-success) 10%, white); color: var(--color-success);'
		},
		draft: {
			label: 'Draft',
			style:
				'border-color: color-mix(in srgb, var(--color-warning) 32%, transparent); background: color-mix(in srgb, var(--color-warning) 10%, white); color: var(--color-warning);'
		},
		inactive: {
			label: 'Inactive',
			style: 'border-color: var(--ft-line); background: var(--ft-surface); color: var(--ft-text-muted);'
		}
	};

	const badge = $derived(config[status] || config.inactive);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal"
	style={badge.style}
>
	{#if status === 'active'}
		<CheckCircleIcon class="mr-1 h-3 w-3" weight="fill" aria-hidden="true" />
	{:else if status === 'draft'}
		<WarningCircleIcon class="mr-1 h-3 w-3" aria-hidden="true" />
	{:else}
		<XCircleIcon class="mr-1 h-3 w-3" aria-hidden="true" />
	{/if}
	{badge.label}
</span>
