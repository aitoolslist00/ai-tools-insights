import { r as requireAuth } from '../../../chunks/auth_C7lEWL5y.mjs';
import '../../../chunks/supabase_Dxn2jk3G.mjs';
import { g as getSetting } from '../../../chunks/db_CJGLAgIX.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import * as fs from 'node:fs';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
export { renderers } from '../../../renderers.mjs';

async function generateFluxImage(prompt, config = {}) {
  const {
    width = 1024,
    height = 768,
    seed,
    nologo = true,
    enhance = true
  } = config;
  try {
    console.log("🎨 Starting Pollinations.AI image generation...");
    console.log("Prompt:", prompt.substring(0, 100) + "...");
    const encodedPrompt = encodeURIComponent(prompt);
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      nologo: nologo.toString(),
      enhance: enhance.toString(),
      ...seed !== void 0 && { seed: seed.toString() }
    });
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
    console.log("📡 Fetching image from Pollinations.AI...");
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error("❌ Failed to fetch image:", response.statusText);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const filename = `pollinations-${timestamp}-${randomSuffix}.png`;
    const imagesDir = path.join(process.cwd(), "public", "images", "articles");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    const imagePath = path.join(imagesDir, filename);
    fs.writeFileSync(imagePath, buffer);
    console.log("✅ Image saved successfully:", imagePath);
    return {
      path: imagePath,
      url: `/images/articles/${filename}`
    };
  } catch (error) {
    console.error("❌ Image generation error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}
function createImagePrompt(articleTitle, position) {
  if (position === "hero") {
    const heroPrompts = [
      `Create a professional, high-quality featured image for an article titled "${articleTitle}". 
Style: modern, clean, tech-focused design with vibrant colors.
Include: abstract geometric shapes, gradient backgrounds, technology-themed elements.
Requirements: professional, eye-catching, suitable for a tech blog header, 4K quality, HDR.`,
      `Design a stunning featured image for a blog post about "${articleTitle}".
Style: sleek, contemporary, minimalist with bold typography and dynamic composition.
Elements: futuristic tech imagery, digital patterns, AI-themed visuals.
Quality: high resolution, professional photography style, dramatic lighting.`,
      `Generate a captivating hero image for an article on "${articleTitle}".
Style: professional tech publication aesthetic, vibrant and modern.
Include: innovative design elements, abstract tech visuals, clean composition.
Requirements: magazine-quality, 4K resolution, suitable for professional blog.`
    ];
    const randomIndex = Math.floor(Math.random() * heroPrompts.length);
    return heroPrompts[randomIndex];
  } else {
    const middlePrompts = [
      `Create a supporting illustration for an article about "${articleTitle}".
Style: informative, visually engaging, complementary to content.
Include: relevant icons, diagrams, or concept visualization.
Requirements: clear, professional, contextual to the topic.`,
      `Design an inline content image for "${articleTitle}".
Style: clean, modern, informative visualization.
Elements: schematic representations, workflow diagrams, or conceptual imagery.
Quality: professional, blog-friendly, informative.`,
      `Generate a mid-article illustration for "${articleTitle}".
Style: supporting visual content, professional design.
Include: concept visualization, process illustration, or thematic imagery.
Requirements: complementary to article content, visually appealing.`
    ];
    const randomIndex = Math.floor(Math.random() * middlePrompts.length);
    return middlePrompts[randomIndex];
  }
}

async function analyzeSERP(keyword) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=10&hl=en`;
    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Referer": "https://www.google.com/",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1"
      },
      timeout: 1e4,
      maxRedirects: 5
    });
    const $ = cheerio.load(response.data);
    const topResults = [];
    $("div.g").slice(0, 10).each((i, element) => {
      const title = $(element).find("h3").text();
      const url = $(element).find("a").attr("href") || "";
      const snippet = $(element).find("div.VwiC3b").text() || $(element).find("span.aCOpRe").text();
      if (title && url) {
        topResults.push({ title, url, snippet });
      }
    });
    const peopleAlsoAsk = [];
    $("div.related-question-pair").each((i, element) => {
      const question = $(element).find("span").first().text();
      if (question) {
        peopleAlsoAsk.push(question);
      }
    });
    const relatedSearches = [];
    $("div.s75CSd").each((i, element) => {
      const text = $(element).text();
      if (text) {
        relatedSearches.push(text);
      }
    });
    const competitorTopics = extractTopicsFromResults(topResults);
    const commonHeadings = extractCommonHeadings(topResults);
    return {
      topResults,
      peopleAlsoAsk,
      relatedSearches,
      averageWordCount: 2500,
      commonHeadings,
      competitorTopics
    };
  } catch (error) {
    console.warn("SERP analysis failed, using fallback data:", error);
    return getFallbackSERPData(keyword);
  }
}
function getFallbackSERPData(keyword) {
  keyword.toLowerCase();
  const commonPAA = [
    `What is ${keyword}?`,
    `How does ${keyword} work?`,
    `What are the benefits of ${keyword}?`,
    `Is ${keyword} worth it?`,
    `How to use ${keyword} effectively?`,
    `What are the best practices for ${keyword}?`,
    `What are the common mistakes with ${keyword}?`,
    `How much does ${keyword} cost?`,
    `What are alternatives to ${keyword}?`,
    `Who should use ${keyword}?`
  ];
  const relatedTerms = [
    `${keyword} tutorial`,
    `${keyword} guide`,
    `${keyword} review`,
    `${keyword} comparison`,
    `best ${keyword}`,
    `${keyword} tips`,
    `${keyword} features`,
    `${keyword} pricing`,
    `${keyword} alternatives`,
    `${keyword} vs`,
    `how to ${keyword}`,
    `${keyword} benefits`
  ];
  return {
    topResults: [],
    peopleAlsoAsk: commonPAA,
    relatedSearches: relatedTerms,
    averageWordCount: 3e3,
    commonHeadings: ["introduction", "overview", "benefits", "features", "how to", "comparison", "pricing", "faq", "conclusion"],
    competitorTopics: []
  };
}
function extractTopicsFromResults(results) {
  const topics = /* @__PURE__ */ new Set();
  results.forEach((result) => {
    const text = `${result.title} ${result.snippet}`.toLowerCase();
    const patterns = [
      /(?:how to|ways to|tips for|guide to|benefits of|best)\s+([^,.]{10,50})/gi,
      /(?:what is|understanding|learn about)\s+([^,.]{10,50})/gi,
      /([^,.]{10,50})\s+(?:explained|overview|comparison)/gi
    ];
    patterns.forEach((pattern) => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          topics.add(match[1].trim());
        }
      }
    });
  });
  return Array.from(topics).slice(0, 15);
}
function extractCommonHeadings(results) {
  const headings = /* @__PURE__ */ new Set();
  results.forEach((result) => {
    const title = result.title.toLowerCase();
    const commonPatterns = [
      "introduction",
      "overview",
      "what is",
      "how to",
      "benefits",
      "features",
      "advantages",
      "disadvantages",
      "pros and cons",
      "comparison",
      "alternatives",
      "pricing",
      "conclusion",
      "faq",
      "getting started",
      "best practices",
      "tips",
      "guide"
    ];
    commonPatterns.forEach((pattern) => {
      if (title.includes(pattern)) {
        headings.add(pattern);
      }
    });
  });
  return Array.from(headings);
}

async function fetchEnhancedNews(keyword, newsApiKey) {
  const last30Days = /* @__PURE__ */ new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const fromDate = last30Days.toISOString().split("T")[0];
  const queries = [
    keyword,
    `${keyword} 2025`,
    `${keyword} latest`,
    `${keyword} news`,
    `${keyword} trends`
  ];
  const allArticles = [];
  const errors = [];
  for (const query of queries) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&from=${fromDate}&apiKey=${newsApiKey}`
      );
      if (!response.ok) {
        errors.push(`Query "${query}" failed with status ${response.status}`);
        continue;
      }
      const data = await response.json();
      if (data.articles && Array.isArray(data.articles)) {
        data.articles.forEach((article) => {
          if (article.title && article.description) {
            allArticles.push({
              title: article.title,
              description: article.description || "",
              url: article.url || "",
              publishedAt: article.publishedAt || "",
              source: article.source?.name || "Unknown"
            });
          }
        });
      }
    } catch (error) {
      errors.push(`Query "${query}" failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  if (errors.length > 0) {
    console.warn("News API errors:", errors);
  }
  const uniqueArticles = deduplicateArticles(allArticles);
  const topArticles = uniqueArticles.slice(0, 25);
  const summary = generateSummary(topArticles);
  const trends = extractTrends(topArticles);
  return {
    articles: topArticles,
    summary,
    trends
  };
}
function deduplicateArticles(articles) {
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  articles.forEach((article) => {
    const key = article.title.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  });
  return unique.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
function generateSummary(articles) {
  if (articles.length === 0) {
    return "";
  }
  const summaryParts = [];
  articles.slice(0, 5).forEach((article) => {
    summaryParts.push(`${article.title} (${article.source}): ${article.description}`);
  });
  return summaryParts.join("\n\n");
}
function extractTrends(articles) {
  const keywords = /* @__PURE__ */ new Map();
  articles.forEach((article) => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    const words = text.match(/\b[a-z]{4,}\b/g) || [];
    words.forEach((word) => {
      if (!isStopWord(word)) {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      }
    });
  });
  return Array.from(keywords.entries()).filter(([_, count]) => count >= 2).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word]) => word);
}
function isStopWord(word) {
  const stopWords = /* @__PURE__ */ new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "they",
    "them",
    "their",
    "what",
    "which",
    "who",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "than",
    "too",
    "very"
  ]);
  return stopWords.has(word);
}

function analyzeContentQuality(markdown, html, keyword) {
  const issues = [];
  const recommendations = [];
  const wordCount = countWords(markdown);
  const headings = extractHeadings(markdown);
  const paragraphs = markdown.split("\n\n").filter((p) => p.trim().length > 50);
  const readabilityScore = calculateReadability(markdown);
  const keywordDensity = calculateKeywordDensity(markdown, keyword);
  const aiDetectionScore = calculateAIDetectionScore(markdown);
  const hasIntroduction = checkIntroduction(markdown);
  const hasConclusion = checkConclusion(markdown);
  const hasFAQ = markdown.toLowerCase().includes("faq") || markdown.toLowerCase().includes("frequently asked");
  const imageCount = (html.match(/<img/g) || []).length;
  const linkCount = (html.match(/<a href/g) || []).length;
  if (wordCount < 2e3) {
    issues.push(`Content too short: ${wordCount} words (minimum 2000)`);
    recommendations.push("Add more detailed sections, examples, and explanations");
  }
  if (wordCount > 4500) {
    issues.push(`Content too long: ${wordCount} words (maximum 4500 for readability)`);
    recommendations.push("Consider breaking into multiple articles or removing redundant content");
  }
  if (headings.h2.length < 6) {
    issues.push(`Too few H2 headings: ${headings.h2.length} (minimum 6)`);
    recommendations.push("Add more main sections to improve structure");
  }
  if (headings.h3.length < 10) {
    issues.push(`Too few H3 headings: ${headings.h3.length} (minimum 10)`);
    recommendations.push("Add subsections to break down complex topics");
  }
  if (paragraphs.length < 15) {
    issues.push(`Too few paragraphs: ${paragraphs.length} (minimum 15)`);
    recommendations.push("Break down content into more digestible paragraphs");
  }
  if (readabilityScore < 50 || readabilityScore > 80) {
    issues.push(`Readability score out of range: ${readabilityScore} (target 50-80)`);
    if (readabilityScore < 50) {
      recommendations.push("Simplify sentences and use shorter words");
    } else {
      recommendations.push("Add more depth and complexity to the content");
    }
  }
  if (keywordDensity < 0.5 || keywordDensity > 2.5) {
    issues.push(`Keyword density out of range: ${keywordDensity.toFixed(2)}% (target 0.5-2.5%)`);
    if (keywordDensity < 0.5) {
      recommendations.push(`Include keyword "${keyword}" more naturally throughout content`);
    } else {
      recommendations.push(`Reduce keyword "${keyword}" usage to avoid keyword stuffing`);
    }
  }
  if (!hasIntroduction) {
    issues.push("No clear introduction found");
    recommendations.push("Add a 2-3 paragraph introduction explaining the topic");
  }
  if (!hasConclusion) {
    issues.push("No clear conclusion found");
    recommendations.push("Add a conclusion summarizing key points");
  }
  if (!hasFAQ) {
    recommendations.push("Consider adding an FAQ section for better SEO");
  }
  if (imageCount < 3) {
    issues.push(`Too few images: ${imageCount} (minimum 3)`);
    recommendations.push("Add relevant images to improve engagement");
  }
  if (linkCount < 5) {
    issues.push(`Too few links: ${linkCount} (minimum 5)`);
    recommendations.push("Add authoritative external sources and internal links");
  }
  if (aiDetectionScore > 30) {
    issues.push(`High AI-detection score: ${aiDetectionScore}/100 (AI-like patterns detected)`);
    recommendations.push("Content contains AI-telltale phrases - needs human rewriting");
  }
  const overall = calculateOverallScore(
    wordCount,
    headings,
    paragraphs.length,
    readabilityScore,
    keywordDensity,
    hasIntroduction,
    hasConclusion,
    imageCount,
    linkCount,
    aiDetectionScore
  );
  return {
    overall,
    wordCount,
    headingCount: headings.h2.length + headings.h3.length,
    paragraphCount: paragraphs.length,
    readabilityScore,
    keywordDensity,
    hasIntroduction,
    hasConclusion,
    hasFAQ,
    imageCount,
    linkCount,
    aiDetectionScore,
    issues,
    recommendations
  };
}
function countWords(text) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}
function extractHeadings(markdown) {
  const h1 = markdown.match(/^# .+$/gm) || [];
  const h2 = markdown.match(/^## .+$/gm) || [];
  const h3 = markdown.match(/^### .+$/gm) || [];
  return {
    h1: h1.map((h) => h.replace(/^# /, "")),
    h2: h2.map((h) => h.replace(/^## /, "")),
    h3: h3.map((h) => h.replace(/^### /, ""))
  };
}
function calculateReadability(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  if (sentences.length === 0 || words.length === 0) {
    return 0;
  }
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  return Math.max(0, Math.min(100, score));
}
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  const vowels = "aeiouy";
  let syllableCount = 0;
  let previousWasVowel = false;
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }
  if (word.endsWith("e")) {
    syllableCount--;
  }
  return Math.max(1, syllableCount);
}
function calculateKeywordDensity(text, keyword) {
  const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 0);
  const keywordLower = keyword.toLowerCase();
  const keywordCount = words.filter((w) => w.includes(keywordLower)).length;
  return keywordCount / words.length * 100;
}
function checkIntroduction(markdown) {
  const lines = markdown.split("\n").filter((l) => l.trim());
  const firstParagraphs = lines.slice(0, 5).join(" ").toLowerCase();
  const introPatterns = [
    "in this article",
    "this guide",
    "we will explore",
    "introduction",
    "overview",
    "in this post"
  ];
  return introPatterns.some((pattern) => firstParagraphs.includes(pattern));
}
function checkConclusion(markdown) {
  const lines = markdown.split("\n").filter((l) => l.trim());
  const lastSection = lines.slice(-10).join(" ").toLowerCase();
  const conclusionPatterns = [
    "conclusion",
    "final thoughts",
    "in summary",
    "to sum up",
    "in conclusion",
    "wrapping up"
  ];
  return conclusionPatterns.some((pattern) => lastSection.includes(pattern));
}
function calculateAIDetectionScore(text) {
  text.toLowerCase();
  let aiScore = 0;
  const aiPhrases = [
    "delve into",
    "delving",
    " realm",
    "landscape of",
    "navigating",
    "tailored",
    "seamlessly",
    "it's important to note",
    "it's worth noting",
    "worth mentioning",
    "in the ever-evolving",
    "in today's fast-paced",
    "in today's digital age",
    "unlock the",
    "harness the",
    "leverage",
    "game-changer",
    "revolutionize",
    "whether you're a beginner or",
    "whether you're new to",
    "dive deep into",
    "embark on"
  ];
  aiPhrases.forEach((phrase) => {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = text.match(regex);
    if (matches) {
      aiScore += matches.length * 5;
    }
  });
  const transitionWords = ["additionally", "furthermore", "moreover", "consequently"];
  transitionWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = text.match(regex);
    if (matches && matches.length > 3) {
      aiScore += (matches.length - 3) * 3;
    }
  });
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const contractionCount = (text.match(/\b(don't|can't|won't|it's|we're|that's|here's|let's|i'm|you're)\b/gi) || []).length;
  const contractionRatio = sentences.length > 0 ? contractionCount / sentences.length : 0;
  if (contractionRatio < 0.05) {
    aiScore += 15;
  }
  const firstPersonCount = (text.match(/\b(we tested|in our testing|we found|we noticed|in our experience|we tried)\b/gi) || []).length;
  if (firstPersonCount < 3) {
    aiScore += 10;
  }
  return Math.min(100, aiScore);
}
function calculateOverallScore(wordCount, headings, paragraphCount, readabilityScore, keywordDensity, hasIntroduction, hasConclusion, imageCount, linkCount, aiDetectionScore) {
  let score = 0;
  if (wordCount >= 2e3 && wordCount <= 4500) score += 20;
  else if (wordCount >= 1500) score += 10;
  if (headings.h2.length >= 6) score += 15;
  if (headings.h3.length >= 10) score += 15;
  if (paragraphCount >= 15) score += 10;
  if (readabilityScore >= 50 && readabilityScore <= 80) score += 15;
  else if (readabilityScore >= 40 && readabilityScore <= 90) score += 8;
  if (keywordDensity >= 0.5 && keywordDensity <= 2.5) score += 10;
  if (hasIntroduction) score += 5;
  if (hasConclusion) score += 5;
  if (imageCount >= 3) score += 5;
  if (linkCount >= 5) score += 5;
  if (aiDetectionScore < 20) score += 10;
  else if (aiDetectionScore < 30) score += 5;
  else score -= 10;
  return Math.min(100, Math.max(0, score));
}

function generateArticleSchema(data) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "author": {
      "@type": "Organization",
      "name": data.author || "AI Tools Insights",
      "url": "https://aitoolsinsights.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Tools Insights",
      "url": "https://aitoolsinsights.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aitoolsinsights.com/logo.png",
        "width": 600,
        "height": 60
      }
    },
    "datePublished": data.publishDate || (/* @__PURE__ */ new Date()).toISOString(),
    "dateModified": data.modifiedDate || (/* @__PURE__ */ new Date()).toISOString(),
    "inLanguage": "en-US",
    "articleSection": "Technology"
  };
  if (data.imageUrl) {
    schema.image = {
      "@type": "ImageObject",
      "url": data.imageUrl,
      "width": 1200,
      "height": 675
    };
  }
  if (data.url) {
    schema.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": data.url
    };
    schema.url = data.url;
  }
  if (data.keywords && data.keywords.length > 0) {
    schema.keywords = data.keywords.join(", ");
  }
  if (data.wordCount) {
    schema.wordCount = data.wordCount;
  }
  return schema;
}
function generateFAQSchema(faqItems, url) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item, index) => ({
      "@type": "Question",
      "name": item.question,
      "position": index + 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
        "inLanguage": "en-US"
      }
    }))
  };
  if (url) {
    schema.url = url;
  }
  return schema;
}
function generateHowToSchema(data) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": data.title,
    "description": data.description,
    "inLanguage": "en-US",
    "step": data.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": data.url ? `${data.url}#step-${index + 1}` : void 0
    }))
  };
  if (data.imageUrl) {
    schema.image = {
      "@type": "ImageObject",
      "url": data.imageUrl,
      "width": 1200,
      "height": 675
    };
  }
  if (data.totalTime) {
    schema.totalTime = data.totalTime;
  }
  if (data.url) {
    schema.url = data.url;
  }
  schema.estimatedCost = {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  };
  return schema;
}
function generateBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "numberOfItems": breadcrumbs.length,
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": {
        "@type": "Thing",
        "@id": crumb.url,
        "name": crumb.name
      }
    }))
  };
}
function generateImageObjectSchema(data) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": data.url,
    "contentUrl": data.url,
    "width": data.width || 1200,
    "height": data.height || 675,
    "encodingFormat": "image/png",
    "inLanguage": "en-US"
  };
  if (data.caption) {
    schema.caption = data.caption;
  }
  if (data.description) {
    schema.description = data.description;
  }
  schema.author = {
    "@type": "Organization",
    "name": "AI Tools Insights"
  };
  schema.copyrightHolder = {
    "@type": "Organization",
    "name": "AI Tools Insights"
  };
  schema.license = "https://creativecommons.org/licenses/by/4.0/";
  schema.acquireLicensePage = "https://aitoolsinsights.com/license";
  return schema;
}
function extractFAQFromContent(markdown) {
  const faqItems = [];
  const faqSectionMatch = markdown.match(/##\s*(?:FAQ|Frequently Asked Questions)([\s\S]*?)(?=##|$)/i);
  if (!faqSectionMatch) {
    return faqItems;
  }
  const faqSection = faqSectionMatch[1];
  const qaPattern = /###\s*(.+?)\n+([\s\S]*?)(?=###|$)/g;
  let match;
  while ((match = qaPattern.exec(faqSection)) !== null) {
    const question = match[1].trim().replace(/\?$/, "") + "?";
    const answer = match[2].trim();
    if (question && answer && answer.length > 10) {
      faqItems.push({
        question,
        answer: answer.replace(/\n+/g, " ").slice(0, 500)
      });
    }
  }
  return faqItems;
}
function extractHowToSteps(markdown) {
  const steps = [];
  const stepsPattern = /(?:^|\n)(\d+)\.\s*(.+?)(?=\n\d+\.|$)/gs;
  const matches = markdown.matchAll(stepsPattern);
  for (const match of matches) {
    const stepName = match[2].trim().split("\n")[0];
    const stepText = match[2].trim();
    if (stepName && stepText) {
      steps.push({
        name: stepName,
        text: stepText.slice(0, 300)
      });
    }
  }
  if (steps.length < 3) {
    return [];
  }
  return steps;
}
function generateAllSchemas(data) {
  const schemas = [];
  const articleSchema = generateArticleSchema({
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    url: data.url,
    author: data.author,
    keywords: data.keywords,
    wordCount: data.wordCount
  });
  schemas.push(articleSchema);
  console.log("✅ Article Schema added");
  if (data.url && data.category) {
    const breadcrumbs = [
      { name: "Home", url: "https://aitoolsinsights.com" },
      { name: data.category, url: `https://aitoolsinsights.com/${data.category.toLowerCase().replace(/\s+/g, "-")}` },
      { name: data.title, url: data.url }
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    schemas.push(breadcrumbSchema);
    console.log("✅ BreadcrumbList Schema added");
  }
  if (data.faqItems && data.faqItems.length > 0) {
    const faqSchema = generateFAQSchema(data.faqItems, data.url);
    schemas.push(faqSchema);
    console.log(`✅ FAQPage Schema: ${data.faqItems.length} questions`);
  } else {
    const extractedFaqItems = extractFAQFromContent(data.markdown);
    if (extractedFaqItems.length > 0) {
      const faqSchema = generateFAQSchema(extractedFaqItems, data.url);
      schemas.push(faqSchema);
      console.log(`✅ FAQPage Schema: ${extractedFaqItems.length} questions (extracted)`);
    }
  }
  const howToSteps = extractHowToSteps(data.markdown);
  if (howToSteps.length >= 3) {
    const howToSchema = generateHowToSchema({
      title: data.title,
      description: data.description,
      steps: howToSteps,
      imageUrl: data.imageUrl,
      url: data.url
    });
    schemas.push(howToSchema);
    console.log(`✅ HowTo Schema: ${howToSteps.length} steps`);
  }
  if (data.imageUrl) {
    const imageSchema = generateImageObjectSchema({
      url: data.imageUrl,
      caption: data.title,
      description: data.description,
      width: 1200,
      height: 675
    });
    schemas.push(imageSchema);
    console.log("✅ ImageObject Schema added");
  }
  const schemaHtml = schemas.map((schema) => `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
<\/script>`).join("\n");
  return { schemas, schemaHtml };
}

class APIKeyManager {
  geminiKeys = [];
  newsKeys = [];
  geminiCurrentIndex = 0;
  newsCurrentIndex = 0;
  lastReload = 0;
  reloadInterval = 6e4;
  async loadKeys() {
    const now = Date.now();
    if (now - this.lastReload < this.reloadInterval && this.geminiKeys.length > 0) {
      return;
    }
    try {
      const geminiKeysJson = await getSetting("GEMINI_API_KEYS") || "[]";
      const newsKeysJson = await getSetting("NEWSAPI_KEYS") || "[]";
      const geminiKeysArray = JSON.parse(geminiKeysJson);
      const newsKeysArray = JSON.parse(newsKeysJson);
      this.geminiKeys = geminiKeysArray.filter((key) => key && key.trim().length > 10).map((key) => ({
        key: key.trim(),
        lastUsed: 0,
        failCount: 0
      }));
      this.newsKeys = newsKeysArray.map((key) => ({
        key,
        lastUsed: 0,
        failCount: 0
      }));
      this.lastReload = now;
      console.log(`🔑 Loaded ${this.geminiKeys.length} Gemini keys and ${this.newsKeys.length} NewsAPI keys`);
      if (this.geminiKeys.length > 0) {
        console.log(`🔑 Gemini keys loaded:`, this.geminiKeys.map(
          (k, i) => `#${i + 1}: ${k.key.substring(0, 15)}... (${k.key.length} chars)`
        ).join(", "));
      }
    } catch (error) {
      console.error("Failed to load API keys:", error);
      this.geminiKeys = [];
      this.newsKeys = [];
    }
  }
  async getNextGeminiKey() {
    await this.loadKeys();
    if (this.geminiKeys.length === 0) {
      const oldKey = await getSetting("GEMINI_API_KEY");
      if (oldKey) {
        console.log("⚠️ Using legacy single Gemini API key");
        return oldKey;
      }
      return null;
    }
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1e3;
    this.geminiKeys.forEach((k) => {
      if (k.failCount > 0 && k.lastFailTime && now - k.lastFailTime > fiveMinutes) {
        console.log(`🔄 Resetting fail count for key (5 min cooldown expired)`);
        k.failCount = 0;
        k.lastError = void 0;
      }
    });
    const availableKeys = this.geminiKeys.filter((k) => k.failCount < 5);
    if (availableKeys.length === 0) {
      console.warn("⚠️ All Gemini keys have failed, resetting all fail counts");
      this.geminiKeys.forEach((k) => {
        k.failCount = 0;
        k.lastError = void 0;
      });
      return this.geminiKeys[0]?.key || null;
    }
    this.geminiCurrentIndex = (this.geminiCurrentIndex + 1) % this.geminiKeys.length;
    let attempts = 0;
    while (this.geminiKeys[this.geminiCurrentIndex].failCount >= 5 && attempts < this.geminiKeys.length) {
      this.geminiCurrentIndex = (this.geminiCurrentIndex + 1) % this.geminiKeys.length;
      attempts++;
    }
    const selectedKey = this.geminiKeys[this.geminiCurrentIndex];
    selectedKey.lastUsed = Date.now();
    console.log(`🔑 Using Gemini key #${this.geminiCurrentIndex + 1} (fail count: ${selectedKey.failCount})`);
    return selectedKey.key;
  }
  async getNextNewsKey() {
    await this.loadKeys();
    if (this.newsKeys.length === 0) {
      const oldKey = await getSetting("NEWSAPI_KEY");
      if (oldKey) {
        console.log("⚠️ Using legacy single NewsAPI key");
        return oldKey;
      }
      return null;
    }
    const availableKeys = this.newsKeys.filter((k) => k.failCount < 3);
    if (availableKeys.length === 0) {
      console.warn("⚠️ All NewsAPI keys have failed, resetting fail counts");
      this.newsKeys.forEach((k) => k.failCount = 0);
      return this.newsKeys[0]?.key || null;
    }
    this.newsCurrentIndex = (this.newsCurrentIndex + 1) % this.newsKeys.length;
    let attempts = 0;
    while (this.newsKeys[this.newsCurrentIndex].failCount >= 3 && attempts < this.newsKeys.length) {
      this.newsCurrentIndex = (this.newsCurrentIndex + 1) % this.newsKeys.length;
      attempts++;
    }
    const selectedKey = this.newsKeys[this.newsCurrentIndex];
    selectedKey.lastUsed = Date.now();
    console.log(`📰 Using NewsAPI key #${this.newsCurrentIndex + 1} (fail count: ${selectedKey.failCount})`);
    return selectedKey.key;
  }
  markGeminiKeyFailed(key, error) {
    const keyStatus = this.geminiKeys.find((k) => k.key === key);
    if (keyStatus) {
      keyStatus.failCount++;
      keyStatus.lastError = error;
      keyStatus.lastFailTime = Date.now();
      console.warn(`❌ Gemini key failed (count: ${keyStatus.failCount}/5): ${error}`);
    }
  }
  markNewsKeyFailed(key, error) {
    const keyStatus = this.newsKeys.find((k) => k.key === key);
    if (keyStatus) {
      keyStatus.failCount++;
      keyStatus.lastError = error;
      console.warn(`❌ NewsAPI key failed (count: ${keyStatus.failCount}): ${error}`);
    }
  }
  markGeminiKeySuccess(key) {
    const keyStatus = this.geminiKeys.find((k) => k.key === key);
    if (keyStatus) {
      if (keyStatus.failCount > 0) {
        console.log(`✅ Gemini key succeeded, resetting fail count from ${keyStatus.failCount} to 0`);
      }
      keyStatus.failCount = 0;
    }
  }
  markNewsKeySuccess(key) {
    const keyStatus = this.newsKeys.find((k) => k.key === key);
    if (keyStatus && keyStatus.failCount > 0) {
      keyStatus.failCount = Math.max(0, keyStatus.failCount - 1);
      console.log(`✅ NewsAPI key succeeded, reducing fail count to ${keyStatus.failCount}`);
    }
  }
  async getAllGeminiKeys() {
    await this.loadKeys();
    return this.geminiKeys.map((k) => k.key);
  }
  async getAllNewsKeys() {
    await this.loadKeys();
    return this.newsKeys.map((k) => k.key);
  }
  async getKeyStats() {
    await this.loadKeys();
    return {
      gemini: {
        total: this.geminiKeys.length,
        healthy: this.geminiKeys.filter((k) => k.failCount < 5).length,
        failed: this.geminiKeys.filter((k) => k.failCount >= 5).length
      },
      news: {
        total: this.newsKeys.length,
        healthy: this.newsKeys.filter((k) => k.failCount < 3).length,
        failed: this.newsKeys.filter((k) => k.failCount >= 3).length
      }
    };
  }
  async resetAllGeminiKeys() {
    await this.loadKeys();
    console.log("🔄 Resetting all Gemini API keys...");
    this.geminiKeys.forEach((k) => {
      k.failCount = 0;
      k.lastError = void 0;
      k.lastFailTime = void 0;
    });
    console.log("✅ All Gemini keys reset");
  }
  async resetAllNewsKeys() {
    await this.loadKeys();
    console.log("🔄 Resetting all NewsAPI keys...");
    this.newsKeys.forEach((k) => {
      k.failCount = 0;
      k.lastError = void 0;
      k.lastFailTime = void 0;
    });
    console.log("✅ All NewsAPI keys reset");
  }
}
const apiKeyManager = new APIKeyManager();

const validatePAACoverage = (headings, paaQuestions) => {
  const allHeadings = [
    headings.h1 || "",
    ...(headings.headings || []).flatMap((h) => {
      const titles = [h.h2];
      if (h.h3 && Array.isArray(h.h3)) {
        titles.push(...h.h3);
      }
      return titles;
    })
  ].map((h) => h.toLowerCase());
  const uncovered = [];
  let covered = 0;
  paaQuestions.forEach((question) => {
    const keywords = question.toLowerCase().replace(/[?]/g, "").split(/\s+/).filter((word) => word.length > 3 && !["what", "how", "why", "when", "where", "does", "the", "this", "that", "with", "from", "are"].includes(word));
    const isCovered = allHeadings.some(
      (heading) => keywords.some((keyword) => heading.includes(keyword))
    );
    if (isCovered) {
      covered++;
    } else {
      uncovered.push(question);
    }
  });
  return { covered, total: paaQuestions.length, uncovered };
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const executeWithDedicatedKey = async (fn, stepName, stepIndex, allKeys, maxRetries = 3) => {
  if (allKeys.length === 0) {
    throw new Error("No Gemini API keys configured. Please add at least one API key in settings.");
  }
  const primaryKeyIndex = stepIndex % allKeys.length;
  let lastError;
  let totalAttempts = 0;
  const maxTotalAttempts = allKeys.length * maxRetries;
  for (let retryRound = 0; retryRound < maxRetries; retryRound++) {
    for (let keyAttempt = 0; keyAttempt < allKeys.length; keyAttempt++) {
      totalAttempts++;
      const keyIndex = (primaryKeyIndex + keyAttempt) % allKeys.length;
      const apiKey = allKeys[keyIndex];
      if (totalAttempts === 1) {
        console.log(`🔑 ${stepName} using dedicated key #${keyIndex + 1}/${allKeys.length}`);
      } else {
        const isServiceOverload = lastError && (lastError.message?.includes("503") || lastError.message?.includes("overloaded") || lastError.message?.toLowerCase().includes("model is overloaded"));
        let delay;
        if (isServiceOverload) {
          delay = Math.min(5e3 * Math.pow(2, retryRound), 6e4);
        } else {
          delay = Math.min(3e3 + totalAttempts * 1e3, 15e3);
        }
        console.log(`🔄 ${stepName} retry ${totalAttempts}/${maxTotalAttempts} with key #${keyIndex + 1}/${allKeys.length} (round ${retryRound + 1}/${maxRetries})`);
        console.log(`⏳ Waiting ${delay}ms before retry...${isServiceOverload ? " (service overload detected)" : ""}`);
        await sleep(delay);
      }
      try {
        const result = await fn(apiKey);
        console.log(`✅ ${stepName} completed successfully with key #${keyIndex + 1} (attempt ${totalAttempts})`);
        return result;
      } catch (error) {
        lastError = error;
        let errorMsg = "";
        if (error.message) {
          errorMsg = error.message;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (typeof error === "string") {
          errorMsg = error;
        } else {
          errorMsg = JSON.stringify(error);
        }
        const errorStatus = error.status || error.statusCode || error.code || "";
        const is503 = errorMsg.includes("503") || errorMsg.includes("overloaded") || errorMsg.includes("Service Unavailable") || errorMsg.toLowerCase().includes("model is overloaded") || errorStatus === 503;
        const is429 = errorMsg.includes("quota") || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("Rate limit") || errorStatus === 429;
        const is500 = errorMsg.includes("500") || errorMsg.includes("Internal") || errorStatus === 500;
        const is400 = errorMsg.includes("400") || errorMsg.includes("API_KEY_INVALID") || errorStatus === 400;
        const is401 = errorMsg.includes("401") || errorMsg.includes("Unauthorized") || errorStatus === 401;
        const isRetryable = is503 || is429 || is500;
        const isFatalError = is400 || is401;
        console.error(`❌ ${stepName} failed with key #${keyIndex + 1} (attempt ${totalAttempts}/${maxTotalAttempts}): ${errorMsg.substring(0, 200)}`);
        if (isFatalError) {
          console.error(`💥 Fatal error detected (${is400 ? "400/Bad Request" : "401/Unauthorized"}), stopping retries`);
          throw new Error(`${stepName} failed: ${errorMsg}`);
        }
        if (isRetryable && totalAttempts < maxTotalAttempts) {
          const errorType = is503 ? "503/Service Overloaded" : is429 ? "429/Rate Limit" : "500/Server Error";
          console.log(`⚠️ Retryable error detected (${errorType}), will continue retrying...`);
          continue;
        }
        if (totalAttempts >= maxTotalAttempts) {
          console.error(`💥 All retry attempts exhausted (${totalAttempts}/${maxTotalAttempts}) for ${stepName}`);
          throw new Error(`${stepName} failed after ${totalAttempts} attempts across ${allKeys.length} keys: ${errorMsg}`);
        }
      }
    }
  }
  throw new Error(`${stepName} failed after ${totalAttempts} attempts with ${allKeys.length} API keys: ${lastError?.message || "Unknown error"}`);
};
const extractJSON = (text) => {
  text = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").replace(/^json\n?/gi, "").trim();
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  const lastBrace = text.lastIndexOf("}");
  const lastBracket = text.lastIndexOf("]");
  let startIndex = -1;
  let endIndex = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    endIndex = lastBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
    endIndex = lastBracket;
  }
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    text = text.substring(startIndex, endIndex + 1);
  }
  text = text.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'").replace(/[\u2018\u2019]/g, "'").replace(/\n\s*\/\/.*/g, "").replace(/,(\s*[}\]])/g, "$1").replace(/\s+/g, " ").replace(/"\s*:\s*"/g, '":"').replace(/"\s*,\s*"/g, '","');
  return text.trim();
};
const POST = async ({ request }) => {
  const encoder = new TextEncoder();
  let controller;
  const stream = new ReadableStream({
    start(c) {
      controller = c;
    }
  });
  const sendProgress = (step, message) => {
    const data = JSON.stringify({ type: "progress", step, message }) + "\n";
    controller.enqueue(encoder.encode(data));
  };
  const sendError = (error) => {
    const data = JSON.stringify({ type: "error", error }) + "\n";
    controller.enqueue(encoder.encode(data));
    controller.close();
  };
  const sendComplete = (result) => {
    const data = JSON.stringify({ type: "complete", data: result }) + "\n";
    controller.enqueue(encoder.encode(data));
    controller.close();
  };
  (async () => {
    try {
      await requireAuth(request);
      const { keyword, category, subcategory, affiliate_link } = await request.json();
      if (!keyword || !category) {
        sendError("Missing required fields");
        return;
      }
      const allGeminiKeys = await apiKeyManager.getAllGeminiKeys();
      const allNewsKeys = await apiKeyManager.getAllNewsKeys();
      if (allGeminiKeys.length === 0) {
        sendError("No Gemini API keys configured. Please add at least one API key in Settings.");
        return;
      }
      if (allNewsKeys.length === 0) {
        sendError("No NewsAPI keys configured. Please add at least one API key in Settings.");
        return;
      }
      console.log(`🔑 Using ${allGeminiKeys.length} Gemini keys and ${allNewsKeys.length} NewsAPI keys`);
      const keyStats = await apiKeyManager.getKeyStats();
      console.log(`📊 Key Health: ${keyStats.gemini.healthy}/${keyStats.gemini.total} Gemini keys healthy, ${keyStats.gemini.failed} failed`);
      sendProgress(0, "Initializing workflow with load-balanced API keys...");
      const createModels = (apiKey) => {
        const genAI = new GoogleGenerativeAI(apiKey);
        return {
          model: genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 65536,
              responseMimeType: "text/plain"
            }
          }),
          jsonModel: genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
              temperature: 0.5,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 65536,
              responseMimeType: "application/json"
            }
          })
        };
      };
      const determinedCategory = category === "ai-tools" || category === "AI Tools" ? "AI Tools" : subcategory || "Blog";
      sendProgress(1, "Step 1: Latest Information & Title Generation (10 H2 + 20 H3 titles)...");
      console.log("🔍 STEP 1: Research Latest Information - 10 H2 Titles + 20 H3 Titles from NewsAPI");
      const newsApiKey = await apiKeyManager.getNextNewsKey();
      if (!newsApiKey) {
        sendError("Failed to get NewsAPI key");
        return;
      }
      const newsContext = await fetchEnhancedNews(keyword, newsApiKey);
      const serpAnalysis = await analyzeSERP(keyword);
      const step1Prompt = `You are an expert SEO researcher. Research everything about "${keyword}" and create comprehensive heading structure with BOTH H2 and H3 titles based on the latest information from NewsAPI.

NEWS CONTEXT (Latest Information):
${newsContext.summary}

TRENDING TOPICS: ${newsContext.trends.join(", ")}

NEWS ARTICLES (Use these for heading inspiration):
${newsContext.articles.slice(0, 25).map((article, i) => `${i + 1}. ${article.title} (${article.source})`).join("\n")}

COMPETITOR ANALYSIS:
Top 10 Ranking Titles:
${serpAnalysis.topResults.slice(0, 10).map((r, i) => `${i + 1}. ${r.title}`).join("\n")}

Common Competitor Headings: ${serpAnalysis.commonHeadings.join(", ")}
Competitor Topics: ${serpAnalysis.competitorTopics.join(", ")}

USER SEARCH INTENT:
People Also Ask Questions:
${serpAnalysis.peopleAlsoAsk.slice(0, 15).map((q, i) => `${i + 1}. ${q}`).join("\n")}

Related User Searches: ${serpAnalysis.relatedSearches.join(", ")}

CREATE COMPREHENSIVE HEADING STRUCTURE:

TASK: Generate 10 H2 Titles + 20 H3 Titles
- Compile the top 10 H2 titles that cover "${keyword}" from all angles and topics
- For each H2, create 2 H3 titles that dive deeper into that topic (10 H2 × 2 H3 = 20 H3 total)
- Use the NewsAPI articles above as inspiration
- Focus on what's hot, trending, and current in 2025
- Cover the topic from all angles and perspectives
- DO NOT REPEAT TITLES - all titles must be unique
- Use words related to the main keyword
- Address People Also Ask questions
- Make sure ALL titles comprehensively cover the keyword from multiple angles

MANDATORY REQUIREMENTS:
1. EXACTLY 10 H2 TITLES: No more, no less
2. EXACTLY 2 H3 TITLES PER H2: Each H2 must have exactly 2 H3 subsections (total 20 H3s)
3. NO DUPLICATION: All titles must be unique
4. LATEST INFORMATION: Use NewsAPI context for current 2025 trends
5. ALL ANGLES: Cover the keyword from every possible angle, topic, and perspective
6. COMPREHENSIVE COVERAGE: Ensure topics span beginner to advanced, theoretical to practical

RESPOND WITH JSON ONLY:
{
  "h1": "Main catchy article title with keyword",
  "headings": [
    {
      "h2": "First H2 heading",
      "h3": ["First H3 under this H2", "Second H3 under this H2"]
    },
    {
      "h2": "Second H2 heading",
      "h3": ["First H3 under this H2", "Second H3 under this H2"]
    }
    ... exactly 10 H2 headings, each with exactly 2 H3 titles
  ]
}`;
      let step1Result;
      try {
        step1Result = await executeWithDedicatedKey(async (apiKey) => {
          const { jsonModel } = createModels(apiKey);
          const result = await jsonModel.generateContent(step1Prompt);
          const rawText = result.response.text();
          console.log(`Step 1 raw response (first 400 chars):`, rawText.substring(0, 400));
          const text = extractJSON(rawText);
          const parsed = JSON.parse(text);
          if (!parsed.h1 || !parsed.headings || !Array.isArray(parsed.headings)) {
            console.error("Step 1 validation failed. Structure:", parsed);
            throw new Error("Step 1 validation failed: Missing required fields (h1 or headings)");
          }
          if (parsed.headings.length < 10) {
            console.warn(`⚠️ Only ${parsed.headings.length} H2 titles generated, expected 10`);
          }
          const h3Counts = parsed.headings.map((h) => h.h3?.length || 0);
          const totalH3s2 = h3Counts.reduce((sum, count) => sum + count, 0);
          console.log(`📊 H2 count: ${parsed.headings.length}, H3 count: ${totalH3s2} (${h3Counts.join(", ")} per H2)`);
          const invalidH2s = parsed.headings.filter((h) => !h.h3 || h.h3.length !== 2);
          if (invalidH2s.length > 0) {
            console.warn(`⚠️ ${invalidH2s.length} H2 sections don't have exactly 2 H3 titles`);
          }
          return parsed;
        }, "Step 1: Research & Headlines", 0, allGeminiKeys);
      } catch (error) {
        sendError("Step 1 failed: " + error.message);
        return;
      }
      const totalH3s = step1Result.headings.reduce((sum, h) => sum + (h.h3?.length || 0), 0);
      console.log(`📊 Step 1 Complete: ${step1Result.headings.length} H2 titles + ${totalH3s} H3 titles from NewsAPI`);
      await sleep(2e3);
      const paaCoverage = validatePAACoverage(step1Result, serpAnalysis.peopleAlsoAsk);
      console.log(`🎯 Search Intent Coverage: ${paaCoverage.covered}/${paaCoverage.total} PAA questions covered (${Math.round(paaCoverage.covered / paaCoverage.total * 100)}%)`);
      if (paaCoverage.uncovered.length > 0) {
        console.log(`⚠️ Uncovered PAA questions:`, paaCoverage.uncovered);
      }
      if (paaCoverage.covered / paaCoverage.total < 0.6) {
        console.warn(`⚠️ WARNING: Only ${Math.round(paaCoverage.covered / paaCoverage.total * 100)}% of PAA questions covered. Article may not fully address user search intent.`);
      }
      sendProgress(2, "Step 2: Extracting 100 Semantic Keywords...");
      console.log("🔑 STEP 2: Extract Top 100 Semantic Keywords");
      const step2Prompt = `You are an SEO keyword expert. Extract the top 100 strong semantic keywords related to "${keyword}".

Use NewsAPI context and your knowledge to find keywords that:
- Are semantically related to "${keyword}"
- Cover the topic from all angles
- Include long-tail keywords
- Include LSI (Latent Semantic Indexing) keywords
- Include related questions and topics

NEWS CONTEXT: ${newsContext.summary.slice(0, 1e3)}
RELATED SEARCHES: ${serpAnalysis.relatedSearches.join(", ")}
TRENDING: ${newsContext.trends.join(", ")}

RESPOND WITH JSON ONLY:
{
  "semanticKeywords": ["keyword1", "keyword2", ... 100 keywords total]
}`;
      const semanticData = await executeWithDedicatedKey(async (apiKey) => {
        const { jsonModel } = createModels(apiKey);
        const step2Result = await jsonModel.generateContent(step2Prompt);
        if (!step2Result || !step2Result.response) {
          console.error("Step 2 - No response object from API");
          throw new Error("No response from Gemini API");
        }
        const rawText = step2Result.response.text();
        if (!rawText || rawText.length < 50) {
          console.error("Step 2 - Response too short or empty");
          throw new Error("API returned empty or very short response");
        }
        console.log(`Step 2 raw response (first 400 chars):`, rawText.substring(0, 400));
        const semanticKeywordsJson = extractJSON(rawText);
        const parsed = JSON.parse(semanticKeywordsJson);
        if (!parsed.semanticKeywords || !Array.isArray(parsed.semanticKeywords)) {
          console.error("Step 2 validation failed. Data:", parsed);
          throw new Error("Step 2 validation failed: Missing semanticKeywords array");
        }
        return parsed;
      }, "Step 2: Semantic Keywords", 1, allGeminiKeys);
      console.log(`🔑 Step 2 Complete: Extracted ${semanticData.semanticKeywords.length} semantic keywords`);
      await sleep(2e3);
      sendProgress(3, "Step 3: Merging Keywords into All Titles (H2 + H3)...");
      console.log("🔗 STEP 3: Merge Semantic Keywords into ALL H2 and H3 Titles");
      const step3Prompt = `Merge these semantic keywords into ALL the H2 and H3 titles naturally.

CURRENT HEADING STRUCTURE (10 H2s + 20 H3s):
${JSON.stringify(step1Result.headings, null, 2)}

SEMANTIC KEYWORDS TO INTEGRATE:
${semanticData.semanticKeywords.join(", ")}

Enhance BOTH the H2 titles AND the H3 titles by naturally incorporating relevant semantic keywords:
- Keep titles trendy and modern for 2025
- Maintain readability and natural flow
- Integrate keywords that are most relevant to each specific title
- Ensure every title (both H2 and H3) gets enhanced with appropriate keywords
- Maintain the exact structure: 10 H2 titles, each with exactly 2 H3 titles
- Make sure titles cover the keyword from all angles and perspectives

Return this exact JSON structure with all enhanced titles:
{
  "h1": "${step1Result.h1}",
  "headings": [
    {
      "h2": "First enhanced H2 with semantic keywords",
      "h3": ["Enhanced H3 with keywords", "Enhanced H3 with keywords"]
    },
    {
      "h2": "Second enhanced H2 with semantic keywords",
      "h3": ["Enhanced H3 with keywords", "Enhanced H3 with keywords"]
    }
    ... all 10 H2 headings, each with exactly 2 enhanced H3 titles
  ]
}`;
      const enhancedStructure = await executeWithDedicatedKey(async (apiKey) => {
        const { jsonModel } = createModels(apiKey);
        const step3Result = await jsonModel.generateContent(step3Prompt);
        const rawText = step3Result.response.text();
        console.log(`Step 3 raw response (first 300 chars):`, rawText.substring(0, 300));
        const enhancedStructureJson = extractJSON(rawText);
        console.log(`Step 3 extracted JSON (first 300 chars):`, enhancedStructureJson.substring(0, 300));
        const parsed = JSON.parse(enhancedStructureJson);
        if (!parsed.h1 || !parsed.headings || !Array.isArray(parsed.headings)) {
          console.error("Step 3 validation failed. Structure:", parsed);
          throw new Error("Step 3 validation failed: Missing required fields (h1 or headings)");
        }
        if (parsed.headings.length < 10) {
          console.warn(`⚠️ Only ${parsed.headings.length} enhanced H2 headings, expected 10`);
        }
        const h3Counts = parsed.headings.map((h) => h.h3?.length || 0);
        const totalH3s2 = h3Counts.reduce((sum, count) => sum + count, 0);
        console.log(`📊 Enhanced: ${parsed.headings.length} H2 titles + ${totalH3s2} H3 titles with semantic keywords`);
        const invalidH2s = parsed.headings.filter((h) => !h.h3 || h.h3.length !== 2);
        if (invalidH2s.length > 0) {
          console.warn(`⚠️ ${invalidH2s.length} H2 sections don't have exactly 2 H3 titles after enhancement`);
        }
        return parsed;
      }, "Step 3: Keyword Merging", 2, allGeminiKeys);
      console.log("🔗 Step 3 Complete: Semantic keywords merged into ALL H2 and H3 titles");
      sendProgress(4, "Step 4: Building Complete Article Structure...");
      console.log("📝 STEP 4: Create Complete Article Structure with Exactly 2 H3 per H2");
      const step4Prompt = `Create a COMPLETE article outline for "${keyword}".

Use the enhanced H2 and H3 headings provided below to create a comprehensive article outline.
CRITICAL STRUCTURE RULE: Every H2 title must have EXACTLY 2 H3 titles underneath it.

ENHANCED STRUCTURE WITH H2 AND H3 HEADINGS:
${JSON.stringify(enhancedStructure, null, 2)}

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks.

Required JSON structure:
{
  "h1": "Article main title (use h1 from enhanced structure)",
  "introduction": "Write a compelling 3-line introduction about the topic",
  "sections": [
    {
      "h2": "H2 heading from enhanced structure",
      "intro": "Brief 2-line section introduction",
      "subsections": [
        {
          "h3": "First H3 from enhanced structure for this H2",
          "outline": "Key points to cover in this subsection"
        },
        {
          "h3": "Second H3 from enhanced structure for this H2",
          "outline": "Key points to cover in this subsection"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "Common question about the topic?",
      "answerOutline": "Key points for the answer"
    }
  ],
  "conclusion": "Outline for conclusion section",
  "authorSection": "Brief author experience note"
}

MANDATORY: Create exactly 10 sections, each with EXACTLY 2 subsections. Use the H2 and H3 titles from the enhanced structure provided above.`;
      let articleStructure;
      try {
        articleStructure = await executeWithDedicatedKey(async (apiKey) => {
          const { jsonModel } = createModels(apiKey);
          const step4Result = await jsonModel.generateContent(step4Prompt);
          const rawText = step4Result.response.text();
          console.log(`Step 4 raw response length:`, rawText.length);
          console.log(`Step 4 raw response (first 500 chars):`, rawText.substring(0, 500));
          let articleStructureJson = extractJSON(rawText);
          if (!articleStructureJson || articleStructureJson.trim().length < 50) {
            console.error("Step 4: Extracted JSON is too short or empty");
            throw new Error("Invalid JSON response - too short");
          }
          console.log(`Step 4 extracted JSON (first 500 chars):`, articleStructureJson.substring(0, 500));
          const parsed = JSON.parse(articleStructureJson);
          if (!parsed.h1) {
            console.warn("Missing h1, using enhanced structure h1");
            parsed.h1 = enhancedStructure.h1;
          }
          if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
            console.error("Step 4 validation failed. Structure keys:", Object.keys(parsed));
            throw new Error("Step 4 validation failed: Missing or empty sections array");
          }
          const subsectionCounts = parsed.sections.map((s) => s.subsections?.length || 0);
          const totalSubsections = subsectionCounts.reduce((sum, count) => sum + count, 0);
          console.log(`📊 Structure: ${parsed.sections.length} H2 sections with ${totalSubsections} H3 subsections (${subsectionCounts.join(", ")} per section)`);
          const invalidSections = parsed.sections.filter((s) => !s.subsections || s.subsections.length !== 2);
          if (invalidSections.length > 0) {
            console.warn(`⚠️ ${invalidSections.length} sections don't have exactly 2 subsections, fixing...`);
            parsed.sections = parsed.sections.map((section) => {
              if (!section.subsections || section.subsections.length !== 2) {
                const existingH3s = section.subsections || [];
                while (existingH3s.length < 2) {
                  existingH3s.push({
                    h3: `Additional aspect of ${section.h2}`,
                    outline: `Key points about this aspect`
                  });
                }
                if (existingH3s.length > 2) {
                  existingH3s.length = 2;
                }
                section.subsections = existingH3s;
              }
              return section;
            });
          }
          if (!parsed.faq || !Array.isArray(parsed.faq)) {
            console.warn("Missing or invalid FAQ, creating default");
            parsed.faq = [
              {
                question: `What is ${keyword}?`,
                answerOutline: `Brief explanation of ${keyword}`
              }
            ];
          }
          if (!parsed.conclusion) {
            console.warn("Missing conclusion, creating default");
            parsed.conclusion = `Summary of key points about ${keyword}`;
          }
          if (!parsed.authorSection) {
            console.warn("Missing authorSection, creating default");
            parsed.authorSection = "Expert insights on AI tools and technology";
          }
          return parsed;
        }, "Step 4: Article Structure", 3, allGeminiKeys);
      } catch (error) {
        console.warn("⚠️ Step 4 AI generation failed, falling back to manual structure construction");
        articleStructure = null;
      }
      if (!articleStructure) {
        console.log("🔧 Building fallback structure from enhanced headings");
        articleStructure = {
          h1: enhancedStructure.h1,
          introduction: `Discover everything you need to know about ${keyword}. This comprehensive guide covers all aspects of ${keyword} to help you make informed decisions. Learn about features, benefits, and best practices.`,
          sections: enhancedStructure.headings.map((heading) => ({
            h2: heading.h2,
            intro: `Learn about ${heading.h2.toLowerCase()} and how it relates to ${keyword}.`,
            subsections: (heading.h3 || []).map((h3) => ({
              h3,
              outline: `Detailed explanation of ${h3.toLowerCase()} including key points and practical examples.`
            }))
          })),
          faq: [
            {
              question: `What is ${keyword}?`,
              answerOutline: `${keyword} is explained with key features and benefits.`
            },
            {
              question: `How does ${keyword} work?`,
              answerOutline: `Explanation of how ${keyword} functions and its core mechanisms.`
            },
            {
              question: `What are the benefits of ${keyword}?`,
              answerOutline: `Key advantages and benefits of using ${keyword}.`
            }
          ],
          conclusion: `${keyword} offers powerful capabilities for users. Understanding its features and applications helps you maximize its potential.`,
          authorSection: "Expert insights on AI tools and technology from industry professionals."
        };
        console.log("✅ Fallback structure created with", articleStructure.sections.length, "sections");
      }
      console.log(`📝 Step 4 Complete: Full structure with ${articleStructure.sections.length} sections`);
      const stats4 = await apiKeyManager.getKeyStats();
      console.log(`📊 After Step 4: ${stats4.gemini.healthy}/${stats4.gemini.total} keys healthy, ${stats4.gemini.failed} failed`);
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const currentMonth = (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" });
      const isAIToolsArticle = determinedCategory === "AI Tools";
      let toolAnalysisData = null;
      if (isAIToolsArticle) {
        sendProgress(4.5, "Step 4.5: Analyzing AI Tool (Pricing, Pros/Cons, Workflow)...");
        console.log("🤖 STEP 4.5: AI Tool Deep Analysis - Pricing, Advantages/Disadvantages, Workflow");
        const toolAnalysisPrompt = `You are an expert AI tool analyst. Research and analyze "${keyword}" comprehensively using the latest information.

NEWS CONTEXT (Latest Information):
${newsContext.summary}

TRENDING TOPICS: ${newsContext.trends.join(", ")}

COMPETITOR CONTEXT:
${serpAnalysis.topResults.slice(0, 5).map((r, i) => `${i + 1}. ${r.title}`).join("\n")}

YOUR TASK: Provide a comprehensive analysis of "${keyword}" with the following information:

1. CURRENT PRICING (as of ${currentMonth} ${currentYear}):
   - Extract all pricing tiers (Free, Basic, Pro, Enterprise, etc.)
   - Include exact prices with currency
   - What features are included in each tier
   - Any free trials, discounts, or special offers
   - Annual vs monthly pricing if available

2. ADVANTAGES (list 6-8 specific advantages):
   - Real, specific benefits backed by user experiences or features
   - Unique features that make it stand out
   - Performance benefits
   - Ease of use aspects
   - Integration capabilities

3. DISADVANTAGES (list 4-6 honest limitations):
   - Real limitations or drawbacks
   - Common user complaints
   - Missing features
   - Pricing concerns
   - Learning curve issues

4. HOW IT WORKS (detailed step-by-step explanation):
   - Complete workflow from signup to usage
   - Key features and how to use them
   - Technical architecture or approach
   - Integration process if applicable
   - Best practices for getting started

RESPOND WITH JSON ONLY:
{
  "pricing": {
    "lastUpdated": "${currentMonth} ${currentYear}",
    "tiers": [
      {
        "name": "Plan name",
        "price": "Price with currency",
        "billing": "monthly/annually/one-time",
        "features": ["feature1", "feature2"]
      }
    ],
    "freeTrial": "Yes/No and duration",
    "moneyBackGuarantee": "Yes/No and terms"
  },
  "advantages": [
    {
      "title": "Advantage title",
      "description": "Detailed explanation"
    }
  ],
  "disadvantages": [
    {
      "title": "Disadvantage title",
      "description": "Detailed explanation"
    }
  ],
  "howItWorks": {
    "overview": "Brief overview of the tool's functionality",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Step title",
        "description": "Detailed explanation of this step"
      }
    ],
    "technicalDetails": "Technical approach or architecture",
    "bestPractices": ["practice1", "practice2"]
  }
}`;
        try {
          toolAnalysisData = await executeWithDedicatedKey(async (apiKey) => {
            const { jsonModel } = createModels(apiKey);
            const result = await jsonModel.generateContent(toolAnalysisPrompt);
            const rawText = result.response.text();
            console.log(`Step 4.5 raw response (first 400 chars):`, rawText.substring(0, 400));
            const text = extractJSON(rawText);
            const parsed = JSON.parse(text);
            if (!parsed.pricing || !parsed.advantages || !parsed.disadvantages || !parsed.howItWorks) {
              console.error("Step 4.5 validation failed. Structure:", Object.keys(parsed));
              throw new Error("Step 4.5 validation failed: Missing required analysis data");
            }
            console.log("✅ Step 4.5 Complete:", {
              pricingTiers: parsed.pricing.tiers?.length || 0,
              advantages: parsed.advantages.length,
              disadvantages: parsed.disadvantages.length,
              workflowSteps: parsed.howItWorks.steps?.length || 0
            });
            return parsed;
          }, "Step 4.5: Tool Analysis", 4, allGeminiKeys);
        } catch (error) {
          console.warn("⚠️ Step 4.5 failed, using fallback data:", error.message);
          toolAnalysisData = {
            pricing: {
              lastUpdated: `${currentMonth} ${currentYear}`,
              tiers: [{ name: "Contact for pricing", price: "Custom", billing: "Contact sales", features: [] }],
              freeTrial: "Check official website",
              moneyBackGuarantee: "Check official website"
            },
            advantages: [
              { title: "Powerful Features", description: `${keyword} offers comprehensive functionality` },
              { title: "User-Friendly", description: "Easy to use interface" }
            ],
            disadvantages: [
              { title: "Pricing", description: "May be expensive for some users" }
            ],
            howItWorks: {
              overview: `${keyword} is an AI-powered tool that helps users achieve their goals`,
              steps: [
                { stepNumber: 1, title: "Sign Up", description: "Create an account" },
                { stepNumber: 2, title: "Configure", description: "Set up your preferences" },
                { stepNumber: 3, title: "Use", description: "Start using the tool" }
              ],
              technicalDetails: "Powered by advanced AI technology",
              bestPractices: ["Start with free trial", "Explore all features"]
            }
          };
        }
      }
      await sleep(2e3);
      sendProgress(5, "Step 5: Writing Advanced SEO Content (E-E-A-T Optimized)...");
      console.log("✍️ STEP 5: Write Advanced SEO-Optimized Content with E-E-A-T");
      const sectionsCount = articleStructure.sections?.length || 0;
      console.log(`📝 Generating comprehensive article with ${sectionsCount} H2 sections`);
      const aiToolsInstructions = isAIToolsArticle && toolAnalysisData ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI TOOLS ARTICLE REQUIREMENTS (CRITICAL):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an AI TOOLS article. We have researched the tool and gathered the following information that you MUST incorporate into the article:

✅ PRICING INFORMATION (USE THIS DATA):
Last Updated: ${toolAnalysisData.pricing.lastUpdated}
${toolAnalysisData.pricing.tiers.map((tier) => `
   - ${tier.name}: ${tier.price} (${tier.billing})
     Features: ${tier.features.join(", ")}`).join("\n")}
   - Free Trial: ${toolAnalysisData.pricing.freeTrial}
   - Money-Back Guarantee: ${toolAnalysisData.pricing.moneyBackGuarantee}

   YOU MUST:
   - Create a dedicated "Pricing" section with this exact information
   - Present pricing tiers in a clear, organized format (table or structured list)
   - Include the "Last Updated" timestamp
   - Compare value across different tiers
   - Mention free trial and guarantee information

✅ ADVANTAGES (CREATE A "PROS" SECTION WITH THIS DATA):
${toolAnalysisData.advantages.map((adv, i) => `   ${i + 1}. ${adv.title}: ${adv.description}`).join("\n")}

   YOU MUST:
   - Create a clear "Advantages" or "Pros" section
   - Present these advantages in a table format or structured list
   - Expand on each point with examples where relevant
   - Be enthusiastic but honest

✅ DISADVANTAGES (CREATE A "CONS" SECTION WITH THIS DATA):
${toolAnalysisData.disadvantages.map((dis, i) => `   ${i + 1}. ${dis.title}: ${dis.description}`).join("\n")}

   YOU MUST:
   - Create a clear "Disadvantages" or "Cons" section
   - Present these disadvantages in a table format or structured list
   - Be honest and balanced
   - Suggest workarounds where applicable

✅ HOW IT WORKS (CREATE DETAILED WORKFLOW SECTION):
Overview: ${toolAnalysisData.howItWorks.overview}

Step-by-Step Process:
${toolAnalysisData.howItWorks.steps.map((step) => `   ${step.stepNumber}. ${step.title}: ${step.description}`).join("\n")}

Technical Details: ${toolAnalysisData.howItWorks.technicalDetails}

Best Practices: ${toolAnalysisData.howItWorks.bestPractices.join(", ")}

   YOU MUST:
   - Create a comprehensive "How It Works" section early in the article
   - Present the workflow in numbered steps
   - Include the technical details
   - Add the best practices section
   - Make it easy for beginners to understand

✅ TOOL LINK USAGE:
   ${affiliate_link ? `- Use this AFFILIATE LINK when mentioning the tool's website: ${affiliate_link}
   - Add the link naturally in multiple places: introduction, "How It Works" section, pricing section, and conclusion
   - Use call-to-action phrases like "Try ${keyword} here", "Get started with ${keyword}", "Visit ${keyword}"` : `- Research and use the tool's OFFICIAL WEBSITE link
   - Add the link naturally in multiple places throughout the article
   - Use call-to-action phrases`}

✅ COMMERCIAL ASPECTS (MANDATORY):
   - Explain the business model based on the pricing structure above
   - Identify target audience based on pricing tiers and features
   - Discuss ROI and value proposition
   - Mention integration capabilities
   - Address customer support options
   - Include refund policy information

✅ MARKETING FOCUS (HONEST & HELPFUL):
   - Write with marketing intent BUT remain honest and trustworthy
   - Use the advantages and disadvantages data to build credibility
   - Help readers make informed purchasing decisions
   - Compare with top 2-3 competitors fairly
   - Highlight unique selling points from the advantages
   - Address the disadvantages honestly but constructively
   - Provide clear next steps and recommendations
   - End with strong call-to-action

` : "";
      const step5Prompt = `Write a COMPREHENSIVE, SEO-optimized article that ranks in Google's top 3 results. This must be publication-ready content that passes AI detection and meets all 2024-2025 SEO standards.${aiToolsInstructions}

ARTICLE STRUCTURE:
${JSON.stringify(articleStructure, null, 2)}

ALL 100 SEMANTIC KEYWORDS (use naturally throughout):
${semanticData.semanticKeywords.join(", ")}

PEOPLE ALSO ASK QUESTIONS (answer these directly in content):
${serpAnalysis.peopleAlsoAsk.slice(0, 15).map((q, i) => `${i + 1}. ${q}`).join("\n")}

TARGET SPECIFICATIONS:
- Total word count: 2,500-3,500 words (comprehensive coverage)
- Flesch Reading Ease: 60-70 (college level, conversational)
- Keyword density: 0.5-2.5% for "${keyword}"
- AI detection score: Must pass as human-written (<20%)
- Current: ${currentMonth} ${currentYear}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTENT STRUCTURE REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ H1: Must clearly contain the main keyword "${keyword}", include synonym/semantic keywords, and be catchy and direct

✅ INTRODUCTION (EXACTLY 3 LINES):
   - Line 1: Start with a hook question or surprising statistic
   - Line 2: Direct answer to a crucial query regarding "${keyword}" very directly
   - Line 3: Include high density of semantic keywords and mention ${currentYear} for freshness
   - Target the keyword clearly in the introduction
   - Make it compelling and SEO-optimized

✅ CRITICAL H2 SECTION STRUCTURE (MANDATORY FORMAT):
   EVERY H2 SECTION MUST FOLLOW THIS EXACT PATTERN:
   
   1. H2 Title (from article structure)
   2. Simple 2-line introductory paragraph (exactly 2 lines)
   3. Then split into EXACTLY 2 H3 subsections
   
   Example structure:
   ## H2 Title Here
   
   This is line one of the introduction to this H2 section. This is line two that completes the introduction.
   
   ### H3 Subsection 1
   [Content for first subsection - 200-250 words]
   
   ### H3 Subsection 2
   [Content for second subsection - 200-250 words]
   
   MANDATORY REQUIREMENTS:
   - Every H2 gets a simple 2-line paragraph first
   - Then immediately split into 2 H3 subsections
   - NO exceptions to this structure
   - Use transition words between subsections

✅ EACH H3 SUBSECTION (200-250 words):
   - Start with direct answer or key point
   - Include real-world examples with SPECIFIC numbers/dates ("In ${currentYear}...", "X increased by 47%...")
   - Break into varied paragraph lengths:
     * Some paragraphs: 2 sentences
     * Some paragraphs: 4-5 sentences  
     * Some paragraphs: single impactful sentence
   - BULLET POINTS (SEO-OPTIMIZED FORMAT):
     * Use for features/benefits/key points lists
     * Each bullet: 1-2 complete sentences (not fragments)
     * Start each bullet with action verbs or descriptive words
     * Include keywords naturally within bullets
     * Limit to 4-7 bullets per list (optimal for readability & SEO)
     * Space bullets properly (1 blank line before/after list)
     * Keep bullets parallel in structure for Google's preference
   - Add numbered steps for processes ("How to X in 5 Steps:")
   - Use varied sentence structure:
     * Short punchy sentences (5-10 words)
     * Medium sentences (15-20 words)
     * Longer complex sentences (25+ words)
   - Include entity mentions (specific tools, brands, competitors)

✅ FAQ SECTION (answer ALL People Also Ask questions):
   - Each answer: 80-120 words
   - Start with direct answer in first 2 sentences
   - Provide examples or elaboration
   - Use conversational tone
   - Include statistics when relevant

✅ CONCLUSION:
   - Write a distinctive conclusion for the article
   - Summarize key points covered in the H2 sections
   - Include call-to-action or next steps
   - Mention future trends for ${currentYear}-${currentYear + 1}
   - End with memorable takeaway

✅ AUTHOR EXPERTISE SECTION:
   - Create "## About the Author" or "## Author Expertise" section
   - Add expertise credentials relevant to "${keyword}"
   - Mention testing/research done (E-E-A-T signal)
   - Include author name

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 E-E-A-T SIGNALS (CRITICAL FOR RANKING):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MUST include throughout content:
✓ First-hand experience: "We tested ${keyword} for 30 days and found...", "In our testing...", "After using X..."
✓ Specific testing dates: "tested in ${currentMonth} ${currentYear}", "updated ${currentMonth} ${currentYear}"
✓ Expert opinions: "According to industry experts...", "Research shows..."
✓ Statistics with numbers: "X increased by 47%", "85% of users reported...", "saves an average of 12 hours per week"
✓ Real case studies: "Company X achieved Y results using..."
✓ Tool/brand comparisons: mention 3-5 competing tools naturally
✓ Timestamps: "As of ${currentYear}...", "In ${currentMonth} ${currentYear}..."
✓ Specific examples: avoid generic statements - use actual numbers, dates, names

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 AI DETECTION BYPASS (WRITE LIKE A HUMAN):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BANNED AI PHRASES (never use):
❌ delve, delving, realm, landscape, navigating, tailored, seamlessly, revolutionize, game-changer, unlock, harness, leverage, embark, it's important to note, it's worth noting, in the ever-evolving, in today's fast-paced, robust, cutting-edge, holistic, paradigm shift

HUMAN WRITING TECHNIQUES (use extensively):
✓ Rhetorical questions: "But here's the real question...", "What does this mean for you?", "Sound too good to be true?"
✓ Personal opinions: "In my experience...", "I've found that...", "Personally, I prefer..."
✓ Conversational asides: "Here's the thing though...", "Let's be honest...", "Truth be told..."
✓ Contractions (use inconsistently): Mix "don't" and "do not", "it's" and "it is"
✓ Emotional language: surprisingly, frustratingly, exciting, disappointing, impressive, confusing
✓ Varied sentence starts: Don't start every sentence the same way
✓ Informal phrases: "kind of", "a bit", "pretty much", "sort of" (use sparingly)
✓ Direct reader address: "you'll notice", "you might think", "you can"
✓ Industry jargon: Use technical terms naturally without over-explaining
✓ Imperfect structure: Not every section needs perfect symmetry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 READABILITY OPTIMIZATION (FLESCH 60-70):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Use active voice: "You can achieve X" (not "X can be achieved")
✓ Short words over long: "use" not "utilize", "help" not "facilitate"
✓ Transition words: However, Moreover, Therefore, For instance, In contrast, Similarly, Consequently, Meanwhile
✓ BULLET POINT BEST PRACTICES (Google-preferred format):
  • Use HTML-friendly bullet markers (•, -, or *)
  • Each bullet point: Complete thought with subject and verb
  • Maintain parallel structure (all bullets same grammatical form)
  • Start with strong action verbs or key descriptors
  • Keep bullets concise: 10-25 words per bullet optimal
  • Include micro-keywords naturally in bullets
  • Add context before bullet lists (1-2 sentence intro)
  • Avoid single-bullet lists (minimum 3 bullets)
  • Maximum 7 bullets per list (prevents information overload)
✓ Numbered lists for steps/sequences
✓ Bold key terms occasionally (not excessively)
✓ Short paragraphs with white space
✓ Subheadings as questions when appropriate
✓ Mix of short and long sentences (avoid monotony)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 CONTENT ENHANCEMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Include where relevant:
• Comparison tables: "X vs Y" or "Pros and Cons of ${keyword}"
• Quick Answer boxes: Direct answers in 40-60 words for featured snippets
• Common Mistakes sections: "5 Mistakes to Avoid When..."
• Best Practices sections: "7 Best Practices for ${keyword}"
• Step-by-step guides: "How to [X] in 5 Steps"
• Before/After scenarios
• Cost/pricing breakdowns (when applicable)
• Beginner AND advanced tips
• Actionable next steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ FINAL INSTRUCTIONS - CRITICAL STRUCTURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write a COMPLETE, comprehensive article following this EXACT structure:

1. H1 Title: Clearly contain the main keyword, include synonyms, catchy and direct
2. Introduction: EXACTLY 3 lines long - answer crucial query directly with high keyword density
3. Body Content: 
   - 10 H2 sections (use all H2 titles from article structure)
   - EACH H2 section MUST have:
     a) Simple 2-line introductory paragraph
     b) Then split into EXACTLY 2 H3 subsections (use H3 titles from structure)
