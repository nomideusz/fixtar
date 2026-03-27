<script lang="ts">
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { PackageIcon, CheckCircleIcon, WarningCircleIcon, TagIcon, LinkIcon, CaretRightIcon } from 'phosphor-svelte';

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

	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) goto('/');
	});

	const activePercentage = $derived(
		data.stats.totalProducts > 0 ? Math.round((data.stats.activeProducts / data.stats.totalProducts) * 100) : 0
	);
	const draftPercentage = $derived(
		data.stats.totalProducts > 0 ? Math.round((data.stats.draftProducts / data.stats.totalProducts) * 100) : 0
	);
</script>

<svelte:head>
	<title>Admin Dashboard - FixTar</title>
	<meta name="description" content="Admin dashboard for managing the store" />
</svelte:head>

<div class="ft-container ft-section-sm">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-[--ft-text-strong]">Admin Dashboard</h1>
		<p class="mt-2 text-[--ft-text-muted]">Manage your store from one place</p>
		{#if data.error}
			<div class="bg-danger/5 border-danger/10 mt-4 rounded-md border p-4">
				<p class="text-danger">WarningIcon: {data.error}</p>
			</div>
		{/if}
	</div>

	<!-- Statistics Grid -->
	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-[--ft-text-muted]">Total Products</p>
					<p class="text-2xl font-bold text-[--ft-text-strong]">{data.stats.totalProducts}</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">All products in system</p>
				</div>
				<div class="rounded-full bg-[--ft-frost] p-3">
					<PackageIcon class="h-6 w-6 text-[--ft-accent]" aria-hidden="true" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-[--ft-text-muted]">Active Products</p>
					<p class="text-success text-2xl font-bold">{data.stats.activeProducts}</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">{activePercentage}% of total products</p>
				</div>
				<div class="bg-success/10 rounded-full p-3">
					<CheckCircleIcon class="text-success h-6 w-6" aria-hidden="true" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-[--ft-text-muted]">Draft Products</p>
					<p class="text-[--ft-warm] text-2xl font-bold">{data.stats.draftProducts}</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">{draftPercentage}% waiting for review</p>
				</div>
				<div class="bg-[--ft-frost] rounded-full p-3">
					<WarningCircleIcon class="h-6 w-6 text-[--ft-warm]" aria-hidden="true" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-[--ft-text-muted]">Categories</p>
					<p class="text-[--ft-accent] text-2xl font-bold">{data.stats.totalCategories}</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">Product categories</p>
				</div>
				<div class="bg-[--ft-frost] rounded-full p-3">
					<TagIcon class="h-6 w-6 text-[--ft-accent]" aria-hidden="true" />
				</div>
			</div>
		</Card>
	</div>

	<!-- Quick Actions & Recent Activity -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<Card>
			<h2 class="mb-4 text-xl font-semibold text-[--ft-text-strong]">Product Management</h2>
			<div class="space-y-3">
				<a href="/admin/products" class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-[--ft-frost]">
					<div class="flex items-center">
						<PackageIcon class="mr-3 h-5 w-5 text-[--ft-text-muted]" aria-hidden="true" />
						<div>
							<span class="font-medium text-[--ft-text]">Manage Products</span>
							<p class="text-sm text-[--ft-text-muted]">View and edit all products</p>
						</div>
					</div>
					<CaretRightIcon class="h-5 w-5 text-[--ft-text-faint]" aria-hidden="true" />
				</a>

				{#if data.stats.draftProducts > 0}
					<a href="/admin/products?status=draft" class="flex items-center justify-between rounded-lg border border-[--ft-accent]/20 p-3 transition-colors hover:bg-[--ft-frost]">
						<div class="flex items-center">
							<WarningCircleIcon class="mr-3 h-5 w-5 text-[--ft-warm]" aria-hidden="true" />
							<div>
								<span class="font-medium text-[--ft-text-strong]">Review Draft Products</span>
								<p class="text-sm text-[--ft-accent]">{data.stats.draftProducts} products need review</p>
							</div>
						</div>
						<CaretRightIcon class="h-5 w-5 text-[--ft-text-faint]" aria-hidden="true" />
					</a>
				{/if}

				<a href="/admin/baselinker" class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-[--ft-frost]">
					<div class="flex items-center">
						<LinkIcon class="mr-3 h-5 w-5 text-[--ft-text-muted]" aria-hidden="true" />
						<div>
							<span class="font-medium text-[--ft-text]">BaseLinker Integration</span>
							<p class="text-sm text-[--ft-text-muted]">Sync products and manage orders</p>
						</div>
					</div>
					<CaretRightIcon class="h-5 w-5 text-[--ft-text-faint]" aria-hidden="true" />
				</a>
			</div>
		</Card>

		<Card>
			<h2 class="mb-4 text-xl font-semibold text-[--ft-text-strong]">Recently Added Products</h2>
			<div class="space-y-3">
				{#each data.recentProducts as product (product.id)}
					<div class="flex items-center justify-between gap-3 py-2">
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-[--ft-text]">{product.name}</p>
							<p class="truncate text-sm text-[--ft-text-muted]">
								{product.sku ? `SKU: ${product.sku}` : 'No SKU'} • {product.price.toFixed(2)} zł
							</p>
						</div>
						<span class="shrink-0 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap {product.status === 'active'
							? 'bg-success/10 text-success'
							: product.status === 'draft'
								? 'bg-[--ft-frost] text-[--ft-warm]'
								: 'bg-[--ft-frost] text-[--ft-text-muted]'}">
							{product.status}
						</span>
					</div>
				{:else}
					<div class="text-center py-4 text-[--ft-text-muted]">No recent products found</div>
				{/each}
			</div>

			{#if data.recentProducts.length > 0}
				<div class="mt-4 border-t border-[--ft-line] pt-4">
					<a href="/admin/products" class="text-sm font-medium text-[--ft-accent] hover:text-[--ft-accent-hover]">View all products →</a>
				</div>
			{/if}
		</Card>
	</div>

	<!-- Quick Actions -->
	<div class="mt-8">
		<Card>
			<h2 class="mb-4 text-xl font-semibold text-[--ft-text-strong]">Quick Actions</h2>
			<div class="flex flex-wrap gap-4">
				<Button href="/admin/products">Manage Products</Button>
				<Button href="/admin/baselinker" variant="secondary">BaseLinker</Button>
				{#if data.stats.draftProducts > 0}
					<Button href="/admin/products?status=draft" variant="ghost">Review Drafts ({data.stats.draftProducts})</Button>
				{/if}
				<Button href="/admin/orders" variant="secondary">View Orders</Button>
			</div>
		</Card>
	</div>
</div>
