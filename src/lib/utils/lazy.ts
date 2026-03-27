/**
 * Svelte action for lazy-loading sections with Intersection Observer.
 * Adds `.is-visible` class when element enters viewport.
 *
 * Usage:
 *   <section class="ft-lazy" use:lazyReveal>...</section>
 *
 * Options:
 *   use:lazyReveal={{ threshold: 0.2, rootMargin: '0px 0px -50px 0px' }}
 */
export function lazyReveal(
	node: HTMLElement,
	options?: { threshold?: number; rootMargin?: string }
) {
	// Skip if reduced motion is preferred
	if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('is-visible');
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					observer.unobserve(node);
				}
			}
		},
		{
			threshold: options?.threshold ?? 0.1,
			rootMargin: options?.rootMargin ?? '0px 0px -40px 0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
