<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { userStore } from '$lib/stores';
	import { LinkIcon, WarningCircleIcon, CheckCircleIcon } from 'phosphor-svelte';
	import { SvelteSet, SvelteURLSearchParams } from 'svelte/reactivity';
	import StatusOverviewCards from '$lib/components/admin/StatusOverviewCards.svelte';
	import SortableHeader from '$lib/components/admin/SortableHeader.svelte';
	import ProductRow from '$lib/components/admin/ProductRow.svelte';

	interface Props {
		data: {
			products: any[];
			categories: any[];
			statusCounts: {
				active: number;
				draft: number;
				inactive: number;
			};
			pagination: {
				currentPage: number;
				totalPages: number;
				totalItems: number;
			};
			filters: {
				search: string;
				status: string;
				category: string;
				sort: string;
				order: string;
			};
			error?: string;
		};
	}

	let { data }: Props = $props();

	// --- Admin Guard ---

	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) goto('/');
	});

	// --- Local Filter State ---

	let searchQuery = $state('');
	let statusFilter = $state('');
	let categoryFilter = $state('');
	let sortBy = $state('created');
	let sortOrder = $state('desc');

	// Sync from server data after navigation
	$effect(() => {
		searchQuery = data.filters.search;
		statusFilter = data.filters.status;
		categoryFilter = data.filters.category;
		sortBy = data.filters.sort;
		sortOrder = data.filters.order;
	});

	// --- Selection & Bulk State ---

	let selectedProducts = new SvelteSet<string>();
	let isLoading = $state(false);
	let bulkAction = $state('');
	let showBulkConfirm = $state(false);

	// --- Toast State ---

	let toastMessage = $state('');
	let toastType = $state<'success' | 'error' | 'info'>('success');
	let showToast = $state(false);

	function showNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => (showToast = false), 4000);
	}

	// --- Derived ---

	const allSelected = $derived(
		selectedProducts.size === data.products.length && data.products.length > 0
	);

	const hasFilters = $derived(
		!!data.filters.search || !!data.filters.status || !!data.filters.category
	);

	const toastIcon = $derived(
		toastType === 'success' ? '✅ Success' : toastType === 'error' ? '❌ Error' : 'ℹ️ InfoIcon'
	);

	// --- URL / Navigation ---

	function buildFilterUrl(overrides: { page?: number } = {}) {
		const params = new SvelteURLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (statusFilter) params.set('status', statusFilter);
		if (categoryFilter) params.set('category', categoryFilter);
		if (sortBy !== 'created') params.set('sort', sortBy);
		if (sortOrder !== 'desc') params.set('order', sortOrder);
		if (overrides.page && overrides.page > 1) params.set('page', overrides.page.toString());
		const qs = params.toString();
		return `/admin/products${qs ? '?' + qs : ''}`;
	}

	function navigateWithFilters(overrides: { page?: number } = {}) {
		goto(buildFilterUrl(overrides));
	}

	function clearFilters() {
		searchQuery = '';
		statusFilter = '';
		categoryFilter = '';
		sortBy = 'created';
		sortOrder = 'desc';
		navigateWithFilters();
	}

	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		navigateWithFilters();
	}

	function handleSort(field: string) {
		if (sortBy === field) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortOrder = 'asc';
		}
		navigateWithFilters();
	}

	function filterByStatus(status: string) {
		statusFilter = status;
		navigateWithFilters();
	}

	// --- Selection ---

	function toggleSelectAll() {
		if (allSelected) {
			selectedProducts.clear();
		} else {
			for (const p of data.products) selectedProducts.add(p.id);
		}
	}

	function toggleProductSelection(productId: string) {
		if (selectedProducts.has(productId)) {
			selectedProducts.delete(productId);
		} else {
			selectedProducts.add(productId);
		}
	}

	// --- Status API ---

	async function updateStatus(productIds: string[], newStatus: string) {
		isLoading = true;
		try {
			const response = await fetch('/api/admin/products/status', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productIds,
					status: newStatus,
					...(productIds.length > 1 && { action: 'bulk_update' })
				})
			});

			const result = await response.json();

			if (result.success) {
				if (productIds.length > 1) selectedProducts.clear();
				await invalidateAll();
				if (productIds.length > 1) {
					showNotification(`Successfully updated ${result.updated} products to ${newStatus}`);
				}
			} else {
				showNotification(`Error: ${result.error}`, 'error');
			}
		} catch (error) {
			showNotification(`Error updating product(s): ${error}`, 'error');
		} finally {
			isLoading = false;
			showBulkConfirm = false;
			bulkAction = '';
		}
	}

	function handleBulkAction() {
		if (!bulkAction || selectedProducts.size === 0) return;
		showBulkConfirm = true;
	}

	function confirmBulkAction() {
		updateStatus(Array.from(selectedProducts), bulkAction);
	}

	function cancelBulkAction() {
		showBulkConfirm = false;
		bulkAction = '';
	}
