import React from 'react';
import type { NodeType } from '../../types/game';

// Clean SVG icons inspired by the Pokémon game style.
const icons: Record<NodeType, (color: string) => React.ReactElement> = {
  wild: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7 2 3 6 3 11c0 2.5 1 4.8 2.7 6.4L12 22l6.3-4.6C20 15.8 21 13.5 21 11c0-5-4-9-9-9z" fill={c + '33'} />
      <path d="M9 10c0-1.7 1.3-3 3-3s3 1.3 3 3" />
      <circle cx="12" cy="13" r="1.5" fill={c} />
    </svg>
  ),
  trainer: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" fill={c + '33'} />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      <path d="M16 11l2 3" />
    </svg>
  ),
  elite: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2L9 9H4l8 13 8-13h-5L14.5 2z" fill={c + '33'} />
      <line x1="9" y1="9" x2="15" y2="9" />
    </svg>
  ),
  heal: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="4" fill={c + '22'} />
      <line x1="12" y1="7" x2="12" y2="17" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  ),
  item: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" fill={c + '22'} />
      <path d="M12 11V3" />
      <path d="M8 7l4-4 4 4" />
      <line x1="3" y1="11" x2="21" y2="11" />
    </svg>
  ),
  shop: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18l-2 8H5L3 6z" fill={c + '22'} />
      <circle cx="9" cy="20" r="1.5" fill={c} />
      <circle cx="16" cy="20" r="1.5" fill={c} />
      <path d="M1 2h3l.5 3" />
    </svg>
  ),
  event: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" fill={c + '22'} />
      <path d="M12 7v6" />
      <circle cx="12" cy="17" r="0.8" fill={c} stroke="none" />
    </svg>
  ),
  boss: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill={c + '44'} />
    </svg>
  ),
};

export function NodeIcon({ type, color, size = 24 }: { type: NodeType; color: string; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', width: size, height: size }}>
      {icons[type]?.(color)}
    </span>
  );
}
