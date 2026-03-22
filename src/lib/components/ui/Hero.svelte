<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		image?: string;
		className?: string;
		primaryButton?: {
			text: string;
			href?: string;
			onClick?: () => void;
		};
		secondaryButton?: {
			text: string;
			href?: string;
			onClick?: () => void;
		};
		centered?: boolean;
		fullHeight?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		subtitle,
		image,
		className = '',
		primaryButton,
		secondaryButton,
		centered = false,
		fullHeight = false,
		children
	}: Props = $props();
</script>

<section class="page-hero {fullHeight ? 'min-h-screen' : ''} {className}">
	<div class="page-hero__inner">
		<div class={centered ? 'text-center' : 'items-center lg:grid lg:grid-cols-2 lg:gap-16'}>
			<div class={centered ? 'mx-auto max-w-3xl' : ''}>
				<h1 class="page-hero__title">{title}</h1>

				{#if subtitle}
					<p class="page-hero__subtitle {centered ? 'mx-auto max-w-2xl' : ''}">{subtitle}</p>
				{/if}

				{#if primaryButton || secondaryButton}
					<div class="flex flex-col gap-4 sm:flex-row {centered ? 'justify-center' : ''}">
						{#if primaryButton}
							<Button href={primaryButton.href} onclick={primaryButton.onClick} size="lg">{primaryButton.text}</Button>
						{/if}
						{#if secondaryButton}
							<Button href={secondaryButton.href} onclick={secondaryButton.onClick} variant="secondary" size="lg">{secondaryButton.text}</Button>
						{/if}
					</div>
				{/if}

				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if image && !centered}
				<div class="mt-12 lg:mt-0">
					<img src={image} alt={title} class="h-auto w-full rounded-lg object-cover" width="640" height="400" loading="lazy" />
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.page-hero {
		position: relative;
		border-bottom: 1px solid var(--ft-line);
	}

	.page-hero__inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: clamp(40px, 5vh, 56px) var(--ft-gutter);
	}

	.page-hero__title {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: var(--ft-dark);
		margin-bottom: 12px;
	}

	.page-hero__subtitle {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--ft-text-muted);
		margin-bottom: 24px;
	}
</style>
