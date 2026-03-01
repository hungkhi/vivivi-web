import { create } from 'zustand';
import type { ConversationMessage } from '@/lib/supabase/types';
import { sendMessageToGemini, fetchConversation, persistMessage } from '@/lib/api/chat';

interface ChatStore {
  messages: ConversationMessage[];
  isLoading: boolean;
  isSending: boolean;
  hasMore: boolean;
  characterId: string | null;

  setCharacterId: (id: string) => void;
  loadMessages: (characterId: string) => Promise<void>;
  loadMore: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  isSending: false,
  hasMore: true,
  characterId: null,

  setCharacterId: (id) => set({ characterId: id }),

  loadMessages: async (characterId: string) => {
    set({ isLoading: true, characterId });
    try {
      const messages = await fetchConversation(characterId, 20);
      set({ messages, isLoading: false, hasMore: messages.length >= 20 });
    } catch {
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { messages, characterId, hasMore } = get();
    if (!characterId || !hasMore || messages.length === 0) return;
    const oldest = messages[0]?.created_at;
    const older = await fetchConversation(characterId, 20, oldest);
    set({
      messages: [...older, ...messages],
      hasMore: older.length >= 20,
    });
  },

  sendMessage: async (text: string) => {
    const { characterId, messages } = get();
    if (!characterId || !text.trim()) return;

    const userMsg: ConversationMessage = {
      character_id: characterId,
      message: text,
      is_agent: false,
      is_seen: true,
      created_at: new Date().toISOString(),
    };

    set({ messages: [...messages, userMsg], isSending: true });

    try {
      await persistMessage(characterId, text, false);

      const history = get().messages.slice(-10).map(m => ({
        role: m.is_agent ? 'model' : 'user',
        content: m.message,
      }));

      const response = await sendMessageToGemini(text, characterId, history);

      await persistMessage(characterId, response, true);

      const agentMsg: ConversationMessage = {
        character_id: characterId,
        message: response,
        is_agent: true,
        is_seen: true,
        created_at: new Date().toISOString(),
      };

      set(state => ({
        messages: [...state.messages, agentMsg],
        isSending: false,
      }));
    } catch {
      set({ isSending: false });
    }
  },

  clearMessages: () => set({ messages: [], hasMore: true, characterId: null }),
}));
