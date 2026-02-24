<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import type { Product, Category } from '$lib/stores/products.svelte';
	
	interface CategoryWithCount extends Category {
		productCount: number;
	}
	
	interface Props {
		data: {
			products: Product[];
			categories: CategoryWithCount[];
			subcategories: CategoryWithCount[];
			allSubcategories: CategoryWithCount[];
			totalPages: number;
			totalItems: number;
			currentPage: number;
			searchQuery: string;
			selectedCategory: string;
			sortBy: string;
			itemsPerPage: number;
			error?: string;
		};
	}

	let { data }: Props = $props();
	
	// Local state for form inputs
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let sortBy = $state('name');
	
	// Sync state with data prop changes
	$effect(() => {
		searchQuery = data.searchQuery;
		selectedCategory = data.selectedCategory;
		sortBy = data.sortBy;
	});
	
	// UI State
	let viewMode = $state<'grid' | 'list'>('grid');
	let showMobileFilters = $state(false);
	let expandedCategories = $state(new Set<string>());
	let priceRange = $state({ min: '0', max: '1000' });
	let showInStock = $state(false);
	
	// Get selected category name for breadcrumbs
	const selectedCategoryName = $derived(
		data.categories.find(cat => cat.slug === selectedCategory)?.name || 
		data.subcategories.find(cat => cat.slug === selectedCategory)?.name || ''
	);
	
	// Group categories by parent for sidebar - with product counts
	const mainCategoriesWithSubs = $derived(
		data.categories.map(category => ({
			...category,
			subcategories: data.allSubcategories.filter(sub => sub.parent === category.id)
		}))
	);
	
	// Auto-expand category if it's selected or if any of its subcategories are selected
	$effect(() => {
		if (selectedCategory) {
			// Check if selected category is a main category
			const mainCategory = data.categories.find(cat => cat.slug === selectedCategory);
			if (mainCategory) {
				if (!expandedCategories.has(mainCategory.slug)) {
					expandedCategories.add(mainCategory.slug);
					expandedCategories = new Set(expandedCategories);
				}
			} else {
				// Check if selected category is a subcategory, then expand its parent
				const subcategory = data.allSubcategories.find(cat => cat.slug === selectedCategory);
				if (subcategory) {
					const parentCategory = data.categories.find(cat => cat.id === subcategory.parent);
					if (parentCategory) {
						if (!expandedCategories.has(parentCategory.slug)) {
							expandedCategories.add(parentCategory.slug);
							expandedCategories = new Set(expandedCategories);
						}
					}
				}
			}
		}
	});
	
	// Update URL when filters change
	function updateURL() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (selectedCategory) params.set('category', selectedCategory);
		if (sortBy !== 'name') params.set('sort', sortBy);
		
		const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
		goto(newUrl);
	}
	
	// Use server-sorted products directly
	let sortedProducts = $derived(data.products);
	
	// Handle filter changes
	function handleSearchChange(e: Event) {
		searchQuery = (e.target as HTMLInputElement).value;
	}
	
	function handleCategoryChange(categorySlug: string) {
		selectedCategory = categorySlug;
		
		// If selecting a main category, auto-expand it
		const mainCategory = data.categories.find(cat => cat.slug === categorySlug);
		if (mainCategory) {
			expandedCategories.add(categorySlug);
			expandedCategories = new Set(expandedCategories);
		}
		
		updateURL();
	}
	
	function handleSortChange(e: Event) {
		sortBy = (e.target as HTMLSelectElement).value;
		updateURL();
	}
	
	function handlePageChange(page: number) {
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (selectedCategory) params.set('category', selectedCategory);
		if (sortBy !== 'name') params.set('sort', sortBy);
		if (page > 1) params.set('page', page.toString());
		
		const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
		goto(newUrl);
	}
	
	function clearFilters() {
		searchQuery = '';
		selectedCategory = '';
		sortBy = 'name';
		showInStock = false;
		priceRange = { min: '0', max: '1000' };
		expandedCategories = new Set();
		goto('/products');
	}
	
	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		updateURL();
	}
	
	function toggleCategory(categorySlug: string) {
		if (expandedCategories.has(categorySlug)) {
			expandedCategories.delete(categorySlug);
		} else {
			expandedCategories.add(categorySlug);
		}
		expandedCategories = new Set(expandedCategories);
	}
</script>

