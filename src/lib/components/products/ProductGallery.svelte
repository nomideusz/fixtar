<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import ImageZoomModal from './ImageZoomModal.svelte';

	interface Props {
		images: string[];
		productName: string;
		badges?: Array<{ label: string; class: string }>;
	}

	let { images, productName, badges = [] }: Props = $props();

	let selectedImageIndex = $state(0);
	let imageZoomed = $state(false);
</script>

<Card class="overflow-hidden">
	{#if images.length > 0}
		<div class="space-y-4">
			<!-- Main Image -->
			<div class="group relative">
				<div class="aspect-square w-full overflow-hidden rounded-xl bg-[--ft-frost]">
					<button
						onclick={() => (imageZoomed = true)}
						class="focus:ring-[--ft-accent] h-full w-full rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
						aria-label="Powiększ zdjęcie produktu"
					>
						<img
							src={images[selectedImageIndex]}
							alt={productName}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							width="600"
							height="600"
						/>
					</button>
				</div>

				<!-- Zoom overlay hint -->
				<div
					class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100"
				>
					<div
						class="rounded-lg bg-[--ft-surface] px-3 py-2 text-sm font-medium text-[--ft-text] backdrop-blur-sm"
					>
						<svg
							class="mr-1 inline h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						Kliknij aby powiększyć
					</div>
				</div>

				<!-- Badges -->
				{#if badges.length > 0}
					<div class="pointer-events-none absolute top-4 left-4 flex flex-col gap-2">
						{#each badges as badge (badge.label)}
							<span
								class="rounded-lg px-3 py-1.5 text-xs font-semibold !text-white shadow-lg {badge.class}"
							>
								{badge.label}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Thumbnails -->
			{#if images.length > 1}
				<div class="flex space-x-3 overflow-x-auto pb-2">
					{#each images as image, index (image)}
						<button
							onclick={() => (selectedImageIndex = index)}
							class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 {selectedImageIndex ===
							index
								? 'border-[--ft-accent] ring-[--ft-accent]/30 ring-2'
								: 'border-[--ft-line] hover:border-[--ft-line]'}"
						>
							<img
								src={image}
								alt={`${productName} widok ${index + 1}`}
								class="h-full w-full object-cover"
								width="80"
								height="80"
								loading="lazy"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex h-96 items-center justify-center rounded-xl bg-[--ft-frost]">
			<div class="text-center">
				<svg
					class="mx-auto mb-4 h-16 w-16 text-[--ft-text-faint]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<p class="text-[--ft-text-muted]">Brak zdjęcia produktu</p>
			</div>
		</div>
	{/if}
</Card>

{#if imageZoomed && images.length > 0}
	<ImageZoomModal
		{images}
		bind:selectedIndex={selectedImageIndex}
		{productName}
		onClose={() => (imageZoomed = false)}
	/>
{/if}
