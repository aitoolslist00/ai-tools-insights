import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, u as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_WYUkatmq.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from '../../chunks/Footer_c2Oz2sdU.mjs';
import { F as FloatingActions, A as ArticleReader } from '../../chunks/FloatingActions_BmvwXFxr.mjs';
import { d as db } from '../../chunks/db_CbTj92s0.mjs';
import { marked } from 'marked';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const categoryMap = {
    "reviews": "Reviews",
    "comparisons": "Comparisons",
    "tutorials": "Tutorials",
    "industry-news": "Industry News",
    "development": "Development"
  };
  const categorySlug = categoryMap[slug];
  if (categorySlug) {
    const categoryArticles = await db.prepare("SELECT * FROM articles WHERE category = ? AND status = ? ORDER BY published_at DESC").all(categorySlug, "published");
    return Astro2.rewrite(`/blog/category/${slug}`, {
      props: { articles: categoryArticles, category: categorySlug }
    });
  }
  const article = await db.prepare("SELECT * FROM articles WHERE slug = ? AND status = ?").get(slug, "published");
  if (!article) {
    return Astro2.redirect("/404");
  }
  const relatedArticles = await db.prepare("SELECT * FROM articles WHERE category = ? AND slug != ? AND status = ? LIMIT 3").all(article.category, slug, "published");
  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
  });
  const htmlContent = marked.parse(article.content || "", {
    async: false,
    gfm: true,
    breaks: true
  });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": article.meta_title || `${article.title} | AI Tools Insights`, "description": article.meta_description || article.excerpt, "keywords": article.keywords ? article.keywords.split(",") : [article.title, "AI tools"], "ogImage": article.featured_image, "canonical": article.canonical_url }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", " ", " ", '<div class="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"> <article class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24"> <div class="article-content-wrapper"> <div style="max-width: 75ch;" class="mx-auto mb-20 animate-fade-in"> <div class="mb-8"> <a', ' class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-full transition-all hover:scale-105"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg> ', ' </a> </div> <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black mb-8 text-gray-900 dark:text-white leading-[1.2] tracking-tight text-balance"> ', " </h1> ", " ", " </div> ", ' <div class="article-content">', "</div> </div> </article> ", " </div>  "])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.featured_image,
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "author": {
      "@type": "Organization",
      "name": "AI Tools Insights"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Tools Insights",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.aitoolsinsights.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.aitoolsinsights.com/blog/${article.slug}`
    }
  })), renderComponent($$result2, "ArticleReader", ArticleReader, { "client:load": true, "client:component-hydration": "load", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/ArticleReader", "client:component-export": "default" }), renderComponent($$result2, "FloatingActions", FloatingActions, { "client:load": true, "title": article.title, "client:component-hydration": "load", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/FloatingActions", "client:component-export": "default" }), maybeRenderHead(), addAttribute(`/blog/${article.category.toLowerCase().replace(/\s+/g, "-")}`, "href"), article.category, article.title, article.excerpt && renderTemplate`<p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-normal"> ${article.excerpt} </p>`, article.published_at && renderTemplate`<div class="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-base mb-12 pb-10 border-b border-gray-200 dark:border-gray-700"> <div class="flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <time${addAttribute(article.published_at, "datetime")} class="font-medium"> ${new Date(article.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> </div> </div>`, article.featured_image && renderTemplate`<div class="relative overflow-hidden mb-20" style="max-width: 75ch; margin-left: auto; margin-right: auto;"> <img${addAttribute(article.featured_image, "src")}${addAttribute(article.title, "alt")} class="w-full h-auto object-cover rounded-2xl shadow-2xl"> </div>`, unescapeHTML(htmlContent), relatedArticles.length > 0 && renderTemplate`<section class="mt-32 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-24"> <div class="mb-16 text-center"> <h2 class="text-4xl sm:text-5xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">
Related Articles
</h2> <p class="text-lg text-gray-600 dark:text-gray-400">
Continue exploring these hand-picked articles
</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"> ${relatedArticles.map((relatedArticle) => renderTemplate`<a${addAttribute(`/blog/${relatedArticle.slug}`, "href")} class="group block bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"> ${relatedArticle.featured_image && renderTemplate`<div class="relative overflow-hidden aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"> <img${addAttribute(relatedArticle.featured_image, "src")}${addAttribute(relatedArticle.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"> </div>`} <div class="p-6"> <div class="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-3"> ${relatedArticle.category} </div> <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"> ${relatedArticle.title} </h3> <p class="text-gray-600 dark:text-gray-400 text-base line-clamp-2 leading-relaxed"> ${relatedArticle.excerpt} </p> </div> </a>`)} </div> </section>`), "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}`, "header": async ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header" })}` })}`;
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/blog/[slug].astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
