import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { PokemonSprite } from '../components/pokemon/PokemonSprite';
import { generateShopStock } from '../data/items';
import type { ShopItem } from '../types/game';

const RARITY_STYLES: Record<string, { border: string; badge: string; label: string }> = {
  common:   { border: 'border-white/15',    badge: 'bg-white/10 text-white/50',          label: 'Commun' },
  uncommon: { border: 'border-green-500/30', badge: 'bg-green-500/20 text-green-300',     label: 'Peu commun' },
  rare:     { border: 'border-blue-500/30',  badge: 'bg-blue-500/20 text-blue-300',       label: 'Rare' },
  epic:     { border: 'border-purple-500/40', badge: 'bg-purple-500/25 text-purple-300',  label: 'Épique' },
};

const RARITY_BAR: Record<string, string> = {
  common: 'bg-white/30',
  uncommon: 'bg-green-400',
  rare: 'bg-blue-400',
  epic: 'bg-purple-400',
};

export function ShopScreen() {
  const {
    pendingShop,
    setPendingShop,
    coins,
    spendCoins,
    addItem,
    playerTeam,
    updateTeam,
    setScreen,
  } = useGameStore();

  const [stock, setStock] = useState<ShopItem[]>(pendingShop ?? []);
  const [equipFor, setEquipFor] = useState<number | null>(null); // shop item index awaiting equip target
  const [refreshCount, setRefreshCount] = useState(0);

  const REFRESH_COST = 50;

  const handleRefresh = () => {
    if (coins < REFRESH_COST) return;
    spendCoins(REFRESH_COST);
    const fresh = generateShopStock(5);
    setStock(fresh);
    setPendingShop(fresh);
    setRefreshCount(r => r + 1);
  };

  const handleBuy = (idx: number) => {
    const shopItem = stock[idx];
    if (!shopItem || shopItem.sold) return;
    if (coins < shopItem.price) return;

    if (shopItem.item.category === 'held') {
      setEquipFor(idx);
    } else {
      if (!spendCoins(shopItem.price)) return;
      addItem(shopItem.item);
      markSold(idx);
    }
  };

  const handleEquip = (pokemonIdx: number) => {
    if (equipFor === null) return;
    const shopItem = stock[equipFor];
    if (!shopItem) return;
    if (!spendCoins(shopItem.price)) return;

    const newTeam = playerTeam.map((p, i) =>
      i === pokemonIdx ? { ...p, heldItem: shopItem.item.effect.heldType ?? null } : p
    );
    updateTeam(newTeam);
    markSold(equipFor);
    setEquipFor(null);
  };

  const markSold = (idx: number) => {
    const updated = stock.map((s, i) => i === idx ? { ...s, sold: true } : s);
    setStock(updated);
    setPendingShop(updated);
  };

  const handleLeave = () => {
    setPendingShop(null);
    setScreen('map');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0d0d1a 0%, #12100a 100%)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-yellow-500/20 px-4 py-3"
        style={{ background: 'linear-gradient(to bottom, rgba(13,13,10,0.98), rgba(18,16,10,0.95))', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-black text-yellow-300">🏪 Boutique</h1>
            <p className="text-[11px] text-white/30">{stock.filter(s => !s.sold).length} objet(s) disponible(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={coins < REFRESH_COST}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border transition-all ${
                coins >= REFRESH_COST
                  ? 'border-yellow-500/40 text-yellow-300/70 hover:text-yellow-300 hover:border-yellow-500/60'
                  : 'border-white/10 text-white/20 cursor-not-allowed'
              }`}
            >
              🔄 {REFRESH_COST}🪙
            </button>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30">
              <span className="text-yellow-300 font-black text-sm">💰 {coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop items */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-md mx-auto space-y-3">
          {stock.map((shopItem, idx) => {
            const { item, price, sold } = shopItem;
            const styles = RARITY_STYLES[item.rarity] ?? RARITY_STYLES.common;
            const canAfford = coins >= price;

            return (
              <motion.div
                key={`${item.id}-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: sold ? 0.35 : 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className={`relative flex items-center gap-3 rounded-xl border px-3 py-3 overflow-hidden ${styles.border}`}
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                {/* Rarity strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${RARITY_BAR[item.rarity]}`} />

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 ml-1">
                  {item.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-white leading-tight">{item.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${styles.badge}`}>
                      {styles.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/45 leading-snug line-clamp-2">{item.description}</p>
                </div>

                {/* Price + Buy */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[11px] text-yellow-300/80 font-bold">💰 {price}</span>
                  {sold ? (
                    <span className="text-[11px] px-2 py-1 rounded-lg bg-white/5 text-white/30">Vendu</span>
                  ) : (
                    <button
                      onClick={() => handleBuy(idx)}
                      disabled={!canAfford}
                      className={`text-[11px] font-black px-3 py-1.5 rounded-lg transition-all ${
                        canAfford
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 hover:bg-yellow-500/30 active:scale-95'
                          : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                      }`}
                    >
                      Acheter
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {stock.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <p className="text-4xl mb-3">🏚️</p>
              <p>La boutique est vide.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 px-4 py-3 border-t border-white/10 bg-[#09090f]/90 backdrop-blur-md">
        <div className="max-w-md mx-auto">
          <Button size="lg" onClick={handleLeave} className="w-full">
            Quitter la boutique →
          </Button>
        </div>
      </div>

      {/* Equip overlay */}
      <AnimatePresence>
        {equipFor !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEquipFor(null)}
            />
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/15 overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #12121f, #0e0e18)' }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <div className="px-5 pt-5 pb-2">
                <h3 className="text-base font-black text-white mb-0.5">Équiper à…</h3>
                <p className="text-[12px] text-white/40">
                  {stock[equipFor!]?.item.name} → quel Pokémon ?
                </p>
              </div>

              <div className="px-4 pb-5 space-y-2 mt-3">
                {playerTeam.map((p, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleEquip(i)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all text-left"
                  >
                    <PokemonSprite id={p.id} name={p.displayName} isShiny={p.isShiny} px={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{p.displayName}</p>
                      <p className="text-[11px] text-white/35">
                        Niv. {p.level}
                        {p.heldItem ? ` · Tient : ${p.heldItem}` : ''}
                      </p>
                    </div>
                    {p.heldItem && (
                      <span className="text-[10px] text-orange-400/70 shrink-0">remplace</span>
                    )}
                  </motion.button>
                ))}

                <button
                  onClick={() => setEquipFor(null)}
                  className="w-full text-center text-white/30 hover:text-white/50 text-sm py-2 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
