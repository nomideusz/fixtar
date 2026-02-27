<script lang="ts">
	import { notifications } from '$lib/stores';

	let email = $state('');
	let submitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!email.trim()) { notifications.error('Podaj adres email'); return; }
		if (!email.includes('@')) { notifications.error('Podaj prawidłowy adres email'); return; }

		submitting = true;
		try {
			await new Promise((r) => setTimeout(r, 1000));
			notifications.success(`Dziękujemy! Newsletter zostanie wysłany na ${email}`);
			email = '';
		} catch {
			notifications.error('Wystąpił błąd. Spróbuj ponownie później.');
		} finally {
			submitting = false;
		}
	}
</script>

<section class="py-24 relative overflow-hidden bg-neutral-900">
	<div class="absolute inset-0 bg-black/10"></div>

	<div class="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
		<div class="max-w-4xl mx-auto text-center">
			<div class="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white mb-8">
				<span class="relative flex h-3 w-3 mr-3">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
				</span>
				<span class="text-sm font-medium">Dołącz do ponad 15,000 subskrybentów</span>
			</div>

			<h2 class="text-5xl lg:text-6xl font-bold font-heading text-white mb-6 tracking-tight">Newsletter FixTar</h2>
			<p class="text-xl text-neutral-200 mb-12">
				Otrzymuj informacje o najnowszych narzędziach, promocjach i nowościach ze świata elektronarzędzi
			</p>

			<form onsubmit={handleSubmit} class="relative max-w-2xl mx-auto">
				<div class="group">
					<div class="absolute -inset-1 bg-brand-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
					<div class="relative flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
						<input
							type="email"
							placeholder="twoj@email.pl"
							bind:value={email}
							disabled={submitting}
							class="flex-1 px-6 py-4 bg-white/10 text-white placeholder-neutral-300 rounded-xl focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-brand-400/50 transition-all disabled:opacity-50"
							required
						/>
						<button
							type="submit"
							disabled={submitting || !email.trim()}
							class="px-8 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all duration-300 whitespace-nowrap"
						>
							{submitting ? 'Zapisywanie...' : 'Zapisz się'}
						</button>
					</div>
				</div>
				<p class="text-sm text-neutral-300 mt-6">Szanujemy Twoją prywatność. Możesz zrezygnować w każdej chwili.</p>
			</form>
		</div>
	</div>
</section>
