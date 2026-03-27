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

	function dismiss(id: string) {
		pauseTimer(id);
		notifications.remove(id);
	}

	// Swipe-to-dismiss for mobile
	let touchStartX = $state(0);
	let touchStartY = $state(0);
	let swipingId = $state<string | null>(null);
	let swipeOffset = $state(0);

	function handleTouchStart(e: TouchEvent, id: string) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		swipingId = id;
		swipeOffset = 0;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!swipingId) return;
		const dx = e.touches[0].clientX - touchStartX;
		const dy = e.touches[0].clientY - touchStartY;
		// Only swipe horizontally if the gesture is more horizontal than vertical
		if (Math.abs(dx) > Math.abs(dy) && dx > 0) {
			swipeOffset = dx;
		}
	}

	function handleTouchEnd() {
		if (!swipingId) return;
		if (swipeOffset > 100) {
			dismiss(swipingId);
		}
		swipingId = null;
		swipeOffset = 0;
	}
</script>

<!-- Desktop: top-right corner -->
<div class="notification-container notification-container--desktop">
	{#each notifications.items as notification, index (notification.id)}
		<div
			class="notification-item {typeClasses[notification.type] || typeClasses.info}"
			transition:fly={{ x: 400, duration: 400, delay: index * 100 }}
			onmouseenter={() => pauseTimer(notification.id)}
			onmouseleave={() => resumeTimer(notification)}
			role="alert"
			aria-live="polite"
		>
			<div class="notification-content">
				<div class="notification-icon {iconColorClasses[notification.type] || iconColorClasses.info}">
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

				<div class="notification-body">
					<p class="notification-title">
						{#if notification.type === 'success'}Sukces
						{:else if notification.type === 'error'}Błąd
						{:else if notification.type === 'warning'}Uwaga
						{:else}Informacja{/if}
					</p>
					<p class="notification-message">{notification.message}</p>
				</div>

				<button
					onclick={() => dismiss(notification.id)}
					class="notification-close"
					aria-label="Zamknij powiadomienie"
				>
					<XIcon size={16} weight="bold" aria-hidden="true" />
				</button>
			</div>

			{#if notification.duration && notification.duration > 0}
				<div class="notification-progress-track">
					<div
						class="notification-progress-bar animate-notification-progress"
						style="animation-duration: {notification.duration}ms"
					></div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<!-- Mobile: bottom of screen, full-width -->
<div class="notification-container notification-container--mobile">
	{#each notifications.items as notification, index (notification.id)}
		<div
			class="notification-item notification-item--mobile {typeClasses[notification.type] || typeClasses.info}"
			transition:fly={{ y: 80, duration: 300, delay: index * 80 }}
			ontouchstart={(e) => handleTouchStart(e, notification.id)}
			ontouchmove={handleTouchMove}
			ontouchend={handleTouchEnd}
			style={swipingId === notification.id ? `transform: translateX(${swipeOffset}px); opacity: ${1 - swipeOffset / 200}` : ''}
			role="alert"
			aria-live="polite"
		>
			<div class="notification-content notification-content--mobile">
				<div class="notification-icon notification-icon--mobile {iconColorClasses[notification.type] || iconColorClasses.info}">
					{#if notification.type === 'success'}
						<CheckCircleIcon size={20} weight="fill" aria-hidden="true" />
					{:else if notification.type === 'error'}
						<XCircleIcon size={20} weight="fill" aria-hidden="true" />
					{:else if notification.type === 'warning'}
						<WarningCircleIcon size={20} weight="fill" aria-hidden="true" />
					{:else}
						<InfoIcon size={20} weight="fill" aria-hidden="true" />
					{/if}
				</div>

				<p class="notification-message notification-message--mobile">{notification.message}</p>

				<button
					onclick={() => dismiss(notification.id)}
					class="notification-close notification-close--mobile"
					aria-label="Zamknij powiadomienie"
				>
					<XIcon size={14} weight="bold" aria-hidden="true" />
				</button>
			</div>

			{#if notification.duration && notification.duration > 0}
				<div class="notification-progress-track">
					<div
						class="notification-progress-bar animate-notification-progress"
						style="animation-duration: {notification.duration}ms"
					></div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	/* --- Containers --- */

	.notification-container--desktop {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 9999;
		width: 100%;
		max-width: 22rem;
		display: none;
		flex-direction: column;
		gap: 0.75rem;
		pointer-events: none;
	}

	.notification-container--mobile {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column-reverse;
		gap: 0;
		pointer-events: none;
		padding-bottom: env(safe-area-inset-bottom, 0);
	}

	@media (min-width: 640px) {
		.notification-container--desktop {
			display: flex;
		}
		.notification-container--mobile {
			display: none;
		}
	}

	/* --- Shared item styles --- */

	.notification-item {
		position: relative;
		overflow: hidden;
		pointer-events: auto;
		border-radius: var(--radius-sm);
	}

	.notification-content {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		padding-bottom: 1.25rem;
	}

	.notification-icon {
		flex-shrink: 0;
		padding-top: 0.125rem;
	}

	.notification-body {
		min-width: 0;
		flex: 1;
	}

	.notification-title {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--ft-dark);
		margin-bottom: 0.25rem;
	}

	.notification-message {
		font-size: 0.85rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--ft-text-muted);
	}

	.notification-close {
		flex-shrink: 0;
		padding: 0.25rem;
		color: var(--ft-text-faint);
		transition: color 0.15s;
		background: none;
		border: none;
		cursor: pointer;
	}

	.notification-close:hover {
		color: var(--ft-dark);
	}

	/* --- Progress bar --- */

	.notification-progress-track {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 3px;
		overflow: hidden;
		background-color: var(--ft-line);
	}

	.notification-progress-bar {
		height: 100%;
		background-color: var(--ft-dark);
	}

	/* --- Mobile-specific --- */

	.notification-item--mobile {
		border-radius: 0;
		border-left-width: 0 !important;
		border-right-width: 0 !important;
		border-bottom-width: 0 !important;
		border-top: 1px solid var(--ft-line);
		box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08) !important;
		transition: transform 0.15s, opacity 0.15s;
		touch-action: pan-y;
	}

	.notification-content--mobile {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		padding-bottom: 1rem;
	}

	.notification-icon--mobile {
		padding-top: 0;
	}

	.notification-message--mobile {
		flex: 1;
		min-width: 0;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--ft-text);
	}

	.notification-close--mobile {
		padding: 0.375rem;
	}
</style>
