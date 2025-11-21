import { e as createAstro, f as createComponent, r as renderTemplate, k as renderComponent, w as renderSlot, l as renderHead, h as addAttribute, m as maybeRenderHead } from './astro/server_t80nOXy5.mjs';
/* empty css                         */
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import 'clsx';

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const inputRef = useRef(null);
  const staticItems = [
    { id: "1", title: "Home", url: "/", type: "page", icon: "🏠" },
    { id: "2", title: "AI Tools", url: "/ai-tools", type: "page", icon: "⚡" },
    { id: "3", title: "Blog", url: "/blog", type: "page", icon: "📝" },
    { id: "4", title: "About", url: "/about", type: "page", icon: "ℹ️" },
    { id: "5", title: "Contact", url: "/contact", type: "page", icon: "📧" }
  ];
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelected((s) => (s + 1) % filteredItems.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelected((s) => (s - 1 + filteredItems.length) % filteredItems.length);
        }
        if (e.key === "Enter" && filteredItems[selected]) {
          e.preventDefault();
          window.location.href = filteredItems[selected].url;
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, filteredItems, selected]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  useEffect(() => {
    const loadDynamicItems = async () => {
      try {
        const [toolsRes, articlesRes] = await Promise.all([
          fetch("/api/ai-tools"),
          fetch("/api/articles")
        ]);
        const tools = await toolsRes.json();
        const articles = await articlesRes.json();
        const toolItems = tools.map((tool) => ({
          id: `tool-${tool.id}`,
          title: tool.name,
          description: tool.description,
          url: `/ai-tools/${tool.slug}`,
          type: "tool",
          icon: "🔧"
        }));
        const articleItems = articles.map((article) => ({
          id: `article-${article.id}`,
          title: article.title,
          description: article.excerpt,
          url: `/blog/${article.slug}`,
          type: "article",
          icon: "📄"
        }));
        setItems([...staticItems, ...toolItems, ...articleItems]);
      } catch (error) {
        setItems(staticItems);
      }
    };
    if (isOpen) {
      loadDynamicItems();
    }
  }, [isOpen]);
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredItems(items.slice(0, 10));
    } else {
      const filtered = items.filter((item) => {
        const searchLower = search.toLowerCase();
        return item.title.toLowerCase().includes(searchLower) || item.description?.toLowerCase().includes(searchLower);
      }).slice(0, 10);
      setFilteredItems(filtered);
      setSelected(0);
    }
  }, [search, items]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 animate-fade-in", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
        onClick: () => setIsOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-2xl glass-morphism rounded-2xl shadow-2xl overflow-hidden animate-scale-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            placeholder: "Search pages, tools, and articles...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-gray-100 placeholder-gray-500"
          }
        ),
        /* @__PURE__ */ jsx("kbd", { className: "hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded", children: "ESC" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-h-[60vh] overflow-y-auto", children: filteredItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "px-4 py-8 text-center text-gray-500", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 mx-auto mb-3 opacity-50", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        /* @__PURE__ */ jsx("p", { children: "No results found" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "py-2", children: filteredItems.map((item, index) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.url,
          className: `flex items-start gap-3 px-4 py-3 transition-colors ${index === selected ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`,
          onMouseEnter: () => setSelected(index),
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl mt-0.5", children: item.icon }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100 truncate", children: item.title }),
              item.description && /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5", children: item.description })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize shrink-0", children: item.type })
          ]
        },
        item.id
      )) }) }),
      /* @__PURE__ */ jsx("div", { className: "px-4 py-2 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded", children: "↑" }),
          /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded", children: "↓" }),
          /* @__PURE__ */ jsx("span", { children: "Navigate" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded", children: "↵" }),
          /* @__PURE__ */ jsx("span", { children: "Select" })
        ] })
      ] }) })
    ] })
  ] });
}

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("https://www.aitoolsinsights.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = "AI Tools Insights - Discover and learn about the latest AI tools, with comprehensive reviews, comparisons, and tutorials.",
    keywords = ["AI tools", "artificial intelligence", "AI reviews", "AI comparisons", "AI tutorials"],
    ogImage = "/og-image.jpg",
    canonical
  } = Astro2.props;
  const siteUrl = Astro2.site || "https://www.aitoolsinsights.com";
  const currentUrl = new URL(Astro2.url.pathname, siteUrl);
  const canonicalUrl = canonical || currentUrl.href;
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', "><title>", '</title><meta name="description"', '><meta name="keywords"', '><link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', `><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="robots" content="index, follow"><meta name="googlebot" content="index, follow"><link rel="sitemap" href="/sitemap-index.xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><script>
    const theme = (() => {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    })();
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    window.localStorage.setItem('theme', theme);
  <\/script>`, '</head> <body class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"> <div id="scroll-progress" class="scroll-progress" style="width: 0%"></div> <div class="flex flex-col min-h-screen"> ', ' <main class="flex-grow"> ', " </main> ", " </div> ", ` <button id="scroll-to-top" class="fixed bottom-6 right-6 p-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-full shadow-sm opacity-0 invisible transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 z-40" aria-label="Scroll to top"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path> </svg> </button> <script>
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const scrollProgress = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      
      if (scrollProgress) {
        scrollProgress.style.width = scrolled + '%';
      }
      
      if (window.scrollY > 300) {
        scrollToTopBtn?.classList.remove('opacity-0', 'invisible');
        scrollToTopBtn?.classList.add('opacity-100', 'visible');
      } else {
        scrollToTopBtn?.classList.add('opacity-0', 'invisible');
        scrollToTopBtn?.classList.remove('opacity-100', 'visible');
      }
    });
    
    scrollToTopBtn?.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  <\/script> </body> </html>`])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(keywords.join(", "), "content"), addAttribute(canonicalUrl, "href"), addAttribute(currentUrl.href, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(ogImage, siteUrl).href, "content"), addAttribute(currentUrl.href, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(ogImage, siteUrl).href, "content"), renderHead(), renderSlot($$result, $$slots["header"]), renderSlot($$result, $$slots["default"]), renderSlot($$result, $$slots["footer"]), renderComponent($$result, "CommandPalette", CommandPalette, { "client:load": true, "client:component-hydration": "load", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/CommandPalette", "client:component-export": "default" }));
}, "F:/my work/programming/vercel/ai-tools-update/src/layouts/BaseLayout.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.aitoolsinsights.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Header;
  const currentPath = Astro2.url.pathname;
  const navItems = [
    { name: "Home", href: "/" },
    { name: "AI Tools", href: "/ai-tools" },
    { name: "Compare", href: "/compare" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];
  return renderTemplate(_a || (_a = __template(["", '<header id="main-header" class="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm transition-all border-b border-gray-200 dark:border-gray-800"> <nav class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"> <div class="flex items-center justify-between h-16"> <a href="/" class="flex items-center space-x-2 group"> <svg class="w-6 h-6 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path> </svg> <span class="text-lg font-semibold text-gray-900 dark:text-white hidden sm:inline">AI Tools Insights</span> <span class="text-lg font-semibold text-gray-900 dark:text-white sm:hidden">ATI</span> </a> <ul class="hidden lg:flex items-center space-x-0.5"> ', ' </ul> <div class="flex items-center space-x-1"> <button id="theme-toggle" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors focus:outline-none" aria-label="Toggle theme"> <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path> </svg> <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path> </svg> </button> <button id="mobile-menu-button" class="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors focus:outline-none" aria-label="Toggle menu"> <svg id="hamburger-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> <svg id="close-icon" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> </div> <div id="mobile-menu" class="hidden lg:hidden"> <ul class="py-3 space-y-1"> ', " </ul> </div> </nav> </header> <script>\n  function initHeader() {\n    const menuButton = document.getElementById('mobile-menu-button');\n    const mobileMenu = document.getElementById('mobile-menu');\n    const hamburgerIcon = document.getElementById('hamburger-icon');\n    const closeIcon = document.getElementById('close-icon');\n    const header = document.getElementById('main-header');\n    \n    if (menuButton && mobileMenu && hamburgerIcon && closeIcon) {\n      menuButton.addEventListener('click', () => {\n        const isHidden = mobileMenu.classList.contains('hidden');\n        \n        if (isHidden) {\n          mobileMenu.classList.remove('hidden');\n          hamburgerIcon.classList.add('hidden');\n          closeIcon.classList.remove('hidden');\n        } else {\n          mobileMenu.classList.add('hidden');\n          hamburgerIcon.classList.remove('hidden');\n          closeIcon.classList.add('hidden');\n        }\n      });\n    }\n    \n\n    \n    const themeToggleBtn = document.getElementById('theme-toggle');\n    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');\n    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');\n    \n    function updateThemeIcons() {\n      const isDark = document.documentElement.classList.contains('dark');\n      if (themeToggleLightIcon && themeToggleDarkIcon) {\n        if (isDark) {\n          themeToggleLightIcon.classList.remove('hidden');\n          themeToggleDarkIcon.classList.add('hidden');\n        } else {\n          themeToggleDarkIcon.classList.remove('hidden');\n          themeToggleLightIcon.classList.add('hidden');\n        }\n      }\n    }\n    \n    updateThemeIcons();\n    \n    if (themeToggleBtn) {\n      themeToggleBtn.addEventListener('click', function(e) {\n        e.preventDefault();\n        e.stopPropagation();\n        \n        const html = document.documentElement;\n        const isDark = html.classList.contains('dark');\n        \n        if (isDark) {\n          html.classList.remove('dark');\n          localStorage.setItem('theme', 'light');\n        } else {\n          html.classList.add('dark');\n          localStorage.setItem('theme', 'dark');\n        }\n        \n        updateThemeIcons();\n      });\n    }\n  }\n  \n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', initHeader);\n  } else {\n    initHeader();\n  }\n<\/script>"])), maybeRenderHead(), navItems.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")}${addAttribute(`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPath === item.href ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-950" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"}`, "class")}> ${item.name} </a> </li>`), navItems.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")}${addAttribute(`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPath === item.href ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-950" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"}`, "class")}> ${item.name} </a> </li>`));
}, "F:/my work/programming/vercel/ai-tools-update/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const footerLinks = {
    "Company": [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" }
    ],
    "Legal": [
      { name: "Terms and Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Disclaimer", href: "/disclaimer" }
    ],
    "Explore": [
      { name: "AI Tools", href: "/ai-tools" },
      { name: "Blog", href: "/blog" }
    ]
  };
  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
    },
    {
      name: "GitHub",
      href: "#",
      icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto"> <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> <div class="sm:col-span-2 lg:col-span-1"> <div class="flex items-center space-x-2 mb-3"> <svg class="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path> </svg> <h3 class="text-base font-semibold text-gray-900 dark:text-white">
AI Tools Insights
</h3> </div> <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
Discover and learn about the latest AI tools with comprehensive reviews, comparisons, and tutorials.
</p> <div class="flex space-x-2"> ${socialLinks.map((social) => renderTemplate`<a${addAttribute(social.href, "href")} class="p-2 rounded-md border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"${addAttribute(social.name, "aria-label")}> <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24"> <path${addAttribute(social.icon, "d")}></path> </svg> </a>`)} </div> </div> ${Object.entries(footerLinks).map(([category, links]) => renderTemplate`<div> <h4 class="font-medium text-sm text-gray-900 dark:text-white mb-3">${category}</h4> <ul class="space-y-2"> ${links.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"> ${link.name} </a> </li>`)} </ul> </div>`)} </div> <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800"> <div class="flex flex-col md:flex-row justify-between items-center gap-4"> <p class="text-sm text-gray-600 dark:text-gray-400">
&copy; ${currentYear} AI Tools Insights. All rights reserved.
</p> <div class="flex items-center gap-4"> <a href="/sitemap-index.xml" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
Sitemap
</a> <span class="text-gray-300 dark:text-gray-700">|</span> <a href="/robots.txt" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
Robots.txt
</a> </div> </div> </div> </div> </footer>`;
}, "F:/my work/programming/vercel/ai-tools-update/src/components/Footer.astro", void 0);

export { $$BaseLayout as $, $$Header as a, $$Footer as b };
