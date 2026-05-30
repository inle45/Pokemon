import { motion } from 'framer-motion';
import type { Pokemon } from '../../types/pokemon';
import { getStatusLabel, getStatusColor } from '../../utils/helpers';

/** A single Poké Ball icon reflecting a team slot's state. */
function Pokeball({ state }: { state: 'healthy' | 'hurt' | 'fainted' | 'empty' }) {
  if (state === 'empty') {
    return <span className="inline-block w-3 h-3 rounded-full border border-white/20" />;
  }
  const dim = state === 'fainted';
  return (
    <span
      className="relative inline-block w-3 h-3 rounded-full overflow-hidden border border-black/40 shadow-sm"
      style={{ opacity: dim ? 0.3 : 1 }}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
      <span className="absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2 bg-black/60" />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white border border-black/60" />
      {state === 'fainted' && (
        <span className="absolute inset-0 grayscale" style={{ background: 'rgba(0,0,0,0.25)' }} />
      )}
    </span>
  );
}

export function PokeballRow({
  team,
  teamHP,
  align = 'left',
}: {
  team: Pokemon[];
  teamHP: number[];
  align?: 'left' | 'right';
}) {
  const slots = Array.from({ length: 6 });
  return (
    <div className={`flex gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {slots.map((_, i) => {
        const mon = team[i];
        if (!mon) return <Pokeball key={i} state="empty" />;
        const hp = teamHP[i] ?? mon.currentHP;
        const state = hp <= 0 ? 'fainted' : hp / mon.maxHP < 0.35 ? 'hurt' : 'healthy';
        return <Pokeball key={i} state={state} />;
      })}
    </div>
  );
}

/** Classic Pokémon-style HP info box. */
export function BattleHPBox({
  pokemon,
  hp,
  showNumbers = false,
  align = 'left',
}: {
  pokemon: Pokemon;
  hp: number;
  showNumbers?: boolean;
  align?: 'left' | 'right';
}) {
  const pct = Math.max(0, Math.min(1, hp / pokemon.maxHP));
  const barColor = pct > 0.5 ? '#3ad860' : pct > 0.2 ? '#f7c843' : '#f2554b';

  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="w-[180px] max-w-[58vw] rounded-xl bg-[#11121b]/90 backdrop-blur-md border border-white/10 px-3 py-2 shadow-lg"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-extrabold text-white text-sm tracking-wide truncate">
          {pokemon.displayName}
          {pokemon.isShiny && <span className="text-yellow-400 ml-1">★</span>}
        </span>
        <span className="text-[11px] font-bold text-white/60 shrink-0">Lv{pokemon.level}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-1.5">
        <span className="text-[9px] font-black text-yellow-400 tracking-widest">HP</span>
        <div className="flex-1 h-[7px] rounded-full bg-black/50 overflow-hidden border border-black/40">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={false}
            animate={{ width: `${pct * 100}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 h-3">
        {pokemon.status ? (
          <span
            className="text-[8px] font-black px-1.5 py-px rounded uppercase"
            style={{ color: getStatusColor(pokemon.status), background: getStatusColor(pokemon.status) + '25' }}
          >
            {getStatusLabel(pokemon.status)}
          </span>
        ) : (
          <span />
        )}
        {showNumbers && (
          <span className="text-[10px] font-mono text-white/70">
            {Math.max(0, Math.round(hp))}/{pokemon.maxHP}
          </span>
        )}
      </div>
    </motion.div>
  );
}
