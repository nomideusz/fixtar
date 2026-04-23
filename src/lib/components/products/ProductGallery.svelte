<script lang="ts">
	import {
		MagnifyingGlassPlusIcon,
		ImageSquareIcon,
		CaretLeftIcon,
		CaretRightIcon
	} from 'phosphor-svelte';

	interface Props {
		images: string[];
		productName: string;
		badges?: Array<{ label: string; class: string }>;
		selectedImageIndex?: number;
		onZoomRequest?: (index: number) => void;
	}

	let {
		images,
		productName,
		badges = [],
		selectedImageIndex: externalIndex = 0,
		onZoomRequest
	}: Props = $props();

	let selectedImageIndex = $derived.by(() => {
		const maxIndex = Math.max(images.length - 1, 0);
		return Math.min(Math.max(externalIndex, 0), maxIndex);
	});

	const hasMultiple = $derived(images.length > 1);
	const canGoPrev = $derived(selectedImageIndex > 0);
	const canGoNext = $derived(selectedImageIndex < images.length - 1);

	function navigate(delta: number) {
		const next = selectedImageIndex + delta;
		if (next >= 0 && next < images.length) selectedImageIndex = next;
	}

	let thumbContainer: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!thumbContainer) return;
		const active = thumbContainer.children[selectedImageIndex] as HTMLElement;
		active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
	});
</script>