4. Conclusion: Distinctive conclusion summarizing key points
5. Author Expertise: Section at bottom with author credentials

MANDATORY REQUIREMENTS:
✓ Every H2 = 2-line intro + 2 H3 subsections (NO EXCEPTIONS)
✓ Uses ALL 100 semantic keywords organically
✓ Answers ALL People Also Ask questions within content
✓ Includes specific numbers, dates, statistics throughout
✓ Mentions ${currentYear} multiple times for freshness
✓ Reads like an expert human wrote it (varied, conversational, opinionated)
✓ Names specific tools/brands/competitors (entity SEO)
✓ Has varied paragraph and sentence lengths
✓ Passes AI detection as human-written

WRITE IN COMPLETE MARKDOWN FORMAT from H1 through Author Expertise Section. Make it engaging, authoritative, and ranking-worthy.`;
      const articleContent = await executeWithDedicatedKey(async (apiKey) => {
        const { model } = createModels(apiKey);
        console.log(`🔄 Step 5: Attempting with dedicated key (prompt length: ${step5Prompt.length} chars)`);
        let step5Result;
        try {
          step5Result = await model.generateContent(step5Prompt);
        } catch (genError) {
          console.error("Step 5 - Generation error:", genError.message);
          throw genError;
        }
        if (!step5Result || !step5Result.response) {
          console.error("Step 5 - No response object from API");
          throw new Error("No response from Gemini API");
        }
        const candidates = step5Result.response.candidates;
        if (candidates && candidates[0]?.finishReason) {
          const finishReason = candidates[0].finishReason;
          console.log(`Step 5 - Finish reason: ${finishReason}`);
          if (finishReason === "SAFETY") {
            console.error("Step 5 - Content blocked by safety filters");
            console.error("Safety ratings:", candidates[0].safetyRatings);
            throw new Error("Content blocked by safety filters");
          } else if (finishReason === "RECITATION") {
            console.error("Step 5 - Content flagged for recitation");
            throw new Error("Content flagged for recitation");
          } else if (finishReason !== "STOP") {
            console.warn("Step 5 - Unusual finish reason:", finishReason);
          }
        }
        let rawResponse;
        try {
          rawResponse = step5Result.response.text();
        } catch (textError) {
          console.error("Step 5 - Error getting text:", textError.message);
          throw new Error("Failed to extract text from response");
        }
        console.log(`Step 5 - Raw response length: ${rawResponse?.length || 0} chars`);
        if (!rawResponse || rawResponse.length < 100) {
          console.error("Step 5 - Response too short or empty");
          throw new Error("AI returned empty or very short response");
        }
        const cleaned = rawResponse.replace(/```markdown\n?/gi, "").replace(/```\n?/g, "").trim();
        console.log(`Step 5 - Cleaned content length: ${cleaned.length} chars`);
        if (!cleaned || cleaned.length < 500) {
          console.error("Step 5 - Article content too short after cleaning");
          throw new Error("Article content too short or empty");
        }
        console.log(`✅ Step 5 successful - ${cleaned.length} characters generated`);
        return cleaned;
      }, "Step 5: Content Writing", 5, allGeminiKeys, 5);
      console.log("✍️ Step 5 Complete: Article content written");
      sendProgress(6, "Step 6: Creating Tables...");
      console.log("📊 STEP 6: Create Tables");
      let tablesData = {};
      let pricingTableMd = "";
      let prosConsTableMd = "";
      if (isAIToolsArticle && toolAnalysisData) {
        console.log("📊 Creating AI Tools specific tables: Pricing + Pros/Cons");
        pricingTableMd = `

## 💰 ${keyword} Pricing

*Last Updated: ${toolAnalysisData.pricing.lastUpdated}*

| Plan | Price | Billing | Key Features |
| --- | --- | --- | --- |
${toolAnalysisData.pricing.tiers.map(
          (tier) => `| **${tier.name}** | ${tier.price} | ${tier.billing} | ${tier.features.length > 0 ? tier.features.slice(0, 3).join(", ") : "N/A"} |`
        ).join("\n")}

**Free Trial:** ${toolAnalysisData.pricing.freeTrial}

**Money-Back Guarantee:** ${toolAnalysisData.pricing.moneyBackGuarantee}

`;
        const maxRows = Math.max(toolAnalysisData.advantages.length, toolAnalysisData.disadvantages.length);
        const prosConsRows = [];
        for (let i = 0; i < maxRows; i++) {
          const pro = toolAnalysisData.advantages[i] ? `✅ **${toolAnalysisData.advantages[i].title}**: ${toolAnalysisData.advantages[i].description}` : "";
          const con = toolAnalysisData.disadvantages[i] ? `❌ **${toolAnalysisData.disadvantages[i].title}**: ${toolAnalysisData.disadvantages[i].description}` : "";
          prosConsRows.push(`| ${pro} | ${con} |`);
        }
        prosConsTableMd = `

## ⚖️ ${keyword} Pros and Cons

| ✅ Advantages | ❌ Disadvantages |
| --- | --- |
${prosConsRows.join("\n")}

`;
        tablesData.pricingTable = {
          title: `${keyword} Pricing`,
          headers: ["Plan", "Price", "Billing", "Key Features"],
          rows: toolAnalysisData.pricing.tiers.map((tier) => [
            tier.name,
            tier.price,
            tier.billing,
            tier.features.slice(0, 3).join(", ") || "N/A"
          ])
        };
        tablesData.prosConsTable = {
          title: `${keyword} Pros and Cons`,
          headers: ["Advantages", "Disadvantages"],
          rows: prosConsRows.map((row) => {
            const cells = row.split("|").filter((c) => c.trim());
            return cells;
          })
        };
        console.log("✅ AI Tools tables created:", {
          pricingTiers: toolAnalysisData.pricing.tiers.length,
          prosConsRows: prosConsRows.length
        });
      }
      const step6Prompt = `Analyze the article and create comparison and summary tables.

ARTICLE CONTENT (first 3000 chars):
${articleContent.slice(0, 3e3)}

KEYWORD: "${keyword}"

Create:
1. One comparison table comparing key features/options related to "${keyword}"
2. One summary table highlighting key points

RESPOND WITH JSON:
{
  "comparisonTable": {
    "title": "Table title",
    "headers": ["Header1", "Header2", "Header3"],
    "rows": [
      ["Row1Col1", "Row1Col2", "Row1Col3"]
    ]
  },
  "summaryTable": {
    "title": "Summary table title",
    "headers": ["Aspect", "Details"],
    "rows": [
      ["Aspect1", "Details1"]
    ]
  },
  "comparisonTablePosition": "After which H2 section",
  "summaryTablePosition": "After which H2 section"
}`;
      const generalTablesData = await executeWithDedicatedKey(async (apiKey) => {
        const { jsonModel } = createModels(apiKey);
        const step6Result = await jsonModel.generateContent(step6Prompt);
        const rawText = step6Result.response.text();
        console.log(`Step 6 raw response (first 400 chars):`, rawText.substring(0, 400));
        const tablesJson = extractJSON(rawText);
        const parsed = JSON.parse(tablesJson);
        if (!parsed.comparisonTable || !parsed.summaryTable) {
          console.error("Step 6 validation failed. Data:", parsed);
          throw new Error("Step 6 validation failed: Missing table data");
        }
        console.log("Step 6 general tables parsed successfully:", {
          comparisonTable: parsed.comparisonTable.title,
          summaryTable: parsed.summaryTable.title
        });
        return parsed;
      }, "Step 6: Tables", 6, allGeminiKeys);
      tablesData.comparisonTable = generalTablesData.comparisonTable;
      tablesData.summaryTable = generalTablesData.summaryTable;
      const comparisonTableMd = `

### ${generalTablesData.comparisonTable.title}

| ${generalTablesData.comparisonTable.headers.join(" | ")} |
| ${generalTablesData.comparisonTable.headers.map(() => "---").join(" | ")} |
${generalTablesData.comparisonTable.rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}

`;
      const summaryTableMd = `

### ${generalTablesData.summaryTable.title}

| ${generalTablesData.summaryTable.headers.join(" | ")} |
| ${generalTablesData.summaryTable.headers.map(() => "---").join(" | ")} |
${generalTablesData.summaryTable.rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}

`;
      console.log("📊 Step 6 Complete: Tables created");
      sendProgress(7, "Step 7: Adding External Sources & Citations...");
      console.log("🔗 STEP 7: Add External Source Links");
      const step7Prompt = `Analyze the article and suggest external authoritative sources with working links.

ARTICLE TOPIC: "${keyword}"
NEWS ARTICLES:
${newsContext.articles.slice(0, 5).map((a) => `${a.title} - ${a.url} (${a.source})`).join("\n")}

Suggest 5-7 external authoritative sources (Wikipedia, official docs, research papers, industry publications) related to "${keyword}".

RESPOND WITH JSON:
{
  "sources": [
    {
      "text": "Link anchor text",
      "url": "https://example.com",
      "position": "After which section/paragraph to insert"
    }
  ]
}`;
      const sourcesData = await executeWithDedicatedKey(async (apiKey) => {
        const { jsonModel } = createModels(apiKey);
        const step7Result = await jsonModel.generateContent(step7Prompt);
        const rawText = step7Result.response.text();
        console.log(`Step 7 raw response (first 400 chars):`, rawText.substring(0, 400));
        const sourcesJson = extractJSON(rawText);
        const parsed = JSON.parse(sourcesJson);
        if (!parsed.sources || !Array.isArray(parsed.sources)) {
          console.error("Step 7 validation failed. Data:", parsed);
          throw new Error("Step 7 validation failed: Missing sources array");
        }
        return parsed;
      }, "Step 7: External Sources", 8, allGeminiKeys);
      let finalArticle = articleContent;
      const h2Sections = finalArticle.split(/\n## /);
      if (isAIToolsArticle && toolAnalysisData) {
        if (h2Sections.length >= 4) {
          const firstQuarter = Math.floor(h2Sections.length * 0.25);
          const midPoint = Math.floor(h2Sections.length / 2) + 1;
          const threeQuarterPoint = Math.floor(h2Sections.length * 0.75) + 2;
          const rebuiltSections = [];
          for (let i = 0; i < h2Sections.length; i++) {
            rebuiltSections.push(h2Sections[i]);
            if (i === firstQuarter) {
              rebuiltSections.push(pricingTableMd.trim().replace(/^## /, "") + "\n\n");
            }
            if (i === midPoint) {
              rebuiltSections.push(prosConsTableMd.trim().replace(/^## /, "") + "\n\n");
            }
            if (i === threeQuarterPoint) {
              rebuiltSections.push(comparisonTableMd.trim().replace(/^## /, "") + "\n\n");
            }
          }
          finalArticle = rebuiltSections.join("\n## ");
          console.log("📊 AI Tools tables inserted: Pricing at", firstQuarter, ", Pros/Cons at", midPoint, ", Comparison at", threeQuarterPoint);
        } else {
          finalArticle += "\n\n" + pricingTableMd + "\n\n" + prosConsTableMd + "\n\n" + comparisonTableMd + "\n\n" + summaryTableMd;
          console.log("📊 AI Tools tables appended to end (not enough sections)");
        }
      } else {
        if (h2Sections.length >= 3) {
          const midPoint = Math.floor(h2Sections.length / 2);
          const threeQuarterPoint = Math.floor(h2Sections.length * 0.75) + 1;
          const rebuiltSections = [];
          for (let i = 0; i < h2Sections.length; i++) {
            rebuiltSections.push(h2Sections[i]);
            if (i === midPoint) {
              rebuiltSections.push(comparisonTableMd.trim().replace(/^## /, "") + "\n\n");
            }
            if (i === threeQuarterPoint) {
              rebuiltSections.push(summaryTableMd.trim().replace(/^## /, "") + "\n\n");
            }
          }
          finalArticle = rebuiltSections.join("\n## ");
          console.log("📊 Tables inserted: Comparison at section", midPoint, "and Summary at section", threeQuarterPoint);
        } else {
          finalArticle += "\n\n" + comparisonTableMd + "\n\n" + summaryTableMd;
          console.log("📊 Tables appended to end (not enough sections)");
        }
      }
      sourcesData.sources.forEach((source) => {
        finalArticle += `

Source: [${source.text}](${source.url})`;
      });
      console.log("🔗 Step 7 Complete: External sources added");
      sendProgress(8, "Step 8: Generating Three Images Using Pollinations AI...");
      console.log("🎨 STEP 8: Generate Three Article Images with Pollinations AI (100% Free)");
      const titleMatch = finalArticle.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : keyword;
      console.log("Attempting to generate 3 images for title:", title);
      let heroImage = null;
      let middleImage = null;
      let bottomImage = null;
      try {
        const heroPrompt = createImagePrompt(title, "hero");
        console.log("Generating hero image with Pollinations AI...");
        console.log("Hero prompt:", heroPrompt.substring(0, 150) + "...");
        heroImage = await generateFluxImage(heroPrompt, {
          width: 1024,
          height: 768,
          nologo: true,
          enhance: true
        });
        if (heroImage) {
          console.log("✅ Hero image generated successfully:", heroImage.url);
        } else {
          console.warn("⚠️ Hero image generation returned null - API call may have failed");
        }
      } catch (error) {
        console.error("❌ Hero image generation error:", error);
        if (error.stack) {
          console.error("Error stack:", error.stack);
        }
        heroImage = null;
      }
      try {
        const middlePrompt = createImagePrompt(title, "middle");
        console.log("Generating middle image with Pollinations AI...");
        console.log("Middle prompt:", middlePrompt.substring(0, 150) + "...");
        middleImage = await generateFluxImage(middlePrompt, {
          width: 1024,
          height: 768,
          nologo: true,
          enhance: true
        });
        if (middleImage) {
          console.log("✅ Middle image generated successfully:", middleImage.url);
        } else {
          console.warn("⚠️ Middle image generation returned null - API call may have failed");
        }
      } catch (error) {
        console.error("❌ Middle image generation error:", error);
        if (error.stack) {
          console.error("Error stack:", error.stack);
        }
        middleImage = null;
      }
      if (heroImage) {
        const heroImageMarkdown = `

![${title}](${heroImage.url})

`;
        const introEndIndex = finalArticle.indexOf("\n##");
        if (introEndIndex > 0) {
          finalArticle = finalArticle.slice(0, introEndIndex) + heroImageMarkdown + finalArticle.slice(introEndIndex);
          console.log("🖼️ Hero image inserted after introduction");
        } else {
          console.warn("⚠️ Could not find introduction end, hero image not inserted");
        }
      }
      if (middleImage) {
        const middleImageMarkdown = `

![${title} illustration](${middleImage.url})

`;
        const h2Sections2 = finalArticle.split(/\n## /);
        if (h2Sections2.length >= 3) {
          const midPoint = Math.floor(h2Sections2.length / 2);
          h2Sections2.splice(midPoint, 0, middleImageMarkdown.trim() + "\n\n## ");
          finalArticle = h2Sections2.join("\n## ");
          console.log("🖼️ Middle image inserted at section", midPoint);
        } else {
          console.warn("⚠️ Not enough sections to insert middle image");
        }
      }
      try {
        const bottomPrompt = createImagePrompt(title, "supporting");
        console.log("Generating bottom image with Pollinations AI...");
        console.log("Bottom prompt:", bottomPrompt.substring(0, 150) + "...");
        bottomImage = await generateFluxImage(bottomPrompt, {
          width: 1024,
          height: 768,
          nologo: true,
          enhance: true
        });
        if (bottomImage) {
          console.log("✅ Bottom image generated successfully:", bottomImage.url);
        } else {
          console.warn("⚠️ Bottom image generation returned null - API call may have failed");
        }
      } catch (error) {
        console.error("❌ Bottom image generation error:", error);
        if (error.stack) {
          console.error("Error stack:", error.stack);
        }
        bottomImage = null;
      }
      if (bottomImage) {
        const bottomImageMarkdown = `

![${title} guide](${bottomImage.url})

`;
        const h2Sections2 = finalArticle.split(/\n## /);
        if (h2Sections2.length >= 5) {
          const bottomPoint = Math.floor(h2Sections2.length * 0.75);
          h2Sections2.splice(bottomPoint, 0, bottomImageMarkdown.trim() + "\n\n## ");
          finalArticle = h2Sections2.join("\n## ");
          console.log("🖼️ Bottom image inserted at section", bottomPoint);
        } else {
          console.warn("⚠️ Not enough sections to insert bottom image");
        }
      }
      const imageCount = [heroImage, middleImage, bottomImage].filter(Boolean).length;
      console.log(`🎨 Step 8 Complete: ${imageCount}/3 images generated and inserted`);
      let contentWithoutTitle = finalArticle.replace(/^#\s+.+$/m, "").trim();
      const faqItems = articleStructure.faq?.map((item) => ({
        question: item.question,
        answer: item.answerOutline || item.answer || ""
      })) || [];
      const wordCount = contentWithoutTitle.split(/\s+/).filter((word) => word.length > 0).length;
      sendProgress(10, "Step 10: Generating Meta Tags, Slug & Publishing...");
      console.log("🎯 STEP 10: Generate All Meta Tags, Slug & Publish");
      const step10Prompt = `Create comprehensive SEO meta tags and slug for this article.

TITLE: ${title}
KEYWORD: "${keyword}"
INTRODUCTION: ${articleStructure.introduction}

Create optimized meta tags and slug:
- Meta Title (55-60 chars, include keyword)
- Meta Description (150-160 chars, compelling, include keyword)
- Meta Keywords (10-15 keywords)
- Canonical Tag: index, follow
- Canonical URL: Will be generated from slug
- Robots Meta Tag: index, follow
- OG URL: Will be generated from slug
- Twitter Card: summary_large_image
- Viewport: width=device-width, initial-scale=1.0
- OG Title (engaging social media title)
- OG Description (compelling social description)
- OG Image: Will use hero image
- Slug: Direct, concise URL slug containing ONLY the keyword (e.g., "ai-image-generator", "chatgpt-alternative")

IMPORTANT: The slug must be:
- Direct and concise
- Contain only the main keyword
- Use hyphens to separate words
- All lowercase
- No extra words or descriptors

RESPOND WITH JSON ONLY:
{
  "metaTitle": "SEO optimized title",
  "metaDescription": "Compelling meta description",
  "metaKeywords": ["keyword1", "keyword2"],
  "ogTitle": "Social media title",
  "ogDescription": "Social media description",
  "twitterTitle": "Twitter card title",
  "twitterDescription": "Twitter description",
  "robotsMeta": "index, follow",
  "slug": "keyword-slug"
}`;
      const metadata = await executeWithDedicatedKey(async (apiKey) => {
        const { jsonModel } = createModels(apiKey);
        const step10Result = await jsonModel.generateContent(step10Prompt);
        const rawText = step10Result.response.text();
        console.log(`Step 10 raw response (first 400 chars):`, rawText.substring(0, 400));
        const metaTagsJson = extractJSON(rawText);
        const parsed = JSON.parse(metaTagsJson);
        if (!parsed.metaTitle || !parsed.metaDescription || !parsed.slug) {
          console.error("Step 10 validation failed. Data:", parsed);
          throw new Error("Step 10 validation failed: Missing meta tags or slug");
        }
        console.log("✅ Meta tags and slug generated:", {
          metaTitle: parsed.metaTitle?.substring(0, 60) + "...",
          metaDescription: parsed.metaDescription?.substring(0, 80) + "...",
          keywordsCount: parsed.metaKeywords?.length || 0,
          slug: parsed.slug,
          hasOgTags: !!(parsed.ogTitle && parsed.ogDescription),
          hasTwitterTags: !!(parsed.twitterTitle && parsed.twitterDescription)
        });
        return parsed;
      }, "Step 10: Meta Tags & Slug", 7, allGeminiKeys);
      const slug = metadata.slug;
      const canonicalUrl = `${process.env.SITE_URL || "https://aitoolsinsights.com"}/${slug}`;
      console.log("✅ Slug generated:", slug);
      console.log("✅ Canonical URL:", canonicalUrl);
      sendProgress(9, "Step 9: Generating JSON-LD Schema Markup...");
      console.log("🏷️ STEP 9: Generate Comprehensive JSON-LD Schemas");
      console.log("Generating schemas with params:", {
        title: title.substring(0, 50),
        hasImage: !!heroImage?.url,
        contentLength: contentWithoutTitle.length,
        wordCount,
        faqCount: faqItems.length,
        category: determinedCategory,
        semanticKeywordsCount: semanticData.semanticKeywords.length
      });
      const { schemas, schemaHtml } = generateAllSchemas({
        title,
        description: articleStructure.introduction,
        markdown: contentWithoutTitle,
        imageUrl: heroImage?.url || void 0,
        url: canonicalUrl,
        author: "AI Tools Insights Team",
        faqItems,
        category: determinedCategory,
        keywords: semanticData.semanticKeywords.slice(0, 20),
        wordCount
      });
      console.log(`✅ Step 9 Complete: Generated ${schemas.length} schema types:`, schemas.map((s) => s["@type"]).join(", "));
      console.log("Schema HTML length:", schemaHtml.length, "characters");
      marked.setOptions({
        gfm: true,
        breaks: true
      });
      const html = await marked(contentWithoutTitle);
      const qualityScore = analyzeContentQuality(contentWithoutTitle, html, keyword);
      console.log(`📊 Quality Score: ${qualityScore.overall}/100`);
      console.log(`📋 Metrics:`, {
        wordCount: qualityScore.wordCount,
        headings: qualityScore.headingCount,
        paragraphs: qualityScore.paragraphCount,
        readability: qualityScore.readabilityScore.toFixed(1),
        aiDetection: qualityScore.aiDetectionScore,
        images: qualityScore.imageCount,
        links: qualityScore.linkCount
      });
      console.log(`
✨ GENERATION COMPLETE!`);
      console.log(`📊 Word Count: ${qualityScore.wordCount}`);
      console.log(`🎯 Quality Score: ${qualityScore.overall}/100`);
      console.log(`📑 Schemas: ${schemas.length} types`);
      console.log(`🔗 External Sources: ${sourcesData.sources.length}`);
      sendComplete({
        title,
        category: determinedCategory,
        subcategory: category === "blog" ? subcategory : null,
        html,
        content: contentWithoutTitle,
        excerpt: articleStructure.introduction,
        slug,
        canonicalUrl,
        metaTitle: metadata.metaTitle,
        metaDescription: metadata.metaDescription,
        keywords: metadata.metaKeywords,
        ogTitle: metadata.ogTitle,
        ogDescription: metadata.ogDescription,
        ogImage: heroImage?.url || null,
        ogUrl: canonicalUrl,
        twitterCard: "summary_large_image",
        twitterTitle: metadata.twitterTitle,
        twitterDescription: metadata.twitterDescription,
        twitterImage: heroImage?.url || null,
        robotsMeta: metadata.robotsMeta,
        viewport: "width=device-width, initial-scale=1.0",
        featuredImage: heroImage?.url || null,
        author: "AI Tools Insights Team",
        authorExperience: articleStructure.authorSection,
        qualityScore: qualityScore.overall,
        qualityMetrics: {
          wordCount: qualityScore.wordCount,
          headingCount: qualityScore.headingCount,
          h2Count: step1Result.headings.length,
          h3Count: step1Result.headings.length * 3,
          semanticKeywordsUsed: semanticData.semanticKeywords.length,
          externalSources: sourcesData.sources.length,
          readabilityScore: qualityScore.readabilityScore,
          aiDetectionScore: qualityScore.aiDetectionScore,
          issues: qualityScore.issues,
          recommendations: qualityScore.recommendations
        },
        schemaMarkup: schemaHtml,
        schemas,
        tables: {
          comparison: tablesData.comparisonTable,
          summary: tablesData.summaryTable,
          ...isAIToolsArticle && toolAnalysisData ? {
            pricing: tablesData.pricingTable,
            prosCons: tablesData.prosConsTable
          } : {}
        },
        externalSources: sourcesData.sources,
        ...isAIToolsArticle && toolAnalysisData ? {
          affiliateLink: affiliate_link || null,
          aiToolData: {
            pricing: toolAnalysisData.pricing,
            advantages: toolAnalysisData.advantages,
            disadvantages: toolAnalysisData.disadvantages,
            howItWorks: toolAnalysisData.howItWorks
          }
        } : {}
      });
    } catch (error) {
      console.error("Auto-generation error:", error);
      let errorMessage = "Auto-generation failed";
      if (error instanceof Error) {
        if (error.message.includes("JSON")) {
          errorMessage = "AI response formatting error. Please try again.";
        } else if (error.message.includes("quota") || error.message?.includes("429") || error.message.includes("RESOURCE_EXHAUSTED")) {
          errorMessage = "All API keys have exceeded quota. Please wait a few minutes or add more keys in Settings.";
        } else if (error.message.includes("trying all available API keys")) {
          errorMessage = "All API keys failed. This could be due to rate limits or quota. Please wait 5 minutes and try again, or add more API keys in Settings.";
        } else if (error.message.includes("API key") && error.message.includes("Invalid")) {
          errorMessage = "One or more API keys appear invalid. Please verify your keys in Settings.";
        } else {
          errorMessage = error.message;
        }
      }
      sendError(errorMessage);
    }
  })();
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
