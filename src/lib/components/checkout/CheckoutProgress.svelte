<script lang="ts">
	interface Step {
		label: string;
		active: boolean;
	}

	interface Props {
		steps: Step[];
	}

	let { steps }: Props = $props();
</script>

<div class="progress">
	<ol class="progress-row" aria-label="Postęp zamówienia">
		{#each steps as step, i (step.label)}
			{#if i > 0}
				<li class="progress-sep" aria-hidden="true"></li>
			{/if}
			<li class="progress-step" class:is-active={step.active}>
				<span class="step-num" aria-hidden="true">{i + 1}</span>
				<span class="step-label">{step.label}</span>
			</li>
		{/each}
	</ol>
</div>

<style>
	.progress {
		margin-bottom: 48px;
	}

	.progress-row {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.progress-step {
		display: inline-flex;
		align-items: center;
		gap: 12px;
	}

	.step-num {
		display: inline-grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 999px;
		border: 1.5px solid var(--ft-line);
		background: #fff;
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--ft-ink-500);
		transition:
			background var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.step-label {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 500;
		color: var(--ft-ink-500);
		transition: color var(--dur-fast) ease;
	}

	.progress-step.is-active .step-num {
		background: var(--ft-cyan);
		border-color: var(--ft-cyan);
		color: #fff;
	}

	.progress-step.is-active .step-label {
		color: var(--ft-ink-900);
		font-weight: 700;
	}

	.progress-sep {
		width: 48px;
		height: 1px;
		background: var(--ft-line);
		list-style: none;
	}

	@media (max-width: 600px) {
		.progress-sep {
			width: 24px;
		}

		.step-label {
			display: none;
		}
	}
</style>
