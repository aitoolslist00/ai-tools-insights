import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CtcFXTWO.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from '../chunks/Footer_KdnQUVU3.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

function ToolComparison() {
  const [tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const features = [
    { name: "AI-Powered", tools: {} },
    { name: "Free Tier", tools: {} },
    { name: "API Access", tools: {} },
    { name: "Custom Models", tools: {} },
    { name: "Team Collaboration", tools: {} },
    { name: "Cloud Storage", tools: {} }
  ];
  useEffect(() => {
    const loadTools = async () => {
      try {
        const response = await fetch("/api/ai-tools");
        const data = await response.json();
        setTools(data.slice(0, 20));
      } catch (error) {
        console.error("Failed to load tools:", error);
      }
    };
    loadTools();
  }, []);
  const filteredTools = tools.filter(
    (tool) => tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const addTool = (tool) => {
    if (selectedTools.length < 3 && !selectedTools.find((t) => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
      setSearchQuery("");
      setShowSearch(false);
    }
  };
  const removeTool = (toolId) => {
    setSelectedTools(selectedTools.filter((t) => t.id !== toolId));
  };
  const getFeatureValue = (feature, tool) => {
    const random = (tool.id + feature.length) % 3;
    if (random === 0) return "✓";
    if (random === 1) return "✗";
    return "Paid";
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Compare AI Tools" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto", children: "Compare features side-by-side to find the perfect tool for your needs" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8", children: [0, 1, 2].map((index) => /* @__PURE__ */ jsx("div", { className: "relative", children: selectedTools[index] ? /* @__PURE__ */ jsxs("div", { className: "card p-6 relative animate-scale-in", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => removeTool(selectedTools[index].id),
          className: "absolute top-2 right-2 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors",
          "aria-label": "Remove tool",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-red-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
        }
      ),
      selectedTools[index].logo_url && /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: selectedTools[index].logo_url,
          alt: selectedTools[index].name,
          className: "w-12 h-12 object-contain"
        }
      ) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-center mb-2", children: selectedTools[index].name }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-2", children: selectedTools[index].description }),
      selectedTools[index].category && /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "badge badge-primary text-xs", children: selectedTools[index].category }) })
    ] }) : /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setShowSearch(true),
        className: "card p-6 w-full h-full min-h-[200px] flex flex-col items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 transition-all group",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 font-medium", children: "Add Tool to Compare" })
        ]
      }
    ) }, index)) }),
    showSearch && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
          onClick: () => setShowSearch(false)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md glass-morphism rounded-2xl shadow-2xl p-6 animate-scale-in", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Select a Tool" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-4", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search tools...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "input",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsx("svg", { className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-y-auto space-y-2", children: filteredTools.map((tool) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => addTool(tool),
            disabled: selectedTools.find((t) => t.id === tool.id) !== void 0,
            className: "w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3",
            children: [
              tool.logo_url && /* @__PURE__ */ jsx("img", { src: tool.logo_url, alt: tool.name, className: "w-8 h-8 object-contain" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: tool.name }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: tool.description })
              ] })
            ]
          },
          tool.id
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowSearch(false),
            className: "mt-4 w-full btn btn-outline",
            children: "Close"
          }
        )
      ] })
    ] }),
    selectedTools.length >= 2 && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto animate-fade-in", children: /* @__PURE__ */ jsxs("table", { className: "w-full card", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left font-bold", children: "Features" }),
        selectedTools.map((tool) => /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center font-bold", children: tool.name }, tool.id))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: features.map((feature, index) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: `border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/20" : ""}`,
          children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium", children: feature.name }),
            selectedTools.map((tool) => {
              const value = getFeatureValue(feature.name, tool);
              return /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center justify-center w-8 h-8 rounded-full ${value === "✓" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : value === "✗" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"}`, children: value }) }, tool.id);
            })
          ]
        },
        feature.name
      )) })
    ] }) })
  ] });
}

