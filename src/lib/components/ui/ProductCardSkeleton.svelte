<script lang="ts">
	interface Props {
		count?: number;
	}

	let { count = 6 }: Props = $props();
</script>

{#each Array(count) as _, i (i)}
	<div class="skeleton-card" style="animation-delay: {i * 80}ms" aria-hidden="true">
		<div class="skeleton-img">
			<div class="skeleton-shimmer"></div>
		</div>
		<div class="skeleton-body">
			<div class="skeleton-line skeleton-title"></div>
			<div class="skeleton-line skeleton-subtitle"></div>
			<div class="skeleton-footer">
				<div class="skeleton-line skeleton-price"></div>
				<div class="skeleton-line skeleton-stock"></div>
			</div>
			<div class="skeleton-line skeleton-btn"></div>
		</div>
	</div>
{/each}

<style>
	.skeleton-card {
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md, 10px);
		overflow: hidden;
		animation: skeletonFadeIn 0.4s ease-out both;
	}

	@keyframes skeletonFadeIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.skeleton-img {
		position: relative;
		aspect-ratio: 4 / 3;
		background: var(--ft-frost);
		overflow: hidden;
	}

	.skeleton-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.5) 50%,
			transparent 100%
		);
		animation: shimmer 1.8s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.skeleton-body {
		padding: 16px;
	}

	.skeleton-line {
		background: var(--ft-frost);
		border-radius: 4px;
	}

	.skeleton-title {
		height: 14px;
		width: 85%;
		margin-bottom: 8px;
	}

	.skeleton-subtitle {
		height: 12px;
		width: 55%;
		margin-bottom: 14px;
	}

	.skeleton-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 14px;
	}

	.skeleton-price {
		height: 16px;
		width: 80px;
	}

	.skeleton-stock {
		height: 10px;
		width: 50px;
	}

	.skeleton-btn {
		height: 44px;
		width: 100%;
		border-radius: var(--radius-sm);
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton-card {
			animation: none;
			opacity: 1;
		}
		.skeleton-shimmer {
			animation: none;
		}
	}
</style>
