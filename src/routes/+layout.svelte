<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { userStore, productsStore, languageStore } from '$lib/stores';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import CartDrawer from '$lib/components/layout/CartDrawer.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Notifications from '$lib/components/ui/Notifications.svelte';
	import { translations, type TranslationKey } from '$lib/i18n/translations';

	interface Props {
		children?: Snippet;
		data?: { user?: any; isAuthenticated?: boolean };
	}

	let { children, data }: Props = $props();
	let cartOpen = $state(false);
	let cartDrawerRef = $state<{
		openDrawer: () => void;
		closeDrawer: () => void;
	} | null>(null);

	const layoutT = (key: TranslationKey) => {
		return translations[languageStore.current]?.[key] || translations.en[key] || key;
	};

	$effect(() => {
		if (!cartDrawerRef) return;
		if (cartOpen) {
			cartDrawerRef.openDrawer();
		} else {
			cartDrawerRef.closeDrawer();
		}
	});

	// Sync server-side user to client store
	$effect(() => {
		if (data?.user) userStore.login(data.user);
	});

	// Prefetch product catalog
	onMount(() => { productsStore.fetchProducts(); });
</script>

<Notifications />
<Navbar onCartOpen={() => (cartOpen = true)} />
<CartDrawer bind:this={cartDrawerRef} toggleCart={() => (cartOpen = false)} t={layoutT} />

<main class="layout-main min-h-screen pt-20 md:pt-24">
	{@render children?.()}
</main>

<Footer /> 

<style>
	.layout-main {
		background: linear-gradient(
			to bottom right,
			var(--ft-surface-secondary),
			var(--ft-surface),
			var(--ft-surface-secondary)
		);
	}
</style>


