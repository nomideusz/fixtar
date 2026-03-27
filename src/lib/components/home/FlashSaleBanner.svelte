<script lang="ts">
	import CountdownTimer from '$lib/components/ui/CountdownTimer.svelte';

	interface Props {
		/** ISO date string when the sale ends */
		endsAt?: string;
		/** Headline text */
		headline?: string;
		/** Link destination */
		href?: string;
	}

	let {
		endsAt = getDefaultEndDate(),
		headline = 'Oferta Błyskawiczna — do -30% na szlifierki',
		href = '/deals'
	}: Props = $props();

	let expired = $state(false);

	function getDefaultEndDate(): string {
		const d = new Date();
		d.setDate(d.getDate() + 3);
		d.setHours(23, 59, 59, 0);
		return d.toISOString();
	}
</script>

{#if !expired}
	<section class="flash-banner" aria-label="Oferta specjalna">
		<div class="ft-container">
			<a {href} class="flash-inner">
				<!-- Pulse dot -->
				<span class="flash-dot" aria-hidden="true">
					<span class="flash-dot-ping"></span>
					<span class="flash-dot-core"></span>
				</span>

				<!-- Text -->
				<span class="flash-text">
					<span class="flash-headline">{headline}</span>
					<span class="flash-timer">
						<CountdownTimer targetDate={endsAt} compact onExpired={() => (expired = true)} />
					</span>
				</span>

				<!-- Arrow -->
				<svg class="flash-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
				</svg>
			</a>
		</div>
	</section>
{/if}

<style>
	.flash-banner {
		background: var(--ft-dark);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.flash-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 10px 0;
		text-decoration: none;
		min-height: 44px;
		transition: opacity var(--dur-fast) ease;
	}

	.flash-inner:hover {
		opacity: 0.9;
	}

	.flash-inner:hover .flash-arrow {
		transform: translateX(3px);
	}

	/* ── Pulse dot ── */
	.flash-dot {
		position: relative;
		width: 8px;
		height: 8px;
		flex-shrink: 0;
	}

	.flash-dot-core {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: var(--ft-cta);
	}

	.flash-dot-ping {
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		background: var(--ft-cta);
		animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	@keyframes ping {
		75%, 100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	/* ── Text ── */
	.flash-text {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.flash-headline {
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 700;
		color: white;
		letter-spacing: 0.01em;
	}

	.flash-timer {
		display: flex;
		align-items: center;
	}

	/* Override countdown compact colors for dark bg */
	.flash-timer :global(.countdown-compact) {
		color: var(--ft-cta);
	}

	.flash-timer :global(.cd-sep) {
		color: rgba(255, 255, 255, 0.3);
	}

	/* ── Arrow ── */
	.flash-arrow {
		color: rgba(255, 255, 255, 0.5);
		flex-shrink: 0;
		transition: transform var(--dur-fast) ease;
	}

	@media (max-width: 480px) {
		.flash-headline {
			font-size: 0.72rem;
		}

		.flash-dot {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flash-dot-ping {
			animation: none;
		}
	}
</style>
