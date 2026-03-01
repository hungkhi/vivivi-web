'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Medal, UserMedal } from '@/lib/supabase/types';

interface MedalCardProps {
  medal: Medal;
  userMedal?: UserMedal;
  index: number;
}

const rarityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  common: {
    color: '#8b95a5',
    bg: 'rgba(139,149,165,0.10)',
    border: 'rgba(139,149,165,0.25)',
    label: 'Common',
  },
  uncommon: {
    color: '#58f3b1',
    bg: 'rgba(88,243,177,0.10)',
    border: 'rgba(88,243,177,0.25)',
    label: 'Uncommon',
  },
  rare: {
    color: '#7aa7ff',
    bg: 'rgba(122,167,255,0.10)',
    border: 'rgba(122,167,255,0.25)',
    label: 'Rare',
  },
  epic: {
    color: '#c084fc',
    bg: 'rgba(192,132,252,0.10)',
    border: 'rgba(192,132,252,0.25)',
    label: 'Epic',
  },
  legendary: {
    color: '#ffd700',
    bg: 'rgba(255,215,0,0.10)',
    border: 'rgba(255,215,0,0.25)',
    label: 'Legendary',
  },
};

export default function MedalCard({ medal, userMedal, index }: MedalCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isUnlocked = !!userMedal;
  const rarity = rarityConfig[medal.rarity] ?? rarityConfig.common;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative group"
    >
      <div
        className={`relative glass rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-300 overflow-hidden ${
          isUnlocked
            ? 'hover:shadow-lg cursor-default'
            : ''
        }`}
        style={{
          borderColor: isUnlocked ? rarity.border : 'rgba(255,255,255,0.05)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        {/* Lock overlay for locked medals */}
        {!isUnlocked && (
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 z-10 flex items-center justify-center rounded-2xl">
            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Medal icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: rarity.bg }}
        >
          {medal.icon_url ? (
            <img src={medal.icon_url} alt={medal.name} className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-2xl">&#x1F3C5;</span>
          )}
        </div>

        {/* Medal name */}
        <p className="text-xs font-semibold text-[var(--text)] text-center leading-tight">
          {medal.name}
        </p>

        {/* Rarity badge */}
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ color: rarity.color, background: rarity.bg }}
        >
          {rarity.label}
        </span>

        {/* Unlock date */}
        {isUnlocked && userMedal && (
          <span className="text-[10px] text-[var(--text-secondary)]">
            {new Date(userMedal.unlocked_at).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-30 px-3 py-2 rounded-xl glass max-w-[200px] text-center"
          style={{ borderColor: rarity.border, borderWidth: '1px' }}
        >
          <p className="text-xs text-[var(--text)]">{medal.description}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