{#if images.length > 0}
	<div class="gallery">
		<!-- Vertical thumbnails (desktop) -->
		{#if hasMultiple}
			<div class="thumb-rail" bind:this={thumbContainer}>
				{#each images as image, index (index)}
					<button
						onclick={() => (selectedImageIndex = index)}
						class="thumb"
						class:is-active={selectedImageIndex === index}
						aria-label="Zdjęcie {index + 1} z {images.length}"
					>
						<img
							src={image}
							alt="{productName} — widok {index + 1}"
							width="72"
							height="72"
							loading="lazy"
							draggable="false"
						/>
					</button>
				{/each}
			</div>
		{/if}

		<!-- Main image area -->
		<div class="main-image-wrap">
			<!-- Badges -->
			{#if badges.length > 0}
				<div class="badge-stack">
					{#each badges as badge (badge.label)}
						<span class="badge {badge.class}">{badge.label}</span>
					{/each}
				</div>
			{/if}

			<!-- Counter -->
			{#if hasMultiple}
				<span class="counter">{selectedImageIndex + 1} / {images.length}</span>
			{/if}

			<!-- Main clickable image -->
			<button
				class="main-image-btn"
				onclick={() => onZoomRequest?.(selectedImageIndex)}
				aria-label="Powiększ zdjęcie produktu"
			>
				<img
					src={images[selectedImageIndex]}
					alt={productName}
					class="main-img"
					width="720"
					height="720"
					draggable="false"
				/>

				<!-- Zoom hint -->
				<div class="zoom-hint" aria-hidden="true">
					<MagnifyingGlassPlusIcon size={18} weight="bold" />
				</div>
			</button>

			<!-- Prev / Next arrows -->
			{#if hasMultiple}
				<button
					class="nav-arrow nav-arrow--prev"
					onclick={() => navigate(-1)}
					disabled={!canGoPrev}
					aria-label="Poprzednie zdjęcie"
				>
					<CaretLeftIcon size={20} weight="bold" />
				</button>
				<button
					class="nav-arrow nav-arrow--next"
					onclick={() => navigate(1)}
					disabled={!canGoNext}
					aria-label="Następne zdjęcie"
				>
					<CaretRightIcon size={20} weight="bold" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Horizontal thumbnails (mobile only, replaces vertical rail) -->
	{#if hasMultiple}
		<div class="thumb-rail-mobile">
			{#each images as image, index (index)}
				<button
					onclick={() => (selectedImageIndex = index)}
					class="thumb-mobile"
					class:is-active={selectedImageIndex === index}
					aria-label="Zdjęcie {index + 1}"
				>
					<img src={image} alt="" width="56" height="56" loading="lazy" draggable="false" />
				</button>
			{/each}
		</div>
	{/if}
{:else}
	<div class="empty-state">
		<ImageSquareIcon size={56} weight="light" aria-hidden="true" />
		<p>Brak zdjęcia produktu</p>
	</div>
{/if}

<style>
	.gallery {
		display: flex;
		gap: 12px;
	}

	.thumb-rail {
		display: none;
		flex-direction: column;
		gap: 8px;
		width: 72px;
		flex-shrink: 0;
		max-height: 560px;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
	}

	.thumb-rail::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 768px) {
		.thumb-rail {
			display: flex;
		}
	}

	.thumb {
		width: 72px;
		height: 72px;
		flex-shrink: 0;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		padding: 4px;
		cursor: pointer;
		opacity: 0.72;
		transition:
			border-color var(--dur-fast) ease,
			opacity var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		clip-path: inset(2px);
	}

	.thumb:hover {
		opacity: 1;
		border-color: var(--ft-line-strong);
	}

	.thumb.is-active {
		opacity: 1;
		border-color: var(--ft-accent);
		background: color-mix(in srgb, var(--ft-accent) 8%, white);
	}

	.main-image-wrap {
		position: relative;
		flex: 1;
		min-width: 0;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		background: var(--ft-surface);
		overflow: hidden;
		transition: border-color var(--dur-med) ease;
	}

	.main-image-wrap:hover {
		border-color: var(--ft-line-strong);
	}

	.main-image-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		aspect-ratio: 1 / 1;
		padding: 20px;
		background: none;
		border: none;
		cursor: zoom-in;
	}

	.main-img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
		clip-path: inset(2px);
		transition: transform 240ms var(--ease-out);
		user-select: none;
	}

	.main-image-btn:hover .main-img {
		transform: scale(1.025);
	}

	.zoom-hint {
		position: absolute;
		right: 12px;
		bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		color: var(--ft-text-muted);
		opacity: 0;
		transition:
			opacity var(--dur-fast) ease,
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.main-image-btn:hover .zoom-hint {
		opacity: 1;
		color: var(--ft-accent-text);
		border-color: var(--ft-accent);
		background: color-mix(in srgb, var(--ft-accent) 8%, white);
	}

	.badge-stack {
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 6px;
		pointer-events: none;
	}

	.badge {
		display: inline-block;
		padding: 4px 10px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: lowercase;
		border: 1px solid transparent;
		border-radius: var(--radius-full);
	}

	.counter {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 2;
		padding: 4px 10px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		color: var(--ft-text-muted);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-full);
		pointer-events: none;
	}

	.nav-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		color: var(--ft-text);
		cursor: pointer;
		opacity: 0;
		transition:
			opacity var(--dur-fast) ease,
			color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			transform var(--dur-fast) ease;
	}

	.main-image-wrap:hover .nav-arrow:not(:disabled) {
		opacity: 1;
	}

	.nav-arrow:hover:not(:disabled) {
		border-color: var(--ft-accent);
		color: var(--ft-accent-text);
		background: color-mix(in srgb, var(--ft-accent) 8%, white);
		transform: translateY(-50%);
	}

	.nav-arrow:disabled {
		opacity: 0 !important;
		cursor: default;
	}

	.nav-arrow--prev {
		left: 8px;
	}

	.nav-arrow--next {
		right: 8px;
	}

	.thumb-rail-mobile {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding: 12px 0 4px;
		scrollbar-width: none;
	}

	.thumb-rail-mobile::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 768px) {
		.thumb-rail-mobile {
			display: none;
		}
	}

	.thumb-mobile {
		width: 56px;
		height: 56px;
		flex-shrink: 0;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		padding: 4px;
		cursor: pointer;
		opacity: 0.72;
		transition:
			border-color var(--dur-fast) ease,
			opacity var(--dur-fast) ease,
			background-color var(--dur-fast) ease;
	}

	.thumb-mobile img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		clip-path: inset(2px);
	}

	.thumb-mobile:hover {
		opacity: 1;
		border-color: var(--ft-line-strong);
	}

	.thumb-mobile.is-active {
		opacity: 1;
		border-color: var(--ft-accent);
		background: color-mix(in srgb, var(--ft-accent) 8%, white);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 400px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-md);
		background: var(--ft-surface);
		color: var(--ft-text-faint);
		gap: 12px;
		font-size: 0.9375rem;
	}
</style>
