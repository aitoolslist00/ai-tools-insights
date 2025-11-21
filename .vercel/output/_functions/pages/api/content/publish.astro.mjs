import { r as requireAuth } from '../../../chunks/auth_De261tP2.mjs';
import { d as db } from '../../../chunks/db_CVCqU9ns.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const data = await request.json();
    const {
      title,
      category,
      subcategory,
      content,
      html,
      excerpt,
      slug,
      metaTitle,
      metaDescription,
      keywords,
      featuredImage,
      schemaMarkup,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      robotsMeta,
      viewport,
      canonicalUrl,
      author,
      authorExperience,
      affiliateLink,
      aiToolData
    } = data;
    if (!title || !category || !content || !slug) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const keywordsString = Array.isArray(keywords) ? keywords.join(",") : keywords;
    let result;
    if (category === "AI Tools") {
      const pricing = aiToolData?.pricing?.tiers?.map((tier) => `${tier.name}: ${tier.price}`).join(", ") || "Free & Paid Plans";
      const features = aiToolData?.advantages?.map((adv) => adv.title).slice(0, 5).join(", ") || "Advanced AI Features";
      const websiteUrl = canonicalUrl?.replace(/^https?:\/\/[^\/]+/, "") ? canonicalUrl.split("/")[0] + "//" + canonicalUrl.split("/")[2] : null;
      const stmt = db.prepare(`
        INSERT INTO ai_tools (
          name, slug, description, long_description, website_url, logo_url, affiliate_link,
          category, pricing, features, meta_title, meta_description, keywords, 
          status, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      result = await stmt.run(
        title,
        slug,
        excerpt,
        content,
        websiteUrl,
        featuredImage || null,
        affiliateLink || null,
        "AI Tools",
        pricing,
        features,
        metaTitle,
        metaDescription,
        keywordsString,
        "published",
        (/* @__PURE__ */ new Date()).toISOString()
      );
    } else {
      const stmt = db.prepare(`
        INSERT INTO articles (
          title, slug, content, excerpt, category, subcategory, 
          meta_title, meta_description, keywords, featured_image,
          schema_markup, og_title, og_description, og_image, og_url,
          twitter_card, twitter_title, twitter_description, twitter_image,
          robots_meta, viewport, canonical_url, author, author_experience,
          status, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      result = await stmt.run(
        title,
        slug,
        content,
        excerpt,
        category,
        subcategory || null,
        metaTitle,
        metaDescription,
        keywordsString,
        featuredImage || null,
        schemaMarkup || null,
        ogTitle || null,
        ogDescription || null,
        ogImage || null,
        ogUrl || null,
        twitterCard || null,
        twitterTitle || null,
        twitterDescription || null,
        twitterImage || null,
        robotsMeta || null,
        viewport || null,
        canonicalUrl || null,
        author || null,
        authorExperience || null,
        "published",
        (/* @__PURE__ */ new Date()).toISOString()
      );
    }
    return new Response(JSON.stringify({
      success: true,
      articleId: result.lastInsertRowid,
      slug
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Publishing error:", error);
    return new Response(JSON.stringify({ error: "Publishing failed" }), {
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
