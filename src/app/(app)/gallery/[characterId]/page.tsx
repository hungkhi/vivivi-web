'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fetchMedia, fetchOwnedMedia, purchaseMedia } from '@/lib/api/media';
import { fetchCharacter } from '@/lib/api/characters';
import { fetchCurrencyBalance } from '@/lib/api/currency';
import type { MediaItem, UserAsset, Character, UserCurrency } from '@/lib/supabase/types';
import MediaViewer from '@/components/gallery/MediaViewer';
import PurchaseModal from '@/components/ui/PurchaseModal';

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [ownedMedia, setOwnedMedia] = useState<UserAsset[]>([]);
  const [balance, setBalance] = useState<UserCurrency>({ vcoin: 0, ruby: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Purchase modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);

  const ownedIds = new Set(ownedMedia.map((a) => a.item_id));

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [charData, mediaData, owned, bal] = await Promise.all([
        fetchCharacter(characterId),
        fetchMedia(characterId),
        fetchOwnedMedia(),
        fetchCurrencyBalance(),
      ]);
      setCharacter(charData);
      setMedia(mediaData);
      setOwnedMedia(owned);
      setBalance(bal);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const unlockedMedia = media.filter((m) => ownedIds.has(m.id));

  const handleMediaClick = (item: MediaItem, index: number) => {
    if (ownedIds.has(item.id)) {
      // Open viewer with only unlocked items
      const unlockedIndex = unlockedMedia.findIndex((m) => m.id === item.id);
      setViewerIndex(unlockedIndex >= 0 ? unlockedIndex : 0);
      setViewerOpen(true);
    } else {
      setModalItem(item);
      setModalOpen(true);
    }
  };

  const handlePurchase = async () => {
    if (!modalItem) return;
    setPurchasing(true);
    try {
      const price = modalItem.price_vcoin || modalItem.price_ruby;
      const currency = modalItem.price_vcoin > 0 ? 'vcoin' as const : 'ruby' as const;
      await purchaseMedia(modalItem.id, price, currency);
      setModalOpen(false);
      setModalItem(null);
      await loadData();
    } catch {
      // error
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[var(--accent-pink)]/5 blur-[120px]" />

      <div className="mx-auto max-w-4xl">
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
            <span className="gradient-text">{character?.name || 'Gallery'}</span> Gallery
          </h1>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl shimmer" />
            ))}
          </div>
        )}

        {/* Media grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {media.map((item, i) => {
              const isOwned = ownedIds.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => handleMediaClick(item, i)}
                  className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-[var(--accent-pink)]/40 transition-all duration-300"
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt=""
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      !isOwned ? 'blur-lg scale-110' : ''
                    }`}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Video badge */}
                  {item.media_type === 'video' && isOwned && (
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full glass flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}

                  {/* Locked overlay */}
                  {!isOwned && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                      <div className="w-12 h-12 rounded-full glass flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full glass text-xs font-medium">
                        {item.price_vcoin > 0 ? (
                          <>
                            <svg className="w-3 h-3 text-[var(--accent-gold)]" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="10" />
                              <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#0b0b10" fontWeight="bold">V</text>
                            </svg>
                            <span className="text-[var(--accent-gold)]">{item.price_vcoin}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-[var(--accent-ruby)]" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12,2 22,12 12,22 2,12" />
                            </svg>
                            <span className="text-[var(--accent-ruby)]">{item.price_ruby}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && media.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">No media available yet</p>
          </motion.div>
        )}
      </div>

      {/* Media Viewer */}
      <MediaViewer
        items={unlockedMedia}
        currentIndex={viewerIndex}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNavigate={setViewerIndex}
      />

      {/* Purchase Modal */}
      {modalItem && (
        <PurchaseModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalItem(null);
          }}
          onConfirm={handlePurchase}
          itemName={`${character?.name || ''} Media`}
          thumbnail={modalItem.thumbnail || modalItem.url}
          price={modalItem.price_vcoin || modalItem.price_ruby}
          currencyType={modalItem.price_vcoin > 0 ? 'vcoin' : 'ruby'}
          currentBalance={modalItem.price_vcoin > 0 ? balance.vcoin : balance.ruby}
          loading={purchasing}
        />
      )}
    </div>
  );
}
