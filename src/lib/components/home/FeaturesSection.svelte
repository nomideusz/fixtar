<script lang="ts">
	const features = [
		{
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			title: 'Gwarancja i Serwis',
			description: 'Pełna gwarancja producenta oraz profesjonalny serwis techniczny',
			color: 'success' as const
		},
		{
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			title: 'Ekspresowa Dostawa',
			description: 'Szybka wysyłka w 24h na terenie całego kraju',
			color: 'brand' as const
		},
		{
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			title: 'Wsparcie Eksperckie',
			description: 'Doradztwo techniczne i pomoc w doborze narzędzi',
			color: 'accent' as const
		}
	] as const;

	const colorStyles = {
		success: { icon: 'bg-success/10 text-success', accent: 'bg-success', hover: 'group-hover:text-success' },
		brand:   { icon: 'bg-brand-600/10 text-brand-600', accent: 'bg-brand-600', hover: 'group-hover:text-brand-600' },
		accent:  { icon: 'bg-accent-600/10 text-accent-600', accent: 'bg-accent-600', hover: 'group-hover:text-accent-600' }
	} as const;
</script>

<section class="py-24 relative overflow-hidden bg-neutral-50">
	<div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
		<div class="text-center mb-16">
			<h2 class="text-5xl lg:text-6xl font-bold font-heading text-neutral-900 mb-6 tracking-tight">
				Dlaczego <span class="text-brand-600">FixTar</span>?
			</h2>
			<p class="text-xl text-neutral-600 max-w-3xl mx-auto">
				Najlepsze marki, profesjonalny serwis i konkurencyjne ceny elektronarzędzi
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each features as feature (feature.title)}
				{@const cs = colorStyles[feature.color]}
				<div class="group bg-white p-8 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-neutral-200 relative">
					<div class="w-16 h-16 {cs.icon} flex items-center justify-center mb-6">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={feature.icon} />
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-neutral-900 mb-4 {cs.hover} transition-colors">{feature.title}</h3>
					<p class="text-neutral-600 leading-relaxed">{feature.description}</p>
					<div class="absolute bottom-0 left-0 right-0 h-1 {cs.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
				</div>
			{/each}
		</div>
	</div>
</section>
