<script lang="ts">
	import {
		ClockIcon,
		GearIcon,
		SquaresFourIcon,
		TagIcon,
		GiftIcon,
		EnvelopeIcon,
		ArrowRightIcon,
		CheckIcon
	} from 'phosphor-svelte';
	import clubBg from '$lib/images/banners/banner-grinder-sparks-2.webp';

	const perks = [
		{ icon: ClockIcon, label: 'Wcześniejszy dostęp do promocji' },
		{ icon: GearIcon, label: 'Testy i poradniki narzędzi' },
		{ icon: SquaresFourIcon, label: 'Limitowane oferty' },
		{ icon: TagIcon, label: 'Specjalne ceny dla klubowiczów' },
		{ icon: GiftIcon, label: 'Prezent powitalny na start' }
	];

	let email = $state('');
	let submitted = $state(false);
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!email || loading) return;
		loading = true;
		await new Promise((r) => setTimeout(r, 600));
		submitted = true;
		loading = false;
	}
</script>

<section class="club-wrap" aria-label="FIXTAR Club">
	<div class="ft-container">
		<div class="club">
			<div class="club-photo">
				<img src={clubBg} alt="" loading="lazy" />
				<div class="club-photo-overlay" aria-hidden="true"></div>
			</div>

			<div class="club-body">
				<p class="club-kicker">Dołącz do</p>
				<h2 class="club-title">F<span class="accent">i</span>XTAR Club</h2>
				<p class="club-desc">
					Dołącz do społeczności profesjonalistów i bądź zawsze o krok przed innymi. Otrzymuj
					ekskluzywne korzyści i specjalne oferty.
				</p>

				<div class="club-perks">
					{#each perks as perk (perk.label)}
						{@const Icon = perk.icon}
						<div class="perk">
							<span class="perk-ico">
								<Icon size={18} weight="regular" aria-hidden="true" />
							</span>
							<span class="perk-label">{perk.label}</span>
						</div>
					{/each}
				</div>

				{#if submitted}
					<div class="club-success" role="status">
						<CheckIcon size={20} weight="bold" aria-hidden="true" />
						<span>Dziękujemy! Sprawdź swój e-mail.</span>
					</div>
				{:else}
					<form class="club-form" onsubmit={handleSubmit}>
						<span class="mail-ico" aria-hidden="true">
							<EnvelopeIcon size={18} weight="regular" />
						</span>
						<input
							class="mail"
							type="email"
							required
							bind:value={email}
							placeholder="Twój adres e-mail"
							aria-label="Adres e-mail"
						/>
						<button type="submit" class="club-cta" disabled={loading}>
							{loading ? 'Wysyłanie...' : 'Dołącz do klubu'}
							<ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
						</button>
					</form>
				{/if}

				<div class="club-discount">
					<span class="gift" aria-hidden="true">
						<GiftIcon size={16} weight="regular" />
					</span>
					<span>Na start otrzymasz kod rabatowy <strong>-5%</strong> na pierwsze zakupy.</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.club-wrap {
		background: var(--ft-frost);
		padding: 0 0 72px;
	}

	.club {
		position: relative;
		background: var(--ft-dark);
		color: #fff;
		border-radius: var(--radius-lg);
		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		min-height: 380px;
		margin-top: 40px;
	}

	.club-photo {
		position: relative;
		background:
			radial-gradient(80% 100% at 30% 60%, rgba(255, 138, 31, 0.35), transparent 60%),
			linear-gradient(135deg, #2c343d 0%, #1d2228 100%);
		overflow: hidden;
	}

	.club-photo img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.7;
	}

	.club-photo-overlay {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(60% 100% at 30% 60%, rgba(255, 138, 31, 0.28), transparent 60%),
			linear-gradient(135deg, rgba(29, 34, 40, 0.5) 0%, rgba(29, 34, 40, 0.85) 100%);
	}

	.club-body {
		padding: 48px 56px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.club-kicker {
		font-family: var(--font-sans);
		font-size: 12px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		margin: 0 0 4px;
		font-weight: 600;
	}

	.club-title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 52px;
		text-transform: uppercase;
		margin: 0 0 12px;
		letter-spacing: 0.005em;
		line-height: 1;
		color: #fff;
	}

	.club-title .accent {
		color: var(--ft-cyan);
	}

	.club-desc {
		color: rgba(255, 255, 255, 0.7);
		max-width: 460px;
		margin: 0 0 28px;
		font-size: 14px;
		line-height: 1.55;
	}

	.club-perks {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 12px;
		margin-bottom: 24px;
	}

	.perk {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 8px;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.3;
	}

	.perk-ico {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: grid;
		place-items: center;
		color: var(--ft-cyan);
	}

	.club-form {
		display: flex;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 8px;
		padding: 6px;
		gap: 8px;
		align-items: center;
	}

	.mail-ico {
		display: inline-flex;
		color: rgba(255, 255, 255, 0.45);
		margin-left: 8px;
	}

	.mail {
		flex: 1;
		background: transparent;
		border: 0;
		padding: 10px 14px;
		color: #fff;
		font-size: 14px;
		font-family: var(--font-sans);
		outline: none;
		min-width: 0;
	}

	.mail::placeholder {
		color: rgba(255, 255, 255, 0.45);
	}

	.club-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: var(--ft-cta);
		color: #fff;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 12px 18px;
		border-radius: var(--radius-sm);
		border: 0;
		cursor: pointer;
		white-space: nowrap;
		transition: background-color var(--dur-fast) ease;
	}

	.club-cta:hover:not(:disabled) {
		background: var(--ft-cta-hover);
	}

	.club-cta:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.club-cta :global(svg) {
		transition: transform var(--dur-fast) ease;
	}

	.club-cta:hover :global(svg) {
		transform: translateX(2px);
	}

	.club-success {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 14px 18px;
		background: rgba(55, 138, 146, 0.15);
		border: 1px solid var(--ft-cyan);
		border-radius: 8px;
		color: #fff;
		font-size: 14px;
		font-weight: 500;
	}

	.club-success :global(svg) {
		color: var(--ft-cyan);
	}

	.club-discount {
		margin-top: 14px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.55);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.club-discount strong {
		color: #fff;
	}

	.club-discount .gift {
		display: inline-flex;
		color: var(--ft-cta);
	}

	@media (max-width: 900px) {
		.club {
			grid-template-columns: 1fr;
			min-height: auto;
		}

		.club-photo {
			height: 180px;
		}

		.club-body {
			padding: 36px 28px;
		}

		.club-title {
			font-size: 40px;
		}

		.club-perks {
			grid-template-columns: repeat(3, 1fr);
			gap: 16px;
		}
	}

	@media (max-width: 560px) {
		.club-perks {
			grid-template-columns: repeat(2, 1fr);
		}

		.club-form {
			flex-direction: column;
			align-items: stretch;
			padding: 8px;
		}

		.mail-ico {
			display: none;
		}

		.club-cta {
			justify-content: center;
		}
	}
</style>