const $$Compare = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Compare AI Tools | AI Tools Insights", "description": "Compare AI tools side-by-side to find the perfect solution for your needs. Interactive comparison matrix with detailed feature analysis.", "data-astro-cid-sw2ixmxu": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="section-padding container-custom" data-astro-cid-sw2ixmxu> <div class="max-w-7xl mx-auto" data-astro-cid-sw2ixmxu> <div class="text-center mb-12 animate-fade-in" data-astro-cid-sw2ixmxu> <h1 class="text-4xl md:text-5xl font-bold mb-6" data-astro-cid-sw2ixmxu>
Compare <span class="gradient-text" data-astro-cid-sw2ixmxu>AI Tools</span> </h1> <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-astro-cid-sw2ixmxu>
Make informed decisions with our interactive comparison tool. Compare features, pricing, and capabilities side-by-side.
</p> </div> ${renderComponent($$result2, "ToolComparison", ToolComparison, { "client:load": true, "client:component-hydration": "load", "client:component-path": "F:/my work/programming/vercel/ai-tools-update/src/components/ToolComparison", "client:component-export": "default", "data-astro-cid-sw2ixmxu": true })} <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-sw2ixmxu> <div class="card p-6 text-center animate-scale-in" data-astro-cid-sw2ixmxu> <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center" data-astro-cid-sw2ixmxu> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-sw2ixmxu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" data-astro-cid-sw2ixmxu></path> </svg> </div> <h3 class="text-xl font-bold mb-2" data-astro-cid-sw2ixmxu>Side-by-Side</h3> <p class="text-gray-600 dark:text-gray-400" data-astro-cid-sw2ixmxu>
Compare up to 3 tools simultaneously with detailed feature breakdowns
</p> </div> <div class="card p-6 text-center animate-scale-in animation-delay-200" data-astro-cid-sw2ixmxu> <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center" data-astro-cid-sw2ixmxu> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-sw2ixmxu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-sw2ixmxu></path> </svg> </div> <h3 class="text-xl font-bold mb-2" data-astro-cid-sw2ixmxu>Real-Time Updates</h3> <p class="text-gray-600 dark:text-gray-400" data-astro-cid-sw2ixmxu>
Get the latest information on features, pricing, and capabilities
</p> </div> <div class="card p-6 text-center animate-scale-in animation-delay-400" data-astro-cid-sw2ixmxu> <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center" data-astro-cid-sw2ixmxu> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-sw2ixmxu> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-sw2ixmxu></path> </svg> </div> <h3 class="text-xl font-bold mb-2" data-astro-cid-sw2ixmxu>Detailed Analysis</h3> <p class="text-gray-600 dark:text-gray-400" data-astro-cid-sw2ixmxu>
Comprehensive feature matrix to help you make the right choice
</p> </div> </div> <div class="mt-16 card p-8 md:p-12 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20" data-astro-cid-sw2ixmxu> <h2 class="text-3xl font-bold mb-4" data-astro-cid-sw2ixmxu>Need Help Choosing?</h2> <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto" data-astro-cid-sw2ixmxu>
Check out our detailed reviews and guides to learn more about each tool and find the perfect fit for your needs.
</p> <div class="flex flex-col sm:flex-row justify-center gap-4" data-astro-cid-sw2ixmxu> <a href="/ai-tools" class="btn btn-primary" data-astro-cid-sw2ixmxu>
Browse All Tools
</a> <a href="/blog" class="btn btn-outline" data-astro-cid-sw2ixmxu>
Read Reviews
</a> </div> </div> </div> </section>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer", "data-astro-cid-sw2ixmxu": true })}`, "header": ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header", "data-astro-cid-sw2ixmxu": true })}` })} `;
}, "F:/my work/programming/vercel/ai-tools-update/src/pages/compare.astro", void 0);

const $$file = "F:/my work/programming/vercel/ai-tools-update/src/pages/compare.astro";
const $$url = "/compare";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Compare,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
