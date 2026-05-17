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
				<div class="trust-item">
					<span class="trust-icon" aria-hidden="true">
						<svg
							class="hex"
							viewBox="0 0 48 54"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid meet"
						>
							<path
								d="M24 1 L46 13.5 V40.5 L24 53 L2 40.5 V13.5 Z"
								fill="none"
								stroke="currentColor"
								stroke-width="1.4"
							/>
						</svg>
						<span class="icon-inner">
							<Icon size={22} weight="regular" />
						</span>
					</span>
					<span class="trust-text">
						<strong>{item.label}</strong>
						<span>{item.sub}</span>
					</span>
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28px 0;
	}

	.trust-item {
		display: flex;
		align-items: center;
		gap: 14px;
		min-width: 0;
	}

	.trust-icon {
		position: relative;
		width: 48px;
		height: 54px;
		flex: 0 0 auto;
		color: var(--ft-text-faint);
	}

	.trust-icon .hex {
		width: 100%;
		height: 100%;
		display: block;
	}

	.trust-icon .icon-inner {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: var(--ft-text-muted);
	}

	.trust-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.trust-text strong {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ft-text);
	}

	.trust-text span {
		font-size: 13px;
		color: var(--ft-text-faint);
	}

	@media (max-width: 768px) {
		.trust-row {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 18px;
			padding: 22px 0;
		}
	}

	@media (max-width: 480px) {
		.trust-row {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}
</style>
