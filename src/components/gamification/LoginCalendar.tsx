'use client';

import { motion } from 'framer-motion';
import type { LoginReward, UserLoginReward } from '@/lib/supabase/types';

interface LoginCalendarProps {
  rewards: LoginReward[];
  userReward: UserLoginReward | null;
  onClaim: () => void;
}

export default function LoginCalendar({ rewards, userReward, onClaim }: LoginCalendarProps) {
  const currentDay = userReward?.current_day ?? 0;
  const today = new Date().toISOString().split('T')[0];
  const alreadyClaimed = userReward?.last_claim_date === today;

  // Show first 30 days (or however many exist)
  const displayRewards = rewards.slice(0, 30);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[var(--text)]">Daily Login Rewards</h3>
        {userReward && (
          <span className="text-xs text-[var(--text-secondary)]">
            {userReward.total_days_claimed} days total
          </span>
        )}
      </div>

      {/* 7-column grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {displayRewards.map((reward, i) => {
          const dayNum = reward.day_number;
          const isClaimed = dayNum <= currentDay;
          const isCurrent = dayNum === currentDay + 1;
          const isFuture = dayNum > currentDay + 1;

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.25 }}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-[var(--accent-pink)]/15 border border-[var(--accent-pink)]/40 shadow-[0_0_16px_rgba(255,107,157,0.25)]'
                  : isClaimed
                  ? 'bg-white/5'
                  : 'bg-white/[0.02]'
              } ${isFuture ? 'opacity-40' : ''}`}
            >
              {/* Day circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isClaimed
                    ? 'bg-[var(--accent-mint)]/20 text-[var(--accent-mint)]'
                    : isCurrent
                    ? 'bg-[var(--accent-pink)]/20 text-[var(--accent-pink)]'
                    : 'bg-white/5 text-[var(--text-secondary)]'
                }`}
              >
                {isClaimed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  dayNum
                )}
              </div>

              {/* Reward preview */}
              <div className="text-center">
                {reward.reward_vcoin > 0 && (
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px]">&#x1F4B0;</span>
                    <span className="text-[10px] text-[var(--accent-gold)]">{reward.reward_vcoin}</span>
                  </div>
                )}
                {reward.reward_ruby > 0 && (
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px]">&#x1F48E;</span>
                    <span className="text-[10px] text-[var(--accent-ruby)]">{reward.reward_ruby}</span>
                  </div>
                )}
                {reward.reward_energy > 0 && (
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px]">&#x26A1;</span>
                    <span className="text-[10px] text-[var(--accent-blue)]">{reward.reward_energy}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Claim button */}
      {!alreadyClaimed && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClaim}
          className="w-full py-3 rounded-xl text-sm font-bold text-white pulse-glow"
          style={{
            background: 'linear-gradient(135deg, #ff6b9d, #ffd700)',
          }}
        >
          Claim Today&apos;s Reward
        </motion.button>
      )}
      {alreadyClaimed && (
        <div className="text-center py-3 text-sm text-[var(--accent-mint)] font-medium">
          <svg className="w-4 h-4 inline mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Today&apos;s reward claimed! Come back tomorrow.
        </div>
      )}
    </div>
  );
}
