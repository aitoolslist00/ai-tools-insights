import { r as requireAuth } from '../../../chunks/auth_Cnb58Uj3.mjs';
import { a as generateSlug } from '../../../chunks/seo_rSiKTtUh.mjs';
import { g as getSetting } from '../../../chunks/db_Cj4I5Obi.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const { tool_name, website_url, basic_description, category, pricing, affiliate_link } = await request.json();
    if (!tool_name || !website_url || !basic_description) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const geminiApiKey = await getSetting("GEMINI_API_KEY") || process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return new Response(JSON.stringify({
        error: "Gemini API key not configured. Please add your API key in Settings."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an expert AI tools reviewer analyzing and optimizing information about AI tools for the website "AI Tools Insights".

Tool Information:
- Name: ${tool_name}
- Website: ${website_url}
- Basic Description: ${basic_description}
${category ? `- Category: ${category}` : ""}
${pricing ? `- Pricing: ${pricing}` : ""}

Your task: Create optimized, comprehensive information about this AI tool.

Provide a JSON response with the following structure:
{
  "description": "A concise, compelling 1-2 sentence description (max 160 characters)",
  "long_description": "A detailed, markdown-formatted description (300-500 words) covering:
- What the tool does
- Key capabilities
- Who should use it
- Main benefits
Use proper markdown with ## headings, bullet points, and paragraph breaks",
  "features": "Comma-separated list of 5-10 key features (e.g., 'Natural language processing, Multi-language support, API access')",
  "category": "${category || "Suggest an appropriate category (e.g., Writing, Image Generation, Coding, Productivity, etc.)"}",
  "pricing": "${pricing || "Analyze and suggest pricing model (e.g., Free, Freemium, Paid, Subscription)"}",
  "meta_title": "SEO-optimized title (50-60 characters) including the tool name",
  "meta_description": "SEO-optimized description (150-160 characters) highlighting key value",
  "keywords": "Comma-separated relevant keywords (8-12 keywords)"
}

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
    const slug = generateSlug(tool_name);
    return new Response(JSON.stringify({
      name: tool_name,
      slug,
      description: parsedData.description,
      long_description: longDescriptionHtml,
      website_url,
      affiliate_link: affiliate_link || null,
      category: parsedData.category || category,
      pricing: parsedData.pricing || pricing,
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
    console.error("Optimization error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Optimization failed"
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
