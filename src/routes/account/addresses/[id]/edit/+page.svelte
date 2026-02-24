<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	
	const { data, form } = $props<{ data: PageData; form?: any }>();
	
	let isSubmitting = $state(false);
	
	// Handle form results
	$effect(() => {
		if (form?.success) {
			notifications.success('Address updated successfully');
			goto('/account/addresses');
		} else if (form?.message) {
			notifications.error(form.message);
		}
	});
	
	// Get address data from server
	let address = $derived(data.address);
</script>

<svelte:head>
	<title>Edit Address - FixTar</title>
	<meta name="description" content="Edit your shipping address" />
</svelte:head>

<div>
	<div class="flex items-center gap-4 mb-6">
		<Button href="/account/addresses" variant="ghost" size="sm">
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Addresses
		</Button>
		<h1 class="text-2xl font-bold text-neutral-900">Edit Address</h1>
	</div>
	
	{#if address}
		<div class="max-w-2xl">
			<Card>
				<form 
					method="POST" 
					action="?/updateAddress"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
				>
					<input type="hidden" name="id" value={address.id} />
					
					<div class="space-y-6">
						<div>
							<label for="type" class="block text-sm font-medium text-neutral-700 mb-2">
								Address Type
							</label>
							<select 
								id="type"
								name="type" 
								required
								value={address.type || 'Home'}
								class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
							>
								<option value="Home">Home</option>
								<option value="Work">Work</option>
								<option value="Other">Other</option>
							</select>
						</div>
						
						<div>
							<label for="street" class="block text-sm font-medium text-neutral-700 mb-2">
								Street Address *
							</label>
							<input 
								type="text" 
								id="street"
								name="street" 
								required
								value={address.street || ''}
								placeholder="123 Main Street"
								class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
							/>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="city" class="block text-sm font-medium text-neutral-700 mb-2">
									City *
								</label>
								<input 
									type="text" 
									id="city"
									name="city" 
									required
									value={address.city || ''}
									placeholder="Warsaw"
									class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
								/>
							</div>
							
							<div>
								<label for="postalCode" class="block text-sm font-medium text-neutral-700 mb-2">
									Postal Code *
								</label>
								<input 
									type="text" 
									id="postalCode"
									name="postalCode" 
									required
									value={address.postalCode || ''}
									placeholder="00-001"
									class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
								/>
							</div>
						</div>
						
						<div>
							<label for="country" class="block text-sm font-medium text-neutral-700 mb-2">
								Country *
							</label>
							<select 
								id="country"
								name="country" 
								required
								value={address.country || ''}
								class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
							>
								<option value="">Select Country</option>
								<option value="Poland">Poland</option>
								<option value="Germany">Germany</option>
								<option value="Czech Republic">Czech Republic</option>
								<option value="Slovakia">Slovakia</option>
								<option value="Lithuania">Lithuania</option>
								<option value="Latvia">Latvia</option>
								<option value="Estonia">Estonia</option>
								<option value="Other">Other</option>
							</select>
						</div>
						
						<div class="flex items-center">
							<input 
								type="checkbox" 
								id="default"
								name="default"
								value="true"
								checked={address.default === true}
								class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded"
							/>
							<label for="default" class="ml-2 block text-sm text-neutral-700">
								Set as default address
							</label>
						</div>
					</div>
					
					<div class="flex gap-3 pt-6 mt-6 border-t border-neutral-200">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Updating Address...' : 'Update Address'}
						</Button>
						<Button type="button" variant="secondary" href="/account/addresses">
							Cancel
						</Button>
					</div>
				</form>
			</Card>
		</div>
	{:else}
		<Card>
			<div class="text-center py-12">
				<svg class="w-16 h-16 mx-auto mb-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<h3 class="text-lg font-medium text-neutral-900 mb-2">Address not found</h3>
				<p class="text-neutral-600 mb-6">The address you're trying to edit doesn't exist.</p>
				<Button href="/account/addresses">Back to Addresses</Button>
			</div>
		</Card>
	{/if}
</div> 