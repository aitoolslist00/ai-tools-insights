import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { generateArticleImage } from '../../../lib/image-generation';

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireAuth(request);

    const articles = await db.prepare("SELECT id, title, featured_image FROM articles WHERE featured_image IS NULL OR featured_image = ''").all() as any[];

    if (articles.length === 0) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'All articles already have featured images',
        updated: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const results = [];
    const stmt = db.prepare('UPDATE articles SET featured_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

    for (const article of articles) {
      try {
        const generatedImage = await generateArticleImage(article.title, {
          aspectRatio: '16:9',
          numberOfImages: 1
        });

        if (generatedImage) {
          await stmt.run(generatedImage.url, article.id);
          results.push({ id: article.id, title: article.title, success: true, image: generatedImage.url });
        } else {
          results.push({ id: article.id, title: article.title, success: false, error: 'Generation failed' });
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate image for article ${article.id}:`, error);
        results.push({ id: article.id, title: article.title, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(JSON.stringify({
      success: true,
      message: `Generated images for ${successCount} out of ${articles.length} articles`,
      updated: successCount,
      results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Bulk image regeneration error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Bulk regeneration failed' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
