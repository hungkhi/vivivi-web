'use client';

import { motion } from 'framer-motion';
import type { UserDailyQuest, UserLevelQuest } from '@/lib/supabase/types';

interface QuestCardProps {
  quest: UserDailyQuest | UserLevelQuest;
  index: number;
  onClaim: (id: string) => void;
}

const difficultyConfig: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#58f3b1', bg: 'rgba(88,243,177,0.12)' },
  medium: { label: 'Medium', color: '#ffc857', bg: 'rgba(255,200,87,0.12)' },
  hard: { label: 'Hard', color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)' },
};

export default function QuestCard({ quest, index, onClaim }: QuestCardProps) {
  const questData = quest.quest;
  if (!questData) return null;

  const difficulty = difficultyConfig[questData.difficulty] ?? difficultyConfig.easy;
  const progress = Math.min(quest.progress, questData.target_value);
  const progressPct = (progress / questData.target_value) * 100;
  const canClaim = quest.completed && !quest.claimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`glass rounded-2xl p-4 transition-all duration-300 ${
        quest.claimed ? 'opacity-50' : ''
      }`}
    >
      {/* Top row: description + difficulty */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm text-[var(--text)] font-medium leading-snug flex-1">
          {questData.description}
        </p>
        <span
          className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: difficulty.color, background: difficulty.bg }}
        >
          {difficulty.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[var(--text-secondary)]">Progress</span>
          <span className="text-xs text-[var(--text-secondary)]">
            {progress} / {questData.target_value}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 + 0.2 }}
            className="h-full rounded-full"
            style={{
              background: quest.completed
                ? 'linear-gradient(90deg, #58f3b1, #7aa7ff)'
                : 'linear-gradient(90deg, #ff6b9d, #ffd700)',
            }}
          />
        </div>
      </div>

      {/* Bottom row: rewards + claim */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {questData.reward_vcoin > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm">&#x1F4B0;</span>
              <span className="text-xs font-semibold text-[var(--accent-gold)]">
                {questData.reward_vcoin}
              </span>
            </div>
          )}
          {questData.reward_ruby > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm">&#x1F48E;</span>
              <span className="text-xs font-semibold text-[var(--accent-ruby)]">
                {questData.reward_ruby}
              </span>
            </div>
          )}
          {questData.reward_xp > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm">&#x2B50;</span>
              <span className="text-xs font-semibold text-[var(--accent-mint)]">
                {questData.reward_xp} XP
              </span>
            </div>
          )}
        </div>

        {quest.claimed ? (
          <div className="flex items-center gap-1.5 text-[var(--accent-mint)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-semibold">Claimed</span>
          </div>
        ) : canClaim ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClaim(quest.id)}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white pulse-glow"
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #e74c6f)',
            }}
          >
            Claim
          </motion.button>
        ) : (
          <span className="text-xs text-[var(--text-secondary)]">In progress</span>
        )}
      </div>
    </motion.div>
  );
}
