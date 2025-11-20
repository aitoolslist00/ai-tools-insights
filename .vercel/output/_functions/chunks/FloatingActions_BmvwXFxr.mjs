import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';

function ArticleReader() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const articleRef = useRef(null);
  useEffect(() => {
    const article = document.querySelector("article") || document.querySelector(".article-content");
    articleRef.current = article;
    if (!article) return;
    const headingElements = article.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const headingsData = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1])
      };
    });
    setHeadings(headingsData);
    const wordCount = article.textContent?.trim().split(/\s+/).length || 0;
    const minutes = Math.ceil(wordCount / 200);
    setReadingTime(minutes);
    const observerOptions = {
      rootMargin: "-80px 0px -80% 0px",
      threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);
    headingElements.forEach((heading) => {
      observer.observe(heading);
    });
    const handleScroll = () => {
      if (!article) return;
      article.getBoundingClientRect().top;
      const articleHeight = article.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrolled = window.scrollY - (article.offsetTop - windowHeight);
      const progress = Math.min(Math.max(scrolled / (articleHeight - windowHeight) * 100, 0), 100);
      setReadingProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
      setShowToc(false);
    }
  };
  if (headings.length === 0) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-56", children: /* @__PURE__ */ jsxs("div", { className: "glass-morphism rounded-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300", children: "Table of Contents" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
          readingTime,
          " min read"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-1.5 rounded-full transition-all duration-300",
            style: { width: `${readingProgress}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
          Math.round(readingProgress),
          "% completed"
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: headings.map((heading) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => scrollToHeading(heading.id),
          className: `block w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${activeId === heading.id ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`,
          style: { paddingLeft: `${(heading.level - 1) * 12 + 12}px` },
          children: heading.text
        },
        heading.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setShowToc(!showToc),
        className: "lg:hidden fixed bottom-24 left-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50 z-40",
        "aria-label": "Toggle table of contents",
        children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h7" }) })
      }
    ),
    showToc && /* @__PURE__ */ jsxs("div", { className: "lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 animate-fade-in", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
          onClick: () => setShowToc(false)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md glass-morphism rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Table of Contents" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowToc(false),
              className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
              children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2", children: [
            /* @__PURE__ */ jsx("span", { children: "Reading Progress" }),
            /* @__PURE__ */ jsxs("span", { children: [
              readingTime,
              " min read"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300",
              style: { width: `${readingProgress}%` }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1 text-center", children: [
            Math.round(readingProgress),
            "% completed"
          ] })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: headings.map((heading) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollToHeading(heading.id),
            className: `block w-full text-left px-3 py-2 rounded-lg transition-all ${activeId === heading.id ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`,
            style: { paddingLeft: `${(heading.level - 1) * 12 + 12}px` },
            children: heading.text
          },
          heading.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-16 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-[45]", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-150",
        style: { width: `${readingProgress}%` }
      }
    ) })
  ] });
}

function FloatingActions({ url, title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  useEffect(() => {
    const currentUrl = url || window.location.href;
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarked(bookmarks.includes(currentUrl));
  }, [url]);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || (typeof document !== "undefined" ? document.title : "");
  const handleShare = async (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`
    };
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
    setIsOpen(false);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (bookmarked) {
      const filtered = bookmarks.filter((b) => b !== shareUrl);
      localStorage.setItem("bookmarks", JSON.stringify(filtered));
      setBookmarked(false);
    } else {
      bookmarks.push(shareUrl);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setBookmarked(true);
    }
  };
  const handlePrint = () => {
    window.print();
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-8 left-8 z-40", children: [
    /* @__PURE__ */ jsxs("div", { className: `flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleBookmark,
          className: "p-3 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700 group",
          title: bookmarked ? "Remove bookmark" : "Bookmark",
          children: /* @__PURE__ */ jsx("svg", { className: `w-5 h-5 transition-colors ${bookmarked ? "fill-purple-600 dark:fill-purple-400" : "fill-none group-hover:fill-purple-600 dark:group-hover:fill-purple-400"}`, stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleShare("twitter"),
          className: "p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700",
          title: "Share on Twitter",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleShare("facebook"),
          className: "p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700",
          title: "Share on Facebook",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleShare("linkedin"),
          className: "p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700",
          title: "Share on LinkedIn",
          children: /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" }),
            /* @__PURE__ */ jsx("circle", { cx: "4", cy: "4", r: "2" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCopy,
          className: "p-3 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700",
          title: copied ? "Copied!" : "Copy link",
          children: copied ? /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-green-600 dark:text-green-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) : /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handlePrint,
          className: "p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700",
          title: "Print",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: `p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${isOpen ? "rotate-45" : ""}`,
        "aria-label": "Share options",
        children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" }) })
      }
    )
  ] });
}

export { ArticleReader as A, FloatingActions as F };
