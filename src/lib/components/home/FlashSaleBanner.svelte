<script lang="ts">
	import { ArrowRightIcon } from 'phosphor-svelte';

	interface Props {
		headline?: string;
		href?: string;
	}

	let { headline = 'Sprawdź aktualne promocje', href = '/deals' }: Props = $props();
</script>

<section class="flash-banner" aria-label="Promocje">
	<div class="ft-container">
		<a {href} class="flash-inner">
			<span class="flash-label">promocje</span>

			<span class="flash-dot" aria-hidden="true">
				<span class="flash-dot-ping"></span>
				<span class="flash-dot-core"></span>
			</span>

			<span class="flash-headline">{headline}</span>

			<span class="flash-arrow" aria-hidden="true">
				<ArrowRightIcon size={16} weight="bold" />
			</span>
		</a>
	</div>
</section>

<style>
	.flash-banner {
		background: var(--ft-dark);
		border-bottom: 1px solid color-mix(in srgb, var(--ft-accent) 18%, transparent);
	}

	.flash-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: 44px;
		padding: 10px 0;
		text-decoration: none;
	}

	.flash-inner:hover .flash-headline,
	.flash-inner:hover .flash-arrow,
	.flash-inner:hover .flash-label {
		color: var(--ft-accent-text);
	}

	.flash-headline,
	.flash-arrow,
	.flash-label {
		transition: color var(--dur-fast) ease;
	}

	.flash-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		color: rgba(255, 255, 255, 0.62);
	}

	.flash-dot {
		position: relative;
		width: 8px;
		height: 8px;
		flex-shrink: 0;
	}

	.flash-dot-core {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: var(--ft-accent);
	}

	.flash-dot-ping {
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		background: var(--ft-accent);
		animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.flash-headline {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 400;
		color: white;
		letter-spacing: -0.01em;
	}

	.flash-arrow {
		color: rgba(255, 255, 255, 0.5);
		flex-shrink: 0;
	}

	@media (max-width: 480px) {
		.flash-inner {
			gap: 6px;
		}

		.flash-label {
			display: none;
		}

		.flash-headline {
			font-size: 0.8125rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.flash-dot {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flash-dot-ping {
			animation: none;
		}
	}
</style>
