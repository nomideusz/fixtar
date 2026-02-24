<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	
	// Get real data from server
	const { data, form } = $props<{ data: PageData; form?: ActionData }>();
	
	// Use real addresses data from server
	let addresses = $derived(data.addresses || []);
	let isSubmitting = $state(false);
	const hasError = $derived(!!data.error);
	const errorMessage = $derived(data.error || '');
	
	// Handle form results
	$effect(() => {
		if (form?.success) {
			notifications.success('Action completed successfully');
			// Reload the page to get fresh data
			window.location.reload();
		} else if (form?.message) {
			notifications.error(form.message);
		}
	});
	
	function handleSetDefault(addressId: string) {
		isSubmitting = true;
		
		const formData = new FormData();
		formData.append('id', addressId);
		
		// Use fetch to call the server action
		fetch('?/setDefaultAddress', {
			method: 'POST',
			body: formData
		}).then(response => {
			if (response.ok) {
				// Update local state immediately for better UX
				addresses = addresses.map((addr: any) => ({
					...addr,
					default: addr.id === addressId
				}));
				notifications.success('Default address updated');
			} else {
				notifications.error('Failed to update default address');
			}
		}).catch(err => {
			console.error('Error setting default address:', err);
			notifications.error('Failed to update default address');
		}).finally(() => {
			isSubmitting = false;
		});
	}
	
	function handleDelete(addressId: string) {
		if (addresses.length === 1) {
			notifications.error('You must have at least one address');
			return;
		}
		
		if (!confirm('Are you sure you want to delete this address?')) {
			return;
		}
		
		// Find the form for this address and submit it
		const deleteForm = document.getElementById(`delete-form-${addressId}`) as HTMLFormElement;
		if (deleteForm) {
			deleteForm.requestSubmit();
		}
	}
</script>

<svelte:head>
	<title>My Addresses - FixTar</title>
	<meta name="description" content="Manage your shipping addresses" />
</svelte:head>

<div>
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold text-neutral-900">My Addresses</h1>
		<Button href="/account/addresses/new">Add New Address</Button>
	</div>
	
	{#if hasError}
		<Card>
			<div class="text-center py-12">
				<svg class="w-16 h-16 mx-auto mb-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<h3 class="text-lg font-medium text-neutral-900 mb-2">Error loading addresses</h3>
				<p class="text-neutral-600 mb-6">{errorMessage}</p>
				<Button onclick={() => window.location.reload()}>Try Again</Button>
			</div>
		</Card>
	{:else if addresses.length === 0}
		<Card>
			<div class="text-center py-12">
				<svg class="w-16 h-16 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<h3 class="text-lg font-medium text-neutral-900 mb-2">No addresses saved</h3>
				<p class="text-neutral-600 mb-6">Add an address to make checkout faster.</p>
				<Button href="/account/addresses/new">Add Your First Address</Button>
			</div>
		</Card>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each addresses as address (address)}
				<Card>
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="font-semibold text-neutral-900 flex items-center gap-2">
								{address.type || 'Address'}
								{#if address.default}
									<span class="px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 rounded-full">
										Default
									</span>
								{/if}
							</h3>
						</div>
						<div class="flex gap-2">
							<Button href="/account/addresses/{address.id}/edit" variant="ghost" size="sm">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
							</Button>
							<button 
								onclick={() => handleDelete(address.id)}
								disabled={isSubmitting}
								class="p-1 text-neutral-400 hover:text-danger transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Delete address"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
							
							<!-- Hidden form for delete action -->
							<form 
								id="delete-form-{address.id}"
								method="POST"
								action="?/removeAddress"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ update }) => {
										isSubmitting = false;
										await update();
									};
								}}
								style="display: none;"
							>
								<input type="hidden" name="id" value={address.id} />
							</form>
						</div>
					</div>
					
					<div class="text-sm text-neutral-600 space-y-1 mb-4">
						<p>{address.street}</p>
						<p>{address.city} {address.postalCode}</p>
						<p>{address.country}</p>
					</div>
					
					{#if !address.default}
						<Button 
							onclick={() => handleSetDefault(address.id)} 
							disabled={isSubmitting}
							variant="secondary" 
							size="sm" 
							fullWidth
						>
							{isSubmitting ? 'Setting...' : 'Set as Default'}
						</Button>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>


