<script lang="ts">
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

	function zoomIn() {
		zoomLevel = Math.min(zoomLevel * 1.5, 5);
	}

	function zoomOut() {
		zoomLevel = Math.max(zoomLevel / 1.5, 0.5);
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
		if (zoomLevel > 1) {
			isDragging = true;
			dragStartX = event.clientX - panX;
			dragStartY = event.clientY - panY;
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging && zoomLevel > 1) {
			panX = event.clientX - dragStartX;
			panY = event.clientY - dragStartY;
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Escape':
				onClose();
				break;
			case '+':
			case '=':
				event.preventDefault();
				zoomIn();
				break;
			case '-':
				event.preventDefault();
				zoomOut();
				break;
			case '0':
				event.preventDefault();
				resetZoom();
				break;
			case 'ArrowLeft':
				navigateImage(-1);
				break;
			case 'ArrowRight':
				navigateImage(1);
				break;
		}
	}

	const canGoPrev = $derived(selectedIndex > 0);
	const canGoNext = $derived(selectedIndex < images.length - 1);
	const hasMultiple = $derived(images.length > 1);

	// Focus trap
	let modalElement = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!modalElement) return;

		const focusableSelectors = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const firstFocusable = modalElement.querySelector<HTMLElement>(focusableSelectors);
		firstFocusable?.focus();

		function handleFocusTrap(e: KeyboardEvent) {
			if (e.key !== 'Tab') return;

			const focusableElements = modalElement!.querySelectorAll<HTMLElement>(focusableSelectors);
			const first = focusableElements[0];
			const last = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last?.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first?.focus();
				}
			}
		}

		document.addEventListener('keydown', handleFocusTrap);
		return () => document.removeEventListener('keydown', handleFocusTrap);
	});
</script>

<div
	bind:this={modalElement}
	class="fixed inset-0 z-50 flex items-center justify-center"
	style="background-color: rgba(0, 0, 0, 0.4); overscroll-behavior: contain;"
	onkeydown={handleKeyDown}
	role="dialog"
	aria-modal="true"
	aria-label="Podgląd zdjęcia produktu"
	tabindex="-1"
>
	<!-- Controls Bar -->
	<div class="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
		<div
			class="flex items-center gap-2 rounded-lg bg-[--ft-frost] p-2 backdrop-blur-sm"
		>
			{#if hasMultiple}
				<button
					onclick={() => navigateImage(-1)}
					disabled={!canGoPrev}
					class="zoom-control-button disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Poprzednie zdjęcie"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			{/if}

			<button onclick={zoomOut} class="zoom-control-button" aria-label="Pomniejsz">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
				</svg>
			</button>

			<span class="min-w-15 px-2 text-center text-sm font-medium text-[--ft-text]">
				{Math.round(zoomLevel * 100)}%
			</span>

			<button onclick={zoomIn} class="zoom-control-button" aria-label="Powiększ">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
			</button>

			<button onclick={resetZoom} class="zoom-control-button" aria-label="Resetuj powiększenie">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			</button>

			{#if hasMultiple}
				<button
					onclick={() => navigateImage(1)}
					disabled={!canGoNext}
					class="zoom-control-button disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Następne zdjęcie"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Close button -->
	<button
		onclick={onClose}
		class="absolute top-4 right-4 z-10 rounded-lg bg-[--ft-frost] p-2 text-[--ft-text] backdrop-blur-sm transition-colors hover:text-[--ft-text-muted]"
		aria-label="Zamknij podgląd"
	>
		<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	</button>

	<!-- Image container -->
	<div
		class="relative flex h-full w-full items-center justify-center overflow-hidden p-4 cursor-{zoomLevel >
		1
			? 'grab'
			: 'zoom-in'} {isDragging ? 'cursor-grabbing' : ''}"
		role="button"
		tabindex="0"
		onwheel={handleWheel}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
		onclick={zoomLevel === 1 ? zoomIn : undefined}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				if (zoomLevel === 1) zoomIn();
			}
		}}
		aria-label="Obraz produktu, kliknij aby powiększyć"
	>
		<img
			src={images[selectedIndex]}
			alt={productName}
			class="max-w-none transition-transform duration-200 select-none"
			style="transform: scale({zoomLevel}) translate({panX / zoomLevel}px, {panY / zoomLevel}px)"
			draggable="false"
		/>
	</div>

	<!-- Image counter -->
	{#if hasMultiple}
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
			<div
				class="rounded-lg bg-[--ft-frost] px-3 py-1 text-sm text-[--ft-text] backdrop-blur-sm"
			>
				{selectedIndex + 1} / {images.length}
			</div>
		</div>
	{/if}

	<!-- Instructions -->
	<div class="absolute right-4 bottom-4 space-y-1 text-xs text-[--ft-text]/70">
		<div>Kliknij aby powiększyć</div>
		<div>Przewiń aby zmienić powiększenie</div>
		<div>Przeciągnij aby przesunąć</div>
		<div>ESC aby zamknąć</div>
	</div>
</div>

<style>
	.zoom-control-button {
		padding: 0.5rem;
		color: var(--ft-text);
		transition: colors 0.2s;
	}

	.zoom-control-button:hover {
		color: var(--ft-text-muted);
	}
</style>
