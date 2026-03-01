'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface LevelUpOverlayProps {
  level: number;
  rewardVcoin?: number;
  rewardRuby?: number;
  visible: boolean;
  onDismiss: () => void;
}

export default function LevelUpOverlay({
  level,
  rewardVcoin = 0,
  rewardRuby = 0,
  visible,
  onDismiss,
}: LevelUpOverlayProps) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onDismiss}
        >
          {/* Dark backdrop with radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(255,107,157,0.15) 0%, rgba(0,0,0,0.85) 60%)',
            }}
          />

          {/* CSS-only confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="absolute block rounded-sm"
                style={{
                  width: `${4 + Math.random() * 6}px`,
                  height: `${4 + Math.random() * 6}px`,
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  background: [
                    '#ff6b9d',
                    '#ffd700',
                    '#58f3b1',
                    '#7aa7ff',
                    '#c084fc',
                    '#e74c6f',
                  ][i % 6],
                  opacity: 0.8,
                  animation: `confetti-fall ${2 + Math.random() * 3}s ease-in ${Math.random() * 1.5}s forwards`,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative z-10 flex flex-col items-center gap-6 px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Level number */}
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className="text-8xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #ff6b9d, #ffd700, #ff6b9d)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient-shift 3s ease infinite',
                  filter: 'drop-shadow(0 0 30px rgba(255,107,157,0.4))',
                }}
              >
                {level}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-3xl font-bold text-white tracking-wide"
            >
              Level Up!
            </motion.h1>

            {/* Rewards */}
            {(rewardVcoin > 0 || rewardRuby > 0) && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6"
              >
                {rewardVcoin > 0 && (
                  <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
                    <span className="text-xl">&#x1F4B0;</span>
                    <span className="text-lg font-bold text-[var(--accent-gold)]">
                      +{rewardVcoin}
                    </span>
                  </div>
                )}
                {rewardRuby > 0 && (
                  <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
                    <span className="text-xl">&#x1F48E;</span>
                    <span className="text-lg font-bold text-[var(--accent-ruby)]">
                      +{rewardRuby}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Continue button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="mt-2 px-8 py-3 rounded-full text-sm font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #ff6b9d, #e74c6f)',
                boxShadow: '0 0 30px rgba(255,107,157,0.3)',
              }}
            >
              Continue
            </motion.button>
          </motion.div>

          {/* Inline styles for confetti animation */}
          <style jsx>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
              }
            }
            @keyframes gradient-shift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
