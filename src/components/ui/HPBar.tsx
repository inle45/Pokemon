import { motion } from 'framer-motion';

interface HPBarProps {
  current: number;
  max: number;
  showNumbers?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function HPBar({ current, max, showNumbers = false, height = 'md', animated = true }: HPBarProps) {
  const pct = Math.max(0, Math.min(1, current / max));
  const color = pct > 0.5 ? '#4ade80' : pct > 0.25 ? '#fbbf24' : '#f87171';

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className="w-full">
      {showNumbers && (
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>HP</span>
          <span className="font-mono">{Math.max(0, current)}/{max}</span>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          className="rounded-full h-full"
          style={{ backgroundColor: color }}
          initial={false}
          animate={{ width: `${pct * 100}%` }}
          transition={animated ? { type: 'spring', stiffness: 200, damping: 25 } : { duration: 0 }}
        />
      </div>
    </div>
  );
}
