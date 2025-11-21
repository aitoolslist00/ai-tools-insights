import { e as createAstro, f as createComponent, r as renderTemplate, l as renderHead } from '../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                    */
import { r as requireAuth } from '../../chunks/auth_C7lEWL5y.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$AutoGenerate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AutoGenerate;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Auto-Generate Article | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Auto-Generate</h1> </div> <div class="flex items-center space-x-4"> <a href="/admin/settings" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
\u2699\uFE0F Settings
</a> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-lg p-8 mb-8"> <h2 class="text-3xl font-bold mb-4">\u{1F916} 10-Step Advanced SEO Article Generation System</h2> <p class="text-green-100 mb-3">
Comprehensive 10-step workflow powered by Gemini 2.5 Flash and NewsAPI. Retrieves latest information and generates 10 H2 titles + 20 H3 titles covering the keyword from all angles. Extracts 100 semantic keywords and merges them into all headings. Creates structured articles where every H2 has exactly 2 H3 subsections. Includes comparison/summary tables, external sources, 3 AI images, complete JSON-LD schemas, and full meta optimization.
</p> <div class="flex flex-wrap gap-2"> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u26A1 E-E-A-T Optimized</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F3AF} Flesch 60-70</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F916} AI Bypass</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F511} 100 Keywords</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F4CA} Tables & Stats</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F3A8} 3x AI Images</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F4CB} Full Schema</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F680} Top 3 Ranking</span> </div> </div> <div class="bg-white rounded-lg shadow-lg p-8"> <form id="generate-form" class="space-y-6"> <div> <label for="keyword" class="block text-sm font-medium text-gray-700 mb-2">Keyword / Topic</label> <input type="text" id="keyword" name="keyword" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., ChatGPT, AI image generation, machine learning"> </div> <div> <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label> <select id="category" name="category" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> <option value="">Select category</option> <option value="ai-tools">AI Tools</option> <option value="blog">Blog</option> </select> </div> <div id="subcategory-container" class="hidden"> <label for="subcategory" class="block text-sm font-medium text-gray-700 mb-2">Blog Subcategory</label> <select id="subcategory" name="subcategory" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> <option value="">Select subcategory</option> <option value="Reviews">Reviews</option> <option value="Comparisons">Comparisons</option> <option value="Tutorials">Tutorials</option> <option value="Industry News">Industry News</option> <option value="Development">Development</option> </select> </div> <div id="affiliate-link-container" class="hidden"> <label for="affiliate_link" class="block text-sm font-medium text-gray-700 mb-2">Affiliate Link (Optional)</label> <input type="url" id="affiliate_link" name="affiliate_link" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Enter your affiliate link for this AI tool"> <p class="text-sm text-gray-500 mt-1">If provided, the article will use your affiliate link. Otherwise, it will use the tool's official website.</p> </div> <div id="generation-progress" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6"> <div class="flex items-center mb-4"> <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div> <span class="text-green-800 font-medium">Generating article...</span> </div> <div class="w-full bg-gray-200 rounded-full h-2"> <div id="progress-bar" class="bg-green-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div> </div> <p id="progress-text" class="text-sm text-gray-600 mt-2">Initializing...</p> </div> </div> <div id="generated-content" class="hidden"> <h3 class="text-2xl font-bold mb-4 text-green-600">\u2705 Article Generated Successfully!</h3> <div id="quality-score-container" class="mb-6"> <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6"> <div class="flex items-center justify-between mb-4"> <h4 class="text-xl font-bold">Content Quality Score</h4> <div class="text-4xl font-bold" id="quality-score">0</div> </div> <div class="w-full bg-white bg-opacity-30 rounded-full h-3"> <div id="quality-bar" class="bg-white h-3 rounded-full transition-all duration-500" style="width: 0%"></div> </div> <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm"> <div> <div class="opacity-80">Word Count</div> <div class="font-bold text-lg" id="word-count">0</div> </div> <div> <div class="opacity-80">Headings</div> <div class="font-bold text-lg" id="heading-count">0</div> </div> <div> <div class="opacity-80">Readability</div> <div class="font-bold text-lg" id="readability-score">0</div> </div> <div> <div class="opacity-80">AI Detection</div> <div class="font-bold text-lg" id="ai-detection-score">0</div> </div> <div> <div class="opacity-80">Schema Types</div> <div class="font-bold text-lg" id="schema-count">0</div> </div> </div> </div> <div id="quality-issues" class="hidden mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4"> <h5 class="font-semibold mb-2">\u26A0\uFE0F Quality Issues</h5> <ul id="issues-list" class="list-disc list-inside text-sm text-yellow-800"></ul> </div> <div id="quality-recommendations" class="hidden mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"> <h5 class="font-semibold mb-2">\u{1F4A1} Recommendations</h5> <ul id="recommendations-list" class="list-disc list-inside text-sm text-blue-800"></ul> </div> </div> <div id="featured-image-container" class="hidden mb-6"> <h4 class="font-semibold mb-2">Featured Image</h4> <img id="featured-image" src="" alt="Featured image" class="w-full max-w-2xl rounded-lg shadow-lg"> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6"> <h4 class="font-semibold text-lg mb-2" id="generated-title"></h4> <div id="generated-preview" class="prose max-w-none"></div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Title</h4> <p id="meta-title" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Description</h4> <p id="meta-description" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Keywords</h4> <p id="keywords" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Category</h4> <p id="final-category" class="text-sm"></p> </div> </div> </div> <div class="flex space-x-4"> <button type="submit" id="generate-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F680} Generate Article
</button> <button type="button" id="publish-btn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors hidden">
\u2705 Publish Article
</button> </div> </form> </div> <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"> <h3 class="font-semibold mb-4 text-lg">\u{1F680} 10-Step SEO Article Generation Workflow</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 1: Latest Information & Title Generation</h4> <p class="text-sm text-gray-700">Use NewsAPI and Gemini 2.5 Flash API to retrieve the latest information regarding the input Keyword. Search for everything related to the keyword to obtain the most up-to-date data. Then, compile the top 10 H2 titles and top 20 H3 titles that cover the keyword from all angles and topics. Condition: Do not repeat titles. Use words related to the main keyword and organize them into the H2 and H3 structure.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 2: Semantic Keywords Generation</h4> <p class="text-sm text-gray-700">Using NewsAPI and Gemini 2.5 Flash API, generate a list of the top 100 strong semantic keywords related to the main keyword that cover the topic from all directions.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 3: Keyword Integration</h4> <p class="text-sm text-gray-700">Using NewsAPI and Gemini 2.5 Flash API, merge the semantic keywords extracted in Step 2 into all the H2 and H3 titles gathered in Step 1.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 4: Complete Article Structure</h4> <p class="text-sm text-gray-700">Based on Steps 1, 2, and 3, create a complete article structure using Gemini 2.5 Flash. This must include the Main Title (H1), followed by the Introduction, then H2 and H3 titles. Structure Rule: Every H2 title must have exactly 2 H3 titles underneath it, followed by the Conclusion.</p> </div> <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-400"> <h4 class="font-semibold text-green-800 mb-2">\u26A1 Step 5: SEO-Optimized Content Writing</h4> <p class="text-sm text-green-900 font-medium">Based on Steps 1, 2, 3, and 4, use Gemini 2.5 Flash to write the full content, optimized for search engines (SEO): H1 Title must clearly contain the main keyword, include synonym/semantic keywords, and be catchy and direct. Introduction must be exactly 3 lines long, answer a crucial query regarding the keyword very directly, target the keyword clearly, and contain a very high density of semantic keywords. Body: Write H2 and H3 titles and paragraphs such that every H2 title is followed by a simple 2-line paragraph, then splits into the 2 H3 subsections. Conclusion: Write a distinctive conclusion for the article.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 6: Table Generation & Distribution</h4> <p class="text-sm text-gray-700">Use Gemini 2.5 Flash API to analyze the content generated in Step 5. Create a Comparison Table and a Summary Table, and distribute them well within the article.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 7: External Source Integration</h4> <p class="text-sm text-gray-700">Use NewsAPI and Gemini 2.5 Flash API to obtain external sources via functioning external links from authoritative websites and insert them into the article in a formatted manner.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 8: AI Image Generation</h4> <p class="text-sm text-gray-700">Generates THREE unique images using Pollinations AI (100% Free): a hero image placed after the introduction and two supporting images strategically placed throughout the article.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 9: Schema Markup Generation</h4> <p class="text-sm text-gray-700">Use Gemini 2.5 Flash API to thoroughly analyze the article and generate the following Schema Markup (JSON-LD) in detail, clearly, and using the latest/best syntax: Article, FAQPage, HowTo, and Breadcrumb.</p> </div> <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-400 md:col-span-2"> <h4 class="font-semibold text-purple-800 mb-2">\u2728 Step 10: Technical Optimization & Publishing</h4> <p class="text-sm text-purple-900 font-medium">Optimize the following technical elements: Meta Title, Meta Description, Meta Keywords, Canonical Tag, Canonical URL, Robots Meta Tag, OG URL, Twitter Card, Viewport, OG Title, OG Description, OG Image, and Slugs. Slug must be direct, short, and contain only the input keyword. Author: Add the author's name. Expertise: Add an "Author Expertise" section at the bottom of the article.</p> </div> </div> <div class="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded"> <p class="text-sm text-green-900 font-bold">
\u2728 Result: Comprehensive SEO-optimized articles with 10 H2 titles + 20 H3 titles from NewsAPI, 100 semantic keywords integrated into all headings, structured content (every H2 has exactly 2 H3 subsections), comparison and summary tables, external authoritative sources, 3 AI-generated images, complete JSON-LD schema markup (Article, FAQPage, HowTo, Breadcrumb), full meta tag optimization, and author expertise section
</p> </div> </div> </div> <script>
    const form = document.getElementById('generate-form');
    const categorySelect = document.getElementById('category');
    const subcategoryContainer = document.getElementById('subcategory-container');
    const affiliateLinkContainer = document.getElementById('affiliate-link-container');
    const progressContainer = document.getElementById('generation-progress');
    const generatedContainer = document.getElementById('generated-content');
    const generateBtn = document.getElementById('generate-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    let generatedData = null;

    categorySelect.addEventListener('change', () => {
      if (categorySelect.value === 'blog') {
        subcategoryContainer.classList.remove('hidden');
        affiliateLinkContainer.classList.add('hidden');
      } else if (categorySelect.value === 'ai-tools') {
        subcategoryContainer.classList.add('hidden');
        affiliateLinkContainer.classList.remove('hidden');
      } else {
        subcategoryContainer.classList.add('hidden');
        affiliateLinkContainer.classList.add('hidden');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const keyword = formData.get('keyword');
      const category = formData.get('category');
      const subcategory = formData.get('subcategory');
      const affiliate_link = formData.get('affiliate_link');

      progressContainer.classList.remove('hidden');
      generatedContainer.classList.add('hidden');
      generateBtn.disabled = true;

      const progressBar = document.getElementById('progress-bar');
      const progressText = document.getElementById('progress-text');

      try {
        const response = await fetch('/api/content/auto-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, category, subcategory, affiliate_link })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;
            
            try {
              const message = JSON.parse(line);
              
              if (message.type === 'progress') {
                const percent = (message.step / 10) * 100;
                progressBar.style.width = percent + '%';
                progressText.textContent = message.message;
              } else if (message.type === 'complete') {
                generatedData = message.data;
                displayGeneratedContent(message.data);
                progressContainer.classList.add('hidden');
                generatedContainer.classList.remove('hidden');
                publishBtn.classList.remove('hidden');
              } else if (message.type === 'error') {
                alert('Generation failed: ' + message.error);
                progressContainer.classList.add('hidden');
              }
            } catch (err) {
              console.error('Failed to parse message:', line, err);
            }
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred: ' + error.message);
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
        const response = await fetch('/api/content/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(generatedData)
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

    function displayGeneratedContent(data) {
      document.getElementById('generated-title').textContent = data.title;
      document.getElementById('generated-preview').innerHTML = data.html;
      document.getElementById('meta-title').textContent = data.metaTitle;
      document.getElementById('meta-description').textContent = data.metaDescription;
      document.getElementById('keywords').textContent = Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords;
      document.getElementById('final-category').textContent = data.category + (data.subcategory ? \` > \${data.subcategory}\` : '');
      
      if (data.qualityScore !== undefined) {
        document.getElementById('quality-score').textContent = Math.round(data.qualityScore);
        document.getElementById('quality-bar').style.width = data.qualityScore + '%';
        
        if (data.qualityMetrics) {
          document.getElementById('word-count').textContent = data.qualityMetrics.wordCount || 0;
          document.getElementById('heading-count').textContent = data.qualityMetrics.headingCount || 0;
          document.getElementById('readability-score').textContent = Math.round(data.qualityMetrics.readabilityScore || 0);
          document.getElementById('ai-detection-score').textContent = Math.round(data.qualityMetrics.aiDetectionScore || 0);
          document.getElementById('schema-count').textContent = data.schemas ? data.schemas.length : 0;
          
          if (data.qualityMetrics.issues && data.qualityMetrics.issues.length > 0) {
            const issuesList = document.getElementById('issues-list');
            issuesList.innerHTML = '';
            data.qualityMetrics.issues.forEach(issue => {
              const li = document.createElement('li');
              li.textContent = issue;
              issuesList.appendChild(li);
            });
            document.getElementById('quality-issues').classList.remove('hidden');
          }
          
          if (data.qualityMetrics.recommendations && data.qualityMetrics.recommendations.length > 0) {
            const recList = document.getElementById('recommendations-list');
            recList.innerHTML = '';
            data.qualityMetrics.recommendations.forEach(rec => {
              const li = document.createElement('li');
              li.textContent = rec;
              recList.appendChild(li);
            });
            document.getElementById('quality-recommendations').classList.remove('hidden');
          }
        }
      }
      
      if (data.featuredImage) {
        const imageContainer = document.getElementById('featured-image-container');
        const imageElement = document.getElementById('featured-image');
        imageElement.src = data.featuredImage;
        imageContainer.classList.remove('hidden');
      }
    }

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Auto-Generate Article | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Auto-Generate</h1> </div> <div class="flex items-center space-x-4"> <a href="/admin/settings" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
\u2699\uFE0F Settings
</a> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-lg p-8 mb-8"> <h2 class="text-3xl font-bold mb-4">\u{1F916} 10-Step Advanced SEO Article Generation System</h2> <p class="text-green-100 mb-3">
Comprehensive 10-step workflow powered by Gemini 2.5 Flash and NewsAPI. Retrieves latest information and generates 10 H2 titles + 20 H3 titles covering the keyword from all angles. Extracts 100 semantic keywords and merges them into all headings. Creates structured articles where every H2 has exactly 2 H3 subsections. Includes comparison/summary tables, external sources, 3 AI images, complete JSON-LD schemas, and full meta optimization.
</p> <div class="flex flex-wrap gap-2"> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u26A1 E-E-A-T Optimized</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F3AF} Flesch 60-70</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F916} AI Bypass</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F511} 100 Keywords</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F4CA} Tables & Stats</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F3A8} 3x AI Images</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F4CB} Full Schema</span> <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">\u{1F680} Top 3 Ranking</span> </div> </div> <div class="bg-white rounded-lg shadow-lg p-8"> <form id="generate-form" class="space-y-6"> <div> <label for="keyword" class="block text-sm font-medium text-gray-700 mb-2">Keyword / Topic</label> <input type="text" id="keyword" name="keyword" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., ChatGPT, AI image generation, machine learning"> </div> <div> <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label> <select id="category" name="category" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> <option value="">Select category</option> <option value="ai-tools">AI Tools</option> <option value="blog">Blog</option> </select> </div> <div id="subcategory-container" class="hidden"> <label for="subcategory" class="block text-sm font-medium text-gray-700 mb-2">Blog Subcategory</label> <select id="subcategory" name="subcategory" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"> <option value="">Select subcategory</option> <option value="Reviews">Reviews</option> <option value="Comparisons">Comparisons</option> <option value="Tutorials">Tutorials</option> <option value="Industry News">Industry News</option> <option value="Development">Development</option> </select> </div> <div id="affiliate-link-container" class="hidden"> <label for="affiliate_link" class="block text-sm font-medium text-gray-700 mb-2">Affiliate Link (Optional)</label> <input type="url" id="affiliate_link" name="affiliate_link" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Enter your affiliate link for this AI tool"> <p class="text-sm text-gray-500 mt-1">If provided, the article will use your affiliate link. Otherwise, it will use the tool's official website.</p> </div> <div id="generation-progress" class="hidden"> <div class="bg-green-50 border border-green-200 rounded-lg p-6"> <div class="flex items-center mb-4"> <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div> <span class="text-green-800 font-medium">Generating article...</span> </div> <div class="w-full bg-gray-200 rounded-full h-2"> <div id="progress-bar" class="bg-green-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div> </div> <p id="progress-text" class="text-sm text-gray-600 mt-2">Initializing...</p> </div> </div> <div id="generated-content" class="hidden"> <h3 class="text-2xl font-bold mb-4 text-green-600">\u2705 Article Generated Successfully!</h3> <div id="quality-score-container" class="mb-6"> <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6"> <div class="flex items-center justify-between mb-4"> <h4 class="text-xl font-bold">Content Quality Score</h4> <div class="text-4xl font-bold" id="quality-score">0</div> </div> <div class="w-full bg-white bg-opacity-30 rounded-full h-3"> <div id="quality-bar" class="bg-white h-3 rounded-full transition-all duration-500" style="width: 0%"></div> </div> <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm"> <div> <div class="opacity-80">Word Count</div> <div class="font-bold text-lg" id="word-count">0</div> </div> <div> <div class="opacity-80">Headings</div> <div class="font-bold text-lg" id="heading-count">0</div> </div> <div> <div class="opacity-80">Readability</div> <div class="font-bold text-lg" id="readability-score">0</div> </div> <div> <div class="opacity-80">AI Detection</div> <div class="font-bold text-lg" id="ai-detection-score">0</div> </div> <div> <div class="opacity-80">Schema Types</div> <div class="font-bold text-lg" id="schema-count">0</div> </div> </div> </div> <div id="quality-issues" class="hidden mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4"> <h5 class="font-semibold mb-2">\u26A0\uFE0F Quality Issues</h5> <ul id="issues-list" class="list-disc list-inside text-sm text-yellow-800"></ul> </div> <div id="quality-recommendations" class="hidden mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"> <h5 class="font-semibold mb-2">\u{1F4A1} Recommendations</h5> <ul id="recommendations-list" class="list-disc list-inside text-sm text-blue-800"></ul> </div> </div> <div id="featured-image-container" class="hidden mb-6"> <h4 class="font-semibold mb-2">Featured Image</h4> <img id="featured-image" src="" alt="Featured image" class="w-full max-w-2xl rounded-lg shadow-lg"> </div> <div class="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6"> <h4 class="font-semibold text-lg mb-2" id="generated-title"></h4> <div id="generated-preview" class="prose max-w-none"></div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Title</h4> <p id="meta-title" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">SEO Meta Description</h4> <p id="meta-description" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Keywords</h4> <p id="keywords" class="text-sm"></p> </div> <div class="bg-green-50 border border-green-200 rounded-lg p-4"> <h4 class="font-semibold mb-2">Category</h4> <p id="final-category" class="text-sm"></p> </div> </div> </div> <div class="flex space-x-4"> <button type="submit" id="generate-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F680} Generate Article
</button> <button type="button" id="publish-btn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors hidden">
\u2705 Publish Article
</button> </div> </form> </div> <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"> <h3 class="font-semibold mb-4 text-lg">\u{1F680} 10-Step SEO Article Generation Workflow</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 1: Latest Information & Title Generation</h4> <p class="text-sm text-gray-700">Use NewsAPI and Gemini 2.5 Flash API to retrieve the latest information regarding the input Keyword. Search for everything related to the keyword to obtain the most up-to-date data. Then, compile the top 10 H2 titles and top 20 H3 titles that cover the keyword from all angles and topics. Condition: Do not repeat titles. Use words related to the main keyword and organize them into the H2 and H3 structure.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 2: Semantic Keywords Generation</h4> <p class="text-sm text-gray-700">Using NewsAPI and Gemini 2.5 Flash API, generate a list of the top 100 strong semantic keywords related to the main keyword that cover the topic from all directions.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 3: Keyword Integration</h4> <p class="text-sm text-gray-700">Using NewsAPI and Gemini 2.5 Flash API, merge the semantic keywords extracted in Step 2 into all the H2 and H3 titles gathered in Step 1.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 4: Complete Article Structure</h4> <p class="text-sm text-gray-700">Based on Steps 1, 2, and 3, create a complete article structure using Gemini 2.5 Flash. This must include the Main Title (H1), followed by the Introduction, then H2 and H3 titles. Structure Rule: Every H2 title must have exactly 2 H3 titles underneath it, followed by the Conclusion.</p> </div> <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-400"> <h4 class="font-semibold text-green-800 mb-2">\u26A1 Step 5: SEO-Optimized Content Writing</h4> <p class="text-sm text-green-900 font-medium">Based on Steps 1, 2, 3, and 4, use Gemini 2.5 Flash to write the full content, optimized for search engines (SEO): H1 Title must clearly contain the main keyword, include synonym/semantic keywords, and be catchy and direct. Introduction must be exactly 3 lines long, answer a crucial query regarding the keyword very directly, target the keyword clearly, and contain a very high density of semantic keywords. Body: Write H2 and H3 titles and paragraphs such that every H2 title is followed by a simple 2-line paragraph, then splits into the 2 H3 subsections. Conclusion: Write a distinctive conclusion for the article.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 6: Table Generation & Distribution</h4> <p class="text-sm text-gray-700">Use Gemini 2.5 Flash API to analyze the content generated in Step 5. Create a Comparison Table and a Summary Table, and distribute them well within the article.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 7: External Source Integration</h4> <p class="text-sm text-gray-700">Use NewsAPI and Gemini 2.5 Flash API to obtain external sources via functioning external links from authoritative websites and insert them into the article in a formatted manner.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 8: AI Image Generation</h4> <p class="text-sm text-gray-700">Generates THREE unique images using Pollinations AI (100% Free): a hero image placed after the introduction and two supporting images strategically placed throughout the article.</p> </div> <div class="bg-white p-4 rounded-lg border border-blue-300"> <h4 class="font-semibold text-blue-800 mb-2">Step 9: Schema Markup Generation</h4> <p class="text-sm text-gray-700">Use Gemini 2.5 Flash API to thoroughly analyze the article and generate the following Schema Markup (JSON-LD) in detail, clearly, and using the latest/best syntax: Article, FAQPage, HowTo, and Breadcrumb.</p> </div> <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-400 md:col-span-2"> <h4 class="font-semibold text-purple-800 mb-2">\u2728 Step 10: Technical Optimization & Publishing</h4> <p class="text-sm text-purple-900 font-medium">Optimize the following technical elements: Meta Title, Meta Description, Meta Keywords, Canonical Tag, Canonical URL, Robots Meta Tag, OG URL, Twitter Card, Viewport, OG Title, OG Description, OG Image, and Slugs. Slug must be direct, short, and contain only the input keyword. Author: Add the author's name. Expertise: Add an "Author Expertise" section at the bottom of the article.</p> </div> </div> <div class="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded"> <p class="text-sm text-green-900 font-bold">
\u2728 Result: Comprehensive SEO-optimized articles with 10 H2 titles + 20 H3 titles from NewsAPI, 100 semantic keywords integrated into all headings, structured content (every H2 has exactly 2 H3 subsections), comparison and summary tables, external authoritative sources, 3 AI-generated images, complete JSON-LD schema markup (Article, FAQPage, HowTo, Breadcrumb), full meta tag optimization, and author expertise section
</p> </div> </div> </div> <script>
    const form = document.getElementById('generate-form');
    const categorySelect = document.getElementById('category');
    const subcategoryContainer = document.getElementById('subcategory-container');
    const affiliateLinkContainer = document.getElementById('affiliate-link-container');
    const progressContainer = document.getElementById('generation-progress');
    const generatedContainer = document.getElementById('generated-content');
    const generateBtn = document.getElementById('generate-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    let generatedData = null;

    categorySelect.addEventListener('change', () => {
      if (categorySelect.value === 'blog') {
        subcategoryContainer.classList.remove('hidden');
        affiliateLinkContainer.classList.add('hidden');
      } else if (categorySelect.value === 'ai-tools') {
        subcategoryContainer.classList.add('hidden');
        affiliateLinkContainer.classList.remove('hidden');
      } else {
        subcategoryContainer.classList.add('hidden');
        affiliateLinkContainer.classList.add('hidden');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const keyword = formData.get('keyword');
      const category = formData.get('category');
      const subcategory = formData.get('subcategory');
      const affiliate_link = formData.get('affiliate_link');

      progressContainer.classList.remove('hidden');
      generatedContainer.classList.add('hidden');
      generateBtn.disabled = true;

      const progressBar = document.getElementById('progress-bar');
      const progressText = document.getElementById('progress-text');

      try {
        const response = await fetch('/api/content/auto-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, category, subcategory, affiliate_link })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\\\\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;
            
            try {
              const message = JSON.parse(line);
              
              if (message.type === 'progress') {
                const percent = (message.step / 10) * 100;
                progressBar.style.width = percent + '%';
                progressText.textContent = message.message;
              } else if (message.type === 'complete') {
                generatedData = message.data;
                displayGeneratedContent(message.data);
                progressContainer.classList.add('hidden');
                generatedContainer.classList.remove('hidden');
                publishBtn.classList.remove('hidden');
              } else if (message.type === 'error') {
                alert('Generation failed: ' + message.error);
                progressContainer.classList.add('hidden');
              }
            } catch (err) {
              console.error('Failed to parse message:', line, err);
            }
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred: ' + error.message);
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
        const response = await fetch('/api/content/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(generatedData)
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

    function displayGeneratedContent(data) {
      document.getElementById('generated-title').textContent = data.title;
      document.getElementById('generated-preview').innerHTML = data.html;
      document.getElementById('meta-title').textContent = data.metaTitle;
      document.getElementById('meta-description').textContent = data.metaDescription;
      document.getElementById('keywords').textContent = Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords;
      document.getElementById('final-category').textContent = data.category + (data.subcategory ? \\\` > \\\${data.subcategory}\\\` : '');
      
      if (data.qualityScore !== undefined) {
        document.getElementById('quality-score').textContent = Math.round(data.qualityScore);
        document.getElementById('quality-bar').style.width = data.qualityScore + '%';
        
        if (data.qualityMetrics) {
          document.getElementById('word-count').textContent = data.qualityMetrics.wordCount || 0;
          document.getElementById('heading-count').textContent = data.qualityMetrics.headingCount || 0;
          document.getElementById('readability-score').textContent = Math.round(data.qualityMetrics.readabilityScore || 0);
          document.getElementById('ai-detection-score').textContent = Math.round(data.qualityMetrics.aiDetectionScore || 0);
          document.getElementById('schema-count').textContent = data.schemas ? data.schemas.length : 0;
          
          if (data.qualityMetrics.issues && data.qualityMetrics.issues.length > 0) {
            const issuesList = document.getElementById('issues-list');
            issuesList.innerHTML = '';
            data.qualityMetrics.issues.forEach(issue => {
              const li = document.createElement('li');
              li.textContent = issue;
              issuesList.appendChild(li);
            });
            document.getElementById('quality-issues').classList.remove('hidden');
          }
          
          if (data.qualityMetrics.recommendations && data.qualityMetrics.recommendations.length > 0) {
            const recList = document.getElementById('recommendations-list');
            recList.innerHTML = '';
            data.qualityMetrics.recommendations.forEach(rec => {
              const li = document.createElement('li');
              li.textContent = rec;
              recList.appendChild(li);
            });
            document.getElementById('quality-recommendations').classList.remove('hidden');
          }
        }
      }
      
      if (data.featuredImage) {
        const imageContainer = document.getElementById('featured-image-container');
        const imageElement = document.getElementById('featured-image');
        imageElement.src = data.featuredImage;
        imageContainer.classList.remove('hidden');
      }
    }

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`])), renderHead());
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/auto-generate.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/auto-generate.astro";
const $$url = "/admin/auto-generate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AutoGenerate,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
