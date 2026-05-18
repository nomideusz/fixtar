<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		radius?: string;
	}

	let { width = '100%', height = '12px', radius = '4px' }: Props = $props();
</script>

<span class="skel" style="width: {width}; height: {height}; border-radius: {radius};" aria-hidden="true"></span>

<style>
	@keyframes skel {
		0% {
			background-position: -200px 0;
		}
		100% {
			background-position: calc(200px + 100%) 0;
		}
	}

	.skel {
		display: block;
		background: linear-gradient(
			90deg,
			var(--ft-ink-100) 0%,
			var(--ft-ink-200) 50%,
			var(--ft-ink-100) 100%
		);
		background-size: 200px 100%;
		animation: skel 1.4s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.skel {
			animation: none;
			background: var(--ft-ink-100);
		}
	}
</style>
