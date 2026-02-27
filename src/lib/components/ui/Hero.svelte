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

<section
	class="page-hero {fullHeight ? 'min-h-screen' : ''} {className}"
>
	<div class="page-hero__grid"></div>
	<div class="page-hero__noise"></div>

	<div class="page-hero__inner">
		<div class={centered ? 'text-center' : 'items-center lg:grid lg:grid-cols-2 lg:gap-16'}>
			<div class={centered ? 'mx-auto max-w-3xl' : ''}>
				<h1 class="page-hero__title">
					{title}
				</h1>

				{#if subtitle}
					<p class="page-hero__subtitle {centered ? 'mx-auto max-w-2xl' : ''}">
						{subtitle}
					</p>
				{/if}

				{#if primaryButton || secondaryButton}
					<div class="flex flex-col gap-4 sm:flex-row {centered ? 'justify-center' : ''}">
						{#if primaryButton}
							<Button href={primaryButton.href} onclick={primaryButton.onClick} size="lg">
								{primaryButton.text}
							</Button>
						{/if}
						{#if secondaryButton}
							<Button
								href={secondaryButton.href}
								onclick={secondaryButton.onClick}
								variant="glass"
								size="lg"
							>
								{secondaryButton.text}
							</Button>
						{/if}
					</div>
				{/if}

				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if image && !centered}
				<div class="mt-12 lg:mt-0">
					<img src={image} alt={title} class="h-auto w-full object-cover" />
				</div>
			{/if}
		</div>

		{#if image && centered}
			<div class="mx-auto mt-16 max-w-5xl">
				<img src={image} alt={title} class="h-auto w-full object-cover" />
			</div>
		{/if}
	</div>
</section>

<style>
	.page-hero {
		position: relative;
		overflow: hidden;
		background: var(--ft-dark-deeper, #090e13);
		color: var(--ft-dark-text, #ffffff);
	}

	.page-hero__grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-image:
			linear-gradient(rgba(55, 138, 146, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(55, 138, 146, 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 70%);
		-webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 70%);
		pointer-events: none;
	}

	.page-hero__noise {
		position: absolute;
		inset: 0;
		opacity: 0.02;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 256px 256px;
		z-index: 0;
		pointer-events: none;
	}

	.page-hero__inner {
		position: relative;
		z-index: 1;
		max-width: 1536px;
		margin: 0 auto;
		padding: 6rem 1.5rem 4rem;
	}

	@media (min-width: 640px) {
		.page-hero__inner { padding: 7rem 2rem 5rem; }
	}

	@media (min-width: 1024px) {
		.page-hero__inner { padding: 8rem 3rem 5rem; }
	}

	.page-hero__title {
		font-family: var(--font-heading);
		font-size: clamp(2.25rem, 5vw, 3.75rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--ft-dark-text, #ffffff);
		margin-bottom: 1.5rem;
	}

	.page-hero__subtitle {
		font-size: 1.1rem;
		line-height: 1.7;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		margin-bottom: 2rem;
	}
</style>
