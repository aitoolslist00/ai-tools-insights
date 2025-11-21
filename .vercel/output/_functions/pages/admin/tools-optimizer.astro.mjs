import { e as createAstro, f as createComponent, r as renderTemplate, l as renderHead } from '../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                    */
import { r as requireAuth } from '../../chunks/auth_C7lEWL5y.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$ToolsOptimizer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ToolsOptimizer;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AI Tools Optimizer | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">AI Tools Optimizer</h1> </div> <div class="flex items-center space-x-4"> <a href="/admin/settings" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
\u2699\uFE0F Settings
</a> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-6xl"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold mb-6">Semi-Automatic AI Tools Optimizer</h2> <p class="text-gray-600 mb-8">Enter basic information about an AI tool and let AI enhance the description, extract features, and optimize for SEO.</p> <form id="optimizer-form" class="space-y-6"> <div> <label for="tool_name" class="block text-sm font-medium text-gray-700 mb-2">Tool Name</label> <input type="text" id="tool_name" name="tool_name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., ChatGPT, Midjourney, GitHub Copilot"> </div> <div> <label for="website_url" class="block text-sm font-medium text-gray-700 mb-2">Website URL</label> <input type="url" id="website_url" name="website_url" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="https://..."> </div> <div> <label for="basic_description" class="block text-sm font-medium text-gray-700 mb-2">Basic Description</label> <textarea id="basic_description" name="basic_description" rows="4" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Provide a brief description of what this tool does..."></textarea> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label> <input type="text" id="category" name="category" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Writing, Image Generation, Coding"> </div> <div> <label for="pricing" class="block text-sm font-medium text-gray-700 mb-2">Pricing Model</label> <input type="text" id="pricing" name="pricing" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Free, Freemium, Paid"> </div> </div> <div> <label for="affiliate_link" class="block text-sm font-medium text-gray-700 mb-2">Affiliate Link (Optional)</label> <input type="url" id="affiliate_link" name="affiliate_link" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Your affiliate link for this tool"> </div> <div id="optimization-progress" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6"> <div class="flex items-center mb-4"> <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div> <span class="text-green-800 font-medium">Optimizing AI tool information...</span> </div> <div class="w-full bg-gray-200 rounded-full h-2"> <div id="progress-bar" class="bg-green-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div> </div> <p id="progress-text" class="text-sm text-gray-600 mt-2">Initializing...</p> </div> </div> <div id="optimized-content" class="hidden"> <h3 class="text-xl font-bold mb-4">Optimized Tool Information</h3> <div class="space-y-4"> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Short Description</h4> <p id="optimized-description" class="text-sm"></p> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Long Description</h4> <div id="optimized-long-description" class="text-sm prose max-w-none"></div> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Key Features</h4> <p id="optimized-features" class="text-sm"></p> </div> </div> <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Title</h4> <p id="meta-title" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Description</h4> <p id="meta-description" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Keywords</h4> <p id="keywords" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Slug</h4> <p id="slug" class="text-sm"></p> </div> </div> </div> <div class="flex space-x-4"> <button type="submit" id="optimize-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F680} Optimize Tool Info
</button> <button type="button" id="publish-btn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors hidden">
\u2705 Publish Tool
</button> </div> </form> </div> </div> <script>
    const form = document.getElementById('optimizer-form');
    const progressContainer = document.getElementById('optimization-progress');
    const optimizedContainer = document.getElementById('optimized-content');
    const optimizeBtn = document.getElementById('optimize-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    let optimizedData = null;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        tool_name: formData.get('tool_name'),
        website_url: formData.get('website_url'),
        basic_description: formData.get('basic_description'),
        category: formData.get('category'),
        pricing: formData.get('pricing'),
        affiliate_link: formData.get('affiliate_link')
      };

      progressContainer.classList.remove('hidden');
      optimizedContainer.classList.add('hidden');
      optimizeBtn.disabled = true;

      simulateProgress();

      try {
        const response = await fetch('/api/tools/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
          optimizedData = result;
          displayOptimizedContent(result);
          progressContainer.classList.add('hidden');
          optimizedContainer.classList.remove('hidden');
          publishBtn.classList.remove('hidden');
        } else {
          alert('Optimization failed: ' + result.error);
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
        const response = await fetch('/api/tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(optimizedData)
        });

        if (response.ok) {
          alert('AI Tool published successfully!');
          window.location.href = '/admin/tools';
        } else {
          alert('Publishing failed');
        }
      } catch (error) {
        alert('An error occurred');
      } finally {
        publishBtn.disabled = false;
        publishBtn.textContent = '\u2705 Publish Tool';
      }
    });

    function simulateProgress() {
      const progressBar = document.getElementById('progress-bar');
      const progressText = document.getElementById('progress-text');
      
      const steps = [
        { width: 20, text: 'Analyzing tool information...' },
        { width: 40, text: 'Generating detailed description...' },
        { width: 60, text: 'Extracting key features...' },
        { width: 80, text: 'Creating SEO metadata...' },
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
      document.getElementById('optimized-description').textContent = data.description;
      document.getElementById('optimized-long-description').innerHTML = data.long_description;
      document.getElementById('optimized-features').textContent = data.features;
      document.getElementById('meta-title').textContent = data.meta_title;
      document.getElementById('meta-description').textContent = data.meta_description;
      document.getElementById('keywords').textContent = data.keywords;
      document.getElementById('slug').textContent = data.slug;
    }

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`])), renderHead());
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools-optimizer.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools-optimizer.astro";
const $$url = "/admin/tools-optimizer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ToolsOptimizer,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
