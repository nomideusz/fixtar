<script lang="ts">
	import Button from './Button.svelte';
	
	interface Props {
		title: string;
		subtitle?: string;
		image?: string;
		className?: string;
		primaryButton?: {
			text: string;
			href?: string;
			onClick?: () => void;
		};
		secondaryButton?: {
			text: string;
			href?: string;
			onClick?: () => void;
		};
		centered?: boolean;
		fullHeight?: boolean;
		children?: import('svelte').Snippet;
	}
	
	let { 
		title,
		subtitle,
		image,
		className = '',
		primaryButton,
		secondaryButton,
		centered = false,
		fullHeight = false,
		children
	}: Props = $props();
</script>

<section class="{fullHeight ? 'min-h-screen' : ''} relative overflow-hidden bg-neutral-50 {className}">
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
		<div class="{centered ? 'text-center' : 'lg:grid lg:grid-cols-2 lg:gap-16 items-center'}">
			<!-- Content -->
			<div class="{centered ? 'max-w-3xl mx-auto' : ''}">
				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight tracking-tight">
					{title}
				</h1>
				
				{#if subtitle}
					<p class="text-lg sm:text-xl text-neutral-600 mb-8 leading-relaxed {centered ? 'max-w-2xl mx-auto' : ''}">
						{subtitle}
					</p>
				{/if}
				
				{#if primaryButton || secondaryButton}
					<div class="flex flex-col sm:flex-row gap-4 {centered ? 'justify-center' : ''}">
						{#if primaryButton}
							<Button
								href={primaryButton.href}
								onclick={primaryButton.onClick}
								size="lg"
							>
								{primaryButton.text}
							</Button>
						{/if}
						{#if secondaryButton}
							<Button
								href={secondaryButton.href}
								onclick={secondaryButton.onClick}
								variant="outline"
								size="lg"
							>
								{secondaryButton.text}
							</Button>
						{/if}
					</div>
				{/if}
				
				<!-- Slot for custom content -->
				{#if children}
					{@render children()}
				{/if}
			</div>
			
			<!-- Image -->
			{#if image && !centered}
				<div class="mt-12 lg:mt-0">
					<img 
						src={image} 
						alt={title}
						class="w-full h-auto object-cover shadow-lg"
					/>
				</div>
			{/if}
		</div>
		
		{#if image && centered}
			<div class="mt-16 max-w-5xl mx-auto">
				<img 
					src={image} 
					alt={title}
					class="w-full h-auto object-cover shadow-lg"
				/>
			</div>
		{/if}
	</div>
</section> 
