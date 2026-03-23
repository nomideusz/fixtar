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
</script>

<section class="categories ft-section">
	<div class="ft-container">
		<h2 class="categories-title">Kategorie</h2>

		<div class="categories-grid">
			{#each categories as category (category.id)}
				<a href="/products?category={category.slug}" class="cat-card">
					<div class="cat-image" aria-hidden="true">
						<!-- Placeholder — replace with category photography -->
					</div>
					<span class="cat-name">{category.name}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.categories-title {
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		font-weight: 700;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		margin-bottom: 32px;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	@media (min-width: 640px) {
		.categories-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.categories-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	.cat-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
	}

	.cat-image {
		aspect-ratio: 4 / 3;
		background: var(--ft-frost);
		border-radius: var(--radius-md);
		transition: background 0.2s ease;
	}

	.cat-card:hover .cat-image {
		background: var(--ft-line);
	}

	.cat-name {
		padding-top: 10px;
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ft-text-strong);
		letter-spacing: -0.01em;
	}
</style>
