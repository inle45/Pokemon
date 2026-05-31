import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { PokemonSprite } from '../components/pokemon/PokemonSprite';
import { HPBar } from '../components/ui/HPBar';
import { TypeBadge } from '../components/ui/TypeBadge';
import { getStatusLabel, getStatusColor } from '../utils/helpers';
import { TYPE_COLORS } from '../data/typeChart';
import type { Item } from '../types/game';
import type { Pokemon } from '../types/pokemon';

function canUseOn(item: Item, pokemon: Pokemon): boolean {
  switch (item.effect.type) {
    case 'heal': return pokemon.currentHP > 0 && pokemon.currentHP < pokemon.maxHP;
    case 'revive': return pokemon.currentHP <= 0;
    case 'cure_status': return pokemon.status !== null && pokemon.currentHP > 0;
    case 'level_up': return pokemon.currentHP > 0;
    case 'stat_boost': return pokemon.currentHP > 0;
    case 'held': return pokemon.currentHP > 0;
    default: return false;
  }
}

function HPDot({ pokemon }: { pokemon: Pokemon }) {
  const ratio = pokemon.currentHP / pokemon.maxHP;
  const color = pokemon.currentHP <= 0 ? '#374151'
    : ratio > 0.5 ? '#4ade80'
    : ratio > 0.25 ? '#fbbf24'
    : '#f87171';
  return <div className="w-2 h-2 rounded-full transition-colors" style={{ background: color }} />;
}

