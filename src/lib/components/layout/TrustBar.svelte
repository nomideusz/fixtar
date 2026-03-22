<script lang="ts">
	import { browser } from '$app/environment';

	const STORAGE_KEY = 'ft-trust-bar-dismissed';

	let dismissed = $state(false);

	if (browser) {
		dismissed = localStorage.getItem(STORAGE_KEY) === '1';
	}

	function dismiss() {
		dismissed = true;
		if (browser) {
			localStorage.setItem(STORAGE_KEY, '1');
		}
	}
</script>

{#if !dismissed}
	<div class="trust-bar" role="banner">
		<div class="trust-bar-inner">
			<div class="trust-items">
				<span class="trust-item">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
					</svg>
					<span>Darmowa dostawa od 299 zł</span>
				</span>

				<span class="trust-dot" aria-hidden="true">·</span>

				<span class="trust-item">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					<span>Gwarancja producenta</span>
				</span>

				<span class="trust-dot" aria-hidden="true">·</span>

				<span class="trust-item">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
					</svg>
					<span>14 dni na zwrot</span>
				</span>
			</div>

			<button class="trust-dismiss" onclick={dismiss} aria-label="Zamknij pasek informacyjny">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	.trust-bar {
		background: var(--ft-frost);
		border-bottom: 1px solid var(--ft-line);
	}

	.trust-bar-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 8px var(--ft-gutter);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.trust-items {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.trust-item {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--ft-text);
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.trust-item svg {
		color: var(--ft-accent);
		flex-shrink: 0;
	}

	.trust-dot {
		color: var(--ft-text-faint);
		font-size: 0.8rem;
		user-select: none;
	}

	.trust-dismiss {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		border: none;
		background: none;
		color: var(--ft-text-muted);
		cursor: pointer;
		border-radius: 50%;
		transition: color var(--dur-fast) ease, background var(--dur-fast) ease;
	}

	.trust-dismiss:hover {
		color: var(--ft-text);
		background: rgba(0, 0, 0, 0.04);
	}

	.trust-dismiss:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	/* Mobile: hide dots, stack items */
	@media (max-width: 640px) {
		.trust-items {
			gap: 4px 12px;
		}

		.trust-dot {
			display: none;
		}

		.trust-item {
			font-size: 0.68rem;
		}
	}
</style>
