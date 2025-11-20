import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, l as renderHead } from '../chunks/astro/server_WYUkatmq.mjs';
import 'clsx';
/* empty css                                 */
import { r as requireAuth } from '../chunks/auth_gn-l6IWQ.mjs';
import { d as db } from '../chunks/db_DT4W4eUV.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  const articlesCount = (await db.prepare("SELECT COUNT(*) as count FROM articles").get()).count;
  const toolsCount = (await db.prepare("SELECT COUNT(*) as count FROM ai_tools").get()).count;
  const publishedArticlesCount = (await db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'published'").get()).count;
  const publishedToolsCount = (await db.prepare("SELECT COUNT(*) as count FROM ai_tools WHERE status = 'published'").get()).count;
  const recentArticles = await db.prepare("SELECT * FROM articles ORDER BY created_at DESC LIMIT 5").all();
  const recentTools = await db.prepare("SELECT * FROM ai_tools ORDER BY created_at DESC LIMIT 5").all();
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Dashboard | AI Tools Insights</title><meta name="robots" content="noindex, nofollow">', '</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <h1 class="text-2xl font-bold text-blue-600">AI Tools Insights Admin</h1> <div class="flex items-center space-x-4"> <span class="text-gray-600">Welcome, ', '</span> <a href="/admin/settings" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">\n\u2699\uFE0F Settings\n</a> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">\nLogout\n</button> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8"> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> <div class="bg-white rounded-lg shadow p-6"> <h3 class="text-gray-600 text-sm font-medium mb-2">Total Articles</h3> <p class="text-3xl font-bold text-blue-600">', '</p> </div> <div class="bg-white rounded-lg shadow p-6"> <h3 class="text-gray-600 text-sm font-medium mb-2">Total AI Tools</h3> <p class="text-3xl font-bold text-green-600">', '</p> </div> <div class="bg-white rounded-lg shadow p-6"> <h3 class="text-gray-600 text-sm font-medium mb-2">Published Articles</h3> <p class="text-3xl font-bold text-purple-600">', '</p> </div> <div class="bg-white rounded-lg shadow p-6"> <h3 class="text-gray-600 text-sm font-medium mb-2">Published Tools</h3> <p class="text-3xl font-bold text-orange-600">', '</p> </div> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-white rounded-lg shadow p-6"> <div class="flex items-center justify-between mb-6"> <h2 class="text-2xl font-bold">Articles</h2> <a href="/admin/articles/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">\nNew Article\n</a> </div> <div class="space-y-4"> ', ' </div> <div class="mt-6 text-center"> <a href="/admin/articles" class="text-blue-600 hover:underline font-medium">View All Articles \u2192</a> </div> </div> <div class="bg-white rounded-lg shadow p-6"> <div class="flex items-center justify-between mb-6"> <h2 class="text-2xl font-bold">AI Tools</h2> <a href="/admin/tools/new" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">\nNew Tool\n</a> </div> <div class="space-y-4"> ', ` </div> <div class="mt-6 text-center"> <a href="/admin/tools" class="text-blue-600 hover:underline font-medium">View All Tools \u2192</a> </div> </div> </div> <div class="mt-8"> <h2 class="text-2xl font-bold mb-4">Articles Automation</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <a href="/admin/content-optimizer" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"> <h3 class="text-2xl font-bold mb-2">\u{1F4DD} Content Optimizer</h3> <p class="text-blue-100">Semi-automatic article optimization with SEO enhancements</p> </a> <a href="/admin/auto-generate" class="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"> <h3 class="text-2xl font-bold mb-2">\u{1F916} Auto-Generate Articles</h3> <p class="text-green-100">Fully automatic article generation powered by AI</p> </a> </div> </div> <div class="mt-8"> <h2 class="text-2xl font-bold mb-4">AI Tools Automation</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <a href="/admin/tools-optimizer" class="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"> <h3 class="text-2xl font-bold mb-2">\u{1F527} AI Tools Optimizer</h3> <p class="text-purple-100">Semi-automatic tool optimization with features extraction</p> </a> <a href="/admin/tools-auto-generate" class="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"> <h3 class="text-2xl font-bold mb-2">\u{1F916} Auto-Generate Tools</h3> <p class="text-teal-100">Fully automatic AI tool research and generation</p> </a> </div> </div> </div> <script>
    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`])), renderHead(), user.username, articlesCount, toolsCount, publishedArticlesCount, publishedToolsCount, recentArticles.map((article) => renderTemplate`<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"> <div class="flex items-center justify-between"> <div class="flex-1"> <h3 class="font-semibold text-lg mb-1">${article.title}</h3> <div class="flex items-center space-x-2 text-sm text-gray-600"> <span${addAttribute(`px-2 py-1 rounded text-xs ${article.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, "class")}> ${article.status} </span> <span>${article.category}</span> </div> </div> <div class="flex items-center space-x-2"> <a${addAttribute(`/admin/articles/${article.id}`, "href")} class="text-blue-600 hover:text-blue-800">Edit</a> </div> </div> </div>`), recentTools.map((tool) => renderTemplate`<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"> <div class="flex items-center justify-between"> <div class="flex-1"> <h3 class="font-semibold text-lg mb-1">${tool.name}</h3> <div class="flex items-center space-x-2 text-sm text-gray-600"> <span${addAttribute(`px-2 py-1 rounded text-xs ${tool.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, "class")}> ${tool.status} </span> ${tool.category && renderTemplate`<span>${tool.category}</span>`} </div> </div> <div class="flex items-center space-x-2"> <a${addAttribute(`/admin/tools/${tool.id}`, "href")} class="text-blue-600 hover:text-blue-800">Edit</a> </div> </div> </div>`));
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/index.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
