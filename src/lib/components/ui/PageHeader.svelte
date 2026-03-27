<script lang="ts">
	interface Props {
		title: string;
		description?: string;
	}

	let { title, description }: Props = $props();
</script>

<section class="border-b border-[--ft-line]">
	<div class="ft-container header-pad">
		<div class="mx-auto max-w-3xl text-center">
			<h1 class="header-title">{title}</h1>
			{#if description}
				<p class="text-[--ft-text-muted] header-desc">{description}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.header-pad {
		padding-top: clamp(40px, 5vh, 56px);
		padding-bottom: clamp(40px, 5vh, 56px);
	}

	.header-title {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: var(--ft-dark);
		margin-bottom: 12px;
	}

	.header-desc {
		font-size: 1rem;
		line-height: 1.7;
	}
</style>
