import { e as createAstro, f as createComponent, r as renderTemplate, l as renderHead } from '../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                    */
import { r as requireAuth } from '../../chunks/auth_Cnb58Uj3.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$ContentOptimizer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ContentOptimizer;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Content Optimizer | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Content Optimizer</h1> </div> <div class="flex items-center space-x-4"> <a href="/admin/settings" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
\u2699\uFE0F Settings
</a> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-6xl"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold mb-6">Semi-Automatic Content Optimizer</h2> <p class="text-gray-600 mb-8">Paste your markdown content below and click optimize to enhance it with SEO best practices.</p> <form id="optimizer-form" class="space-y-6"> <div> <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Article Title</label> <input type="text" id="title" name="title" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter article title"> </div> <div> <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label> <select id="category" name="category" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"> <option value="">Select category</option> <option value="ai-tools">AI Tools</option> <option value="blog">Blog</option> </select> </div> <div id="subcategory-container" class="hidden"> <label for="subcategory" class="block text-sm font-medium text-gray-700 mb-2">Blog Subcategory</label> <select id="subcategory" name="subcategory" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"> <option value="">Select subcategory</option> <option value="Reviews">Reviews</option> <option value="Comparisons">Comparisons</option> <option value="Tutorials">Tutorials</option> <option value="Industry News">Industry News</option> <option value="Development">Development</option> </select> </div> <div> <label for="markdown" class="block text-sm font-medium text-gray-700 mb-2">Markdown Content</label> <textarea id="markdown" name="markdown" rows="15" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="Paste your markdown content here..."></textarea> </div> <div id="optimization-progress" class="hidden"> <div class="bg-blue-50 border border-blue-200 rounded-lg p-6"> <div class="flex items-center mb-4"> <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div> <span class="text-blue-800 font-medium">Optimizing content...</span> </div> <div class="w-full bg-gray-200 rounded-full h-2"> <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div> </div> <p id="progress-text" class="text-sm text-gray-600 mt-2">Initializing...</p> </div> </div> <div id="optimized-content" class="hidden"> <h3 class="text-xl font-bold mb-4">Optimized Content</h3> <div class="bg-gray-50 border border-gray-300 rounded-lg p-6"> <div id="optimized-preview" class="prose max-w-none"></div> </div> <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"> <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Title</h4> <p id="meta-title" class="text-sm"></p> </div> <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Description</h4> <p id="meta-description" class="text-sm"></p> </div> <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Keywords</h4> <p id="keywords" class="text-sm"></p> </div> <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Slug</h4> <p id="slug" class="text-sm"></p> </div> </div> </div> <div class="flex space-x-4"> <button type="submit" id="optimize-btn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F680} Optimize Content
</button> <button type="button" id="publish-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors hidden">
\u2705 Publish Article
</button> </div> </form> </div> </div> <script>
    const form = document.getElementById('optimizer-form');
    const categorySelect = document.getElementById('category');
    const subcategoryContainer = document.getElementById('subcategory-container');
    const progressContainer = document.getElementById('optimization-progress');
    const optimizedContainer = document.getElementById('optimized-content');
    const optimizeBtn = document.getElementById('optimize-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    let optimizedData: any = null;

    categorySelect.addEventListener('change', () => {
      if (categorySelect.value === 'blog') {
        subcategoryContainer.classList.remove('hidden');
      } else {
        subcategoryContainer.classList.add('hidden');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const title = formData.get('title');
      const category = formData.get('category');
      const subcategory = formData.get('subcategory');
      const markdown = formData.get('markdown');

      progressContainer.classList.remove('hidden');
      optimizedContainer.classList.add('hidden');
      optimizeBtn.disabled = true;

      simulateProgress();

      try {
        const response = await fetch('/api/content/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, subcategory, markdown })
        });

        const data = await response.json();
        
        if (response.ok) {
          optimizedData = data;
          displayOptimizedContent(data);
          progressContainer.classList.add('hidden');
          optimizedContainer.classList.remove('hidden');
          publishBtn.classList.remove('hidden');
        } else {
          alert('Optimization failed: ' + data.error);
          progressContainer.classList.add('hidden');
        }
      } catch (error) {
        alert('An error occurred');
        progressContainer.classList.add('hidden');
      } finally {
        optimizeBtn.disabled = false;
      }
    });

    publishBtn.addEventListener('click', async () => {
      if (!optimizedData) return;

      publishBtn.disabled = true;
      publishBtn.textContent = 'Publishing...';

      try {
        const response = await fetch('/api/content/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(optimizedData)
        });

        if (response.ok) {
          alert('Article published successfully!');
          window.location.href = '/admin/articles';
        } else {
          alert('Publishing failed');
        }
      } catch (error) {
        alert('An error occurred');
      } finally {
        publishBtn.disabled = false;
        publishBtn.textContent = '\u2705 Publish Article';
      }
    });

    function simulateProgress() {
      const progressBar = document.getElementById('progress-bar');
      const progressText = document.getElementById('progress-text');
      
      const steps = [
        { width: 20, text: 'Analyzing content structure...' },
        { width: 40, text: 'Optimizing headings and formatting...' },
        { width: 60, text: 'Generating SEO metadata...' },
        { width: 80, text: 'Creating internal links...' },
        { width: 100, text: 'Finalizing optimization...' }
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          const step = steps[currentStep];
          progressBar.style.width = step.width + '%';
          progressText.textContent = step.text;
          currentStep++;
        } else {
          clearInterval(interval);
        }
      }, 800);
    }

    function displayOptimizedContent(data) {
      document.getElementById('optimized-preview').innerHTML = data.html;
      document.getElementById('meta-title').textContent = data.metaTitle;
      document.getElementById('meta-description').textContent = data.metaDescription;
      document.getElementById('keywords').textContent = data.keywords.join(', ');
      document.getElementById('slug').textContent = data.slug;
    }

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`])), renderHead());
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/content-optimizer.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/content-optimizer.astro";
const $$url = "/admin/content-optimizer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ContentOptimizer,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
