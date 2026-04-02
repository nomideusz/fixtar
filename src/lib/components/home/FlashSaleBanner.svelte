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
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.flash-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 10px 0;
		text-decoration: none;
		min-height: 44px;
	}

	.flash-inner:hover .flash-headline,
	.flash-inner:hover .flash-arrow {
		color: var(--ft-cta);
	}

	.flash-headline,
	.flash-arrow {
		transition: color var(--dur-fast) ease;
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
		background: var(--ft-cta);
	}

	.flash-dot-ping {
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		background: var(--ft-cta);
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
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 700;
		color: white;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.flash-arrow {
		color: rgba(255, 255, 255, 0.5);
		flex-shrink: 0;
	}

	@media (max-width: 480px) {
		.flash-headline {
			font-size: 0.72rem;
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
