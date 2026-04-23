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
		<h3 class="spec-heading">specyfikacja</h3>
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
			w zestawie
		</h3>
		<ul class="contents-list">
			{#each contents as item, i (item + i)}
				<li class="contents-item">{item}</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.spec-section {
		padding-bottom: 20px;
		border-bottom: 1px solid var(--ft-line);
	}

	.contents-section {
		padding-top: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--ft-line);
	}

	.spec-heading {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 14px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		color: var(--ft-text-muted);
	}

	.spec-table {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--ft-surface);
	}

	.spec-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: start;
		gap: 16px;
		padding: 10px 14px;
		min-width: 0;
		border-top: 1px solid var(--ft-line);
	}

	.spec-row:first-child {
		border-top: none;
	}

	.spec-row.is-alt {
		background: var(--ft-frost);
	}

	.spec-key {
		color: var(--ft-text-muted);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 400;
		line-height: 1.45;
		min-width: 0;
		overflow-wrap: break-word;
	}

	.spec-value {
		color: var(--ft-text-strong);
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		font-weight: 500;
		line-height: 1.45;
		text-align: right;
		min-width: 0;
		overflow-wrap: break-word;
		font-variant-numeric: tabular-nums;
	}

	.contents-list {
		display: grid;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.contents-item {
		position: relative;
		padding: 0 0 0 16px;
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--ft-text);
		line-height: 1.5;
	}

	.contents-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ft-accent);
	}

	@media (max-width: 640px) {
		.spec-row {
			grid-template-columns: 1fr;
			gap: 4px;
		}

		.spec-value {
			text-align: left;
		}
	}
</style>
