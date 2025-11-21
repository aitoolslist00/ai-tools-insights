import { f as createComponent, r as renderTemplate, l as renderHead } from '../../chunks/astro/server_t80nOXy5.mjs';
import 'clsx';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Login | AI Tools Insights</title><meta name="robots" content="noindex, nofollow">', `</head> <body class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4"> <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md"> <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Admin Login</h1> <form id="login-form" class="space-y-6"> <div> <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label> <input type="text" id="username" name="username" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> </div> <div> <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label> <input type="password" id="password" name="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> </div> <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div> <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
Login
</button> </form> </div> <script>
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMessage.classList.add('hidden');

      const formData = new FormData(form);
      const username = formData.get('username');
      const password = formData.get('password');

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          window.location.href = '/admin';
        } else {
          errorMessage.textContent = data.error || 'Login failed';
          errorMessage.classList.remove('hidden');
        }
      } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.classList.remove('hidden');
      }
    });
  <\/script> </body> </html>`])), renderHead());
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/login.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
