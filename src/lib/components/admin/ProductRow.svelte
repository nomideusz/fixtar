<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

	interface Props {
		product: any;
		selected: boolean;
		isLoading: boolean;
		onToggleSelect: () => void;
		onStatusChange: (productId: string, newStatus: string) => void;
	}

	let { product, selected, isLoading, onToggleSelect, onStatusChange }: Props = $props();

	const statusDescriptions: Record<string, string> = {
		active: 'Visible to customers',
		draft: 'Hidden, needs review',
		inactive: 'Disabled and hidden'
	};
</script>

<tr class="border-b hover:bg-neutral-50">
	<td class="px-4 py-3">
		<input
			type="checkbox"
			checked={selected}
			onchange={onToggleSelect}
			class="rounded border-neutral-300"
		/>
	</td>
	<td class="px-4 py-3">
		<div class="flex items-center">
			{#if product.mainImage}
				<img
					src={product.mainImage}
					alt={product.name}
					class="mr-3 h-12 w-12 rounded object-cover"
				/>
			{:else}
				<div class="mr-3 flex h-12 w-12 items-center justify-center rounded bg-neutral-200">
					<svg
						class="h-6 w-6 text-[--ft-text-muted]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
			{/if}
			<div>
				<p class="max-w-xs truncate font-medium text-neutral-900">{product.name}</p>
				{#if product.shortDescription}
					<p class="max-w-xs truncate text-sm text-[--ft-text-muted]">{product.shortDescription}</p>
				{/if}
			</div>
		</div>
	</td>
	<td class="px-4 py-3 font-mono text-sm text-neutral-600">
		{product.sku || '-'}
	</td>
	<td class="px-4 py-3 font-medium">
		{product.price.toFixed(2)} zł
	</td>
	<td class="px-4 py-3">
		{#if product.expand?.categories?.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each product.expand.categories.slice(0, 2) as category (category)}
					<span class="rounded bg-[--ft-frost] px-2 py-1 text-xs text-[--ft-text]">
						{category.name}
					</span>
				{/each}
				{#if product.expand.categories.length > 2}
					<span class="text-xs text-[--ft-text-muted]">
						+{product.expand.categories.length - 2} more
					</span>
				{/if}
			</div>
		{:else}
			<span class="text-[--ft-text-muted]">No categories</span>
		{/if}
	</td>
	<td class="whitespace-nowrap px-6 py-4">
		<div class="space-y-2">
			<div class="flex items-center">
				<StatusBadge status={product.status} />
				{#if isLoading}
					<svg
						class="ml-2 h-4 w-4 animate-spin text-[--ft-text-muted]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				{/if}
			</div>

			<select
				value={product.status}
				onchange={(e) => onStatusChange(product.id, e.currentTarget.value)}
				class="focus:ring-brand-500 focus:border-brand-500 w-full rounded-md border-neutral-300 text-xs disabled:opacity-50"
				disabled={isLoading}
				title="Change product status"
			>
				<option value="active">✅ Set as Active</option>
				<option value="draft">⚠️ Set as Draft</option>
				<option value="inactive">❌ Set as Inactive</option>
			</select>
		</div>

		<div class="mt-1 text-xs text-[--ft-text-muted]">
			{statusDescriptions[product.status] || 'Unknown status'}
		</div>
	</td>
</tr>
