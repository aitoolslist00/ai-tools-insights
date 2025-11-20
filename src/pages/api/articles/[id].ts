import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';
import { db } from '../../../lib/db';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    await requireAuth(request);

    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Article ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
    const article = await stmt.get(id);

    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch article' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    await requireAuth(request);

    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Article ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { title, slug, content, excerpt, category, subcategory, featured_image, meta_title, meta_description, keywords, status } = data;

    const stmt = db.prepare(`
      UPDATE articles 
      SET title = ?, slug = ?, content = ?, excerpt = ?, category = ?, subcategory = ?, 
          featured_image = ?, meta_title = ?, meta_description = ?, keywords = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    await stmt.run(title, slug, content, excerpt, category, subcategory || null, featured_image || null, 
             meta_title || null, meta_description || null, keywords || null, status || 'draft', id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Update error:', error);
    return new Response(JSON.stringify({ error: 'Update failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    await requireAuth(request);

    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Article ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
    await stmt.run(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ error: 'Delete failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
