import type { PokemonType } from '../../types/pokemon';
import { TYPE_COLORS } from '../../data/typeChart';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] || '#888';

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-bold uppercase tracking-wider
        ${sizeClasses[size]}
      `}
      style={{
        backgroundColor: color + '33',
        border: `1px solid ${color}66`,
        color: color,
      }}
    >
      {type}
    </span>
  );
}
