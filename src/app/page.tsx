'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const features = [
  {
    title: 'Chat',
    description: 'Deep conversations that feel real. She remembers, she cares.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
  },
  {
    title: 'Voice',
    description: 'Hear her voice. Natural, expressive, and uniquely hers.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
  },
  {
    title: 'Customize',
    description: 'Dress her up. Change outfits, scenes, and moods.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
  },
];

const placeholderAvatars = [
  { gradient: 'from-pink-500 to-rose-400' },
  { gradient: 'from-violet-500 to-purple-400' },
  { gradient: 'from-amber-400 to-orange-500' },
  { gradient: 'from-cyan-400 to-blue-500' },
  { gradient: 'from-emerald-400 to-teal-500' },
  { gradient: 'from-fuchsia-500 to-pink-400' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://pub-14a49f54cd754145a7362876730a1a52.r2.dev/loading.png"
            alt=""
            className="h-full w-full object-cover"
          />
          {/* Dark overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/70 via-[var(--bg)]/40 to-[var(--bg)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/50 via-transparent to-[var(--bg)]/50" />
        </div>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--accent-pink)]/10 blur-[120px]" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
          {/* Logo / brand */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.5em] text-[var(--accent-pink)]/80"
          >
            VIVIVI
          </motion.p>

          {/* Main heading */}
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-[family-name:var(--font-heading)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tight"
          >
            <span className="gradient-text">Meet Her</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-lg text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
          >
            Your dream companion, brought to life in stunning 3D.
            <br className="hidden sm:block" />
            Chat, hear her voice, and make every moment yours.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/characters"
              className="group relative mt-10 inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-medium text-white transition-all duration-300 pulse-glow hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ff6b9d, #e74c6f)',
              }}
            >
              <span>Start Free</span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-10 w-6 rounded-full border border-white/20 flex items-start justify-center pt-2"
          >
            <div className="h-2 w-1 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== CHARACTER PREVIEW SECTION ===== */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-light text-white">
              Choose Your <span className="gradient-text">Companion</span>
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              Each one unique. Each one waiting for you.
            </p>
          </motion.div>

          {/* Avatar grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 max-w-xl mx-auto">
            {placeholderAvatars.map((avatar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div
                  className={`aspect-square rounded-full bg-gradient-to-br ${avatar.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,107,157,0.3)]`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-24 px-6">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[var(--accent-blue)]/5 blur-[100px]" />

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:border-[var(--accent-pink)]/20 hover:shadow-[0_0_40px_rgba(255,107,157,0.08)]"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 text-[var(--accent-pink)]">
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="relative py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[var(--text-secondary)] text-sm tracking-wide">
            No account needed. Start chatting instantly.
          </p>
          <Link
            href="/characters"
            className="mt-6 inline-flex items-center gap-2 text-[var(--accent-pink)] hover:text-white transition-colors duration-300 text-sm font-medium"
          >
            <span>Enter VIVIVI</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-[var(--text-secondary)]/40">
            VIVIVI -- 2026
          </p>
        </div>
      </section>
    </div>
  );
}
