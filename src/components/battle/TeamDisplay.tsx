import { motion, AnimatePresence } from 'framer-motion';
import type { Pokemon } from '../../types/pokemon';
import { HPBar } from '../ui/HPBar';
import { TypeBadge } from '../ui/TypeBadge';
import { PokemonSprite } from '../pokemon/PokemonSprite';
import { getStatusLabel, getStatusColor } from '../../utils/helpers';

interface TeamDisplayProps {
  team: Pokemon[];
  teamHP: number[];
  activeIndex: number;
  side: 'player' | 'enemy';
  attackingIndex: number | null;
  damagedIndex: number | null;
}

export function TeamDisplay({
  team,
  teamHP,
  activeIndex,
  side,
  attackingIndex,
  damagedIndex,
}: TeamDisplayProps) {
  const isPlayer = side === 'player';

  return (
    <div className={`flex flex-col gap-2 ${isPlayer ? '' : ''}`}>
      {/* Active Pokémon large sprite */}
      <div className={`flex ${isPlayer ? 'justify-start' : 'justify-end'} mb-2`}>
        <AnimatePresence mode="wait">
          {team[activeIndex] && (
            <motion.div
              key={`${side}-active-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.8, x: isPlayer ? -20 : 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                filter: attackingIndex === activeIndex
                  ? ['brightness(1)', 'brightness(3)', 'brightness(1)']
                  : undefined,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <motion.div
                animate={
                  damagedIndex === activeIndex
                    ? { x: [0, -10, 10, -8, 8, 0] }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                <PokemonSprite
                  id={team[activeIndex].id}
                  name={team[activeIndex].displayName}
                  isShiny={team[activeIndex].isShiny}
                  size="xl"
                  flip={!isPlayer}
                  animate
                />
              </motion.div>

              {/* Active indicator */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-3 gap-2">
        {team.map((pokemon, i) => {
          const hp = teamHP[i] ?? pokemon.currentHP;
          const isActive = i === activeIndex;
          const isFainted = hp <= 0;

          return (
            <motion.div
              key={`${side}-${i}`}
              className={`
                relative rounded-lg p-2 transition-all
                ${isActive ? 'ring-1 ring-white/30 bg-white/10' : 'bg-white/5'}
                ${isFainted ? 'opacity-40' : ''}
              `}
              animate={
                damagedIndex === i && i !== activeIndex
                  ? { x: [0, -4, 4, 0] }
                  : {}
              }
            >
              <div className="flex items-center gap-1.5">
                <PokemonSprite
                  id={pokemon.id}
                  name={pokemon.displayName}
                  isShiny={pokemon.isShiny}
                  size="sm"
                  animate={isActive && !isFainted}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white font-semibold truncate">
                    {pokemon.displayName}
                  </p>
                  <p className="text-[9px] text-white/40">Lv.{pokemon.level}</p>
                  <HPBar current={hp} max={pokemon.maxHP} height="sm" />
                  <p className="text-[9px] text-white/50 font-mono mt-0.5">
                    {Math.max(0, hp)}/{pokemon.maxHP}
                  </p>
                </div>
              </div>

              {/* Status badge */}
              {pokemon.status && (
                <span
                  className="absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded"
                  style={{
                    color: getStatusColor(pokemon.status),
                    background: getStatusColor(pokemon.status) + '30',
                  }}
                >
                  {getStatusLabel(pokemon.status)}
                </span>
              )}

              {/* Types */}
              <div className="flex gap-0.5 mt-1">
                {pokemon.types.map(t => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>

              {isFainted && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <span className="text-red-400 text-[10px] font-bold">✕</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
