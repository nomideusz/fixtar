<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { InfoIcon, CheckIcon, HeartIcon, UsersThreeIcon, EnvelopeIcon, TargetIcon, LightningIcon, TrophyIcon, RocketIcon, WrenchIcon } from 'phosphor-svelte';

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

	// Brand values
	const brandValues = [
		{
			title: 'Jakość Przede Wszystkim',
			icon: 'target',
			description:
				'Współpracujemy z zaufanymi markami i osobiście testujemy produkty przed dodaniem ich do naszego sklepu.'
		},
		{
			title: 'Innowacyjność',
			icon: 'lightning',
			description:
				'Śledzimy najnowsze trendy technologiczne, aby dostarczać najnowsze innowacje naszym klientom.'
		},
		{
			title: 'Klient Na Pierwszym Miejscu',
			icon: 'users',
			description:
				'Oferujemy spersonalizowaną obsługę i porady techniczne, aby pomóc znaleźć idealne rozwiązanie.'
		},
		{
			title: 'Profesjonalizm',
			icon: 'trophy',
			description:
				'Wysokie standardy obsługi i profesjonalne doradztwo w każdym aspekcie naszej działalności.'
		},
		{
			title: 'Szybkość Działania',
			icon: 'rocket',
			description: 'Szybka realizacja zamówień i błyskawiczna odpowiedź na zapytania klientów.'
		},
		{
			title: 'Wsparcie Techniczne',
			icon: 'wrench',
			description: 'Kompleksowe wsparcie techniczne długo po dokonaniu zakupu.'
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

<PageHeader title="O Nas" description="Poznaj historię i wartości, które kierują nami w codziennej pracy. Jesteśmy zespołem pasjonatów narzędzi, którzy chcą dzielić się swoją wiedzą i doświadczeniem." />

<!-- Main Content -->
<div>
	<div class="ft-container ft-section-lg">
		<!-- Company Story Section -->
		<section class="mb-20">
			<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
				<div class="order-2 lg:order-1">
					<div class="space-y-6">
						<div
							class="bg-[--ft-frost] text-[--ft-accent] inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
						>
							<InfoIcon class="mr-2 h-4 w-4" aria-hidden="true" />
							Nasza Historia
						</div>

						<h2 class="text-4xl leading-tight font-bold text-[--ft-text]">
							Pasja do Narzędzi Od 2024 Roku
						</h2>

						<div class="space-y-4 text-lg leading-relaxed text-[--ft-text-muted]">
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

						<!-- Features ListIcon -->
						<div class="space-y-4">
							{#each [{ title: 'Eksperckie Doradztwo', desc: 'Personalizowane rekomendacje od naszych specjalistów' }, { title: 'Gwarancja Jakości', desc: 'Każdy produkt jest starannie testowany i wybrany' }, { title: 'Wsparcie Techniczne', desc: 'Ciągłe wsparcie długo po dokonaniu zakupu' }, { title: 'Szybka Dostawa', desc: 'Realizacja zamówień w 24 godziny' }] as item (item.title)}
								<div class="group flex items-start">
									<div class="mt-1 shrink-0">
										<div
											class="bg-[--ft-accent] flex h-6 w-6 items-center justify-center rounded-full"
										>
											<CheckIcon class="h-3 w-3 text-white" aria-hidden="true" />
										</div>
									</div>
									<div class="ml-4">
										<span class="font-semibold text-[--ft-text]">{item.title}:</span>
										<span class="text-[--ft-text-muted]"> {item.desc}</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="order-1 lg:order-2">
					<div class="rounded-lg overflow-hidden">
						<div
							class="bg-[--ft-frost] flex aspect-4/3 items-center justify-center"
						>
							<img
								src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"
								alt="Sklep z narzędziami FixTar"
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Stats Section -->
		<section class="mb-20">
			<div class="py-12 border-y border-[--ft-line]">
				<div class="mb-12 text-center">
					<h2 class="mb-4 text-3xl font-bold text-[--ft-text]">FixTar w Liczbach</h2>
					<p class="text-lg text-[--ft-text-muted]">Nasze osiągnięcia mówią same za siebie</p>
				</div>
				<div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
					{#each stats as stat (stat)}
						<div class="text-center">
							<div
								class="mb-2 text-4xl font-bold text-[--ft-text-strong] lg:text-5xl"
							>
								{stat.value}
							</div>
							<p class="text-sm font-medium tracking-wide text-[--ft-text-muted] uppercase">
								{stat.label}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Values Section -->
		<section class="mb-20">
			<div class="mb-16 text-center">
				<div
					class="bg-[--ft-frost] text-[--ft-accent] mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<HeartIcon class="mr-2 h-4 w-4" aria-hidden="true" />
					Nasze Wartości
				</div>
				<h2 class="mb-6 text-4xl font-bold text-[--ft-text]">Co Nas Motywuje</h2>
				<p class="mx-auto max-w-3xl text-xl text-[--ft-text-muted]">
					Nasze podstawowe wartości kształtują sposób, w jaki prowadzimy biznes i budujemy relacje z
					klientami
				</p>
			</div>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each brandValues as value (value)}
					<div class="group">
						<div class="p-8 text-center">
							<div
								class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[--ft-frost] text-[--ft-accent]"
							>
								{#if value.icon === 'target'}
									<TargetIcon class="h-8 w-8" aria-hidden="true" />
								{:else if value.icon === 'lightning'}
									<LightningIcon class="h-8 w-8" aria-hidden="true" />
								{:else if value.icon === 'users'}
									<UsersThreeIcon class="h-8 w-8" aria-hidden="true" />
								{:else if value.icon === 'trophy'}
									<TrophyIcon class="h-8 w-8" aria-hidden="true" />
								{:else if value.icon === 'rocket'}
									<RocketIcon class="h-8 w-8" aria-hidden="true" />
								{:else if value.icon === 'wrench'}
									<WrenchIcon class="h-8 w-8" aria-hidden="true" />
								{/if}
							</div>
							<h3 class="mb-4 text-xl font-bold text-[--ft-text]">
								{value.title}
							</h3>
							<p class="leading-relaxed text-[--ft-text-muted]">
								{value.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Team Section -->
		<section>
			<div class="mb-16 text-center">
				<div
					class="bg-[--ft-frost] text-[--ft-accent] mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<UsersThreeIcon class="mr-2 h-4 w-4" aria-hidden="true" />
					Nasz Zespół
				</div>
				<h2 class="mb-6 text-4xl font-bold text-[--ft-text]">Poznaj Ludzi Za FixTar</h2>
				<p class="mx-auto max-w-3xl text-xl text-[--ft-text-muted]">
					Nasz zespół składa się z pasjonatów narzędzi, którzy codziennie pracują nad tym, aby
					dostarczać najlepsze doświadczenia naszym klientom
				</p>
			</div>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each teamMembers as member (member)}
					<div class="group">
						<div class="text-center">
							<div class="relative mb-6 inline-block">
								<div
									class="mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-[--ft-line]"
								>
									<img
										src={member.image}
										alt={member.name}
										class="h-full w-full object-cover"
									/>
								</div>
							</div>
							<h3 class="mb-2 text-xl font-bold text-[--ft-text]">
								{member.name}
							</h3>
							<p class="text-[--ft-accent] mb-4 font-semibold">{member.role}</p>
							<p class="mb-6 leading-relaxed text-[--ft-text-muted]">{member.bio}</p>

							<!-- Contact links -->
							<div class="flex justify-center gap-4">
								<a
									href="mailto:{member.email}"
									class="text-sm font-medium text-[--ft-accent] hover:underline inline-flex items-center gap-1"
								>
									<EnvelopeIcon class="h-4 w-4" aria-hidden="true" />
									Email
								</a>
								<a
									href={member.linkedin}
									class="text-sm font-medium text-[--ft-text-muted] hover:text-[--ft-text] inline-flex items-center gap-1"
								>
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
										<path
											d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
										/>
									</svg>
									LinkedIn
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- CTA Section -->
		<section class="mt-20 pt-16 border-t border-[--ft-line] text-center">
			<div class="mx-auto max-w-3xl">
				<h2 class="mb-6 text-3xl font-bold text-[--ft-text]">Dołącz Do Naszej Społeczności</h2>
				<p class="mb-8 text-xl text-[--ft-text-muted]">
					Przekonaj się sam, dlaczego tysiące klientów wybiera FixTar. Rozpocznij swoją przygodę z
					najlepszymi narzędziami już dziś.
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a href="/products" class="text-[--ft-accent] font-medium hover:underline">
						Przeglądaj Produkty
					</a>
					<span class="hidden sm:inline text-[--ft-line]">·</span>
					<a href="/contact" class="text-[--ft-text-muted] hover:text-[--ft-text]">
						Skontaktuj Się
					</a>
				</div>
			</div>
		</section>
	</div>
</div>
