<script lang="ts">
	import { CheckCircleIcon, ArrowRightIcon } from 'phosphor-svelte';

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
		await new Promise((resolve) => setTimeout(resolve, 600));
		status = 'success';
	}
</script>

<section class="newsletter ft-section">
	<div class="newsletter-inner ft-container">
		<span class="ft-label">newsletter</span>
		<h2 class="newsletter-title">
			Zyskaj <span class="discount-chip">5% rabatu</span> na start.
		</h2>
		<p class="newsletter-desc">
			Nowości, promocje i sprzęt dla profesjonalistów. Raz na dwa tygodnie. Zero spamu.
		</p>

		{#if status === 'success'}
			<div class="success" role="status">
				<CheckCircleIcon size={20} weight="regular" aria-hidden="true" />
				<span>Dziękujemy! Kod rabatowy wysłaliśmy na Twój e-mail.</span>
			</div>
		{:else}
			<form class="form" onsubmit={handleSubmit} novalidate>
				<label for="newsletter-email" class="sr-only">Adres e-mail</label>
				<input
					id="newsletter-email"
					type="email"
					placeholder="ty@poczta.pl"
					bind:value={email}
					class="input"
					class:has-error={status === 'error'}
					aria-invalid={status === 'error'}
					aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
					disabled={status === 'loading'}
				/>
				<button type="submit" class="submit" disabled={status === 'loading'}>
					{#if status === 'loading'}
						<span class="spinner" aria-hidden="true"></span>
					{:else}
						Zapisz
						<ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
					{/if}
				</button>
			</form>

			{#if status === 'error' && errorMsg}
				<p id="newsletter-error" class="error-msg" role="alert">{errorMsg}</p>
			{/if}
		{/if}
	</div>
</section>

<style>
	.newsletter {
		border-top: 1px solid var(--ft-line);
		background: var(--ft-frost);
	}

	.newsletter-inner {
		max-width: 640px;
	}

	.newsletter-title {
		margin-top: 6px;
		max-width: 520px;
		font-family: var(--font-sans);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 400;
		color: var(--ft-text-strong);
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.discount-chip {
		display: inline-block;
		padding: 0 8px;
		background: var(--ft-cta);
		color: var(--ft-cta-text);
		border-radius: var(--radius-sm);
		line-height: 1.2;
	}

	.newsletter-desc {
		margin-top: 12px;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--ft-text-muted);
		max-width: 480px;
	}

	.form {
		display: flex;
		gap: 8px;
		margin-top: 24px;
		max-width: 480px;
	}

	.input {
		flex: 1;
		min-width: 0;
		padding: 12px 14px;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		color: var(--ft-text);
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		transition: border-color var(--dur-fast) ease;
	}

	.input::placeholder {
		color: var(--ft-text-faint);
	}

	.input:focus {
		outline: none;
		border-color: var(--ft-text-strong);
	}

	.input.has-error {
		border-color: var(--color-danger);
	}

	.submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 12px 20px;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		color: var(--ft-bg);
		background: var(--ft-text-strong);
		border: 1px solid var(--ft-text-strong);
		border-radius: var(--radius-sm);
		cursor: pointer;
		white-space: nowrap;
		transition:
			background-color var(--dur-fast) ease,
			border-color var(--dur-fast) ease,
			color var(--dur-fast) ease;
	}

	.submit:hover:not(:disabled) {
		background: var(--ft-cta);
		border-color: var(--ft-cta);
		color: var(--ft-cta-text);
	}

	.submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-msg {
		margin-top: 8px;
		font-size: 0.8125rem;
		color: var(--color-danger);
	}

	.success {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 24px;
		padding: 12px 16px;
		background: var(--ft-surface);
		border: 1px solid var(--ft-line);
		border-radius: var(--radius-sm);
		font-size: 0.9375rem;
		color: var(--ft-text);
	}

	.success :global(svg) {
		color: var(--color-success);
		flex-shrink: 0;
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

	@media (max-width: 560px) {
		.form {
			flex-direction: column;
		}

		.submit {
			justify-content: center;
		}
	}
</style>
