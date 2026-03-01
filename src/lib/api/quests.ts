import { getSupabase } from '@/lib/supabase/client';
import type {
  UserDailyQuest,
  UserLevelQuest,
  LoginReward,
  UserLoginReward,
  UserMedal,
} from '@/lib/supabase/types';

// ── Daily Quests ────────────────────────────────────────────────────

export async function fetchDailyQuests(): Promise<UserDailyQuest[]> {
  const supabase = getSupabase();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('user_daily_quests')
    .select('*, quest:daily_quests(*)')
    .eq('quest_date', today)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as UserDailyQuest[];
}

export async function claimDailyQuestReward(
  questId: string
): Promise<{ vcoin: number; ruby: number; xp: number }> {
  const supabase = getSupabase();

  const { data, error } = await (supabase.from('user_daily_quests') as any)
    .update({ claimed: true })
    .eq('id', questId)
    .select('*, quest:daily_quests(*)')
    .single();

  if (error) throw error;
  const quest = (data as any)?.quest;
  return {
    vcoin: quest?.reward_vcoin ?? 0,
    ruby: quest?.reward_ruby ?? 0,
    xp: quest?.reward_xp ?? 0,
  };
}

// ── Level Quests ────────────────────────────────────────────────────

export async function fetchLevelQuests(): Promise<UserLevelQuest[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('user_level_quests')
    .select('*, quest:level_quests(*)')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as UserLevelQuest[];
}

export async function claimLevelQuestReward(
  questId: string
): Promise<{ vcoin: number; ruby: number; xp: number }> {
  const supabase = getSupabase();

  const { data, error } = await (supabase.from('user_level_quests') as any)
    .update({ claimed: true })
    .eq('id', questId)
    .select('*, quest:level_quests(*)')
    .single();

  if (error) throw error;
  const quest = (data as any)?.quest;
  return {
    vcoin: quest?.reward_vcoin ?? 0,
    ruby: quest?.reward_ruby ?? 0,
    xp: quest?.reward_xp ?? 0,
  };
}

// ── Login Rewards ───────────────────────────────────────────────────

export async function fetchLoginRewards(): Promise<LoginReward[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('login_rewards')
    .select('*')
    .order('day_number', { ascending: true });

  if (error) throw error;
  return (data || []) as LoginReward[];
}

export async function fetchUserLoginReward(): Promise<UserLoginReward | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('user_login_rewards')
    .select('*')
    .single();

  if (error) return null;
  return data as UserLoginReward;
}

export async function claimLoginReward(): Promise<UserLoginReward> {
  const supabase = getSupabase();
  const today = new Date().toISOString().split('T')[0];

  // Fetch current state
  const current = await fetchUserLoginReward();

  if (!current) {
    // First-time claim
    const { data, error } = await (supabase.from('user_login_rewards') as any)
      .insert({
        current_day: 1,
        last_claim_date: today,
        total_days_claimed: 1,
      })
      .select('*')
      .single();
    if (error) throw error;
    return data as UserLoginReward;
  }

  // Increment day
  const nextDay = current.current_day >= 30 ? 1 : current.current_day + 1;
  const { data, error } = await (supabase.from('user_login_rewards') as any)
    .update({
      current_day: nextDay,
      last_claim_date: today,
      total_days_claimed: current.total_days_claimed + 1,
    })
    .eq('id', current.id)
    .select('*')
    .single();

  if (error) throw error;
  return data as UserLoginReward;
}

// ── Medals ──────────────────────────────────────────────────────────

export async function fetchMedals(): Promise<UserMedal[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('user_medals')
    .select('*, medal:medals(*)')
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return (data || []) as UserMedal[];
}
