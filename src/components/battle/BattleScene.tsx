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
  { ms: 1400, label: '1×' },
  { ms: 700, label: '2×' },
  { ms: 280, label: '4×' },
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
    setTimeout(() => setAnimating(false), speed * 0.65);
  }, [isComplete, isAnimating, nextEvent, setAnimating, speed]);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => winner && onBattleEnd(winner), 1600);
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

  const currentMessage = events[currentEventIndex]?.message ?? 'Le combat commence !';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-2.5">

      {/* === ARENA === */}
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>

        {/* Sky gradient — four bands like DS games */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #4a7cbf 0%, #6fa8d8 35%, #a8cce0 55%, #c8e0c0 55%, #7ab870 70%, #5a9850 100%)',
        }} />

        {/* Far-hill silhouette */}
        <div className="absolute" style={{
          bottom: '41%', left: 0, right: 0, height: '14%',
          background: 'linear-gradient(to bottom, #6aaa5e, #4e8d44)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          opacity: 0.55,
        }} />

        {/* Near grass band */}
        <div className="absolute" style={{
          bottom: 0, left: 0, right: 0, height: '46%',
          background: 'linear-gradient(180deg, #6ab855 0%, #4d9440 45%, #3a7032 100%)',
        }} />

        {/* Enemy dirt platform */}
        <div className="absolute" style={{
          top: '18%', right: '6%',
          width: 110, height: 22,
          background: 'radial-gradient(ellipse, #c8a060 30%, #8a6030 100%)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        }} />

        {/* Player dirt platform */}
        <div className="absolute" style={{
          bottom: '22%', left: '4%',
          width: 136, height: 28,
          background: 'radial-gradient(ellipse, #c8a060 30%, #8a6030 100%)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        }} />

        {/* === Enemy HP box (top-left) === */}
        {enemy && (
          <div className="absolute top-2 left-2 z-10">
            <BattleHPBox pokemon={enemy} hp={enemyHP} align="left" />
          </div>
        )}

        {/* === Enemy sprite (top-right platform) === */}
        <div className="absolute z-10" style={{ top: '4%', right: '7%' }}>
          <AnimatePresence mode="wait">
            {enemy && (
              <motion.div
                key={`enemy-${activeEnemyIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: enemyHP <= 0 ? 0 : 1, x: enemyAttacking ? -16 : 0, y: enemyAttacking ? 8 : 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.22 }}
                className={enemyDamaged ? 'animate-shake' : ''}
              >
                <motion.div animate={enemyAttacking ? { filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'] } : {}}>
                  <PokemonSprite
                    id={enemy.id}
                    name={enemy.displayName}
                    isShiny={enemy.isShiny}
                    px={88}
                    shadow
                    animate={!isComplete}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === Player HP box (bottom-right) === */}
        {player && (
          <div className="absolute bottom-2 right-2 z-10">
            <BattleHPBox pokemon={player} hp={playerHP} showNumbers align="right" />
          </div>
        )}

        {/* === Player sprite (bottom-left, back view) === */}
        <div className="absolute z-10" style={{ bottom: '10%', left: '4%' }}>
          <AnimatePresence mode="wait">
            {player && (
              <motion.div
                key={`player-${activePlayerIndex}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: playerHP <= 0 ? 0 : 1, x: playerAttacking ? 18 : 0, y: playerAttacking ? -10 : 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
                className={playerDamaged ? 'animate-shake' : ''}
              >
                <motion.div animate={playerAttacking ? { filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'] } : {}}>
                  <PokemonSprite
                    id={player.id}
                    name={player.displayName}
                    isShiny={player.isShiny}
                    px={110}
                    back
                    shadow
                    animate={!isComplete}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Victory / defeat overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className={`text-xl font-black px-7 py-3 rounded-2xl border ${
                  winner === 'player'
                    ? 'text-green-300 border-green-400/50 bg-green-900/40'
                    : 'text-red-300 border-red-400/50 bg-red-900/40'
                }`}
              >
                {winner === 'player' ? '🏆 Victoire !' : '💀 Défaite…'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* === Team + speed row === */}
      <div className="flex items-center justify-between px-1">
        <PokeballRow team={playerTeam} teamHP={playerTeamHP} align="left" />

        {/* Speed selector — clean pill */}
        <div className="flex items-center gap-px bg-white/8 rounded-full p-0.5 border border-white/10">
          {SPEEDS.map((s) => (
            <button
              key={s.ms}
              onClick={() => setSpeed(s.ms)}
              className={`px-3 py-1 text-[11px] font-black rounded-full transition-all duration-150 ${
                speed === s.ms
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'text-white/45 hover:text-white/70'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <PokeballRow team={enemyTeam} teamHP={enemyTeamHP} align="right" />
      </div>

      {/* === Message box (style DS) === */}
      <div
        className="rounded-2xl px-4 py-3 min-h-[62px] flex items-center border border-white/10"
        style={{ background: 'linear-gradient(135deg, #11121b 0%, #191a28 100%)' }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentEventIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="text-[13px] text-white/90 leading-snug"
          >
            {currentMessage}
            {!isComplete && (
              <motion.span
                className="inline-block ml-1 w-1.5 h-3.5 bg-white/55 align-middle rounded-sm"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
