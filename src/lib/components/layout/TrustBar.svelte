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
			<span class="trust-text">
				Darmowa dostawa od 299 zł<span class="trust-sep" aria-hidden="true">•</span>Gwarancja producenta<span class="trust-sep" aria-hidden="true">•</span>14 dni na zwrot
			</span>
			<button class="trust-dismiss" onclick={dismiss} aria-label="Zamknij pasek informacyjny">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
		padding: 7px var(--ft-gutter);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.trust-text {
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--ft-text);
		letter-spacing: 0.02em;
		text-align: center;
	}

	.trust-sep {
		display: inline-block;
		margin: 0 10px;
		color: var(--ft-text-faint);
		font-size: 0.55rem;
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
		color: var(--ft-text-faint);
		cursor: pointer;
		border-radius: 50%;
		transition: color var(--dur-fast) ease;
	}

	.trust-dismiss:hover {
		color: var(--ft-text-muted);
	}

	.trust-dismiss:focus-visible {
		outline: 2px solid var(--ft-accent);
		outline-offset: 2px;
	}

	@media (max-width: 640px) {
		.trust-text {
			font-size: 0.65rem;
		}

		.trust-sep {
			margin: 0 6px;
		}
	}
</style>
