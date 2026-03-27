<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { notifications } from '$lib/stores';
	import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, ArrowRightIcon, SpinnerGapIcon, PaperPlaneTiltIcon, BuildingsIcon, ChatCircleIcon, QuestionIcon } from 'phosphor-svelte';

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

<PageHeader title="Kontakt" description="Jesteśmy tutaj, aby pomóc! Skontaktuj się z nami w sprawie pytań, wsparcia lub po prostu by porozmawiać o technologii." />

<!-- Main Content -->
<div>
	<div class="ft-container ft-section-lg">
		<!-- Contact Information Grid -->
		<section class="mb-20">
			<div class="mb-12 text-center">
				<div
					class="bg-[--ft-frost] text-[--ft-accent] mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<MapPinIcon class="mr-2 h-4 w-4" aria-hidden="true" />
					Informacje Kontaktowe
				</div>
				<h2 class="mb-4 text-3xl font-bold text-[--ft-text]">Skontaktuj Się Z Nami</h2>
				<p class="mx-auto max-w-2xl text-lg text-[--ft-text-muted]">
					Wybierz najwygodniejszy dla Ciebie sposób kontaktu. Nasz zespół jest gotowy do pomocy.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each contactInfo as info (info)}
					<div class="group text-center">
						<div class="p-6">
							<!-- Icon -->
							<div
								class="bg-[--ft-frost] mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
							>
								{#if info.icon === 'location'}
									<MapPinIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
								{:else if info.icon === 'phone'}
									<PhoneIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
								{:else if info.icon === 'email'}
									<EnvelopeIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
								{:else if info.icon === 'clock'}
									<ClockIcon class="text-[--ft-accent] h-8 w-8" aria-hidden="true" />
								{/if}
							</div>

							<!-- Content -->
							<h3 class="mb-3 text-lg font-bold text-[--ft-text]">
								{info.title}
							</h3>
							<div class="mb-4 space-y-1">
								{#each info.details as detail (detail)}
									<p class="text-sm text-[--ft-text-muted]">{detail}</p>
								{/each}
							</div>

							<!-- Action LinkIcon -->
							{#if info.action}
								<a
									href={info.action.href}
									class="text-[--ft-accent] inline-flex items-center text-sm font-medium transition-colors duration-200 hover:underline"
								>
									{info.action.text}
									<ArrowRightIcon class="ml-1 h-4 w-4" aria-hidden="true" />
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Contact Form and Map Section -->
		<section class="mb-20">
			<div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
				<!-- Contact Form -->
				<div>
					<div class="mb-8">
						<h3 class="mb-4 text-2xl font-bold text-[--ft-text]">Napisz Do Nas</h3>
						<p class="text-[--ft-text-muted]">
							Wypełnij formularz poniżej, a odpowiemy w ciągu 24 godzin.
						</p>
					</div>

					<form onsubmit={handleSubmit} class="space-y-6">
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="name" class="mb-2 block text-sm font-semibold text-[--ft-text]">
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
								<label for="email" class="mb-2 block text-sm font-semibold text-[--ft-text]">
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
							<label for="subject" class="mb-2 block text-sm font-semibold text-[--ft-text]">
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
							<label for="message" class="mb-2 block text-sm font-semibold text-[--ft-text]">
								Wiadomość *
							</label>
							<textarea
								id="message"
								bind:value={formData.message}
								placeholder="Opisz swoje pytanie lub problem..."
								required
								disabled={sending}
								rows="5"
								class="focus:ring-[--ft-accent] w-full resize-none rounded-xl border border-[--ft-line] px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							></textarea>
						</div>

						<button
							type="submit"
							disabled={sending}
							class="w-full flex items-center justify-center gap-2 py-4 px-6 font-semibold text-white rounded-xl bg-[--ft-text-strong] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if sending}
								<SpinnerGapIcon class="h-5 w-5 animate-spin" aria-hidden="true" />
								Wysyłanie...
							{:else}
								<PaperPlaneTiltIcon class="h-5 w-5" aria-hidden="true" />
								Wyślij Wiadomość
							{/if}
						</button>
					</form>
				</div>

				<!-- Map / Office InfoIcon -->
				<div class="space-y-6">
					<div class="rounded-lg overflow-hidden">
						<div
							class="flex h-80 items-center justify-center bg-[--ft-frost]"
						>
							<div class="p-8 text-center">
								<MapPinIcon class="mx-auto mb-4 h-16 w-16 text-[--ft-text-muted]" aria-hidden="true" />
								<p class="font-medium text-[--ft-text-muted]">Mapa do naszego biura</p>
								<p class="mt-2 text-sm text-[--ft-text-muted]">ul. Technologiczna 15, Warszawa</p>
							</div>
						</div>
					</div>

					<div class="bg-[--ft-frost] rounded-lg p-6">
						<h4 class="mb-4 text-lg font-bold text-[--ft-text]">Odwiedź Nas</h4>
						<div class="space-y-3 text-sm">
							<div class="flex items-center">
								<MapPinIcon class="text-[--ft-accent] mr-3 h-5 w-5" aria-hidden="true" />
								<span class="text-[--ft-text]">ul. Technologiczna 15, 00-001 Warszawa</span>
							</div>
							<div class="flex items-center">
								<BuildingsIcon class="text-[--ft-accent] mr-3 h-5 w-5" aria-hidden="true" />
								<span class="text-[--ft-text]">2 piętro, pokój 205</span>
							</div>
							<div class="flex items-center">
								<ChatCircleIcon class="text-[--ft-accent] mr-3 h-5 w-5" aria-hidden="true" />
								<span class="text-[--ft-text]">Parking dostępny na terenie budynku</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- FAQ Section -->
		<section>
			<div class="mb-12 text-center">
				<div
					class="bg-[--ft-frost] text-[--ft-accent] mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
				>
					<QuestionIcon class="mr-2 h-4 w-4" aria-hidden="true" />
					Często Zadawane Pytania
				</div>
				<h2 class="mb-4 text-3xl font-bold text-[--ft-text]">Masz Pytanie?</h2>
				<p class="mx-auto max-w-2xl text-lg text-[--ft-text-muted]">
					Sprawdź odpowiedzi na najczęściej zadawane pytania lub skontaktuj się z nami bezpośrednio.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-12">
				{#each faqItems as faq (faq)}
					<div class="py-6 border-b border-[--ft-line]">
						<h4 class="mb-3 text-lg font-semibold text-[--ft-text]">
							{faq.question}
						</h4>
						<p class="leading-relaxed text-[--ft-text-muted]">
							{faq.answer}
						</p>
					</div>
				{/each}
			</div>

			<div class="mt-12 text-center">
				<div class="bg-[--ft-frost] rounded-lg p-8 inline-block">
					<h3 class="mb-4 text-xl font-bold text-[--ft-text]">Nie znalazłeś odpowiedzi?</h3>
					<p class="mb-6 text-[--ft-text-muted]">Nasz zespół wsparcia jest gotowy do pomocy</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="tel:+48221234567"
							class="inline-flex items-center gap-2 text-sm font-medium text-[--ft-accent] hover:underline"
						>
							<PhoneIcon class="h-4 w-4" aria-hidden="true" />
							Zadzwoń
						</a>
						<a
							href="mailto:kontakt@FixTar.pl"
							class="inline-flex items-center gap-2 text-sm font-medium text-[--ft-accent] hover:underline"
						>
							<EnvelopeIcon class="h-4 w-4" aria-hidden="true" />
							Napisz Email
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
