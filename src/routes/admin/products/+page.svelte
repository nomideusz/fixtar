<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { userStore } from '$lib/stores';
	import {
		LinkIcon,
		WarningCircleIcon,
		CheckCircleIcon,
		ImageSquareIcon,
		CheckIcon,
		ArrowUpIcon,
		ArrowDownIcon,
		StarIcon,
		XIcon
	} from 'phosphor-svelte';
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

	interface ImageItem {
		src: string;
		isMain: boolean;
	}

	interface ImageModalProduct {
		id: string;
		name: string;
		mainImage?: string;
		gallery?: string[];
	}

	let { data }: Props = $props();

	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) goto('/');
	});

	// --- Local Filter State ---
	let searchQuery = $state('');
	let statusFilter = $state('');
	let categoryFilter = $state('');
	let sortBy = $state('created');
	let sortOrder = $state('desc');

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

	// --- Image Modal State ---
	let showImagesModal = $state(false);
	let imageModalProduct = $state<ImageModalProduct | null>(null);
	let imageModalSaving = $state(false);
	let imageOrder = $state<string[]>([]); // first item = main
	let imageOrderInitial = $state<string[]>([]);

	// --- Toast (inline, not modal) ---
	let toast = $state<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | null = null;

	function showNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
		toast = { message, type };
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => (toast = null), 3500);
	}

	// --- Derived ---
	const allSelected = $derived(
		selectedProducts.size === data.products.length && data.products.length > 0
	);

	const hasFilters = $derived(
		!!data.filters.search || !!data.filters.status || !!data.filters.category
	);

	const imageModalItems = $derived.by<ImageItem[]>(() => {
		if (!imageModalProduct) return [];
		return imageOrder.map((src, i) => ({ src, isMain: i === 0 }));
	});

	const imageOrderDirty = $derived(
		imageOrder.length !== imageOrderInitial.length ||
			imageOrder.some((src, i) => src !== imageOrderInitial[i])
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

	// --- Image Modal ---
	function buildOrder(p: ImageModalProduct): string[] {
		const order: string[] = [];
		if (p.mainImage) order.push(p.mainImage);
		for (const img of p.gallery || []) {
			if (img && !order.includes(img)) order.push(img);
		}
		return order;
	}

	function openImagesModal(product: ImageModalProduct) {
		imageModalProduct = {
			id: product.id,
			name: product.name,
			mainImage: product.mainImage,
			gallery: [...(product.gallery || [])]
		};
		const order = buildOrder(imageModalProduct);
		imageOrder = order;
		imageOrderInitial = [...order];
		showImagesModal = true;
	}

	function closeImagesModal() {
		if (imageModalSaving) return;
		showImagesModal = false;
		imageModalProduct = null;
		imageOrder = [];
		imageOrderInitial = [];
	}

	function setAsMain(index: number) {
		if (index <= 0 || index >= imageOrder.length) return;
		const next = [...imageOrder];
		const [item] = next.splice(index, 1);
		next.unshift(item);
		imageOrder = next;
	}

	function moveImage(index: number, direction: -1 | 1) {
		const target = index + direction;
		if (target < 0 || target >= imageOrder.length) return;
		const next = [...imageOrder];
		[next[index], next[target]] = [next[target], next[index]];
		imageOrder = next;
	}

	async function saveImageOrder() {
		if (!imageModalProduct || !imageOrder.length || imageModalSaving) return;
		imageModalSaving = true;
		try {
			const [mainImage, ...gallery] = imageOrder;
			const response = await fetch('/api/admin/products/images', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productId: imageModalProduct.id,
					mainImage,
					gallery
				})
			});
			const result = await response.json();
			if (!response.ok || !result.success) {
				showNotification(result.error || 'Nie udało się zapisać zdjęć', 'error');
				return;
			}
			imageOrderInitial = [...imageOrder];
			imageModalProduct = {
				...imageModalProduct,
				mainImage,
				gallery
			};
			await invalidateAll();
			showNotification('Zapisano kolejność zdjęć');
		} catch (error) {
			showNotification(`Błąd: ${error}`, 'error');
		} finally {
			imageModalSaving = false;
		}
	}

	function resetImageOrder() {
		imageOrder = [...imageOrderInitial];
	}

	// --- Featured API ---
	async function toggleFeatured(product: any) {
		if (isLoading) return;
		const nextFeatured = !product.featured;
		isLoading = true;
		try {
			const response = await fetch('/api/admin/products/featured', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId: product.id, featured: nextFeatured })
			});
			const result = await response.json();
			if (!response.ok || !result.success) {
				showNotification(result.error || 'Nie udało się zmienić statusu', 'error');
				return;
			}
			await invalidateAll();
			showNotification(nextFeatured ? 'Dodano do polecanych' : 'Usunięto z polecanych');
		} catch (error) {
			showNotification(`Błąd: ${error}`, 'error');
		} finally {
			isLoading = false;
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
					showNotification(`Zaktualizowano ${result.updated} produktów — ${newStatus}`);
				}
			} else {
				showNotification(`Błąd: ${result.error}`, 'error');
			}
		} catch (error) {
			showNotification(`Błąd: ${error}`, 'error');
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
	<div class="mb-8 flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="admin-kicker">admin</p>
			<h1 class="mt-1 text-2xl font-normal tracking-tight text-[--ft-text-strong]">Products</h1>
			<p class="mt-2 text-sm text-[--ft-text-muted]">
				{data.pagination.totalItems} products · change status, filter, manage images
			</p>
		</div>
		<div class="flex gap-2">
			<Button href="/admin/baselinker" variant="secondary">
				<LinkIcon class="mr-2 h-4 w-4" aria-hidden="true" />
				BaseLinker
			</Button>
		</div>
	</div>

	<!-- Error Banner -->
	{#if data.error}
		<div
			class="mb-6 flex items-center gap-3 rounded-md border p-4"
			style="border-color: color-mix(in srgb, var(--color-danger) 24%, transparent); background: color-mix(in srgb, var(--color-danger) 6%, white);"
		>
			<WarningCircleIcon class="h-5 w-5 shrink-0" style="color: var(--color-danger);" aria-hidden="true" />
			<p class="text-sm" style="color: var(--color-danger);">{data.error}</p>
		</div>
	{/if}

	<!-- Status Overview -->
	<StatusOverviewCards statusCounts={data.statusCounts} onFilterByStatus={filterByStatus} />

	<!-- Filters -->
	<Card class="mb-6 p-6">
		<form onsubmit={handleSearchSubmit} class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px_220px_auto]">
			<div>
				<label for="search" class="mb-1 block text-sm font-medium text-[--ft-text]">Search</label>
				<Input
					id="search"
					type="search"
					placeholder="Name, SKU…"
					value={searchQuery}
					oninput={(e) => (searchQuery = e.currentTarget.value)}
				/>
			</div>

			<div>
				<label for="status" class="mb-1 block text-sm font-medium text-[--ft-text]">Status</label>
				<select
					id="status"
					value={statusFilter}
					onchange={(e) => {
						statusFilter = e.currentTarget.value;
						navigateWithFilters();
					}}
					class="admin-select"
				>
					<option value="">All statuses</option>
					<option value="active">Active (visible)</option>
					<option value="draft">Draft (hidden)</option>
					<option value="inactive">Inactive (disabled)</option>
				</select>
			</div>

			<div>
				<label for="category" class="mb-1 block text-sm font-medium text-[--ft-text]">Category</label>
				<select
					id="category"
					value={categoryFilter}
					onchange={(e) => {
						categoryFilter = e.currentTarget.value;
						navigateWithFilters();
					}}
					class="admin-select"
				>
					<option value="">All categories</option>
					{#each data.categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-end gap-2">
				<Button type="submit" size="sm" disabled={isLoading}>Search</Button>
				<Button type="button" variant="ghost" size="sm" onclick={clearFilters} disabled={isLoading}>
					Clear
				</Button>
			</div>
		</form>
	</Card>

	<!-- Bulk Actions Bar -->
	{#if selectedProducts.size > 0}
		<Card class="mb-6 p-4" style="background: var(--ft-frost);">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="flex items-center gap-4">
					<div class="flex items-center">
						<CheckCircleIcon class="mr-2 h-5 w-5 text-[--ft-text-strong]" aria-hidden="true" />
						<p class="font-medium text-[--ft-text-strong]">
							{selectedProducts.size} selected
						</p>
					</div>
					<select
						value={bulkAction}
						onchange={(e) => (bulkAction = e.currentTarget.value)}
						class="admin-select admin-select--sm"
						disabled={isLoading}
					>
						<option value="">Choose action…</option>
						<option value="active">Set as Active</option>
						<option value="draft">Set as Draft</option>
						<option value="inactive">Set as Inactive</option>
					</select>
				</div>
				<div class="flex items-center gap-2">
					<Button size="sm" onclick={handleBulkAction} disabled={!bulkAction || isLoading}>
						{isLoading ? 'Updating…' : 'Apply'}
					</Button>
					<Button size="sm" variant="ghost" onclick={() => selectedProducts.clear()} disabled={isLoading}>
						Clear
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
					<tr class="border-b border-[--ft-line] bg-[--ft-frost]">
						<th class="w-8 px-4 py-3 text-left">
							<input
								type="checkbox"
								checked={allSelected}
								onchange={toggleSelectAll}
								class="rounded border-[--ft-line]"
							/>
						</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader label="Product" field="name" currentField={sortBy} currentOrder={sortOrder} onSort={handleSort} />
						</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader label="SKU" field="sku" currentField={sortBy} currentOrder={sortOrder} onSort={handleSort} />
						</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader label="Price" field="price" currentField={sortBy} currentOrder={sortOrder} onSort={handleSort} />
						</th>
						<th class="px-4 py-3 text-left">Categories</th>
						<th class="px-4 py-3 text-left">
							<SortableHeader label="Status" field="status" currentField={sortBy} currentOrder={sortOrder} onSort={handleSort} />
						</th>
					</tr>
				</thead>
				<tbody>
					{#each data.products as product (product.id)}
						<ProductRow
							{product}
							selected={selectedProducts.has(product.id)}
							{isLoading}
							onToggleSelect={() => toggleProductSelection(product.id)}
							onStatusChange={(id, status) => updateStatus([id], status)}
							onManageImages={openImagesModal}
							onToggleFeatured={toggleFeatured}
						/>
					{/each}
				</tbody>
			</table>

			{#if data.products.length === 0}
				<div class="py-8 text-center text-[--ft-text-muted]">
					{hasFilters ? 'No products match your filters.' : 'No products in catalog.'}
				</div>
			{/if}
		</div>
	</Card>

	<!-- Pagination -->
	{#if data.pagination.totalPages > 1}
		<div class="mt-6 flex justify-center">
			<nav class="flex items-center gap-2">
				<Button
					onclick={() => navigateWithFilters({ page: data.pagination.currentPage - 1 })}
					disabled={data.pagination.currentPage <= 1}
					variant="ghost"
					size="sm"
				>
					Previous
				</Button>

				{#each Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => Math.max(1, data.pagination.currentPage - 2) + i).filter((p) => p <= data.pagination.totalPages) as pageNum (pageNum)}
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
		Set {selectedProducts.size} selected products to "{bulkAction}" status?
	</p>
	<div class="flex justify-end gap-3">
		<Button variant="ghost" onclick={cancelBulkAction}>Cancel</Button>
		<Button onclick={confirmBulkAction} disabled={isLoading}>
			{isLoading ? 'Updating…' : 'Confirm'}
		</Button>
	</div>
</Modal>

<!-- Product Images Modal -->
<Modal
	open={showImagesModal}
	onClose={closeImagesModal}
	title={imageModalProduct ? `Zdjęcia — ${imageModalProduct.name}` : 'Zdjęcia produktu'}
	size="xl"
>
	{#if imageModalProduct}
		<div class="space-y-4">
			<p class="text-sm text-[--ft-text-muted]">
				Pierwsze zdjęcie jest zdjęciem głównym. Zmień kolejność strzałkami lub ustaw inne jako
				główne.
			</p>

			{#if imageModalItems.length > 0}
				<ul class="image-list">
					{#each imageModalItems as item, i (item.src)}
						<li class="image-row" class:is-main={item.isMain}>
							<div class="image-thumb">
								<img src={item.src} alt="" />
							</div>

							<div class="image-meta">
								{#if item.isMain}
									<span class="main-badge">
										<StarIcon size={12} weight="fill" aria-hidden="true" />
										Główne
									</span>
								{:else}
									<span class="gallery-label">#{i + 1} · Galeria</span>
								{/if}
								<span class="image-path" title={item.src}>{item.src}</span>
							</div>

							<div class="image-actions">
								{#if !item.isMain}
									<button
										type="button"
										class="icon-btn"
										onclick={() => setAsMain(i)}
										disabled={imageModalSaving}
										title="Ustaw jako główne"
										aria-label="Ustaw jako główne"
									>
										<StarIcon size={14} aria-hidden="true" />
									</button>
								{/if}
								<button
									type="button"
									class="icon-btn"
									onclick={() => moveImage(i, -1)}
									disabled={i === 0 || imageModalSaving}
									title="W górę"
									aria-label="W górę"
								>
									<ArrowUpIcon size={14} aria-hidden="true" />
								</button>
								<button
									type="button"
									class="icon-btn"
									onclick={() => moveImage(i, 1)}
									disabled={i === imageModalItems.length - 1 || imageModalSaving}
									title="W dół"
									aria-label="W dół"
								>
									<ArrowDownIcon size={14} aria-hidden="true" />
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<div
					class="rounded-md border border-dashed border-[--ft-line] bg-[--ft-surface] p-8 text-center"
				>
					<ImageSquareIcon class="mx-auto mb-3 h-8 w-8 text-[--ft-text-faint]" aria-hidden="true" />
					<p class="text-sm text-[--ft-text-muted]">Ten produkt nie ma jeszcze zdjęć.</p>
				</div>
			{/if}

			<div class="flex items-center justify-between gap-3 pt-2">
				<div class="text-xs text-[--ft-text-muted]">
					{#if imageOrderDirty}
						Niezapisane zmiany
					{:else}
						Brak zmian
					{/if}
				</div>
				<div class="flex gap-2">
					<Button
						variant="ghost"
						size="sm"
						onclick={resetImageOrder}
						disabled={!imageOrderDirty || imageModalSaving}
					>
						Cofnij
					</Button>
					<Button variant="ghost" size="sm" onclick={closeImagesModal} disabled={imageModalSaving}>
						Zamknij
					</Button>
					<Button
						size="sm"
						onclick={saveImageOrder}
						disabled={!imageOrderDirty || imageModalSaving || imageModalItems.length === 0}
					>
						{imageModalSaving ? 'Zapisywanie…' : 'Zapisz'}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</Modal>

<!-- Inline Toast -->
{#if toast}
	<div class="toast toast--{toast.type}" role="status" aria-live="polite">
		{#if toast.type === 'success'}
			<CheckIcon size={16} weight="bold" aria-hidden="true" />
		{:else if toast.type === 'error'}
			<WarningCircleIcon size={16} weight="fill" aria-hidden="true" />
		{:else}
			<CheckCircleIcon size={16} aria-hidden="true" />
		{/if}
		<span>{toast.message}</span>
		<button type="button" class="toast-close" onclick={() => (toast = null)} aria-label="Zamknij">
			<XIcon size={12} aria-hidden="true" />
		</button>
	</div>
{/if}

<style>
	.admin-kicker {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ft-text-muted);
	}

	/* Selects shared across admin filters */
	:global(.admin-select) {
		width: 100%;
		padding: 10px 32px 10px 12px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text);
		font-family: var(--font-sans);
		font-size: 0.875rem;
		min-height: 40px;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7276'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 10px center;
		background-size: 16px;
		transition: border-color var(--dur-fast) ease;
	}

	:global(.admin-select:focus) {
		outline: none;
		border-color: var(--ft-text-strong);
	}

	:global(.admin-select--sm) {
		min-height: 36px;
		padding: 6px 28px 6px 10px;
		font-size: 0.8125rem;
	}

	/* ── Image Modal list ── */
	.image-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.image-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		transition: border-color var(--dur-fast) ease;
	}

	.image-row:hover {
		border-color: var(--ft-text-muted);
	}

	.image-row.is-main {
		border-color: var(--ft-text-strong);
		background: var(--ft-frost);
	}

	.image-thumb {
		flex-shrink: 0;
		width: 56px;
		height: 56px;
		border-radius: var(--radius-sm);
		overflow: hidden;
		background: var(--ft-frost);
	}

	.image-thumb img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 4px;
	}

	.image-meta {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.main-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		width: fit-content;
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		background: var(--ft-accent);
		color: var(--ft-cta-text);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.gallery-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--ft-text-muted);
	}

	.image-path {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--ft-text-faint);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.image-actions {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text);
		cursor: pointer;
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.icon-btn:hover:not(:disabled) {
		border-color: var(--ft-text-strong);
		background: var(--ft-frost);
	}

	.icon-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* ── Toast ── */
	.toast {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 100;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		padding-right: 10px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text);
		font-size: 0.875rem;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.04),
			0 8px 24px rgba(0, 0, 0, 0.08);
		animation: toastIn 240ms var(--ease-out);
	}

	.toast--success {
		border-left: 3px solid var(--color-success);
	}
	.toast--success :global(svg) {
		color: var(--color-success);
	}

	.toast--error {
		border-left: 3px solid var(--color-danger);
	}
	.toast--error :global(svg) {
		color: var(--color-danger);
	}

	.toast--info :global(svg) {
		color: var(--ft-text-muted);
	}

	.toast-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border: none;
		background: transparent;
		color: var(--ft-text-faint);
		border-radius: var(--radius-sm);
		cursor: pointer;
		margin-left: 4px;
	}

	.toast-close:hover {
		background: var(--ft-frost);
		color: var(--ft-text);
	}

	@keyframes toastIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toast {
			animation: none;
		}
	}
</style>
