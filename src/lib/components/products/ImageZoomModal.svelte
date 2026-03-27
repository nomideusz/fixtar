<script lang="ts">
	import { XIcon, CaretLeftIcon, CaretRightIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsOutIcon } from 'phosphor-svelte';

	interface Props {
		images: string[];
		selectedIndex: number;
		productName: string;
		onClose: () => void;
	}

	let { images, selectedIndex = $bindable(), productName, onClose }: Props = $props();

	let zoomLevel = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);

	const hasMultiple = $derived(images.length > 1);
	const canGoPrev = $derived(selectedIndex > 0);
	const canGoNext = $derived(selectedIndex < images.length - 1);
	const isZoomed = $derived(zoomLevel > 1);

	function zoomIn() {
		zoomLevel = Math.min(zoomLevel * 1.5, 5);
	}

	function zoomOut() {
		zoomLevel = Math.max(zoomLevel / 1.5, 0.5);
		if (zoomLevel <= 1) { panX = 0; panY = 0; }
	}

	function resetZoom() {
		zoomLevel = 1;
		panX = 0;
		panY = 0;
	}

	function navigateImage(delta: number) {
		const newIndex = selectedIndex + delta;
		if (newIndex >= 0 && newIndex < images.length) {
			selectedIndex = newIndex;
			resetZoom();
		}
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		event.deltaY < 0 ? zoomIn() : zoomOut();
	}

	function handleMouseDown(event: MouseEvent) {
		if (isZoomed) {
			isDragging = true;
			dragStartX = event.clientX - panX;
			dragStartY = event.clientY - panY;
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging && isZoomed) {
			panX = event.clientX - dragStartX;
			panY = event.clientY - dragStartY;
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Escape': onClose(); break;
			case '+': case '=': event.preventDefault(); zoomIn(); break;
			case '-': event.preventDefault(); zoomOut(); break;
			case '0': event.preventDefault(); resetZoom(); break;
			case 'ArrowLeft': navigateImage(-1); break;
			case 'ArrowRight': navigateImage(1); break;
		}
	}

	// Thumbnail container for scroll
	let thumbContainer: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!thumbContainer) return;
		const active = thumbContainer.children[selectedIndex] as HTMLElement;
		active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	});

	// Focus trap
	let modalElement = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!modalElement) return;

		const focusableSelectors = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const firstFocusable = modalElement.querySelector<HTMLElement>(focusableSelectors);
		firstFocusable?.focus();

		// Lock body scroll
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		function handleFocusTrap(e: KeyboardEvent) {
			if (e.key !== 'Tab') return;
			const focusableElements = modalElement!.querySelectorAll<HTMLElement>(focusableSelectors);
			const first = focusableElements[0];
			const last = focusableElements[focusableElements.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
			} else {
				if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
			}
		}

		document.addEventListener('keydown', handleFocusTrap);
		return () => {
			document.removeEventListener('keydown', handleFocusTrap);
			document.body.style.overflow = prevOverflow;
		};
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={modalElement}
	class="lightbox"
	onkeydown={handleKeyDown}
	role="dialog"
	aria-modal="true"
	aria-label="Podgląd zdjęcia produktu — {productName}"
	tabindex="-1"
