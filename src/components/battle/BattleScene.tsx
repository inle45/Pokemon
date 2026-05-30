import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pokemon } from '../../types/pokemon';
import { useBattleStore } from '../../stores/battleStore';
import { PokemonSprite } from '../pokemon/PokemonSprite';
import { BattleHPBox, PokeballRow } from './BattleHUD';

interface BattleSceneProps {
  playerTeam: Pokemon[];
  enemyTeam: Pokemon[];
  onBattleEnd: (winner: 'player' | 'enemy') => void;
}

const SPEEDS = [
  { ms: 1200, label: '0.5×' },
  { ms: 800, label: '1×' },
  { ms: 400, label: '2×' },
  { ms: 150, label: '4×' },
];

export function BattleScene({ playerTeam, enemyTeam, onBattleEnd }: BattleSceneProps) {
  const {
    events,
    currentEventIndex,
    playerTeamHP,
    enemyTeamHP,
    isAnimating,
    isComplete,
    winner,
    activePlayerIndex,
    activeEnemyIndex,
    attackingAnimation,
    damagedAnimation,
    speed,
    nextEvent,
    setAnimating,
    setSpeed,
  } = useBattleStore();

  const advance = useCallback(() => {
    if (isComplete || isAnimating) return;
    setAnimating(true);
    nextEvent();
    setTimeout(() => setAnimating(false), speed * 0.7);
  }, [isComplete, isAnimating, nextEvent, setAnimating, speed]);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => winner && onBattleEnd(winner), 1800);
      return () => clearTimeout(t);
    }
    if (events.length === 0) return;
    const t = setTimeout(advance, speed);
    return () => clearTimeout(t);
  }, [currentEventIndex, isComplete, events.length, advance, speed, winner, onBattleEnd]);

  const enemy = enemyTeam[activeEnemyIndex];
  const player = playerTeam[activePlayerIndex];
  const enemyHP = enemyTeamHP[activeEnemyIndex] ?? enemy?.currentHP ?? 0;
  const playerHP = playerTeamHP[activePlayerIndex] ?? player?.currentHP ?? 0;

  const enemyAttacking = attackingAnimation?.side === 'enemy' && attackingAnimation.index === activeEnemyIndex;
  const playerAttacking = attackingAnimation?.side === 'player' && attackingAnimation.index === activePlayerIndex;
  const enemyDamaged = damagedAnimation?.side === 'enemy' && damagedAnimation.index === activeEnemyIndex;
  const playerDamaged = damagedAnimation?.side === 'player' && damagedAnimation.index === activePlayerIndex;

  const currentMessage = events[currentEventIndex]?.message ?? 'The battle begins!';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      {/* Speed control */}
      <div className="flex items-center justify-end gap-1">
        {SPEEDS.map((s) => (
          <button
            key={s.ms}
            onClick={() => setSpeed(s.ms)}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors ${
              speed === s.ms ? 'bg-violet-500 text-white' : 'bg-white/8 text-white/50 hover:bg-white/15'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Battle arena */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        style={{
          aspectRatio: '4 / 3',
          background:
            'linear-gradient(180deg, #2a3a5e 0%, #3d5a7a 38%, #6b8e9e 62%, #8fb89a 62%, #6b9e6f 100%)',
        }}
      >
        {/* distant hills */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: '40%',
            height: '24%',
            background: 'radial-gradient(ellipse 80% 100% at 30% 100%, #5f8a6e 0%, transparent 70%)',
            opacity: 0.6,
          }}
        />

        {/* Enemy HP box — top left */}
        {enemy && (
          <div className="absolute top-3 left-3 z-10">
            <BattleHPBox pokemon={enemy} hp={enemyHP} align="left" />
          </div>
        )}

        {/* Enemy platform + sprite — upper right */}
        <div className="absolute" style={{ top: '14%', right: '8%' }}>
          <div className="relative flex flex-col items-center">
            <div
              className="absolute -z-0 rounded-[100%]"
              style={{
                bottom: -6,
                width: 120,
                height: 30,
                background: 'radial-gradient(ellipse, rgba(80,120,70,0.55) 0%, transparent 70%)',
              }}
            />
            <AnimatePresence mode="wait">
              {enemy && (
                <motion.div
                  key={`enemy-${activeEnemyIndex}`}
                  initial={{ opacity: 0, scale: 0.6, y: -10 }}
                  animate={{
                    opacity: enemyHP <= 0 ? 0 : 1,
                    scale: 1,
                    x: enemyAttacking ? -14 : 0,
                    y: enemyAttacking ? 10 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className={enemyDamaged ? 'animate-shake' : ''}
                >
                  <motion.div animate={enemyAttacking ? { filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] } : {}}>
                    <PokemonSprite
                      id={enemy.id}
                      name={enemy.displayName}
                      isShiny={enemy.isShiny}
                      size="lg"
                      shadow
                      animate={!isComplete}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Player platform + sprite (back view) — lower left */}
        <div className="absolute" style={{ bottom: '6%', left: '8%' }}>
          <div className="relative flex flex-col items-center">
            <div
              className="absolute -z-0 rounded-[100%]"
              style={{
                bottom: -6,
                width: 150,
                height: 36,
                background: 'radial-gradient(ellipse, rgba(50,90,50,0.6) 0%, transparent 70%)',
              }}
            />
            <AnimatePresence mode="wait">
              {player && (
                <motion.div
                  key={`player-${activePlayerIndex}`}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{
                    opacity: playerHP <= 0 ? 0 : 1,
                    scale: 1,
                    x: playerAttacking ? 14 : 0,
                    y: playerAttacking ? -10 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className={playerDamaged ? 'animate-shake' : ''}
                >
                  <motion.div animate={playerAttacking ? { filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] } : {}}>
                    <PokemonSprite
                      id={player.id}
                      name={player.displayName}
                      isShiny={player.isShiny}
                      size="xl"
                      back
                      shadow
                      animate={!isComplete}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Player HP box — lower right */}
        {player && (
          <div className="absolute bottom-3 right-3 z-10">
            <BattleHPBox pokemon={player} hp={playerHP} showNumbers align="right" />
          </div>
        )}

        {/* Victory / defeat overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className={`text-2xl font-black px-6 py-3 rounded-2xl border ${
                  winner === 'player'
                    ? 'text-green-300 border-green-400/40 bg-green-500/15'
                    : 'text-red-300 border-red-400/40 bg-red-500/15'
                }`}
              >
                {winner === 'player' ? '🏆 Victoire !' : '💀 Défaite…'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Team poké balls */}
      <div className="flex items-center justify-between px-1">
        <PokeballRow team={playerTeam} teamHP={playerTeamHP} align="left" />
        <PokeballRow team={enemyTeam} teamHP={enemyTeamHP} align="right" />
      </div>

      {/* Message box */}
      <div className="rounded-2xl bg-[#11121b]/90 border border-white/15 px-4 py-3 min-h-[64px] flex items-center shadow-lg">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentEventIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-sm text-white/90 leading-snug"
          >
            {currentMessage}
            {!isComplete && (
              <motion.span
                className="inline-block ml-1 w-1.5 h-3 bg-white/60 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
