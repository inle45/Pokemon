import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { fetchPokemon } from '../services/pokeapi';
import { getRandomStarters } from '../data/starters';
import type { Pokemon } from '../types/pokemon';
import { PokemonSprite } from '../components/pokemon/PokemonSprite';
import { TypeBadge } from '../components/ui/TypeBadge';
import { StatsBar } from '../components/pokemon/StatsBar';
import { Button } from '../components/ui/Button';
import { HPBar } from '../components/ui/HPBar';

export function StarterScreen() {
  const { addPokemon, setScreen } = useGameStore();
  const [starters, setStarters] = useState<Pokemon[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const ids = getRandomStarters(3);
    setLoading(true);

    Promise.all(ids.map(id => fetchPokemon(id, 8)))
      .then(mons => {
        setStarters(mons);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleConfirm = async () => {
    if (selectedIndex === null) return;
    setConfirming(true);

    const starter = starters[selectedIndex];
    addPokemon(starter);

    setTimeout(() => {
      setScreen('map');
    }, 800);
  };

  const selected = selectedIndex !== null ? starters[selectedIndex] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient based on selected type */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.types[0]}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(ellipse at center, var(--type-color, #7038F8) 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-black text-white mb-2">Choose Your Starter</h1>
        <p className="text-white/50">Your partner for this adventure</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/50">Loading Pokémon...</p>
        </div>
      ) : (
        <>
          {/* Starter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
            {starters.map((pokemon, i) => {
              const isSelected = selectedIndex === i;

              return (
                <motion.div
                  key={pokemon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.04, y: -8 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedIndex(i)}
                  className={`
                    relative cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center
                    transition-all duration-300
                    ${isSelected
                      ? 'bg-white/15 border-2 border-white/40 shadow-2xl'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Glow */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                  {/* Shiny indicator */}
                  {pokemon.isShiny && (
                    <motion.div
                      className="absolute top-3 right-3 text-yellow-400 text-sm"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      ✦
                    </motion.div>
                  )}

                  {/* Sprite */}
                  <div className="mb-4">
                    <PokemonSprite
                      id={pokemon.id}
                      name={pokemon.displayName}
                      isShiny={pokemon.isShiny}
                      size="xl"
                      animate={isSelected}
                    />
                  </div>

                  {/* Name & ID */}
                  <p className="text-[10px] text-white/30 font-mono mb-1">
                    #{String(pokemon.id).padStart(3, '0')}
                  </p>
                  <h2 className="text-xl font-black text-white mb-2">{pokemon.displayName}</h2>

                  {/* Types */}
                  <div className="flex gap-1.5 mb-4">
                    {pokemon.types.map(t => (
                      <TypeBadge key={t} type={t} size="md" />
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="w-full">
                    <StatsBar stats={pokemon.baseStats} />
                  </div>

                  {/* HP bar */}
                  <div className="w-full mt-3">
                    <HPBar current={pokemon.currentHP} max={pokemon.maxHP} showNumbers />
                  </div>

                  {/* Moves preview */}
                  <div className="mt-4 w-full">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Moves</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {pokemon.moves.map(m => (
                        <span key={m.id} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓ Selected
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Confirm Button */}
          <AnimatePresence>
            {selectedIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-white/50 text-sm">
                  {starters[selectedIndex]?.displayName} will be your partner!
                </p>
                <Button
                  size="lg"
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="px-12"
                >
                  {confirming ? '✓ Choosing...' : '▶ Choose Starter'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