export function TeamScreen() {
  const { playerTeam, items, useItem, setScreen } = useGameStore();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [flashIdx, setFlashIdx] = useState<number | null>(null);

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;

  const handleSelectItem = (idx: number) => {
    setSelectedIdx(prev => prev === idx ? null : idx);
  };

  const handleUseOn = (pokemonIdx: number) => {
    if (!selectedItem || selectedIdx === null) return;
    if (!canUseOn(selectedItem, playerTeam[pokemonIdx])) return;
    useItem(selectedItem.id, pokemonIdx);
    setFlashIdx(pokemonIdx);
    setSelectedIdx(null);
    setTimeout(() => setFlashIdx(null), 900);
  };

  const healthyCount = playerTeam.filter(p => p.currentHP > 0).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #09090f 0%, #0d0d18 100%)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3 border-b border-white/10 bg-[#09090f]/90 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-black text-white">Mon Équipe</h1>
            <p className="text-[11px] text-white/35">
              {healthyCount}/{playerTeam.length} opérationnel{healthyCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {playerTeam.map((p, i) => <HPDot key={i} pokemon={p} />)}
          </div>
        </div>
      </div>

      {/* Team cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-md mx-auto space-y-3">
          {playerTeam.map((pokemon, idx) => {
            const typeColor = TYPE_COLORS[pokemon.types[0]] ?? '#888';
            const fainted = pokemon.currentHP <= 0;
            const canApply = selectedItem ? canUseOn(selectedItem, pokemon) : false;
            const flashing = flashIdx === idx;

            return (
              <motion.div
                key={idx}
                animate={flashing ? { scale: [1, 1.025, 1] } : {}}
                transition={{ duration: 0.35 }}
                onClick={() => canApply ? handleUseOn(idx) : undefined}
                className="relative rounded-xl overflow-hidden border transition-all"
                style={{
                  background: `linear-gradient(135deg, ${typeColor}10 0%, rgba(10,10,20,0.96) 100%)`,
                  borderColor: flashing ? '#4ade80'
                    : canApply ? typeColor + '90'
                    : typeColor + '28',
                  boxShadow: canApply ? `0 0 20px ${typeColor}35` : undefined,
                  cursor: canApply ? 'pointer' : 'default',
                  opacity: fainted && !canApply ? 0.55 : 1,
                }}
              >
                {/* Pulse overlay when selectable */}
                <AnimatePresence>
                  {canApply && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.04, 0.12, 0.04] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      style={{ background: typeColor }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative flex gap-3 p-3">
                  {/* Sprite */}
                  <div className="shrink-0 flex items-end justify-center" style={{ width: 56 }}>
                    <PokemonSprite id={pokemon.id} name={pokemon.displayName} isShiny={pokemon.isShiny} px={50} shadow={!fainted} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name + level */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-sm font-black text-white truncate">
                        {pokemon.displayName}
                        {pokemon.isShiny && <span className="text-yellow-400 ml-1 text-xs">★</span>}
                      </span>
                      <span className="text-[11px] text-white/40 shrink-0 font-mono">Lv.{pokemon.level}</span>
                    </div>

                    {/* Types + status */}
                    <div className="flex flex-wrap items-center gap-1 mb-2">
                      {pokemon.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                      {pokemon.status && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase"
                          style={{ color: getStatusColor(pokemon.status), background: getStatusColor(pokemon.status) + '22' }}
                        >
                          {getStatusLabel(pokemon.status)}
                        </span>
                      )}
                    </div>

                    {/* HP bar */}
                    <HPBar current={pokemon.currentHP} max={pokemon.maxHP} showNumbers height="sm" />

                    {/* Held item + XP */}
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-[10px] text-white/35 truncate min-w-0">
                        {pokemon.heldItem ? `🎽 ${pokemon.heldItem}` : 'Sans objet tenu'}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-14 h-1 rounded-full bg-white/8 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-400/70"
                            style={{ width: `${Math.min(100, (pokemon.xp / pokemon.xpToNext) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-white/20 font-mono">
                          {Math.floor((pokemon.xp / pokemon.xpToNext) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply hint */}
                {canApply && (
                  <div
                    className="px-3 pb-2.5"
                  >
                    <div
                      className="text-center text-[11px] font-bold py-1.5 rounded-lg"
                      style={{ background: typeColor + '18', color: typeColor }}
                    >
                      Appliquer ici →
                    </div>
                  </div>
                )}

                {/* Fainted overlay */}
                {fainted && !canApply && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center pointer-events-none">
                    <span className="text-red-400/70 font-black text-xs uppercase tracking-widest">K.O.</span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {playerTeam.length === 0 && (
            <p className="text-center text-white/30 py-12">Pas encore de Pokémon.</p>
          )}
        </div>
      </div>

      {/* Inventory strip */}
      <div className="border-t border-white/10 bg-[#07070e]/90 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">
          {items.length > 0 ? (
            <>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-2">
                Inventaire — {items.length} objet{items.length !== 1 ? 's' : ''} · sélectionne puis touche un Pokémon
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {items.map((item, idx) => {
                  const selected = selectedIdx === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSelectItem(idx)}
                      className="flex-shrink-0 flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl border transition-all"
                      style={{
                        background: selected ? 'rgba(234,179,8,0.14)' : 'rgba(255,255,255,0.04)',
                        borderColor: selected ? 'rgba(234,179,8,0.55)' : 'rgba(255,255,255,0.08)',
                        minWidth: 54,
                      }}
                    >
                      <span className="text-xl leading-none">{item.icon}</span>
                      <span className="text-[9px] text-white/55 text-center leading-tight" style={{ maxWidth: 50 }}>
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="mt-2 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                  >
                    <p className="text-[11px] text-yellow-300/85">
                      <span className="font-bold">{selectedItem.icon} {selectedItem.name}</span> —{' '}
                      {selectedItem.description}
                    </p>
                    <p className="text-[10px] text-white/35 mt-0.5">
                      Touche un Pokémon compatible pour l'utiliser.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <p className="text-[11px] text-white/20 text-center py-3">
              Inventaire vide — visite une boutique 🏪
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 px-4 py-3 border-t border-white/10 bg-[#09090f]/90 backdrop-blur-md">
        <div className="max-w-md mx-auto">
          <Button size="lg" onClick={() => setScreen('map')} className="w-full">
            ← Retour à la carte
          </Button>
        </div>
      </div>
    </div>
  );
}
