import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  subcategory?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  schema_markup?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_url?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots_meta?: string;
  viewport?: string;
  canonical_url?: string;
  author?: string;
  author_experience?: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AITool {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  website_url?: string;
  logo_url?: string;
  affiliate_link?: string;
  category?: string;
  pricing?: string;
  features?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface InternalLink {
  id: number;
  source_id: number;
  source_type: string;
  target_id: number;
  target_type: string;
  anchor_text?: string;
  created_at: string;
}
