<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { ShoppingBagIcon } from 'phosphor-svelte';
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
	<div class="mb-8 flex items-end justify-between gap-4 border-b border-[--ft-line] pb-3">
		<div>
			<h2 class="mb-2 text-2xl text-[--ft-text]">Ostatnie zamówienia</h2>
			<p class="text-[--ft-text-muted]">Śledź status swoich zamówień</p>
		</div>
		<Button href="/account/orders" variant="outline">Zobacz wszystkie</Button>
	</div>

	{#if orders.length === 0}
		<div class="py-12 text-center">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md border border-[--ft-line] bg-[--ft-surface]"
			>
				<ShoppingBagIcon class="h-8 w-8 text-[--ft-text-muted]" aria-hidden="true" />
			</div>
			<h3 class="mb-2 text-lg text-[--ft-text]">Brak zamówień</h3>
			<p class="mb-6 text-[--ft-text-muted]">Rozpocznij zakupy i zobacz swoje zamówienia tutaj</p>
			<Button href="/products">Rozpocznij zakupy</Button>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-[--ft-line]">
						<th class="px-4 py-4 text-left text-[--ft-text]">Numer zamówienia</th>
						<th class="px-4 py-4 text-left text-[--ft-text]">Data</th>
						<th class="px-4 py-4 text-left text-[--ft-text]">Produkty</th>
						<th class="px-4 py-4 text-left text-[--ft-text]">Suma</th>
						<th class="px-4 py-4 text-left text-[--ft-text]">Status</th>
						<th class="px-4 py-4 text-right text-[--ft-text]">Akcja</th>
					</tr>
				</thead>
				<tbody>
					{#each orders as order (order)}
						{@const status = getOrderStatus(order.status)}
						<tr
							class="border-b border-[--ft-line] transition-colors duration-150 hover:bg-[--ft-surface-secondary]"
						>
							<td class="px-4 py-4">
								<span class="font-mono text-[--ft-accent]">#{order.id}</span>
							</td>
							<td class="px-4 py-4 text-[--ft-text-muted]">{order.date}</td>
							<td class="px-4 py-4 text-[--ft-text-muted]">
								{order.items}
								{order.items === 1 ? 'produkt' : 'produkty'}
							</td>
							<td class="px-4 py-4 font-mono text-[--ft-text]">
								{order.total.toFixed(2)} zł
							</td>
							<td class="px-4 py-4">
								<span
									class="inline-flex rounded-full border border-[--ft-line] px-3 py-1 text-xs {status.colorClass}"
								>
									{status.label}
								</span>
							</td>
							<td class="px-4 py-4 text-right">
								<Button
									href="/account/orders/{order.id}"
									variant="ghost"
									size="sm"
									class="text-[--ft-text-muted] hover:text-[--ft-text]"
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
