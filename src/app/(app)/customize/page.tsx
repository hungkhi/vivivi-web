'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCharacterStore } from '@/lib/stores/character-store';
import { fetchCostumes, fetchOwnedCostumes, purchaseCostume } from '@/lib/api/costumes';
import { fetchBackgrounds, fetchOwnedBackgrounds, purchaseBackground } from '@/lib/api/backgrounds';
import { fetchCurrencyBalance } from '@/lib/api/currency';
import type { Costume, Background, UserAsset, UserCurrency } from '@/lib/supabase/types';
import CostumeCard from '@/components/customization/CostumeCard';
import BackgroundCard from '@/components/customization/BackgroundCard';
import PurchaseModal from '@/components/ui/PurchaseModal';

type Tab = 'outfits' | 'backgrounds';

export default function CustomizePage() {
  const router = useRouter();
  const { selectedCharacter } = useCharacterStore();
  const [tab, setTab] = useState<Tab>('outfits');
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [ownedCostumes, setOwnedCostumes] = useState<UserAsset[]>([]);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<UserAsset[]>([]);
  const [balance, setBalance] = useState<UserCurrency>({ vcoin: 0, ruby: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Purchase modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<{
    id: string;
    name: string;
    thumbnail: string;
    price: number;
    currencyType: 'vcoin' | 'ruby';
    type: 'costume' | 'background';
  } | null>(null);

  const ownedCostumeIds = new Set(ownedCostumes.map((a) => a.item_id));
  const ownedBackgroundIds = new Set(ownedBackgrounds.map((a) => a.item_id));

  const loadData = useCallback(async () => {
    if (!selectedCharacter) return;
    setIsLoading(true);
    try {
      const [costData, bgData, ownedC, ownedB, bal] = await Promise.all([
        fetchCostumes(selectedCharacter.id),
        fetchBackgrounds(),
        fetchOwnedCostumes(),
        fetchOwnedBackgrounds(),
        fetchCurrencyBalance(),
      ]);
      setCostumes(costData);
      setBackgrounds(bgData);
      setOwnedCostumes(ownedC);
      setOwnedBackgrounds(ownedB);
      setBalance(bal);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCostumeClick = (costume: Costume) => {
    if (ownedCostumeIds.has(costume.id)) {
      // Already owned - equip (no-op for now, could set active costume)
      return;
    }
    setModalItem({
      id: costume.id,
      name: costume.costume_name,
      thumbnail: costume.thumbnail || costume.url,
      price: costume.price_vcoin || costume.price_ruby,
      currencyType: costume.price_vcoin > 0 ? 'vcoin' : 'ruby',
      type: 'costume',
    });
    setModalOpen(true);
  };

  const handleBackgroundClick = (bg: Background) => {
    if (ownedBackgroundIds.has(bg.id)) {
      return;
    }
    setModalItem({
      id: bg.id,
      name: bg.name,
      thumbnail: bg.thumbnail || bg.image,
      price: bg.price_vcoin || bg.price_ruby,
      currencyType: bg.price_vcoin > 0 ? 'vcoin' : 'ruby',
      type: 'background',
    });
    setModalOpen(true);
  };

  const handlePurchase = async () => {
    if (!modalItem) return;
    setPurchasing(true);
    try {
      if (modalItem.type === 'costume') {
        await purchaseCostume(modalItem.id, modalItem.price, modalItem.currencyType);
      } else {
        await purchaseBackground(modalItem.id, modalItem.price, modalItem.currencyType);
      }
      setModalOpen(false);
      setModalItem(null);
      await loadData();
    } catch {
      // Could show error toast
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

        {/* Character name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-light text-white">
            Customize <span className="gradient-text">{selectedCharacter?.name || 'Character'}</span>
          </h1>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-2 mb-8 justify-center"
        >
          {(['outfits', 'backgrounds'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t
                  ? 'bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-gold)] text-white shadow-lg shadow-[var(--accent-pink)]/20'
                  : 'glass text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {t === 'outfits' ? 'Outfits' : 'Backgrounds'}
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className={`grid gap-4 ${tab === 'outfits' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-xl shimmer ${tab === 'outfits' ? 'aspect-square' : 'aspect-video'}`}
              />
            ))}
          </div>
        )}

        {/* Outfits grid */}
        {!isLoading && tab === 'outfits' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {costumes.map((costume, i) => (
              <CostumeCard
                key={costume.id}
                costume={costume}
                owned={ownedCostumeIds.has(costume.id)}
                equipped={selectedCharacter?.default_costume_id === costume.id}
                index={i}
                onClick={() => handleCostumeClick(costume)}
              />
            ))}
            {costumes.length === 0 && (
              <div className="col-span-full py-20 text-center text-[var(--text-secondary)] text-sm">
                No outfits available yet
              </div>
            )}
          </div>
        )}

        {/* Backgrounds grid */}
        {!isLoading && tab === 'backgrounds' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {backgrounds.map((bg, i) => (
              <BackgroundCard
                key={bg.id}
                background={bg}
                owned={ownedBackgroundIds.has(bg.id)}
                equipped={false}
                index={i}
                onClick={() => handleBackgroundClick(bg)}
              />
            ))}
            {backgrounds.length === 0 && (
              <div className="col-span-full py-20 text-center text-[var(--text-secondary)] text-sm">
                No backgrounds available yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {modalItem && (
        <PurchaseModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalItem(null);
          }}
          onConfirm={handlePurchase}
          itemName={modalItem.name}
          thumbnail={modalItem.thumbnail}
          price={modalItem.price}
          currencyType={modalItem.currencyType}
          currentBalance={modalItem.currencyType === 'vcoin' ? balance.vcoin : balance.ruby}
          loading={purchasing}
        />
      )}
    </div>
  );
}
