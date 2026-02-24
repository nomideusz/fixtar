
<script lang="ts">
	import { notifications } from '$lib/stores/notifications.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { Notification } from '$lib/stores/notifications.svelte';
	
	const typeClasses: Record<string, string> = {
		success: 'from-success/90 to-success/70 text-white border-success/30',
		error: 'from-danger/90 to-danger/70 text-white border-danger/30',
		info: 'from-info/90 to-brand-700/90 text-white border-info/30',
		warning: 'from-warning/90 to-brand-600/90 text-white border-warning/30'
	};
	
	const iconPaths: Record<string, string> = {
		success: 'M5 13l4 4L19 7',
		error: 'M6 18L18 6M6 6l12 12',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
	};
	
	// Auto-dismiss timer
	let timers = new Map<string, NodeJS.Timeout>();

	$effect(() => {
		notifications.items.forEach(notification => {
			if (!timers.has(notification.id) && notification.duration !== 0) {
				const timer = setTimeout(() => {
					notifications.remove(notification.id);
					timers.delete(notification.id);
				}, notification.duration || 5000);
				timers.set(notification.id, timer);
			}
		});
	});
	
	function pauseTimer(id: string) {
		const timer = timers.get(id);
		if (timer) {
			clearTimeout(timer);
			timers.delete(id);
		}
	}
	
	function resumeTimer(notification: Notification) {
		if (notification.duration !== 0 && !timers.has(notification.id)) {
			const timer = setTimeout(() => {
				notifications.remove(notification.id);
				timers.delete(notification.id);
			}, notification.duration || 5000);
			timers.set(notification.id, timer);
		}
	}
</script>

<div class="fixed top-6 right-6 z-9999 space-y-3 max-w-sm">
	{#each notifications.items as notification, index (notification.id)}
		<div
			class="group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl transform bg-linear-to-r {typeClasses[notification.type] || typeClasses.info}"
			transition:fly={{ x: 400, duration: 400, delay: index * 100 }}
			onmouseenter={() => pauseTimer(notification.id)}
			onmouseleave={() => resumeTimer(notification)}
			role="alert"
			aria-live="polite"
		>
			<!-- Background effects -->
			<div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
			<div class="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent"></div>
			
			<!-- Content -->
			<div class="relative flex items-start p-4 gap-3">
				<!-- Icon with glow effect -->
				<div class="relative shrink-0">
					<div class="absolute inset-0 bg-white/30 rounded-full blur-md"></div>
					<div class="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[notification.type] || iconPaths.info} />
						</svg>
					</div>
				</div>
				
				<!-- Message -->
				<div class="flex-1 min-w-0">
					<p class="text-sm text-white/90 leading-relaxed">
						{notification.message}
					</p>
				</div>
				
				<!-- Close button -->
				<button
					onclick={() => notifications.remove(notification.id)}
					class="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
					aria-label="Zamknij powiadomienie"
				>
					<svg class="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			
			<!-- Progress bar for auto-dismiss -->
			{#if notification.duration && notification.duration > 0}
				<div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
					<div 
						class="h-full bg-white/60 rounded-full animate-notification-progress"
						style="animation-duration: {notification.duration}ms"
					></div>
				</div>
			{/if}
			
			<!-- Floating particles for success notifications -->
			{#if notification.type === 'success'}
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					{#each Array(6) as _, i}
						<div 
							class="absolute w-1 h-1 bg-white/40 rounded-full animate-float-particle"
							style="
								left: {20 + Math.random() * 60}%; 
								top: {20 + Math.random() * 60}%; 
								animation-delay: {Math.random() * 2}s;
								animation-duration: {2 + Math.random() * 2}s;
							"
						></div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	/* Component-specific styles only - animations are now in global CSS */
</style>

