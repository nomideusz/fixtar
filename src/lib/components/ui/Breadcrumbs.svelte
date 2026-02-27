<script lang="ts">
	import { page } from '$app/state';

	// Function to improve path segment labels
	function formatPathSegment(segment: string): string {
		if (!segment) return '';

		// Trim the segment to remove any whitespace
		segment = segment.trim();

		// Fallback to pretty formatting the URL segment
		return (
			segment
				// Replace hyphens and underscores with spaces
				.replace(/[-_]/g, ' ')
				// Capitalize first letter of each word
				.replace(/\b\w/g, (char) => char.toUpperCase())
				// Trim any remaining whitespace
				.trim()
		);
	}

	// Props
	const {
		class: customClass = '',
		items
	}: {
		class?: string;
		items?: Array<{ label: string; href: string }>;
	} = $props();

	// Create segments in a reactive way
	let pathSegments = $state<Array<{ text: string; href: string; isActive: boolean }>>([]);

	// Update segments when the page or language changes
	$effect(() => {
		// Use provided items if available
		if (items) {
			pathSegments = items.map((item: { label: string; href: string }, index: number) => ({
				text: item.label,
				href: item.href,
				isActive: index === items!.length - 1
			}));
			return;
		}

		const pathname = page.url.pathname;

		// Skip if it's the homepage
		if (pathname === '/') {
			pathSegments = [];
			return;
		}

		// Split path and remove empty segments
		const segments = pathname.split('/').filter(Boolean);

		// Build path segments with proper URLs
		pathSegments = segments.map((segment, index) => {
			// Build the proper href for this segment
			const href = '/' + segments.slice(0, index + 1).join('/');

			return {
				text: formatPathSegment(segment),
				href: href,
				// Is this the last item in the breadcrumb?
				isActive: index === segments.length - 1
			};
		});
	});
</script>

{#if page.url.pathname !== '/' || items}
	<nav class="breadcrumb-cyber text-sm {customClass}" aria-label="Breadcrumb">
		<ol class="flex items-center space-x-2">
			<!-- Only show home link if we're not using custom items, or if custom items don't include home -->
			{#if !items || !items.some((item: { label: string; href: string }) => item.href === '/')}
				<li>
					<a href="/" class="hover:text-brand-600 text-sm font-medium text-neutral-400">
						<span class="flex items-center gap-1.5">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
								/>
							</svg>
							<span class="home-label">Home</span>
						</span>
					</a>
				</li>
			{/if}

			{#each pathSegments as segment (segment)}
				<li class="flex items-center">
					<svg class="mx-2 h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					{#if !segment.isActive}
						<a
							href={segment.href}
							class="hover:text-brand-600 text-sm font-medium text-neutral-400"
						>
							{segment.text || segment.href.split('/').pop() || ''}
						</a>
					{:else}
						<span class="text-brand-600 text-sm font-medium">
							{segment.text || segment.href.split('/').pop() || ''}
						</span>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	/* Breadcrumb — uses FixTar design system tokens */
	:global(.breadcrumb-cyber) {
		position: relative;
		overflow: hidden;
		background: var(--ft-surface-tertiary);
		backdrop-filter: blur(4px);
		border-radius: var(--radius-md);
		padding: 0.5rem 1rem;
		border: 1px solid var(--ft-border);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		width: 100%;
	}

	:global(.breadcrumb-cyber li) {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}

	:global(.breadcrumb-cyber li:not(:last-child)) {
		position: relative;
	}

	:global(.breadcrumb-cyber li:not(:last-child)::after) {
		color: var(--ft-text-muted);
		opacity: 0.8;
	}

	:global(.breadcrumb-cyber a),
	:global(.breadcrumb-cyber span) {
		margin-left: 0 !important;
		margin-right: 0 !important;
	}

	:global(.breadcrumb-cyber a) {
		transition: all 0.2s ease;
		position: relative;
		padding: 0 0.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.breadcrumb-cyber a:hover) {
		color: var(--ft-primary);
	}

	:global(.breadcrumb-cyber a:hover::before) {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0.25rem;
		right: 0.25rem;
		height: 1px;
		background: var(--ft-primary);
		opacity: 0.8;
	}

	:global(.breadcrumb-cyber li:last-child) {
		font-weight: 500;
		color: var(--ft-text-brand);
	}

	.home-label {
		display: none;
	}

	@media (min-width: 768px) {
		.home-label {
			display: inline;
		}
	}

	/* Separator styling */
	:global(.breadcrumb-cyber ol > li + li::before) {
		color: var(--ft-text-muted);
		margin: 0 0.5rem;
		content: '/';
	}
</style>