</script>

<svelte:head>
	<title>Manage Products - Admin - FixTar</title>
	<meta name="description" content="Manage your store products" />
</svelte:head>

<div class="ft-container ft-section-sm">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-[--ft-text-strong]">Manage Products</h1>
			<p class="mt-2 text-[--ft-text-muted]">{data.pagination.totalItems} products in catalog</p>
			<div class="mt-2 flex items-center gap-4 text-sm text-[--ft-text-muted]">
				<span>• Change product statuses and visibility</span>
				<span>• Search and filter all products</span>
				<a href="/admin/baselinker" class="text-[--ft-accent] hover:text-[--ft-accent-hover] font-medium">
					→ Open BaseLinker Integration
				</a>
			</div>
		</div>
		<div class="flex gap-4">
			<Button href="/admin/baselinker" variant="secondary">
				<LinkIcon class="mr-2 h-4 w-4" aria-hidden="true" />
				BaseLinker
			</Button>
			<Button href="/admin/baselinker" variant="secondary">Sync Products</Button>
		</div>
	</div>

	<!-- Error Banner -->
	{#if data.error}
		<div class="bg-danger/5 border-danger/10 mb-6 rounded-md border p-4">
			<div class="flex items-center">
				<WarningCircleIcon class="text-danger mr-3 h-5 w-5" aria-hidden="true" />
				<p class="text-danger">Error: {data.error}</p>
			</div>
		</div>
	{/if}

	<!-- Status Overview -->
	<StatusOverviewCards statusCounts={data.statusCounts} onFilterByStatus={filterByStatus} />

	<!-- Filters -->
	<Card class="mb-6 p-6">
		<div class="mb-4">
			<h3 class="mb-2 text-lg font-medium text-[--ft-text-strong]">Search & Filter Products</h3>
			<p class="text-sm text-[--ft-text-muted]">
				Find products by name, SKU, or filter by status and category
			</p>
		</div>
		<form onsubmit={handleSearchSubmit} class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div>
					<label for="search" class="mb-1 block text-sm font-medium text-[--ft-text]"
						>Search</label
					>
					<Input
						id="search"
						type="search"
						placeholder="Search by name, SKU..."
						value={searchQuery}
						oninput={(e) => (searchQuery = e.currentTarget.value)}
					/>
				</div>

				<div>
					<label for="status" class="mb-1 block text-sm font-medium text-[--ft-text]"
						>Status</label
					>
					<select
						id="status"
						value={statusFilter}
						onchange={(e) => {
							statusFilter = e.currentTarget.value;
							navigateWithFilters();
						}}
						class="focus:ring-[--ft-accent] w-full rounded-md border border-[--ft-line] px-3 py-2 focus:ring-2 focus:outline-none"
					>
						<option value="">All Statuses</option>
						<option value="active">✅ Active (visible)</option>
						<option value="draft">⚠️ Draft (hidden)</option>
						<option value="inactive">❌ Inactive (disabled)</option>
					</select>
				</div>

				<div>
					<label for="category" class="mb-1 block text-sm font-medium text-[--ft-text]"
						>Category</label
					>
					<select
						id="category"
						value={categoryFilter}
						onchange={(e) => {
							categoryFilter = e.currentTarget.value;
							navigateWithFilters();
						}}
						class="focus:ring-[--ft-accent] w-full rounded-md border border-[--ft-line] px-3 py-2 focus:ring-2 focus:outline-none"
					>
						<option value="">All Categories</option>
						{#each data.categories as category (category)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-end space-x-2">
					<Button type="submit" size="sm" disabled={isLoading}>Search</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onclick={clearFilters}
						disabled={isLoading}
					>
						Clear
					</Button>
				</div>
			</div>
		</form>
	</Card>

	<!-- Bulk Actions Bar -->
	{#if selectedProducts.size > 0}
		<Card class="bg-[--ft-frost] border-[--ft-accent]/20 mb-6 p-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div class="flex items-center">
						<CheckCircleIcon class="text-[--ft-accent] mr-2 h-5 w-5" aria-hidden="true" />
						<p class="text-[--ft-text-strong] font-medium">{selectedProducts.size} products selected</p>
					</div>
					<select
						value={bulkAction}
						onchange={(e) => (bulkAction = e.currentTarget.value)}
						class="border-[--ft-accent]/30 rounded-md border bg-[--ft-surface] px-3 py-1 text-sm"
						disabled={isLoading}
					>
						<option value="">Choose action...</option>
						<option value="active">✅ Set as Active (visible)</option>
						<option value="draft">⚠️ Set as Draft (hidden)</option>
						<option value="inactive">❌ Set as Inactive (disabled)</option>
					</select>
				</div>
				<div class="flex items-center space-x-2">
					<Button size="sm" onclick={handleBulkAction} disabled={!bulkAction || isLoading}>
						{isLoading ? 'Updating...' : 'Apply Action'}
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => selectedProducts.clear()}
						disabled={isLoading}
					>
						Clear Selection
					</Button>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Products Table -->
	<Card>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b bg-[--ft-frost]">
						<th class="w-8 px-4 py-3 text-left">
							<input
								type="checkbox"
								checked={allSelected}
								onchange={toggleSelectAll}
								class="rounded border-[--ft-line]"
							/>
						</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader
								label="Product"
								field="name"
								currentField={sortBy}
								currentOrder={sortOrder}
								onSort={handleSort}
							/>
						</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader
								label="SKU"
								field="sku"
								currentField={sortBy}
								currentOrder={sortOrder}
								onSort={handleSort}
							/>
						</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader
								label="Price"
								field="price"
								currentField={sortBy}
								currentOrder={sortOrder}
								onSort={handleSort}
							/>
						</th>
						<th class="px-4 py-3 text-left">Categories</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader
								label="Status & Actions"
								field="status"
								currentField={sortBy}
								currentOrder={sortOrder}
								onSort={handleSort}
							/>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each data.products as product (product)}
						<ProductRow
							{product}
							selected={selectedProducts.has(product.id)}
							{isLoading}
							onToggleSelect={() => toggleProductSelection(product.id)}
							onStatusChange={(id, status) => updateStatus([id], status)}
						/>
					{/each}
				</tbody>
			</table>

			{#if data.products.length === 0}
				<div class="py-8 text-center text-[--ft-text-muted]">
					{hasFilters
						? 'No products found matching your filters.'
						: 'No products in catalog.'}
				</div>
			{/if}
		</div>
	</Card>

	<!-- Pagination -->
	{#if data.pagination.totalPages > 1}
		<div class="mt-6 flex justify-center">
			<nav class="flex items-center space-x-2">
				<Button
					onclick={() => navigateWithFilters({ page: data.pagination.currentPage - 1 })}
					disabled={data.pagination.currentPage <= 1}
					variant="ghost"
					size="sm"
				>
					Previous
				</Button>

				{#each Array.from(
					{ length: Math.min(5, data.pagination.totalPages) },
					(_, i) => Math.max(1, data.pagination.currentPage - 2) + i
				).filter((p) => p <= data.pagination.totalPages) as pageNum (pageNum)}
					<Button
						onclick={() => navigateWithFilters({ page: pageNum })}
						variant={pageNum === data.pagination.currentPage ? 'primary' : 'ghost'}
						size="sm"
					>
						{pageNum}
					</Button>
				{/each}

				<Button
					onclick={() => navigateWithFilters({ page: data.pagination.currentPage + 1 })}
					disabled={data.pagination.currentPage >= data.pagination.totalPages}
					variant="ghost"
					size="sm"
				>
					Next
				</Button>
			</nav>
		</div>
	{/if}
</div>

<!-- Bulk Action Confirmation Modal -->
<Modal open={showBulkConfirm} onClose={cancelBulkAction} title="Confirm Bulk Action">
	<p class="mb-6 text-[--ft-text-muted]">
		Are you sure you want to set {selectedProducts.size} selected products to "{bulkAction}" status?
	</p>
	<div class="flex justify-end space-x-3">
		<Button variant="ghost" onclick={cancelBulkAction}>Cancel</Button>
		<Button onclick={confirmBulkAction} disabled={isLoading}>
			{isLoading ? 'Updating...' : 'Confirm'}
		</Button>
	</div>
</Modal>

<!-- Toast Notification Modal -->
<Modal open={showToast} onClose={() => (showToast = false)} title={toastIcon}>
	<p class="mb-6 text-[--ft-text-muted]">{toastMessage}</p>
	<div class="flex justify-end">
		<Button variant="ghost" onclick={() => (showToast = false)}>Close</Button>
	</div>
</Modal>
