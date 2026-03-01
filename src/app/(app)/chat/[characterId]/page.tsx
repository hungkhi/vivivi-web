'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore } from '@/lib/stores/character-store';
import { useChatStore } from '@/lib/stores/chat-store';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  const { characters, selectedCharacter, selectCharacter, loadCharacters } = useCharacterStore();
  const { messages, isSending, loadMessages, sendMessage, clearMessages, setCharacterId } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load character data
  useEffect(() => {
    if (characters.length === 0) {
      loadCharacters();
    }
  }, [characters.length, loadCharacters]);

  // Select character once loaded
  useEffect(() => {
    if (characters.length > 0 && characterId) {
      const char = characters.find(c => c.id === characterId);
      if (char) {
        selectCharacter(char);
      }
    }
  }, [characters, characterId, selectCharacter]);

  // Load messages for this character
  useEffect(() => {
    if (characterId) {
      setCharacterId(characterId);
      loadMessages(characterId);
    }
    return () => {
      clearMessages();
    };
  }, [characterId, setCharacterId, loadMessages, clearMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* VRM Scene Background (dynamic import placeholder) */}
      <div className="absolute inset-0 bg-[var(--bg)]">
        {/* VRM scene will be rendered here via dynamic import */}
        {/* Fallback gradient background */}
        <div className="h-full w-full bg-gradient-to-b from-[#0d0d15] via-[#0b0b10] to-[#080810]" />
      </div>

      {/* Vignette overlay */}
      <div className="pointer-events-none absolute inset-0 z-10" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6"
      >
        {/* Back button */}
        <button
          onClick={() => router.push('/characters')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>

        {/* Character name badge */}
        <AnimatePresence>
          {selectedCharacter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-full px-4 py-1.5 flex items-center gap-2"
            >
              {selectedCharacter.avatar && (
                <img
                  src={selectedCharacter.avatar}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-white">
                {selectedCharacter.name}
              </span>
              <span className="h-2 w-2 rounded-full bg-[var(--accent-mint)] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer for centering */}
        <div className="w-9" />
      </motion.div>

      {/* Chat messages area */}
      <div
        ref={scrollContainerRef}
        className="relative z-20 flex-1 overflow-y-auto px-4 pb-4 sm:px-6"
      >
        <div className="mx-auto max-w-2xl space-y-3 pt-4">
          {/* Welcome message when no messages */}
          {messages.length === 0 && !isSending && selectedCharacter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--accent-pink)]/30">
                {selectedCharacter.avatar ? (
                  <img
                    src={selectedCharacter.avatar}
                    alt={selectedCharacter.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-pink-500 to-rose-400" />
                )}
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white mb-1">
                {selectedCharacter.name}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-xs">
                Say hello to start your conversation...
              </p>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatBubble key={msg.id || `msg-${i}`} message={msg} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isSending && <TypingIndicator characterName={selectedCharacter?.name} />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="relative z-20">
        <div className="mx-auto max-w-2xl px-4 pb-4 sm:px-6 sm:pb-6">
          <ChatInput onSend={handleSend} disabled={isSending} />
        </div>
      </div>
    </div>
  );
}
