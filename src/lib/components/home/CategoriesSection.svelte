<script lang="ts">
	interface Category {
		id: string;
		name: string;
		slug: string;
		count: number;
	}

	interface Props {
		categories: Category[];
	}

	let { categories }: Props = $props();
</script>

<section class="categories">
	<div class="categories-inner">
		<div class="categories-label">Kategorie</div>
		<div class="chip-scroll">
			{#each categories as cat (cat.id)}
				<a href="/products?category={cat.slug}" class="chip">
					<span class="chip-name">{cat.name}</span>
					<span class="chip-count">{cat.count}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.categories {
		padding: clamp(40px, 5vh, 56px) 0;
	}

	.categories-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
		text-align: center;
	}

	.categories-label {
		font-size: 0.64rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ft-accent);
		margin-bottom: 16px;
	}

	.chip-scroll {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		margin: 0 calc(-1 * var(--ft-gutter));
		padding: 2px var(--ft-gutter);
	}

	.chip-scroll::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 769px) {
		.chip-scroll {
			flex-wrap: wrap;
			justify-content: center;
			overflow: visible;
			margin: 0;
			padding: 0;
		}
	}

	.chip {
		flex-shrink: 0;
		scroll-snap-align: start;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		min-height: 44px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: 24px;
		text-decoration: none;
		transition: all 0.25s ease;
	}

	.chip:hover {
		border-color: var(--ft-accent);
		background: var(--ft-frost);
		box-shadow: 0 4px 16px rgba(55, 138, 146, 0.06);
	}

	.chip-name {
		font-weight: 500;
		color: var(--ft-dark);
		font-size: 0.85rem;
		white-space: nowrap;
	}

	.chip-count {
		font-size: 0.68rem;
		font-weight: 500;
		color: var(--ft-accent);
	}
</style>
