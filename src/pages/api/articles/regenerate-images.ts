import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { generateArticleImage } from '../../../lib/image-generation';

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireAuth(request);

    const { articleId } = await request.json();

    if (!articleId) {
      return new Response(JSON.stringify({ error: 'Article ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const article = await db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId) as any;

    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const generatedImage = await generateArticleImage(article.title, {
      aspectRatio: '16:9',
      numberOfImages: 1
    });

    if (!generatedImage) {
      return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare('UPDATE articles SET featured_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    await stmt.run(generatedImage.url, articleId);

    return new Response(JSON.stringify({
      success: true,
      featuredImage: generatedImage.url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Image regeneration error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Image regeneration failed' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
