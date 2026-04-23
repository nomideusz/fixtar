<script lang="ts">
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		PackageIcon,
		CheckCircleIcon,
		WarningCircleIcon,
		TagIcon,
		LinkIcon,
		CaretRightIcon
	} from 'phosphor-svelte';

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

<div class="ft-container ft-section-sm">
	<!-- Page header -->
	<header class="mb-8">
		<p class="admin-kicker">admin</p>
		<h1 class="mt-1 text-2xl font-normal tracking-tight text-[--ft-text-strong]">Dashboard</h1>
		<p class="mt-2 text-sm text-[--ft-text-muted]">Overview of your store.</p>
	</header>

	{#if data.error}
		<div
			class="mb-6 flex items-center gap-3 rounded-md border p-4"
			style="border-color: color-mix(in srgb, var(--color-danger) 24%, transparent); background: color-mix(in srgb, var(--color-danger) 6%, white);"
		>
			<WarningCircleIcon class="h-5 w-5 shrink-0" style="color: var(--color-danger);" aria-hidden="true" />
			<p class="text-sm" style="color: var(--color-danger);">{data.error}</p>
		</div>
	{/if}

	<!-- Stats -->
	<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card class="p-4">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-xs text-[--ft-text-muted]">Total products</p>
					<p class="mt-1 text-2xl font-normal text-[--ft-text-strong]">
						{data.stats.totalProducts}
					</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">All products in system</p>
				</div>
				<div class="stat-icon">
					<PackageIcon class="h-5 w-5" aria-hidden="true" />
				</div>
			</div>
		</Card>

		<Card class="p-4">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-xs text-[--ft-text-muted]">Active</p>
					<p class="mt-1 text-2xl font-normal" style="color: var(--color-success);">
						{data.stats.activeProducts}
					</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">{activePercentage}% of total</p>
				</div>
				<div class="stat-icon" style="color: var(--color-success);">
					<CheckCircleIcon class="h-5 w-5" aria-hidden="true" />
				</div>
			</div>
		</Card>

		<Card class="p-4">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-xs text-[--ft-text-muted]">Drafts</p>
					<p class="mt-1 text-2xl font-normal" style="color: var(--color-warning);">
						{data.stats.draftProducts}
					</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">{draftPercentage}% awaiting review</p>
				</div>
				<div class="stat-icon" style="color: var(--color-warning);">
					<WarningCircleIcon class="h-5 w-5" aria-hidden="true" />
				</div>
			</div>
		</Card>

		<Card class="p-4">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-xs text-[--ft-text-muted]">Categories</p>
					<p class="mt-1 text-2xl font-normal text-[--ft-text-strong]">
						{data.stats.totalCategories}
					</p>
					<p class="mt-1 text-xs text-[--ft-text-faint]">Product categories</p>
				</div>
				<div class="stat-icon">
					<TagIcon class="h-5 w-5" aria-hidden="true" />
				</div>
			</div>
		</Card>
	</div>

	<!-- Actions + recent -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card>
			<h2 class="mb-4 text-base font-medium text-[--ft-text-strong]">Product Management</h2>
			<div class="flex flex-col">
				<a href="/admin/products" class="action-row">
					<PackageIcon class="action-icon" aria-hidden="true" />
					<div class="min-w-0 flex-1">
						<span class="action-title">Manage products</span>
						<p class="action-desc">View and edit all products</p>
					</div>
					<CaretRightIcon class="action-chevron" aria-hidden="true" />
				</a>

				{#if data.stats.draftProducts > 0}
					<a href="/admin/products?status=draft" class="action-row">
						<WarningCircleIcon class="action-icon" style="color: var(--color-warning);" aria-hidden="true" />
						<div class="min-w-0 flex-1">
							<span class="action-title">Review drafts</span>
							<p class="action-desc">
								{data.stats.draftProducts}
								{data.stats.draftProducts === 1 ? 'product needs' : 'products need'} review
							</p>
						</div>
						<CaretRightIcon class="action-chevron" aria-hidden="true" />
					</a>
				{/if}

				<a href="/admin/baselinker" class="action-row">
					<LinkIcon class="action-icon" aria-hidden="true" />
					<div class="min-w-0 flex-1">
						<span class="action-title">BaseLinker</span>
						<p class="action-desc">Sync products and manage orders</p>
					</div>
					<CaretRightIcon class="action-chevron" aria-hidden="true" />
				</a>
			</div>
		</Card>

		<Card>
			<h2 class="mb-4 text-base font-medium text-[--ft-text-strong]">Recently added</h2>
			<ul class="divide-y divide-[--ft-line]">
				{#each data.recentProducts as product (product.id)}
					<li class="flex items-center justify-between gap-3 py-3">
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm text-[--ft-text-strong]">{product.name}</p>
							<p class="truncate text-xs text-[--ft-text-muted]">
								<span class="font-mono">{product.sku || '—'}</span>
								<span class="mx-1">·</span>
								<span class="font-mono">{product.price.toFixed(2)} zł</span>
							</p>
						</div>
						<span
							class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs"
							style={product.status === 'active'
								? 'border-color: color-mix(in srgb, var(--color-success) 30%, transparent); background: color-mix(in srgb, var(--color-success) 10%, white); color: var(--color-success);'
								: product.status === 'draft'
									? 'border-color: color-mix(in srgb, var(--color-warning) 32%, transparent); background: color-mix(in srgb, var(--color-warning) 10%, white); color: var(--color-warning);'
									: 'border-color: var(--ft-line); background: var(--ft-surface); color: var(--ft-text-muted);'}
						>
							{product.status}
						</span>
					</li>
				{:else}
					<li class="py-6 text-center text-sm text-[--ft-text-muted]">No recent products.</li>
				{/each}
			</ul>

			{#if data.recentProducts.length > 0}
				<div class="mt-4 border-t border-[--ft-line] pt-3">
					<a
						href="/admin/products"
						class="text-sm text-[--ft-text] underline-offset-4 hover:text-[--ft-text-strong] hover:underline"
					>
						View all products →
					</a>
				</div>
			{/if}
		</Card>
	</div>

	<!-- Quick actions -->
	<div class="mt-8">
		<Card>
			<h2 class="mb-4 text-base font-medium text-[--ft-text-strong]">Quick actions</h2>
			<div class="flex flex-wrap gap-3">
				<Button href="/admin/products">Manage products</Button>
				<Button href="/admin/baselinker" variant="secondary">BaseLinker</Button>
				{#if data.stats.draftProducts > 0}
					<Button href="/admin/products?status=draft" variant="ghost">
						Review drafts ({data.stats.draftProducts})
					</Button>
				{/if}
				<Button href="/admin/orders" variant="secondary">Orders</Button>
			</div>
		</Card>
	</div>
</div>

<style>
	.admin-kicker {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ft-text-muted);
	}

	.stat-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
		color: var(--ft-text-muted);
		flex-shrink: 0;
	}

	.action-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		margin: 0 -12px;
		border-radius: var(--radius-sm);
		text-decoration: none;
		transition: background-color var(--dur-fast) ease;
	}

	.action-row:hover {
		background: var(--ft-frost);
	}

	:global(.action-icon) {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		color: var(--ft-text-muted);
	}

	.action-title {
		display: block;
		font-size: 0.9375rem;
		color: var(--ft-text-strong);
	}

	.action-desc {
		font-size: 0.8125rem;
		color: var(--ft-text-muted);
		margin-top: 2px;
	}

	:global(.action-chevron) {
		width: 16px;
		height: 16px;
		color: var(--ft-text-faint);
		flex-shrink: 0;
	}
</style>
