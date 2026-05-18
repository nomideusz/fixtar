<script lang="ts">
	interface Stat {
		value: string;
		label: string;
	}

	interface Props {
		stats?: Stat[];
	}

	const DEFAULT_STATS: Stat[] = [
		{ value: '2 500+', label: 'Produktów w katalogu' },
		{ value: '15 000+', label: 'Zrealizowanych zamówień' },
		{ value: '4.8/5', label: 'Średnia ocena klientów' },
		{ value: '98%', label: 'Pozytywnych opinii' }
	];

	let { stats = DEFAULT_STATS }: Props = $props();
</script>

<section class="stats-bar" aria-label="FIXTAR w liczbach">
	<div class="ft-container">
		<dl class="grid">
			{#each stats as stat (stat.label)}
				<div class="stat">
					<dt class="label">{stat.label}</dt>
					<dd class="value">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<style>
	.stats-bar {
		background: var(--ft-ink-900);
		color: #fff;
		padding: 40px 0;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0;
		margin: 0;
	}

	.stat {
		text-align: center;
		padding: 8px 24px;
		border-right: 1px solid rgba(255, 255, 255, 0.08);
	}

	.stat:last-child {
		border-right: 0;
	}

	.value {
		display: block;
		font-family: var(--font-display);
		font-weight: 500;
		font-style: italic;
		font-size: clamp(36px, 4vw, 52px);
		line-height: 1;
		color: var(--ft-cyan-400);
		letter-spacing: -0.01em;
		margin: 0 0 6px;
		text-transform: uppercase;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ft-ink-300);
		font-weight: 500;
	}

	@media (max-width: 700px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
			row-gap: 32px;
		}

		.stat:nth-child(2) {
			border-right: 0;
		}
	}

	@media (max-width: 420px) {
		.grid {
			grid-template-columns: 1fr;
			row-gap: 24px;
		}

		.stat {
			border-right: 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.08);
			padding-bottom: 24px;
		}

		.stat:last-child {
			border-bottom: 0;
		}
	}
</style>
