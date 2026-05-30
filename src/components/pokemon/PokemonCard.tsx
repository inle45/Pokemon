import { motion } from 'framer-motion';
import type { Pokemon } from '../../types/pokemon';
import { TypeBadge } from '../ui/TypeBadge';
import { HPBar } from '../ui/HPBar';
import { PokemonSprite } from './PokemonSprite';
import { StatsBar } from './StatsBar';
import { getStatusLabel, getStatusColor } from '../../utils/helpers';
import { TYPE_COLORS } from '../../data/typeChart';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
  selected?: boolean;
  showStats?: boolean;
  showHP?: boolean;
  compact?: boolean;
  index?: number;
}

export function PokemonCard({
  pokemon,
  onClick,
  selected = false,
  showStats = false,
  showHP = true,
  compact = false,
  index = 0,
}: PokemonCardProps) {
  const primaryType = pokemon.types[0];
  const typeColor = TYPE_COLORS[primaryType] || '#888';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={onClick ? { scale: 1.02, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.97 } : {}}
      className={`
        relative rounded-xl overflow-hidden transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${selected
          ? 'ring-2 ring-offset-2 ring-offset-transparent'
          : 'ring-0'
        }
        ${compact ? 'p-3' : 'p-4'}
      `}
      style={{
        background: `linear-gradient(135deg, ${typeColor}15 0%, rgba(10,10,20,0.9) 100%)`,
        border: `1px solid ${selected ? typeColor : typeColor + '30'}`,
        boxShadow: selected ? `0 0 20px ${typeColor}40` : undefined,
        ...(selected && { ringColor: typeColor }),
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 20%, ${typeColor} 0%, transparent 50%)`,
        }}
      />

      <div className="relative flex items-center gap-3">
        {/* Sprite */}
        <div className="shrink-0">
          <PokemonSprite
            id={pokemon.id}
            name={pokemon.displayName}
            isShiny={pokemon.isShiny}
            size={compact ? 'sm' : 'md'}
            animate={!compact}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className="text-[10px] text-white/40 font-mono">#{String(pokemon.id).padStart(3, '0')}</p>
              <h3 className={`font-bold text-white truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {pokemon.displayName}
                {pokemon.isShiny && <span className="ml-1 text-yellow-400 text-xs">★</span>}
              </h3>
            </div>
            <span className="text-xs text-white/50 shrink-0">Lv.{pokemon.level}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {pokemon.types.map(t => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
            {pokemon.status && (
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase"
                style={{ color: getStatusColor(pokemon.status), background: getStatusColor(pokemon.status) + '20' }}
              >
                {getStatusLabel(pokemon.status)}
              </span>
            )}
            {pokemon.heldItem && (
              <span className="px-1.5 py-0.5 text-[10px] bg-white/10 text-white/60 rounded">
                {pokemon.heldItem}
              </span>
            )}
          </div>

          {showHP && (
            <div className="mt-2">
              <HPBar
                current={pokemon.currentHP}
                max={pokemon.maxHP}
                showNumbers
                height="sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {showStats && !compact && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <StatsBar stats={pokemon.baseStats} compact />
        </div>
      )}

      {/* Fainted overlay */}
      {pokemon.currentHP <= 0 && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
          <span className="text-red-400 font-bold text-sm">Fainted</span>
        </div>
      )}
    </motion.div>
  );
}
