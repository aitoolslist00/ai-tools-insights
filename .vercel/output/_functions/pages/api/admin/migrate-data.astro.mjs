import { r as requireAuth } from '../../../chunks/auth_DteQtQsy.mjs';
import { s as supabase } from '../../../chunks/supabase_By2Prn7o.mjs';
import Database from 'better-sqlite3';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await requireAuth(request);
    const logs = [];
    const sqlite = new Database("dev.db", { readonly: true });
    const results = {
      articles: { migrated: 0, skipped: 0 },
      tools: { migrated: 0, skipped: 0 },
      users: { migrated: 0, skipped: 0 },
      settings: { migrated: 0, updated: 0 }
    };
    logs.push("🚀 Starting migration from SQLite to Supabase...\n");
    logs.push("👤 Migrating Users...");
    try {
      const users = sqlite.prepare("SELECT * FROM users").all();
      logs.push(`Found ${users.length} users`);
      for (const user of users) {
        const { data: existing } = await supabase.from("users").select("id").eq("username", user.username).single();
        if (existing) {
          logs.push(`⏭️  Skipping user "${user.username}" (already exists)`);
          results.users.skipped++;
          continue;
        }
        const { error } = await supabase.from("users").insert({
          username: user.username,
          password: user.password,
          created_at: user.created_at
        });
        if (error) {
          logs.push(`❌ Failed to migrate user "${user.username}": ${error.message}`);
        } else {
          logs.push(`✅ Migrated user "${user.username}"`);
          results.users.migrated++;
        }
      }
    } catch (e) {
      logs.push(`⚠️  Users table error: ${e.message}`);
    }
    logs.push("\n📄 Migrating Articles...");
    try {
      const articles = sqlite.prepare("SELECT * FROM articles").all();
      logs.push(`Found ${articles.length} articles`);
      for (const article of articles) {
        const { data: existing } = await supabase.from("articles").select("id").eq("slug", article.slug).single();
        if (existing) {
          logs.push(`⏭️  Skipping "${article.title}" (already exists)`);
          results.articles.skipped++;
          continue;
        }
        const { error } = await supabase.from("articles").insert({
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          subcategory: article.subcategory,
          meta_title: article.meta_title,
          meta_description: article.meta_description,
          keywords: article.keywords,
          featured_image: article.featured_image,
          schema_markup: article.schema_markup,
          og_title: article.og_title,
          og_description: article.og_description,
          og_image: article.og_image,
          og_url: article.og_url,
          twitter_card: article.twitter_card,
          twitter_title: article.twitter_title,
          twitter_description: article.twitter_description,
          twitter_image: article.twitter_image,
          robots_meta: article.robots_meta,
          viewport: article.viewport,
          canonical_url: article.canonical_url,
          author: article.author,
          author_experience: article.author_experience,
          status: article.status,
          published_at: article.published_at,
          created_at: article.created_at,
          updated_at: article.updated_at
        });
        if (error) {
          logs.push(`❌ Failed to migrate "${article.title}": ${error.message}`);
        } else {
          logs.push(`✅ Migrated "${article.title}"`);
          results.articles.migrated++;
        }
      }
    } catch (e) {
      logs.push(`⚠️  Articles table error: ${e.message}`);
    }
    logs.push("\n🔧 Migrating AI Tools...");
    try {
      const tools = sqlite.prepare("SELECT * FROM ai_tools").all();
      logs.push(`Found ${tools.length} AI tools`);
      for (const tool of tools) {
        const { data: existing } = await supabase.from("ai_tools").select("id").eq("slug", tool.slug).single();
        if (existing) {
          logs.push(`⏭️  Skipping "${tool.name}" (already exists)`);
          results.tools.skipped++;
          continue;
        }
        const { error } = await supabase.from("ai_tools").insert({
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          long_description: tool.long_description,
          website_url: tool.website_url,
          affiliate_link: tool.affiliate_link,
          category: tool.category,
          features: tool.features,
          pricing: tool.pricing,
          meta_title: tool.meta_title,
          meta_description: tool.meta_description,
          keywords: tool.keywords,
          featured_image: tool.featured_image,
          schema_markup: tool.schema_markup,
          status: tool.status,
          published_at: tool.published_at,
          created_at: tool.created_at,
          updated_at: tool.updated_at
        });
        if (error) {
          logs.push(`❌ Failed to migrate "${tool.name}": ${error.message}`);
        } else {
          logs.push(`✅ Migrated "${tool.name}"`);
          results.tools.migrated++;
        }
      }
    } catch (e) {
      logs.push(`⚠️  AI Tools table error: ${e.message}`);
    }
    logs.push("\n⚙️  Migrating Settings...");
    try {
      const settings = sqlite.prepare("SELECT * FROM settings").all();
      logs.push(`Found ${settings.length} settings`);
      for (const setting of settings) {
        const { data: existing } = await supabase.from("settings").select("id").eq("key", setting.key).single();
        if (existing) {
          const { error: error2 } = await supabase.from("settings").update({
            value: setting.value,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }).eq("key", setting.key);
          if (error2) {
            logs.push(`❌ Failed to update setting "${setting.key}": ${error2.message}`);
          } else {
            logs.push(`🔄 Updated setting "${setting.key}"`);
            results.settings.updated++;
          }
          continue;
        }
        const { error } = await supabase.from("settings").insert({
          key: setting.key,
          value: setting.value,
          created_at: setting.created_at,
          updated_at: setting.updated_at
        });
        if (error) {
          logs.push(`❌ Failed to migrate setting "${setting.key}": ${error.message}`);
        } else {
          logs.push(`✅ Migrated setting "${setting.key}"`);
          results.settings.migrated++;
        }
      }
    } catch (e) {
      logs.push(`⚠️  Settings table error: ${e.message}`);
    }
    sqlite.close();
    logs.push("\n🎉 Migration completed!");
    return new Response(JSON.stringify({
      success: true,
      ...results,
      logs
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Migration error:", error);
    return new Response(JSON.stringify({
      error: error.message || "Migration failed"
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
