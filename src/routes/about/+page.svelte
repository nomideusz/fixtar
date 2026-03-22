<script lang="ts">
	import Hero from '$lib/components/ui/Hero.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Team members data
	const teamMembers = [
		{
			name: 'Marcin Kowalski',
			role: 'Założyciel & CEO',
			image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
			bio: 'Marcin założył FixTar w 2024 roku po 10 latach doświadczenia w branży narzędziowej, z wizją stworzenia sklepu skoncentrowanego na kliencie.',
			linkedin: '#',
			email: 'marcin@FixTar.pl'
		},
		{
			name: 'Anna Nowak',
			role: 'Marketing & Obsługa Klienta',
			image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
			bio: 'Anna nadzoruje nasze strategie marketingowe i zapewnia, że każdy klient ma wyjątkowe doświadczenie z FixTar.',
			linkedin: '#',
			email: 'anna@FixTar.pl'
		},
		{
			name: 'Tomasz Wiśniewski',
			role: 'Specjalista ds. Technicznych',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
			bio: 'Tomasz to nasz ekspert techniczny, który pomaga klientom w wyborze najlepszych narzędzi do ich potrzeb.',
			linkedin: '#',
			email: 'tomasz@FixTar.pl'
		}
	];

	// Brand values with enhanced design
	const brandValues = [
		{
			title: 'Jakość Przede Wszystkim',
			icon: '🎯',
			description:
				'Współpracujemy z zaufanymi markami i osobiście testujemy produkty przed dodaniem ich do naszego sklepu.',
			color: 'from-brand-500/100 to-brand-600'
		},
		{
			title: 'Innowacyjność',
			icon: '⚡',
			description:
				'Śledzimy najnowsze trendy technologiczne, aby dostarczać najnowsze innowacje naszym klientom.',
			color: 'from-accent-500 to-accent-600'
		},
		{
			title: 'Klient Na Pierwszym Miejscu',
			icon: '👥',
			description:
				'Oferujemy spersonalizowaną obsługę i porady techniczne, aby pomóc znaleźć idealne rozwiązanie.',
			color: 'from-success to-success'
		},
		{
			title: 'Profesjonalizm',
			icon: '🏆',
			description:
				'Wysokie standardy obsługi i profesjonalne doradztwo w każdym aspekcie naszej działalności.',
			color: 'from-brand-500/100 to-brand-600'
		},
		{
			title: 'Szybkość Działania',
			icon: '🚀',
			description: 'Szybka realizacja zamówień i błyskawiczna odpowiedź na zapytania klientów.',
			color: 'from-danger to-danger-dark'
		},
		{
			title: 'Wsparcie Techniczne',
			icon: '🔧',
			description: 'Kompleksowe wsparcie techniczne długo po dokonaniu zakupu.',
			color: 'from-brand-500/100 to-brand-600'
		}
	];

	// Company stats
	const stats = [
		{ value: '2024', label: 'Rok założenia' },
		{ value: '5000+', label: 'Zadowolonych klientów' },
		{ value: '1200+', label: 'Produktów w ofercie' },
		{ value: '99%', label: 'Pozytywnych opinii' }
	];
</script>

<svelte:head>
	<title>O Nas - FixTar</title>
	<meta
		name="description"
		content="Poznaj FixTar - Twój zaufany sklep z profesjonalnymi narzędziami i elektronarzędziami najlepszych marek."
	/>
</svelte:head>

<!-- Modern Professional Hero Section -->
<Hero
	title="O Nas"
	subtitle="Poznaj historię i wartości, które kierują nami w codziennej pracy. Jesteśmy zespołem pasjonatów narzędzi, którzy chcą dzielić się swoją wiedzą i doświadczeniem."
	centered={true}
/>

