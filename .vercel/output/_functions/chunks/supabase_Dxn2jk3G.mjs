import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }
  const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
    console.error("SUPABASE_ANON_KEY:", supabaseAnonKey ? "SET" : "MISSING");
    throw new Error("Missing Supabase environment variables. Please check your .env file.");
  }
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}
const supabase = getSupabaseClient();

export { supabase as s };
