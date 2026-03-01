import { getSupabase } from '@/lib/supabase/client';
import { getClientId } from '@/lib/utils/client-id';
import type { CharacterStory, UserCharacterStory } from '@/lib/supabase/types';
import { fetchCurrencyBalance } from './currency';

export async function fetchStories(characterId: string): Promise<CharacterStory[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('character_stories')
    .select('*')
    .eq('character_id', characterId)
    .eq('is_active', true)
    .order('chapter_number', { ascending: true });

  if (error) throw error;
  return (data || []) as CharacterStory[];
}

export async function fetchUserStories(characterId: string): Promise<UserCharacterStory[]> {
  const supabase = getSupabase();
  // We join with character_stories to filter by character_id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('user_character_stories') as any)
    .select('*, character_stories!inner(character_id)')
    .eq('character_stories.character_id', characterId);

  if (error) throw error;
  return (data || []) as UserCharacterStory[];
}

export async function unlockStory(storyId: string, energyCost: number): Promise<void> {
  const supabase = getSupabase();

  // Check energy via user_stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stats, error: statsError } = await (supabase.from('user_stats') as any)
    .select('energy')
    .maybeSingle();

  if (statsError) throw statsError;
  const currentEnergy = stats?.energy ?? 0;

  if (currentEnergy < energyCost) {
    throw new Error('Not enough energy');
  }

  const { data: { session } } = await supabase.auth.getSession();
  const identity = session?.user?.id
    ? { user_id: session.user.id }
    : { client_id: getClientId() };

  // Deduct energy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('user_stats') as any).update({
    energy: currentEnergy - energyCost,
  } as any).match(identity);

  // Mark story as unlocked
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('user_character_stories') as any).upsert({
    ...identity,
    story_id: storyId,
    is_unlocked: true,
    unlocked_at: new Date().toISOString(),
  } as any);
}

export async function markStoryRead(storyId: string): Promise<void> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  const identity = session?.user?.id
    ? { user_id: session.user.id }
    : { client_id: getClientId() };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('user_character_stories') as any).update({
    is_read: true,
    read_at: new Date().toISOString(),
  } as any).match({ ...identity, story_id: storyId });
}
