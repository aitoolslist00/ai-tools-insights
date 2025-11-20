import { r as requireAuth } from '../../../chunks/auth_DteQtQsy.mjs';
import { d as db } from '../../../chunks/db_CbTj92s0.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params, request }) => {
  try {
    await requireAuth(request);
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Tool ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const stmt = db.prepare("SELECT * FROM ai_tools WHERE id = ?");
    const tool = await stmt.get(id);
    if (!tool) {
      return new Response(JSON.stringify({ error: "Tool not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(tool), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Get error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tool" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async ({ params, request }) => {
  try {
    await requireAuth(request);
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Tool ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
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
      status
    } = data;
    const stmt = db.prepare(`
      UPDATE ai_tools 
      SET name = ?, slug = ?, description = ?, long_description = ?, website_url = ?, logo_url = ?,
          affiliate_link = ?, category = ?, pricing = ?, features = ?, meta_title = ?, meta_description = ?, 
          keywords = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    await stmt.run(
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
      id
    );
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Update error:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({ error: "A tool with this slug already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params, request }) => {
  try {
    await requireAuth(request);
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Tool ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const stmt = db.prepare("DELETE FROM ai_tools WHERE id = ?");
    await stmt.run(id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
