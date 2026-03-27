<script lang="ts">
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDate } from '$lib/utils/date';
	import { MagnifyingGlassIcon, UsersIcon, CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';

	// CheckIcon if user is admin
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

<div class="ft-container ft-section-sm">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-[--ft-text-strong]">Customers</h1>
		<p class="mt-2 text-[--ft-text-muted]">Manage your customer base</p>
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
						class="focus:ring-[--ft-accent] focus:border-[--ft-accent] w-full rounded-md border border-[--ft-line] px-4 py-2 shadow-sm focus:outline-none"
						placeholder="Search customers by name or email..."
						bind:value={searchTerm}
						onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button
						class="absolute inset-y-0 right-0 flex items-center px-3 text-[--ft-text-muted] hover:text-[--ft-text-muted]"
						onclick={handleSearch}
						aria-label="Search"
					>
						<MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
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
				<UsersIcon class="mx-auto h-12 w-12 text-[--ft-text-muted]" aria-hidden="true" />
				<h3 class="mt-2 text-sm font-medium text-[--ft-text-strong]">No customers found</h3>
				<p class="mt-1 text-sm text-[--ft-text-muted]">
					{searchTerm ? 'Try adjusting your search criteria.' : 'No customers have registered yet.'}
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-[--ft-line]">
					<thead class="bg-[--ft-frost]">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[--ft-text-muted] uppercase"
							>
								Customer
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[--ft-text-muted] uppercase"
							>
								Email
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[--ft-text-muted] uppercase"
							>
								Registration Date
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[--ft-text-muted] uppercase"
							>
								Status
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[--ft-text-muted] uppercase"
							>
								Orders
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-medium tracking-wider text-[--ft-text-muted] uppercase"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[--ft-line] bg-[--ft-surface]">
						{#each customers as customer (customer.id)}
							<tr class="hover:bg-[--ft-frost]">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="h-10 w-10 shrink-0">
											<div
												class="bg-[--ft-frost] flex h-10 w-10 items-center justify-center rounded-full"
											>
												<span class="text-[--ft-accent] text-sm font-medium">
													{customer.name
														? customer.name.charAt(0).toUpperCase()
														: customer.email.charAt(0).toUpperCase()}
												</span>
											</div>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-[--ft-text-strong]">
												{customer.name || 'No name provided'}
											</div>
											<div class="text-sm text-[--ft-text-muted]">
												Customer ID: {customer.id}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-[--ft-text-strong]">{customer.email}</div>
									{#if customer.emailVisibility === false}
										<div class="text-[--ft-accent] text-xs">Email hidden</div>
									{/if}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-[--ft-text-muted]">
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
								<td class="px-6 py-4 text-sm whitespace-nowrap text-[--ft-text-muted]">
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
				<div class="border-t border-[--ft-line] bg-[--ft-surface] px-4 py-3 sm:px-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-1 justify-between sm:hidden">
							<button
								class="relative inline-flex items-center rounded-md border border-[--ft-line] bg-[--ft-surface] px-4 py-2 text-sm font-medium text-[--ft-text] hover:bg-[--ft-frost] disabled:cursor-not-allowed disabled:opacity-50"
								onclick={() => goToPage(currentPage - 1)}
								disabled={!hasPrevPage}
							>
								Previous
							</button>
							<button
								class="relative ml-3 inline-flex items-center rounded-md border border-[--ft-line] bg-[--ft-surface] px-4 py-2 text-sm font-medium text-[--ft-text] hover:bg-[--ft-frost] disabled:cursor-not-allowed disabled:opacity-50"
								onclick={() => goToPage(currentPage + 1)}
								disabled={!hasNextPage}
							>
								Next
							</button>
						</div>
						<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
							<div>
								<p class="text-sm text-[--ft-text]">
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
										class="relative inline-flex items-center rounded-l-md border border-[--ft-line] bg-[--ft-surface] px-2 py-2 text-sm font-medium text-[--ft-text-muted] hover:bg-[--ft-frost] disabled:cursor-not-allowed disabled:opacity-50"
										onclick={() => goToPage(currentPage - 1)}
										disabled={!hasPrevPage}
										aria-label="Previous page"
									>
										<CaretLeftIcon class="h-5 w-5" aria-hidden="true" />
									</button>

									{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + Math.max(1, currentPage - 2)).filter((p) => p <= totalPages) as pageNum (pageNum)}
										<button
											class="relative inline-flex items-center border px-4 py-2 text-sm font-medium {pageNum ===
											currentPage
												? 'bg-[--ft-frost] border-[--ft-accent] text-[--ft-accent] z-10'
												: 'border-[--ft-line] bg-[--ft-surface] text-[--ft-text-muted] hover:bg-[--ft-frost]'}"
											onclick={() => goToPage(pageNum)}
										>
											{pageNum}
										</button>
									{/each}

									<button
										class="relative inline-flex items-center rounded-r-md border border-[--ft-line] bg-[--ft-surface] px-2 py-2 text-sm font-medium text-[--ft-text-muted] hover:bg-[--ft-frost] disabled:cursor-not-allowed disabled:opacity-50"
										onclick={() => goToPage(currentPage + 1)}
										disabled={!hasNextPage}
										aria-label="Next page"
									>
										<CaretRightIcon class="h-5 w-5" aria-hidden="true" />
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
