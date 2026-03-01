'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/characters');
    } catch (err) {
      setError((err as Error).message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError((err as Error).message || 'Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-pink)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-blue)]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold gradient-text">
            VIVIVI
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm">
            Welcome back, darling
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-pink)]/50 focus:ring-1 focus:ring-[var(--accent-pink)]/30 transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-pink)]/50 focus:ring-1 focus:ring-[var(--accent-pink)]/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-gold)] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="px-3 text-xs text-[var(--text-secondary)]">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] font-medium text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[var(--accent-pink)] hover:underline">
              Sign Up
            </Link>
          </p>
          <p>
            <Link
              href="/characters"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            >
              Continue as Guest
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
