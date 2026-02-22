import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Expo requires EXPO_PUBLIC_ prefix for client-side env vars
// Add to apps/mobile/.env:
//   EXPO_PUBLIC_SUPABASE_URL=https://opzqsxrfqasqadnjdgop.supabase.co
//   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (__DEV__ && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    '[Supabase] Missing env vars. Create apps/mobile/.env with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // No user auth in v1 (ADR-001)
    persistSession: false,
    autoRefreshToken: false,
  },
});
