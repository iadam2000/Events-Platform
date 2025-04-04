import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zihshxhnrwtxafbnvldo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaHNoeGhucnd0eGFmYm52bGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njg5MjIsImV4cCI6MjA1OTM0NDkyMn0.f5wY4oQltNe7Z5SqWSWVhPtfT8VjxSMEGK7n6mE-CcM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
