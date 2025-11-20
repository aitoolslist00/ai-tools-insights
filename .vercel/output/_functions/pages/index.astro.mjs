import { f as createComponent, k as renderComponent, x as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_WYUkatmq.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from '../chunks/Footer_Bn3-WZQO.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { d as db } from '../chunks/db_DT4W4eUV.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

function AnimatedCounter({ end, duration = 2e3, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    let animationFrame;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);
  return /* @__PURE__ */ jsxs("div", { ref: elementRef, className: "tabular-nums", children: [
    prefix,
    count.toLocaleString(),
    suffix
  ] });
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setMessage("Thanks for subscribing! Check your email to confirm.");
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5e3);
    }, 1500);
  };
  return /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1 animate-gradient", children: /* @__PURE__ */ jsxs("div", { className: "relative bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" }),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-2xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 animate-float", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-bold mb-4 gradient-text", children: "Stay Updated" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 mb-8", children: "Get the latest AI tool reviews, comparisons, and tutorials delivered straight to your inbox." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col sm:flex-row gap-3 max-w-md mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Enter your email",
            disabled: status === "loading" || status === "success",
            className: "input w-full",
            required: true
          }
        ) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: status === "loading" || status === "success",
            className: "btn btn-primary whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed",
            children: status === "loading" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("svg", { className: "animate-spin w-5 h-5", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              "Subscribing..."
            ] }) : status === "success" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
              "Subscribed!"
            ] }) : "Subscribe"
          }
        )
      ] }),
      message && /* @__PURE__ */ jsx("div", { className: `mt-4 p-4 rounded-lg ${status === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"} animate-fade-in`, children: message }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-4", children: "No spam. Unsubscribe at any time." })
    ] })
  ] }) });
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const recentArticles = await db.prepare("SELECT * FROM articles WHERE status = ? ORDER BY published_at DESC LIMIT 8").all("published");
  const featuredTools = await db.prepare("SELECT * FROM ai_tools WHERE status = ? ORDER BY published_at DESC LIMIT 8").all("published");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "AI Tools Insights | Discover the Latest AI Tools, Reviews & Tutorials", "description": "Your comprehensive resource for AI tools reviews, comparisons, and tutorials. Stay updated with the latest AI technology insights.", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden section-padding bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10" data-astro-cid-j7pv25f6> <div class="absolute inset-0 bg-grid-pattern opacity-5" data-astro-cid-j7pv25f6></div> <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" data-parallax="0.3" data-astro-cid-j7pv25f6></div> <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style="animation-delay: 1s;" data-parallax="0.5" data-astro-cid-j7pv25f6></div> <div class="relative container-custom max-w-6xl mx-auto text-center" data-astro-cid-j7pv25f6> <div class="animate-fade-in" data-astro-cid-j7pv25f6> <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance" data-astro-cid-j7pv25f6>
