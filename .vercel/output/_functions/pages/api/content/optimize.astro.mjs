import { r as requireAuth } from '../../../chunks/auth_DteQtQsy.mjs';
import { g as generateSEO, a as generateSlug } from '../../../chunks/seo_rSiKTtUh.mjs';
import { marked } from 'marked';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const { title, category, subcategory, markdown } = await request.json();
    if (!title || !category || !markdown) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    marked.setOptions({
      gfm: true,
      breaks: true
    });
    const html = await marked(markdown);
    const seo = generateSEO({ title, content: html });
    const slug = generateSlug(title);
    const excerpt = markdown.split("\n\n")[1]?.slice(0, 155) || "";
    return new Response(JSON.stringify({
      title,
      category: category === "blog" ? subcategory || "Blog" : "AI Tools",
      subcategory: category === "blog" ? subcategory : null,
      html,
      content: markdown,
      excerpt,
      slug,
      metaTitle: seo.title,
      metaDescription: seo.description,
      keywords: seo.keywords
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Optimization error:", error);
    return new Response(JSON.stringify({ error: "Optimization failed" }), {
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
