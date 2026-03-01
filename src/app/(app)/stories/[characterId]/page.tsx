'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fetchStories, fetchUserStories, unlockStory, markStoryRead } from '@/lib/api/stories';
import { fetchCharacter } from '@/lib/api/characters';
import type { CharacterStory, UserCharacterStory, Character } from '@/lib/supabase/types';
import StoryReader from '@/components/stories/StoryReader';

export default function StoriesPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [stories, setStories] = useState<CharacterStory[]>([]);
  const [userStories, setUserStories] = useState<UserCharacterStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlocking, setUnlocking] = useState<string | null>(null);

  // Reader state
  const [readerOpen, setReaderOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const userStoryMap = new Map(userStories.map((us) => [us.story_id, us]));

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [charData, storyData, userData] = await Promise.all([
        fetchCharacter(characterId),
        fetchStories(characterId),
        fetchUserStories(characterId),
      ]);
      setCharacter(charData);
      setStories(storyData);
      setUserStories(userData);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStoryClick = async (story: CharacterStory, index: number) => {
    const userStory = userStoryMap.get(story.id);
    const isUnlocked = userStory?.is_unlocked ?? false;

    if (isUnlocked) {
      setActiveStoryIndex(index);
      setReaderOpen(true);
      return;
    }

    // Unlock the story
    setUnlocking(story.id);
    try {
      await unlockStory(story.id, story.energy_cost);
      await loadData();
      // Open after unlocking
      setActiveStoryIndex(index);
      setReaderOpen(true);
    } catch {
      // Not enough energy or error
    } finally {
      setUnlocking(null);
    }
  };

  const handleFinishRead = async () => {
    const story = stories[activeStoryIndex];
    if (!story) return;
    try {
      await markStoryRead(story.id);
      await loadData();
    } catch {
      // silent
    }
  };

  const activeStory = stories[activeStoryIndex];
  const activeUserStory = activeStory ? userStoryMap.get(activeStory.id) : undefined;

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[var(--accent-pink)]/5 blur-[120px]" />

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-[var(--accent-pink)]/60">
            VIVIVI
          </p>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 text-center"
        >
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-light text-white">
            <span className="gradient-text">{character?.name || ''}</span> Stories
          </h1>
          <p className="mt-2 text-[var(--text-secondary)] text-sm">
            Unlock chapters to discover their story
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl shimmer" />
            ))}
          </div>
        )}

        {/* Chapter list */}
        {!isLoading && (
          <div className="space-y-4">
            {stories.map((story, i) => {
              const userStory = userStoryMap.get(story.id);
              const isUnlocked = userStory?.is_unlocked ?? false;
              const isRead = userStory?.is_read ?? false;
              const isUnlockingThis = unlocking === story.id;

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  onClick={() => !isUnlockingThis && handleStoryClick(story, i)}
                  className={`relative glass rounded-xl p-5 cursor-pointer transition-all duration-300 hover:border-[var(--accent-pink)]/30 ${
                    isUnlocked && !isRead ? 'ring-1 ring-[var(--accent-pink)]/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Chapter number */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isRead
                        ? 'bg-[var(--accent-mint)]/20 text-[var(--accent-mint)]'
                        : isUnlocked
                        ? 'bg-[var(--accent-pink)]/20 text-[var(--accent-pink)]'
                        : 'bg-white/5 text-[var(--text-secondary)]'
                    }`}>
                      {isRead ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        story.chapter_number
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-[family-name:var(--font-heading)] text-lg font-medium ${
                        isUnlocked ? 'text-white' : 'text-[var(--text-secondary)]'
                      }`}>
                        {isUnlocked ? story.title : `Chapter ${story.chapter_number}`}
                      </h3>
                      <p className={`mt-1 text-sm line-clamp-2 ${
                        isUnlocked ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]/50 blur-sm select-none'
                      }`}>
                        {story.summary}
                      </p>
                    </div>

                    {/* Status / cost */}
                    <div className="flex-shrink-0">
                      {isUnlockingThis ? (
                        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-pink)] border-t-transparent animate-spin" />
                      ) : !isUnlocked ? (
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full glass text-xs font-medium">
                          <svg className="w-3.5 h-3.5 text-[var(--accent-mint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-[var(--accent-mint)]">{story.energy_cost}</span>
                        </div>
                      ) : isUnlocked && !isRead ? (
                        <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-pink)] animate-pulse" />
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && stories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">No stories available yet</p>
          </motion.div>
        )}
      </div>

      {/* Story Reader */}
      {activeStory && (
        <StoryReader
          story={activeStory}
          open={readerOpen}
          onClose={() => setReaderOpen(false)}
          onPrev={activeStoryIndex > 0 ? () => setActiveStoryIndex(activeStoryIndex - 1) : null}
          onNext={activeStoryIndex < stories.length - 1 ? () => setActiveStoryIndex(activeStoryIndex + 1) : null}
          isFirstRead={!(activeUserStory?.is_read ?? false)}
          onFinishRead={handleFinishRead}
        />
      )}
    </div>
  );
}
