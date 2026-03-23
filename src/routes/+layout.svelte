<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import { userStore, languageStore } from '$lib/stores';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import CartDrawer from '$lib/components/layout/CartDrawer.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Notifications from '$lib/components/ui/Notifications.svelte';
	import { translations, type TranslationKey } from '$lib/i18n/translations';

	interface Props {
		children?: Snippet;
		data?: {
			user?: any;
			isAuthenticated?: boolean;
			categories?: Array<{ id: string; name: string; slug: string; count: number }>;
		};
	}

	let { children, data }: Props = $props();
	let cartOpen = $state(false);
	let cartDrawerRef = $state<{
		openDrawer: () => void;
		closeDrawer: () => void;
	} | null>(null);

	const layoutT = (key: TranslationKey) => {
		const lang = browser ? languageStore.current : 'en';
		return translations[lang]?.[key] || translations.en[key] || key;
	};

	$effect(() => {
		if (!cartDrawerRef) return;
		if (cartOpen) {
			cartDrawerRef.openDrawer();
		} else {
			cartDrawerRef.closeDrawer();
		}
	});

	$effect(() => {
		if (data?.user) userStore.login(data.user);
	});
</script>

<a href="#main-content" class="skip-link">Przejdź do treści</a>
<Notifications />
<Navbar onCartOpen={() => (cartOpen = true)} />
<CartDrawer bind:this={cartDrawerRef} toggleCart={() => (cartOpen = false)} t={layoutT} />

<main id="main-content" tabindex="-1">
	{@render children?.()}
</main>

<Footer />

<style>
	.skip-link {
		position: fixed;
		top: 8px;
		left: 16px;
		z-index: 100;
		padding: 10px 20px;
		background: var(--ft-cta);
		color: white;
		font-size: 0.82rem;
		font-weight: 600;
		border-radius: var(--radius-sm);
		text-decoration: none;
		box-shadow: 0 2px 8px color-mix(in srgb, var(--ft-cta) 30%, transparent);
		transform: translateY(-200%);
		transition: transform 0.15s ease;
	}

	.skip-link:focus {
		transform: translateY(0);
		outline: 2px solid var(--ft-cta);
		outline-offset: 2px;
	}

	main {
		min-height: 100dvh;
		outline: none;
	}
</style>
