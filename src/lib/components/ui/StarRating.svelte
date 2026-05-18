<script lang="ts">
	import { StarIcon } from 'phosphor-svelte';

	interface Props {
		score: number;
		count?: number;
		size?: 'sm' | 'md' | 'lg';
		showScore?: boolean;
	}

	let { score, count, size = 'md', showScore = true }: Props = $props();

	const stars = $derived(
		Array.from({ length: 5 }, (_, i) => {
			const filled = i + 1 <= Math.round(score);
			return filled;
		})
	);

	const px = $derived(size === 'lg' ? 20 : size === 'sm' ? 12 : 14);
</script>

<span class="rating rating-{size}" aria-label="Ocena {score.toFixed(1)} na 5 z {count ?? 0} opinii">
	<span class="stars" aria-hidden="true">
		{#each stars as filled, i (i)}
			<StarIcon size={px} weight={filled ? 'fill' : 'regular'} class={filled ? '' : 'empty'} />
		{/each}
	</span>
	{#if showScore}
		<span class="score">{score.toFixed(1)}</span>
	{/if}
	{#if count !== undefined}
		<span class="count">({count.toLocaleString('pl-PL')})</span>
	{/if}
</span>

<style>
	.rating {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.stars {
		display: inline-flex;
		gap: 2px;
		color: var(--ft-warning);
	}

	.stars :global(svg.empty) {
		color: var(--ft-ink-200);
	}

	.score {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--ft-ink-700);
		margin-left: 6px;
		font-weight: 500;
	}

	.count {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--ft-ink-500);
		margin-left: 4px;
	}

	.rating-lg .score {
		font-size: 15px;
		font-weight: 600;
		font-family: var(--font-sans);
	}
</style>