<svelte:head>
	<title>Produkty{selectedCategoryName ? ` - ${selectedCategoryName}` : ''} - FixTar</title>
	<meta name="description" content="Odkryj naszą kompletną ofertę narzędzi i akcesoriów{selectedCategoryName ? ` w kategorii ${selectedCategoryName}` : ''}" />
</svelte:head>

<!-- Modern Professional Hero Section -->
<Hero
	title={selectedCategoryName ? selectedCategoryName : 'Narzędzia i Akcesoria'}
	subtitle={selectedCategoryName 
		? `Odkryj naszą profesjonalną ofertę produktów z kategorii ${selectedCategoryName}` 
		: 'Odkryj najlepsze narzędzia i akcesoria w jednym miejscu'}
	centered={true}
	className="bg-linear-to-br from-brand-50 via-white to-accent-50"
/>

<!-- Enhanced Search Section -->
<section class="bg-white border-b border-neutral-100">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
		<!-- Breadcrumbs with modern styling -->
		<nav class="flex mb-6" aria-label="Breadcrumb">
			<ol class="inline-flex items-center space-x-1 md:space-x-2">
				<li class="inline-flex items-center">
					<a href="/" class="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors">
						<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
						</svg>
						Strona główna
					</a>
				</li>
				<li>
					<div class="flex items-center">
						<svg class="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
						</svg>
						{#if selectedCategoryName}
							<a href="/products" class="ml-1 text-sm font-medium text-neutral-600 hover:text-brand-600 md:ml-2 transition-colors">Produkty</a>
						{:else}
							<span class="ml-1 text-sm font-medium text-neutral-900 md:ml-2">Produkty</span>
						{/if}
					</div>
				</li>
				{#if selectedCategoryName}
					<li aria-current="page">
						<div class="flex items-center">
							<svg class="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
							</svg>
							<span class="ml-1 text-sm font-medium text-neutral-900 md:ml-2">{selectedCategoryName}</span>
						</div>
					</li>
				{/if}
			</ol>
		</nav>

		<!-- Enhanced Search and Filters Bar -->
		<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
			<div class="flex-1 max-w-2xl">
				<form onsubmit={handleSearchSubmit} class="relative group">
					<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg class="h-5 w-5 text-neutral-400 group-focus-within:text-brand-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<Input
						type="search"
						placeholder="Szukaj produktów, kategorii, marek..."
						value={searchQuery}
						oninput={handleSearchChange}
						class="pl-12 pr-12 py-3 text-base rounded-xl border-2 border-transparent focus:border-brand-500 shadow-sm"
					/>
					{#if searchQuery}
						<button
							type="button"
							onclick={() => { searchQuery = ''; updateURL(); }}
							class="absolute inset-y-0 right-4 flex items-center group/clear"
							aria-label="Wyczyść wyszukiwanie"
						>
							<svg class="h-5 text-neutral-400 group-hover/clear:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</form>
			</div>
			
			<div class="flex items-center gap-4">
				<div class="text-sm text-neutral-600 font-medium">
					{data.totalItems} {data.totalItems === 1 ? 'produkt' : data.totalItems < 5 ? 'produkty' : 'produktów'}
				</div>
				<Button variant="outline" onclick={() => showMobileFilters = true} class="lg:hidden">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
					</svg>
					Filtry
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Main Content with Modern Layout -->
<div class="bg-neutral-50 min-h-screen">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
		<div class="lg:grid lg:grid-cols-4 lg:gap-8">
			
			<!-- Enhanced Desktop Sidebar -->
			<div class="hidden lg:block lg:col-span-1">
				<Card glass={true} class="sticky top-6 p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-bold text-neutral-900">Filtry</h3>
						{#if searchQuery || selectedCategory || showInStock}
							<Button variant="ghost" size="sm" onclick={clearFilters}>
								Wyczyść wszystkie
							</Button>
						{/if}
					</div>

					<!-- Enhanced Categories Filter -->
					<div class="border-b border-neutral-200 pb-6 mb-6">
						<h4 class="text-sm font-semibold text-neutral-900 mb-4">Kategorie</h4>
						<div class="space-y-1">
							<button
								onclick={() => handleCategoryChange('')}
								disabled={!!$navigating}
								class="filter-category-button {!selectedCategory ? 'active' : ''}"
							>
								<span class="flex-1 text-left">Wszystkie produkty</span>
								<span class="filter-badge">{data.totalItems}</span>
								{#if $navigating && !selectedCategory}
									<LoadingSpinner visible={true} />
								{/if}
							</button>
							
							{#each mainCategoriesWithSubs as category (category)}
								<div class="space-y-1">
									<div class="flex items-center">
										<button
											onclick={() => handleCategoryChange(category.slug)}
											disabled={!!$navigating}
											class="filter-category-button flex-1 {selectedCategory === category.slug ? 'active' : ''}"
										>
											<span class="flex-1 text-left">{category.name}</span>
											<span class="filter-badge mr-2">{category.productCount}</span>
											{#if $navigating && selectedCategory === category.slug}
												<LoadingSpinner visible={true} />
											{/if}
										</button>
										{#if category.subcategories.length > 0}
											<button
												onclick={() => toggleCategory(category.slug)}
												disabled={!!$navigating}
												class="category-toggle-button"
												aria-label={expandedCategories.has(category.slug) ? 'Ukryj podkategorie' : 'Pokaż podkategorie'}
											>
												<svg class="w-4 h-4 transition-transform {expandedCategories.has(category.slug) ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
												</svg>
											</button>
										{/if}
									</div>
									
									{#if expandedCategories.has(category.slug) && category.subcategories.length > 0}
										<div class="ml-4 space-y-1">
											{#each category.subcategories as subcategory (subcategory)}
												<button
													onclick={() => handleCategoryChange(subcategory.slug)}
													disabled={!!$navigating}
													class="filter-subcategory-button {selectedCategory === subcategory.slug ? 'active' : ''}"
												>
													<span class="flex-1 text-left">{subcategory.name}</span>
													<span class="filter-badge">{subcategory.productCount}</span>
													{#if $navigating && selectedCategory === subcategory.slug}
														<LoadingSpinner visible={true} />
													{/if}
												</button>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Enhanced Price Range -->
					<div class="border-b border-neutral-200 pb-6 mb-6">
						<h4 class="text-sm font-semibold text-neutral-900 mb-4">Zakres cen</h4>
						<div class="flex items-center space-x-3">
							<Input
								type="number"
								placeholder="Min"
								bind:value={priceRange.min}
								class="text-sm"
							/>
							<span class="text-neutral-400 font-medium">-</span>
							<Input
								type="number"
								placeholder="Max"
								bind:value={priceRange.max}
								class="text-sm"
							/>
						</div>
								<div class="mt-3 text-xs text-neutral-500">
							Ceny w PLN
						</div>
					</div>

					<!-- Enhanced Availability -->
					<div class="pb-6">
						<h4 class="text-sm font-semibold text-neutral-900 mb-4">Dostępność</h4>
						<label class="flex items-center cursor-pointer group">
							<input
								type="checkbox"
								bind:checked={showInStock}
										class="rounded border-neutral-300 text-brand-600 focus:ring-brand-500 focus:ring-2"
							/>
									<span class="ml-3 text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">Tylko dostępne</span>
						</label>
					</div>
				</Card>
			</div>

			<!-- Enhanced Mobile Filter Panel -->
			{#if showMobileFilters}
				<div class="fixed inset-0 z-50 lg:hidden">
					<!-- Backdrop -->
					<div 
						class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
						onclick={() => showMobileFilters = false}
						onkeydown={(e) => e.key === 'Escape' && (showMobileFilters = false)}
						tabindex="0"
						role="button"
						aria-label="Zamknij filtry"
					></div>
					
					<!-- Panel -->
					<div class="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl">
						<div class="flex flex-col h-full">
							<!-- Header -->
							<div class="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50">
								<h3 class="text-xl font-bold text-neutral-900">Filtry</h3>
								<Button variant="ghost" size="sm" onclick={() => showMobileFilters = false}>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</Button>
							</div>
							
							<!-- Content -->
							<div class="flex-1 overflow-y-auto p-6">
								<!-- Mobile Categories -->
								<div class="border-b border-neutral-200 pb-6 mb-6">
									<h4 class="text-sm font-semibold text-neutral-900 mb-4">Kategorie</h4>
									<div class="space-y-2">
										<button
											onclick={() => handleCategoryChange('')}
											disabled={!!$navigating}
											class="filter-category-button {!selectedCategory ? 'active' : ''}"
										>
											<span class="flex-1 text-left">Wszystkie</span>
											<span class="filter-badge">{data.totalItems}</span>
										</button>
										
										{#each mainCategoriesWithSubs as category (category)}
											<div class="space-y-1">
												<div class="flex items-center">
													<button
														onclick={() => handleCategoryChange(category.slug)}
														disabled={!!$navigating}
														class="filter-category-button flex-1 {selectedCategory === category.slug ? 'active' : ''}"
													>
														<span class="flex-1 text-left">{category.name}</span>
														<span class="filter-badge mr-2">{category.productCount}</span>
													</button>
													{#if category.subcategories.length > 0}
																											<button
														onclick={() => toggleCategory(category.slug)}
														class="category-toggle-button"
														aria-label={expandedCategories.has(category.slug) ? 'Ukryj podkategorie' : 'Pokaż podkategorie'}
													>
														<svg class="w-4 h-4 transition-transform {expandedCategories.has(category.slug) ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
															<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
														</svg>
													</button>
													{/if}
												</div>
												
												{#if expandedCategories.has(category.slug) && category.subcategories.length > 0}
													<div class="ml-4 space-y-1">
														{#each category.subcategories as subcategory (subcategory)}
															<button
																onclick={() => handleCategoryChange(subcategory.slug)}
																class="filter-subcategory-button {selectedCategory === subcategory.slug ? 'active' : ''}"
															>
																<span class="flex-1 text-left">{subcategory.name}</span>
																<span class="filter-badge">{subcategory.productCount}</span>
															</button>
														{/each}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								</div>

								<!-- Mobile Price Range -->
								<div class="border-b border-neutral-200 pb-6 mb-6">
									<h4 class="text-sm font-semibold text-neutral-900 mb-4">Zakres cen</h4>
									<div class="flex items-center space-x-3">
										<Input
											type="number"
											placeholder="Min"
											bind:value={priceRange.min}
											class="text-sm"
										/>
										<span class="text-neutral-400">-</span>
										<Input
											type="number"
											placeholder="Max"
											bind:value={priceRange.max}
											class="text-sm"
										/>
									</div>
								</div>

								<!-- Mobile Availability -->
								<div>
									<h4 class="text-sm font-semibold text-neutral-900 mb-4">Dostępność</h4>
									<label class="flex items-center cursor-pointer">
										<input
											type="checkbox"
											bind:checked={showInStock}
											class="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
										/>
										<span class="ml-3 text-sm text-neutral-700">Tylko dostępne</span>
									</label>
								</div>
							</div>
							
							<!-- Footer -->
								<div class="border-t border-neutral-200 p-6 bg-neutral-50">
								<div class="flex gap-3">
									<Button variant="outline" onclick={clearFilters} class="flex-1">
										Wyczyść
									</Button>
									<Button onclick={() => showMobileFilters = false} class="flex-1">
										Pokaż produkty
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Enhanced Main Product Area -->
			<div class="lg:col-span-3">
				<!-- Modern Toolbar -->
				<Card class="p-6 mb-8">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<!-- View Mode and Results -->
						<div class="flex items-center justify-between sm:justify-start gap-6">
							<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-neutral-700">Widok:</span>
							<div class="flex items-center bg-neutral-100 rounded-xl p-1">
									<button
										onclick={() => viewMode = 'grid'}
										class="view-mode-button {viewMode === 'grid' ? 'active' : ''}"
										aria-label="Widok siatki"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
										</svg>
									</button>
									<button
										onclick={() => viewMode = 'list'}
										class="view-mode-button {viewMode === 'list' ? 'active' : ''}"
										aria-label="Widok listy"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
										</svg>
									</button>
								</div>
							</div>
						</div>

						<!-- Sort Dropdown -->
						<div class="flex items-center gap-3">
						<span class="text-sm font-medium text-neutral-700">Sortuj:</span>
						<select
							value={sortBy}
							onchange={handleSortChange}
							class="px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white"
							>
								<option value="name">Nazwa A-Z</option>
								<option value="price-low">Cena: rosnąco</option>
								<option value="price-high">Cena: malejąco</option>
							</select>
						</div>
					</div>

					<!-- Active Filters with Enhanced Design -->
					{#if searchQuery || selectedCategory || showInStock}
					<div class="mt-6 pt-6 border-t border-neutral-200">
						<div class="flex flex-wrap items-center gap-3">
							<span class="text-sm font-medium text-neutral-700">Aktywne filtry:</span>
								{#if searchQuery}
									<span class="active-filter">
										<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
										"{searchQuery}"
										<button onclick={() => { searchQuery = ''; updateURL(); }} class="filter-remove-button" aria-label="Usuń filtr wyszukiwania">
											<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</span>
								{/if}
								{#if selectedCategoryName}
									<span class="active-filter bg-accent-100 text-accent-800">
										<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
										</svg>
										{selectedCategoryName}
										<button onclick={() => handleCategoryChange('')} class="filter-remove-button" aria-label="Usuń filtr kategorii">
											<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</span>
								{/if}
								{#if showInStock}
									<span class="active-filter bg-accent-100 text-accent-800">
										<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
										Tylko dostępne
										<button onclick={() => showInStock = false} class="filter-remove-button" aria-label="Usuń filtr dostępności">
											<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</span>
								{/if}
								<Button variant="ghost" size="sm" onclick={clearFilters} class="text-neutral-500 hover:text-neutral-700">
									Wyczyść wszystkie
								</Button>
							</div>
						</div>
					{/if}
				</Card>

				<!-- Products Section with Loading State -->
				<div class="relative">
					{#if $navigating}
						<div class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
							<div class="flex flex-col items-center gap-3">
								<LoadingSpinner visible={true} />
							<p class="text-sm font-medium text-neutral-600">Ładowanie produktów...</p>
							</div>
						</div>
					{/if}

					{#if data.error}
						<Card class="p-12 text-center">
							<div class="max-w-md mx-auto">
								<svg class="w-16 h-16 text-danger mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
								<h3 class="text-lg font-semibold text-neutral-900 mb-2">Wystąpił błąd</h3>
								<p class="text-neutral-600 mb-4">{data.error}</p>
								<Button href="/products" variant="outline">
									Spróbuj ponownie
								</Button>
							</div>
						</Card>
					{:else if sortedProducts.length > 0}
						<!-- Products Grid/List -->
						{#if viewMode === 'grid'}
							<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
								{#each sortedProducts as product (product)}
									<ProductCard {product} />
								{/each}
							</div>
						{:else}
							<div class="space-y-4">
								{#each sortedProducts as product (product)}
									<Card class="p-6">
										<div class="flex items-center gap-6">
											<div class="shrink-0">
												<div class="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100">
													{#if product.mainImage}
														<img 
															src={product.mainImage} 
															alt={product.name}
															class="w-full h-full object-cover"
															loading="lazy"
															onerror={(e) => {
																const target = e.target as HTMLImageElement;
																if (target) {
																	target.style.display = 'none';
																	const nextElement = target.nextElementSibling as HTMLElement;
																	if (nextElement) {
																		nextElement.style.display = 'flex';
																	}
																}
															}}
														/>
														<div class="hidden items-center justify-center w-full h-full">
															<svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
															</svg>
														</div>
													{:else}
														<div class="flex items-center justify-center w-full h-full">
															<svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
															</svg>
														</div>
													{/if}
												</div>
											</div>
											<div class="flex-1 min-w-0">
									<h3 class="text-lg font-semibold text-neutral-900 mb-1">{product.name}</h3>
									{#if product.shortDescription}
										<p class="text-sm text-neutral-600 mb-3 line-clamp-2">{product.shortDescription}</p>
												{/if}
												
												{#if product.expand?.categories && product.expand.categories.length > 0}
													<div class="flex flex-wrap gap-1 mb-3">
														{#each product.expand.categories.slice(0, 3) as category (category)}
												<span class="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-md font-medium">
																{category.name}
															</span>
														{/each}
													</div>
												{/if}
												
												<div class="flex items-center justify-between">
													<div class="flex items-center gap-3">
												<span class="text-xl font-bold text-brand-600">{product.price.toFixed(2)} zł</span>
												{#if product.compareAtPrice && product.compareAtPrice > product.price}
													<span class="text-sm text-neutral-500 line-through">{product.compareAtPrice.toFixed(2)} zł</span>
														{/if}
													</div>
													<Button href="/products/{product.slug || product.id}" size="sm">
														Zobacz szczegóły
													</Button>
												</div>
											</div>
										</div>
									</Card>
								{/each}
							</div>
						{/if}
						
						<!-- Enhanced Pagination -->
						{#if data.totalPages > 1}
							<div class="mt-12 flex justify-center">
								<nav class="flex items-center gap-2">
									<Button
										onclick={() => handlePageChange(data.currentPage - 1)}
										disabled={data.currentPage <= 1 || !!$navigating}
										variant="outline"
										size="sm"
									>
										<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
										</svg>
										Poprzednia
									</Button>
									
									{#each Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
										const start = Math.max(1, data.currentPage - 2);
										return start + i;
									}) as pageNum}
										{#if pageNum <= data.totalPages}
											<Button
												onclick={() => handlePageChange(pageNum)}
												variant={pageNum === data.currentPage ? 'primary' : 'outline'}
												size="sm"
												disabled={!!$navigating}
												class="min-w-10"
											>
												{pageNum}
											</Button>
										{/if}
									{/each}
									
									<Button
										onclick={() => handlePageChange(data.currentPage + 1)}
										disabled={data.currentPage >= data.totalPages || !!$navigating}
										variant="outline"
										size="sm"
									>
										Następna
										<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
										</svg>
									</Button>
								</nav>
							</div>
						{/if}
					{:else}
						<!-- Enhanced Empty State -->
						<Card class="p-16 text-center">
							<div class="max-w-lg mx-auto">
								<div class="relative">
									<div class="absolute inset-0 flex items-center justify-center">
										<div class="w-32 h-32 bg-neutral-200 rounded-full filter blur-3xl opacity-20"></div>
									</div>
									<svg class="w-20 h-20 text-neutral-400 mx-auto mb-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7" />
									</svg>
								</div>
							<h3 class="text-2xl font-bold text-neutral-900 mb-3">Brak produktów</h3>
							<p class="text-neutral-600 mb-6">
									{searchQuery || selectedCategoryName 
										? 'Nie znaleźliśmy produktów odpowiadających Twoim kryteriom wyszukiwania'
										: 'W tej chwili nie ma dostępnych produktów'
									}
								</p>
								{#if searchQuery || selectedCategory}
									<div class="flex flex-col sm:flex-row gap-3 justify-center">
										<Button onclick={clearFilters} variant="outline">
											Wyczyść filtry
										</Button>
										<Button href="/products">
											Zobacz wszystkie produkty
										</Button>
									</div>
								{:else}
									<Button href="/">
										Wróć do strony głównej
									</Button>
								{/if}
							</div>
						</Card>
					{/if}
				</div>
			</div>
		</div>
	</div>
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
		color: var(--ft-primary);
		background-color: var(--color-brand-50);
	}
	
	.filter-category-button.active {
		background-color: var(--color-brand-50);
		color: var(--color-brand-700);
		border: 1px solid var(--color-brand-300);
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
		color: var(--ft-text-secondary);
	}
	
	.filter-subcategory-button:not(.active):hover {
		color: var(--ft-primary);
		background-color: var(--color-brand-50);
	}
	
	.filter-subcategory-button.active {
		background-color: var(--color-brand-50);
		color: var(--color-brand-700);
		font-weight: 500;
	}
	
	.category-toggle-button {
		padding: 0.5rem;
		border-radius: 0.5rem;
		transition: colors 0.2s;
		color: var(--color-neutral-500);
	}
	
	.category-toggle-button:hover {
		background-color: var(--color-neutral-100);
		color: var(--ft-primary);
	}
	
	.category-toggle-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.filter-badge {
		font-size: 0.75rem;
		background-color: var(--color-neutral-100);
		color: var(--ft-text-secondary);
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
	}
	
	.view-mode-button {
		display: flex;
		align-items: center;
		padding: 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s;
	}
	
	.view-mode-button:not(.active) {
		color: var(--ft-text-secondary);
	}
	
	.view-mode-button:not(.active):hover {
		color: var(--ft-primary);
		background-color: var(--color-neutral-50);
	}
	
	.view-mode-button.active {
		background-color: white;
		color: var(--ft-primary);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
	
	.active-filter {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		background-color: var(--color-brand-50);
		color: var(--color-brand-700);
		gap: 0.25rem;
	}
	
	.filter-remove-button {
		margin-left: 0.5rem;
		padding: 0.125rem;
		border-radius: 9999px;
		transition: colors 0.2s;
	}
	
	.filter-remove-button:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}
</style> 



