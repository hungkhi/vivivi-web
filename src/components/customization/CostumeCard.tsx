'use client';

import { motion } from 'framer-motion';
import type { Costume } from '@/lib/supabase/types';

interface CostumeCardProps {
  costume: Costume;
  owned: boolean;
  equipped: boolean;
  index: number;
  onClick: () => void;
}

export default function CostumeCard({ costume, owned, equipped, index, onClick }: CostumeCardProps) {
  const isPro = costume.tier !== 'free';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-[var(--accent-pink)]/40 transition-all duration-300">
        <img
          src={costume.thumbnail || costume.url}
          alt={costume.costume_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--accent-pink)]/10" />

        {/* Price badge top-left (if not owned) */}
        {!owned && costume.price_vcoin > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full glass text-xs font-medium">
            <svg className="w-3 h-3 text-[var(--accent-gold)]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#0b0b10" fontWeight="bold">V</text>
            </svg>
            <span className="text-[var(--accent-gold)]">{costume.price_vcoin}</span>
          </div>
        )}

        {/* Tier badge top-right */}
        {isPro && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
            PRO
          </div>
        )}

        {/* Lock overlay */}
        {!owned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        )}

        {/* Equipped badge */}
        {equipped && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--accent-mint)]/20 border border-[var(--accent-mint)]/40 text-[10px] font-semibold text-[var(--accent-mint)]">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Equipped
          </div>
        )}
      </div>

      {/* Name */}
      <p className="mt-2 text-sm font-medium text-white truncate text-center">
        {costume.costume_name}
      </p>
    </motion.div>
  );
}
