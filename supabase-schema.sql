-- Run this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste this and click "Run"

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  schema_markup TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_url TEXT,
  twitter_card TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  robots_meta TEXT,
  viewport TEXT,
  canonical_url TEXT,
  author TEXT,
  author_experience TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Tools table
CREATE TABLE IF NOT EXISTS ai_tools (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  website_url TEXT,
  logo_url TEXT,
  affiliate_link TEXT,
  category TEXT,
  pricing TEXT,
  features TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internal Links table
CREATE TABLE IF NOT EXISTS internal_links (
  id BIGSERIAL PRIMARY KEY,
  source_id BIGINT NOT NULL,
  source_type TEXT NOT NULL,
  target_id BIGINT NOT NULL,
  target_type TEXT NOT NULL,
  anchor_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);

CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);

CREATE INDEX IF NOT EXISTS idx_internal_links_source ON internal_links(source_id, source_type);
CREATE INDEX IF NOT EXISTS idx_internal_links_target ON internal_links(target_id, target_type);

-- Enable Row Level Security (RLS) - but allow all operations for now
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can restrict these later)
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for articles" ON articles FOR ALL USING (true);
CREATE POLICY "Enable all access for ai_tools" ON ai_tools FOR ALL USING (true);
CREATE POLICY "Enable all access for internal_links" ON internal_links FOR ALL USING (true);
CREATE POLICY "Enable all access for settings" ON settings FOR ALL USING (true);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
