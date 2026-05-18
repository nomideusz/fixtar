<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
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
	<div class="header">
		<div>
			<p class="ft-eyebrow">Zamówienia</p>
			<h2 class="title">Ostatnie zamówienia</h2>
		</div>
		<Button href="/account/orders" variant="outline">Zobacz wszystkie</Button>
	</div>

	{#if orders.length === 0}
		<EmptyState
			icon={ShoppingBagIcon}
			title="Brak zamówień"
			description="Rozpocznij zakupy i zobacz swoje zamówienia tutaj."
		>
			<Button href="/products" variant="teal">Rozpocznij zakupy</Button>
		</EmptyState>
	{:else}
		<div class="table-wrap">
			<table class="data">
				<thead>
					<tr>
						<th>Numer</th>
						<th>Data</th>
						<th>Produkty</th>
						<th>Suma</th>
						<th>Status</th>
						<th class="num">Akcja</th>
					</tr>
				</thead>
				<tbody>
					{#each orders as order (order)}
						{@const status = getOrderStatus(order.status)}
						<tr>
							<td><span class="sku">#{order.id}</span></td>
							<td class="muted">{order.date}</td>
							<td class="muted">
								{order.items} {order.items === 1 ? 'produkt' : 'produkty'}
							</td>
							<td class="money">{order.total.toFixed(2)} zł</td>
							<td>
								<span class="badge {status.colorClass}">{status.label}</span>
							</td>
							<td class="num">
								<Button href="/account/orders/{order.id}" variant="ghost" size="sm">
									Szczegóły
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</Card>

<style>
	.header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--ft-line);
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		font-weight: 500;
		color: var(--ft-text);
		letter-spacing: -0.005em;
		line-height: 1;
		text-transform: uppercase;
		margin: 4px 0 0;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table.data {
		width: 100%;
		border-collapse: collapse;
		background: #fff;
	}

	table.data th,
	table.data td {
		padding: 14px 18px;
		text-align: left;
		font-size: 13px;
		border-bottom: 1px solid var(--ft-ink-100);
	}

	table.data th {
		background: var(--ft-frost);
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ft-ink-500);
		font-weight: 600;
		border-bottom: 1px solid var(--ft-line);
	}

	table.data tbody tr {
		transition: background var(--dur-fast) ease;
	}

	table.data tbody tr:hover {
		background: var(--ft-frost);
	}

	table.data tbody tr:last-child td {
		border-bottom: 0;
	}

	.sku {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--ft-ink-700);
	}

	.muted {
		color: var(--ft-ink-500);
	}

	.money {
		font-family: var(--font-sans);
		font-weight: 700;
		color: var(--ft-ink-900);
		font-variant-numeric: tabular-nums;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 4px 10px;
		border-radius: var(--radius-full);
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		border: 1px solid var(--ft-line);
	}

	.num {
		text-align: right;
	}
</style>
