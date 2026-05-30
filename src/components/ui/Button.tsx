import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const variants = {
  primary:
    'text-white bg-gradient-to-b from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 border border-violet-400/40 shadow-lg shadow-violet-900/40',
  secondary: 'bg-white/8 hover:bg-white/14 text-white border border-white/15',
  danger:
    'text-white bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border border-red-400/40 shadow-lg shadow-red-900/40',
  ghost: 'bg-transparent hover:bg-white/8 text-white/70 hover:text-white border border-transparent',
  success:
    'text-white bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 border border-green-400/40 shadow-lg shadow-green-900/40',
};

const sizes = {
  sm: 'px-3.5 py-2 text-sm rounded-lg',
  md: 'px-5 py-3 text-sm rounded-xl',
  lg: 'px-7 py-4 text-base rounded-2xl',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-bold tracking-wide transition-all duration-150 cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
