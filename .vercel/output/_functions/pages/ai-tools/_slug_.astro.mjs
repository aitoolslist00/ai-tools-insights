import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, u as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from '../../chunks/Footer_KdnQUVU3.mjs';
import { F as FloatingActions, A as ArticleReader } from '../../chunks/FloatingActions_BmvwXFxr.mjs';
import { d as db } from '../../chunks/db_Cj4I5Obi.mjs';
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
  const tool = await db.prepare("SELECT * FROM ai_tools WHERE slug = ? AND status = ?").get(slug, "published");
  if (!tool) {
    return Astro2.redirect("/404");
  }
  const relatedTools = await db.prepare("SELECT * FROM ai_tools WHERE category = ? AND slug != ? AND status = ? LIMIT 3").all(tool.category, slug, "published");
  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
  });
  const htmlContent = marked.parse(tool.long_description || tool.description || "", {
    async: false,
    gfm: true,
    breaks: true
  });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": tool.meta_title || `${tool.name} | AI Tools Insights`, "description": tool.meta_description || tool.description, "keywords": tool.keywords ? tool.keywords.split(",") : [tool.name, "AI tool", "review"], "ogImage": tool.logo_url, "canonical": tool.canonical_url }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", " ", " ", '<div class="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"> <article class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24"> <div class="article-content-wrapper"> <div style="max-width: 75ch;" class="mx-auto mb-20 animate-fade-in"> <div class="flex flex-wrap items-center gap-3 mb-8"> ', " ", ' </div> <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black mb-8 text-gray-900 dark:text-white leading-[1.2] tracking-tight text-balance">', '</h1> <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-normal">', "</p> ", " ", " ", ' </div> <div class="article-content">', "</div> ", " </div> </article> ", " </div>  "])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "url": tool.website_url,
    "image": tool.logo_url,
    "applicationCategory": tool.category,
    "offers": {
      "@type": "Offer",
      "price": tool.pricing
    },
    "datePublished": tool.published_at,
    "dateModified": tool.updated_at || tool.published_at,
    "publisher": {
      "@type": "Organization",
      "name": "AI Tools Insights",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.aitoolsinsights.com/logo.png"
      }
    }
  })), renderComponent($$result2, "ArticleReader", ArticleReader, { "client:load": true, "client:component-hydration": "load", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/ArticleReader", "client:component-export": "default" }), renderComponent($$result2, "FloatingActions", FloatingActions, { "client:load": true, "title": tool.name, "client:component-hydration": "load", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/FloatingActions", "client:component-export": "default" }), maybeRenderHead(), tool.category && renderTemplate`<a href="/ai-tools" class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all hover:scale-105"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg> ${tool.category} </a>`, tool.pricing && renderTemplate`<span class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> ${tool.pricing} </span>`, tool.name, tool.description, tool.published_at && renderTemplate`<div class="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-base mb-10 pb-10 border-b border-gray-200 dark:border-gray-700"> <div class="flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <time${addAttribute(tool.published_at, "datetime")} class="font-medium"> ${new Date(tool.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> </div> </div>`, tool.logo_url && renderTemplate`<div class="relative overflow-hidden rounded-2xl shadow-2xl mb-12 group bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-16 flex items-center justify-center"> <img${addAttribute(tool.logo_url, "src")}${addAttribute(tool.name, "alt")} class="w-56 h-56 object-contain group-hover:scale-105 transition-transform duration-700"> </div>`, tool.website_url && renderTemplate`<div class="flex gap-4 mb-16"> <a${addAttribute(tool.affiliate_link || tool.website_url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-10 py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg">
Visit Website
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </a> </div>`, unescapeHTML(htmlContent), tool.features && renderTemplate`<div style="max-width: 75ch;" class="mx-auto mt-20 p-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 shadow-xl"> <h2 class="text-3xl sm:text-4xl font-black mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Key Features</h2> <div class="grid grid-cols-1 gap-4"> ${tool.features.split(",").map((feature) => renderTemplate`<div class="flex items-start gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"> <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"> <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path> </svg> </div> <span class="text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed">${feature.trim()}</span> </div>`)} </div> </div>`, relatedTools.length > 0 && renderTemplate`<section class="mt-32 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-24"> <div class="mb-16 text-center"> <h2 class="text-4xl sm:text-5xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">
Related AI Tools
</h2> <p class="text-lg text-gray-600 dark:text-gray-400">
Discover more powerful AI tools in this category
</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"> ${relatedTools.map((relatedTool) => renderTemplate`<a${addAttribute(`/ai-tools/${relatedTool.slug}`, "href")} class="group block bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"> ${relatedTool.logo_url && renderTemplate`<div class="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center aspect-square"> <img${addAttribute(relatedTool.logo_url, "src")}${addAttribute(relatedTool.name, "alt")} class="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-500"> </div>`} <div class="p-6"> <div class="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-3"> ${relatedTool.category} </div> <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"> ${relatedTool.name} </h3> <p class="text-gray-600 dark:text-gray-400 text-base line-clamp-3 leading-relaxed"> ${relatedTool.description} </p> </div> </a>`)} </div> </section>`), "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}`, "header": async ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header" })}` })}`;
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/ai-tools/[slug].astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/ai-tools/[slug].astro";
const $$url = "/ai-tools/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
