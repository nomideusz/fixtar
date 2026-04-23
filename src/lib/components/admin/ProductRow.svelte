<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import { ImageSquareIcon, SpinnerGapIcon, StarIcon } from 'phosphor-svelte';

	interface Props {
		product: any;
		selected: boolean;
		isLoading: boolean;
		onToggleSelect: () => void;
		onStatusChange: (productId: string, newStatus: string) => void;
		onManageImages: (product: any) => void;
		onToggleFeatured: (product: any) => void;
	}

	let {
		product,
		selected,
		isLoading,
		onToggleSelect,
		onStatusChange,
		onManageImages,
		onToggleFeatured
	}: Props = $props();

	const gallery = $derived((product.gallery ?? []) as string[]);
	const extraCount = $derived(
		gallery.filter((img: string) => img && img !== product.mainImage).length
	);
	const isFeatured = $derived(Boolean(product.featured));
	const inStock = $derived(
		product.inventory?.trackQuantity === false || (product.inventory?.quantity ?? 0) > 0
	);
</script>

<tr class="border-b border-[--ft-line] align-middle hover:bg-[--ft-frost]">
	<td class="px-3 py-2 w-8">
		<input
			type="checkbox"
			checked={selected}
			onchange={onToggleSelect}
			class="rounded border border-[--ft-line]"
		/>
	</td>

	<td class="px-3 py-2">
		<div class="flex items-center gap-3">
			<button
				type="button"
				class="thumb-btn"
				onclick={() => onManageImages(product)}
				aria-label="Zarządzaj zdjęciami — {product.name}"
				title={extraCount > 0 ? `Zarządzaj zdjęciami (${extraCount + 1})` : 'Zarządzaj zdjęciami'}
			>
				{#if product.mainImage}
					<img src={product.mainImage} alt="" loading="lazy" />
				{:else}
					<span class="thumb-empty" aria-hidden="true">
						<ImageSquareIcon class="h-5 w-5" />
					</span>
				{/if}
				{#if extraCount > 0}
					<span class="thumb-count" aria-hidden="true">+{extraCount}</span>
				{/if}
			</button>

			<div class="min-w-0">
				<p class="truncate text-sm text-[--ft-text-strong]" style="max-width: 260px;">
					{product.name}
				</p>
				<p class="stock-line" class:is-out={!inStock}>
					<span class="stock-dot" aria-hidden="true"></span>
					{inStock ? 'w magazynie' : 'brak w magazynie'}
				</p>
			</div>
		</div>
	</td>

	<td class="px-3 py-2 font-mono text-xs whitespace-nowrap text-[--ft-text-muted]">
		{product.sku || '—'}
	</td>

	<td class="px-3 py-2 font-mono text-sm whitespace-nowrap text-[--ft-text]">
		{product.price.toFixed(2)} zł
	</td>

	<td class="px-3 py-2">
		{#if product.expand?.categories?.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each product.expand.categories.slice(0, 2) as category (category.id ?? category.slug ?? category.name)}
					<span
						class="rounded-full border border-[--ft-line] bg-[--ft-surface] px-2 py-0.5 text-xs text-[--ft-text]"
					>
						{category.name}
					</span>
				{/each}
				{#if product.expand.categories.length > 2}
					<span class="text-xs text-[--ft-text-muted]">
						+{product.expand.categories.length - 2}
					</span>
				{/if}
			</div>
		{:else}
			<span class="text-xs text-[--ft-text-faint]">—</span>
		{/if}
	</td>

	<td class="px-3 py-2 whitespace-nowrap">
		<div class="flex items-center gap-2">
			<button
				type="button"
				class="featured-btn"
				class:is-on={isFeatured}
				onclick={() => onToggleFeatured(product)}
				disabled={isLoading}
				title={isFeatured ? 'Usuń z polecanych' : 'Dodaj do polecanych'}
				aria-label={isFeatured ? 'Usuń z polecanych' : 'Dodaj do polecanych'}
				aria-pressed={isFeatured}
			>
				<StarIcon size={14} weight={isFeatured ? 'fill' : 'regular'} aria-hidden="true" />
			</button>
			<StatusBadge status={product.status} />
			{#if isLoading}
				<SpinnerGapIcon
					class="h-3.5 w-3.5 animate-spin text-[--ft-text-muted]"
					aria-hidden="true"
				/>
			{/if}
			<select
				value={product.status}
				onchange={(e) => onStatusChange(product.id, e.currentTarget.value)}
				class="status-select disabled:opacity-50"
				disabled={isLoading}
				title="Change status"
				aria-label="Change status"
			>
				<option value="active">Active</option>
				<option value="draft">Draft</option>
				<option value="inactive">Inactive</option>
			</select>
		</div>
	</td>
</tr>

<style>
	.thumb-btn {
		position: relative;
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		padding: 0;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		overflow: hidden;
		cursor: pointer;
		transition:
			border-color var(--dur-fast) ease,
			box-shadow var(--dur-fast) ease;
	}

	.thumb-btn:hover {
		border-color: var(--ft-text-strong);
	}

	.thumb-btn:focus-visible {
		outline: none;
		border-color: var(--ft-text-strong);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--ft-accent) 70%, transparent);
	}

	.thumb-btn img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: var(--ft-frost);
		color: var(--ft-text-muted);
	}

	.thumb-count {
		position: absolute;
		right: 2px;
		bottom: 2px;
		min-width: 20px;
		height: 16px;
		padding: 0 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--ft-accent);
		color: var(--ft-cta-text);
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		line-height: 1;
		pointer-events: none;
	}

	.status-select {
		padding: 4px 24px 4px 8px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text-muted);
		font-family: var(--font-sans);
		font-size: 0.75rem;
		min-height: 28px;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7276'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 6px center;
		background-size: 12px;
		cursor: pointer;
		transition: border-color var(--dur-fast) ease;
	}

	.status-select:hover {
		border-color: var(--ft-text-muted);
	}

	.status-select:focus {
		outline: none;
		border-color: var(--ft-text-strong);
		color: var(--ft-text);
	}

	.featured-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		background: var(--ft-surface);
		color: var(--ft-text-muted);
		cursor: pointer;
		transition:
			border-color var(--dur-fast) ease,
			background-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.featured-btn:hover:not(:disabled) {
		border-color: var(--ft-text-strong);
		color: var(--ft-text-strong);
	}

	.featured-btn.is-on {
		background: var(--ft-accent);
		border-color: var(--ft-accent);
		color: var(--ft-cta-text);
	}

	.featured-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.stock-line {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 2px;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.02em;
		color: var(--ft-text-muted);
		line-height: 1;
	}

	.stock-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-success);
		flex-shrink: 0;
	}

	.stock-line.is-out {
		color: var(--color-danger);
	}

	.stock-line.is-out .stock-dot {
		background: var(--color-danger);
	}
</style>
