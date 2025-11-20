import { e as createAstro, f as createComponent, l as renderHead, h as addAttribute, u as unescapeHTML, r as renderTemplate } from '../../../../chunks/astro/server_WYUkatmq.mjs';
import 'clsx';
import { r as requireAuth } from '../../../../chunks/auth_DteQtQsy.mjs';
import { d as db } from '../../../../chunks/db_CbTj92s0.mjs';
import { marked } from 'marked';
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
    return Astro2.redirect("/admin/articles");
  }
  const article = await db.prepare("SELECT * FROM articles WHERE id = ?").get(id);
  if (!article) {
    return Astro2.redirect("/admin/articles");
  }
  marked.setOptions({
    gfm: true,
    breaks: true
  });
  const contentHtml = await marked(article.content);
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview: ${article.title} | Admin</title><link rel="stylesheet" href="/src/styles/global.css"><meta name="robots" content="noindex, nofollow">${renderHead()}</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <a href="/admin/articles" class="text-xl text-gray-600 hover:text-blue-600">Articles</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Preview</h1> </div> <div class="flex items-center space-x-4"> <span${addAttribute(`px-3 py-1 rounded-full text-sm font-semibold ${article.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, "class")}> ${article.status} </span> <a${addAttribute(`/admin/articles/${article.id}`, "href")} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
Edit
</a> <a href="/admin/articles" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
Back to List
</a> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8"> <div class="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto"> <article> ${article.featured_image && renderTemplate`<img${addAttribute(article.featured_image, "src")}${addAttribute(article.title, "alt")} class="w-full h-auto rounded-lg mb-8">`} <div class="mb-8"> <h1 class="text-4xl font-bold mb-4">${article.title}</h1> <div class="flex flex-wrap gap-2 mb-4"> <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"> ${article.category} </span> ${article.subcategory && renderTemplate`<span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"> ${article.subcategory} </span>`} </div> ${article.excerpt && renderTemplate`<p class="text-xl text-gray-600 mb-6">${article.excerpt}</p>`} </div> <div class="prose prose-lg max-w-none"> <div>${unescapeHTML(contentHtml)}</div> </div> </article> <div class="mt-12 pt-8 border-t border-gray-200"> <h3 class="text-xl font-bold mb-4">SEO Information</h3> <div class="grid grid-cols-1 gap-4"> <div class="bg-gray-50 rounded-lg p-4"> <h4 class="font-semibold mb-2">Meta Title</h4> <p class="text-sm text-gray-600">${article.meta_title || "Not set"}</p> </div> <div class="bg-gray-50 rounded-lg p-4"> <h4 class="font-semibold mb-2">Meta Description</h4> <p class="text-sm text-gray-600">${article.meta_description || "Not set"}</p> </div> <div class="bg-gray-50 rounded-lg p-4"> <h4 class="font-semibold mb-2">Keywords</h4> <p class="text-sm text-gray-600">${article.keywords || "Not set"}</p> </div> <div class="bg-gray-50 rounded-lg p-4"> <h4 class="font-semibold mb-2">Slug</h4> <p class="text-sm text-gray-600">${article.slug}</p> </div> </div> </div> </div> </div> </body></html>`;
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/articles/preview/[id].astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/articles/preview/[id].astro";
const $$url = "/admin/articles/preview/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
