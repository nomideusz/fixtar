<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	
	// Mock orders data
	let orders = $state([
		{
			id: 'ORD001',
			customer: 'John Doe',
			email: 'john@example.com',
			date: '2024-01-15',
			total: 125.99,
			status: 'completed',
			items: [
				{ name: 'Wireless Mouse', quantity: 1, price: 29.99 },
				{ name: 'USB-C Hub', quantity: 2, price: 48.00 }
			]
		},
		{
			id: 'ORD002',
			customer: 'Jane Smith',
			email: 'jane@example.com',
			date: '2024-01-14',
			total: 89.50,
			status: 'processing',
			items: [
				{ name: 'Laptop Stand', quantity: 1, price: 89.50 }
			]
		},
		{
			id: 'ORD003',
			customer: 'Bob Johnson',
			email: 'bob@example.com',
			date: '2024-01-13',
			total: 234.00,
			status: 'shipped',
			items: [
				{ name: 'Mechanical Keyboard', quantity: 1, price: 159.00 },
				{ name: 'Mouse Pad', quantity: 1, price: 25.00 },
				{ name: 'Wrist Rest', quantity: 1, price: 50.00 }
			]
		}
	]);
	
	let searchQuery = $state('');
	let selectedOrder = $state<any>(null);
	
	// Filter orders based on search
	let filteredOrders = $derived(
		orders.filter(order => 
			order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.email.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
	
	function getStatusColor(status: string) {
		switch (status) {
			case 'completed': return 'bg-success/10 text-success-dark';
			case 'processing': return 'bg-warning/10 text-warning-dark';
			case 'shipped': return 'bg-brand-100 text-brand-800';
			case 'cancelled': return 'bg-danger/10 text-danger-dark';
			default: return 'bg-neutral-100 text-neutral-800';
		}
	}
	
	function updateOrderStatus(orderId: string, newStatus: string) {
		const order = orders.find(o => o.id === orderId);
		if (order) {
			order.status = newStatus;
			orders = orders; // Trigger reactivity
		}
	}
</script>

<svelte:head>
	<title>Manage Orders - Admin - FixTar</title>
	<meta name="description" content="Manage customer orders" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-neutral-900">Manage Orders</h1>
		<p class="mt-2 text-neutral-600">{orders.length} total orders</p>
	</div>
	
	<!-- Search -->
	<div class="mb-6">
		<Input
			type="search"
			placeholder="Search by order ID, customer name, or email..."
			value={searchQuery}
			oninput={(e) => searchQuery = e.currentTarget.value}
			class="max-w-md"
		/>
	</div>
	
	<!-- Orders Table -->
	<Card>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b">
						<th class="text-left py-3 px-4">Order ID</th>
						<th class="text-left py-3 px-4">Customer</th>
						<th class="text-left py-3 px-4">Date</th>
						<th class="text-left py-3 px-4">Total</th>
						<th class="text-left py-3 px-4">Status</th>
						<th class="text-right py-3 px-4">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredOrders as order (order)}
						<tr class="border-b hover:bg-neutral-50">
							<td class="py-3 px-4 font-medium">#{order.id}</td>
							<td class="py-3 px-4">
								<div>
									<p class="font-medium">{order.customer}</p>
									<p class="text-sm text-neutral-600">{order.email}</p>
								</div>
							</td>
							<td class="py-3 px-4 text-neutral-600">{order.date}</td>
							<td class="py-3 px-4">${order.total.toFixed(2)}</td>
							<td class="py-3 px-4">
								<span class={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
									{order.status}
								</span>
							</td>
							<td class="py-3 px-4 text-right">
								<button
									onclick={() => selectedOrder = order}
									class="text-brand-600 hover:text-brand-800"
								>
									View Details
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			
			{#if filteredOrders.length === 0}
				<div class="text-center py-8 text-neutral-500">
					No orders found matching your search.
				</div>
			{/if}
		</div>
	</Card>
	
	<!-- Order Details Modal -->
	{#if selectedOrder}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<Card class="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div class="flex justify-between items-start mb-4">
					<div>
						<h2 class="text-xl font-semibold">Order #{selectedOrder.id}</h2>
						<p class="text-neutral-600">{selectedOrder.date}</p>
					</div>
					<button
						onclick={() => selectedOrder = null}
						class="text-neutral-400 hover:text-neutral-600"
						aria-label="Close modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				
				<!-- Customer Info -->
				<div class="mb-6">
					<h3 class="font-medium mb-2">Customer Information</h3>
					<p>{selectedOrder.customer}</p>
					<p class="text-neutral-600">{selectedOrder.email}</p>
				</div>
				
				<!-- Order Items -->
				<div class="mb-6">
					<h3 class="font-medium mb-2">Order Items</h3>
					<div class="space-y-2">
						{#each selectedOrder.items as item (item)}
							<div class="flex justify-between py-2 border-b">
								<div>
									<p>{item.name}</p>
									<p class="text-sm text-neutral-600">Quantity: {item.quantity}</p>
								</div>
								<p class="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
							</div>
						{/each}
					</div>
					<div class="mt-4 pt-4 border-t">
						<div class="flex justify-between font-semibold">
							<span>Total</span>
							<span>${selectedOrder.total.toFixed(2)}</span>
						</div>
					</div>
				</div>
				
				<!-- Status Update -->
				<div class="mb-6">
					<h3 class="font-medium mb-2">Order Status</h3>
					<select
						value={selectedOrder.status}
						onchange={(e) => updateOrderStatus(selectedOrder.id, e.currentTarget.value)}
						class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
					>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
				
				<!-- Actions -->
				<div class="flex justify-end gap-4">
					<Button onclick={() => selectedOrder = null} variant="secondary">
						Close
					</Button>
					<Button>
						Send Update Email
					</Button>
				</div>
			</Card>
		</div>
	{/if}
</div> 

