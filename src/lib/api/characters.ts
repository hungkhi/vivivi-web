import { getSupabase } from '@/lib/supabase/client';
import type { Character } from '@/lib/supabase/types';

export async function fetchCharacters(): Promise<Character[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('characters')
    .select('id,name,description,thumbnail_url,avatar,base_model_url,full_model,agent_elevenlabs_id,tier,available,price_vcoin,price_ruby,default_costume_id,is_public')
    .eq('is_public', true)
    .eq('available', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Character[];
}

export async function fetchCharacter(id: string): Promise<Character | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Character;
}
