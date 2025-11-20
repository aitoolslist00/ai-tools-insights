export { renderers } from '../renderers.mjs';

const GET = async ({ site }) => {
  const siteUrl = site?.toString() || "https://www.aitoolsinsights.com";
  const lastmod = (/* @__PURE__ */ new Date()).toISOString();
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}sitemap-0.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}sitemap-articles.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}sitemap-tools.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
  return new Response(sitemapIndex, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
