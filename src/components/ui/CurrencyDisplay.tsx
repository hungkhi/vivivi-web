'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCurrencyStore } from '@/lib/stores/currency-store';

function AnimatedNumber({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="inline-block tabular-nums"
      >
        {value.toLocaleString()}
      </motion.span>
    </AnimatePresence>
  );
}

export default function CurrencyDisplay() {
  const router = useRouter();
  const { vcoin, ruby, fetchBalance } = useCurrencyStore();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <button
      onClick={() => router.push('/shop')}
      className="flex items-center gap-3 px-4 py-2 rounded-full glass hover:bg-white/5 transition-colors cursor-pointer"
    >
      {/* VCoin */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-yellow-600 flex items-center justify-center shadow-[0_0_8px_rgba(255,215,0,0.3)]">
          <span className="text-[10px] font-bold text-black">V</span>
        </div>
        <span className="text-sm font-medium text-[var(--text)]">
          <AnimatedNumber value={vcoin} />
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-white/10" />

      {/* Ruby */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-4 h-4 drop-shadow-[0_0_4px_rgba(231,76,111,0.4)]">
            <path
              d="M8 1L14 6L8 15L2 6L8 1Z"
              fill="var(--accent-ruby)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
            />
            <path
              d="M8 1L5 6H11L8 1Z"
              fill="rgba(255,255,255,0.15)"
            />
          </svg>
        </div>
        <span className="text-sm font-medium text-[var(--text)]">
          <AnimatedNumber value={ruby} />
        </span>
      </div>
    </button>
  );
}
