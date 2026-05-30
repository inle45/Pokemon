import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useBattleStore } from '../../stores/battleStore';
import { TeamDisplay } from './TeamDisplay';
import { BattleLog } from './BattleLog';

interface BattleSceneProps {
  playerTeam: import('../../types/pokemon').Pokemon[];
  enemyTeam: import('../../types/pokemon').Pokemon[];
  onBattleEnd: (winner: 'player' | 'enemy') => void;
}

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

    setTimeout(() => {
      setAnimating(false);
    }, speed * 0.8);
  }, [isComplete, isAnimating, nextEvent, setAnimating, speed]);

  // Auto-play events
  useEffect(() => {
    if (isComplete) {
      // Give a moment before calling onBattleEnd
      const t = setTimeout(() => {
        if (winner) onBattleEnd(winner);
      }, 2000);
      return () => clearTimeout(t);
    }

    if (events.length === 0) return;

    const t = setTimeout(() => {
      advance();
    }, speed);

    return () => clearTimeout(t);
  }, [currentEventIndex, isComplete, events.length, advance, speed, winner, onBattleEnd]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Speed control */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-white/50">Speed:</span>
        {[1200, 800, 400, 100].map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2 py-1 text-xs rounded ${speed === s ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
          >
            {s === 1200 ? '0.5x' : s === 800 ? '1x' : s === 400 ? '2x' : '4x'}
          </button>
        ))}
      </div>

      {/* Battle field */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enemy side */}
        <motion.div
          className="rounded-xl bg-white/5 border border-white/10 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-red-400/80 uppercase tracking-widest">Opponent</h3>
            <span className="text-xs text-white/30">{enemyTeam.filter(p => (enemyTeamHP[enemyTeam.indexOf(p)] ?? p.currentHP) > 0).length}/{enemyTeam.length} alive</span>
          </div>
          <TeamDisplay
            team={enemyTeam}
            teamHP={enemyTeamHP}
            activeIndex={activeEnemyIndex}
            side="enemy"
            attackingIndex={attackingAnimation?.side === 'enemy' ? attackingAnimation.index : null}
            damagedIndex={damagedAnimation?.side === 'enemy' ? damagedAnimation.index : null}
          />
        </motion.div>

        {/* Player side */}
        <motion.div
          className="rounded-xl bg-white/5 border border-white/10 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-blue-400/80 uppercase tracking-widest">Your Team</h3>
            <span className="text-xs text-white/30">{playerTeam.filter(p => (playerTeamHP[playerTeam.indexOf(p)] ?? p.currentHP) > 0).length}/{playerTeam.length} alive</span>
          </div>
          <TeamDisplay
            team={playerTeam}
            teamHP={playerTeamHP}
            activeIndex={activePlayerIndex}
            side="player"
            attackingIndex={attackingAnimation?.side === 'player' ? attackingAnimation.index : null}
            damagedIndex={damagedAnimation?.side === 'player' ? damagedAnimation.index : null}
          />
        </motion.div>
      </div>

      {/* Battle Log */}
      <motion.div
        className="rounded-xl bg-black/40 border border-white/10 p-4 h-44"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BattleLog events={events} currentIndex={currentEventIndex} />
      </motion.div>

      {/* Victory/Defeat banner */}
      {isComplete && (
        <motion.div
          className={`text-center py-4 rounded-xl font-bold text-2xl ${winner === 'player' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {winner === 'player' ? '🏆 Victory!' : '💀 Defeated!'}
        </motion.div>
      )}
    </div>
  );
}
