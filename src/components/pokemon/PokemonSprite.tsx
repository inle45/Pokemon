import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  getSpriteUrl,
  getAnimatedSpriteUrl,
  getBackSpriteUrl,
  getAnimatedBackSpriteUrl,
  getArtworkUrl,
} from '../../services/pokeapi';

interface PokemonSpriteProps {
  id: number;
  name: string;
  isShiny?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  px?: number;
  back?: boolean;
  flip?: boolean;
  animate?: boolean;
  /** Soft ground shadow under the sprite (battle scene). */
  shadow?: boolean;
  /** Use crisp official artwork instead of pixel sprite (menus/cards). */
  artwork?: boolean;
  className?: string;
}

const sizes = {
  xs: 36,
  sm: 52,
  md: 68,
  lg: 92,
  xl: 116,
};

export function PokemonSprite({
  id,
  name,
  isShiny = false,
  size = 'md',
  px,
  back = false,
  flip = false,
  animate = true,
  shadow = false,
  artwork = false,
  className = '',
}: PokemonSpriteProps) {
  // Ordered fallback chain — try the nicest source first, degrade gracefully.
  const sources = useMemo(() => {
    if (artwork) {
      return [getArtworkUrl(id), getSpriteUrl(id, isShiny)];
    }
    if (back) {
      return [
        getAnimatedBackSpriteUrl(id),
        getBackSpriteUrl(id, isShiny),
        getAnimatedSpriteUrl(id),
        getSpriteUrl(id, isShiny),
      ];
    }
    return [getAnimatedSpriteUrl(id), getSpriteUrl(id, isShiny)];
  }, [id, isShiny, back, artwork]);

  const [srcIndex, setSrcIndex] = useState(0);
  const failed = srcIndex >= sources.length;
  const dimension = px ?? sizes[size];

  const handleError = () => setSrcIndex((i) => i + 1);

  return (
    <motion.div
      className={`relative inline-flex items-end justify-center ${className}`}
      style={{ width: dimension, height: dimension }}
      animate={animate ? { y: [0, -4, 0] } : {}}
      transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      {shadow && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[100%]"
          style={{
            width: dimension * 0.7,
            height: dimension * 0.14,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)',
          }}
        />
      )}

      {isShiny && (
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 65%)' }}
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}

      {failed ? (
        <div
          className="flex items-center justify-center bg-white/5 rounded-full text-white/25 text-lg"
          style={{ width: dimension, height: dimension }}
        >
          ?
        </div>
      ) : (
        <img
          src={sources[srcIndex]}
          alt={name}
          onError={handleError}
          draggable={false}
          style={{
            imageRendering: artwork ? 'auto' : 'pixelated',
            transform: flip ? 'scaleX(-1)' : undefined,
            objectFit: 'contain',
            width: '100%',
            height: '100%',
            filter: shadow ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' : undefined,
          }}
        />
      )}
    </motion.div>
  );
}
