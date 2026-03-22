<script lang="ts">
	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	const config: Record<string, { label: string; bgClass: string; textClass: string; icon: string }> =
		{
			active: {
				label: 'Active',
				bgClass: 'bg-success/10',
				textClass: 'text-success-dark',
				icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
			},
			draft: {
				label: 'Draft',
				bgClass: 'bg-brand-100',
				textClass: 'text-brand-800',
				icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
			},
			inactive: {
				label: 'Inactive',
				bgClass: 'bg-[--ft-frost]',
				textClass: 'text-neutral-800',
				icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728'
			}
		};

	const badge = $derived(config[status] || config.inactive);
	const isStroke = $derived(status !== 'active');
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {badge.bgClass} {badge.textClass}"
>
	<svg class="mr-1 h-3 w-3" fill={isStroke ? 'none' : 'currentColor'} stroke={isStroke ? 'currentColor' : 'none'} viewBox={isStroke ? '0 0 24 24' : '0 0 20 20'}>
		{#if isStroke}
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={badge.icon} />
		{:else}
			<path fill-rule="evenodd" d={badge.icon} clip-rule="evenodd" />
		{/if}
	</svg>
	{badge.label}
</span>