<!-- Main Content -->
<div>
	<div class="ft-container px-6 py-16 sm:px-8 lg:px-12">
		<!-- Company Story Section -->
		<section class="mb-20">
			<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
				<div class="order-2 lg:order-1">
					<div class="space-y-6">
						<div
							class="bg-brand-100 text-brand-800 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
						>
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Nasza Historia
						</div>

						<h2 class="text-4xl leading-tight font-bold text-[--ft-text]">
							Pasja do Narzędzi Od 2024 Roku
						</h2>

						<div class="space-y-4 text-lg leading-relaxed text-neutral-400">
							<p>
								FixTar narodziło się z prostej idei: dostarczanie najlepszych profesjonalnych
								narzędzi z profesjonalną obsługą i ekspercką wiedzą. Założyliśmy firmę, aby ułatwić
								zakup elektronarzędzi najlepszych marek — Stihl, Makita, Bosch, DeWalt, Milwaukee.
							</p>
							<p>
								Nasza misja to nie tylko sprzedaż narzędzi, ale budowanie długotrwałych relacji z
								klientami poprzez doradztwo techniczne, wsparcie posprzedażowe i ciągłe doskonalenie
								naszych usług.
							</p>
						</div>

						<!-- Enhanced Features List -->
						<div class="space-y-4">
							{#each [{ title: 'Eksperckie Doradztwo', desc: 'Personalizowane rekomendacje od naszych specjalistów' }, { title: 'Gwarancja Jakości', desc: 'Każdy produkt jest starannie testowany i wybrany' }, { title: 'Wsparcie Techniczne', desc: 'Ciągłe wsparcie długo po dokonaniu zakupu' }, { title: 'Szybka Dostawa', desc: 'Realizacja zamówień w 24 godziny' }] as item (item.title)}
								<div class="group flex items-start">
									<div class="mt-1 shrink-0">
										<div
											class="from-brand-500/100 to-accent-600 flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-r transition-transform duration-200 group-hover:scale-110"
										>
											<svg
												class="h-3 w-3 text-[--ft-text]"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									</div>
									<div class="ml-4">
										<span class="font-semibold text-[--ft-text]">{item.title}:</span>
										<span class="text-neutral-400"> {item.desc}</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="order-1 lg:order-2">
					<Card class="overflow-hidden">
						<div
							class="from-brand-500/100/20 to-accent-500/100/20 flex aspect-4/3 items-center justify-center bg-linear-to-br"
						>
							<img
								src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"
								alt="Sklep z narzędziami FixTar"
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
					</Card>
				</div>
			</div>
		</section>

		<!-- Stats Section -->
		<section class="mb-20">
			<Card class="border-2 border-white/10 bg-linear-to-br from-white/5 to-white/3 p-12">
				<div class="mb-12 text-center">
					<h2 class="mb-4 text-3xl font-bold text-[--ft-text]">FixTar w Liczbach</h2>
					<p class="text-lg text-neutral-400">Nasze osiągnięcia mówią same za siebie</p>
				</div>
				<div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
					{#each stats as stat (stat)}
						<div class="group text-center">
							<div class="relative">
								<div
									class="from-brand-600 to-accent-600 mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent transition-transform duration-200 group-hover:scale-110 lg:text-5xl"
								>
									{stat.value}
								</div>
								<p class="text-sm font-medium tracking-wide text-neutral-400 uppercase">
									{stat.label}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</Card>
		</section>

		<!-- Values Section -->
		<section class="mb-20">
			<div class="mb-16 text-center">
				<div
					class="bg-accent-100 text-accent-800 mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
					Nasze Wartości
				</div>
				<h2 class="mb-6 text-4xl font-bold text-[--ft-text]">Co Nas Motywuje</h2>
				<p class="mx-auto max-w-3xl text-xl text-neutral-400">
					Nasze podstawowe wartości kształtują sposób, w jaki prowadzimy biznes i budujemy relacje z
					klientami
				</p>
			</div>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each brandValues as value (value)}
					<Card hover class="group">
						<div class="relative overflow-hidden">
							<!-- Gradient background -->
							<div
								class="absolute inset-0 bg-linear-to-br {value.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10"
							></div>

							<div class="relative p-8 text-center">
								<div
									class="mb-6 transform text-5xl transition-transform duration-300 group-hover:scale-110"
								>
									{value.icon}
								</div>
								<h3
									class="group-hover:text-brand-600 mb-4 text-xl font-bold text-[--ft-text] transition-colors duration-300"
								>
									{value.title}
								</h3>
								<p class="leading-relaxed text-neutral-400">
									{value.description}
								</p>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</section>

		<!-- Team Section -->
		<section>
			<div class="mb-16 text-center">
				<div
					class="bg-success/10 text-success-dark mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					Nasz Zespół
				</div>
				<h2 class="mb-6 text-4xl font-bold text-[--ft-text]">Poznaj Ludzi Za FixTar</h2>
				<p class="mx-auto max-w-3xl text-xl text-neutral-400">
					Nasz zespół składa się z pasjonatów narzędzi, którzy codziennie pracują nad tym, aby
					dostarczać najlepsze doświadczenia naszym klientom
				</p>
			</div>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each teamMembers as member (member)}
					<Card hover class="group">
						<div class="text-center">
							<div class="relative mb-6 inline-block">
								<div
									class="group-hover:ring-brand-200 mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-white/10 transition-all duration-300"
								>
									<img
										src={member.image}
										alt={member.name}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
									/>
								</div>
								<div
									class="bg-success absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white"
								>
									<svg
										class="h-3 w-3 text-[--ft-text]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
							</div>
							<h3
								class="group-hover:text-brand-600 mb-2 text-xl font-bold text-[--ft-text] transition-colors duration-300"
							>
								{member.name}
							</h3>
							<p class="text-brand-600 mb-4 font-semibold">{member.role}</p>
							<p class="mb-6 leading-relaxed text-neutral-400">{member.bio}</p>

							<!-- Contact buttons -->
							<div class="flex justify-center gap-3">
								<a
									href="mailto:{member.email}"
									class="bg-brand-100 hover:bg-brand-200 text-brand-700 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
								>
									<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									Email
								</a>
								<a
									href={member.linkedin}
									class="inline-flex items-center rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors duration-200 hover:bg-white/10"
								>
									<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
										<path
											d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
										/>
									</svg>
									LinkedIn
								</a>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</section>

		<!-- CTA Section -->
		<section class="mt-20">
			<Card class="from-brand-600 to-accent-700 bg-linear-to-br p-12 text-center text-[--ft-text]">
				<div class="mx-auto max-w-3xl">
					<h2 class="mb-6 text-3xl font-bold">Dołącz Do Naszej Społeczności</h2>
					<p class="mb-8 text-xl opacity-90">
						Przekonaj się sam, dlaczego tysiące klientów wybiera FixTar. Rozpocznij swoją przygodę z
						najlepszymi narzędziami już dziś.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							href="/products"
							class="text-brand-600 bg-white/5 px-8 py-4 text-lg font-bold shadow-lg hover:bg-white/10"
						>
							Przeglądaj Produkty
						</Button>
						<Button
							href="/contact"
							class="border-2 border-white/30 px-8 py-4 text-lg font-bold text-[--ft-text] backdrop-blur-sm hover:border-white hover:bg-white/10"
						>
							Skontaktuj Się
						</Button>
					</div>
				</div>
			</Card>
		</section>
	</div>
</div>
