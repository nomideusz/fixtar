<script lang="ts">
	import { page } from '$app/stores';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	
	// Get the product ID from the URL
	const productId = $derived($page.params.id);
</script>

<svelte:head>
	<title>XML Product {productId} | FixTar</title>
	<meta name="description" content="XML Product details" />
</svelte:head>

<PageContainer>
	<div class="py-8">
		<div class="mb-6">
			<a href="/xml-products" class="text-brand-600 hover:text-brand-800 flex items-center">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
				</svg>
				Back to XML Products
			</a>
		</div>
		
		<h1 class="text-3xl font-bold mb-8">XML Product Details</h1>
		
		<div class="bg-brand-50 border border-brand-200 rounded-lg p-6">
			<div class="flex items-center mb-4">
				<svg class="w-8 h-8 text-brand-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<h2 class="text-xl font-semibold text-brand-900">XML Product: {productId}</h2>
			</div>
			
			<p class="text-brand-800 mb-4">
				This would show detailed information for XML product with ID: <strong>{productId}</strong>
			</p>
			
			<div class="bg-white rounded-md p-4 border border-brand-200">
				<h3 class="font-medium text-brand-900 mb-2">Product Features:</h3>
				<ul class="list-disc list-inside text-brand-800 space-y-1">
					<li>Product images and gallery</li>
					<li>Detailed specifications</li>
					<li>Pricing and availability</li>
					<li>Category information</li>
					<li>Related products</li>
				</ul>
			</div>
			
			<div class="mt-4 flex space-x-3">
				<a href="/xml-products" class="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition-colors">
					Back to XML Products
				</a>
				<a href="/products" class="bg-neutral-600 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors">
					View Regular Products
				</a>
			</div>
		</div>
	</div>
</PageContainer> 