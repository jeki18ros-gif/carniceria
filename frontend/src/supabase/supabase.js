import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "https://fjprwsgfqlqbdwqmivnw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcHJ3c2dmcWxxYmR3cW1pdm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDc3NzYsImV4cCI6MjA3OTY4Mzc3Nn0.Ak1hI4TQfLp18g_t5JSttur6b2uDo1sCLhioO9lnsKw"
);