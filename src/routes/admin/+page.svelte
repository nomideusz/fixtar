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

<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
		<p class="mt-2 text-neutral-600">Manage your store from one place</p>
		{#if data.error}
			<div class="bg-danger/5 border-danger/10 mt-4 rounded-md border p-4">
				<p class="text-danger">Warning: {data.error}</p>
			</div>
		{/if}
	</div>

	<!-- Enhanced Statistics Grid -->
	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Total Products</p>
					<p class="text-2xl font-bold text-neutral-900">{data.stats.totalProducts}</p>
					<p class="mt-1 text-xs text-neutral-500">All products in system</p>
				</div>
				<div class="bg-accent-100 rounded-full p-3">
					<svg
						class="text-accent-600 h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Active Products</p>
					<p class="text-success text-2xl font-bold">{data.stats.activeProducts}</p>
					<p class="mt-1 text-xs text-neutral-500">{activePercentage}% of total products</p>
				</div>
				<div class="bg-success/10 rounded-full p-3">
					<svg class="text-success h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Draft Products</p>
					<p class="text-brand-600 text-2xl font-bold">{data.stats.draftProducts}</p>
					<p class="mt-1 text-xs text-neutral-500">{draftPercentage}% waiting for review</p>
				</div>
				<div class="bg-brand-100 rounded-full p-3">
					<svg class="text-brand-600 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Categories</p>
					<p class="text-brand-600 text-2xl font-bold">{data.stats.totalCategories}</p>
					<p class="mt-1 text-xs text-neutral-500">Product categories</p>
				</div>
				<div class="bg-brand-100 rounded-full p-3">
					<svg class="text-brand-600 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
			</div>
		</Card>
	</div>

	<!-- Quick Actions & Recent Activity -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Product Management -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Product Management</h2>
			<div class="space-y-3">
				<a
					href="/admin/products"
					class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-neutral-50"
				>
					<div class="flex items-center">
						<svg
							class="mr-3 h-5 w-5 text-neutral-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							/>
						</svg>
						<div>
							<span class="font-medium">Manage Products</span>
							<p class="text-sm text-neutral-500">View and edit all products</p>
						</div>
					</div>
					<svg
						class="h-5 w-5 text-neutral-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>

				{#if data.stats.draftProducts > 0}
					<a
						href="/admin/products?status=draft"
						class="hover:bg-brand-50 border-brand-200 flex items-center justify-between rounded-lg border p-3 transition-colors"
					>
						<div class="flex items-center">
							<svg
								class="text-brand-600 mr-3 h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
							<div>
								<span class="text-brand-800 font-medium">Review Draft Products</span>
								<p class="text-brand-600 text-sm">
									{data.stats.draftProducts} products need review
								</p>
							</div>
						</div>
						<svg
							class="text-brand-400 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</a>
				{/if}

				<a
					href="/admin/baselinker"
					class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-neutral-50"
				>
					<div class="flex items-center">
						<svg
							class="mr-3 h-5 w-5 text-neutral-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
							/>
						</svg>
						<div>
							<span class="font-medium">BaseLinker Integration</span>
							<p class="text-sm text-neutral-500">Sync products and manage orders</p>
						</div>
					</div>
					<svg
						class="h-5 w-5 text-neutral-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>
		</Card>

		<!-- Recent Products -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Recently Added Products</h2>
			<div class="space-y-3">
				{#each data.recentProducts as product (product)}
					<div class="flex items-center justify-between gap-3 py-2">
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium">{product.name}</p>
							<p class="truncate text-sm text-neutral-600">
								{product.sku ? `SKU: ${product.sku}` : 'No SKU'} • {product.price.toFixed(2)} zł
							</p>
						</div>
						<div class="flex shrink-0 items-center space-x-2">
							<span
								class="rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap {product.status ===
								'active'
									? 'bg-success/10 text-success-dark'
									: product.status === 'draft'
										? 'bg-brand-100 text-brand-800'
										: 'bg-neutral-100 text-neutral-800'}"
							>
								{product.status}
							</span>
						</div>
					</div>
				{:else}
					<div class="text-center py-4 text-neutral-500">No recent products found</div>
				{/each}
			</div>

			{#if data.recentProducts.length > 0}
				<div class="mt-4 border-t pt-4">
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
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="flex flex-wrap gap-4">
				<Button href="/admin/products">Manage Products</Button>
				<Button href="/admin/baselinker" variant="secondary">BaseLinker</Button>
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
