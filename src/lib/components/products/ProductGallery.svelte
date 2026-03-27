<script lang="ts">
	import ImageZoomModal from './ImageZoomModal.svelte';
	import { MagnifyingGlassPlusIcon, ImageSquareIcon, CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';

	interface Props {
		images: string[];
		productName: string;
		badges?: Array<{ label: string; class: string }>;
	}

	let { images, productName, badges = [] }: Props = $props();

	let selectedImageIndex = $state(0);
	let imageZoomed = $state(false);

	const hasMultiple = $derived(images.length > 1);
	const canGoPrev = $derived(selectedImageIndex > 0);
	const canGoNext = $derived(selectedImageIndex < images.length - 1);

	function navigate(delta: number) {
		const next = selectedImageIndex + delta;
		if (next >= 0 && next < images.length) selectedImageIndex = next;
	}

	// Thumbnail scroll into view
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
				onclick={() => (imageZoomed = true)}
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

{#if imageZoomed && images.length > 0}
	<ImageZoomModal
		{images}
		bind:selectedIndex={selectedImageIndex}
		{productName}
		onClose={() => (imageZoomed = false)}
	/>
{/if}

<style>
	/* ── Layout ── */
	.gallery {
		display: flex;
		gap: 12px;
	}

	/* ── Vertical Thumbnail Rail (desktop) ── */
	.thumb-rail {
		display: none;
		flex-direction: column;
		gap: 6px;
		width: 72px;
		flex-shrink: 0;
		max-height: 560px;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
	}
	.thumb-rail::-webkit-scrollbar { display: none; }

	@media (min-width: 768px) {
		.thumb-rail { display: flex; }
	}

	.thumb {
		width: 72px;
		height: 72px;
		flex-shrink: 0;
		border: 2px solid var(--ft-line);
		background: var(--ft-surface);
		padding: 3px;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.thumb:hover { border-color: var(--ft-text-muted); }
	.thumb.is-active {
		border-color: var(--ft-accent);
	}

	/* ── Main Image ── */
	.main-image-wrap {
		position: relative;
		flex: 1;
		min-width: 0;
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		overflow: hidden;
	}

	.main-image-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		aspect-ratio: 1 / 1;
		padding: 16px;
		background: none;
		border: none;
		cursor: zoom-in;
		position: relative;
	}

	.main-img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
		user-select: none;
	}

	.main-image-btn:hover .main-img {
		transform: scale(1.04);
	}

	/* Zoom hint — bottom-right icon */
	.zoom-hint {
		position: absolute;
		bottom: 12px;
		right: 12px;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		color: var(--ft-text-muted);
		opacity: 0;
		transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}
	.main-image-btn:hover .zoom-hint {
		opacity: 1;
		color: var(--ft-accent);
		border-color: var(--ft-accent);
	}

	/* ── Badges ── */
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
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #fff;
	}

	/* ── Counter ── */
	.counter {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 2;
		padding: 4px 10px;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--ft-text-muted);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		pointer-events: none;
	}

	/* ── Nav Arrows ── */
	.nav-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		color: var(--ft-text);
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s ease, border-color 0.15s ease, color 0.15s ease;
	}
	.main-image-wrap:hover .nav-arrow:not(:disabled) {
		opacity: 1;
	}
	.nav-arrow:hover {
		border-color: var(--ft-accent);
		color: var(--ft-accent);
	}
	.nav-arrow:disabled {
		opacity: 0 !important;
		cursor: default;
	}
	.nav-arrow--prev { left: 8px; }
	.nav-arrow--next { right: 8px; }

	/* ── Mobile Thumbnails (horizontal) ── */
	.thumb-rail-mobile {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding: 10px 0 4px;
		scrollbar-width: none;
	}
	.thumb-rail-mobile::-webkit-scrollbar { display: none; }

	@media (min-width: 768px) {
		.thumb-rail-mobile { display: none; }
	}

	.thumb-mobile {
		width: 56px;
		height: 56px;
		flex-shrink: 0;
		border: 2px solid var(--ft-line);
		background: var(--ft-surface);
		padding: 2px;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}
	.thumb-mobile img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.thumb-mobile:hover { border-color: var(--ft-text-muted); }
	.thumb-mobile.is-active { border-color: var(--ft-accent); }

	/* ── Empty State ── */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 400px;
		border: 1px solid var(--ft-line);
		background: var(--ft-frost);
		color: var(--ft-text-faint);
		gap: 12px;
		font-size: 0.85rem;
	}
</style>
