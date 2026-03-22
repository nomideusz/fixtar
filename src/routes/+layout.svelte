<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import { userStore, languageStore } from '$lib/stores';
	import TrustBar from '$lib/components/layout/TrustBar.svelte';
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

<Notifications />
<TrustBar />
<Navbar onCartOpen={() => (cartOpen = true)} categories={data?.categories ?? []} />
<CartDrawer bind:this={cartDrawerRef} toggleCart={() => (cartOpen = false)} t={layoutT} />

<main>
	{@render children?.()}
</main>

<Footer />

<style>
	main {
		min-height: 100vh;
	}
</style>
