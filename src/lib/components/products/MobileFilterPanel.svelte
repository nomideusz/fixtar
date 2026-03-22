<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import CategoryFilter from './CategoryFilter.svelte';
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
		priceRange: { min: string; max: string };
		showInStock: boolean;
		onCategoryChange: (slug: string) => void;
		onToggleCategory: (slug: string) => void;
		onClearFilters: () => void;
		onClose: () => void;
	}

	let {
		categories,
		selectedCategory,
		expandedCategories,
		totalItems,
		priceRange = $bindable(),
		showInStock = $bindable(),
		onCategoryChange,
		onToggleCategory,
		onClearFilters,
		onClose
	}: Props = $props();

	let panelElement = $state<HTMLDivElement | null>(null);

	// Focus trap
	$effect(() => {
		if (!panelElement) return;

		const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const firstFocusable = panelElement.querySelector<HTMLElement>(focusableSelectors);
		firstFocusable?.focus();

		function handleFocusTrap(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				onClose();
				return;
			}
			if (e.key !== 'Tab') return;

			const focusableElements = panelElement!.querySelectorAll<HTMLElement>(focusableSelectors);
			const first = focusableElements[0];
			const last = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last?.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first?.focus();
				}
			}
		}

		document.addEventListener('keydown', handleFocusTrap);
		return () => document.removeEventListener('keydown', handleFocusTrap);
	});
</script>

<div class="fixed inset-0 z-50 lg:hidden">
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		tabindex="0"
		role="button"
		aria-label="Zamknij filtry"
	></div>

	<!-- Panel -->
	<div bind:this={panelElement} role="dialog" aria-label="Filtry" class="fixed inset-y-0 right-0 w-full max-w-sm bg-[--ft-surface] shadow-2xl">
		<div class="flex h-full flex-col">
			<!-- Header -->
			<div
				class="flex items-center justify-between border-b border-[--ft-line] bg-[--ft-surface] p-6"
			>
				<h3 class="text-xl font-bold text-[--ft-text]">Filtry</h3>
				<Button variant="ghost" size="sm" onclick={onClose}>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</Button>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-6">
				<!-- Categories -->
				<div class="mb-6 border-b border-[--ft-line] pb-6">
					<h4 class="mb-4 text-sm font-semibold text-[--ft-text]">Kategorie</h4>
					<CategoryFilter
						{categories}
						{selectedCategory}
						{expandedCategories}
						{totalItems}
						{onCategoryChange}
						{onToggleCategory}
						showLoadingIndicators={false}
					/>
				</div>

				<!-- Price Range -->
				<div class="mb-6 border-b border-[--ft-line] pb-6">
					<h4 class="mb-4 text-sm font-semibold text-[--ft-text]">Zakres cen</h4>
					<div class="flex items-center space-x-3">
						<Input
							type="number"
							placeholder="Min"
							bind:value={priceRange.min}
							class="text-sm"
						/>
						<span class="text-[--ft-text-faint]">-</span>
						<Input
							type="number"
							placeholder="Max"
							bind:value={priceRange.max}
							class="text-sm"
						/>
					</div>
				</div>

				<!-- Availability -->
				<div>
					<h4 class="mb-4 text-sm font-semibold text-[--ft-text]">Dostępność</h4>
					<label class="flex cursor-pointer items-center">
						<input
							type="checkbox"
							bind:checked={showInStock}
							class="text-brand-600 focus:ring-brand-500 rounded border-[--ft-line]"
						/>
						<span class="ml-3 text-sm text-[--ft-text-muted]">Tylko dostępne</span>
					</label>
				</div>
			</div>

			<!-- Footer -->
			<div class="border-t border-[--ft-line] bg-[--ft-surface] p-6">
				<div class="flex gap-3">
					<Button variant="outline" onclick={onClearFilters} class="flex-1">Wyczyść</Button>
					<Button onclick={onClose} class="flex-1">Pokaż produkty</Button>
				</div>
			</div>
		</div>
	</div>
</div>
