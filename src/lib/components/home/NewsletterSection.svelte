<script lang="ts">
	import { EnvelopeIcon, CheckCircleIcon, ArrowRightIcon } from 'phosphor-svelte';

	let email = $state('');
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let errorMsg = $state('');

	function validateEmail(value: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMsg = '';

		if (!email.trim()) {
			errorMsg = 'Podaj adres e-mail.';
			status = 'error';
			return;
		}

		if (!validateEmail(email)) {
			errorMsg = 'Podaj poprawny adres e-mail.';
			status = 'error';
			return;
		}

		status = 'loading';

		// Simulate API call — replace with real endpoint later
		await new Promise((resolve) => setTimeout(resolve, 800));
		status = 'success';
	}
</script>

<section class="newsletter ft-section">
	<div class="ft-container">
		<div class="newsletter-inner">
			<!-- Icon -->
			<div class="newsletter-icon" aria-hidden="true">
				<EnvelopeIcon size={28} weight="light" />
			</div>

			<h2 class="newsletter-title">Zapisz się i otrzymaj <span class="highlight">5% rabatu</span></h2>
			<p class="newsletter-desc">
				Dołącz do naszego newslettera — bądź pierwszy, który pozna nowe produkty, promocje i porady.
			</p>

			{#if status === 'success'}
				<div class="newsletter-success" role="status">
					<CheckCircleIcon size={20} weight="fill" aria-hidden="true" />
					<div>
						<p class="success-title">Dziękujemy za zapisanie się!</p>
						<p class="success-desc">Kod rabatowy został wysłany na Twój adres e-mail.</p>
					</div>
				</div>
			{:else}
				<form class="newsletter-form" onsubmit={handleSubmit} novalidate>
					<div class="form-row">
						<label for="newsletter-email-section" class="sr-only">Adres e-mail</label>
						<div class="input-wrap">
							<input
								id="newsletter-email-section"
								type="email"
								placeholder="Wpisz swój adres e-mail"
								bind:value={email}
								class="newsletter-input"
								class:has-error={status === 'error'}
								aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
								aria-invalid={status === 'error'}
								disabled={status === 'loading'}
							/>
							<button
								type="submit"
								class="newsletter-btn"
								disabled={status === 'loading'}
							>
								{#if status === 'loading'}
									<span class="spinner" aria-hidden="true"></span>
									Wysyłanie…
								{:else}
									Zapisz się
									<ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
								{/if}
							</button>
						</div>
						{#if status === 'error' && errorMsg}
							<p id="newsletter-error" class="error-msg" role="alert">{errorMsg}</p>
						{/if}
					</div>
				</form>

				<p class="newsletter-fine">
					Bez spamu. Możesz zrezygnować w każdej chwili.
				</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.newsletter {
		background: var(--ft-frost);
		border-top: 1px solid var(--ft-line);
		border-bottom: 1px solid var(--ft-line);
	}

	.newsletter-inner {
		max-width: 540px;
		margin: 0 auto;
		text-align: center;
	}

	.newsletter-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		color: var(--ft-accent);
		margin-bottom: 18px;
	}

	.newsletter-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 700;
		color: var(--ft-dark);
		letter-spacing: -0.02em;
		margin-bottom: 8px;
	}

	.highlight {
		color: var(--ft-cta);
	}

	.newsletter-desc {
		font-size: 0.88rem;
		line-height: 1.6;
		color: var(--ft-text-muted);
		margin-bottom: 24px;
	}

	/* ── Form ── */
	.form-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.input-wrap {
		display: flex;
		gap: 0;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 1px solid var(--ft-line);
		background: var(--ft-surface);
		transition: border-color var(--dur-fast) ease;
	}

	.input-wrap:focus-within {
		border-color: var(--ft-cta);
		box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.08);
	}

	.newsletter-input {
		flex: 1;
		min-width: 0;
		padding: 12px 16px;
		font-family: var(--font-sans);
		font-size: 0.88rem;
		color: var(--ft-text);
		background: transparent;
		border: none;
		outline: none;
	}

	.newsletter-input::placeholder {
		color: var(--ft-text-faint);
	}

	.newsletter-input.has-error {
		color: var(--color-danger);
	}

	.newsletter-input:disabled {
		opacity: 0.6;
	}

	.newsletter-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 12px 24px;
		min-height: 44px;
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: white;
		background: var(--ft-cta);
		border: none;
		cursor: pointer;
		white-space: nowrap;
		transition: background var(--dur-fast) ease;
		flex-shrink: 0;
	}

	.newsletter-btn:hover:not(:disabled) {
		background: var(--ft-cta-hover);
	}

	.newsletter-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.error-msg {
		font-size: 0.78rem;
		color: var(--color-danger);
		text-align: left;
	}

	.newsletter-fine {
		font-size: 0.72rem;
		color: var(--ft-text-faint);
		margin-top: 12px;
	}

	/* ── Success ── */
	.newsletter-success {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		text-align: left;
		padding: 20px 24px;
		background: var(--ft-surface);
		border: 1px solid var(--color-success);
		border-radius: var(--radius-md);
		color: var(--color-success);
		animation: ft-fade-up 0.35s var(--ease-out) both;
	}

	.newsletter-success :global(svg) {
		flex-shrink: 0;
		margin-top: 2px;
	}

	.success-title {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--ft-dark);
	}

	.success-desc {
		font-size: 0.78rem;
		color: var(--ft-text-muted);
		margin-top: 2px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 480px) {
		.input-wrap {
			flex-direction: column;
			border-radius: var(--radius-sm);
		}

		.newsletter-input {
			border-bottom: 1px solid var(--ft-line);
		}

		.newsletter-btn {
			justify-content: center;
			border-radius: 0;
		}
	}
</style>
