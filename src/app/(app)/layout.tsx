'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCurrencyStore } from '@/lib/stores/currency-store';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';
import AppNavBar from '@/components/ui/AppNavBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();
  const { fetchBalance } = useCurrencyStore();

  useEffect(() => {
    initialize();
    fetchBalance();
  }, [initialize, fetchBalance]);

  return (
    <div className="min-h-screen bg-[var(--bg)] relative">
      {/* Top bar with currency */}
      <div className="fixed top-4 right-4 z-50">
        <CurrencyDisplay />
      </div>

      {children}

      {/* Bottom navigation */}
      <AppNavBar />
    </div>
  );
}
