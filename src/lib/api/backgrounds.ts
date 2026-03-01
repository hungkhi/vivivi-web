import { getSupabase } from '@/lib/supabase/client';
import { getClientId } from '@/lib/utils/client-id';
import type { Background, UserAsset } from '@/lib/supabase/types';
import { fetchCurrencyBalance, updateCurrency } from './currency';

export async function fetchBackgrounds(): Promise<Background[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('backgrounds')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Background[];
}

export async function fetchOwnedBackgrounds(): Promise<UserAsset[]> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('user_assets') as any)
    .select('*')
    .eq('item_type', 'background');

  if (error) throw error;
  return (data || []) as UserAsset[];
}

export async function purchaseBackground(
  bgId: string,
  price: number,
  currencyType: 'vcoin' | 'ruby'
): Promise<void> {
  const balance = await fetchCurrencyBalance();

  if (currencyType === 'vcoin' && balance.vcoin < price) {
    throw new Error('Not enough VCoins');
  }
  if (currencyType === 'ruby' && balance.ruby < price) {
    throw new Error('Not enough Rubies');
  }

  const newVcoin = currencyType === 'vcoin' ? balance.vcoin - price : balance.vcoin;
  const newRuby = currencyType === 'ruby' ? balance.ruby - price : balance.ruby;
  await updateCurrency(newVcoin, newRuby);

  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('user_assets') as any).insert({
    ...(session?.user?.id ? { user_id: session.user.id } : { client_id: getClientId() }),
    item_id: bgId,
    item_type: 'background',
  } as any);

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('currency_transactions') as any).insert({
    ...(session?.user?.id ? { user_id: session.user.id } : { client_id: getClientId() }),
    amount: -price,
    currency_type: currencyType,
    transaction_type: 'purchase',
    description: `Purchased background`,
    reference_id: bgId,
  } as any);
}
