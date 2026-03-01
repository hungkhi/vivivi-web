'use client';

import { motion } from 'framer-motion';

interface LevelProgressBarProps {
  level: number;
  xp: number;
  xpToNextLevel?: number;
}

export default function LevelProgressBar({ level, xp, xpToNextLevel = 100 }: LevelProgressBarProps) {
  const progress = Math.min(xp / xpToNextLevel, 1);

  return (
    <div className="flex items-center gap-2">
      {/* Level badge */}
      <div className="flex-shrink-0 px-2 py-0.5 rounded-md bg-gradient-to-r from-[var(--accent-pink)]/20 to-[var(--accent-gold)]/20 border border-[var(--accent-pink)]/20">
        <span className="text-xs font-bold gradient-text">
          Lv.{level}
        </span>
      </div>

      {/* Progress bar + text */}
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-gold)]"
          />
        </div>
        <span className="text-[10px] text-[var(--text-secondary)]">
          {xp} / {xpToNextLevel} XP
        </span>
      </div>
    </div>
  );
}
