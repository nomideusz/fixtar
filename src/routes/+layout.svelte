<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { userStore, productsStore } from '$lib/stores';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import SimpleCartDrawer from '$lib/components/layout/SimpleCartDrawer.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Notifications from '$lib/components/ui/Notifications.svelte';

	interface Props {
		children?: Snippet;
		data?: { user?: any; isAuthenticated?: boolean };
	}

	let { children, data }: Props = $props();
	let cartOpen = $state(false);

	// Sync server-side user to client store
	$effect(() => {
		if (data?.user) userStore.login(data.user);
	});

	// Prefetch product catalog
	onMount(() => { productsStore.fetchProducts(); });
</script>

<Notifications />
<Navbar onCartOpen={() => (cartOpen = true)} />
<SimpleCartDrawer open={cartOpen} onclose={() => (cartOpen = false)} />

<main class="min-h-screen bg-linear-to-br from-neutral-50 via-white to-neutral-50 pt-20 md:pt-24">
	{@render children?.()}
</main>

<Footer /> 


