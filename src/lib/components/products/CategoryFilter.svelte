<script lang="ts">
	import { navigating } from '$app/stores';
	import { SvelteSet } from 'svelte/reactivity';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import type { Category } from '$lib/stores/products.svelte';

	interface CategoryWithCount extends Category {
		productCount: number;
	}

	interface CategoryWithSubs extends CategoryWithCount {
		subcategories: CategoryWithCount[];
	}

	interface Props {
		categories: CategoryWithSubs[];
		selectedCategory: string;
		expandedCategories: SvelteSet<string>;
		totalItems: number;
		onCategoryChange: (slug: string) => void;
		onToggleCategory: (slug: string) => void;
		showLoadingIndicators?: boolean;
	}

	let {
		categories,
		selectedCategory,
		expandedCategories,
		totalItems,
		onCategoryChange,
		onToggleCategory,
		showLoadingIndicators = true
	}: Props = $props();
</script>

<div class="space-y-1">
	<button
		onclick={() => onCategoryChange('')}
		disabled={!!$navigating}
		class="filter-category-button {!selectedCategory ? 'active' : ''}"
	>
		<span class="flex-1 text-left">Wszystkie produkty</span>
		<span class="filter-badge">{totalItems}</span>
		{#if showLoadingIndicators && $navigating && !selectedCategory}
			<LoadingSpinner visible={true} />
		{/if}
	</button>

	{#each categories as category (category)}
		<div class="space-y-1">
			<div class="flex items-center">
				<button
					onclick={() => onCategoryChange(category.slug)}
					disabled={!!$navigating}
					class="filter-category-button flex-1 {selectedCategory === category.slug ? 'active' : ''}"
				>
					<span class="flex-1 text-left">{category.name}</span>
					<span class="filter-badge mr-2">{category.productCount}</span>
					{#if showLoadingIndicators && $navigating && selectedCategory === category.slug}
						<LoadingSpinner visible={true} />
					{/if}
				</button>
				{#if category.subcategories.length > 0}
					<button
						onclick={() => onToggleCategory(category.slug)}
						disabled={!!$navigating}
						class="category-toggle-button"
						aria-label={expandedCategories.has(category.slug)
							? 'Ukryj podkategorie'
							: 'Pokaż podkategorie'}
					>
						<svg
							class="h-4 w-4 transition-transform {expandedCategories.has(category.slug)
								? 'rotate-90'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{/if}
			</div>

			{#if expandedCategories.has(category.slug) && category.subcategories.length > 0}
				<div class="ml-4 space-y-1">
					{#each category.subcategories as subcategory (subcategory)}
						<button
							onclick={() => onCategoryChange(subcategory.slug)}
							disabled={!!$navigating}
							class="filter-subcategory-button {selectedCategory === subcategory.slug
								? 'active'
								: ''}"
						>
							<span class="flex-1 text-left">{subcategory.name}</span>
							<span class="filter-badge">{subcategory.productCount}</span>
							{#if showLoadingIndicators && $navigating && selectedCategory === subcategory.slug}
								<LoadingSpinner visible={true} />
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.filter-category-button {
		display: flex;
		align-items: center;
		width: 100%;
		text-align: left;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s;
	}

	.filter-category-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.filter-category-button:not(.active) {
		color: var(--ft-text);
	}

	.filter-category-button:not(.active):hover {
		color: var(--ft-accent);
		background-color: rgba(55, 138, 146, 0.06);
	}

	.filter-category-button.active {
		background-color: rgba(55, 138, 146, 0.1);
		color: var(--ft-accent);
		border: 1px solid rgba(55, 138, 146, 0.2);
		font-weight: 600;
	}

	.filter-subcategory-button {
		display: flex;
		align-items: center;
		width: 100%;
		text-align: left;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.filter-subcategory-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.filter-subcategory-button:not(.active) {
		color: var(--ft-text-muted);
	}

	.filter-subcategory-button:not(.active):hover {
		color: var(--ft-accent);
		background-color: rgba(55, 138, 146, 0.06);
	}

	.filter-subcategory-button.active {
		background-color: rgba(55, 138, 146, 0.08);
		color: var(--ft-accent);
		font-weight: 600;
	}

	.category-toggle-button {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 0.5rem;
		transition: all 0.15s ease;
		color: var(--ft-text-muted);
	}

	.category-toggle-button:hover {
		background-color: var(--ft-frost);
		color: var(--ft-accent);
	}

	.category-toggle-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.filter-badge {
		font-size: 0.7rem;
		background-color: var(--ft-frost);
		color: var(--ft-text-muted);
		padding: 0.125rem 0.5rem;
		border-radius: var(--radius-full);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}
</style>
