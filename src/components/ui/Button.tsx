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
  primary: 'bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/50 shadow-lg shadow-violet-900/30',
  secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/20',
  danger: 'bg-red-600 hover:bg-red-500 text-white border border-red-500/50 shadow-lg shadow-red-900/30',
  ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-transparent',
  success: 'bg-green-600 hover:bg-green-500 text-white border border-green-500/50 shadow-lg shadow-green-900/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
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
        rounded-lg font-semibold transition-all duration-150 cursor-pointer
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
