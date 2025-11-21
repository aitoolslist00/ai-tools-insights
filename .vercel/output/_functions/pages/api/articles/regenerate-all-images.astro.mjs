import { r as requireAuth } from '../../../chunks/auth_Cnb58Uj3.mjs';
import { d as db } from '../../../chunks/db_Cj4I5Obi.mjs';
import { g as generateArticleImage } from '../../../chunks/image-generation_oJOKDG3c.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const articles = await db.prepare("SELECT id, title, featured_image FROM articles WHERE featured_image IS NULL OR featured_image = ''").all();
    if (articles.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: "All articles already have featured images",
        updated: 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const results = [];
    const stmt = db.prepare("UPDATE articles SET featured_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    for (const article of articles) {
      try {
        const generatedImage = await generateArticleImage(article.title, {
          aspectRatio: "16:9",
          numberOfImages: 1
        });
        if (generatedImage) {
          await stmt.run(generatedImage.url, article.id);
          results.push({ id: article.id, title: article.title, success: true, image: generatedImage.url });
        } else {
          results.push({ id: article.id, title: article.title, success: false, error: "Generation failed" });
        }
        await new Promise((resolve) => setTimeout(resolve, 2e3));
      } catch (error) {
        console.error(`Failed to generate image for article ${article.id}:`, error);
        results.push({ id: article.id, title: article.title, success: false, error: error instanceof Error ? error.message : "Unknown error" });
      }
    }
    const successCount = results.filter((r) => r.success).length;
    return new Response(JSON.stringify({
      success: true,
      message: `Generated images for ${successCount} out of ${articles.length} articles`,
      updated: successCount,
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Bulk image regeneration error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Bulk regeneration failed"
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
