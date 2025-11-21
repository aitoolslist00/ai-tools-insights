import { e as createAstro, f as createComponent, r as renderTemplate, l as renderHead } from '../../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                    */
import { r as requireAuth } from '../../chunks/auth_Cnb58Uj3.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const prerender = false;
const $$MigrateData = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MigrateData;
  let user;
  try {
    user = await requireAuth(Astro2.request);
  } catch {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Data Migration | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Data Migration</h1> </div> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold mb-4">Migrate SQLite Data to Supabase</h2> <p class="text-gray-600 mb-6">
This will copy all your existing articles, AI tools, users, and settings from the local SQLite database to Supabase. 
        Items that already exist will be skipped.
</p> <div id="status-container" class="mb-6"></div> <div id="log-container" class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto hidden"> <h3 class="font-semibold mb-2">Migration Log:</h3> <div id="log-output" class="text-sm font-mono"></div> </div> <button id="migrate-btn" onclick="startMigration()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F680} Start Migration
</button> </div> </div> <script>
    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }

    async function startMigration() {
      const btn = document.getElementById('migrate-btn');
      const statusContainer = document.getElementById('status-container');
      const logContainer = document.getElementById('log-container');
      const logOutput = document.getElementById('log-output');

      btn.disabled = true;
      btn.textContent = '\u23F3 Migrating...';
      logContainer.classList.remove('hidden');
      logOutput.innerHTML = '';

      function addLog(message, type = 'info') {
        const div = document.createElement('div');
        div.className = type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-gray-700';
        div.textContent = message;
        logOutput.appendChild(div);
        logContainer.scrollTop = logContainer.scrollHeight;
      }

      try {
        statusContainer.innerHTML = \`
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span class="text-blue-800 font-medium">Migration in progress...</span>
            </div>
          </div>
        \`;

        const response = await fetch('/api/admin/migrate-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (response.ok) {
          statusContainer.innerHTML = \`
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 class="text-green-800 font-semibold mb-2">\u2705 Migration Completed Successfully!</h3>
              <ul class="text-sm text-green-700 space-y-1">
                <li>Articles: \${result.articles.migrated} migrated, \${result.articles.skipped} skipped</li>
                <li>AI Tools: \${result.tools.migrated} migrated, \${result.tools.skipped} skipped</li>
                <li>Users: \${result.users.migrated} migrated, \${result.users.skipped} skipped</li>
                <li>Settings: \${result.settings.migrated} migrated, \${result.settings.updated} updated</li>
              </ul>
            </div>
          \`;

          if (result.logs) {
            result.logs.forEach(log => addLog(log, log.includes('\u2705') ? 'success' : log.includes('\u274C') ? 'error' : 'info'));
          }

          setTimeout(() => {
            window.location.href = '/admin/articles';
          }, 3000);
        } else {
          statusContainer.innerHTML = \`
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-800 font-semibold">\u274C Migration Failed</p>
              <p class="text-sm text-red-700">\${result.error || 'Unknown error'}</p>
            </div>
          \`;
          addLog(\`Error: \${result.error}\`, 'error');
        }
      } catch (error) {
        statusContainer.innerHTML = \`
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 font-semibold">\u274C Migration Failed</p>
            <p class="text-sm text-red-700">\${error.message}</p>
          </div>
        \`;
        addLog(\`Error: \${error.message}\`, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '\u{1F504} Run Migration Again';
      }
    }
  <\/script> </body> </html>`], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Data Migration | Admin</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gray-100"> <nav class="bg-white shadow-lg"> <div class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-4"> <a href="/admin" class="text-2xl font-bold text-blue-600">Dashboard</a> <span class="text-gray-400">/</span> <h1 class="text-xl font-semibold">Data Migration</h1> </div> <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
Logout
</button> </div> </div> </nav> <div class="container mx-auto px-4 py-8 max-w-4xl"> <div class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold mb-4">Migrate SQLite Data to Supabase</h2> <p class="text-gray-600 mb-6">
This will copy all your existing articles, AI tools, users, and settings from the local SQLite database to Supabase. 
        Items that already exist will be skipped.
</p> <div id="status-container" class="mb-6"></div> <div id="log-container" class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto hidden"> <h3 class="font-semibold mb-2">Migration Log:</h3> <div id="log-output" class="text-sm font-mono"></div> </div> <button id="migrate-btn" onclick="startMigration()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
\u{1F680} Start Migration
</button> </div> </div> <script>
    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }

    async function startMigration() {
      const btn = document.getElementById('migrate-btn');
      const statusContainer = document.getElementById('status-container');
      const logContainer = document.getElementById('log-container');
      const logOutput = document.getElementById('log-output');

      btn.disabled = true;
      btn.textContent = '\u23F3 Migrating...';
      logContainer.classList.remove('hidden');
      logOutput.innerHTML = '';

      function addLog(message, type = 'info') {
        const div = document.createElement('div');
        div.className = type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-gray-700';
        div.textContent = message;
        logOutput.appendChild(div);
        logContainer.scrollTop = logContainer.scrollHeight;
      }

      try {
        statusContainer.innerHTML = \\\`
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span class="text-blue-800 font-medium">Migration in progress...</span>
            </div>
          </div>
        \\\`;

        const response = await fetch('/api/admin/migrate-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (response.ok) {
          statusContainer.innerHTML = \\\`
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 class="text-green-800 font-semibold mb-2">\u2705 Migration Completed Successfully!</h3>
              <ul class="text-sm text-green-700 space-y-1">
                <li>Articles: \\\${result.articles.migrated} migrated, \\\${result.articles.skipped} skipped</li>
                <li>AI Tools: \\\${result.tools.migrated} migrated, \\\${result.tools.skipped} skipped</li>
                <li>Users: \\\${result.users.migrated} migrated, \\\${result.users.skipped} skipped</li>
                <li>Settings: \\\${result.settings.migrated} migrated, \\\${result.settings.updated} updated</li>
              </ul>
            </div>
          \\\`;

          if (result.logs) {
            result.logs.forEach(log => addLog(log, log.includes('\u2705') ? 'success' : log.includes('\u274C') ? 'error' : 'info'));
          }

          setTimeout(() => {
            window.location.href = '/admin/articles';
          }, 3000);
        } else {
          statusContainer.innerHTML = \\\`
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-800 font-semibold">\u274C Migration Failed</p>
              <p class="text-sm text-red-700">\\\${result.error || 'Unknown error'}</p>
            </div>
          \\\`;
          addLog(\\\`Error: \\\${result.error}\\\`, 'error');
        }
      } catch (error) {
        statusContainer.innerHTML = \\\`
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 font-semibold">\u274C Migration Failed</p>
            <p class="text-sm text-red-700">\\\${error.message}</p>
          </div>
        \\\`;
        addLog(\\\`Error: \\\${error.message}\\\`, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '\u{1F504} Run Migration Again';
      }
    }
  <\/script> </body> </html>`])), renderHead());
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/migrate-data.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/migrate-data.astro";
const $$url = "/admin/migrate-data";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MigrateData,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
