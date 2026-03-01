'use client';

import { useState, useRef, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    // Max 3 lines (~72px)
    el.style.height = `${Math.min(el.scrollHeight, 72)}px`;
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      adjustHeight();
    },
    [adjustHeight]
  );

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const hasText = text.trim().length > 0;

  return (
    <div className="glass rounded-2xl flex items-end gap-2 p-2 transition-all duration-200 focus-within:border-[var(--accent-pink)]/20">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Say something..."
        rows={1}
        className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]/50 outline-none disabled:opacity-40"
        style={{ maxHeight: '72px' }}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={disabled || !hasText}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
          hasText && !disabled
            ? 'bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-ruby)] text-white shadow-lg shadow-[var(--accent-pink)]/20 hover:scale-105 active:scale-95'
            : 'bg-white/5 text-[var(--text-secondary)]/30'
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
}
