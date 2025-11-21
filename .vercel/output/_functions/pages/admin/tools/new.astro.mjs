import { e as createAstro, f as createComponent, r as renderTemplate, l as renderHead } from '../../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                       */
import { r as requireAuth } from '../../../chunks/auth_C7lEWL5y.mjs';
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Create New AI Tool | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <a href="/admin/tools" class="text-xl text-gray-600 hover:text-blue-600">AI Tools</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">New</h1> </div> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold mb-6">Create New AI Tool</h2> <form id="create-form" class="space-y-6"> <div> <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label> <input type="text" id="name" name="name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> </div> <div> <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">Slug</label> <input type="text" id="slug" name="slug" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> <p class="text-sm text-gray-500 mt-1">URL-friendly version of the name (e.g., "chatgpt-openai")</p> </div> <div> <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Short Description</label> <textarea id="description" name="description" required rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea> </div> <div> <label for="long_description" class="block text-sm font-medium text-gray-700 mb-2">Long Description</label> <textarea id="long_description" name="long_description" rows="8" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"></textarea> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label for="website_url" class="block text-sm font-medium text-gray-700 mb-2">Website URL</label> <input type="url" id="website_url" name="website_url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> </div> <div> <label for="logo_url" class="block text-sm font-medium text-gray-700 mb-2">Logo URL</label> <input type="url" id="logo_url" name="logo_url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> </div> </div> <div> <label for="affiliate_link" class="block text-sm font-medium text-gray-700 mb-2">Affiliate Link</label> <input type="url" id="affiliate_link" name="affiliate_link" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Your affiliate link for this tool"> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label> <input type="text" id="category" name="category" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Writing, Image Generation, Coding"> </div> <div> <label for="pricing" class="block text-sm font-medium text-gray-700 mb-2">Pricing</label> <input type="text" id="pricing" name="pricing" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Free, Freemium, Paid"> </div> </div> <div> <label for="features" class="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label> <textarea id="features" name="features" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Natural language processing, AI chat, Code generation"></textarea> </div> <div> <label for="meta_title" class="block text-sm font-medium text-gray-700 mb-2">Meta Title</label> <input type="text" id="meta_title" name="meta_title" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> </div> <div> <label for="meta_description" class="block text-sm font-medium text-gray-700 mb-2">Meta Description</label> <textarea id="meta_description" name="meta_description" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea> </div> <div> <label for="keywords" class="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label> <input type="text" id="keywords" name="keywords" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> </div> <div> <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Status</label> <select id="status" name="status" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> <option value="draft">Draft</option> <option value="published">Published</option> </select> </div> <div class="flex space-x-4"> <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
Create Tool
</button> <a href="/admin/tools" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center">
Cancel
</a> </div> </form> </div> </div> <script>
    const form = document.getElementById('create-form');
    const nameInput = document.getElementById('name');
    const slugInput = document.getElementById('slug');

    nameInput.addEventListener('input', () => {
      if (!slugInput.value || slugInput.dataset.auto !== 'false') {
        slugInput.value = nameInput.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        slugInput.dataset.auto = 'true';
      }
    });

    slugInput.addEventListener('input', () => {
      slugInput.dataset.auto = 'false';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        long_description: formData.get('long_description'),
        website_url: formData.get('website_url'),
        logo_url: formData.get('logo_url'),
        affiliate_link: formData.get('affiliate_link'),
        category: formData.get('category'),
        pricing: formData.get('pricing'),
        features: formData.get('features'),
        meta_title: formData.get('meta_title'),
        meta_description: formData.get('meta_description'),
        keywords: formData.get('keywords'),
        status: formData.get('status')
      };

      try {
        const response = await fetch('/api/tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert('AI Tool created successfully!');
          window.location.href = '/admin/tools';
        } else {
          const error = await response.json();
          alert('Creation failed: ' + error.error);
        }
      } catch (error) {
        alert('An error occurred');
      }
    });

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`])), renderHead());
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools/new.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools/new.astro";
const $$url = "/admin/tools/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
