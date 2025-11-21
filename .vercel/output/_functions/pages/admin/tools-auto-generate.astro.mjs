import { e as createAstro, f as createComponent, r as renderTemplate, l as renderHead } from '../../chunks/astro/server_t80nOXy5.mjs';
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
const $$ToolsAutoGenerate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ToolsAutoGenerate;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Auto-Generate AI Tool | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Auto-Generate AI Tool</h1> </div> <div class="flex items-center space-x-4"> <a href="/admin/settings" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
\u2699\uFE0F Settings
</a> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-lg p-8 mb-8"> <h2 class="text-3xl font-bold mb-4">\u{1F916} Fully Automatic AI Tool Generation</h2> <p class="text-green-100">
Powered by Google's Gemini 2.5 Flash and NewsAPI, this system automatically researches and generates complete AI tool listings with descriptions, features, pricing, and SEO optimization.
</p> </div> <div class="bg-white rounded-lg shadow-lg p-8"> <form id="generate-form" class="space-y-6"> <div> <label for="tool_keyword" class="block text-sm font-medium text-gray-700 mb-2">AI Tool Name or Keyword</label> <input type="text" id="tool_keyword" name="tool_keyword" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., ChatGPT, Midjourney, Copy.ai, Jasper"> <p class="text-sm text-gray-500 mt-1">Enter the name of an AI tool to automatically fetch and generate complete information</p> </div> <div> <label for="affiliate_link" class="block text-sm font-medium text-gray-700 mb-2">Affiliate Link (Optional)</label> <input type="url" id="affiliate_link" name="affiliate_link" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Your affiliate link for this tool"> </div> <div id="generation-progress" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6"> <div class="flex items-center mb-4"> <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div> <span class="text-green-800 font-medium">Generating AI tool information...</span> </div> <div class="w-full bg-gray-200 rounded-full h-2"> <div id="progress-bar" class="bg-green-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div> </div> <p id="progress-text" class="text-sm text-gray-600 mt-2">Initializing...</p> </div> </div> <div id="generated-content" class="hidden"> <h3 class="text-2xl font-bold mb-4 text-green-600">\u2705 AI Tool Information Generated Successfully!</h3> <div class="space-y-4 mb-6"> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Tool Name</h4> <p id="tool-name" class="text-sm font-medium"></p> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Website URL</h4> <p id="website-url" class="text-sm text-blue-600"></p> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Short Description</h4> <p id="description" class="text-sm"></p> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Long Description</h4> <div id="long-description" class="text-sm prose max-w-none"></div> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Features</h4> <p id="features" class="text-sm"></p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Category</h4> <p id="category" class="text-sm"></p> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-4"> <h4 class="font-semibold mb-2">Pricing</h4> <p id="pricing" class="text-sm"></p> </div> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Title</h4> <p id="meta-title" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Description</h4> <p id="meta-description" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Keywords</h4> <p id="keywords" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Slug</h4> <p id="slug" class="text-sm"></p> </div> </div> </div> <div class="flex space-x-4"> <button type="submit" id="generate-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F680} Generate AI Tool
</button> <button type="button" id="publish-btn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors hidden">
\u2705 Publish Tool
</button> </div> </form> </div> </div> <script>
    const form = document.getElementById('generate-form');
    const progressContainer = document.getElementById('generation-progress');
    const generatedContainer = document.getElementById('generated-content');
    const generateBtn = document.getElementById('generate-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    let generatedData = null;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const tool_keyword = formData.get('tool_keyword');
      const affiliate_link = formData.get('affiliate_link');

      progressContainer.classList.remove('hidden');
      generatedContainer.classList.add('hidden');
      generateBtn.disabled = true;

      simulateProgress();

      try {
        const response = await fetch('/api/tools/auto-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool_keyword, affiliate_link })
        });

        const data = await response.json();
        
        if (response.ok) {
          generatedData = data;
          displayGeneratedContent(data);
          progressContainer.classList.add('hidden');
          generatedContainer.classList.remove('hidden');
          publishBtn.classList.remove('hidden');
        } else {
          alert('Generation failed: ' + data.error);
          progressContainer.classList.add('hidden');
        }
      } catch (error) {
        alert('An error occurred');
        progressContainer.classList.add('hidden');
      } finally {
        generateBtn.disabled = false;
      }
    });

    publishBtn.addEventListener('click', async () => {
      if (!generatedData) return;

      publishBtn.disabled = true;
      publishBtn.textContent = 'Publishing...';

      try {
        const publishData = {
          ...generatedData,
          status: 'published',
          published_at: new Date().toISOString()
        };

        const response = await fetch('/api/tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(publishData)
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
        { width: 20, text: 'Fetching tool information from NewsAPI...' },
        { width: 40, text: 'Analyzing tool capabilities...' },
        { width: 60, text: 'Generating detailed descriptions...' },
        { width: 80, text: 'Extracting features and pricing...' },
        { width: 100, text: 'Creating SEO metadata...' }
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
      }, 1000);
    }

    function displayGeneratedContent(data) {
      document.getElementById('tool-name').textContent = data.name;
      document.getElementById('website-url').textContent = data.website_url || 'N/A';
      document.getElementById('description').textContent = data.description;
      document.getElementById('long-description').innerHTML = data.long_description;
      document.getElementById('features').textContent = data.features;
      document.getElementById('category').textContent = data.category || 'N/A';
      document.getElementById('pricing').textContent = data.pricing || 'N/A';
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
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools-auto-generate.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/tools-auto-generate.astro";
const $$url = "/admin/tools-auto-generate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ToolsAutoGenerate,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
