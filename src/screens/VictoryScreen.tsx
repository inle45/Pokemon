import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { formatTime } from '../utils/helpers';

const CONFETTI_COLORS = ['#f43f5e', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899'];

function Confetti() {
  const pieces = Array.from({ length: 30 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

export function VictoryScreen() {
  const {
    playerTeam,
    runStats,
    currentRegion,
    saveRun,
    setScreen,
  } = useGameStore();

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) {
      saveRun('win');
      setSaved(true);
    }
  }, []);

  const handleMenu = () => {
    setScreen('home');
  };

  const handlePlayAgain = () => {
    useGameStore.getState().resetRun();
  };

  const runTime = runStats.endTime
    ? runStats.endTime - runStats.startTime
    : Date.now() - runStats.startTime;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Confetti />

      {/* Glowing background */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.2) 0%, transparent 60%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      <div className="relative max-w-3xl w-full text-center">
        {/* Trophy */}
        <motion.div
          className="text-9xl mb-4"
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
        >
          🏆
        </motion.div>

        <motion.h1
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          Champion!
        </motion.h1>

        <motion.p
          className="text-white/60 text-xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          You conquered all 5 regions and became the PokéRogue Champion!
        </motion.p>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { label: 'Regions Conquered', value: '5/5', color: 'text-yellow-400' },
            { label: 'Battles Won', value: runStats.battlesWon, color: 'text-green-400' },
            { label: 'Pokémon Caught', value: runStats.pokemonCaught, color: 'text-blue-400' },
            { label: 'Run Time', value: formatTime(runTime), color: 'text-purple-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Hall of Fame Team */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-sm font-bold text-yellow-400/60 uppercase tracking-widest mb-4">
            ⭐ Hall of Fame — Your Champion Team
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {playerTeam.map((p, i) => (
              <PokemonCard key={`${p.id}-${i}`} pokemon={p} showHP showStats index={i} />
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button size="lg" onClick={handlePlayAgain} className="px-10">
            ↩ New Run
          </Button>
          <Button variant="secondary" size="lg" onClick={handleMenu}>
            🏠 Main Menu
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
