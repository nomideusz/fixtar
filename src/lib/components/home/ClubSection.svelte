<script lang="ts">
	import {
		ClockIcon,
		GearIcon,
		SquaresFourIcon,
		TagIcon,
		GiftIcon,
		ArrowRightIcon,
		CheckIcon,
		EnvelopeIcon
	} from 'phosphor-svelte';
	import clubBg from '$lib/images/banners/banner-grinder-sparks-2.webp';
	import logoWhite from '$lib/images/logo/fixtar-logo-white.webp';

	const perks = [
		{ icon: ClockIcon, label: 'Wcześniejszy<br/>dostęp' },
		{ icon: GearIcon, label: 'Testy<br/>i poradniki' },
		{ icon: SquaresFourIcon, label: 'Limitowane<br/>oferty' },
		{ icon: TagIcon, label: 'Specjalne<br/>ceny' },
		{ icon: GiftIcon, label: 'Prezent<br/>powitalny' }
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
			<div class="photo" aria-hidden="true">
				<img src={clubBg} alt="" loading="lazy" />
				<div class="photo-shade"></div>
			</div>

			<div class="content">
				<p class="kicker">Dołącz do</p>
				<div class="lockup">
					<img src={logoWhite} alt="FIXTAR" class="lockup-logo" />
					<span class="lockup-word">Club</span>
				</div>
				<p class="lead">
					Społeczność profesjonalistów. Ekskluzywne korzyści, oferty członkowskie i ceny tylko dla
					klubowiczów.
				</p>

				<div class="perks" role="list">
					{#each perks as perk (perk.label)}
						{@const Icon = perk.icon}
						<div class="perk" role="listitem">
							<span class="perk-ico" aria-hidden="true">
								<Icon size={26} weight="regular" />
							</span>
							<span class="perk-label">{@html perk.label}</span>
						</div>
					{/each}
				</div>

				{#if submitted}
					<div class="success" role="status">
						<CheckIcon size={20} weight="bold" aria-hidden="true" />
						<span>Dziękujemy! Sprawdź swój e-mail.</span>
					</div>
				{:else}
					<form class="form" onsubmit={handleSubmit}>
						<label class="form-field" aria-label="Adres e-mail">
							<EnvelopeIcon size={18} weight="regular" aria-hidden="true" />
							<input
								type="email"
								required
								bind:value={email}
								placeholder="Twój adres e-mail"
							/>
						</label>
						<button type="submit" class="form-btn" disabled={loading}>
							{loading ? 'Wysyłanie…' : 'Dołącz do klubu'}
							<ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
						</button>
					</form>
				{/if}

				<div class="promo">
					<GiftIcon size={16} weight="regular" aria-hidden="true" />
					<span><b>-5% kod powitalny</b> na pierwsze zakupy.</span>
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
		background: var(--ft-ink-900);
		color: #fff;
		border-radius: var(--radius-lg);
		overflow: hidden;
		display: grid;
		grid-template-columns: 1.05fr 1.3fr;
		gap: 32px;
		align-items: stretch;
		min-height: 560px;
		padding: 0 64px 0 0;
		margin-top: 40px;
	}

	/* ---------- Photo with diagonal right edge + cyan accent stripe ---------- */
	.photo {
		position: relative;
		margin: 0;
		overflow: hidden;
		background: var(--ft-ink-800);
		/* Diagonal cut: 110px slope from top-right to bottom-right */
		clip-path: polygon(0 0, 100% 0, calc(100% - 110px) 100%, 0 100%);
	}

	.photo img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 55% center;
		opacity: 0.85;
	}

	.photo-shade {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(60% 100% at 30% 60%, rgba(255, 138, 31, 0.16), transparent 60%),
			linear-gradient(135deg, rgba(29, 34, 40, 0.35) 0%, rgba(29, 34, 40, 0.7) 100%);
		pointer-events: none;
	}

	/* Cyan stripe along the diagonal edge — rotated 11.1° to follow the slope */
	.photo::after {
		content: '';
		position: absolute;
		top: -8px;
		right: 0;
		width: 4px;
		height: 580px;
		background: var(--ft-cyan);
		box-shadow:
			0 0 28px rgba(63, 152, 162, 0.9),
			0 0 8px rgba(63, 152, 162, 1);
		transform: rotate(11.1deg);
		transform-origin: top right;
		pointer-events: none;
	}

	/* ---------- Right column content ---------- */
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 24px;
		padding: 56px 0;
	}

	.kicker {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ft-ink-300);
		margin: 0 0 -16px;
	}

	.lockup {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.lockup-logo {
		height: 64px;
		width: auto;
		display: block;
	}

	.lockup-word {
		font-family: var(--font-display);
		font-weight: 500;
		font-style: italic;
		font-size: clamp(48px, 5.6vw, 72px);
		line-height: 1;
		text-transform: uppercase;
		letter-spacing: -0.005em;
		color: #fff;
	}

	.lead {
		color: var(--ft-ink-300);
		max-width: 560px;
		margin: 0;
		font-size: 15px;
		line-height: 1.65;
	}

	/* ---------- 5 perks · vertical hairline dividers, no boxes ---------- */
	.perks {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0;
		padding: 4px 0;
	}

	.perk {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 12px;
		padding: 4px 12px;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
	}

	.perk:last-child {
		border-right: 0;
	}

	.perk-ico {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		color: var(--ft-cyan-400);
	}

	.perk-label {
		font-size: 12px;
		line-height: 1.4;
		color: var(--ft-ink-300);
	}

	/* ---------- Email capture · flush input + button, 56px tall ---------- */
	.form {
		display: flex;
		gap: 0;
		height: 56px;
		max-width: 480px;
	}

	.form-field {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 18px;
		background: #fff;
		border: 1px solid #fff;
		border-right: 0;
		border-radius: var(--radius-sm) 0 0 var(--radius-sm);
		min-width: 0;
	}

	.form-field :global(svg) {
		color: var(--ft-ink-500);
		flex-shrink: 0;
	}

	.form-field input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 15px;
		color: var(--ft-ink-900);
	}

	.form-field input::placeholder {
		color: var(--ft-ink-400);
	}

	.form-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 100%;
		padding: 0 28px;
		background: var(--ft-orange);
		color: #fff;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		border: 0;
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		cursor: pointer;
		white-space: nowrap;
		transition: background-color var(--dur-fast) ease;
	}

	.form-btn:hover:not(:disabled) {
		background: var(--ft-orange-600);
	}

	.form-btn:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.form-btn :global(svg) {
		transition: transform var(--dur-fast) ease;
	}

	.form-btn:hover:not(:disabled) :global(svg) {
		transform: translateX(2px);
	}

	.success {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 16px 20px;
		max-width: 480px;
		background: rgba(63, 152, 162, 0.15);
		border: 1px solid var(--ft-cyan);
		border-radius: var(--radius-sm);
		color: #fff;
		font-size: 14px;
	}

	.success :global(svg) {
		color: var(--ft-cyan-400);
	}

	.promo {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: var(--ft-ink-300);
		margin-top: -4px;
	}

	.promo :global(svg) {
		color: var(--ft-orange-400);
	}

	.promo b {
		color: #fff;
		font-weight: 600;
	}

	/* ---------- Responsive ---------- */
	@media (max-width: 900px) {
		.club {
			grid-template-columns: 1fr;
			min-height: auto;
			padding: 0;
		}

		.photo {
			height: 220px;
			clip-path: polygon(0 0, 100% 0, 100% calc(100% - 60px), 0 100%);
		}

		.photo::after {
			top: auto;
			bottom: 0;
			right: 0;
			width: 100%;
			height: 4px;
			transform: rotate(-6.4deg);
			transform-origin: bottom right;
		}

		.content {
			padding: 36px 28px;
			gap: 20px;
		}

		.perks {
			grid-template-columns: repeat(5, 1fr);
			gap: 0;
		}

		.perk {
			padding: 4px 6px;
		}

		.perk-label {
			font-size: 11px;
		}
	}

	@media (max-width: 600px) {
		.perks {
			grid-template-columns: repeat(3, 1fr);
			row-gap: 16px;
		}

		.perk:nth-child(3) {
			border-right: 0;
		}

		.form {
			flex-direction: column;
			height: auto;
		}

		.form-field {
			height: 56px;
			border-right: 1px solid #fff;
			border-radius: var(--radius-sm) var(--radius-sm) 0 0;
		}

		.form-btn {
			height: 56px;
			border-radius: 0 0 var(--radius-sm) var(--radius-sm);
		}
	}
</style>
