export { renderers } from '../renderers.mjs';

const GET = async ({ site }) => {
  const siteUrl = site?.toString() || "https://www.aitoolsinsights.com";
  const staticPages = [
    { url: "", changefreq: "daily", priority: "1.0", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "about", changefreq: "monthly", priority: "0.8", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "contact", changefreq: "monthly", priority: "0.8", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "blog", changefreq: "daily", priority: "0.9", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "ai-tools", changefreq: "daily", priority: "0.9", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "compare", changefreq: "weekly", priority: "0.7", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "privacy", changefreq: "yearly", priority: "0.5", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "terms", changefreq: "yearly", priority: "0.5", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "disclaimer", changefreq: "yearly", priority: "0.5", lastmod: (/* @__PURE__ */ new Date()).toISOString() }
  ];
  const urlset = staticPages.map((page) => {
    const url = page.url ? `${siteUrl}${page.url}` : siteUrl;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlset}
</urlset>`;
  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
