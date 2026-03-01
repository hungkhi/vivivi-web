'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuestStore } from '@/lib/stores/quest-store';
import QuestCard from '@/components/gamification/QuestCard';
import LoginCalendar from '@/components/gamification/LoginCalendar';
import MedalCard from '@/components/gamification/MedalCard';
import StreakBadge from '@/components/gamification/StreakBadge';
import type { Medal } from '@/lib/supabase/types';

const tabs = ['Daily', 'Quests', 'Medals'] as const;
type Tab = (typeof tabs)[number];

export default function QuestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Daily');
  const {
    dailyQuests,
    levelQuests,
    loginRewards,
    userLoginReward,
    medals,
    isLoading,
    fetchAll,
    claimDailyReward,
    claimLevelReward,
    claimDailyLogin,
  } = useQuestStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Group level quests by level_required
  const groupedLevelQuests = levelQuests.reduce(
    (acc, q) => {
      const level = q.quest?.level_required ?? 0;
      if (!acc[level]) acc[level] = [];
      acc[level].push(q);
      return acc;
    },
    {} as Record<number, typeof levelQuests>
  );
  const sortedLevels = Object.keys(groupedLevelQuests)
    .map(Number)
    .sort((a, b) => a - b);

  // Build medal map: all medals from user_medals, plus we show them
  const allMedals: Medal[] = medals.map((um) => um.medal).filter(Boolean) as Medal[];
  const unlockedMedalIds = new Set(medals.map((um) => um.medal_id));

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-[var(--panel-border)]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          {/* Back button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-[var(--text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Title */}
          <h1 className="text-lg font-bold gradient-text flex-1">Quest Center</h1>

          {/* Streak badge */}
          {userLoginReward && userLoginReward.total_days_claimed > 0 && (
            <StreakBadge streak={userLoginReward.total_days_claimed} />
          )}
        </div>

        {/* Tab navigation */}
        <div className="max-w-2xl mx-auto px-4 flex relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-3 text-sm font-medium text-center transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-[var(--accent-pink)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="quest-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #ff6b9d, #ffd700)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl shimmer" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* DAILY TAB */}
            {activeTab === 'Daily' && (
              <motion.div
                key="daily"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Login Calendar */}
                <LoginCalendar
                  rewards={loginRewards}
                  userReward={userLoginReward}
                  onClaim={claimDailyLogin}
                />

                {/* Daily Quest Cards */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Today&apos;s Quests
                  </h3>
                  {dailyQuests.length === 0 ? (
                    <div className="glass rounded-2xl p-8 text-center">
                      <p className="text-[var(--text-secondary)] text-sm">
                        No daily quests available. Check back later!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dailyQuests.map((quest, i) => (
                        <QuestCard
                          key={quest.id}
                          quest={quest}
                          index={i}
                          onClaim={claimDailyReward}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* QUESTS TAB */}
            {activeTab === 'Quests' && (
              <motion.div
                key="quests"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {sortedLevels.length === 0 ? (
                  <div className="glass rounded-2xl p-8 text-center">
                    <p className="text-[var(--text-secondary)] text-sm">
                      No level quests unlocked yet. Keep leveling up!
                    </p>
                  </div>
                ) : (
                  sortedLevels.map((level) => (
                    <div key={level}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-gold)]/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-[var(--accent-gold)]">{level}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                          Level {level} Quests
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {groupedLevelQuests[level].map((quest, i) => (
                          <QuestCard
                            key={quest.id}
                            quest={quest}
                            index={i}
                            onClaim={claimLevelReward}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* MEDALS TAB */}
            {activeTab === 'Medals' && (
              <motion.div
                key="medals"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                {allMedals.length === 0 ? (
                  <div className="glass rounded-2xl p-8 text-center">
                    <p className="text-[var(--text-secondary)] text-sm">
                      No medals discovered yet. Complete quests to earn medals!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {allMedals.map((medal, i) => (
                      <MedalCard
                        key={medal.id}
                        medal={medal}
                        userMedal={
                          unlockedMedalIds.has(medal.id)
                            ? medals.find((um) => um.medal_id === medal.id)
                            : undefined
                        }
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
