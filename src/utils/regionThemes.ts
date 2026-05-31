export type RegionTheme = 'forest' | 'cave' | 'route' | 'city' | 'mountain';

export interface ThemeData {
  accent: string;
  mapBg: string;
  headerBg: string;
  sky: string;
  ground: string;
  platform: string;
  silhouette: {
    bg: string;
    position: 'bottom' | 'top';
    clipPath?: string;
    borderRadius?: string;
    opacity: number;
    heightPct: string;
    bottomPct?: string;
    topPct?: string;
  };
}

export const REGION_THEMES: Record<RegionTheme, ThemeData> = {
  forest: {
    accent: '#4ade80',
    mapBg: 'linear-gradient(180deg, #0a1a0e 0%, #0d2313 50%, #0a1a0e 100%)',
    headerBg: 'linear-gradient(135deg, #0a1a0e 0%, #0d2313 100%)',
    sky: 'linear-gradient(180deg, #4a7cbf 0%, #6fa8d8 35%, #a8cce0 55%, #c8e0c0 55%, #7ab870 70%, #5a9850 100%)',
    ground: 'linear-gradient(180deg, #6ab855 0%, #4d9440 45%, #3a7032 100%)',
    platform: 'radial-gradient(ellipse, #c8a060 30%, #8a6030 100%)',
    silhouette: {
      bg: 'linear-gradient(to bottom, #3a8a30, #2d6e24)',
      position: 'bottom',
      borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
      opacity: 0.55,
      heightPct: '15%',
      bottomPct: '42%',
    },
  },

  cave: {
    accent: '#a78bfa',
    mapBg: 'linear-gradient(180deg, #060408 0%, #0d0814 50%, #060408 100%)',
    headerBg: 'linear-gradient(135deg, #060408 0%, #0d0814 100%)',
    sky: 'linear-gradient(180deg, #07050c 0%, #0e0a1a 30%, #150d22 60%, #1c1028 80%, #211228 100%)',
    ground: 'linear-gradient(180deg, #2a1f18 0%, #1e1510 50%, #140e0a 100%)',
    platform: 'radial-gradient(ellipse, #4a3828 30%, #2a1e14 100%)',
    silhouette: {
      bg: 'linear-gradient(to bottom, #1a0e28, #110920)',
      position: 'top',
      clipPath:
        'polygon(0 0, 5% 65%, 10% 0, 16% 72%, 22% 0, 28% 60%, 35% 0, 42% 68%, 50% 0, 57% 60%, 64% 0, 71% 72%, 78% 0, 85% 65%, 92% 0, 100% 58%, 100% 0)',
      opacity: 0.85,
      heightPct: '28%',
      topPct: '0%',
    },
  },

  route: {
    accent: '#60a5fa',
    mapBg: 'linear-gradient(180deg, #091524 0%, #0e1e30 50%, #091524 100%)',
    headerBg: 'linear-gradient(135deg, #091524 0%, #0e1e30 100%)',
    sky: 'linear-gradient(180deg, #3a6ab0 0%, #5a94cc 35%, #90bede 55%, #b8d8c8 55%, #68b060 70%, #4a8840 100%)',
    ground: 'linear-gradient(180deg, #58a848 0%, #409038 45%, #2e6c28 100%)',
    platform: 'radial-gradient(ellipse, #c8a060 30%, #8a6030 100%)',
    silhouette: {
      bg: 'linear-gradient(to bottom, #4a9040, #386c30)',
      position: 'bottom',
      borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
      opacity: 0.5,
      heightPct: '14%',
      bottomPct: '41%',
    },
  },

  city: {
    accent: '#f472b6',
    mapBg: 'linear-gradient(180deg, #0e0a1a 0%, #160d24 50%, #0e0a1a 100%)',
    headerBg: 'linear-gradient(135deg, #0e0a1a 0%, #160d24 100%)',
    sky: 'linear-gradient(180deg, #06040e 0%, #0f0820 25%, #1a0e30 50%, #2e1440 65%, #3d1c38 75%, #2a1214 85%, #1a0c0c 100%)',
    ground: 'linear-gradient(180deg, #2a2535 0%, #1e1a28 50%, #141018 100%)',
    platform: 'radial-gradient(ellipse, #555060 30%, #302c3a 100%)',
    silhouette: {
      bg: 'linear-gradient(to bottom, #2a2040, #1a1430)',
      position: 'bottom',
      clipPath:
        'polygon(0 100%, 0 50%, 6% 50%, 6% 20%, 12% 20%, 12% 40%, 18% 40%, 18% 8%, 24% 8%, 24% 50%, 30% 50%, 30% 25%, 36% 25%, 36% 45%, 42% 45%, 42% 12%, 48% 12%, 48% 35%, 54% 35%, 54% 55%, 60% 55%, 60% 18%, 66% 18%, 66% 0, 72% 0, 72% 35%, 78% 35%, 78% 50%, 84% 50%, 84% 22%, 90% 22%, 90% 42%, 96% 42%, 96% 60%, 100% 60%, 100% 100%)',
      opacity: 0.9,
      heightPct: '55%',
      bottomPct: '35%',
    },
  },

  mountain: {
    accent: '#fb923c',
    mapBg: 'linear-gradient(180deg, #0e0804 0%, #1a0e06 50%, #0e0804 100%)',
    headerBg: 'linear-gradient(135deg, #0e0804 0%, #1a0e06 100%)',
    sky: 'linear-gradient(180deg, #080406 0%, #100608 20%, #200a08 40%, #38100a 60%, #481408 75%, #3a1006 88%, #201008 100%)',
    ground: 'linear-gradient(180deg, #3a2018 0%, #281408 50%, #180c04 100%)',
    platform: 'radial-gradient(ellipse, #504030 30%, #302010 100%)',
    silhouette: {
      bg: 'linear-gradient(to bottom, #2a1808, #1a1004)',
      position: 'bottom',
      clipPath:
        'polygon(0 100%, 0 72%, 8% 48%, 15% 65%, 22% 32%, 30% 56%, 38% 20%, 46% 44%, 53% 24%, 61% 50%, 68% 14%, 76% 40%, 83% 30%, 91% 58%, 100% 44%, 100% 100%)',
      opacity: 0.9,
      heightPct: '45%',
      bottomPct: '40%',
    },
  },
};

export function getThemeForRegion(regionTheme: string): ThemeData {
  return REGION_THEMES[regionTheme as RegionTheme] ?? REGION_THEMES.route;
}
