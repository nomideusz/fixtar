<script lang="ts">
	// Using runes mode with Runed utilities
	import { IsMounted, useIntersectionObserver, ElementSize, IsIdle } from 'runed';

	// Component props using $props rune
	let {
		src = undefined,
		alt = '',
		className = '',
		width = null,
		height = null,
		lazy = true,
		placeholder = null,
		style = '',
		quality = 85,
		fetchPriority = 'auto' as 'auto' | 'high' | 'low',
		generatePlaceholder = false,

		// Props for responsive images
		srcset = null,
		sizes = null,
		autoSrcSet = true,
		breakpoints = [320, 640, 768, 1024, 1280, 1536],

		// Props for WebP/AVIF images
		srcWebp = null,
		srcsetWebp = null,
		format = 'auto',

		// Advanced options
		rootMargin = '200px',
		threshold = 0,
		onLoad = (img: HTMLImageElement) => {},
		onError = (img: HTMLImageElement) => {},

		// High quality options
		loadHighResOnIdle = false,
		highResQuality = 95,
		idleTimeout = 3000,

		// New responsive options
		maxWidth = null,
		useDpr = true,
		fitStrategy = 'cover' as 'cover' | 'contain' | 'fill',

		// Render functions
		errorFallback = () => defaultErrorFallback()
	} = $props();

	// Default error fallback
	function defaultErrorFallback() {
		return {
			t: 'div',
			c: 'default-error',
			h: 'Failed to load image'
		};
	}

	// Feature detection through simple checks
	let supportsWebP = $state(false);
	let supportsAvif = $state(false);
	let isHighQuality = $state(false);

	// Check for WebP and AVIF support when component mounts
	$effect(() => {
		// Check WebP support
		const webPImage = new Image();
		webPImage.onload = () => (supportsWebP = true);
		webPImage.onerror = () => (supportsWebP = false);
		webPImage.src =
			'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';

		// Check AVIF support
		const avifImage = new Image();
		avifImage.onload = () => (supportsAvif = true);
		avifImage.onerror = () => (supportsAvif = false);
		avifImage.src =
			'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
	});

	// Basic state management using $state
	let hasError = $state(false);
	let isLoaded = $state(false);
	let isVisible = $state(false);
	let actualWidth = $state(0);
	let actualHeight = $state(0);
	let prevSrc = $state<string | undefined>(undefined);

	// Track when source changes to reset state
	$effect(() => {
		if (prevSrc !== undefined && src !== prevSrc && src) {
			// Reset image state when source changes
			isLoaded = false;
			hasError = false;
			isHighQuality = false;
		}
		prevSrc = src;
	});

	// Element references
	let imgElement = $state<HTMLImageElement | null>(null);
	let containerElement = $state<HTMLDivElement | null>(null);

	// Track component mounting state with Runed's IsMounted
	const isMounted = new IsMounted();

	// Use Runed's intersection observer for better lazy loading
	// Use Runed's intersection observer for better lazy loading
	const observer = useIntersectionObserver(
		() => containerElement,
		(entries) => {
			const [entry] = entries;
			if (entry && entry.isIntersecting) {
				isVisible = true;
				observer.stop();
			}
		},
		{ get rootMargin() { return rootMargin; }, get threshold() { return threshold; } }
	);

	// Setup observer when mounted
	$effect(() => {
		if (isMounted.current && containerElement) {
			// Only observe if lazy loading is enabled
			if (lazy) {
				observer.resume();
			} else {
				isVisible = true;
				observer.stop();
			}

			return () => {
				observer.stop();
			};
		}
	});

	// Handle cleanup when component is destroyed
	$effect(() => {
		// Cleanup function that runs when component is destroyed
		return () => {
			observer.stop();
			// Make sure image element doesn't have pending async operations
			if (imgElement) {
				imgElement.onload = null;
				imgElement.onerror = null;
			}
		};
	});

	// Use ElementSize for responsive behavior
	const size = new ElementSize(() => containerElement);

	// Track dimensions with ElementSize
	$effect(() => {
		if (size.width && size.height) {
			actualWidth = size.width;
			actualHeight = size.height;
		}
	});

	// Use IsIdle to detect when user is idle and load high-quality images
	// Use IsIdle to detect when user is idle and load high-quality images
	const idle = new IsIdle({ get timeout() { return idleTimeout; } });

	// Function to load high quality version
	function loadHighQualityImage() {
		if (!src || isHighQuality || !isMounted.current) return;

		// Only load high quality if enabled and the image is already loaded at normal quality
		if (loadHighResOnIdle && isLoaded) {
			const highQualityImage = new Image();
			// Use high quality setting
			const highQualitySrc = generateHighQualityUrl(src, highResQuality);

			highQualityImage.onload = () => {
				if (imgElement && isMounted.current) {
					imgElement.src = highQualitySrc;
					isHighQuality = true;
				}
			};

			highQualityImage.src = highQualitySrc;
		}
	}

	// Generate high quality URL
	function generateHighQualityUrl(url: string, q: number = highResQuality): string {
		if (!url) return '';

		if (url.includes('?')) {
			return `${url}&q=${q}`;
		} else {
			return `${url}?q=${q}`;
		}
	}

	// Effect to start high quality loading when idle
	$effect(() => {
		if (idle.current && loadHighResOnIdle && !isHighQuality) {
			loadHighQualityImage();
		}
	});

	// Handle image events directly to avoid linter errors
	$effect(() => {
		if (imgElement) {
			// Set up event handlers
			const onLoadHandler = (event: Event) => {
				if (isMounted.current && imgElement) {
					isLoaded = true;
					hasError = false;
					onLoad(imgElement);
				}
			};
			
			const onErrorHandler = (event: Event) => {
				if (isMounted.current && imgElement) {
					hasError = true;
					isLoaded = false;
					onError(imgElement);
				}
			};
			
			// Add event listeners directly to the non-null element
			const img = imgElement; // Create a non-null reference
			img.addEventListener('load', onLoadHandler);
			img.addEventListener('error', onErrorHandler);
			
			// Return cleanup function
			return () => {
				// Use the non-null reference for cleanup
				img.removeEventListener('load', onLoadHandler);
				img.removeEventListener('error', onErrorHandler);
			};
		}
	});

	// Computed values
	const aspectRatio = $derived(width && height ? `${width} / ${height}` : null);
	const effectiveQuality = $derived<number>(quality);

	// Get device pixel ratio for better responsive images
	let devicePixelRatio = $state(1);

	// Update device pixel ratio on mount
	$effect(() => {
		if (isMounted.current && typeof window !== 'undefined') {
			devicePixelRatio = window.devicePixelRatio || 1;
		}
	});

	// Generate improved srcset for responsive images, taking DPR into account
	function generateSrcSet(
		source: string,
		bpoints: number[],
		fmt: string = 'jpeg',
		q: number = 85
	): string {
		if (!source) return '';

		// Remove query parameters if any
		const baseUrl = source.split('?')[0];
		
		// Get unique breakpoints sorted from smallest to largest
		const uniqueBps = [...new Set(bpoints)].sort((a, b) => a - b);
		
		// Calculate device-specific breakpoints if enabled
		const dprMultiplier = useDpr ? Math.min(devicePixelRatio, 3) : 1; // Cap at 3x
		
		// Apply max width constraint if specified
		const finalBps = maxWidth 
			? uniqueBps.filter(bp => bp <= (maxWidth as number))
			: uniqueBps;
		
		// For better performance, limit the number of srcset entries
		// Choose strategic breakpoints instead of all
		const optimizedBps = finalBps.length > 5 
			? [finalBps[0], ...finalBps.filter((_, i) => i % 2 === 0 && i > 0), finalBps[finalBps.length - 1]]
			: finalBps;
		
		// Generate srcset with appropriate widths
		return optimizedBps.map(bp => {
			// Apply DPR multiplier for high-density displays
			const actualWidth = Math.round(bp * dprMultiplier);
			return `${baseUrl}?w=${actualWidth}&q=${q}&fmt=${fmt} ${bp}w`;
		}).join(', ');
	}

	// Improved placeholder generation with appropriate sizing and data URI fallback
	function generateOptimizedPlaceholder(): string | null {
		// If placeholder is explicitly provided, use it
		if (placeholder) return placeholder;
		
		// If generatePlaceholder is false, don't use placeholders
		if (!generatePlaceholder || !src) return null;
		
		// Use a very small placeholder to minimize data usage
		const minWidth = Math.min(20, breakpoints[0] || 20);
		return src.split('?')[0] + `?q=10&w=${minWidth}&blur=10`;
	}
	
	// Use the function in the derived value
	const placeholderUrl = $derived<string | null>(generateOptimizedPlaceholder());

	// Generate default sizes attribute if not provided
	const defaultSizes = $derived<string>(
		sizes || 
		'(max-width: 640px) 100vw, ' + 
		'(max-width: 768px) 90vw, ' +
		'(max-width: 1024px) 60vw, ' +
		'(max-width: 1280px) 50vw, ' +
		'33vw'
	);

	// Determine actual sizes value
	const computedSizes = $derived<string | null>(
		sizes || defaultSizes
	);

	// Computed srcset values with improved responsive strategy
	let computedSrcSet = $derived<string | null>(
		srcset ||
			(autoSrcSet && src ? generateSrcSet(src, breakpoints, 'jpeg', effectiveQuality) : null)
	);

	let computedSrcSetWebp = $derived<string | null>(
		srcsetWebp ||
			(autoSrcSet && src && supportsWebP
				? generateSrcSet(src, breakpoints, 'webp', effectiveQuality)
				: null)
	);

	// Add AVIF format support
	let computedSrcSetAvif = $derived<string | null>(
		autoSrcSet && src && supportsAvif
			? generateSrcSet(src, breakpoints, 'avif', effectiveQuality)
			: null
	);

	// Determine if we should load the image
	const shouldLoad = $derived(lazy ? isVisible : true);

	// Function to determine best image format based on support and quality needs
	function getBestFormat(): string {
		if (format !== 'auto') return format;
		if (supportsAvif) return 'avif';
		if (supportsWebP) return 'webp';
		return 'jpeg';
	}

	// Ensure we use AVIF format when available by forcing the format on URLs
	function ensureCorrectFormat(url: string, preferredFormat: string): string {
		if (!url) return '';
		
		// Extract base URL and existing params
		const [baseUrl, params] = url.split('?');
		const searchParams = new URLSearchParams(params || '');
		
		// Set format explicitly
		searchParams.set('fmt', preferredFormat);
		
		// Return formatted URL
		return `${baseUrl}?${searchParams.toString()}`;
	}

	// Function to determine if we should show a placeholder
	// Only show placeholder when it would be beneficial for UX (visible but not yet loaded)
	const shouldShowPlaceholder = $derived(
		shouldLoad && !isLoaded && !hasError && placeholderUrl && lazy 
	);