Discover the Best <span class="gradient-text" data-astro-cid-j7pv25f6>AI Tools</span> </h1> <p class="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-balance" data-astro-cid-j7pv25f6>
Comprehensive reviews, comparisons, and tutorials to help you master the latest AI technology
</p> <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12" data-astro-cid-j7pv25f6> <a href="/ai-tools" class="btn btn-primary" data-astro-cid-j7pv25f6> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-j7pv25f6></path> </svg>
Explore AI Tools
</a> <a href="/blog" class="btn btn-outline" data-astro-cid-j7pv25f6> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-astro-cid-j7pv25f6></path> </svg>
Read Blog
</a> </div> <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-700" data-astro-cid-j7pv25f6> <div class="text-center group" data-astro-cid-j7pv25f6> <div class="text-3xl md:text-4xl font-bold gradient-text mb-1 group-hover:scale-110 transition-transform" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "AnimatedCounter", AnimatedCounter, { "client:visible": true, "end": 500, "suffix": "+", "client:component-hydration": "visible", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/AnimatedCounter", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> <div class="text-sm text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>AI Tools Reviewed</div> </div> <div class="text-center group" data-astro-cid-j7pv25f6> <div class="text-3xl md:text-4xl font-bold gradient-text mb-1 group-hover:scale-110 transition-transform" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "AnimatedCounter", AnimatedCounter, { "client:visible": true, "end": 1e3, "suffix": "+", "client:component-hydration": "visible", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/AnimatedCounter", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> <div class="text-sm text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>Articles Published</div> </div> <div class="text-center group" data-astro-cid-j7pv25f6> <div class="text-3xl md:text-4xl font-bold gradient-text mb-1 group-hover:scale-110 transition-transform" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "AnimatedCounter", AnimatedCounter, { "client:visible": true, "end": 50, "suffix": "K+", "client:component-hydration": "visible", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/AnimatedCounter", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> <div class="text-sm text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>Monthly Readers</div> </div> <div class="text-center group" data-astro-cid-j7pv25f6> <div class="text-3xl md:text-4xl font-bold gradient-text mb-1 group-hover:scale-110 transition-transform" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "AnimatedCounter", AnimatedCounter, { "client:visible": true, "end": 100, "suffix": "%", "client:component-hydration": "visible", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/AnimatedCounter", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> <div class="text-sm text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>Free Content</div> </div> </div> </div> </div> </section> <section class="section-padding container-custom" data-astro-cid-j7pv25f6> <div class="text-center mb-12 animate-fade-in" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4" data-astro-cid-j7pv25f6>Featured AI Tools</h2> <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-astro-cid-j7pv25f6>
Explore our hand-picked selection of the most powerful and innovative AI tools
</p> </div> ${featuredTools.length > 0 ? renderTemplate`<div class="bento-grid auto-rows-[200px]" data-astro-cid-j7pv25f6> ${featuredTools.map((tool, index) => {
    const spans = [
      "col-span-2 row-span-2",
      "col-span-2 md:col-span-1 row-span-1",
      "col-span-2 md:col-span-1 row-span-1",
      "col-span-2 md:col-span-2 row-span-1",
      "col-span-2 md:col-span-1 row-span-1",
      "col-span-2 md:col-span-1 row-span-2",
      "col-span-2 md:col-span-2 row-span-1",
      "col-span-2 md:col-span-1 row-span-1"
    ];
    const span = spans[index % spans.length];
    const isFeatured = index === 0 || index === 5;
    return renderTemplate`<a${addAttribute(`/ai-tools/${tool.slug}`, "href")}${addAttribute(`bento-item p-6 group relative overflow-hidden ${span} animate-scale-in`, "class")}${addAttribute(`animation-delay: ${index * 80}ms`, "style")} data-astro-cid-j7pv25f6> <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" data-astro-cid-j7pv25f6></div> <div class="relative h-full flex flex-col" data-astro-cid-j7pv25f6> <div class="flex items-start justify-between mb-4" data-astro-cid-j7pv25f6> ${tool.logo_url && renderTemplate`<div class="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300" data-astro-cid-j7pv25f6> <img${addAttribute(tool.logo_url, "src")}${addAttribute(tool.name, "alt")}${addAttribute(`${isFeatured ? "w-16 h-16" : "w-12 h-12"} object-contain`, "class")} data-astro-cid-j7pv25f6> </div>`} <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-j7pv25f6></path> </svg> </div> <h3${addAttribute(`${isFeatured ? "text-2xl" : "text-xl"} font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`, "class")} data-astro-cid-j7pv25f6> ${tool.name} </h3> <p${addAttribute(`text-gray-600 dark:text-gray-400 mb-auto ${isFeatured ? "line-clamp-3" : "line-clamp-2"}`, "class")} data-astro-cid-j7pv25f6> ${tool.description} </p> <div class="flex items-center gap-2 mt-4" data-astro-cid-j7pv25f6> ${tool.category && renderTemplate`<span class="badge badge-primary text-xs" data-astro-cid-j7pv25f6>${tool.category}</span>`} ${isFeatured && renderTemplate`<span class="badge text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700" data-astro-cid-j7pv25f6>
⭐ Featured
</span>`} </div> </div> </a>`;
  })} </div>` : renderTemplate`<div class="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl" data-astro-cid-j7pv25f6> <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" data-astro-cid-j7pv25f6></path> </svg> <p class="text-xl text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>No AI tools available yet. Check back soon!</p> </div>`} <div class="text-center mt-12" data-astro-cid-j7pv25f6> <a href="/ai-tools" class="btn btn-outline group magnetic-btn" data-astro-cid-j7pv25f6>
View All AI Tools
<svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-astro-cid-j7pv25f6></path> </svg> </a> </div> </section> <section class="section-padding bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900" data-astro-cid-j7pv25f6> <div class="container-custom" data-astro-cid-j7pv25f6> <div class="text-center mb-12 animate-fade-in" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4" data-astro-cid-j7pv25f6>Latest Articles</h2> <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-astro-cid-j7pv25f6>
Stay updated with insights, tutorials, and industry news from the AI world
</p> </div> ${recentArticles.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-astro-cid-j7pv25f6> ${recentArticles.map((article, index) => renderTemplate`<a${addAttribute(`/blog/${article.slug}`, "href")} class="card-hover overflow-hidden group animate-scale-in"${addAttribute(`animation-delay: ${index * 100}ms`, "style")} data-astro-cid-j7pv25f6> ${article.featured_image && renderTemplate`<div class="relative overflow-hidden aspect-video" data-astro-cid-j7pv25f6> <img${addAttribute(article.featured_image, "src")}${addAttribute(article.title, "alt")} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-astro-cid-j7pv25f6> <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-astro-cid-j7pv25f6></div> </div>`} <div class="p-6" data-astro-cid-j7pv25f6> <div class="flex items-center gap-2 mb-3" data-astro-cid-j7pv25f6> <span class="badge badge-primary text-xs" data-astro-cid-j7pv25f6>${article.category}</span> ${article.published_at && renderTemplate`<span class="text-xs text-gray-500 dark:text-gray-500" data-astro-cid-j7pv25f6> ${new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} </span>`} </div> <h3 class="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2" data-astro-cid-j7pv25f6>${article.title}</h3> <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3" data-astro-cid-j7pv25f6>${article.excerpt}</p> <span class="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center group-hover:gap-2 transition-all" data-astro-cid-j7pv25f6>
Read more
<svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-astro-cid-j7pv25f6></path> </svg> </span> </div> </a>`)} </div>` : renderTemplate`<div class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl" data-astro-cid-j7pv25f6> <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" data-astro-cid-j7pv25f6></path> </svg> <p class="text-xl text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>No articles available yet. Check back soon!</p> </div>`} <div class="text-center mt-12" data-astro-cid-j7pv25f6> <a href="/blog" class="btn btn-outline group" data-astro-cid-j7pv25f6>
View All Articles
<svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-astro-cid-j7pv25f6></path> </svg> </a> </div> </div> </section> <section class="section-padding container-custom" data-astro-cid-j7pv25f6> <div class="text-center mb-12 animate-fade-in" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4" data-astro-cid-j7pv25f6>Why Choose AI Tools Insights?</h2> <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-astro-cid-j7pv25f6>
Your trusted partner in navigating the AI tools landscape
</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-j7pv25f6> <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 animate-scale-in" data-astro-cid-j7pv25f6> <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300" data-astro-cid-j7pv25f6> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-j7pv25f6></path> </svg> </div> <h3 class="text-xl font-bold mb-3" data-astro-cid-j7pv25f6>In-Depth Reviews</h3> <p class="text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>
Comprehensive analysis of AI tools with real-world testing and expert insights
</p> </div> <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 animate-scale-in animation-delay-200" data-astro-cid-j7pv25f6> <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300" data-astro-cid-j7pv25f6> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" data-astro-cid-j7pv25f6></path> </svg> </div> <h3 class="text-xl font-bold mb-3" data-astro-cid-j7pv25f6>Fair Comparisons</h3> <p class="text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>
Side-by-side comparisons to help you choose the perfect tool for your needs
</p> </div> <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-900/10 border border-pink-200 dark:border-pink-800 animate-scale-in animation-delay-400" data-astro-cid-j7pv25f6> <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300" data-astro-cid-j7pv25f6> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-astro-cid-j7pv25f6></path> </svg> </div> <h3 class="text-xl font-bold mb-3" data-astro-cid-j7pv25f6>Practical Tutorials</h3> <p class="text-gray-600 dark:text-gray-400" data-astro-cid-j7pv25f6>
Step-by-step guides to master AI tools effectively and boost your productivity
</p> </div> </div> </section> <section class="section-padding container-custom" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "NewsletterSignup", NewsletterSignup, { "client:load": true, "client:component-hydration": "load", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/NewsletterSignup", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer", "data-astro-cid-j7pv25f6": true })}`, "header": async ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header", "data-astro-cid-j7pv25f6": true })}` })}  ${renderScript($$result, "F:/my work/programming/vercel/ai-tools-update/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/index.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
