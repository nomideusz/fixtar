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

	const includeHome = $derived(!items || !items.some((item) => item.href === '/'));
</script>

{#if page.url.pathname !== '/' || items}
	<nav class="crumbs {customClass}" aria-label="Breadcrumb">
		{#if includeHome}
			<a class="link" href="/">Strona główna</a>
			<span class="sep" aria-hidden="true">/</span>
		{/if}

		{#each pathSegments as segment, i (segment.href)}
			{#if segment.isActive}
				<span class="current" aria-current="page">
					{segment.text || segment.href.split('/').pop() || ''}
				</span>
			{:else}
				<a class="link" href={segment.href}>
					{segment.text || segment.href.split('/').pop() || ''}
				</a>
				<span class="sep" aria-hidden="true">/</span>
			{/if}
		{/each}
	</nav>
{/if}

<style>
	.crumbs {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		font-family: var(--font-sans);
		font-size: 13px;
		line-height: 1.4;
	}

	.link {
		color: var(--ft-ink-500);
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.link:hover {
		color: var(--ft-cyan-600);
	}

	.sep {
		color: var(--ft-ink-300);
		font-family: var(--font-mono);
		font-size: 12px;
		user-select: none;
	}

	.current {
		color: var(--ft-ink-900);
		font-weight: 600;
	}
</style>
