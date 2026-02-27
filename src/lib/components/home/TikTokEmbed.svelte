<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		username?: string;
	}

	let { username = 'fixtar.pl' }: Props = $props();

	onMount(() => {
		if (!browser) return;
		// Load TikTok embed script if not already present
		if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
			const script = document.createElement('script');
			script.src = 'https://www.tiktok.com/embed.js';
			script.async = true;
			document.body.appendChild(script);
		}
	});
</script>

<section class="tiktok-section">
	<!-- Background layers -->
	<div class="tiktok-section__grid"></div>
	<div class="tiktok-section__noise"></div>

	<!-- Top divider -->
	<div class="tiktok-section__divider"></div>

	<div class="tiktok-section__container">
		<!-- Header -->
		<div class="tiktok-section__header">
			<span class="tiktok-section__eyebrow">Śledź Nas</span>
			<h2 class="tiktok-section__title">
				Jesteśmy na <span class="tiktok-section__accent">TikToku</span>
			</h2>
			<p class="tiktok-section__subtitle">
				Porady, recenzje narzędzi i kulisy pracy — dołącz do naszej społeczności
			</p>
		</div>

		<!-- Embed -->
		<div class="tiktok-section__embed">
			<div class="tiktok-section__embed-frame">
				<blockquote
					class="tiktok-embed"
					cite="https://www.tiktok.com/@fixtar.pl"
					data-unique-id="fixtar.pl"
					data-embed-type="creator"
					style="max-width: 780px; min-width: 288px;"
				>
					<section>
						<a target="_blank" href="https://www.tiktok.com/@fixtar.pl?refer=creator_embed"
							>@fixtar.pl</a
						>
					</section>
				</blockquote>
				<script async src="https://www.tiktok.com/embed.js"></script>
			</div>
		</div>
	</div>
</section>

