<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-top">
			<a href="/" class="footer-brand">fixtar.pl</a>
			<div class="footer-links">
				<a href="/products">Produkty</a>
				<a href="/about">O Nas</a>
				<a href="/contact">Kontakt</a>
			</div>
		</div>
		<div class="footer-bottom">
			<span>&copy; {year} FixTar. Wszelkie prawa zastrzeżone.</span>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--ft-line);
		padding: 32px 0;
	}

	.footer-inner {
		max-width: var(--ft-container);
		margin: 0 auto;
		padding: 0 var(--ft-gutter);
	}

	.footer-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.footer-brand {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--ft-text-muted);
		text-decoration: none;
	}

	.footer-brand:hover {
		color: var(--ft-dark);
	}

	.footer-links {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	.footer-links a {
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--ft-text-muted);
		letter-spacing: 0.04em;
		text-decoration: none;
		transition: color var(--dur-fast) ease;
	}

	.footer-links a:hover {
		color: var(--ft-dark);
	}

	.footer-bottom {
		padding-top: 16px;
		border-top: 1px solid var(--ft-line);
		font-size: 0.7rem;
		color: var(--ft-text-faint);
	}
</style>
