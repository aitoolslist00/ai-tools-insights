import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const sqlite = new Database('dev.db');

async function migrateArticles() {
  console.log('📄 Migrating Articles...');
  
  const articles = sqlite.prepare('SELECT * FROM articles').all();
  console.log(`Found ${articles.length} articles in SQLite`);

  let migrated = 0;
  let skipped = 0;

  for (const article of articles) {
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', article.slug)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping "${article.title}" (already exists)`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('articles')
      .insert({
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
      console.error(`❌ Failed to migrate "${article.title}":`, error.message);
    } else {
      console.log(`✅ Migrated "${article.title}"`);
      migrated++;
    }
  }

  console.log(`\n✅ Articles migration complete: ${migrated} migrated, ${skipped} skipped`);
}

async function migrateAITools() {
  console.log('\n🔧 Migrating AI Tools...');
  
  const tools = sqlite.prepare('SELECT * FROM ai_tools').all();
  console.log(`Found ${tools.length} AI tools in SQLite`);

  let migrated = 0;
  let skipped = 0;

  for (const tool of tools) {
    const { data: existing } = await supabase
      .from('ai_tools')
      .select('id')
      .eq('slug', tool.slug)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping "${tool.name}" (already exists)`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('ai_tools')
      .insert({
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
      console.error(`❌ Failed to migrate "${tool.name}":`, error.message);
    } else {
      console.log(`✅ Migrated "${tool.name}"`);
      migrated++;
    }
  }

  console.log(`\n✅ AI Tools migration complete: ${migrated} migrated, ${skipped} skipped`);
}

async function migrateUsers() {
  console.log('\n👤 Migrating Users...');
  
  const users = sqlite.prepare('SELECT * FROM users').all();
  console.log(`Found ${users.length} users in SQLite`);

  let migrated = 0;
  let skipped = 0;

  for (const user of users) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', user.username)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping user "${user.username}" (already exists)`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('users')
      .insert({
        username: user.username,
        password: user.password,
        created_at: user.created_at
      });

    if (error) {
      console.error(`❌ Failed to migrate user "${user.username}":`, error.message);
    } else {
      console.log(`✅ Migrated user "${user.username}"`);
      migrated++;
    }
  }

  console.log(`\n✅ Users migration complete: ${migrated} migrated, ${skipped} skipped`);
}

async function migrateSettings() {
  console.log('\n⚙️  Migrating Settings...');
  
  const settings = sqlite.prepare('SELECT * FROM settings').all();
  console.log(`Found ${settings.length} settings in SQLite`);

  let migrated = 0;
  let skipped = 0;

  for (const setting of settings) {
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .eq('key', setting.key)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('settings')
        .update({
          value: setting.value,
          updated_at: new Date().toISOString()
        })
        .eq('key', setting.key);

      if (error) {
        console.error(`❌ Failed to update setting "${setting.key}":`, error.message);
      } else {
        console.log(`🔄 Updated setting "${setting.key}"`);
        skipped++;
      }
      continue;
    }

    const { error } = await supabase
      .from('settings')
      .insert({
        key: setting.key,
        value: setting.value,
        created_at: setting.created_at,
        updated_at: setting.updated_at
      });

    if (error) {
      console.error(`❌ Failed to migrate setting "${setting.key}":`, error.message);
    } else {
      console.log(`✅ Migrated setting "${setting.key}"`);
      migrated++;
    }
  }

  console.log(`\n✅ Settings migration complete: ${migrated} migrated, ${skipped} updated/skipped`);
}

async function main() {
  console.log('🚀 Starting data migration from SQLite to Supabase...\n');
  
  try {
    await migrateUsers();
    await migrateArticles();
    await migrateAITools();
    await migrateSettings();
    
    console.log('\n\n🎉 Migration completed successfully!');
    console.log('You can now check your Supabase dashboard to verify the data.');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

main();
