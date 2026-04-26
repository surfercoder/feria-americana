// Only load dotenv if not running in Next.js (i.e., in a Node.js script)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Use dynamic import for dotenv to avoid require()
  import('dotenv').then(dotenv => dotenv.config({ path: '.env.local' }));
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 