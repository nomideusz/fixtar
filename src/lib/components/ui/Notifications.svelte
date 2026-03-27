<script lang="ts">
	import { notifications } from '$lib/stores/notifications.svelte';
	import { fly } from 'svelte/transition';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Notification } from '$lib/stores/notifications.svelte';
	import { CheckCircleIcon, XCircleIcon, WarningCircleIcon, InfoIcon, XIcon } from 'phosphor-svelte';

	const typeClasses: Record<string, string> = {
		success: 'border-l-[4px] border-l-[--color-success] bg-white border-y border-r border-[--ft-line] text-[--ft-dark] shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
		error: 'border-l-[4px] border-l-[--color-danger] bg-white border-y border-r border-[--ft-line] text-[--ft-dark] shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
		info: 'border-l-[4px] border-l-[--color-brand-500] bg-white border-y border-r border-[--ft-line] text-[--ft-dark] shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
		warning: 'border-l-[4px] border-l-[--color-warning] bg-white border-y border-r border-[--ft-line] text-[--ft-dark] shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
	};

	const iconColorClasses: Record<string, string> = {
		success: 'text-[--color-success]',
		error: 'text-[--color-danger]',
		info: 'text-[--color-brand-500]',
		warning: 'text-[--color-warning]'
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

<div class="fixed top-6 right-6 z-[9999] w-full max-w-sm space-y-3 px-4 sm:px-0 pointer-events-none">
	{#each notifications.items as notification, index (notification.id)}
		<div
			class="group relative transform overflow-hidden rounded-[--radius-sm] pointer-events-auto {typeClasses[
				notification.type
			] || typeClasses.info}"
			transition:fly={{ x: 400, duration: 400, delay: index * 100 }}
			onmouseenter={() => pauseTimer(notification.id)}
			onmouseleave={() => resumeTimer(notification)}
			role="alert"
			aria-live="polite"
		>
			<!-- Content -->
			<div class="relative flex items-start gap-4 p-4 pb-5">
				<!-- Icon -->
				<div class="relative shrink-0 pt-0.5">
					<div class="{iconColorClasses[notification.type] || iconColorClasses.info}">
						{#if notification.type === 'success'}
							<CheckCircleIcon size={24} weight="fill" aria-hidden="true" />
						{:else if notification.type === 'error'}
							<XCircleIcon size={24} weight="fill" aria-hidden="true" />
						{:else if notification.type === 'warning'}
							<WarningCircleIcon size={24} weight="fill" aria-hidden="true" />
						{:else}
							<InfoIcon size={24} weight="fill" aria-hidden="true" />
						{/if}
					</div>
				</div>

				<!-- Message -->
				<div class="min-w-0 flex-1">
					<p class="font-display text-[0.8rem] font-bold uppercase tracking-wide text-[--ft-dark] mb-1">
						{#if notification.type === 'success'}Sukces
						{:else if notification.type === 'error'}Błąd
						{:else if notification.type === 'warning'}Uwaga
						{:else}Informacja{/if}
					</p>
					<p class="text-[0.85rem] font-medium leading-snug text-[--ft-text-muted]">
						{notification.message}
					</p>
				</div>

				<!-- Close button -->
				<button
					onclick={() => notifications.remove(notification.id)}
					class="shrink-0 p-1 text-[--ft-text-faint] hover:text-[--ft-dark] transition-colors"
					aria-label="Zamknij powiadomienie"
				>
					<XIcon size={16} weight="bold" aria-hidden="true" />
				</button>
			</div>

			<!-- Progress bar for auto-dismiss -->
			{#if notification.duration && notification.duration > 0}
				<div class="absolute right-0 bottom-0 left-0 h-1 overflow-hidden bg-[--ft-line]">
					<div
						class="animate-notification-progress h-full bg-[--ft-dark]"
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
