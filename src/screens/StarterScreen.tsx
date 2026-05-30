import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { fetchPokemon } from '../services/pokeapi';
import { getRandomStarters } from '../data/starters';
import type { Pokemon } from '../types/pokemon';
import { PokemonSprite } from '../components/pokemon/PokemonSprite';
import { TypeBadge } from '../components/ui/TypeBadge';
import { Button } from '../components/ui/Button';
import { TYPE_COLORS } from '../data/typeChart';

export function StarterScreen() {
  const { addPokemon, setScreen } = useGameStore();
  const [starters, setStarters] = useState<Pokemon[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const ids = getRandomStarters(3);
    setLoading(true);
    Promise.all(ids.map((id) => fetchPokemon(id, 8)))
      .then((mons) => {
        setStarters(mons);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    setConfirming(true);
    addPokemon(starters[selectedIndex]);
    setTimeout(() => setScreen('map'), 600);
  };

  const selected = selectedIndex !== null ? starters[selectedIndex] : null;
  const accent = selected ? TYPE_COLORS[selected.types[0]] : '#8b5cf6';

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            style={{ background: `radial-gradient(ellipse at 50% 30%, ${accent} 0%, transparent 65%)` }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-7 relative z-10"
      >
        <h1 className="text-2xl font-black text-white">Choisis ton starter</h1>
        <p className="text-white/40 text-sm mt-1">Ton partenaire pour cette aventure</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center gap-4 mt-12">
          <motion.div
            className="w-12 h-12 border-[3px] border-violet-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/40 text-sm">Chargement des Pokémon…</p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-md flex flex-col gap-3 relative z-10">
            {starters.map((pokemon, i) => {
              const isSelected = selectedIndex === i;
              const color = TYPE_COLORS[pokemon.types[0]];
              return (
                <motion.button
                  key={pokemon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIndex(i)}
                  className="relative flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200"
                  style={{
                    background: isSelected
                      ? `linear-gradient(100deg, ${color}22 0%, rgba(17,18,27,0.9) 70%)`
                      : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${isSelected ? color : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isSelected ? `0 0 24px ${color}33` : undefined,
                  }}
                >
                  <div
                    className="shrink-0 rounded-xl flex items-center justify-center"
                    style={{ width: 80, height: 80, background: `radial-gradient(circle, ${color}1f, transparent 70%)` }}
                  >
                    <PokemonSprite
                      id={pokemon.id}
                      name={pokemon.displayName}
                      isShiny={pokemon.isShiny}
                      artwork
                      px={76}
                      animate={false}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-white truncate">{pokemon.displayName}</h2>
                      {pokemon.isShiny && <span className="text-yellow-400 text-sm">★</span>}
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      {pokemon.types.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))}
                    </div>
                    <div className="flex gap-3 mt-2 text-[11px] text-white/45">
                      <span>PV {pokemon.baseStats.hp}</span>
                      <span>Atq {pokemon.baseStats.atk}</span>
                      <span>Vit {pokemon.baseStats.speed}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: color }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="w-full max-w-md mt-6 relative z-10">
            <Button
              size="lg"
              fullWidth
              onClick={handleConfirm}
              disabled={selectedIndex === null || confirming}
            >
              {confirming ? '✓ C\'est parti !' : selected ? `Choisir ${selected.displayName}` : 'Sélectionne un Pokémon'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
