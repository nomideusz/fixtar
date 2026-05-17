<script lang="ts">
	import logoBlack from '$lib/images/logo/fixtar-logo-teal-black-trimmed.webp';
	import logoWhite from '$lib/images/logo/fixtar-logo-white.webp';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		inverted?: boolean;
	}

	let { size = 'md', inverted = false }: Props = $props();

	const src = $derived(inverted ? logoWhite : logoBlack);
</script>

<span class="brand" class:is-sm={size === 'sm'} class:is-lg={size === 'lg'}>
	<img {src} alt="FIXTAR" class="logo-img" width="auto" height="48" />
</span>

<style>
	.brand {
		display: inline-flex;
		align-items: center;
		padding-right: 24px;
	}

	.logo-img {
		display: block;
		height: 48px;
		width: auto;
		object-fit: contain;
	}

	.is-sm .logo-img {
		height: 22px;
	}

	.is-lg .logo-img {
		height: 38px;
	}
</style>
