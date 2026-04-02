<script lang="ts">
	import { page } from '$app/state';
	import { HouseIcon, CaretRightIcon } from 'phosphor-svelte';

	function formatPathSegment(segment: string): string {
		if (!segment) return '';
		return segment
			.trim()
			.replace(/[-_]/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase())
			.trim();
	}

	const {
		class: customClass = '',
		items
	}: {
		class?: string;
		items?: Array<{ label: string; href: string }>;
	} = $props();

	let pathSegments = $state<Array<{ text: string; href: string; isActive: boolean }>>([]);

	$effect(() => {
		if (items) {
			pathSegments = items.map((item, index) => ({
				text: item.label,
				href: item.href,
				isActive: index === items!.length - 1
			}));
			return;
		}

		const pathname = page.url.pathname;
		if (pathname === '/') {
			pathSegments = [];
			return;
		}

		const segments = pathname.split('/').filter(Boolean);
		pathSegments = segments.map((segment, index) => ({
			text: formatPathSegment(segment),
			href: '/' + segments.slice(0, index + 1).join('/'),
			isActive: index === segments.length - 1
		}));
	});
</script>

{#if page.url.pathname !== '/' || items}
	<nav class="breadcrumb {customClass}" aria-label="Breadcrumb">
		<ol class="breadcrumb-list">
			{#if !items || !items.some((item) => item.href === '/')}
				<li class="breadcrumb-item">
					<a href="/" class="breadcrumb-link">
						<HouseIcon size={16} weight="fill" class="breadcrumb-home-icon" aria-hidden="true" />
						<span class="breadcrumb-home-label">Strona główna</span>
					</a>
				</li>
			{/if}

			{#each pathSegments as segment (segment.href)}
				<li class="breadcrumb-item">
					<CaretRightIcon size={16} weight="bold" class="breadcrumb-separator" aria-hidden="true" />
					{#if !segment.isActive}
						<a href={segment.href} class="breadcrumb-link">
							{segment.text || segment.href.split('/').pop() || ''}
						</a>
					{:else}
						<span class="breadcrumb-current" aria-current="page">
							{segment.text || segment.href.split('/').pop() || ''}
						</span>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.breadcrumb {
		background: var(--ft-frost);
		border-radius: var(--radius-md);
		padding: 0.5rem 1rem;
		border: 1px solid var(--ft-line);
		box-shadow: 0 1px 2px color-mix(in srgb, black 5%, transparent);
		width: 100%;
		overflow: hidden;
	}

	.breadcrumb-list {
		display: flex;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.breadcrumb-list::-webkit-scrollbar {
		display: none;
	}

	.breadcrumb-item {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.breadcrumb-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--ft-text-muted);
		text-decoration: none;
		padding: 0 0.25rem;
		transition: color 0.15s ease;
	}

	.breadcrumb-link:hover {
		color: var(--ft-accent);
	}

	.breadcrumb-home-icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}

	.breadcrumb-home-label {
		display: none;
	}

	@media (min-width: 768px) {
		.breadcrumb-home-label {
			display: inline;
		}
	}

	.breadcrumb-separator {
		width: 1rem;
		height: 1rem;
		color: var(--ft-text-muted);
		margin: 0 0.25rem;
		flex-shrink: 0;
	}

	.breadcrumb-current {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--ft-accent);
		white-space: nowrap;
	}
</style>
