import { create } from 'zustand';
import type { Character } from '@/lib/supabase/types';
import { fetchCharacters } from '@/lib/api/characters';

interface CharacterStore {
  characters: Character[];
  selectedCharacter: Character | null;
  isLoading: boolean;
  error: string | null;
  loadCharacters: () => Promise<void>;
  selectCharacter: (character: Character) => void;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: [],
  selectedCharacter: null,
  isLoading: false,
  error: null,

  loadCharacters: async () => {
    if (get().characters.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      const characters = await fetchCharacters();
      set({ characters, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  selectCharacter: (character) => {
    set({ selectedCharacter: character });
  },
}));