>
	<!-- ── Top bar ── -->
	<header class="lb-header">
		<div class="lb-header-left">
			{#if hasMultiple}
				<span class="lb-counter">{selectedIndex + 1} / {images.length}</span>
			{/if}
			<span class="lb-product-name">{productName}</span>
		</div>

		<div class="lb-controls">
			<button onclick={zoomOut} class="lb-btn" aria-label="Pomniejsz" title="Pomniejsz (−)">
				<MagnifyingGlassMinusIcon size={18} weight="bold" aria-hidden="true" />
			</button>
			<span class="lb-zoom-level">{Math.round(zoomLevel * 100)}%</span>
			<button onclick={zoomIn} class="lb-btn" aria-label="Powiększ" title="Powiększ (+)">
				<MagnifyingGlassPlusIcon size={18} weight="bold" aria-hidden="true" />
			</button>
			<button onclick={resetZoom} class="lb-btn" aria-label="Resetuj widok" title="Resetuj (0)">
				<ArrowsOutIcon size={18} weight="bold" aria-hidden="true" />
			</button>
			<div class="lb-divider"></div>
			<button onclick={onClose} class="lb-btn lb-btn--close" aria-label="Zamknij podgląd" title="Zamknij (Esc)">
				<XIcon size={20} weight="bold" aria-hidden="true" />
			</button>
		</div>
	</header>

	<!-- ── Image stage ── -->
	<div class="lb-stage">
		<!-- Prev/Next -->
		{#if hasMultiple && canGoPrev}
			<button class="lb-nav lb-nav--prev" onclick={() => navigateImage(-1)} aria-label="Poprzednie zdjęcie">
				<CaretLeftIcon size={28} weight="bold" />
			</button>
		{/if}
		{#if hasMultiple && canGoNext}
			<button class="lb-nav lb-nav--next" onclick={() => navigateImage(1)} aria-label="Następne zdjęcie">
				<CaretRightIcon size={28} weight="bold" />
			</button>
		{/if}

		<!-- Image container -->
		<div
			class="lb-image-area"
			style="cursor: {isDragging ? 'grabbing' : isZoomed ? 'grab' : 'zoom-in'}"
			onwheel={handleWheel}
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			onmouseup={handleMouseUp}
			onmouseleave={handleMouseUp}
			onclick={(e) => {
				if ((e.target as HTMLElement).tagName === 'IMG' && !isZoomed) zoomIn();
				else if ((e.target as HTMLElement).tagName !== 'IMG' && !isZoomed) onClose();
			}}
			role="button"
			tabindex="0"
			onkeydown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !isZoomed) { e.preventDefault(); zoomIn(); } }}
			aria-label="Obraz produktu, kliknij aby powiększyć"
		>
			<img
				src={images[selectedIndex]}
				alt="{productName} — zdjęcie {selectedIndex + 1}"
				class="lb-img"
				class:is-zoomed={isZoomed}
				style="transform: scale({zoomLevel}) translate({panX / zoomLevel}px, {panY / zoomLevel}px)"
				draggable="false"
			/>
		</div>
	</div>

	<!-- ── Bottom thumbnail strip ── -->
	{#if hasMultiple}
		<footer class="lb-footer">
			<div class="lb-thumbs" bind:this={thumbContainer}>
				{#each images as image, index (index)}
					<button
						onclick={() => { selectedIndex = index; resetZoom(); }}
						class="lb-thumb"
						class:is-active={selectedIndex === index}
						aria-label="Zdjęcie {index + 1} z {images.length}"
					>
						<img
							src={image}
							alt=""
							width="56"
							height="56"
							loading="lazy"
							draggable="false"
						/>
					</button>
				{/each}
			</div>
		</footer>
	{/if}
</div>

<style>
	/* ── Full-screen dark lightbox ── */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		flex-direction: column;
		background: #0a0a0a;
		overscroll-behavior: contain;
	}

	/* ── Top bar ── */
	.lb-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 16px;
		height: 52px;
		flex-shrink: 0;
		background: #111;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.lb-header-left {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	.lb-counter {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		white-space: nowrap;
	}

	.lb-product-name {
		font-size: 0.8rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lb-controls {
		display: flex;
		align-items: center;
		gap: 2px;
		flex-shrink: 0;
	}

	.lb-zoom-level {
		min-width: 44px;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		font-variant-numeric: tabular-nums;
	}

	.lb-divider {
		width: 1px;
		height: 24px;
		background: rgba(255, 255, 255, 0.12);
		margin: 0 6px;
	}

	.lb-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition: color 0.15s ease, background 0.15s ease;
	}
	.lb-btn:hover {
		color: #fff;
		background: rgba(255, 255, 255, 0.1);
	}
	.lb-btn--close:hover {
		color: #fff;
		background: rgba(220, 38, 38, 0.5);
	}

	/* ── Image stage ── */
	.lb-stage {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		min-height: 0;
	}

	.lb-image-area {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}

	.lb-img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		transition: transform 0.2s ease;
		user-select: none;
	}
	.lb-img.is-zoomed {
		transition: none; /* instant feedback when dragging */
	}

	/* ── Prev / Next arrows ── */
	.lb-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		width: 48px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
	}
	.lb-nav:hover {
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
	}
	.lb-nav--prev { left: 0; }
	.lb-nav--next { right: 0; }

	/* ── Bottom thumbnail strip ── */
	.lb-footer {
		flex-shrink: 0;
		background: #111;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding: 10px 16px;
	}

	.lb-thumbs {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		justify-content: center;
		scrollbar-width: none;
	}
	.lb-thumbs::-webkit-scrollbar { display: none; }

	.lb-thumb {
		width: 56px;
		height: 56px;
		flex-shrink: 0;
		border: 2px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.05);
		padding: 2px;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.15s ease, border-color 0.15s ease;
	}
	.lb-thumb img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.lb-thumb:hover {
		opacity: 0.8;
		border-color: rgba(255, 255, 255, 0.3);
	}
	.lb-thumb.is-active {
		opacity: 1;
		border-color: var(--ft-accent, #0050A0);
	}

	/* ── Mobile adjustments ── */
	@media (max-width: 640px) {
		.lb-header { padding: 0 10px; height: 48px; }
		.lb-product-name { display: none; }
		.lb-image-area { padding: 12px; }
		.lb-nav { width: 40px; height: 64px; }
		.lb-thumb { width: 48px; height: 48px; }
		.lb-footer { padding: 8px 10px; }
	}
</style>