</script>

<div
	class={`optimized-image-container ${className}`}
	style={`${aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''} ${style}`}
	bind:this={containerElement}
	data-loading={!isLoaded && !hasError}
	data-error={hasError}
	data-loaded={isLoaded}
	data-high-quality={isHighQuality}
	data-fit={fitStrategy}
	aria-busy={!isLoaded && !hasError}
>
	{#if shouldShowPlaceholder}
		<img
			src={placeholderUrl}
			alt={alt ? `${alt} (loading placeholder)` : 'Loading placeholder'}
			class="placeholder"
			aria-hidden="true"
			loading="lazy" 
			width={Math.min(20, breakpoints[0] || 20)}
			height={Math.min(20, breakpoints[0] || 20)}
		/>
	{/if}

	{#if shouldLoad}
		{#if hasError}
			{@const fallback = errorFallback()}
			<div class={`error-fallback ${fallback.c || ''}`}>
				{#if typeof fallback.h === 'string'}
					{fallback.h}
				{:else if typeof fallback.h === 'function'}
					{@const element = fallback.h()}
					{element}
				{/if}
			</div>
		{:else}
			<picture>
				{#if supportsAvif && (format === 'auto' || format === 'avif')}
					<source
						srcset={computedSrcSetAvif}
						sizes={computedSizes}
						type="image/avif"
					/>
				{/if}

				{#if supportsWebP && (format === 'auto' || format === 'webp')}
					<source srcset={computedSrcSetWebp} sizes={computedSizes} type="image/webp" />
				{/if}

				<!-- Fallback JPEG image - explicitly use jpeg format -->
				<img
					bind:this={imgElement}
					src={src ? ensureCorrectFormat(src, getBestFormat()) : src}
					{alt}
					{width}
					{height}
					srcset={computedSrcSet}
					sizes={computedSizes}
					fetchpriority={fetchPriority}
					class="optimized-image"
					loading={lazy ? 'lazy' : 'eager'}
					decoding="async"
				/>
			</picture>
		{/if}
	{/if}
	
	<!-- Add loading indicator for better UX -->
	{#if !isLoaded && !hasError && shouldLoad}
		<div class="loading-indicator">
			<div class="spinner"></div>
		</div>
	{/if}
</div>

<style>
	.optimized-image-container {
		position: relative;
		overflow: hidden;
		display: block;
		width: 100%;
	}

	.optimized-image-container img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 0.3s ease;
	}
	
	/* Add support for different fit strategies */
	[data-fit="contain"] img {
		object-fit: contain;
	}
	
	[data-fit="fill"] img {
		object-fit: fill;
	}
	
	[data-fit="cover"] img {
		object-fit: cover;
	}

	.placeholder {
		filter: blur(10px);
		transform: scale(1.05);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.error-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: var(--ft-surface-overlay);
		color: var(--ft-text-secondary);
		font-size: 0.875rem;
		border-radius: inherit;
	}

	.default-error {
		padding: 1rem;
		text-align: center;
		background-color: var(--color-danger-light);
		border: 1px dashed var(--color-danger);
		border-radius: 0.375rem;
	}

	[data-loading='true'] .optimized-image {
		opacity: 0;
	}

	[data-loaded='true'] .optimized-image {
		opacity: 1;
	}

	[data-loaded='true'] .placeholder {
		opacity: 0;
	}
	
	/* Loading indicator */
	.loading-indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 5;
	}
	
	.spinner {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 2px solid var(--ft-border);
		border-top-color: var(--ft-primary);
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

