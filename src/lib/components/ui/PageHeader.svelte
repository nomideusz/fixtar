<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		eyebrow?: string;
		align?: 'left' | 'center';
	}

	let { title, description, eyebrow, align = 'center' }: Props = $props();
</script>

<section class="page-header header-{align}">
	<div class="ft-container">
		<div class="inner">
			{#if eyebrow}
				<p class="eyebrow ft-eyebrow">{eyebrow}</p>
			{/if}
			<h1 class="title">{title}</h1>
			{#if description}
				<p class="desc">{description}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.page-header {
		border-bottom: 1px solid var(--ft-line);
		padding-block: clamp(40px, 5vh, 56px);
	}

	.inner {
		max-width: 720px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.header-center .inner {
		margin-inline: auto;
		text-align: center;
		align-items: center;
	}

	.eyebrow {
		margin: 0;
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.005em;
		color: var(--ft-text);
		text-transform: uppercase;
		margin: 0;
	}

	.desc {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--ft-ink-500);
		max-width: 56ch;
		margin: 4px 0 0;
	}
</style>
