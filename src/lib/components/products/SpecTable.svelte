<script lang="ts">
	import { PackageIcon } from 'phosphor-svelte';

	interface Props {
		specs: Array<{ key: string; value: string }>;
		contents?: string[];
	}

	let { specs, contents = [] }: Props = $props();
</script>

{#if specs.length > 0}
	<div class="spec-section">
		<h3 class="spec-heading">Specyfikacja</h3>
		<div class="spec-table">
			{#each specs as spec, i (spec.key + i)}
				<div class="spec-row" class:is-alt={i % 2 === 0}>
					<span class="spec-key">{spec.key}</span>
					<span class="spec-value">{spec.value}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

{#if contents.length > 0}
	<div class="contents-section">
		<h3 class="spec-heading">
			<PackageIcon size={14} weight="bold" aria-hidden="true" />
			W zestawie
		</h3>
		<ul class="contents-list">
			{#each contents as item, i (item + i)}
				<li class="contents-item">{item}</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	/* ── Section ── */
	.spec-section {
		padding-bottom: 16px;
		border-bottom: 1px solid var(--ft-line);
	}

	.contents-section {
		padding-top: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--ft-line);
	}

	.spec-heading {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 12px;
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ft-text-muted);
	}

	/* ── Spec Table ── */
	.spec-table {
		display: flex;
		flex-direction: column;
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		padding: 7px 8px;
		font-size: 0.82rem;
		min-width: 0;
	}

	.spec-row.is-alt {
		background: var(--ft-frost);
	}

	.spec-key {
		color: var(--ft-text-muted);
		font-weight: 500;
		flex-shrink: 1;
		min-width: 0;
		overflow-wrap: break-word;
	}

	.spec-value {
		color: var(--ft-dark);
		font-weight: 600;
		text-align: right;
		min-width: 0;
		overflow-wrap: break-word;
		font-variant-numeric: tabular-nums;
	}

	/* ── Contents List ── */
	.contents-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.contents-item {
		position: relative;
		padding: 5px 0 5px 16px;
		font-size: 0.82rem;
		color: var(--ft-text);
		line-height: 1.4;
	}

	.contents-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.65em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ft-accent);
	}
</style>
