import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';
import { generateSEO, generateSlug } from '../../../lib/seo';
import { marked } from 'marked';

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireAuth(request);

    const { title, category, subcategory, markdown } = await request.json();

    if (!title || !category || !markdown) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    
    const html = await marked(markdown);
    
    const seo = generateSEO({ title, content: html });
    const slug = generateSlug(title);

    const excerpt = markdown.split('\n\n')[1]?.slice(0, 155) || '';

    return new Response(JSON.stringify({
      title,
      category: category === 'blog' ? (subcategory || 'Blog') : 'AI Tools',
      subcategory: category === 'blog' ? subcategory : null,
      html,
      content: markdown,
      excerpt,
      slug,
      metaTitle: seo.title,
      metaDescription: seo.description,
      keywords: seo.keywords,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return new Response(JSON.stringify({ error: 'Optimization failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
