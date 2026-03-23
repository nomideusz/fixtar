<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface SearchResult {
		id: string;
		name: string;
		slug: string;
		image: string;
		price: number;
		category: string;
		categorySlug: string;
	}

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let loading = $state(false);
	let showDropdown = $state(false);
	let selectedIndex = $state(-1);
	let inputRef = $state<HTMLInputElement | null>(null);
	let debounceTimer: ReturnType<typeof setTimeout>;

	/* Recent searches from localStorage */
	let recentSearches = $state<string[]>([]);

	function loadRecent() {
		try {
			const stored = localStorage.getItem('ft-recent-searches');
			recentSearches = stored ? JSON.parse(stored) : [];
		} catch {
			recentSearches = [];
		}
	}

	function saveRecent(q: string) {
		const trimmed = q.trim();
		if (!trimmed) return;
		const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
		recentSearches = updated;
		try {
			localStorage.setItem('ft-recent-searches', JSON.stringify(updated));
		} catch {}
	}

	function clearRecent() {
		recentSearches = [];
		try {
			localStorage.removeItem('ft-recent-searches');
		} catch {}
	}

	$effect(() => {
		loadRecent();
		// Focus the input when mounted
		setTimeout(() => inputRef?.focus(), 50);
	});

	async function search(q: string) {
		if (!q.trim() || q.trim().length < 2) {
			results = [];
			loading = false;
			return;
		}

		loading = true;
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&limit=6`);
			if (res.ok) {
				const data = await res.json();
				results = (data.results || []).map((r: any) => ({
					id: r.id,
					name: r.name,
					slug: r.slug,
					image: r.image || '',
					price: r.price || 0,
					category: r.category || '',
					categorySlug: r.categorySlug || ''
				}));
			}
		} catch {
			results = [];
		} finally {
			loading = false;
		}
	}

	function handleInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		query = value;
		selectedIndex = -1;
		showDropdown = true;

		clearTimeout(debounceTimer);
		if (value.trim().length >= 2) {
			loading = true;
			debounceTimer = setTimeout(() => search(value), 250);
		} else {
			results = [];
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		const totalItems = results.length;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = selectedIndex < totalItems - 1 ? selectedIndex + 1 : 0;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : totalItems - 1;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (selectedIndex >= 0 && results[selectedIndex]) {
				goToProduct(results[selectedIndex]);
			} else if (query.trim()) {
				goToSearch();
			}
		} else if (e.key === 'Escape') {
			close();
		}
	}

	function goToProduct(result: SearchResult) {
		saveRecent(query);
		close();
		goto(`/products/${result.slug}`);
	}

	function goToSearch() {
		saveRecent(query);
		close();
		goto(`/search?q=${encodeURIComponent(query.trim())}`);
	}

	function goToRecentSearch(q: string) {
		query = q;
		close();
		goto(`/search?q=${encodeURIComponent(q)}`);
	}

	function close() {
		query = '';
		results = [];
		showDropdown = false;
		selectedIndex = -1;
		onClose?.();
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('pl-PL', {
			style: 'currency',
			currency: 'PLN',
			minimumFractionDigits: 2
		}).format(price);
	}

	const hasDropdownContent = $derived(
		showDropdown && (results.length > 0 || loading || (query.trim().length < 2 && recentSearches.length > 0))
	);
</script>

<div class="nav-search">
	<div class="search-input-wrap">
		<svg class="search-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>

		<input
			bind:this={inputRef}
			type="search"
			placeholder="Szukaj produktów..."
			value={query}
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={() => (showDropdown = true)}
			class="search-input"
			role="combobox"
			aria-expanded={hasDropdownContent}
			aria-haspopup="listbox"
			aria-controls="search-results"
			aria-label="Szukaj produktów"
			autocomplete="off"
		/>

		{#if query}
			<button class="search-clear" onclick={() => { query = ''; results = []; inputRef?.focus(); }} aria-label="Wyczyść wyszukiwanie">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		{/if}

		<button class="search-close" onclick={close} aria-label="Zamknij wyszukiwanie">
			<kbd>ESC</kbd>
		</button>
	</div>

	{#if hasDropdownContent}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="search-backdrop" onclick={close} onkeydown={(e) => e.key === 'Escape' && close()}></div>
		<div class="search-dropdown" id="search-results" role="listbox">
			{#if query.trim().length < 2 && recentSearches.length > 0}
				<!-- Recent searches -->
				<div class="dropdown-section">
					<div class="dropdown-section-header">
						<span class="dropdown-section-title">Ostatnie wyszukiwania</span>
						<button class="dropdown-clear-btn" onclick={clearRecent}>Wyczyść</button>
					</div>
					{#each recentSearches as recent}
						<button
							class="dropdown-recent"
							onclick={() => goToRecentSearch(recent)}
							role="option"
							aria-selected={false}
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
							</svg>
							{recent}
						</button>
					{/each}
				</div>
			{:else if loading}
				<div class="dropdown-loading">
					<div class="loading-dots">
						<span></span><span></span><span></span>
					</div>
					Szukam...
				</div>
			{:else if results.length > 0}
				<!-- Product results -->
				<div class="dropdown-section">
					<span class="dropdown-section-title">Produkty</span>
					{#each results as result, i (result.id)}
						<button
							class="dropdown-result"
							class:is-selected={selectedIndex === i}
							onclick={() => goToProduct(result)}
							onmouseenter={() => (selectedIndex = i)}
							role="option"
							aria-selected={selectedIndex === i}
						>
							{#if result.image}
								<img
									src={result.image}
									alt=""
									class="result-thumb"
									width="40"
									height="40"
									loading="lazy"
								/>
							{:else}
								<div class="result-thumb-placeholder">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
									</svg>
								</div>
							{/if}
							<div class="result-info">
								<span class="result-name">{result.name}</span>
								<span class="result-meta">{result.category}</span>
							</div>
							<span class="result-price">{formatPrice(result.price)}</span>
						</button>
					{/each}
				</div>

				<!-- Search all link -->
				<button class="dropdown-all" onclick={goToSearch}>
					Pokaż wszystkie wyniki dla „{query.trim()}"
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
					</svg>
				</button>
			{:else if query.trim().length >= 2}
				<div class="dropdown-empty">
					Brak wyników dla „{query.trim()}"
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.nav-search {
		position: relative;
		flex: 1;
		max-width: 520px;
	}

	/* ── Input ── */
	.search-input-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input-icon {
		position: absolute;
		left: 12px;
		color: var(--ft-text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 10px 80px 10px 36px;
		font-size: 0.85rem;
		color: var(--ft-text);
		background: var(--ft-frost);
		border: 1px solid transparent;
		border-radius: var(--radius-full);
		outline: none;
		transition: all 0.2s ease;
	}

	.search-input::placeholder {
		color: var(--ft-text-faint);
	}

	.search-input:focus {
		background: var(--ft-surface);
		border-color: var(--ft-line);
		box-shadow: 0 0 0 3px rgba(55, 138, 146, 0.08);
	}

	.search-clear {
		position: absolute;
		right: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--ft-text-muted);
		cursor: pointer;
		border-radius: 50%;
		transition: all 0.15s ease;
	}

	.search-clear:hover {
		color: var(--ft-dark);
		background: var(--ft-frost);
	}

	.search-clear:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	.search-close {
		position: absolute;
		right: 10px;
		display: flex;
		align-items: center;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
	}

	.search-close kbd {
		font-size: 0.6rem;
		font-family: inherit;
		font-weight: 600;
		color: var(--ft-text-faint);
		padding: 2px 6px;
		border: 1px solid var(--ft-line);
		border-radius: 4px;
		background: var(--ft-surface);
	}

	/* ── Backdrop ── */
	.search-backdrop {
		position: fixed;
		inset: 0;
		z-index: 38;
	}

	/* ── Dropdown ── */
	.search-dropdown {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		right: 0;
		z-index: 50;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		box-shadow: var(--ft-shadow-lg, 0 10px 40px rgba(0,0,0,0.1));
		overflow: hidden;
		animation: dropdownSlideIn 0.15s ease-out;
	}

	@keyframes dropdownSlideIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.search-dropdown {
			animation: none;
		}
	}

	/* ── Sections ── */
	.dropdown-section {
		padding: 8px;
	}

	.dropdown-section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 8px 8px;
	}

	.dropdown-section-title {
		display: block;
		padding: 6px 8px 4px;
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
	}

	.dropdown-section-header .dropdown-section-title {
		padding: 0;
	}

	.dropdown-clear-btn {
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--ft-text-faint);
		background: none;
		border: none;
		cursor: pointer;
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		transition: color 0.15s ease;
	}

	.dropdown-clear-btn:hover {
		color: var(--ft-accent);
	}

	.dropdown-clear-btn:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	/* ── Recent search item ── */
	.dropdown-recent {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 10px;
		font-size: 0.82rem;
		color: var(--ft-text);
		background: none;
		border: none;
		cursor: pointer;
		border-radius: var(--radius-sm);
		text-align: left;
		transition: background 0.1s ease;
	}

	.dropdown-recent:hover,
	.dropdown-recent:focus-visible {
		background: var(--ft-frost);
	}

	.dropdown-recent:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: -2px;
	}

	.dropdown-recent svg {
		flex-shrink: 0;
		color: var(--ft-text-faint);
	}

	/* ── Result item ── */
	.dropdown-result {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 8px 10px;
		background: none;
		border: none;
		cursor: pointer;
		border-radius: var(--radius-sm);
		text-align: left;
		transition: background 0.1s ease;
	}

	.dropdown-result:hover,
	.dropdown-result.is-selected,
	.dropdown-result:focus-visible {
		background: var(--ft-frost);
	}

	.dropdown-result:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: -2px;
	}

	.result-thumb {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		object-fit: contain;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
	}

	.result-thumb-placeholder {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--ft-frost);
		color: var(--ft-text-faint);
	}

	.result-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.result-name {
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--ft-dark);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-meta {
		font-size: 0.68rem;
		color: var(--ft-text-muted);
	}

	.result-price {
		flex-shrink: 0;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--ft-cta);
	}

	/* ── Loading ── */
	.dropdown-loading {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 20px 16px;
		font-size: 0.8rem;
		color: var(--ft-text-muted);
	}

	.loading-dots {
		display: flex;
		gap: 3px;
	}

	.loading-dots span {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ft-cta);
		animation: dotPulse 1s ease-in-out infinite;
	}

	.loading-dots span:nth-child(2) { animation-delay: 0.15s; }
	.loading-dots span:nth-child(3) { animation-delay: 0.3s; }

	@keyframes dotPulse {
		0%, 80%, 100% { opacity: 0.3; }
		40% { opacity: 1; }
	}

	/* ── Empty state ── */
	.dropdown-empty {
		padding: 24px 16px;
		text-align: center;
		font-size: 0.82rem;
		color: var(--ft-text-muted);
	}

	/* ── Show all link ── */
	.dropdown-all {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: 100%;
		padding: 14px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-accent);
		background: var(--ft-frost);
		border: none;
		border-top: 1px solid var(--ft-line);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.dropdown-all:hover {
		background: rgba(55, 138, 146, 0.08);
	}

	.dropdown-all:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: -2px;
	}
</style>
