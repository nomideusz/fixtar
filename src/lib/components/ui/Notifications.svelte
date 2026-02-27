<script lang="ts">
	import { notifications } from '$lib/stores/notifications.svelte';
	import { fly } from 'svelte/transition';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Notification } from '$lib/stores/notifications.svelte';

	const typeClasses: Record<string, string> = {
		success: 'bg-success text-white border-success/40',
		error: 'bg-danger text-white border-danger/40',
		info: 'bg-info text-white border-info/40',
		warning: 'bg-warning text-neutral-900 border-warning/60'
	};

	const messageClasses: Record<string, string> = {
		success: 'text-white/90',
		error: 'text-white/90',
		info: 'text-white/90',
		warning: 'text-neutral-900/90'
	};

	const closeButtonClasses: Record<string, string> = {
		success: 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white',
		error: 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white',
		info: 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white',
		warning: 'bg-black/5 hover:bg-black/10 text-neutral-700 hover:text-neutral-900'
	};

	const iconPaths: Record<string, string> = {
		success: 'M5 13l4 4L19 7',
		error: 'M6 18L18 6M6 6l12 12',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		warning:
			'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
	};

	// Auto-dismiss timer
	let timers = new SvelteMap<string, NodeJS.Timeout>();

	$effect(() => {
		notifications.items.forEach((notification) => {
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

<div class="fixed top-6 right-6 z-9999 max-w-sm space-y-3">
	{#each notifications.items as notification, index (notification.id)}
		<div
			class="group relative transform overflow-hidden rounded-2xl border shadow-xl {typeClasses[
				notification.type
			] || typeClasses.info}"
			transition:fly={{ x: 400, duration: 400, delay: index * 100 }}
			onmouseenter={() => pauseTimer(notification.id)}
			onmouseleave={() => resumeTimer(notification)}
			role="alert"
			aria-live="polite"
		>
			<!-- Content -->
			<div class="relative flex items-start gap-3 p-4">
				<!-- Icon -->
				<div class="relative shrink-0">
					<div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d={iconPaths[notification.type] || iconPaths.info}
							/>
						</svg>
					</div>
				</div>

				<!-- Message -->
				<div class="min-w-0 flex-1">
					<p
						class="text-sm leading-relaxed {messageClasses[notification.type] ||
							messageClasses.info}"
					>
						{notification.message}
					</p>
				</div>

				<!-- Close button -->
				<button
					onclick={() => notifications.remove(notification.id)}
					class="shrink-0 rounded-lg p-1.5 transition-colors duration-200 {closeButtonClasses[
						notification.type
					] || closeButtonClasses.info}"
					aria-label="Zamknij powiadomienie"
				>
					<svg
						class="h-4 w-4 transition-colors"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Progress bar for auto-dismiss -->
			{#if notification.duration && notification.duration > 0}
				<div class="absolute right-0 bottom-0 left-0 h-1 overflow-hidden bg-white/20">
					<div
						class="animate-notification-progress h-full rounded-full bg-white/60"
						style="animation-duration: {notification.duration}ms"
					></div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	/* Component-specific styles only - animations are now in global CSS */
</style>
