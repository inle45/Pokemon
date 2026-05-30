import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import type { GameMode } from '../types/game';
import { formatTime } from '../utils/helpers';

const GAME_MODES: { id: GameMode; name: string; desc: string; color: string; icon: string }[] = [
  {
    id: 'normal',
    name: 'Normal',
    desc: 'Classic roguelike experience. Full healing available.',
    color: 'from-blue-600 to-violet-600',
    icon: '⚔️',
  },
  {
    id: 'nuzlocke',
    name: 'Nuzlocke',
    desc: 'Fainted Pokémon are permanently lost. Catch only one per area.',
    color: 'from-red-700 to-orange-700',
    icon: '💀',
  },
  {
    id: 'challenge',
    name: 'Challenge',
    desc: 'Enemies are 5 levels higher. Fewer heal nodes.',
    color: 'from-yellow-700 to-amber-700',
    icon: '🔥',
  },
];

const TYPE_COLORS = [
  '#F08030', '#6890F0', '#78C850', '#F8D030', '#A040A0',
  '#F85888', '#7038F8', '#EE99AC', '#B8D8D8', '#98D8D8',
];

export function HomeScreen() {
  const { gameMode, setGameMode, runHistory, resetRun } = useGameStore();

  const startRun = () => {
    resetRun();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Animated background particles */}
      {TYPE_COLORS.map((color, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            width: 200 + Math.random() * 300,
            height: 200 + Math.random() * 300,
            left: `${(i / TYPE_COLORS.length) * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 80 - 40, 0],
            y: [0, Math.random() * 80 - 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Logo */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⚡
        </motion.div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-yellow-400 mb-3">
          PokéRogue
        </h1>
        <p className="text-white/50 text-lg">Pokémon Roguelike Autobattler</p>
        <p className="text-white/30 text-sm mt-1">All generations · All Pokémon · Endless runs</p>
      </motion.div>

      {/* Game Mode Selection */}
      <motion.div
        className="w-full max-w-2xl mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <h2 className="text-center text-sm font-bold text-white/50 uppercase tracking-widest mb-4">
          Choose Mode
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {GAME_MODES.map(mode => (
            <motion.button
              key={mode.id}
              onClick={() => setGameMode(mode.id)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`
                relative overflow-hidden rounded-xl p-4 text-left transition-all cursor-pointer
                ${gameMode === mode.id
                  ? `bg-gradient-to-br ${mode.color} border-2 border-white/30 shadow-lg`
                  : 'bg-white/5 border border-white/10 hover:border-white/20'
                }
              `}
            >
              <span className="text-2xl block mb-2">{mode.icon}</span>
              <p className="font-bold text-white">{mode.name}</p>
              <p className="text-xs text-white/60 mt-1">{mode.desc}</p>
              {gameMode === mode.id && (
                <motion.div
                  className="absolute top-2 right-2 text-white text-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button size="lg" onClick={startRun} className="px-16 py-5 text-xl font-black">
          ▶ Start Adventure
        </Button>
      </motion.div>

      {/* Run History */}
      {runHistory.length > 0 && (
        <motion.div
          className="w-full max-w-2xl mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3 text-center">
            Recent Runs
          </h2>
          <div className="flex flex-col gap-2">
            {runHistory.slice(0, 4).map(run => (
              <div
                key={run.id}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={run.result === 'win' ? 'text-green-400' : 'text-red-400'}>
                    {run.result === 'win' ? '🏆' : '💀'}
                  </span>
                  <div>
                    <p className="text-xs text-white font-semibold">
                      {run.mode.charAt(0).toUpperCase() + run.mode.slice(1)} Mode
                    </p>
                    <p className="text-[10px] text-white/40">
                      {new Date(run.date).toLocaleDateString()} · {run.regionsCleared}/5 regions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60">
                    {run.finalTeam.map(p => p.name).join(', ')}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {formatTime(run.stats.endTime! - run.stats.startTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom credits */}
      <motion.p
        className="absolute bottom-4 text-white/20 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Data from PokeAPI · All Pokémon Gen 1-9
      </motion.p>
    </div>
  );
}
