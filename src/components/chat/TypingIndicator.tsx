'use client';

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  characterName?: string;
}

export default function TypingIndicator({ characterName }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div
        className="rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,157,0.25), rgba(231,76,111,0.15))',
          border: '1px solid rgba(255,107,157,0.15)',
        }}
      >
        {/* Animated dots */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-2 w-2 rounded-full bg-white/50"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Label */}
        <span className="ml-1 text-xs text-white/40">
          {characterName ? `${characterName} is typing...` : 'is typing...'}
        </span>
      </div>
    </motion.div>
  );
}
