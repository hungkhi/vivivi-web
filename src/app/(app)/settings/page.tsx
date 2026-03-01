'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SettingsPage() {
  const [haptics, setHaptics] = useState(true);
  const [autoMusic, setAutoMusic] = useState(false);
  const [nsfw, setNsfw] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/characters" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="font-[family-name:var(--font-heading)] text-xl font-semibold">Settings</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-ruby)] flex items-center justify-center text-white text-xl font-bold">
              V
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Guest User</h3>
              <p className="text-white/40 text-sm">Sign up to save your progress</p>
            </div>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #ff6b9d, #e74c6f)' }}
            >
              Sign Up
            </Link>
          </div>
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Subscription</h3>
              <p className="text-white/40 text-sm mt-0.5">Free Plan</p>
            </div>
            <Link
              href="/shop"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 hover:bg-[var(--accent-gold)]/10 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <h3 className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-white/30">Preferences</h3>

          <ToggleRow label="Haptic Feedback" value={haptics} onChange={setHaptics} />
          <ToggleRow label="Auto Play Music" value={autoMusic} onChange={setAutoMusic} />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <h3 className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-white/30">Content</h3>

          <ToggleRow label="Enable NSFW" value={nsfw} onChange={setNsfw} subtitle="Show mature content" />
        </motion.div>

        {/* Legal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <h3 className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-white/30">Legal</h3>

          <LinkRow label="Terms of Service" href="#" />
          <LinkRow label="Privacy Policy" href="#" />
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <h3 className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-white/30">Support</h3>

          <LinkRow label="Report a Problem" href="#" />
          <LinkRow label="Feature Request" href="#" />
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <button className="w-full px-6 py-4 text-left text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm">
            Sign Out
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-6 py-4 text-left text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-colors text-sm border-t border-white/5"
          >
            Delete Account
          </button>
        </motion.div>

        {/* Version */}
        <p className="text-center text-white/20 text-xs pb-4">VIVIVI Web v1.0.0</p>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-white font-semibold text-lg">Delete Account?</h3>
            <p className="text-white/50 text-sm mt-2">This will permanently delete all your data, characters, and progress. This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/20 hover:bg-red-500/30 transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, subtitle, value, onChange }: { label: string; subtitle?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
      <div>
        <p className="text-sm text-white">{label}</p>
        {subtitle && <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-[var(--accent-pink)]' : 'bg-white/10'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
    >
      <span>{label}</span>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </a>
  );
}
