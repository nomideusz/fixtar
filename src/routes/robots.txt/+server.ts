import { env } from '$env/dynamic/private';

export function GET() {
	const domain = env.DOMAIN || 'www.FixTar.pl';

	const robotsTxt = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /account/
Disallow: /_profiler/
Disallow: /auth/

# Sitemap
Sitemap: https://${domain}/sitemap.xml

# Crawl delay
Crawl-delay: 10
    `.trim();

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}
