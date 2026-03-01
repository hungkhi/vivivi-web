'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const currencyPackages = [
  { id: 'pink', name: 'Pink', vcoin: 1000, ruby: 10, price: '$1.99', color: 'from-pink-400 to-pink-600', popular: false },
  { id: 'brown', name: 'Brown', vcoin: 4200, ruby: 42, price: '$4.99', color: 'from-amber-700 to-amber-900', popular: false },
  { id: 'silver', name: 'Silver', vcoin: 11000, ruby: 110, price: '$9.99', color: 'from-slate-300 to-slate-500', popular: false },
  { id: 'gold', name: 'Gold', vcoin: 24000, ruby: 240, price: '$19.99', color: 'from-yellow-400 to-amber-500', popular: true },
  { id: 'titanium', name: 'Titanium', vcoin: 67500, ruby: 675, price: '$49.99', color: 'from-slate-400 to-slate-600', popular: false },
  { id: 'diamond', name: 'Diamond', vcoin: 150000, ruby: 1500, price: '$99.99', color: 'from-cyan-300 to-blue-500', popular: false },
];

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    features: ['2 free characters', 'Basic chat', 'Limited energy', 'Ads supported'],
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: ['All Pro characters', 'Unlimited chat', 'More energy', 'Voice calls', 'No ads'],
    highlight: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '$19.99',
    period: '/month',
    features: ['ALL characters', 'Unlimited everything', 'Max energy', 'Video calls', 'Exclusive content', 'Priority support'],
    highlight: false,
  },
];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<'currency' | 'subscription'>('currency');

  const handlePurchase = async (packageId: string) => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'currency', packageId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/characters" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="font-[family-name:var(--font-heading)] text-xl font-semibold">Shop</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl glass mb-8">
          {(['currency', 'subscription'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab === 'currency' ? 'VCoin & Ruby' : 'Subscription'}
            </button>
          ))}
        </div>

        {/* Currency Packages */}
        {activeTab === 'currency' && (
          <div>
            {/* 2x Bonus Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl p-6 mb-8"
              style={{ background: 'linear-gradient(135deg, rgba(255,107,157,0.15), rgba(255,215,0,0.1))' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-gold)]/10 rounded-full blur-[60px]" />
              <p className="text-[var(--accent-gold)] text-xs font-semibold tracking-wider uppercase mb-1">Limited Time</p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">2X Bonus Active</h2>
              <p className="text-white/50 text-sm mt-1">Get double rewards on all packages</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currencyPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative glass rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:border-[var(--accent-pink)]/30 hover:shadow-[0_0_30px_rgba(255,107,157,0.1)] ${
                    pkg.popular ? 'ring-1 ring-[var(--accent-gold)]/50' : ''
                  }`}
                  onClick={() => handlePurchase(pkg.id)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--accent-gold)] text-black text-[10px] font-bold uppercase">
                      Best Value
                    </div>
                  )}

                  {/* Gradient icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-3`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  </div>

                  <p className="text-white font-semibold text-sm">{pkg.name}</p>
                  <p className="text-[var(--accent-gold)] text-lg font-bold">{pkg.vcoin.toLocaleString()}</p>
                  <p className="text-[var(--accent-pink)] text-xs">+{pkg.ruby} Ruby</p>

                  <div className="mt-3 py-2 rounded-lg text-center text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(231,76,111,0.2))' }}
                  >
                    {pkg.price}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        {activeTab === 'subscription' && (
          <div className="space-y-4">
            {subscriptionPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass rounded-2xl p-6 transition-all duration-300 ${
                  plan.highlight
                    ? 'ring-1 ring-[var(--accent-pink)]/50 shadow-[0_0_40px_rgba(255,107,157,0.1)]'
                    : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-2.5 left-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    style={{ background: 'linear-gradient(135deg, #ff6b9d, #e74c6f)', color: 'white' }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/40 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  {plan.current ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/60">Current</span>
                  ) : (
                    <button
                      className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #ff6b9d, #e74c6f)' }}
                    >
                      Upgrade
                    </button>
                  )}
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                      <svg className="w-4 h-4 text-[var(--accent-mint)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
