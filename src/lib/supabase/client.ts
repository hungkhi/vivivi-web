import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getClientId } from '@/lib/utils/client-id';

let client: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabase() {
  if (client) return client;
  client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          'X-Client-Id': getClientId(),
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
  return client;
}
