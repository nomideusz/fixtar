<script lang="ts">
	import type { Snippet } from 'svelte';
	import { languageStore } from '$lib/stores/language.svelte';
	import { translations, type TranslationKey } from '$lib/i18n/translations';

	const {
		title,
		subtitle,
		paddingY = 'py-6 sm:py-8 md:py-10 lg:py-12',
		paddingX = '',
		children,
		titleClass = 'text-neutral-900 text-2xl font-bold',
		subtitleClass = 'mt-2 text-lg text-neutral-600',
		containerClass = '',
		headerSnippet,
		id,
		role,
		ariaLabel,
		dataTestid,
		bgColor = '',
		maxWidth = '',
		titleKey,
		subtitleKey,
		className = ''
	}: {
		title?: string;
		subtitle?: string;
		paddingY?: string;
		paddingX?: string;
		children?: Snippet;
		titleClass?: string;
		subtitleClass?: string;
		containerClass?: string;
		headerSnippet?: Snippet;
		id?: string;
		role?: string;
		ariaLabel?: string;
		dataTestid?: string;
		bgColor?: string;
		maxWidth?: string;
		titleKey?: TranslationKey;
		subtitleKey?: TranslationKey;
		className?: string;
	} = $props();

	function t(key: TranslationKey): string {
		return translations[languageStore.current]?.[key] || translations.en[key] || key;
	}

	const sectionClasses = $derived.by(() => 
		[paddingY, paddingX, containerClass, bgColor, className, 'theme-transition'].filter(Boolean).join(' ')
	);

	const contentClasses = $derived.by(() => 
		maxWidth ? `${maxWidth} mx-auto` : 'max-w-7xl xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto'
	);
</script>

<section class={sectionClasses} {id} {role} aria-label={ariaLabel} data-testid={dataTestid}>
	<div class={contentClasses}>
		{#if headerSnippet}
			{@render headerSnippet()}
		{:else if title || subtitle || titleKey || subtitleKey}
			<div class="mb-6">
				{#if titleKey}
					<h2 class={titleClass}>{t(titleKey)}</h2>
				{:else if title}
					<h2 class={titleClass}>{title}</h2>
				{/if}
				{#if subtitleKey}
					<p class={subtitleClass}>{t(subtitleKey)}</p>
				{:else if subtitle}
					<p class={subtitleClass}>{subtitle}</p>
				{/if}
			</div>
		{/if}

		{#if children}{@render children()}{/if}
	</div>
</section>

