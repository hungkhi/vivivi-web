'use client';

import { motion } from 'framer-motion';
import type { Character } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';

interface CharacterCardProps {
  character: Character;
  index: number;
}

export default function CharacterCard({ character, index }: CharacterCardProps) {
  const router = useRouter();
  const isFree = character.tier === 'free';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => isFree && router.push(`/chat/${character.id}`)}
      className={`relative group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] ${!isFree ? 'opacity-60' : ''}`}
    >
      {/* Character avatar image */}
      <img
        src={character.avatar || character.thumbnail_url}
        alt={character.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[var(--accent-pink)]/20 via-transparent to-transparent" />

      {/* Character info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
          {character.name}
        </h3>
        {!isFree && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
            PRO
          </span>
        )}
      </div>

      {/* Lock icon for non-free */}
      {!isFree && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}
