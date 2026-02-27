import { env } from '$env/dynamic/private';

export function GET() {
	const domain = env.DOMAIN || 'www.FixTar.pl';
	const baseUrl = `https://${domain}`;

	// Define your site's primary pages - add as needed
	const pages = ['', '/products', '/about', '/contact', '/blog'];

	const today = new Date().toISOString().split('T')[0];

	// Create the sitemap XML content
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
	)
	.join('')}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
