<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { getOrderStatus } from '$lib/utils/order-status';

	interface RecentOrder {
		id: string;
		date: string;
		total: number;
		status: string;
		items: number;
	}

	interface Props {
		orders: RecentOrder[];
	}

	let { orders }: Props = $props();
</script>

<Card class="p-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h2 class="mb-2 text-2xl font-bold text-[--ft-text]">Ostatnie zamówienia</h2>
			<p class="text-[--ft-text-muted]">Śledź status swoich zamówień</p>
		</div>
		<Button href="/account/orders" variant="outline">Zobacz wszystkie</Button>
	</div>

	{#if orders.length === 0}
		<div class="py-12 text-center">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--ft-frost]"
			>
				<svg
					class="h-8 w-8 text-[--ft-text-muted]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-semibold text-[--ft-text]">Brak zamówień</h3>
			<p class="mb-6 text-[--ft-text-muted]">Rozpocznij zakupy i zobacz swoje zamówienia tutaj</p>
			<Button href="/products">Rozpocznij zakupy</Button>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-[--ft-line]">
						<th class="px-4 py-4 text-left font-semibold text-[--ft-text]">Numer zamówienia</th>
						<th class="px-4 py-4 text-left font-semibold text-[--ft-text]">Data</th>
						<th class="px-4 py-4 text-left font-semibold text-[--ft-text]">Produkty</th>
						<th class="px-4 py-4 text-left font-semibold text-[--ft-text]">Suma</th>
						<th class="px-4 py-4 text-left font-semibold text-[--ft-text]">Status</th>
						<th class="px-4 py-4 text-right font-semibold text-[--ft-text]">Akcja</th>
					</tr>
				</thead>
				<tbody>
					{#each orders as order (order)}
						{@const status = getOrderStatus(order.status)}
						<tr
							class="border-b border-[--ft-line] transition-colors duration-150 hover:bg-[--ft-frost]"
						>
							<td class="px-4 py-4">
								<span class="text-[--ft-accent] font-medium">#{order.id}</span>
							</td>
							<td class="px-4 py-4 text-[--ft-text-muted]">{order.date}</td>
							<td class="px-4 py-4 text-[--ft-text-muted]">
								{order.items}
								{order.items === 1 ? 'produkt' : 'produkty'}
							</td>
							<td class="px-4 py-4 font-semibold text-[--ft-text]">
								{order.total.toFixed(2)} zł
							</td>
							<td class="px-4 py-4">
								<span
									class="inline-flex rounded-full px-3 py-1 text-xs font-semibold {status.colorClass}"
								>
									{status.label}
								</span>
							</td>
							<td class="px-4 py-4 text-right">
								<Button
									href="/account/orders/{order.id}"
									variant="ghost"
									size="sm"
									class="text-[--ft-accent] hover:text-[--ft-accent]"
								>
									Zobacz szczegóły
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</Card>
