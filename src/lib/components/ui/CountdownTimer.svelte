<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		targetDate: string;
		/** Compact mode shows only numbers, no labels */
		compact?: boolean;
		/** Called when countdown reaches zero */
		onExpired?: () => void;
	}

	let { targetDate, compact = false, onExpired }: Props = $props();

	let days = $state(0);
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
	let expired = $state(false);
	let interval: ReturnType<typeof setInterval>;

	function update() {
		const now = Date.now();
		const target = new Date(targetDate).getTime();
		const diff = target - now;

		if (diff <= 0) {
			days = hours = minutes = seconds = 0;
			expired = true;
			clearInterval(interval);
			onExpired?.();
			return;
		}

		days = Math.floor(diff / (1000 * 60 * 60 * 24));
		hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((diff % (1000 * 60)) / 1000);
	}

	onMount(() => {
		update();
		interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	});

	function pad(n: number): string {
		return n.toString().padStart(2, '0');
	}
</script>

{#if expired}
	<span class="countdown-expired">Oferta wygasła</span>
{:else if compact}
	<span class="countdown-compact" aria-label="Pozostało {days} dni {hours} godzin {minutes} minut {seconds} sekund">
		{#if days > 0}
			<span class="cd-unit">{days}<em>d</em></span>
		{/if}
		<span class="cd-unit">{pad(hours)}<em>h</em></span>
		<span class="cd-sep">:</span>
		<span class="cd-unit">{pad(minutes)}<em>m</em></span>
		<span class="cd-sep">:</span>
		<span class="cd-unit">{pad(seconds)}<em>s</em></span>
	</span>
{:else}
	<div class="countdown" aria-label="Pozostało {days} dni {hours} godzin {minutes} minut {seconds} sekund" role="timer">
		{#if days > 0}
			<div class="cd-block">
				<span class="cd-number">{pad(days)}</span>
				<span class="cd-label">dni</span>
			</div>
			<span class="cd-colon" aria-hidden="true">:</span>
		{/if}
		<div class="cd-block">
			<span class="cd-number">{pad(hours)}</span>
			<span class="cd-label">godz</span>
		</div>
		<span class="cd-colon" aria-hidden="true">:</span>
		<div class="cd-block">
			<span class="cd-number">{pad(minutes)}</span>
			<span class="cd-label">min</span>
		</div>
		<span class="cd-colon" aria-hidden="true">:</span>
		<div class="cd-block">
			<span class="cd-number">{pad(seconds)}</span>
			<span class="cd-label">sek</span>
		</div>
	</div>
{/if}

<style>
	/* ── Full countdown ── */
	.countdown {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.cd-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 48px;
		padding: 8px 10px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
	}

	.cd-number {
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		font-weight: 800;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		line-height: 1.2;
		font-variant-numeric: tabular-nums;
	}

	.cd-label {
		font-size: 0.62rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
		margin-top: 2px;
	}

	.cd-colon {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--ft-text-faint);
		line-height: 1;
		margin-bottom: 14px;
	}

	/* ── Compact countdown ── */
	.countdown-compact {
		display: inline-flex;
		align-items: baseline;
		gap: 2px;
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--ft-accent);
		font-variant-numeric: tabular-nums;
	}

	.cd-unit em {
		font-style: normal;
		font-size: 0.62rem;
		font-weight: 600;
		opacity: 0.7;
	}

	.cd-sep {
		color: var(--ft-text-faint);
		margin: 0 1px;
	}

	/* ── Expired ── */
	.countdown-expired {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ft-text-muted);
	}
</style>
