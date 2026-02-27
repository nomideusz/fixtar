<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Hero from '$lib/components/ui/Hero.svelte';
	import { notifications } from '$lib/stores';

	let formData = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	let sending = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		sending = true;

		try {
			// Simulate sending message
			await new Promise((resolve) => setTimeout(resolve, 1500));

			notifications.success('Wiadomość została wysłana! Odpowiemy najszybciej jak to możliwe.');

			// Reset form
			formData = {
				name: '',
				email: '',
				subject: '',
				message: ''
			};
		} catch {
			notifications.error('Nie udało się wysłać wiadomości. Spróbuj ponownie.');
		} finally {
			sending = false;
		}
	}

	// Contact information
	const contactInfo = [
		{
			icon: 'location',
			title: 'Adres',
			details: ['ul. Technologiczna 15', '00-001 Warszawa', 'Polska'],
			action: { text: 'Zobacz na mapie', href: '#' }
		},
		{
			icon: 'phone',
			title: 'Telefon',
			details: ['+48 22 123 45 67', '+48 800 123 456 (bezpłatna)'],
			action: { text: 'Zadzwoń teraz', href: 'tel:+48221234567' }
		},
		{
			icon: 'email',
			title: 'Email',
			details: ['kontakt@FixTar.pl', 'wsparcie@FixTar.pl'],
			action: { text: 'Napisz email', href: 'mailto:kontakt@FixTar.pl' }
		},
		{
			icon: 'clock',
			title: 'Godziny otwarcia',
			details: ['Pon-Pt: 9:00 - 18:00', 'Sob: 10:00 - 16:00', 'Nd: zamknięte'],
			action: null
		}
	];

	// FAQ items
	const faqItems = [
		{
			question: 'Jak długo trwa dostawa?',
			answer:
				'Standardowa dostawa trwa 1-3 dni robocze. Oferujemy również dostawę ekspresową w ciągu 24 godzin.'
		},
		{
			question: 'Czy mogę zwrócić produkt?',
			answer:
				'Tak, masz 14 dni na zwrot produktu bez podania przyczyny. Produkt musi być w oryginalnym opakowaniu.'
		},
		{
			question: 'Czy oferujecie wsparcie techniczne?',
			answer:
				'Tak, nasz zespół techniczny jest dostępny od poniedziałku do piątku w godzinach 9:00-17:00.'
		},
		{
			question: 'Jakie są koszty dostawy?',
			answer:
				'Dostawa jest bezpłatna przy zamówieniach powyżej 200 zł. Poniżej tej kwoty koszt wynosi 15 zł.'
		}
	];
</script>

<svelte:head>
	<title>Kontakt - FixTar</title>
	<meta
		name="description"
		content="Skontaktuj się z FixTar w sprawie pytań lub wsparcia. Jesteśmy tutaj, aby pomóc!"
	/>
</svelte:head>

<!-- Modern Professional Hero Section -->
<Hero
	title="Kontakt"
	subtitle="Jesteśmy tutaj, aby pomóc! Skontaktuj się z nami w sprawie pytań, wsparcia lub po prostu by porozmawiać o technologii."
	centered={true}
/>

