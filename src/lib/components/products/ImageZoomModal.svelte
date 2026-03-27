<script lang="ts">
	import { XIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsOutIcon, CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';

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
	style="background-color: var(--ft-surface-overlay); overscroll-behavior: contain;"
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
					<CaretLeftIcon size={20} weight="light" aria-hidden="true" />
				</button>
			{/if}

			<button onclick={zoomOut} class="zoom-control-button" aria-label="Pomniejsz">
				<MagnifyingGlassMinusIcon size={20} weight="light" aria-hidden="true" />
			</button>

			<span class="min-w-15 px-2 text-center text-sm font-medium text-[--ft-text]">
				{Math.round(zoomLevel * 100)}%
			</span>

			<button onclick={zoomIn} class="zoom-control-button" aria-label="Powiększ">
				<MagnifyingGlassPlusIcon size={20} weight="light" aria-hidden="true" />
			</button>

			<button onclick={resetZoom} class="zoom-control-button" aria-label="Resetuj powiększenie">
				<ArrowsOutIcon size={20} weight="light" aria-hidden="true" />
			</button>

			{#if hasMultiple}
				<button
					onclick={() => navigateImage(1)}
					disabled={!canGoNext}
					class="zoom-control-button disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Następne zdjęcie"
				>
					<CaretRightIcon size={20} weight="light" aria-hidden="true" />
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
		<XIcon size={20} weight="light" aria-hidden="true" />
	</button>

	<!-- Backdrop click to close -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="absolute inset-0"
		onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}
		onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
	></div>

	<!-- Image container -->
	<div
		class="relative flex h-full w-full items-center justify-center overflow-hidden p-4"
		style="cursor: {isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'zoom-in'}"
		role="button"
		tabindex="0"
		onwheel={handleWheel}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
		onclick={(e) => {
			// Only zoom if clicking directly on the image
			if (zoomLevel === 1 && (e.target as HTMLElement).tagName === 'IMG') zoomIn();
			// Close if clicking the empty area around the image
			else if ((e.target as HTMLElement).tagName !== 'IMG' && zoomLevel === 1) onClose();
		}}
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
			class="max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-200 select-none"
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
