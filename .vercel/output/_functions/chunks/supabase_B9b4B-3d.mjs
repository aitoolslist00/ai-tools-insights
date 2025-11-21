import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }
  const supabaseUrl = process.env.SUPABASE_URL || "https://zwjwkztzeduudibywnjo.supabase.co";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3andrenR6ZWR1dWRpYnl3bmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTcwMDAsImV4cCI6MjA3ODAzMzAwMH0.AR91Syq8HCXfGUwpmuKGtJcLqu3eT2xo1ZFcZML0GB8";
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}
const supabase = getSupabaseClient();

export { supabase as s };
