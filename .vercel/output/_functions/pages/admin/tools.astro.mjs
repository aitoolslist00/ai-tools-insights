import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, l as renderHead } from '../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                    */
import { r as requireAuth } from '../../chunks/auth_Cnb58Uj3.mjs';
import { d as db } from '../../chunks/db_Cj4I5Obi.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
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
  const tools = await db.prepare("SELECT * FROM ai_tools ORDER BY created_at DESC").all();
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Manage AI Tools | Admin</title><meta name="robots" content="noindex, nofollow">', '</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">AI Tools</h1> </div> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">\nLogout\n</button> </div> </div> </nav> <div class="container mx-auto px-4 py-8"> <div class="flex justify-between items-center mb-8"> <h2 class="text-3xl font-bold">All AI Tools</h2> <a href="/admin/tools/new" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">\nCreate New Tool\n</a> </div> <div class="bg-white rounded-lg shadow overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ', " </tbody> </table> </div> </div> <script>\n    async function logout() {\n      await fetch('/api/auth/logout', { method: 'POST' });\n      window.location.href = '/admin/login';\n    }\n\n    async function deleteTool(id) {\n      if (!confirm('Are you sure you want to delete this tool?')) return;\n      \n      try {\n        const response = await fetch(`/api/tools/${id}`, { method: 'DELETE' });\n        if (response.ok) {\n          window.location.reload();\n        } else {\n          alert('Failed to delete tool');\n        }\n      } catch (error) {\n        alert('An error occurred');\n      }\n    }\n  <\/script> </body> </html>"], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Manage AI Tools | Admin</title><meta name="robots" content="noindex, nofollow">', '</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">AI Tools</h1> </div> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">\nLogout\n</button> </div> </div> </nav> <div class="container mx-auto px-4 py-8"> <div class="flex justify-between items-center mb-8"> <h2 class="text-3xl font-bold">All AI Tools</h2> <a href="/admin/tools/new" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">\nCreate New Tool\n</a> </div> <div class="bg-white rounded-lg shadow overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ', " </tbody> </table> </div> </div> <script>\n    async function logout() {\n      await fetch('/api/auth/logout', { method: 'POST' });\n      window.location.href = '/admin/login';\n    }\n\n    async function deleteTool(id) {\n      if (!confirm('Are you sure you want to delete this tool?')) return;\n      \n      try {\n        const response = await fetch(\\`/api/tools/\\${id}\\`, { method: 'DELETE' });\n        if (response.ok) {\n          window.location.reload();\n        } else {\n          alert('Failed to delete tool');\n        }\n      } catch (error) {\n        alert('An error occurred');\n      }\n    }\n  <\/script> </body> </html>"])), renderHead(), tools.map((tool) => renderTemplate`<tr class="hover:bg-gray-50"> <td class="px-6 py-4 whitespace-nowrap"> <div class="text-sm font-medium text-gray-900">${tool.name}</div> </td> <td class="px-6 py-4 whitespace-nowrap"> <div class="text-sm text-gray-500">${tool.category || "N/A"}</div> </td> <td class="px-6 py-4 whitespace-nowrap"> <div class="text-sm text-gray-500">${tool.pricing || "N/A"}</div> </td> <td class="px-6 py-4 whitespace-nowrap"> <span${addAttribute(`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tool.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, "class")}> ${tool.status} </span> </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> ${new Date(tool.created_at).toLocaleDateString()} </td> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"> <a${addAttribute(`/admin/tools/${tool.id}`, "href")} class="text-blue-600 hover:text-blue-900">Edit</a> <a${addAttribute(`/admin/tools/preview/${tool.id}`, "href")} class="text-green-600 hover:text-green-900">Preview</a> <button${addAttribute(`deleteTool(${tool.id})`, "onclick")} class="text-red-600 hover:text-red-900">Delete</button> </td> </tr>`));
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools/index.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools/index.astro";
const $$url = "/admin/tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