<style>
	/* ══════════════════════════════════════
	   TIKTOK EMBED — Dark Industrial Section
	   ══════════════════════════════════════ */

	.tiktok-section {
		position: relative;
		padding: 6rem 0 7rem;
		background: var(--ft-dark, #0c1118);
		overflow: hidden;
	}

	/* Blueprint grid */
	.tiktok-section__grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-image:
			linear-gradient(rgba(55, 138, 146, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(55, 138, 146, 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 70%);
		-webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 70%);
		pointer-events: none;
	}

	/* Noise grain */
	.tiktok-section__noise {
		position: absolute;
		inset: 0;
		opacity: 0.02;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 256px 256px;
		z-index: 0;
		pointer-events: none;
	}

	/* Top divider — teal accent */
	.tiktok-section__divider {
		position: absolute;
		top: 0;
		left: 10%;
		right: 10%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(55, 138, 146, 0.2), transparent);
		z-index: 1;
		pointer-events: none;
	}

	/* Container */
	.tiktok-section__container {
		position: relative;
		z-index: 2;
		max-width: 1536px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	@media (min-width: 640px) {
		.tiktok-section__container {
			padding: 0 2rem;
		}
	}
	@media (min-width: 1024px) {
		.tiktok-section__container {
			padding: 0 3rem;
		}
	}

	/* Header */
	.tiktok-section__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.tiktok-section__eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-heading);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-brand-500, #378a92);
		margin-bottom: 1rem;
	}

	.tiktok-section__eyebrow::before,
	.tiktok-section__eyebrow::after {
		content: '';
		width: 2rem;
		height: 1px;
		background: var(--color-brand-500, #378a92);
		opacity: 0.3;
	}

	.tiktok-section__title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4vw, 3.25rem);
		font-weight: 700;
		color: var(--ft-dark-text, #ffffff);
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.tiktok-section__accent {
		color: var(--color-brand-500, #378a92);
	}

	.tiktok-section__subtitle {
		font-size: 1.05rem;
		color: var(--ft-dark-text-secondary, rgba(255, 255, 255, 0.35));
		max-width: 36rem;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* Embed wrapper */
	.tiktok-section__embed {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.tiktok-section__embed-frame {
		width: min(62rem, 100%);
		background: rgba(9, 14, 19, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow:
			0 18px 42px rgba(0, 0, 0, 0.45),
			0 1px 0 rgba(55, 138, 146, 0.08);
		padding: 1.25rem 1.25rem 0.75rem;
	}

	/* ══════════════════════════════════════
	   TIKTOK EMBED — Dark Theme Overrides
	   Target TikTok's internal rendered DOM
	   ══════════════════════════════════════ */

	.tiktok-section__embed :global(.tiktok-embed) {
		margin: 0 !important;
		max-width: 100% !important;
		width: 100% !important;
	}

	/* Main container — force dark bg */
	.tiktok-section__embed-frame :global(main),
	.tiktok-section__embed-frame :global([data-e2e="src-theme-template-Main"]) {
		background: #0f1722 !important;
		color: rgba(255, 255, 255, 0.9) !important;
	}

	/* Profile card container */
	.tiktok-section__embed-frame :global([data-e2e="playlist-playlistCard-Container"]),
	.tiktok-section__embed-frame :global([data-e2e="playlist-playlistCard-ContainerWrapper"]) {
		background: #0f1722 !important;
		border-color: rgba(255, 255, 255, 0.06) !important;
	}

	/* Profile info wrapper — user title area */
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UserInfoWrapper"]) {
		background: transparent !important;
	}

	/* Username text */
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UsernameContent"]),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UsernameContent"] a),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UsernameContent"] span) {
		color: #ffffff !important;
	}

	/* Stats numbers (Following, Followers, Likes) */
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-NumberWrapper"]),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-NumberContainer"]),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-NumberContainer"] a),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-NumberContainer"] span) {
		color: rgba(255, 255, 255, 0.7) !important;
	}

	/* Bio / signature text */
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UserSignature"]),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UserSignature"] a),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UserSignature"] span),
	.tiktok-section__embed-frame :global([data-e2e="creator-profile-userInfo-UserSignature"] div) {
		color: rgba(255, 255, 255, 0.5) !important;
	}

	/* All TUXText spans — catch-all for text inside the embed */
	.tiktok-section__embed-frame :global([data-e2e*="TUXText"]) {
		color: rgba(255, 255, 255, 0.7) !important;
	}

	/* Video list container */
	.tiktok-section__embed-frame :global([data-e2e="common-videoList-VideoListContainer"]) {
		background: transparent !important;
	}

	/* Video thumbnails wrapper */
	.tiktok-section__embed-frame :global([data-e2e="common-videoList-VideoContainer"]) {
		background: transparent !important;
	}

	/* Video wrapper — the card around each video */
	.tiktok-section__embed-frame :global([data-e2e="common-Video-VideoWrapper"]) {
		background: rgba(255, 255, 255, 0.04) !important;
		border-color: rgba(255, 255, 255, 0.06) !important;
	}

	/* View count on videos */
	.tiktok-section__embed-frame :global([data-e2e="common-Video-Count"]) {
		color: #ffffff !important;
	}

	/* "See more" / redirect card */
	.tiktok-section__embed-frame :global([data-e2e="common-videoList-RedirectCard"]),
	.tiktok-section__embed-frame :global([data-e2e="common-ViewMoreCard-CardContainer"]) {
		background: rgba(255, 255, 255, 0.04) !important;
		border-color: rgba(255, 255, 255, 0.06) !important;
	}

	.tiktok-section__embed-frame :global([data-e2e="common-ViewMoreCard-Text"]) {
		color: rgba(255, 255, 255, 0.7) !important;
	}

	/* Footer / bottom bar */
	.tiktok-section__embed-frame :global([data-e2e="common-cardFooter-BottomContent"]) {
		background: transparent !important;
		border-color: rgba(255, 255, 255, 0.06) !important;
	}

	/* TikTok logo SVG — invert black paths to white */
	.tiktok-section__embed-frame :global([data-e2e="common-cardFooter-LogoWrapper"] svg path[fill="black"]) {
		fill: #ffffff !important;
	}

	/* Privacy policy text */
	.tiktok-section__embed-frame :global([data-e2e="common-cardFooter-TUXText"]) {
		color: rgba(255, 255, 255, 0.4) !important;
	}

	.tiktok-section__embed-frame :global([data-e2e="common-cardFooter-PrivacyPolicyLink"]) {
		color: rgba(55, 138, 146, 0.7) !important;
	}

	/* "Open TikTok" button */
	.tiktok-section__embed-frame :global([data-e2e="common-cardFooter-TUXButton"]) {
		background: rgba(55, 138, 146, 0.15) !important;
		border-color: rgba(55, 138, 146, 0.25) !important;
		color: var(--color-brand-500, #378a92) !important;
	}

	.tiktok-section__embed-frame :global([data-e2e="common-cardFooter-TUXButton"] div) {
		color: var(--color-brand-500, #378a92) !important;
	}

	/* Play button overlay area */
	.tiktok-section__embed-frame :global([data-e2e="common-Video-PlayButtonWrapper"]) {
		background: rgba(0, 0, 0, 0.3) !important;
	}

	/* Generic fallback — any remaining white backgrounds inside the iframe-like embed */
	.tiktok-section__embed-frame :global(div[class*="css-"]) {
		background-color: transparent;
	}

	/* Re-assert key containers that NEED a specific bg */
	.tiktok-section__embed-frame :global(main[id="main"]) {
		background-color: #0f1722 !important;
	}
</style>
