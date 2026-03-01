'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MediaItem } from '@/lib/supabase/types';

interface MediaViewerProps {
  items: MediaItem[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function MediaViewer({ items, currentIndex, open, onClose, onNavigate }: MediaViewerProps) {
  const item = items[currentIndex];
  const touchStartX = useRef(0);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, handlePrev, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 text-white/50 text-sm">
            {currentIndex + 1} / {items.length}
          </div>

          {/* Prev arrow */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {currentIndex < items.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Media content */}
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh]"
          >
            {item.media_type === 'video' ? (
              <video
                src={item.url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-xl"
              />
            ) : (
              <img
                src={item.url}
                alt=""
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
