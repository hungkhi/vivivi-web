import { create } from 'zustand';
import { fetchCurrencyBalance, updateCurrency } from '@/lib/api/currency';

interface CurrencyStore {
  vcoin: number;
  ruby: number;
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  spendVcoin: (amount: number) => Promise<boolean>;
  spendRuby: (amount: number) => Promise<boolean>;
  addVcoin: (amount: number) => Promise<void>;
  addRuby: (amount: number) => Promise<void>;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  vcoin: 0,
  ruby: 0,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const balance = await fetchCurrencyBalance();
      set({ vcoin: balance.vcoin, ruby: balance.ruby, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  spendVcoin: async (amount: number) => {
    const { vcoin, ruby } = get();
    if (vcoin < amount) return false;
    const newVcoin = vcoin - amount;
    set({ vcoin: newVcoin });
    try {
      await updateCurrency(newVcoin, ruby);
      return true;
    } catch {
      // Rollback on failure
      set({ vcoin });
      return false;
    }
  },

  spendRuby: async (amount: number) => {
    const { vcoin, ruby } = get();
    if (ruby < amount) return false;
    const newRuby = ruby - amount;
    set({ ruby: newRuby });
    try {
      await updateCurrency(vcoin, newRuby);
      return true;
    } catch {
      // Rollback on failure
      set({ ruby });
      return false;
    }
  },

  addVcoin: async (amount: number) => {
    const { vcoin, ruby } = get();
    const newVcoin = vcoin + amount;
    set({ vcoin: newVcoin });
    try {
      await updateCurrency(newVcoin, ruby);
    } catch {
      set({ vcoin });
    }
  },

  addRuby: async (amount: number) => {
    const { vcoin, ruby } = get();
    const newRuby = ruby + amount;
    set({ ruby: newRuby });
    try {
      await updateCurrency(vcoin, newRuby);
    } catch {
      set({ ruby });
    }
  },
}));
