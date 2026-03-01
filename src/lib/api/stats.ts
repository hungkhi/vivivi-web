import { getSupabase } from '@/lib/supabase/client';
import { getClientId } from '@/lib/utils/client-id';
import type { UserStats, CharacterRelationship } from '@/lib/supabase/types';

export async function fetchUserStats(): Promise<UserStats | null> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('user_stats') as any)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data as UserStats | null;
}

export async function updateMessageCount(): Promise<void> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch current stats first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase.from('user_stats') as any)
    .select('total_messages_sent')
    .maybeSingle();

  const currentCount = existing?.total_messages_sent ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('user_stats') as any).upsert({
    ...(session?.user?.id ? { user_id: session.user.id } : { client_id: getClientId() }),
    total_messages_sent: currentCount + 1,
  });
}

export async function updateLoginStreak(): Promise<void> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase.from('user_stats') as any)
    .select('login_streak,last_login_date,total_logins')
    .maybeSingle();

  const today = new Date().toISOString().split('T')[0];
  const lastLogin = existing?.last_login_date?.split('T')[0];

  let streak = existing?.login_streak ?? 0;
  const totalLogins = (existing?.total_logins ?? 0) + 1;

  if (lastLogin === today) {
    // Already logged in today, no update needed
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastLogin === yesterdayStr) {
    streak += 1;
  } else {
    streak = 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('user_stats') as any).upsert({
    ...(session?.user?.id ? { user_id: session.user.id } : { client_id: getClientId() }),
    login_streak: streak,
    last_login_date: new Date().toISOString(),
    total_logins: totalLogins,
  });
}

export async function fetchRelationship(characterId: string): Promise<CharacterRelationship | null> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('character_affection') as any)
    .select('*')
    .eq('character_id', characterId)
    .maybeSingle();
  if (error) throw error;
  return data as CharacterRelationship | null;
}

export async function updateRelationshipXP(characterId: string, xpAmount: number): Promise<void> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch current relationship
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase.from('character_affection') as any)
    .select('affection_xp,affection_level,total_chats')
    .eq('character_id', characterId)
    .maybeSingle();

  const currentXP = (existing?.affection_xp ?? 0) + xpAmount;
  const currentLevel = existing?.affection_level ?? 1;
  const totalChats = (existing?.total_chats ?? 0) + 1;

  // Simple level-up: every 100 XP = 1 level
  const xpPerLevel = 100;
  const newLevel = Math.floor(currentXP / xpPerLevel) + 1;

  // Determine stage based on level
  let stage = 'stranger';
  if (newLevel >= 20) stage = 'soulmate';
  else if (newLevel >= 10) stage = 'lover';
  else if (newLevel >= 5) stage = 'friend';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('character_affection') as any).upsert({
    ...(session?.user?.id ? { user_id: session.user.id } : { client_id: getClientId() }),
    character_id: characterId,
    affection_xp: currentXP,
    affection_level: Math.max(currentLevel, newLevel),
    total_chats: totalChats,
    current_stage_key: stage,
    last_interaction: new Date().toISOString(),
  });
}
