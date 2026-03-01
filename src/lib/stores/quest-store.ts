import { create } from 'zustand';
import type {
  UserDailyQuest,
  UserLevelQuest,
  LoginReward,
  UserLoginReward,
  UserMedal,
} from '@/lib/supabase/types';
import {
  fetchDailyQuests,
  claimDailyQuestReward,
  fetchLevelQuests,
  claimLevelQuestReward,
  fetchLoginRewards,
  fetchUserLoginReward,
  claimLoginReward,
  fetchMedals,
} from '@/lib/api/quests';

interface QuestStore {
  dailyQuests: UserDailyQuest[];
  levelQuests: UserLevelQuest[];
  loginRewards: LoginReward[];
  userLoginReward: UserLoginReward | null;
  medals: UserMedal[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  claimDailyReward: (questId: string) => Promise<void>;
  claimLevelReward: (questId: string) => Promise<void>;
  claimDailyLogin: () => Promise<void>;
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  dailyQuests: [],
  levelQuests: [],
  loginRewards: [],
  userLoginReward: null,
  medals: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [dailyQuests, levelQuests, loginRewards, userLoginReward, medals] =
        await Promise.all([
          fetchDailyQuests(),
          fetchLevelQuests(),
          fetchLoginRewards(),
          fetchUserLoginReward(),
          fetchMedals(),
        ]);
      set({
        dailyQuests,
        levelQuests,
        loginRewards,
        userLoginReward,
        medals,
        isLoading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  claimDailyReward: async (questId: string) => {
    try {
      await claimDailyQuestReward(questId);
      set({
        dailyQuests: get().dailyQuests.map((q) =>
          q.id === questId ? { ...q, claimed: true } : q
        ),
      });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  claimLevelReward: async (questId: string) => {
    try {
      await claimLevelQuestReward(questId);
      set({
        levelQuests: get().levelQuests.map((q) =>
          q.id === questId ? { ...q, claimed: true } : q
        ),
      });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  claimDailyLogin: async () => {
    try {
      const updated = await claimLoginReward();
      set({ userLoginReward: updated });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
