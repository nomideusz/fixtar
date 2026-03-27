<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { UserIcon, LockIcon, BellIcon, GearIcon } from 'phosphor-svelte';
	import type { Component } from 'svelte';

	const iconMap: Record<string, Component> = { UserIcon, LockIcon, BellIcon, GearIcon };

	interface SettingsSection {
		id: string;
		title: string;
		description: string;
		icon: string;
	}

	interface Props {
		sections: SettingsSection[];
		activeSection: string;
		onSelect: (id: string) => void;
	}

	let { sections, activeSection, onSelect }: Props = $props();
</script>

<Card class="p-6">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each sections as section (section.id)}
			{@const Icon = iconMap[section.icon] ?? GearIcon}
			<button
				onclick={() => onSelect(section.id)}
				class="settings-nav-item {activeSection === section.id
					? 'settings-nav-active'
					: 'settings-nav-inactive'}"
			>
				<div class="flex items-center">
					<div
						class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg {activeSection ===
						section.id
							? 'bg-[--ft-accent]/20'
							: 'bg-[--ft-frost]'} transition-colors duration-200"
					>
						<Icon
							class="h-5 w-5 {activeSection === section.id
								? 'text-[--ft-accent]'
								: 'text-[--ft-text-muted]'}"
							aria-hidden="true"
						/>
					</div>
					<div class="text-left">
						<div class="text-sm font-semibold text-[--ft-text]">{section.title}</div>
						<div class="hidden text-xs text-[--ft-text-muted] sm:block">{section.description}</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</Card>

<style>
	.settings-nav-item {
		padding: 1rem;
		border-radius: 0.75rem;
		border: 1px solid transparent;
		transition: background-color 0.2s, border-color 0.2s, color 0.2s;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}

	.settings-nav-active {
		background-color: var(--ft-cta-light);
		border-color: color-mix(in srgb, var(--ft-cta) 20%, transparent);
		color: var(--ft-cta);
	}

	.settings-nav-inactive {
		background-color: var(--ft-frost);
		color: var(--ft-text);
	}

	.settings-nav-inactive:hover {
		background-color: color-mix(in srgb, var(--ft-cta) 4%, transparent);
		border-color: color-mix(in srgb, var(--ft-cta) 15%, transparent);
		color: var(--ft-cta);
	}
</style>
