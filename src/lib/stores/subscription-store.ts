import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';

export type SubscriptionTier = 'free' | 'pro' | 'unlimited';

interface SubscriptionStore {
  tier: SubscriptionTier;
  isLoading: boolean;
  stripeCustomerId: string | null;
  fetchSubscription: () => Promise<void>;
  setTier: (tier: SubscriptionTier) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  tier: 'free',
  isLoading: false,
  stripeCustomerId: null,

  fetchSubscription: async () => {
    set({ isLoading: true });
    try {
      const supabase = getSupabase();
      const { data } = await (supabase.from('subscriptions') as any)
        .select('tier,stripe_customer_id')
        .maybeSingle();
      if (data) {
        set({
          tier: data.tier || 'free',
          stripeCustomerId: data.stripe_customer_id || null,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setTier: (tier) => set({ tier }),
}));
