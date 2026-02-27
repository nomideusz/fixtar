<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { notifications } from '$lib/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData } from './$types';

	const { form } = $props<{ form?: ActionData }>();

	let isSubmitting = $state(false);

	// Handle form results
	$effect(() => {
		if (form?.success) {
			notifications.success('Address added successfully');
			goto('/account/addresses');
		} else if (form?.message) {
			notifications.error(form.message);
		}
	});
</script>

<svelte:head>
	<title>Add New Address - FixTar</title>
	<meta name="description" content="Add a new shipping address" />
</svelte:head>

<div>
	<div class="mb-6 flex items-center gap-4">
		<Button href="/account/addresses" variant="ghost" size="sm">
			<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Addresses
		</Button>
		<h1 class="text-2xl font-bold text-white">Add New Address</h1>
	</div>

	<div class="max-w-2xl">
		<Card>
			<form
				method="POST"
				action="?/addAddress"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
			>
				<div class="space-y-6">
					<div>
						<label for="type" class="mb-2 block text-sm font-medium text-neutral-300">
							Address Type
						</label>
						<select
							id="type"
							name="type"
							required
							class="focus:ring-brand-500 focus:border-brand-500 w-full rounded-md border border-white/15 px-3 py-2 shadow-sm focus:outline-none"
						>
							<option value="Home">Home</option>
							<option value="Work">Work</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div>
						<label for="street" class="mb-2 block text-sm font-medium text-neutral-300">
							Street Address *
						</label>
						<input
							type="text"
							id="street"
							name="street"
							required
							placeholder="123 Main Street"
							class="focus:ring-brand-500 focus:border-brand-500 w-full rounded-md border border-white/15 px-3 py-2 shadow-sm focus:outline-none"
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label for="city" class="mb-2 block text-sm font-medium text-neutral-300">
								City *
							</label>
							<input
								type="text"
								id="city"
								name="city"
								required
								placeholder="Warsaw"
								class="focus:ring-brand-500 focus:border-brand-500 w-full rounded-md border border-white/15 px-3 py-2 shadow-sm focus:outline-none"
							/>
						</div>

						<div>
							<label for="postalCode" class="mb-2 block text-sm font-medium text-neutral-300">
								Postal Code *
							</label>
							<input
								type="text"
								id="postalCode"
								name="postalCode"
								required
								placeholder="00-001"
								class="focus:ring-brand-500 focus:border-brand-500 w-full rounded-md border border-white/15 px-3 py-2 shadow-sm focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label for="country" class="mb-2 block text-sm font-medium text-neutral-300">
							Country *
						</label>
						<select
							id="country"
							name="country"
							required
							class="focus:ring-brand-500 focus:border-brand-500 w-full rounded-md border border-white/15 px-3 py-2 shadow-sm focus:outline-none"
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
							class="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-white/15"
						/>
						<label for="default" class="ml-2 block text-sm text-neutral-300">
							Set as default address
						</label>
					</div>
				</div>

				<div class="mt-6 flex gap-3 border-t border-white/10 pt-6">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Adding Address...' : 'Add Address'}
					</Button>
					<Button type="button" variant="secondary" href="/account/addresses">Cancel</Button>
				</div>
			</form>
		</Card>
	</div>
</div>
