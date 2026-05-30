import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { formatTime } from '../utils/helpers';

export function GameOverScreen() {
  const {
    playerTeam,
    runStats,
    currentRegion,
    gameMode,
    saveRun,
    setScreen,
    setGameMode,
  } = useGameStore();

  const handleSaveAndMenu = () => {
    saveRun('loss');
    setScreen('home');
  };

  const handlePlayAgain = () => {
    saveRun('loss');
    useGameStore.getState().resetRun();
  };

  const runTime = runStats.endTime
    ? runStats.endTime - runStats.startTime
    : Date.now() - runStats.startTime;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Animated background */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.15) 0%, transparent 60%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative max-w-2xl w-full text-center">
        {/* Icon */}
        <motion.div
          className="text-8xl mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          💀
        </motion.div>

        <motion.h1
          className="text-5xl font-black text-red-400 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Defeated
        </motion.h1>

        <motion.p
          className="text-white/50 text-lg mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {gameMode === 'nuzlocke'
            ? 'Your Nuzlocke run has ended...'
            : 'Better luck next time, Trainer!'}
        </motion.p>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: 'Regions Cleared', value: `${currentRegion}/5` },
            { label: 'Battles Won', value: runStats.battlesWon },
            { label: 'Battles Lost', value: runStats.battlesLost },
            { label: 'Run Time', value: formatTime(runTime) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Final Team */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Final Team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {playerTeam.map((p, i) => (
              <PokemonCard key={`${p.id}-${i}`} pokemon={p} compact showHP index={i} />
            ))}
            {playerTeam.length === 0 && (
              <p className="col-span-3 text-white/30 text-sm py-4">No Pokémon remaining</p>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button variant="primary" size="lg" onClick={handlePlayAgain}>
            ↩ Try Again
          </Button>
          <Button variant="secondary" size="lg" onClick={handleSaveAndMenu}>
            🏠 Main Menu
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
