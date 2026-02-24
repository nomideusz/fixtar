<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { userStore } from '$lib/stores';
	import { browser } from '$app/environment';
	
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
				itemsPerPage: number;
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
	
	// Check admin access
	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) {
			goto('/');
		}
	});
	
	// Local state
	let searchQuery = $state('');
	let statusFilter = $state('');
	let categoryFilter = $state('');
	let sortBy = $state('created');
	let sortOrder = $state('desc');
	let selectedProducts = $state(new Set<string>());
	
	// Sync local filter state when data (prop) changes (e.g. after navigation)
	$effect(() => {
		searchQuery = data.filters.search;
		statusFilter = data.filters.status;
		categoryFilter = data.filters.category;
		sortBy = data.filters.sort;
		sortOrder = data.filters.order;
	});
	let isLoading = $state(false);
	let bulkAction = $state('');
	let showBulkConfirm = $state(false);
	
	// Toast notification state
	let toastMessage = $state('');
	let toastType = $state('success'); // 'success' | 'error' | 'info'
	let showToast = $state(false);
	
	function showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, 4000);
	}
	
	// Update URL with filters
	function updateFilters() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (statusFilter) params.set('status', statusFilter);
		if (categoryFilter) params.set('category', categoryFilter);
		if (sortBy !== 'created') params.set('sort', sortBy);
		if (sortOrder !== 'desc') params.set('order', sortOrder);
		
		const newUrl = `/admin/products${params.toString() ? '?' + params.toString() : ''}`;
		goto(newUrl);
	}
	
	// Clear all filters
	function clearFilters() {
		searchQuery = '';
		statusFilter = '';
		categoryFilter = '';
		sortBy = 'created';
		sortOrder = 'desc';
		updateFilters();
	}
	
	// Handle search submit
	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		updateFilters();
	}
	
	// Handle sorting
	function handleSort(field: string) {
		if (sortBy === field) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortOrder = 'asc';
		}
		updateFilters();
	}
	
	// Select/deselect all products
	function toggleSelectAll() {
		if (selectedProducts.size === data.products.length) {
			selectedProducts = new Set();
		} else {
			selectedProducts = new Set(data.products.map(p => p.id));
		}
	}
	
	// Toggle individual product selection
	function toggleProductSelection(productId: string) {
		if (selectedProducts.has(productId)) {
			selectedProducts.delete(productId);
		} else {
			selectedProducts.add(productId);
		}
		selectedProducts = new Set(selectedProducts);
	}
	
	// Bulk update product status
	async function bulkUpdateStatus(newStatus: string) {
		if (selectedProducts.size === 0) return;
		
		isLoading = true;
		try {
			const response = await fetch('/api/admin/products/status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					productIds: Array.from(selectedProducts),
					status: newStatus,
					action: 'bulk_update'
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				selectedProducts = new Set();
				await invalidateAll();
				showToastNotification(`Successfully updated ${result.updated} products to ${newStatus}`);
			} else {
				showToastNotification(`Error: ${result.error}`, 'error');
			}
		} catch (error) {
			showToastNotification(`Error updating products: ${error}`, 'error');
		} finally {
			isLoading = false;
			showBulkConfirm = false;
			bulkAction = '';
		}
	}
	
	// Update single product status
	async function updateProductStatus(productId: string, newStatus: string) {
		isLoading = true;
		try {
			const response = await fetch('/api/admin/products/status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					productIds: [productId],
					status: newStatus
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				await invalidateAll();
			} else {
				showToastNotification(`Error: ${result.error}`, 'error');
			}
		} catch (error) {
			showToastNotification(`Error updating product: ${error}`, 'error');
		} finally {
			isLoading = false;
		}
	}
	
	// Pagination
	function goToPage(page: number) {
		const params = new URLSearchParams(window.location.search);
		if (page > 1) {
			params.set('page', page.toString());
		} else {
			params.delete('page');
		}
		
		const newUrl = `/admin/products${params.toString() ? '?' + params.toString() : ''}`;
		goto(newUrl);
	}
	
	// Handle bulk action
	function handleBulkAction() {
		if (!bulkAction || selectedProducts.size === 0) return;
		
		showBulkConfirm = true;
	}
	
	// Format date
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Manage Products - Admin - FixTar</title>
	<meta name="description" content="Manage your store products" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-neutral-900">Manage Products</h1>
			<p class="mt-2 text-neutral-600">{data.pagination.totalItems} products in catalog</p>
			<div class="mt-2 flex items-center gap-4 text-sm text-neutral-500">
				<span>• Change product statuses and visibility</span>
				<span>• Search and filter all products</span>
				<a href="/admin/xml-products" class="text-brand-600 hover:text-brand-800 font-medium">
					→ Manage XML Product Pricing
				</a>
			</div>
		</div>
		<div class="flex gap-4">
			<Button href="/admin/xml-products" variant="secondary">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
				</svg>
				XML Pricing
			</Button>
			<Button href="/admin/xml-sync" variant="secondary">Sync Products</Button>
		</div>
	</div>
	
	{#if data.error}
		<div class="mb-6 p-4 bg-danger/5 border border-danger/10 rounded-md">
			<div class="flex items-center">
				<svg class="w-5 h-5 text-danger mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<p class="text-danger">Error: {data.error}</p>
			</div>
		</div>
	{/if}
	
	<!-- Status Overview with explanations -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
		<Card class="p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Active Products</p>
					<p class="text-2xl font-bold text-success">{data.statusCounts.active}</p>
					<p class="text-xs text-neutral-500 mt-1">Visible to customers</p>
				</div>
				<button 
					onclick={() => { statusFilter = 'active'; updateFilters(); }}
					class="text-success hover:text-success-dark transition-colors"
					title="View active products"
				>
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</button>
			</div>
		</Card>
		
		<Card class="p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Draft Products</p>
					<p class="text-2xl font-bold text-brand-600">{data.statusCounts.draft}</p>
					<p class="text-xs text-neutral-500 mt-1">Awaiting review</p>
				</div>
				<button 
					onclick={() => { statusFilter = 'draft'; updateFilters(); }}
					class="text-brand-600 hover:text-brand-800 transition-colors"
					title="View draft products"
				>
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</button>
			</div>
		</Card>
		
		<Card class="p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-neutral-600">Inactive Products</p>
					<p class="text-2xl font-bold text-neutral-600">{data.statusCounts.inactive}</p>
					<p class="text-xs text-neutral-500 mt-1">Hidden from store</p>
				</div>
				<button 
					onclick={() => { statusFilter = 'inactive'; updateFilters(); }}
					class="text-neutral-600 hover:text-neutral-800 transition-colors"
					title="View inactive products"
				>
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
					</svg>
				</button>
			</div>
		</Card>
	</div>
	
	<!-- Filters -->
	<Card class="p-6 mb-6">
		<div class="mb-4">
			<h3 class="text-lg font-medium text-neutral-900 mb-2">Search & Filter Products</h3>
			<p class="text-sm text-neutral-600">Find products by name, SKU, or filter by status and category</p>
		</div>
		<form onsubmit={handleSearchSubmit} class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Search -->
				<div>
					<label for="search" class="block text-sm font-medium text-neutral-700 mb-1">Search</label>
					<Input
						id="search"
						type="search"
						placeholder="Search by name, SKU..."
						value={searchQuery}
						oninput={(e) => searchQuery = e.currentTarget.value}
					/>
				</div>
				
				<!-- Status Filter -->
				<div>
					<label for="status" class="block text-sm font-medium text-neutral-700 mb-1">Status</label>
					<select
						id="status"
						value={statusFilter}
						onchange={(e) => { statusFilter = e.currentTarget.value; updateFilters(); }}
						class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
					>
						<option value="">All Statuses</option>
						<option value="active">✅ Active (visible)</option>
						<option value="draft">⚠️ Draft (hidden)</option>
						<option value="inactive">❌ Inactive (disabled)</option>
					</select>
				</div>
				
				<!-- Category Filter -->
				<div>
					<label for="category" class="block text-sm font-medium text-neutral-700 mb-1">Category</label>
					<select
						id="category"
						value={categoryFilter}
						onchange={(e) => { categoryFilter = e.currentTarget.value; updateFilters(); }}
						class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
					>
						<option value="">All Categories</option>
						{#each data.categories as category (category)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>
				
				<!-- Actions -->
				<div class="flex items-end space-x-2">
					<Button type="submit" size="sm" disabled={isLoading}>
						{#if isLoading}
							<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
							</svg>
						{/if}
						Search
					</Button>
					<Button type="button" variant="ghost" size="sm" onclick={clearFilters} disabled={isLoading}>
						Clear
					</Button>
				</div>
			</div>
		</form>
	</Card>
	
	<!-- Bulk Actions -->
	{#if selectedProducts.size > 0}
		<Card class="p-4 mb-6 bg-brand-50 border-brand-200">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-brand-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						<p class="font-medium text-brand-900">{selectedProducts.size} products selected</p>
					</div>
					<select
						value={bulkAction}
						onchange={(e) => bulkAction = e.currentTarget.value}
						class="px-3 py-1 border border-brand-300 rounded-md text-sm bg-white"
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
						{#if isLoading}
							<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
							</svg>
							Updating...
						{:else}
							Apply Action
						{/if}
					</Button>
					<Button size="sm" variant="ghost" onclick={() => selectedProducts = new Set()} disabled={isLoading}>
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
					<tr class="border-b bg-neutral-50">
						<th class="text-left py-3 px-4 w-8">
							<input
								type="checkbox"
								checked={selectedProducts.size === data.products.length && data.products.length > 0}
								onchange={toggleSelectAll}
								class="rounded border-neutral-300"
							/>
						</th>
						<th class="text-left py-3 px-4">
							<button onclick={() => handleSort('name')} class="flex items-center hover:text-brand-600">
								Product
								{#if sortBy === 'name'}
									<svg class="w-4 h-4 ml-1 {sortOrder === 'asc' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								{/if}
							</button>
						</th>
						<th class="text-left py-3 px-4">
							<button onclick={() => handleSort('sku')} class="flex items-center hover:text-brand-600">
								SKU
								{#if sortBy === 'sku'}
									<svg class="w-4 h-4 ml-1 {sortOrder === 'asc' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								{/if}
							</button>
						</th>
						<th class="text-left py-3 px-4">
							<button onclick={() => handleSort('price')} class="flex items-center hover:text-brand-600">
								Price
								{#if sortBy === 'price'}
									<svg class="w-4 h-4 ml-1 {sortOrder === 'asc' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								{/if}
							</button>
						</th>
						<th class="text-left py-3 px-4">Categories</th>
						<th class="text-left py-3 px-4">
							<button onclick={() => handleSort('status')} class="flex items-center hover:text-brand-600">
								Status & Actions
								{#if sortBy === 'status'}
									<svg class="w-4 h-4 ml-1 {sortOrder === 'asc' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								{/if}
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each data.products as product (product)}
						<tr class="border-b hover:bg-neutral-50">
							<td class="py-3 px-4">
								<input
									type="checkbox"
									checked={selectedProducts.has(product.id)}
									onchange={() => toggleProductSelection(product.id)}
									class="rounded border-neutral-300"
								/>
							</td>
							<td class="py-3 px-4">
								<div class="flex items-center">
									{#if product.mainImage}
										<img src={product.mainImage} alt={product.name} class="w-12 h-12 rounded object-cover mr-3">
									{:else}
										<div class="w-12 h-12 bg-neutral-200 rounded mr-3 flex items-center justify-center">
											<svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
									{/if}
									<div>
										<p class="font-medium text-neutral-900 truncate max-w-xs">{product.name}</p>
										{#if product.shortDescription}
											<p class="text-sm text-neutral-500 truncate max-w-xs">{product.shortDescription}</p>
										{/if}
									</div>
								</div>
							</td>
							<td class="py-3 px-4 text-neutral-600 font-mono text-sm">
								{product.sku || '-'}
							</td>
							<td class="py-3 px-4 font-medium">
								{product.price.toFixed(2)} zł
							</td>
							<td class="py-3 px-4">
								{#if product.expand?.categories && product.expand.categories.length > 0}
									<div class="flex flex-wrap gap-1">
										{#each product.expand.categories.slice(0, 2) as category (category)}
											<span class="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
												{category.name}
											</span>
										{/each}
										{#if product.expand.categories.length > 2}
											<span class="text-xs text-neutral-500">
												+{product.expand.categories.length - 2} more
											</span>
										{/if}
									</div>
								{:else}
									<span class="text-neutral-400">No categories</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="space-y-2">
									<!-- Current Status Display -->
									<div class="flex items-center">
										{#if product.status === 'active'}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success-dark">
												<svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
												</svg>
												Active
											</span>
										{:else if product.status === 'draft'}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
												<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
												</svg>
												Draft
											</span>
										{:else}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
												<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
												</svg>
												Inactive
											</span>
										{/if}
										{#if isLoading}
											<svg class="w-4 h-4 animate-spin text-neutral-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
											</svg>
										{/if}
									</div>
									
									<!-- Status Change Dropdown -->
									<select
										value={product.status}
										onchange={(e) => updateProductStatus(product.id, e.currentTarget.value)}
										class="w-full text-xs border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50"
										disabled={isLoading}
										title="Change product status"
									>
										<option value="active">✅ Set as Active</option>
										<option value="draft">⚠️ Set as Draft</option>
										<option value="inactive">❌ Set as Inactive</option>
									</select>
								</div>
								
								<!-- Status Description -->
								<div class="mt-1 text-xs text-neutral-500">
									{#if product.status === 'active'}
										Visible to customers
									{:else if product.status === 'draft'}
										Hidden, needs review
									{:else}
										Disabled and hidden
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			
			{#if data.products.length === 0}
				<div class="text-center py-8 text-neutral-500">
					{data.filters.search || data.filters.status || data.filters.category 
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
					onclick={() => goToPage(data.pagination.currentPage - 1)}
					disabled={data.pagination.currentPage <= 1}
					variant="ghost"
					size="sm"
				>
					Previous
				</Button>
				
				{#each Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
					const start = Math.max(1, data.pagination.currentPage - 2);
					return start + i;
				}) as pageNum}
					{#if pageNum <= data.pagination.totalPages}
						<Button
							onclick={() => goToPage(pageNum)}
							variant={pageNum === data.pagination.currentPage ? 'primary' : 'ghost'}
							size="sm"
						>
							{pageNum}
						</Button>
					{/if}
				{/each}
				
				<Button
					onclick={() => goToPage(data.pagination.currentPage + 1)}
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
{#if showBulkConfirm}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<Card class="max-w-md w-full">
			<div class="p-6">
				<h3 class="text-lg font-semibold mb-4">Confirm Bulk Action</h3>
				<p class="text-neutral-600 mb-6">
					Are you sure you want to set {selectedProducts.size} selected products to "{bulkAction}" status?
				</p>
				<div class="flex justify-end space-x-3">
					<Button variant="ghost" onclick={() => { showBulkConfirm = false; bulkAction = ''; }}>
						Cancel
					</Button>
					<Button onclick={() => bulkUpdateStatus(bulkAction)} disabled={isLoading}>
						{isLoading ? 'Updating...' : 'Confirm'}
					</Button>
				</div>
			</div>
		</Card>
	</div>
{/if}

<!-- Toast Notification -->
{#if showToast}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<Card class="max-w-md w-full">
			<div class="p-6">
				<h3 class="text-lg font-semibold mb-4">
					{#if toastType === 'success'}
						✅ Success
					{:else if toastType === 'error'}
						❌ Error
					{:else}
						ℹ️ Info
					{/if}
				</h3>
				<p class="text-neutral-600 mb-6">
					{toastMessage}
				</p>
				<div class="flex justify-end space-x-3">
					<Button variant="ghost" onclick={() => { showToast = false; toastMessage = ''; toastType = 'success'; }}>
						Close
					</Button>
				</div>
			</div>
		</Card>
	</div>
{/if} 

