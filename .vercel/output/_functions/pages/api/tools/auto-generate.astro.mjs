import { r as requireAuth } from '../../../chunks/auth_DteQtQsy.mjs';
import { a as generateSlug } from '../../../chunks/seo_rSiKTtUh.mjs';
import { g as getSetting } from '../../../chunks/db_CbTj92s0.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const { tool_keyword, affiliate_link } = await request.json();
    if (!tool_keyword) {
      return new Response(JSON.stringify({ error: "Tool keyword is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const geminiApiKey = await getSetting("GEMINI_API_KEY") || process.env.GEMINI_API_KEY;
    const newsApiKey = await getSetting("NEWSAPI_KEY") || process.env.NEWSAPI_KEY;
    if (!geminiApiKey) {
      return new Response(JSON.stringify({
        error: "Gemini API key not configured. Please add your API key in Settings."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    let newsContext = "";
    if (newsApiKey) {
      try {
        const searchQuery = `${tool_keyword} AI tool`;
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${newsApiKey}`
        );
        const newsData = await newsResponse.json();
        if (newsData.articles && newsData.articles.length > 0) {
          newsContext = newsData.articles.map((article) => `- ${article.title}: ${article.description}`).join("\n");
        }
      } catch (error) {
        console.warn("NewsAPI fetch failed:", error);
      }
    }
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an expert AI tools researcher and reviewer for "AI Tools Insights" website. Research and create a comprehensive listing for an AI tool.

Tool to research: "${tool_keyword}"

${newsContext ? `Latest News Context:
${newsContext}
` : ""}

Your task: Generate complete, accurate information about this AI tool based on your knowledge and the news context provided.

Provide a JSON response with the following structure:
{
  "name": "Official tool name (e.g., 'ChatGPT', 'Midjourney')",
  "website_url": "Official website URL (use https://)",
  "description": "Compelling 1-2 sentence description (max 160 characters)",
  "long_description": "Detailed markdown-formatted description (400-600 words) covering:
## Overview
- What the tool does
- Key capabilities
- Target users

## Key Benefits
- Main advantages
- Use cases

## How It Works
- Technical approach
- User experience

Use proper markdown with ## headings, bullet points, and well-structured paragraphs",
  "features": "Comma-separated list of 8-12 key features (e.g., 'Natural language processing, Multi-language support, API access, Real-time collaboration')",
  "category": "Primary category (e.g., 'Writing', 'Image Generation', 'Coding', 'Productivity', 'Customer Support', 'Marketing', 'Design')",
  "pricing": "Pricing model (e.g., 'Free', 'Freemium - Free with paid upgrades', 'Paid - Starting at $X/month', 'Enterprise - Custom pricing')",
  "meta_title": "SEO-optimized title (50-60 characters) including tool name and key benefit",
  "meta_description": "SEO-optimized description (150-160 characters) highlighting main value proposition",
  "keywords": "Comma-separated relevant SEO keywords (10-15 keywords including tool name, category, features)"
}

IMPORTANT GUIDELINES:
- Be accurate and factual based on your knowledge of this tool
- If you don't have information, make reasonable inferences from the tool name and news context
- Ensure pricing is realistic and up-to-date
- Features should be specific and valuable
- Long description should be well-structured with markdown headings and paragraphs
- Keywords should be relevant for SEO

Respond ONLY with valid JSON, no additional text.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiResponse = response.text();
    aiResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let parsedData;
    try {
      parsedData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("AI Response:", aiResponse);
      throw new Error("Failed to parse AI response");
    }
    marked.setOptions({
      gfm: true,
      breaks: true
    });
    const longDescriptionHtml = await marked(parsedData.long_description || "");
    const slug = generateSlug(parsedData.name);
    return new Response(JSON.stringify({
      name: parsedData.name,
      slug,
      description: parsedData.description,
      long_description: longDescriptionHtml,
      website_url: parsedData.website_url,
      affiliate_link: affiliate_link || null,
      category: parsedData.category,
      pricing: parsedData.pricing,
      features: parsedData.features,
      meta_title: parsedData.meta_title,
      meta_description: parsedData.meta_description,
      keywords: parsedData.keywords,
      status: "draft"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Auto-generation error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Auto-generation failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
