import { s as supabase } from '../chunks/supabase_Dxn2jk3G.mjs';
export { renderers } from '../renderers.mjs';

const GET = async ({ site }) => {
  const siteUrl = site?.toString() || "https://www.aitoolsinsights.com";
  const { data: tools, error } = await supabase.from("ai_tools").select("slug, name, updated_at, published_at, logo_url").eq("status", "published").order("published_at", { ascending: false });
  if (error) {
    console.error("Error fetching tools for sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
  const now = /* @__PURE__ */ new Date();
  const urlset = (tools || []).map((tool) => {
    const url = `${siteUrl}ai-tools/${tool.slug}`;
    const lastmod = tool.updated_at || tool.published_at || now.toISOString();
    const escapedName = (tool.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    const imageTag = tool.logo_url ? `
    <image:image>
      <image:loc>${tool.logo_url}</image:loc>
      <image:title>${escapedName}</image:title>
    </image:image>` : "";
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
