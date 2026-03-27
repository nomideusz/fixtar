<script lang="ts">
	import { CheckCircleIcon, WarningCircleIcon, XCircleIcon } from 'phosphor-svelte';

	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	const config: Record<string, { label: string; bgClass: string; textClass: string }> = {
		active: {
			label: 'Active',
			bgClass: 'bg-success/10',
			textClass: 'text-success-dark'
		},
		draft: {
			label: 'Draft',
			bgClass: 'bg-[--ft-frost]',
			textClass: 'text-[--ft-accent-hover]'
		},
		inactive: {
			label: 'Inactive',
			bgClass: 'bg-[--ft-frost]',
			textClass: 'text-[--ft-text-strong]'
		}
	};

	const badge = $derived(config[status] || config.inactive);
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {badge.bgClass} {badge.textClass}"
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
