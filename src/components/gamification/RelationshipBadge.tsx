'use client';

import { motion } from 'framer-motion';
import type { CharacterRelationship } from '@/lib/supabase/types';

interface RelationshipBadgeProps {
  relationship: CharacterRelationship | null;
}

const STAGES: Record<string, { label: string; color: string; bgColor: string }> = {
  stranger: { label: 'Stranger', color: 'var(--text-secondary)', bgColor: 'rgba(139,149,165,0.15)' },
  friend: { label: 'Friend', color: 'var(--accent-blue)', bgColor: 'rgba(122,167,255,0.15)' },
  lover: { label: 'Lover', color: 'var(--accent-pink)', bgColor: 'rgba(255,107,157,0.15)' },
  soulmate: { label: 'Soulmate', color: 'var(--accent-gold)', bgColor: 'rgba(255,215,0,0.15)' },
};

function getStageConfig(stageKey: string) {
  return STAGES[stageKey] || STAGES.stranger;
}

function getXPProgress(relationship: CharacterRelationship): number {
  const xpPerLevel = 100;
  return (relationship.affection_xp % xpPerLevel) / xpPerLevel;
}

export default function RelationshipBadge({ relationship }: RelationshipBadgeProps) {
  if (!relationship) {
    const stage = STAGES.stranger;
    return (
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        style={{ background: stage.bgColor, color: stage.color }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        Stranger
      </div>
    );
  }

  const stage = getStageConfig(relationship.current_stage_key);
  const progress = getXPProgress(relationship);

  return (
    <div className="flex flex-col gap-1">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit"
        style={{ background: stage.bgColor, color: stage.color }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {stage.label}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: stage.color }}
        />
      </div>
    </div>
  );
}
