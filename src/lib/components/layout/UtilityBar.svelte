<script lang="ts">
	import { TruckIcon, ArrowCounterClockwiseIcon, ChatCircleIcon, ShieldCheckIcon } from 'phosphor-svelte';

	const items = [
		{ icon: TruckIcon, label: 'Szybka dostawa', sub: 'w 24/48h' },
		{ icon: ArrowCounterClockwiseIcon, label: '14 dni na zwrot', sub: 'Bez podania przyczyny' },
		{ icon: ChatCircleIcon, label: 'Profesjonalne wsparcie', sub: 'Doradzimy i pomożemy' },
		{ icon: ShieldCheckIcon, label: 'Bezpieczne zakupy', sub: 'SSL i Przelewy24' }
	];
</script>

<div class="utility">
	<div class="ft-container">
		<div class="utility-row">
			{#each items as item, i (i)}
				{@const Icon = item.icon}
				<div class="utility-item">
					<Icon size={14} weight="regular" aria-hidden="true" />
					<strong>{item.label}</strong>
					<span>{item.sub}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.utility {
		background: var(--ft-dark);
		color: rgba(255, 255, 255, 0.8);
		font-size: 12px;
		letter-spacing: 0.02em;
	}

	.utility-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0;
		padding: 10px 0;
	}

	.utility-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 0 24px;
		border-right: 1px solid rgba(255, 255, 255, 0.07);
		min-width: 0;
	}

	.utility-item:first-child {
		justify-content: flex-start;
		padding-left: 0;
	}

	.utility-item:last-child {
		justify-content: flex-end;
		border-right: 0;
		padding-right: 0;
	}

	.utility-item strong {
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 600;
		font-size: 11px;
		white-space: nowrap;
	}

	.utility-item span {
		color: rgba(255, 255, 255, 0.55);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.utility-item :global(svg) {
		color: var(--ft-cyan);
		flex: 0 0 auto;
	}

	@media (max-width: 900px) {
		.utility-row {
			grid-template-columns: repeat(2, 1fr);
		}

		.utility-item {
			padding: 4px 12px;
			border-right: 0;
		}

		.utility-item:nth-child(odd) {
			border-right: 1px solid rgba(255, 255, 255, 0.07);
		}

		.utility-item span {
			display: none;
		}
	}

	@media (max-width: 540px) {
		.utility {
			display: none;
		}
	}
</style>
