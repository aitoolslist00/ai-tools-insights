import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from '../chunks/Footer_KdnQUVU3.mjs';
/* empty css                               */
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  const popularLinks = [
    { name: "Home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "AI Tools", href: "/ai-tools", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { name: "Blog", href: "/blog", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { name: "Compare Tools", href: "/compare", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "404 - Page Not Found | AI Tools Insights", "description": "The page you're looking for doesn't exist. Explore our AI tools, articles, and resources instead.", "data-astro-cid-vmnk7vfc": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="min-h-[80vh] flex items-center justify-center section-padding container-custom" data-astro-cid-vmnk7vfc> <div class="max-w-4xl mx-auto text-center" data-astro-cid-vmnk7vfc> <div class="relative mb-12 animate-fade-in" data-astro-cid-vmnk7vfc> <div class="absolute inset-0 flex items-center justify-center" data-astro-cid-vmnk7vfc> <div class="w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" data-astro-cid-vmnk7vfc></div> </div> <div class="relative" data-astro-cid-vmnk7vfc> <h1 class="text-9xl md:text-[12rem] font-bold gradient-text mb-4 leading-none animate-float" data-astro-cid-vmnk7vfc>
404
</h1> <div class="flex items-center justify-center gap-4 mb-6" data-astro-cid-vmnk7vfc> <div class="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" data-astro-cid-vmnk7vfc></div> <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-vmnk7vfc> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-vmnk7vfc></path> </svg> <div class="h-1 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" data-astro-cid-vmnk7vfc></div> </div> </div> </div> <div class="mb-12 animate-scale-in" data-astro-cid-vmnk7vfc> <h2 class="text-3xl md:text-4xl font-bold mb-4" data-astro-cid-vmnk7vfc>
Oops! Page Not Found
</h2> <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-astro-cid-vmnk7vfc>
The page you're looking for seems to have wandered off into the digital void. 
          But don't worry, we have plenty of amazing AI tools and content waiting for you!
</p> </div> <div class="mb-12" data-astro-cid-vmnk7vfc> <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-sm text-blue-600 dark:text-blue-400 mb-8" data-astro-cid-vmnk7vfc> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-vmnk7vfc> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-vmnk7vfc></path> </svg> <span data-astro-cid-vmnk7vfc>Try searching with <kbd class="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs" data-astro-cid-vmnk7vfc>⌘K</kbd></span> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto" data-astro-cid-vmnk7vfc> ${popularLinks.map((link, index) => renderTemplate`<a${addAttribute(link.href, "href")} class="card-hover p-6 group text-center animate-scale-in"${addAttribute(`animation-delay: ${index * 100}ms`, "style")} data-astro-cid-vmnk7vfc> <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" data-astro-cid-vmnk7vfc> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-vmnk7vfc> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(link.icon, "d")} data-astro-cid-vmnk7vfc></path> </svg> </div> <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" data-astro-cid-vmnk7vfc> ${link.name} </h3> </a>`)} </div> </div> <div class="flex flex-col sm:flex-row justify-center gap-4" data-astro-cid-vmnk7vfc> <a href="/" class="btn btn-primary group" data-astro-cid-vmnk7vfc> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-vmnk7vfc> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-vmnk7vfc></path> </svg>
Go Home
</a> <button onclick="history.back()" class="btn btn-outline group" data-astro-cid-vmnk7vfc> <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-vmnk7vfc> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-astro-cid-vmnk7vfc></path> </svg>
Go Back
</button> </div> <div class="mt-16 p-8 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 rounded-2xl border border-gray-200 dark:border-gray-700" data-astro-cid-vmnk7vfc> <h3 class="text-xl font-bold mb-3" data-astro-cid-vmnk7vfc>Need Help?</h3> <p class="text-gray-600 dark:text-gray-400 mb-4" data-astro-cid-vmnk7vfc>
If you believe this is an error or you need assistance finding something specific, please don't hesitate to reach out.
</p> <a href="/contact" class="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1 group" data-astro-cid-vmnk7vfc>
Contact Support
<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-vmnk7vfc> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-astro-cid-vmnk7vfc></path> </svg> </a> </div> </div> </section>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer", "data-astro-cid-vmnk7vfc": true })}`, "header": ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header", "data-astro-cid-vmnk7vfc": true })}` })} `;
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/404.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
