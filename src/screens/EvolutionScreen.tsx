import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';

type Phase = 'wait' | 'glow' | 'flash' | 'reveal' | 'done';

const PHASE_DURATIONS: Record<Phase, number> = {
  wait: 900,
  glow: 2200,
  flash: 500,
  reveal: 1200,
  done: 0,
};

function usePhaseTimer(active: boolean, phase: Phase, onNext: () => void) {
  useEffect(() => {
    if (!active || phase === 'done') return;
    const t = setTimeout(onNext, PHASE_DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [active, phase, onNext]);
}

function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 4) * 4,
            height: 6 + (i % 4) * 4,
            background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#ffffff' : '#a78bfa',
            left: `${10 + (i * 47) % 80}%`,
            top: `${15 + (i * 37) % 70}%`,
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.4, 1, 0],
            x: (i % 2 === 0 ? 1 : -1) * (20 + i * 8),
            y: -40 - i * 6,
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.06,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export function EvolutionScreen() {
  const { pendingEvolution, pendingEvolutions, confirmEvolution, setScreen } = useGameStore();
  const [phase, setPhase] = useState<Phase>('wait');
  const [showParticles, setShowParticles] = useState(false);

  const evo = pendingEvolution;

  // Reset phase when a new evolution starts
  useEffect(() => {
    if (evo) setPhase('wait');
  }, [evo?.pokemon.id, evo?.pokemon.level]);

  const advance = () => {
    setPhase(p => {
      const order: Phase[] = ['wait', 'glow', 'flash', 'reveal', 'done'];
      return order[order.indexOf(p) + 1] ?? 'done';
    });
  };

  usePhaseTimer(!!evo && phase !== 'done', phase, advance);

  useEffect(() => {
    if (phase === 'reveal') {
      setShowParticles(true);
      const t = setTimeout(() => setShowParticles(false), 1400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleConfirm = () => {
    confirmEvolution();
    // If more evolutions pending, stay and reset; else go to reward
    if (pendingEvolutions.length > 1) {
      setPhase('wait');
    } else {
      setScreen('reward');
    }
  };

  if (!evo) {
    setScreen('reward');
    return null;
  }

  const isGlowing = phase === 'glow';
  const isFlashing = phase === 'flash';
  const isRevealed = phase === 'reveal' || phase === 'done';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a1040 0%, #07070f 100%)' }}
    >
      {/* Star field background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              left: `${(i * 2473) % 100}%`,
              top: `${(i * 3571) % 100}%`,
              opacity: 0.15 + (i % 5) * 0.08,
            }}
          />
        ))}
      </div>

      {/* Full screen white flash */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            className="fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.2, 0.7, 1] }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-sm w-full">

        {/* Header text */}
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="pre"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-1"
            >
              <p className="text-white/50 text-sm">Oh ?</p>
              <h2 className="text-xl font-black text-white">
                {evo.pokemon.displayName} évolue !
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="post"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-1"
            >
              <p className="text-white/50 text-sm">Félicitations !</p>
              <h2 className="text-xl font-black text-yellow-300">
                {evo.pokemon.displayName} a évolué
              </h2>
              <h2 className="text-2xl font-black text-white">
                en {evo.evolvesTo.displayName} !
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sprite area */}
        <div className="relative flex items-center justify-center" style={{ height: 160 }}>

          {/* Glow aura */}
          {isGlowing && (
            <motion.div
              className="absolute rounded-full"
              style={{ width: 140, height: 140, background: 'radial-gradient(circle, #ffffffcc 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
          )}

          {/* Original sprite */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.img
                key="original"
                src={evo.pokemon.sprite}
                alt={evo.pokemon.displayName}
                exit={{ opacity: 0, scale: 1.5 }}
                style={{
                  imageRendering: 'pixelated',
                  width: 112,
                  height: 112,
                  filter: isGlowing ? 'brightness(100) saturate(0)' : 'brightness(1)',
                  transition: 'filter 0.08s',
                }}
              />
            )}
          </AnimatePresence>

          {/* Evolved sprite */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div className="relative">
                {showParticles && <Particles />}
                <motion.img
                  key="evolved"
                  src={evo.evolvesTo.sprite}
                  alt={evo.evolvesTo.displayName}
                  initial={{ opacity: 0, scale: 0.4, filter: 'brightness(100) saturate(0)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'brightness(1) saturate(1)' }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ imageRendering: 'pixelated', width: 128, height: 128 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Before → After sprites (small) */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="text-center opacity-50">
                <img src={evo.pokemon.sprite} alt="" style={{ imageRendering: 'pixelated', width: 48, height: 48 }} />
                <p className="text-[10px] text-white/40">Niv.{evo.pokemon.level}</p>
              </div>
              <span className="text-white/30 text-lg">→</span>
              <div className="text-center">
                <img src={evo.evolvesTo.sprite} alt="" style={{ imageRendering: 'pixelated', width: 56, height: 56 }} />
                <p className="text-[10px] text-yellow-400/80 font-bold">Niv.{evo.evolvesTo.level}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Queue badge */}
        {pendingEvolutions.length > 1 && (
          <p className="text-[10px] text-white/30">
            +{pendingEvolutions.length - 1} autre{pendingEvolutions.length > 2 ? 's' : ''} évolution{pendingEvolutions.length > 2 ? 's' : ''}
          </p>
        )}

        {/* Confirm button */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl font-black text-sm text-black tracking-wide"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
            >
              {pendingEvolutions.length > 1 ? 'Suivant →' : '✓ Super !'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
