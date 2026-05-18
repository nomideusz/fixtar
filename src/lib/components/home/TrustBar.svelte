<script lang="ts">
	import { ShieldCheckIcon, GearIcon, HouseIcon, CheckCircleIcon } from 'phosphor-svelte';

	const items = [
		{ icon: ShieldCheckIcon, label: 'Wytrzymałość', sub: 'W ekstremalnych warunkach' },
		{ icon: GearIcon, label: 'Nowoczesna', sub: 'Technologia' },
		{ icon: HouseIcon, label: 'Projektowane', sub: 'w Polsce' },
		{ icon: CheckCircleIcon, label: '2 Lata', sub: 'Gwarancji' }
	];
</script>

<section class="trust" aria-label="Korzyści">
	<div class="ft-container">
		<div class="trust-row">
			{#each items as item, i (i)}
				{@const Icon = item.icon}
				<div class="feature">
					<span class="ico" aria-hidden="true">
						<Icon size={20} weight="regular" />
					</span>
					<div class="text">
						<b>{item.label}</b>
						<span>{item.sub}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.trust {
		background: #fff;
		border-bottom: 1px solid var(--ft-line);
	}

	.trust-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
		padding: 28px 0;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 14px;
		min-width: 0;
	}

	.ico {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm);
		display: grid;
		place-items: center;
		background: var(--ft-cyan-050);
		color: var(--ft-cyan-600);
		flex: 0 0 auto;
	}

	.text {
		display: flex;
		flex-direction: column;
		min-width: 0;
		line-height: 1.3;
	}

	.text b {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ft-ink-900);
	}

	.text span {
		font-size: 13px;
		color: var(--ft-ink-500);
	}

	@media (max-width: 900px) {
		.trust-row {
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
			padding: 22px 0;
		}
	}

	@media (max-width: 480px) {
		.trust-row {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}
</style>
