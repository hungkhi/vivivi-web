import { getSupabase } from '@/lib/supabase/client';
import { getClientId } from '@/lib/utils/client-id';
import type { UserCurrency } from '@/lib/supabase/types';

export async function fetchCurrencyBalance(): Promise<UserCurrency> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('user_currency') as any)
    .select('vcoin,ruby')
    .maybeSingle();
  if (error) throw error;
  return data || { vcoin: 0, ruby: 0 };
}

export async function updateCurrency(vcoin: number, ruby: number): Promise<void> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('user_currency') as any).upsert({
    ...(session?.user?.id ? { user_id: session.user.id } : { client_id: getClientId() }),
    vcoin: Math.max(0, vcoin),
    ruby: Math.max(0, ruby),
  });
}
