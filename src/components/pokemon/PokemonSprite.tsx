import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSpriteUrl, getAnimatedSpriteUrl } from '../../services/pokeapi';

interface PokemonSpriteProps {
  id: number;
  name: string;
  isShiny?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  flip?: boolean;
  animate?: boolean;
  className?: string;
}

const sizes = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 180,
};

export function PokemonSprite({
  id,
  name,
  isShiny = false,
  size = 'md',
  flip = false,
  animate = true,
  className = '',
}: PokemonSpriteProps) {
  const [useAnimated, setUseAnimated] = useState(true);
  const [imgError, setImgError] = useState(false);

  const px = sizes[size];
  const animatedUrl = getAnimatedSpriteUrl(id);
  const staticUrl = getSpriteUrl(id, isShiny);

  const handleError = () => {
    if (useAnimated) {
      setUseAnimated(false);
    } else {
      setImgError(true);
    }
  };

  const src = useAnimated ? animatedUrl : staticUrl;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: px, height: px }}
      animate={animate ? { y: [0, -6, 0] } : {}}
      transition={animate ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      {isShiny && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {imgError ? (
        <div
          className="flex items-center justify-center bg-white/5 rounded-full text-white/30 text-xs"
          style={{ width: px, height: px }}
        >
          ?
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          width={px}
          height={px}
          onError={handleError}
          style={{
            imageRendering: 'pixelated',
            transform: flip ? 'scaleX(-1)' : undefined,
            objectFit: 'contain',
            width: px,
            height: px,
          }}
        />
      )}
    </motion.div>
  );
}
