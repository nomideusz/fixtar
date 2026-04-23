<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { CheckCircleIcon, WarningCircleIcon, XCircleIcon } from 'phosphor-svelte';

	interface StatusCard {
		label: string;
		subtitle: string;
		count: number;
		colorClass: string;
		hoverClass: string;
		filterValue: string;
	}

	interface Props {
		statusCounts: { active: number; draft: number; inactive: number };
		onFilterByStatus: (status: string) => void;
	}

	let { statusCounts, onFilterByStatus }: Props = $props();

	const cards: StatusCard[] = $derived([
		{
			label: 'Active Products',
			subtitle: 'Visible to customers',
			count: statusCounts.active,
			colorClass: 'text-success',
			hoverClass: 'hover:text-success',
			filterValue: 'active'
		},
		{
			label: 'Draft Products',
			subtitle: 'Awaiting review',
			count: statusCounts.draft,
			colorClass: 'text-[--color-warning]',
			hoverClass: 'hover:text-[--color-warning]',
			filterValue: 'draft'
		},
		{
			label: 'Inactive Products',
			subtitle: 'Hidden from store',
			count: statusCounts.inactive,
			colorClass: 'text-[--ft-text-muted]',
			hoverClass: 'hover:text-[--ft-text]',
			filterValue: 'inactive'
		}
	]);
</script>

<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
	{#each cards as card (card.filterValue)}
		<Card class="p-4">
			<div class="flex items-center justify-between gap-4">
				<div class="min-w-0">
					<p class="text-sm text-[--ft-text-muted]">{card.label}</p>
					<p class="text-2xl font-normal {card.colorClass}">{card.count}</p>
					<p class="mt-1 text-xs text-[--ft-text-muted]">{card.subtitle}</p>
				</div>
				<button
					onclick={() => onFilterByStatus(card.filterValue)}
					class="flex h-10 w-10 items-center justify-center rounded-md border border-[--ft-line] bg-[--ft-surface] {card.colorClass} {card.hoverClass} transition-colors"
					title="View {card.label.toLowerCase()}"
				>
					{#if card.filterValue === 'active'}
						<CheckCircleIcon class="h-6 w-6" aria-hidden="true" />
					{:else if card.filterValue === 'draft'}
						<WarningCircleIcon class="h-6 w-6" aria-hidden="true" />
					{:else}
						<XCircleIcon class="h-6 w-6" aria-hidden="true" />
					{/if}
				</button>
			</div>
		</Card>
	{/each}
</div>
