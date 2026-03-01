'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  thumbnail: string;
  price: number;
  currencyType: 'vcoin' | 'ruby';
  currentBalance: number;
  loading?: boolean;
}

export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  itemName,
  thumbnail,
  price,
  currencyType,
  currentBalance,
  loading = false,
}: PurchaseModalProps) {
  const canAfford = currentBalance >= price;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass rounded-2xl p-6 w-full max-w-sm"
          >
            {/* Item preview */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 ring-2 ring-[var(--accent-pink)]/30">
                <img
                  src={thumbnail}
                  alt={itemName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white text-center">
                {itemName}
              </h3>
            </div>

            {/* Price display */}
            <div className="glass rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] text-sm">Price</span>
                <div className="flex items-center gap-1.5">
                  {currencyType === 'vcoin' ? (
                    <svg className="w-4 h-4 text-[var(--accent-gold)]" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#0b0b10" fontWeight="bold">V</text>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[var(--accent-ruby)]" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12,2 22,12 12,22 2,12" />
                    </svg>
                  )}
                  <span className={`font-semibold ${currencyType === 'vcoin' ? 'text-[var(--accent-gold)]' : 'text-[var(--accent-ruby)]'}`}>
                    {price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-[var(--text-secondary)] text-sm">Your balance</span>
                <span className={`text-sm font-medium ${canAfford ? 'text-white' : 'text-[var(--danger)]'}`}>
                  {currentBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Insufficient funds warning */}
            {!canAfford && (
              <div className="mb-4 p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20">
                <p className="text-[var(--danger)] text-sm text-center">
                  Not enough {currencyType === 'vcoin' ? 'VCoins' : 'Rubies'}
                </p>
                <a
                  href="/shop"
                  className="block mt-1 text-center text-xs text-[var(--accent-pink)] hover:text-white transition-colors"
                >
                  Get More &rarr;
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={!canAfford || loading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-gold)] disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--accent-pink)]/20 transition-all duration-200"
              >
                {loading ? 'Buying...' : 'Buy'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
