'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCharacterStore } from '@/lib/stores/character-store';
import CharacterCard from '@/components/character/CharacterCard';

export default function CharactersPage() {
  const router = useRouter();
  const { characters, isLoading, error, loadCharacters } = useCharacterStore();

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[var(--accent-pink)]/5 blur-[120px]" />

      {/* Header */}
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-10"
        >
          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span className="text-sm">Back</span>
          </button>

          {/* Brand */}
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-[var(--accent-pink)]/60">
            VIVIVI
          </p>
        </motion.div>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 text-center"
        >
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Choose Your <span className="gradient-text">Companion</span>
          </h1>
          <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base">
            Select a character to begin your experience
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 mx-auto max-w-md text-center"
          >
            <div className="glass rounded-xl p-4">
              <p className="text-[var(--danger)] text-sm">{error}</p>
              <button
                onClick={() => loadCharacters()}
                className="mt-2 text-xs text-[var(--accent-pink)] hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl shimmer"
              />
            ))}
          </div>
        )}

        {/* Character grid */}
        {!isLoading && characters.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {characters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && characters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">No characters available yet</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
