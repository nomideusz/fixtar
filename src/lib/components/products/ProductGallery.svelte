<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import ImageZoomModal from './ImageZoomModal.svelte';
	import { MagnifyingGlassPlusIcon, ImageSquareIcon } from 'phosphor-svelte';

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
					class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				>
					<div
						class="rounded-lg bg-[--ft-surface] px-3 py-2 text-sm font-medium text-[--ft-text] backdrop-blur-sm"
					>
						<MagnifyingGlassPlusIcon size={16} weight="light" class="mr-1 inline" aria-hidden="true" />
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
							class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors duration-200 {selectedImageIndex ===
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
				<ImageSquareIcon size={64} weight="light" class="mx-auto mb-4 text-[--ft-text-faint]" aria-hidden="true" />
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