<!-- Main Content -->
<div>
	<div class="mx-auto max-w-screen-2xl px-6 py-16 sm:px-8 lg:px-12">
		<!-- Contact Information Grid -->
		<section class="mb-20">
			<div class="mb-12 text-center">
				<div
					class="bg-accent-100 text-accent-800 mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Informacje Kontaktowe
				</div>
				<h2 class="mb-4 text-3xl font-bold text-white">Skontaktuj Się Z Nami</h2>
				<p class="mx-auto max-w-2xl text-lg text-neutral-400">
					Wybierz najwygodniejszy dla Ciebie sposób kontaktu. Nasz zespół jest gotowy do pomocy.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each contactInfo as info (info)}
					<Card hover class="group text-center">
						<div class="p-6">
							<!-- Icon -->
							<div
								class="from-brand-500/100/20 to-accent-500/100/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br transition-transform duration-200 group-hover:scale-110"
							>
								{#if info.icon === 'location'}
									<svg
										class="text-brand-600 h-8 w-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								{:else if info.icon === 'phone'}
									<svg
										class="text-brand-600 h-8 w-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
								{:else if info.icon === 'email'}
									<svg
										class="text-brand-600 h-8 w-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								{:else if info.icon === 'clock'}
									<svg
										class="text-brand-600 h-8 w-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								{/if}
							</div>

							<!-- Content -->
							<h3
								class="group-hover:text-brand-600 mb-3 text-lg font-bold text-white transition-colors duration-200"
							>
								{info.title}
							</h3>
							<div class="mb-4 space-y-1">
								{#each info.details as detail (detail)}
									<p class="text-sm text-neutral-400">{detail}</p>
								{/each}
							</div>

							<!-- Action Button -->
							{#if info.action}
								<a
									href={info.action.href}
									class="text-brand-600 hover:text-brand-700 inline-flex items-center text-sm font-medium transition-all duration-200 group-hover:underline"
								>
									{info.action.text}
									<svg
										class="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</a>
							{/if}
						</div>
					</Card>
				{/each}
			</div>
		</section>

		<!-- Contact Form and Map Section -->
		<section class="mb-20">
			<div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
				<!-- Contact Form -->
				<div>
					<Card class="p-8">
						<div class="mb-8">
							<h3 class="mb-4 text-2xl font-bold text-white">Napisz Do Nas</h3>
							<p class="text-neutral-400">
								Wypełnij formularz poniżej, a odpowiemy w ciągu 24 godzin.
							</p>
						</div>

						<form onsubmit={handleSubmit} class="space-y-6">
							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<label for="name" class="mb-2 block text-sm font-semibold text-white">
										Imię i nazwisko *
									</label>
									<Input
										id="name"
										type="text"
										bind:value={formData.name}
										placeholder="Jan Kowalski"
										required
										disabled={sending}
									/>
								</div>
								<div>
									<label for="email" class="mb-2 block text-sm font-semibold text-white">
										Adres email *
									</label>
									<Input
										id="email"
										type="email"
										bind:value={formData.email}
										placeholder="jan@example.com"
										required
										disabled={sending}
									/>
								</div>
							</div>

							<div>
								<label for="subject" class="mb-2 block text-sm font-semibold text-white">
									Temat *
								</label>
								<Input
									id="subject"
									type="text"
									bind:value={formData.subject}
									placeholder="W czym możemy pomóc?"
									required
									disabled={sending}
								/>
							</div>

							<div>
								<label for="message" class="mb-2 block text-sm font-semibold text-white">
									Wiadomość *
								</label>
								<textarea
									id="message"
									bind:value={formData.message}
									placeholder="Opisz swoje pytanie lub problem..."
									required
									disabled={sending}
									rows="5"
									class="focus:ring-brand-500 w-full resize-none rounded-xl border border-white/15 px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								></textarea>
							</div>

							<Button type="submit" disabled={sending} class="w-full py-4 text-lg">
								{#if sending}
									<svg
										class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Wysyłanie...
								{:else}
									<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
										/>
									</svg>
									Wyślij Wiadomość
								{/if}
							</Button>
						</form>
					</Card>
				</div>

				<!-- Map / Office Info -->
				<div class="space-y-6">
					<Card class="overflow-hidden">
						<div
							class="flex h-80 items-center justify-center bg-linear-to-br from-neutral-100 to-neutral-200"
						>
							<div class="p-8 text-center">
								<svg
									class="mx-auto mb-4 h-16 w-16 text-neutral-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<p class="font-medium text-neutral-400">Mapa do naszego biura</p>
								<p class="mt-2 text-sm text-neutral-500">ul. Technologiczna 15, Warszawa</p>
							</div>
						</div>
					</Card>

					<Card class="from-brand-500/100/8 to-accent-500/100/8 bg-linear-to-br p-6">
						<h4 class="mb-4 text-lg font-bold text-white">Odwiedź Nas</h4>
						<div class="space-y-3 text-sm">
							<div class="flex items-center">
								<svg
									class="text-brand-600 mr-3 h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span class="text-neutral-300">ul. Technologiczna 15, 00-001 Warszawa</span>
							</div>
							<div class="flex items-center">
								<svg
									class="text-brand-600 mr-3 h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 0V7a1 1 0 011-1h6a1 1 0 011 1v0m-8 0h8M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4M9 21H5a1 1 0 01-1-1v-4a1 1 0 011-1h4m0 0h4m0 0h4a1 1 0 011 1v4a1 1 0 01-1 1h-4"
									/>
								</svg>
								<span class="text-neutral-300">2 piętro, pokój 205</span>
							</div>
							<div class="flex items-center">
								<svg
									class="text-brand-600 mr-3 h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
								<span class="text-neutral-300">Parking dostępny na terenie budynku</span>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</section>

		<!-- FAQ Section -->
		<section>
			<div class="mb-12 text-center">
				<div
					class="bg-brand-100 text-brand-800 mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Często Zadawane Pytania
				</div>
				<h2 class="mb-4 text-3xl font-bold text-white">Masz Pytanie?</h2>
				<p class="mx-auto max-w-2xl text-lg text-neutral-400">
					Sprawdź odpowiedzi na najczęściej zadawane pytania lub skontaktuj się z nami bezpośrednio.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each faqItems as faq (faq)}
					<Card class="p-6 transition-shadow duration-200 hover:shadow-lg">
						<h4 class="mb-3 text-lg font-semibold text-white">
							{faq.question}
						</h4>
						<p class="leading-relaxed text-neutral-400">
							{faq.answer}
						</p>
					</Card>
				{/each}
			</div>

			<div class="mt-12 text-center">
				<Card class="inline-block bg-linear-to-br from-white/5 to-white/3 p-8">
					<h3 class="mb-4 text-xl font-bold text-white">Nie znalazłeś odpowiedzi?</h3>
					<p class="mb-6 text-neutral-400">Nasz zespół wsparcia jest gotowy do pomocy</p>
					<div class="flex flex-col justify-center gap-3 sm:flex-row">
						<Button href="tel:+48221234567" variant="outline">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							Zadzwoń
						</Button>
						<Button href="mailto:kontakt@FixTar.pl">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							Napisz Email
						</Button>
					</div>
				</Card>
			</div>
		</section>
	</div>
</div>
