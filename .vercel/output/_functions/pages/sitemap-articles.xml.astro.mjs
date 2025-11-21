import { s as supabase } from '../chunks/supabase_B9b4B-3d.mjs';
export { renderers } from '../renderers.mjs';

const GET = async ({ site }) => {
  const siteUrl = site?.toString() || "https://www.aitoolsinsights.com";
  const { data: articles, error } = await supabase.from("articles").select("slug, title, updated_at, published_at, category, featured_image").eq("status", "published").order("published_at", { ascending: false });
  if (error) {
    console.error("Error fetching articles for sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
  const now = /* @__PURE__ */ new Date();
  const urlset = (articles || []).map((article) => {
    const url = `${siteUrl}blog/${article.slug}`;
    const lastmod = article.updated_at || article.published_at || now.toISOString();
    const pubDate = article.published_at || now.toISOString();
    const escapedTitle = (article.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    const imageTag = article.featured_image ? `
    <image:image>
      <image:loc>${article.featured_image}</image:loc>
      <image:title>${escapedTitle}</image:title>
    </image:image>` : "";
    const newsTag = isRecent(pubDate, 2) ? `
    <news:news>
      <news:publication>
        <news:name>AI Tools Insights</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapedTitle}</news:title>
    </news:news>` : "";
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}${newsTag}
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
      "Cache-Control": "public, max-age=600, s-maxage=1800, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex"
    }
  });
};
function isRecent(dateString, days) {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
  return diffDays <= days;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
