<script lang="ts">
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDate } from '$lib/utils/date';

	// Check if user is admin
	$effect(() => {
		if (!userStore.current || !userStore.current.isAdmin) {
			goto('/');
		}
	});

	// State
	let loading = $state(true);
	let customers = $state<any[]>([]);
	let error = $state<string | null>(null);
	let searchTerm = $state('');
	let currentPage = $state(1);
	let pageSize = $state(20);
	let totalCustomers = $state(0);

	// Fetch customers on mount
	onMount(() => {
		fetchCustomers();
	});

	// Fetch customers
	async function fetchCustomers() {
		try {
			loading = true;
			error = null;

			// Auth is handled via cookies automatically
			const headers: Record<string, string> = {};

			const params = new URLSearchParams({
				page: currentPage.toString(),
				limit: pageSize.toString(),
				...(searchTerm && { search: searchTerm })
			});

			const response = await fetch(`/api/admin/customers?${params}`, { headers });

			if (!response.ok) {
				throw new Error('Failed to fetch customers');
			}

			const data = await response.json();
			customers = data.customers || [];
			totalCustomers = data.total || 0;
		} catch (err) {
			console.error('Error fetching customers:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch customers';
			customers = [];
		} finally {
			loading = false;
		}
	}

	// Handle search
	function handleSearch() {
		currentPage = 1;
		fetchCustomers();
	}

	// Calculate pagination
	const totalPages = $derived(Math.ceil(totalCustomers / pageSize));
	const hasNextPage = $derived(currentPage < totalPages);
	const hasPrevPage = $derived(currentPage > 1);

	// Handle pagination
	function goToPage(page: number) {
		currentPage = page;
		fetchCustomers();
	}
</script>

<svelte:head>
	<title>Customers - Admin | FixTar</title>
	<meta name="description" content="Manage customers" />
</svelte:head>

<div class="mx-auto max-w-screen-2xl px-6 py-8 sm:px-8 lg:px-12">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-neutral-900">Customers</h1>
		<p class="mt-2 text-neutral-600">Manage your customer base</p>
		{#if error}
			<div class="bg-danger/5 border-danger/10 mt-4 rounded-md border p-4">
				<p class="text-danger">Error: {error}</p>
				<Button onclick={fetchCustomers} variant="secondary" class="mt-2">Retry</Button>
			</div>
		{/if}
	</div>

	<!-- Search and Controls -->
	<Card class="mb-6">
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="max-w-md flex-1">
				<label for="search" class="sr-only">Search customers</label>
				<div class="relative">
					<input
						id="search"
						type="text"
						class="focus:ring-brand-500 focus:border-brand-500 w-full rounded-md border border-neutral-300 px-4 py-2 shadow-sm focus:outline-none"
						placeholder="Search customers by name or email..."
						bind:value={searchTerm}
						onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button
						class="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-600"
						onclick={handleSearch}
						aria-label="Search"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<Button onclick={fetchCustomers} variant="secondary">
					{#if loading}
						<LoadingSpinner visible={true} />
						<span class="ml-2">Refreshing...</span>
					{:else}
						Refresh
					{/if}
				</Button>
			</div>
		</div>
	</Card>

	<!-- Customers Table -->
	<Card>
		{#if loading && customers.length === 0}
			<div class="flex items-center justify-center py-12">
				<LoadingSpinner visible={true} />
			</div>
		{:else if customers.length === 0}
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-neutral-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-neutral-900">No customers found</h3>
				<p class="mt-1 text-sm text-neutral-500">
					{searchTerm ? 'Try adjusting your search criteria.' : 'No customers have registered yet.'}
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-neutral-200">
					<thead class="bg-neutral-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase"
							>
								Customer
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase"
							>
								Email
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase"
							>
								Registration Date
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase"
							>
								Status
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase"
							>
								Orders
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-medium tracking-wider text-neutral-500 uppercase"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-200 bg-white">
						{#each customers as customer (customer.id)}
							<tr class="hover:bg-neutral-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="h-10 w-10 shrink-0">
											<div
												class="bg-brand-100 flex h-10 w-10 items-center justify-center rounded-full"
											>
												<span class="text-brand-600 text-sm font-medium">
													{customer.name
														? customer.name.charAt(0).toUpperCase()
														: customer.email.charAt(0).toUpperCase()}
												</span>
											</div>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-neutral-900">
												{customer.name || 'No name provided'}
											</div>
											<div class="text-sm text-neutral-500">
												Customer ID: {customer.id}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-neutral-900">{customer.email}</div>
									{#if customer.emailVisibility === false}
										<div class="text-brand-500 text-xs">Email hidden</div>
									{/if}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-neutral-500">
									{formatDate(customer.created)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {customer.verified
											? 'bg-success/10 text-success-dark'
											: 'bg-warning/10 text-warning-dark'}"
									>
										{customer.verified ? 'Verified' : 'Unverified'}
									</span>
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-neutral-500">
									{customer.orderCount || 0} orders
								</td>
								<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
									<Button href="/admin/customers/{customer.id}" variant="ghost" size="sm">
										View Details
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="border-t border-neutral-200 bg-white px-4 py-3 sm:px-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-1 justify-between sm:hidden">
							<button
								class="relative inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
								onclick={() => goToPage(currentPage - 1)}
								disabled={!hasPrevPage}
							>
								Previous
							</button>
							<button
								class="relative ml-3 inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
								onclick={() => goToPage(currentPage + 1)}
								disabled={!hasNextPage}
							>
								Next
							</button>
						</div>
						<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
							<div>
								<p class="text-sm text-neutral-700">
									Showing <span class="font-medium">{(currentPage - 1) * pageSize + 1}</span>
									to
									<span class="font-medium">{Math.min(currentPage * pageSize, totalCustomers)}</span
									>
									of <span class="font-medium">{totalCustomers}</span> results
								</p>
							</div>
							<div>
								<nav class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
									<button
										class="relative inline-flex items-center rounded-l-md border border-neutral-300 bg-white px-2 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
										onclick={() => goToPage(currentPage - 1)}
										disabled={!hasPrevPage}
										aria-label="Previous page"
									>
										<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>

									{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + Math.max(1, currentPage - 2)).filter((p) => p <= totalPages) as pageNum (pageNum)}
										<button
											class="relative inline-flex items-center border px-4 py-2 text-sm font-medium {pageNum ===
											currentPage
												? 'bg-brand-50 border-brand-500 text-brand-600 z-10'
												: 'border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-50'}"
											onclick={() => goToPage(pageNum)}
										>
											{pageNum}
										</button>
									{/each}

									<button
										class="relative inline-flex items-center rounded-r-md border border-neutral-300 bg-white px-2 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
										onclick={() => goToPage(currentPage + 1)}
										disabled={!hasNextPage}
										aria-label="Next page"
									>
										<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
								</nav>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</Card>
</div>
