'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ConversationMessage } from '@/lib/supabase/types';

interface ChatBubbleProps {
  message: ConversationMessage;
}

function formatRoleplay(text: string) {
  // Split by asterisks and render roleplay text in italic
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="text-white/60 not-italic" style={{ fontStyle: 'italic' }}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function formatTimestamp(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const [showTime, setShowTime] = useState(false);
  const isAgent = message.is_agent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
      onClick={() => setShowTime(prev => !prev)}
    >
      <div
        className={`relative max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAgent
            ? 'rounded-bl-md text-white'
            : 'rounded-br-md glass text-[var(--text)]'
        }`}
        style={
          isAgent
            ? {
                background: 'linear-gradient(135deg, rgba(255,107,157,0.25), rgba(231,76,111,0.15))',
                border: '1px solid rgba(255,107,157,0.15)',
              }
            : undefined
        }
      >
        {/* Message text */}
        <p className="whitespace-pre-wrap break-words">
          {formatRoleplay(message.message)}
        </p>

        {/* Timestamp */}
        {showTime && message.created_at && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-1.5 text-[10px] ${isAgent ? 'text-white/30' : 'text-[var(--text-secondary)]/50'}`}
          >
            {formatTimestamp(message.created_at)}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
