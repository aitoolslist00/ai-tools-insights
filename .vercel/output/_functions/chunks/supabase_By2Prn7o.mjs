import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zwjwkztzeduudibywnjo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3andrenR6ZWR1dWRpYnl3bmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTcwMDAsImV4cCI6MjA3ODAzMzAwMH0.AR91Syq8HCXfGUwpmuKGtJcLqu3eT2xo1ZFcZML0GB8";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase as s };
