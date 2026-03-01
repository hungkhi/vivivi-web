import { create } from 'zustand';
import type { UserStats, CharacterRelationship } from '@/lib/supabase/types';
import { fetchUserStats, fetchRelationship, updateRelationshipXP } from '@/lib/api/stats';

interface GameStore {
  userStats: UserStats | null;
  relationships: Map<string, CharacterRelationship>;
  isLoading: boolean;
  error: string | null;
  fetchUserStats: () => Promise<void>;
  fetchRelationship: (characterId: string) => Promise<void>;
  addXP: (amount: number) => void;
  addRelationshipXP: (characterId: string, xpAmount: number) => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  userStats: null,
  relationships: new Map(),
  isLoading: false,
  error: null,

  fetchUserStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await fetchUserStats();
      set({ userStats: stats, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchRelationship: async (characterId: string) => {
    try {
      const relationship = await fetchRelationship(characterId);
      if (relationship) {
        const relationships = new Map(get().relationships);
        relationships.set(characterId, relationship);
        set({ relationships });
      }
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addXP: (amount: number) => {
    const { userStats } = get();
    if (!userStats) return;

    const xpPerLevel = 100;
    const newXP = userStats.xp + amount;
    const levelsGained = Math.floor(newXP / xpPerLevel);
    const remainingXP = newXP % xpPerLevel;

    set({
      userStats: {
        ...userStats,
        xp: remainingXP,
        level: userStats.level + levelsGained,
      },
    });
  },

  addRelationshipXP: async (characterId: string, xpAmount: number) => {
    try {
      await updateRelationshipXP(characterId, xpAmount);
      // Re-fetch to get server-computed values
      await get().fetchRelationship(characterId);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
