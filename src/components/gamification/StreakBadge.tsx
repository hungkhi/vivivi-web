'use client';

import { motion } from 'framer-motion';

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 group cursor-default"
    >
      {/* Fire icon with animated effect */}
      <motion.span
        className="text-lg relative"
        whileHover={{
          scale: [1, 1.3, 1.1, 1.25, 1],
          rotate: [0, -8, 8, -4, 0],
        }}
        transition={{ duration: 0.6 }}
      >
        <span className="relative z-10">&#x1F525;</span>
        {/* Glow behind the fire */}
        <span className="absolute inset-0 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 text-lg">
          &#x1F525;
        </span>
      </motion.span>

      {/* Streak count */}
      <span
        className="text-lg font-bold"
        style={{
          background: 'linear-gradient(135deg, #ffd700, #ff6b9d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {streak}
      </span>

      {/* Label */}
      <span className="text-xs text-[var(--text-secondary)] font-medium">day streak</span>
    </motion.div>
  );
}
