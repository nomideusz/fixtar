<script lang="ts">
	interface Props {
		specs: Array<{ key: string; value: string }>;
	}

	let { specs }: Props = $props();
</script>

{#if specs.length > 0}
	<div class="pb-5 border-b border-[--ft-line]">
		<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[--ft-text-muted]">Specyfikacja</h3>
		<div class="spec-table">
			{#each specs as spec (spec.key)}
				<div class="spec-row">
					<span class="spec-key">{spec.key}</span>
					<span class="spec-value">{spec.value}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.spec-table {
		display: flex;
		flex-direction: column;
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		padding: 8px 0;
		border-bottom: 1px solid var(--ft-line);
		font-size: 0.85rem;
	}

	.spec-row:last-child {
		border-bottom: none;
	}

	.spec-key {
		color: var(--ft-text-muted);
		font-weight: 500;
		flex-shrink: 0;
	}

	.spec-value {
		color: var(--ft-text-strong);
		font-weight: 600;
		text-align: right;
	}
</style>
