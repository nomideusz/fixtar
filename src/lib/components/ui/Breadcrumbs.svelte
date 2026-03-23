<script lang="ts">
	import { page } from '$app/state';

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
						<svg class="breadcrumb-home-icon" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" width="16" height="16">
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
						</svg>
						<span class="breadcrumb-home-label">Strona główna</span>
					</a>
				</li>
			{/if}

			{#each pathSegments as segment (segment.href)}
				<li class="breadcrumb-item">
					<svg class="breadcrumb-separator" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" width="16" height="16">
						<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
					</svg>
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
		flex-wrap: nowrap;
	}

	.breadcrumb-item {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
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
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
