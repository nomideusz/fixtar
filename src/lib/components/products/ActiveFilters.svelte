<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		searchQuery: string;
		selectedCategoryName: string;
		showInStock: boolean;
		onClearSearch: () => void;
		onClearCategory: () => void;
		onClearInStock: () => void;
		onClearAll: () => void;
	}

	let {
		searchQuery,
		selectedCategoryName,
		showInStock,
		onClearSearch,
		onClearCategory,
		onClearInStock,
		onClearAll
	}: Props = $props();

	const hasActiveFilters = $derived(!!searchQuery || !!selectedCategoryName || showInStock);
</script>

{#snippet removeIcon()}
	<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M6 18L18 6M6 6l12 12"
		/>
	</svg>
{/snippet}

{#if hasActiveFilters}
	<div class="mt-6 border-t border-[--ft-line] pt-6">
		<div class="flex flex-wrap items-center gap-3">
			<span class="text-sm font-medium text-[--ft-text-muted]">Aktywne filtry:</span>

			{#if searchQuery}
				<span class="active-filter">
					<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					"{searchQuery}"
					<button
						onclick={onClearSearch}
						class="filter-remove-button"
						aria-label="Usuń filtr wyszukiwania"
					>
						{@render removeIcon()}
					</button>
				</span>
			{/if}

			{#if selectedCategoryName}
				<span class="active-filter">
					<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
						/>
					</svg>
					{selectedCategoryName}
					<button
						onclick={onClearCategory}
						class="filter-remove-button"
						aria-label="Usuń filtr kategorii"
					>
						{@render removeIcon()}
					</button>
				</span>
			{/if}

			{#if showInStock}
				<span class="active-filter">
					<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					Tylko dostępne
					<button
						onclick={onClearInStock}
						class="filter-remove-button"
						aria-label="Usuń filtr dostępności"
					>
						{@render removeIcon()}
					</button>
				</span>
			{/if}

			<Button
				variant="ghost"
				size="sm"
				onclick={onClearAll}
				class="text-[--ft-text-secondary] hover:text-[--ft-text]"
			>
				Wyczyść wszystkie
			</Button>
		</div>
	</div>
{/if}

<style>
	.active-filter {
		display: inline-flex;
		align-items: center;
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
		font-weight: 500;
		background-color: rgba(55, 138, 146, 0.08);
		color: var(--ft-accent-hover);
		border: 1px solid rgba(55, 138, 146, 0.15);
		gap: 0.25rem;
	}

	.filter-remove-button {
		margin-left: 0.375rem;
		padding: 0.25rem;
		border-radius: 9999px;
		transition: all 0.15s ease;
		min-width: 24px;
		min-height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.filter-remove-button:hover {
		background-color: rgba(55, 138, 146, 0.15);
		color: var(--ft-accent-hover);
	}
</style>
