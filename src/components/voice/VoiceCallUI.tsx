'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCallUIProps {
  characterName: string;
  agentId: string;
  onEnd: () => void;
  onCallModeChange?: (active: boolean) => void;
}

export default function VoiceCallUI({ characterName, agentId, onEnd, onCallModeChange }: VoiceCallUIProps) {
  const [duration, setDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(0.1));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onCallModeChange?.(true);
    // Simulate connection delay
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
      // Start call timer
      intervalRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    }, 2000);

    // Simulate waveform animation
    waveRef.current = setInterval(() => {
      setWaveform(prev => prev.map(() => 0.1 + Math.random() * 0.9));
    }, 150);

    return () => {
      clearTimeout(connectTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (waveRef.current) clearInterval(waveRef.current);
      onCallModeChange?.(false);
    };
  }, [onCallModeChange]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }, []);

  const handleEnd = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onEnd();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Character avatar glow */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[var(--accent-pink)]/20 rounded-full blur-[40px] scale-150" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-ruby)] flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{characterName[0]}</span>
            </div>
            {/* Pulsing ring */}
            {!isConnecting && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-[var(--accent-pink)]/40"
              />
            )}
          </div>

          {/* Name */}
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white mb-1">
            {characterName}
          </h2>

          {/* Status */}
          <p className="text-white/50 text-sm mb-6">
            {isConnecting ? 'Connecting...' : formatTime(duration)}
          </p>

          {/* Waveform */}
          {!isConnecting && (
            <div className="flex items-center gap-[3px] h-12 mb-10">
              {waveform.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: h }}
                  transition={{ duration: 0.15 }}
                  className="w-1 bg-[var(--accent-pink)] rounded-full origin-center"
                  style={{ height: '40px' }}
                />
              ))}
            </div>
          )}

          {/* Connecting spinner */}
          {isConnecting && (
            <div className="mb-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-white/20 border-t-[var(--accent-pink)] rounded-full"
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-6">
            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? 'bg-white/20' : 'bg-white/10'
              }`}
            >
              {isMuted ? (
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 19 5 5m14 0v4a2 2 0 0 1-2 2h0M12 18.75a6 6 0 0 1-6-6v-1.5" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              )}
            </button>

            {/* End Call */}
            <button
              onClick={handleEnd}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75 18 6m0 0 2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5a11.955 11.955 0 0 1-4.809-1.035 11.96 11.96 0 0 1-4.263-3.088 12.04 12.04 0 0 1-3.088-4.263A11.955 11.955 0 0 1 6.25 9.5" />
              </svg>
            </button>

            {/* Speaker */}
            <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            </button>
          </div>

          {/* Energy cost notice */}
          <p className="mt-8 text-white/30 text-xs">
            5 energy per 5 minutes
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
