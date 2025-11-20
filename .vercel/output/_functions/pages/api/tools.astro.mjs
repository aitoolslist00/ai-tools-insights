import { r as requireAuth } from '../../chunks/auth_gn-l6IWQ.mjs';
import { d as db } from '../../chunks/db_DT4W4eUV.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const data = await request.json();
    const {
      name,
      slug,
      description,
      long_description,
      website_url,
      logo_url,
      affiliate_link,
      category,
      pricing,
      features,
      meta_title,
      meta_description,
      keywords,
      status,
      published_at
    } = data;
    if (!name || !slug || !description) {
      return new Response(JSON.stringify({ error: "Name, slug, and description are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const stmt = db.prepare(`
      INSERT INTO ai_tools (
        name, slug, description, long_description, website_url, logo_url, affiliate_link,
        category, pricing, features, meta_title, meta_description, keywords, status, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      name,
      slug,
      description,
      long_description || null,
      website_url || null,
      logo_url || null,
      affiliate_link || null,
      category || null,
      pricing || null,
      features || null,
      meta_title || null,
      meta_description || null,
      keywords || null,
      status || "draft",
      published_at || null
    );
    return new Response(JSON.stringify({ success: true, id: result.lastInsertRowid }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Create error:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({ error: "A tool with this slug already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: "Create failed" }), {
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
