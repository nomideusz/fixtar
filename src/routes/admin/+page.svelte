<script lang="ts">
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	
	interface Props {
		data: {
			stats: {
				totalProducts: number;
				activeProducts: number;
				draftProducts: number;
				totalCategories: number;
				totalOrders: number;
				totalRevenue: number;
			};
			recentProducts: Array<{
				id: string;
				name: string;
				sku: string;
				price: number;
				status: string;
				created: string;
				categories: any[];
			}>;
			error?: string;
		};
	}
	
	let { data }: Props = $props();
	
	// Check if user is admin (simple check for demo)
	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) {
			goto('/');
		}
	});
	
	// Calculate percentages for better insights
	const activePercentage = $derived(
		data.stats.totalProducts > 0 
			? Math.round((data.stats.activeProducts / data.stats.totalProducts) * 100)
			: 0
	);
	
	const draftPercentage = $derived(
		data.stats.totalProducts > 0 
			? Math.round((data.stats.draftProducts / data.stats.totalProducts) * 100)
			: 0
	);
</script>

<svelte:head>
	<title>Admin Dashboard - FixTar</title>
	<meta name="description" content="Admin dashboard for managing the store" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
		<p class="mt-2 text-neutral-600">Manage your store from one place</p>
		{#if data.error}
			<div class="mt-4 p-4 bg-danger/5 border border-danger/10 rounded-md">
				<p class="text-danger">Warning: {data.error}</p>
			</div>
		{/if}
	</div>
	
	<!-- Enhanced Statistics Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Total Products</p>
					<p class="text-2xl font-bold text-neutral-900">{data.stats.totalProducts}</p>
					<p class="text-xs text-neutral-500 mt-1">All products in system</p>
				</div>
				<div class="p-3 bg-accent-100 rounded-full">
					<svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
					</svg>
				</div>
			</div>
		</Card>
		
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Active Products</p>
					<p class="text-2xl font-bold text-success">{data.stats.activeProducts}</p>
					<p class="text-xs text-neutral-500 mt-1">{activePercentage}% of total products</p>
				</div>
				<div class="p-3 bg-success/10 rounded-full">
					<svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
		</Card>
		
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Draft Products</p>
					<p class="text-2xl font-bold text-brand-600">{data.stats.draftProducts}</p>
					<p class="text-xs text-neutral-500 mt-1">{draftPercentage}% waiting for review</p>
				</div>
				<div class="p-3 bg-brand-100 rounded-full">
					<svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</div>
			</div>
		</Card>
		
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Categories</p>
					<p class="text-2xl font-bold text-brand-600">{data.stats.totalCategories}</p>
					<p class="text-xs text-neutral-500 mt-1">Product categories</p>
				</div>
				<div class="p-3 bg-brand-100 rounded-full">
					<svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
			</div>
		</Card>
	</div>
	
	<!-- Quick Actions & Recent Activity -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Product Management -->
		<Card>
			<h2 class="text-xl font-semibold mb-4">Product Management</h2>
			<div class="space-y-3">
				<a href="/admin/products" class="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-neutral-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
						<div>
							<span class="font-medium">Manage Products</span>
							<p class="text-sm text-neutral-500">View and edit all products</p>
						</div>
					</div>
					<svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
				
				{#if data.stats.draftProducts > 0}
					<a href="/admin/products?status=draft" class="flex items-center justify-between p-3 rounded-lg hover:bg-brand-50 transition-colors border border-brand-200">
						<div class="flex items-center">
							<svg class="w-5 h-5 text-brand-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
							</svg>
							<div>
								<span class="font-medium text-brand-800">Review Draft Products</span>
								<p class="text-sm text-brand-600">{data.stats.draftProducts} products need review</p>
							</div>
						</div>
						<svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				{/if}
				
				<a href="/admin/xml-sync" class="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-neutral-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<div>
							<span class="font-medium">Sync XML Products</span>
							<p class="text-sm text-neutral-500">Import from Qoltec API</p>
						</div>
					</div>
					<svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		</Card>
		
		<!-- Recent Products -->
		<Card>
			<h2 class="text-xl font-semibold mb-4">Recently Added Products</h2>
			<div class="space-y-3">
				{#each data.recentProducts as product (product)}
					<div class="flex items-center justify-between py-2 gap-3">
						<div class="flex-1 min-w-0">
							<p class="font-medium truncate text-sm">{product.name}</p>
							<p class="text-sm text-neutral-600 truncate">
								{product.sku ? `SKU: ${product.sku}` : 'No SKU'} • {product.price.toFixed(2)} zł
							</p>
						</div>
						<div class="flex items-center space-x-2 shrink-0">
							<span class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap {
								product.status === 'active' 
									? 'bg-success/10 text-success-dark'
									: product.status === 'draft'
									? 'bg-brand-100 text-brand-800'
									: 'bg-neutral-100 text-neutral-800'
							}">
								{product.status}
							</span>
						</div>
					</div>
				{:else}
					<div class="text-center py-4 text-neutral-500">
						No recent products found
					</div>
				{/each}
			</div>
			
			{#if data.recentProducts.length > 0}
				<div class="mt-4 pt-4 border-t">
					<a href="/admin/products" class="text-brand-600 hover:text-brand-800 text-sm font-medium">
						View all products →
					</a>
				</div>
			{/if}
		</Card>
	</div>
	
	<!-- Quick Actions -->
	<div class="mt-8">
		<Card>
			<h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
			<div class="flex flex-wrap gap-4">
				<Button href="/admin/products">Manage Products</Button>
				<Button href="/admin/xml-sync" variant="secondary">Sync Products</Button>
				{#if data.stats.draftProducts > 0}
					<Button href="/admin/products?status=draft" variant="ghost">
						Review Drafts ({data.stats.draftProducts})
					</Button>
				{/if}
				<Button href="/admin/orders" variant="secondary">View Orders</Button>
			</div>
		</Card>
	</div>
</div> 



