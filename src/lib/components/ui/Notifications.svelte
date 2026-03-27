<script lang="ts">
	import { notifications } from '$lib/stores/notifications.svelte';
	import { fly } from 'svelte/transition';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Notification } from '$lib/stores/notifications.svelte';
	import { CheckCircleIcon, XCircleIcon, WarningCircleIcon, InfoIcon, XIcon } from 'phosphor-svelte';

	const typeClasses: Record<string, string> = {
		success: 'bg-success text-[--ft-text] border-success/40',
		error: 'bg-danger !text-white border-danger/40',
		info: 'bg-info text-[--ft-text] border-info/40',
		warning: 'bg-warning text-[--ft-text-strong] border-warning/60'
	};

	const messageClasses: Record<string, string> = {
		success: 'text-[--ft-text]/90',
		error: 'text-[--ft-text]/90',
		info: 'text-[--ft-text]/90',
		warning: 'text-[--ft-text-strong]/90'
	};

	const closeButtonClasses: Record<string, string> = {
		success: 'bg-[--ft-frost] hover:bg-[--ft-line] text-[--ft-text]/70 hover:text-[--ft-text]',
		error: 'bg-[--ft-frost] hover:bg-[--ft-line] text-[--ft-text]/70 hover:text-[--ft-text]',
		info: 'bg-[--ft-frost] hover:bg-[--ft-line] text-[--ft-text]/70 hover:text-[--ft-text]',
		warning: 'bg-black/5 hover:bg-black/10 text-[--ft-text] hover:text-[--ft-text-strong]'
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
					<div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-[--ft-frost]">
						{#if notification.type === 'success'}
							<CheckCircleIcon size={16} weight="fill" aria-hidden="true" />
						{:else if notification.type === 'error'}
							<XCircleIcon size={16} weight="fill" aria-hidden="true" />
						{:else if notification.type === 'warning'}
							<WarningCircleIcon size={16} weight="fill" aria-hidden="true" />
						{:else}
							<InfoIcon size={16} weight="fill" aria-hidden="true" />
						{/if}
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
					<XIcon size={16} weight="light" aria-hidden="true" />
				</button>
			</div>

			<!-- Progress bar for auto-dismiss -->
			{#if notification.duration && notification.duration > 0}
				<div class="absolute right-0 bottom-0 left-0 h-1 overflow-hidden bg-[--ft-frost]">
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
