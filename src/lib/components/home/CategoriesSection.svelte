<script lang="ts">
	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		categories?: Category[];
	}

	let { categories = [] }: Props = $props();

	function displayName(c: Category) {
		return c.slug === 'pneumatyczne-i-budowlane' ? 'Narzędzia budowlane' : c.name;
	}
</script>

{#if categories.length > 0}
	<section class="categories ft-section">
		<div class="ft-container">
			<div class="categories-header">
				<span class="ft-label">kategorie</span>
				<h2 class="categories-title">Przeglądaj kategorie</h2>
			</div>

			<div class="categories-grid ft-stagger">
				{#each categories as category (category.id)}
					<a href="/products?category={category.slug}" class="cat-card">
						<span class="cat-name">{displayName(category)}</span>
						<span class="cat-count">{category.count}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.categories-header {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 24px;
	}

	.categories-title {
		font-family: var(--font-sans);
		font-size: clamp(1.35rem, 2.4vw, 1.75rem);
		font-weight: 400;
		color: var(--ft-text);
		letter-spacing: -0.02em;
		line-height: 1.12;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	@media (min-width: 640px) {
		.categories-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.cat-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 18px;
		background: color-mix(in srgb, var(--ft-surface) 96%, var(--ft-frost));
		border: 1px solid color-mix(in srgb, var(--ft-line) 82%, white);
		border-radius: var(--radius-sm);
		color: var(--ft-text);
		text-decoration: none;
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.cat-card:hover {
		background: var(--ft-surface);
		border-color: var(--ft-line-strong);
		color: var(--ft-text-strong);
	}

	.cat-name {
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 400;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.cat-count {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--ft-text-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
