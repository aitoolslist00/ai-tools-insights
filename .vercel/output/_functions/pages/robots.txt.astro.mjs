import { g as getSetting } from '../chunks/db_CJGLAgIX.mjs';
export { renderers } from '../renderers.mjs';

const GET = async ({ site }) => {
  const siteUrl = site?.toString() || "https://www.aitoolsinsights.com";
  const customRobots = await getSetting("robots_txt");
  if (customRobots) {
    return new Response(customRobots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400"
      }
    });
  }
  const robotsTxt = `# https://www.robotstxt.org/
# 
# AI Tools Insights - Robots.txt
# Updated: ${(/* @__PURE__ */ new Date()).toISOString()}

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/*
Disallow: /api/
Disallow: /api/*
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*preview*
Crawl-delay: 0

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /images/
Allow: /public/images/
Disallow: /admin/
Disallow: /api/

User-agent: Googlebot-News
Allow: /
Allow: /blog/
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: BingPreview
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: YandexBot
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: YandexImages
Allow: /images/
Allow: /public/images/
Disallow: /admin/
Disallow: /api/

User-agent: Yahoo! Slurp
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: Slurp
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: DuckDuckBot
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

User-agent: Baiduspider
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: cohere-ai
Disallow: /

Sitemap: ${siteUrl}sitemap-index.xml
Sitemap: ${siteUrl}sitemap-0.xml
Sitemap: ${siteUrl}sitemap-articles.xml
Sitemap: ${siteUrl}sitemap-tools.xml
`;
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
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
