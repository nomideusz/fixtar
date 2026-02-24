import { p as private_env } from "../../../chunks/vendor.js";
function GET() {
  const domain = private_env.DOMAIN || "www.FixTar.pl";
  const baseUrl = `https://${domain}`;
  const pages = ["", "/products", "/about", "/contact", "/blog"];
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(
    (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
  ).join("")}
</urlset>`.trim();
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
export {
  GET
};
