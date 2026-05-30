import { motion } from 'framer-motion';
import type { PokemonStats } from '../../types/pokemon';

interface StatsBarProps {
  stats: PokemonStats;
  compact?: boolean;
}

const STAT_NAMES: { key: keyof PokemonStats; label: string; color: string }[] = [
  { key: 'hp', label: 'HP', color: '#4ade80' },
  { key: 'atk', label: 'ATK', color: '#f97316' },
  { key: 'def', label: 'DEF', color: '#60a5fa' },
  { key: 'spAtk', label: 'SpA', color: '#c084fc' },
  { key: 'spDef', label: 'SpD', color: '#34d399' },
  { key: 'speed', label: 'SPD', color: '#fbbf24' },
];

const MAX_STAT = 255;

export function StatsBar({ stats, compact = false }: StatsBarProps) {
  return (
    <div className={`flex flex-col gap-${compact ? '1' : '1.5'}`}>
      {STAT_NAMES.map(({ key, label, color }) => {
        const value = stats[key];
        const pct = (value / MAX_STAT) * 100;

        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold w-8 text-right shrink-0"
              style={{ color }}
            >
              {label}
            </span>
            <span className="text-xs text-white/60 w-7 text-right shrink-0 font-mono">
              {value}
            </span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
