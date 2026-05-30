import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import type { Item } from '../types/game';
import type { Pokemon } from '../types/pokemon';

function ItemCard({ item, onSelect }: { item: Item; onSelect: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="cursor-pointer rounded-xl p-4 bg-white/5 border border-white/20 hover:border-white/40 transition-all"
    >
      <div className="text-3xl mb-2">{item.icon}</div>
      <h3 className="font-bold text-white">{item.name}</h3>
      <p className="text-xs text-white/50 mt-1">{item.description}</p>
      <div className="mt-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
          item.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300' :
          item.rarity === 'rare' ? 'bg-blue-500/30 text-blue-300' :
          item.rarity === 'uncommon' ? 'bg-green-500/30 text-green-300' :
          'bg-white/10 text-white/50'
        }`}>
          {item.rarity}
        </span>
      </div>
    </motion.div>
  );
}

export function RewardScreen() {
  const {
    pendingReward,
    setPendingReward,
    playerTeam,
    addPokemon,
    addItem,
    addCoins,
    healTeam,
    setScreen,
    pendingEvolution,
    confirmEvolution,
    currentNode,
    lastBattleResult,
  } = useGameStore();

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [rewardTaken, setRewardTaken] = useState(false);
  const [showEvolution, setShowEvolution] = useState(!!pendingEvolution);

  const handleTakePokemon = (pokemon: Pokemon) => {
    if (playerTeam.length >= 6) {
      setSelectedPokemon(pokemon);
    } else {
      addPokemon(pokemon);
      setRewardTaken(true);
    }
  };

  const handleSwapPokemon = (swapIndex: number) => {
    if (!selectedPokemon) return;
    const newTeam = [...playerTeam];
    newTeam[swapIndex] = selectedPokemon;
    useGameStore.getState().updateTeam(newTeam);
    setSelectedPokemon(null);
    setRewardTaken(true);
  };

  const handleTakeItem = (item: Item) => {
    addItem(item);
    setRewardTaken(true);
  };

  const handleContinue = () => {
    setPendingReward(null);
    setScreen('map');
  };

  const handleConfirmEvolution = () => {
    confirmEvolution();
    setShowEvolution(false);
  };

  // Evolution popup
  if (showEvolution && pendingEvolution) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center max-w-md"
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🌟
          </motion.div>
          <h2 className="text-3xl font-black text-yellow-400 mb-2">Evolution!</h2>
          <p className="text-white/70 mb-8">
            {pendingEvolution.pokemon.displayName} is evolving into{' '}
            <strong className="text-white">{pendingEvolution.evolvesTo.displayName}</strong>!
          </p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <img
                src={pendingEvolution.pokemon.sprite}
                alt={pendingEvolution.pokemon.displayName}
                style={{ imageRendering: 'pixelated', width: 96, height: 96 }}
              />
              <p className="text-white/50 text-sm mt-1">{pendingEvolution.pokemon.displayName}</p>
            </div>
            <motion.span
              className="text-4xl"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
            <div className="text-center">
              <motion.img
                src={pendingEvolution.evolvesTo.sprite}
                alt={pendingEvolution.evolvesTo.displayName}
                style={{ imageRendering: 'pixelated', width: 96, height: 96 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.8 }}
              />
              <p className="text-yellow-400 text-sm mt-1 font-bold">{pendingEvolution.evolvesTo.displayName}</p>
            </div>
          </div>

          <Button onClick={handleConfirmEvolution} size="lg">
            ✓ Confirm Evolution
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (!pendingReward) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-white/50 mb-4">
          {lastBattleResult === 'win' ? 'Victory! But no rewards available.' : 'Battle complete.'}
        </p>
        <Button onClick={handleContinue}>Back to Map</Button>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-white mb-2">
            {lastBattleResult === 'win' ? '🏆 Victory!' : '🎁 Reward'}
          </h1>
          <p className="text-white/50">
            {currentNode?.type === 'boss' ? 'Region boss defeated!' : 'Choose your reward!'}
          </p>
        </motion.div>

        {!rewardTaken ? (
          <div className="space-y-6">
            {/* Pokémon choices */}
            {pendingReward.type === 'pokemon' && pendingReward.choices && pendingReward.choices.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">
                  {currentNode?.type === 'wild' ? 'Catch This Pokémon?' : 'Choose a Pokémon'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pendingReward.choices.map((pokemon, i) => (
                    <motion.div
                      key={`${pokemon.id}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        onClick={() => handleTakePokemon(pokemon)}
                        showStats
                        showHP
                        index={i}
                      />
                    </motion.div>
                  ))}
                </div>
                {pendingReward.choices.length > 0 && (
                  <div className="text-center mt-3">
                    <button
                      onClick={() => setRewardTaken(true)}
                      className="text-white/30 hover:text-white/50 text-sm underline"
                    >
                      Skip — don't add Pokémon
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Item choices */}
            {pendingReward.items && pendingReward.items.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingReward.items.map((item, i) => (
                    <motion.div
                      key={`${item.id}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <ItemCard item={item} onSelect={() => handleTakeItem(item)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-5xl mb-4">✓</div>
            <p className="text-white/60 mb-8">Reward collected!</p>
            <Button size="lg" onClick={handleContinue}>
              Continue →
            </Button>
          </motion.div>
        )}

        {/* Team swap modal */}
        <Modal
          isOpen={!!selectedPokemon && playerTeam.length >= 6}
          onClose={() => setSelectedPokemon(null)}
          title="Team Full — Swap a Pokémon?"
        >
          <p className="text-white/50 text-sm mb-4">
            Your team is full. Select a Pokémon to replace with{' '}
            <strong className="text-white">{selectedPokemon?.displayName}</strong>:
          </p>
          <div className="flex flex-col gap-2">
            {playerTeam.map((p, i) => (
              <div key={i} className="cursor-pointer" onClick={() => handleSwapPokemon(i)}>
                <PokemonCard pokemon={p} compact showHP />
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full text-center text-white/30 hover:text-white/50 text-sm"
            onClick={() => setSelectedPokemon(null)}
          >
            Cancel
          </button>
        </Modal>

        {rewardTaken && (
          <div className="text-center mt-8">
            <Button size="lg" onClick={handleContinue}>
              Back to Map →
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
