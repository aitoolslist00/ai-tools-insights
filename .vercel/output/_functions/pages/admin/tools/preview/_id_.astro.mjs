import { e as createAstro, f as createComponent, l as renderHead, h as addAttribute, r as renderTemplate, u as unescapeHTML } from '../../../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                          */
import { r as requireAuth } from '../../../../chunks/auth_C7lEWL5y.mjs';
import { d as db } from '../../../../chunks/db_CJGLAgIX.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/admin/tools");
  }
  const tool = await db.prepare("SELECT * FROM ai_tools WHERE id = ?").get(id);
  if (!tool) {
    return Astro2.redirect("/admin/tools");
  }
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview: ${tool.name} | Admin</title><meta name="robots" content="noindex, nofollow">${renderHead()}</head> <body class="min-h-screen bg-gray-50 dark:bg-gray-900"> <nav class="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <a href="/admin/tools" class="text-xl text-gray-600 hover:text-blue-600">AI Tools</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Preview</h1> </div> <div class="flex items-center space-x-4"> <span${addAttribute(`px-3 py-1 rounded-full text-sm font-semibold ${tool.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, "class")}> ${tool.status} </span> <a${addAttribute(`/admin/tools/${tool.id}`, "href")} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
Edit
</a> <a href="/admin/tools" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
Back to List
</a> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8"> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto"> <article class="px-4 sm:px-6 lg:px-8 py-12 article-content"> <div class="mb-12 animate-fade-in"> <div class="flex items-center gap-3 mb-6"> ${tool.category && renderTemplate`<span class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg> ${tool.category} </span>`} ${tool.pricing && renderTemplate`<span class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> ${tool.pricing} </span>`} </div> <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance gradient-text">${tool.name}</h1> <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">${tool.description}</p> ${tool.published_at && renderTemplate`<div class="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-8"> <div class="flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <time${addAttribute(tool.published_at, "datetime")}> ${new Date(tool.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> </div> </div>`} ${tool.logo_url && renderTemplate`<div class="relative overflow-hidden rounded-2xl shadow-2xl mb-12 group bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-12 flex items-center justify-center"> <img${addAttribute(tool.logo_url, "src")}${addAttribute(tool.name, "alt")} class="w-48 h-48 object-contain group-hover:scale-105 transition-transform duration-700"> </div>`} <div class="flex gap-4 mb-8"> ${tool.website_url && renderTemplate`<a${addAttribute(tool.website_url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl">
Visit Website
<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </a>`} ${tool.affiliate_link && renderTemplate`<a${addAttribute(tool.affiliate_link, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl">
Affiliate Link
<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </a>`} </div> </div> ${tool.long_description && renderTemplate`<div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg prose-pre:bg-gray-800 prose-pre:text-gray-100 mb-8">${unescapeHTML(tool.long_description)}</div>`} ${tool.features && renderTemplate`<div class="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/50"> <h2 class="text-3xl font-bold mb-6 gradient-text">Key Features</h2> <div class="prose prose-lg dark:prose-invert max-w-none"> <ul class="space-y-3"> ${tool.features.split(",").map((feature) => renderTemplate`<li class="flex items-start"> <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>${feature.trim()}</span> </li>`)} </ul> </div> </div>`} </article> <div class="px-4 sm:px-6 lg:px-8 pb-12"> <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"> <h3 class="text-2xl font-bold mb-6 gradient-text">SEO Information</h3> <div class="grid grid-cols-1 gap-4"> <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50"> <h4 class="font-semibold mb-2 text-blue-800 dark:text-blue-200">Meta Title</h4> <p class="text-sm text-gray-600 dark:text-gray-400">${tool.meta_title || "Not set"}</p> </div> <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50"> <h4 class="font-semibold mb-2 text-blue-800 dark:text-blue-200">Meta Description</h4> <p class="text-sm text-gray-600 dark:text-gray-400">${tool.meta_description || "Not set"}</p> </div> <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50"> <h4 class="font-semibold mb-2 text-blue-800 dark:text-blue-200">Keywords</h4> <p class="text-sm text-gray-600 dark:text-gray-400">${tool.keywords || "Not set"}</p> </div> <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50"> <h4 class="font-semibold mb-2 text-blue-800 dark:text-blue-200">Slug</h4> <p class="text-sm text-gray-600 dark:text-gray-400">${tool.slug}</p> </div> </div> </div> </div> </div> </div> </body></html>`;
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools/preview/[id].astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools/preview/[id].astro";
const $$url = "/admin/tools/preview/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
