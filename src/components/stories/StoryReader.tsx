'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterStory } from '@/lib/supabase/types';

interface StoryReaderProps {
  story: CharacterStory;
  open: boolean;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  isFirstRead: boolean;
  onFinishRead: () => void;
}

export default function StoryReader({
  story,
  open,
  onClose,
  onPrev,
  onNext,
  isFirstRead,
  onFinishRead,
}: StoryReaderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const hasTriggeredRead = useRef(false);

  useEffect(() => {
    if (!open) {
      setScrollProgress(0);
      setShowReward(false);
      hasTriggeredRead.current = false;
    }
  }, [open, story.id]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const progress = scrollHeight <= clientHeight ? 1 : scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(progress, 1));

    // Mark as read when scrolled to bottom
    if (progress > 0.9 && !hasTriggeredRead.current) {
      hasTriggeredRead.current = true;
      onFinishRead();
      if (isFirstRead) {
        setShowReward(true);
      }
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1020 0%, #0b0b10 70%)' }}
        >
          {/* Scroll progress bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-gold)]"
              style={{ width: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-8 pt-6 pb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm">Close</span>
            </button>
            <span className="text-xs text-[var(--text-secondary)]">
              Chapter {story.chapter_number}
            </span>
          </div>

          {/* Content area */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 sm:px-8"
          >
            <div className="mx-auto max-w-2xl pb-32">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-light text-white mb-8 text-center leading-snug"
              >
                {story.title}
              </motion.h1>

              {/* Divider */}
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--accent-pink)]/40 to-transparent mx-auto mb-10" />

              {/* Story content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-[family-name:var(--font-heading)] text-lg sm:text-xl leading-relaxed text-[var(--text)] whitespace-pre-wrap"
                style={{ fontWeight: 300 }}
              >
                {story.content}
              </motion.div>
            </div>
          </div>

          {/* Navigation footer */}
          <div className="border-t border-white/5 px-4 sm:px-8 py-4">
            <div className="mx-auto max-w-2xl flex items-center justify-between">
              <button
                onClick={onPrev || undefined}
                disabled={!onPrev}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous Chapter
              </button>
              <button
                onClick={onNext || undefined}
                disabled={!onNext}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next Chapter
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Reward overlay on first completion */}
          <AnimatePresence>
            {showReward && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20"
                onClick={() => setShowReward(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center"
                >
                  <div className="text-4xl mb-4">&#127942;</div>
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white mb-2">
                    Chapter Complete!
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-6">
                    You earned rewards for reading this chapter
                  </p>
                  <div className="flex items-center justify-center gap-6 mb-6">
                    {story.reward_vcoin > 0 && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-5 h-5 text-[var(--accent-gold)]" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="10" />
                          <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#0b0b10" fontWeight="bold">V</text>
                        </svg>
                        <span className="text-[var(--accent-gold)] font-semibold">+{story.reward_vcoin}</span>
                      </div>
                    )}
                    {story.reward_xp > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[var(--accent-mint)] text-sm font-semibold">+{story.reward_xp} XP</span>
                      </div>
                    )}
                    {story.reward_ruby > 0 && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-5 h-5 text-[var(--accent-ruby)]" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12,2 22,12 12,22 2,12" />
                        </svg>
                        <span className="text-[var(--accent-ruby)] font-semibold">+{story.reward_ruby}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowReward(false)}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-gold)] hover:shadow-lg hover:shadow-[var(--accent-pink)]/20 transition-all duration-200"
                  >
                    Continue
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
