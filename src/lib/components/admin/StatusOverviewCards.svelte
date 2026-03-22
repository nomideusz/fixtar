<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';

	interface StatusCard {
		label: string;
		subtitle: string;
		count: number;
		colorClass: string;
		hoverClass: string;
		iconPath: string;
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
			hoverClass: 'hover:text-success-dark',
			iconPath:
				'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
			filterValue: 'active'
		},
		{
			label: 'Draft Products',
			subtitle: 'Awaiting review',
			count: statusCounts.draft,
			colorClass: 'text-brand-600',
			hoverClass: 'hover:text-brand-800',
			iconPath:
				'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
			filterValue: 'draft'
		},
		{
			label: 'Inactive Products',
			subtitle: 'Hidden from store',
			count: statusCounts.inactive,
			colorClass: 'text-neutral-600',
			hoverClass: 'hover:text-neutral-800',
			iconPath:
				'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728',
			filterValue: 'inactive'
		}
	]);
</script>

<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
	{#each cards as card (card.filterValue)}
		<Card class="p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">{card.label}</p>
					<p class="text-2xl font-bold {card.colorClass}">{card.count}</p>
					<p class="mt-1 text-xs text-[--ft-text-muted]">{card.subtitle}</p>
				</div>
				<button
					onclick={() => onFilterByStatus(card.filterValue)}
					class="{card.colorClass} {card.hoverClass} transition-colors"
					title="View {card.label.toLowerCase()}"
				>
					<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d={card.iconPath}
						/>
					</svg>
				</button>
			</div>
		</Card>
	{/each}
</div>
