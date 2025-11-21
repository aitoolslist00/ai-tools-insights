import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, l as renderHead } from '../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                    */
import { r as requireAuth } from '../../chunks/auth_Cnb58Uj3.mjs';
import { g as getSetting } from '../../chunks/db_Cj4I5Obi.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Settings;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  const geminiKeysJson = await getSetting("GEMINI_API_KEYS") || "[]";
  const newsKeysJson = await getSetting("NEWSAPI_KEYS") || "[]";
  let geminiKeys = [];
  let newsKeys = [];
  try {
    geminiKeys = JSON.parse(geminiKeysJson);
    if (!Array.isArray(geminiKeys)) geminiKeys = [];
  } catch {
    geminiKeys = [];
  }
  try {
    newsKeys = JSON.parse(newsKeysJson);
    if (!Array.isArray(newsKeys)) newsKeys = [];
  } catch {
    newsKeys = [];
  }
  while (geminiKeys.length < 10) geminiKeys.push("");
  while (newsKeys.length < 10) newsKeys.push("");
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Settings | Admin</title><meta name="robots" content="noindex, nofollow">', '</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Settings</h1> </div> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">\nLogout\n</button> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold mb-6">API Keys Configuration</h2> <p class="text-gray-600 mb-8">Configure your API keys for the article generation system. These keys are stored securely in the database.</p> <form id="settings-form" class="space-y-8"> <div class="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50"> <div class="flex items-center justify-between mb-4"> <h3 class="text-lg font-semibold text-gray-800">\u{1F916} Gemini 2.5 Flash API Keys (Up to 10)</h3> <span class="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">Load Balancing Enabled</span> </div> <p class="text-sm text-gray-600 mb-4">\nAdd up to 10 API keys for automatic load balancing and failover. Get keys from <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-600 hover:underline font-medium">Google AI Studio</a> </p> <div class="space-y-3"> ', ' </div> </div> <div class="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50"> <div class="flex items-center justify-between mb-4"> <h3 class="text-lg font-semibold text-gray-800">\u{1F4F0} NewsAPI Keys (Up to 10)</h3> <span class="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">Quota Pooling</span> </div> <p class="text-sm text-gray-600 mb-4">\nAdd up to 10 NewsAPI keys to pool quota limits. Get keys from <a href="https://newsapi.org/" target="_blank" class="text-blue-600 hover:underline font-medium">NewsAPI.org</a> </p> <div class="space-y-3"> ', ` </div> </div> <div id="save-status" class="hidden"> <div class="rounded-lg p-4"> <p id="status-message" class="text-sm font-medium"></p> </div> </div> <div class="flex space-x-4"> <button type="submit" id="save-btn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F4BE} Save Settings
</button> <button type="button" onclick="window.location.href='/admin'" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
Cancel
</button> </div> </form> <div class="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6"> <h3 class="font-semibold mb-3 text-lg">\u{1F680} Multi-Key Load Balancing Benefits</h3> <ul class="list-disc list-inside text-sm text-gray-700 space-y-2"> <li><strong>Automatic Failover</strong>: If one API key fails (503, quota), automatically switch to the next available key</li> <li><strong>10x Quota</strong>: Pool 10 API keys together for 10x more requests before hitting limits</li> <li><strong>Zero Downtime</strong>: When Google's servers are overloaded, rotate through keys to find working ones</li> <li><strong>Round-Robin Distribution</strong>: Requests are distributed evenly across all keys to prevent quota exhaustion</li> <li><strong>Gemini 2.5 Flash</strong>: Google's latest fast and intelligent model for AI-powered article generation</li> <li><strong>NewsAPI</strong>: Fetches latest news and information to make articles current and relevant</li> <li>At least 1 key is required for each service. Add more for better reliability and performance</li> <li>Keys are stored securely in your local database and encrypted</li> </ul> </div> </div> </div> <script>
    const form = document.getElementById('settings-form');
    const saveBtn = document.getElementById('save-btn');
    const statusContainer = document.getElementById('save-status');
    const statusMessage = document.getElementById('status-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const geminiKeys = [];
      const newsKeys = [];
      
      for (let i = 0; i < 10; i++) {
        const geminiInput = document.getElementById(\`gemini-key-\${i}\`);
        const newsInput = document.getElementById(\`news-key-\${i}\`);
        
        if (geminiInput && geminiInput.value.trim()) {
          geminiKeys.push(geminiInput.value.trim());
        }
        
        if (newsInput && newsInput.value.trim()) {
          newsKeys.push(newsInput.value.trim());
        }
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      try {
        const response = await fetch('/api/settings/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            geminiApiKeys: geminiKeys,
            newsApiKeys: newsKeys
          })
        });

        statusContainer.classList.remove('hidden');
        
        if (response.ok) {
          statusContainer.querySelector('div').className = 'bg-green-50 border border-green-200 rounded-lg p-4';
          statusMessage.className = 'text-sm font-medium text-green-800';
          statusMessage.textContent = '\u2705 Settings saved successfully!';
        } else {
          statusContainer.querySelector('div').className = 'bg-red-50 border border-red-200 rounded-lg p-4';
          statusMessage.className = 'text-sm font-medium text-red-800';
          statusMessage.textContent = '\u274C Failed to save settings. Please try again.';
        }
      } catch (error) {
        statusContainer.classList.remove('hidden');
        statusContainer.querySelector('div').className = 'bg-red-50 border border-red-200 rounded-lg p-4';
        statusMessage.className = 'text-sm font-medium text-red-800';
        statusMessage.textContent = '\u274C An error occurred. Please try again.';
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '\u{1F4BE} Save Settings';
      }
    });

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Settings | Admin</title><meta name="robots" content="noindex, nofollow">', '</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Settings</h1> </div> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">\nLogout\n</button> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold mb-6">API Keys Configuration</h2> <p class="text-gray-600 mb-8">Configure your API keys for the article generation system. These keys are stored securely in the database.</p> <form id="settings-form" class="space-y-8"> <div class="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50"> <div class="flex items-center justify-between mb-4"> <h3 class="text-lg font-semibold text-gray-800">\u{1F916} Gemini 2.5 Flash API Keys (Up to 10)</h3> <span class="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">Load Balancing Enabled</span> </div> <p class="text-sm text-gray-600 mb-4">\nAdd up to 10 API keys for automatic load balancing and failover. Get keys from <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-600 hover:underline font-medium">Google AI Studio</a> </p> <div class="space-y-3"> ', ' </div> </div> <div class="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50"> <div class="flex items-center justify-between mb-4"> <h3 class="text-lg font-semibold text-gray-800">\u{1F4F0} NewsAPI Keys (Up to 10)</h3> <span class="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">Quota Pooling</span> </div> <p class="text-sm text-gray-600 mb-4">\nAdd up to 10 NewsAPI keys to pool quota limits. Get keys from <a href="https://newsapi.org/" target="_blank" class="text-blue-600 hover:underline font-medium">NewsAPI.org</a> </p> <div class="space-y-3"> ', ` </div> </div> <div id="save-status" class="hidden"> <div class="rounded-lg p-4"> <p id="status-message" class="text-sm font-medium"></p> </div> </div> <div class="flex space-x-4"> <button type="submit" id="save-btn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F4BE} Save Settings
</button> <button type="button" onclick="window.location.href='/admin'" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
Cancel
</button> </div> </form> <div class="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6"> <h3 class="font-semibold mb-3 text-lg">\u{1F680} Multi-Key Load Balancing Benefits</h3> <ul class="list-disc list-inside text-sm text-gray-700 space-y-2"> <li><strong>Automatic Failover</strong>: If one API key fails (503, quota), automatically switch to the next available key</li> <li><strong>10x Quota</strong>: Pool 10 API keys together for 10x more requests before hitting limits</li> <li><strong>Zero Downtime</strong>: When Google's servers are overloaded, rotate through keys to find working ones</li> <li><strong>Round-Robin Distribution</strong>: Requests are distributed evenly across all keys to prevent quota exhaustion</li> <li><strong>Gemini 2.5 Flash</strong>: Google's latest fast and intelligent model for AI-powered article generation</li> <li><strong>NewsAPI</strong>: Fetches latest news and information to make articles current and relevant</li> <li>At least 1 key is required for each service. Add more for better reliability and performance</li> <li>Keys are stored securely in your local database and encrypted</li> </ul> </div> </div> </div> <script>
    const form = document.getElementById('settings-form');
    const saveBtn = document.getElementById('save-btn');
    const statusContainer = document.getElementById('save-status');
    const statusMessage = document.getElementById('status-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const geminiKeys = [];
      const newsKeys = [];
      
      for (let i = 0; i < 10; i++) {
        const geminiInput = document.getElementById(\\\`gemini-key-\\\${i}\\\`);
        const newsInput = document.getElementById(\\\`news-key-\\\${i}\\\`);
        
        if (geminiInput && geminiInput.value.trim()) {
          geminiKeys.push(geminiInput.value.trim());
        }
        
        if (newsInput && newsInput.value.trim()) {
          newsKeys.push(newsInput.value.trim());
        }
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      try {
        const response = await fetch('/api/settings/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            geminiApiKeys: geminiKeys,
            newsApiKeys: newsKeys
          })
        });

        statusContainer.classList.remove('hidden');
        
        if (response.ok) {
          statusContainer.querySelector('div').className = 'bg-green-50 border border-green-200 rounded-lg p-4';
          statusMessage.className = 'text-sm font-medium text-green-800';
          statusMessage.textContent = '\u2705 Settings saved successfully!';
        } else {
          statusContainer.querySelector('div').className = 'bg-red-50 border border-red-200 rounded-lg p-4';
          statusMessage.className = 'text-sm font-medium text-red-800';
          statusMessage.textContent = '\u274C Failed to save settings. Please try again.';
        }
      } catch (error) {
        statusContainer.classList.remove('hidden');
        statusContainer.querySelector('div').className = 'bg-red-50 border border-red-200 rounded-lg p-4';
        statusMessage.className = 'text-sm font-medium text-red-800';
        statusMessage.textContent = '\u274C An error occurred. Please try again.';
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '\u{1F4BE} Save Settings';
      }
    });

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }
  <\/script> </body> </html>`])), renderHead(), geminiKeys.map((key, index) => renderTemplate`<div class="flex items-center space-x-2"> <span class="text-sm font-medium text-gray-500 w-8">#${index + 1}</span> <input type="text"${addAttribute(`gemini-key-${index}`, "id")}${addAttribute(`gemini-key-${index}`, "name")}${addAttribute(key, "value")} class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"${addAttribute(index === 0 ? "Primary API key (required)" : `API key ${index + 1} (optional)`, "placeholder")}> </div>`), newsKeys.map((key, index) => renderTemplate`<div class="flex items-center space-x-2"> <span class="text-sm font-medium text-gray-500 w-8">#${index + 1}</span> <input type="text"${addAttribute(`news-key-${index}`, "id")}${addAttribute(`news-key-${index}`, "name")}${addAttribute(key, "value")} class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"${addAttribute(index === 0 ? "Primary API key (required)" : `API key ${index + 1} (optional)`, "placeholder")}> </div>`));
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/settings.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/settings.astro";
const $$url = "/admin/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
