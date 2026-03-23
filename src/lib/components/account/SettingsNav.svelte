<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';

	interface SettingsSection {
		id: string;
		title: string;
		description: string;
		iconPath: string;
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
							? 'bg-brand-500/20'
							: 'bg-[--ft-frost]'} transition-colors duration-200"
					>
						<svg
							class="h-5 w-5 {activeSection === section.id
								? 'text-brand-600'
								: 'text-[--ft-text-muted]'}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={section.iconPath}
							/>
						</svg>
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
		transition: all 0.2s;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}

	.settings-nav-active {
		background-color: rgba(255, 107, 0, 0.06);
		border-color: rgba(255, 107, 0, 0.2);
		color: var(--ft-cta);
	}

	.settings-nav-inactive {
		background-color: var(--ft-frost);
		color: var(--ft-text);
	}

	.settings-nav-inactive:hover {
		background-color: rgba(255, 107, 0, 0.04);
		border-color: rgba(255, 107, 0, 0.15);
		color: var(--ft-cta);
	}
</style>
