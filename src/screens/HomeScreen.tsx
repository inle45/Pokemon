import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import type { GameMode } from '../types/game';

const GAME_MODES: { id: GameMode; name: string; desc: string; icon: string; accent: string }[] = [
  { id: 'normal', name: 'Normal', desc: 'Expérience roguelike classique. Soins disponibles.', icon: '⚔️', accent: '#8b5cf6' },
  { id: 'nuzlocke', name: 'Nuzlocke', desc: 'Les Pokémon K.O. sont perdus à jamais.', icon: '💀', accent: '#ef4444' },
  { id: 'challenge', name: 'Challenge', desc: 'Ennemis +5 niveaux. Moins de soins.', icon: '🔥', accent: '#f59e0b' },
];

export function HomeScreen() {
  const { gameMode, setGameMode, runHistory, resetRun } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 relative overflow-hidden">
      {/* Soft background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 55%)' }}
      />

      {/* Logo */}
      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-6xl mb-2"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⚡
        </motion.div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-yellow-400">
          PokéRogue
        </h1>
        <p className="text-white/40 text-sm mt-1">Roguelike Pokémon · Toutes générations</p>
      </motion.div>

      {/* Mode selection */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 text-center">Mode de jeu</h2>
        <div className="flex flex-col gap-2.5">
          {GAME_MODES.map((mode) => {
            const active = gameMode === mode.id;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setGameMode(mode.id)}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200"
                style={{
                  background: active ? `linear-gradient(100deg, ${mode.accent}22, rgba(17,18,27,0.9) 70%)` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${active ? mode.accent : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: active ? `0 0 22px ${mode.accent}33` : undefined,
                }}
              >
                <span
                  className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${mode.accent}1f` }}
                >
                  {mode.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{mode.name}</p>
                  <p className="text-xs text-white/45 mt-0.5">{mode.desc}</p>
                </div>
                {active && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: mode.accent }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Start button */}
      <motion.div
        className="w-full max-w-md mt-6 relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button size="lg" fullWidth onClick={() => resetRun()}>
          ▶ Commencer l'aventure
        </Button>
      </motion.div>

      {/* Run history */}
      {runHistory.length > 0 && (
        <motion.div
          className="w-full max-w-md mt-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Parties récentes</h2>
          <div className="flex flex-col gap-2">
            {runHistory.slice(0, 5).map((run) => (
              <div
                key={run.id}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 border ${
                  run.result === 'win' ? 'border-yellow-500/25 bg-yellow-500/5' : 'border-white/8 bg-white/4'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>{run.result === 'win' ? '🏆' : '💀'}</span>
                  <div>
                    <p className="text-xs text-white font-semibold capitalize">{run.mode}</p>
                    <p className="text-[10px] text-white/35">{run.regionsCleared}/5 régions · {run.stats.battlesWon} victoires</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${run.result === 'win' ? 'text-yellow-400' : 'text-white/25'}`}>
                  {run.result === 'win' ? 'VICTOIRE' : 'DÉFAITE'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <p className="text-white/20 text-[10px] mt-8 relative z-10">Données : PokeAPI · Pokémon Gen 1-9</p>
    </div>
  );
}
