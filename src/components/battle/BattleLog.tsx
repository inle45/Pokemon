import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BattleEvent } from '../../types/battle';

interface BattleLogProps {
  events: BattleEvent[];
  currentIndex: number;
}

function getEventStyle(type: BattleEvent['type']): string {
  switch (type) {
    case 'attack': return 'text-white';
    case 'damage': return 'text-yellow-300';
    case 'miss': return 'text-white/50 italic';
    case 'status_apply': return 'text-orange-400';
    case 'status_damage': return 'text-orange-300';
    case 'status_cure': return 'text-green-400';
    case 'faint': return 'text-red-400 font-bold';
    case 'switch_in': return 'text-blue-400';
    case 'critical': return 'text-yellow-400 font-bold';
    case 'effectiveness': return 'text-purple-400';
    case 'held_item': return 'text-cyan-400';
    case 'battle_end': return 'text-white font-bold text-base';
    case 'level_up': return 'text-yellow-400 font-bold';
    case 'evolution': return 'text-pink-400 font-bold';
    default: return 'text-white/70';
  }
}

function getEventIcon(type: BattleEvent['type']): string {
  switch (type) {
    case 'attack': return '⚡';
    case 'damage': return '💢';
    case 'miss': return '💨';
    case 'status_apply': return '⚠️';
    case 'status_damage': return '🔥';
    case 'status_cure': return '✨';
    case 'faint': return '💀';
    case 'switch_in': return '→';
    case 'held_item': return '🎒';
    case 'battle_end': return '🏆';
    case 'level_up': return '⬆️';
    case 'evolution': return '🌟';
    default: return '•';
  }
}

export function BattleLog({ events, currentIndex }: BattleLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleEvents = events.slice(0, currentIndex + 1);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto flex flex-col gap-1 pr-1"
      style={{ scrollBehavior: 'smooth' }}
    >
      <AnimatePresence initial={false}>
        {visibleEvents.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-1.5 text-xs leading-relaxed ${getEventStyle(event.type)}`}
          >
            <span className="shrink-0 text-[10px] mt-0.5">{getEventIcon(event.type)}</span>
            <span>{event.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Cursor indicator */}
      {currentIndex < events.length - 1 && (
        <motion.div
          className="w-2 h-4 bg-white/40 rounded"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}
