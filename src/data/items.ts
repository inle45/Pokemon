import type { Item, ShopItem } from '../types/game';

export const ITEMS_DATABASE: Item[] = [
  // Consumables
  {
    id: 'potion',
    name: 'Potion',
    description: 'Restore 50 HP to one Pokémon.',
    category: 'consumable',
    effect: { type: 'heal', value: 50 },
    icon: '🧪',
    rarity: 'common',
  },
  {
    id: 'super-potion',
    name: 'Super Potion',
    description: 'Restore 120 HP to one Pokémon.',
    category: 'consumable',
    effect: { type: 'heal', value: 120 },
    icon: '⚗️',
    rarity: 'uncommon',
  },
  {
    id: 'hyper-potion',
    name: 'Hyper Potion',
    description: 'Restore 200 HP to one Pokémon.',
    category: 'consumable',
    effect: { type: 'heal', value: 200 },
    icon: '💉',
    rarity: 'uncommon',
  },
  {
    id: 'max-potion',
    name: 'Max Potion',
    description: 'Fully restore HP to one Pokémon.',
    category: 'consumable',
    effect: { type: 'heal', value: 9999 },
    icon: '🏥',
    rarity: 'rare',
  },
  {
    id: 'full-restore',
    name: 'Full Restore',
    description: 'Fully restore HP and cure all status conditions.',
    category: 'consumable',
    effect: { type: 'heal', value: 9999 },
    icon: '✨',
    rarity: 'rare',
  },
  {
    id: 'full-heal',
    name: 'Full Heal',
    description: 'Cure all status conditions for one Pokémon.',
    category: 'consumable',
    effect: { type: 'cure_status' },
    icon: '💊',
    rarity: 'common',
  },
  {
    id: 'revive',
    name: 'Revive',
    description: 'Restore a fainted Pokémon to 50% HP.',
    category: 'consumable',
    effect: { type: 'revive', value: 0.5 },
    icon: '💫',
    rarity: 'uncommon',
  },
  {
    id: 'max-revive',
    name: 'Max Revive',
    description: 'Restore a fainted Pokémon to full HP.',
    category: 'consumable',
    effect: { type: 'revive', value: 1 },
    icon: '⭐',
    rarity: 'rare',
  },
  {
    id: 'rare-candy',
    name: 'Rare Candy',
    description: 'Instantly level up one Pokémon.',
    category: 'consumable',
    effect: { type: 'level_up' },
    icon: '🍬',
    rarity: 'uncommon',
  },
  {
    id: 'x-attack',
    name: 'X Attack',
    description: 'Raise one Pokémon\'s Attack by 1 stage for the next battle.',
    category: 'consumable',
    effect: { type: 'stat_boost', stat: 'atk', value: 1 },
    icon: '⚔️',
    rarity: 'common',
  },
  {
    id: 'x-sp-atk',
    name: 'X Sp. Atk',
    description: 'Raise one Pokémon\'s Sp. Atk by 1 stage for the next battle.',
    category: 'consumable',
    effect: { type: 'stat_boost', stat: 'spAtk', value: 1 },
    icon: '🔮',
    rarity: 'common',
  },
  {
    id: 'x-speed',
    name: 'X Speed',
    description: 'Raise one Pokémon\'s Speed by 1 stage for the next battle.',
    category: 'consumable',
    effect: { type: 'stat_boost', stat: 'speed', value: 1 },
    icon: '💨',
    rarity: 'common',
  },
  {
    id: 'exp-share',
    name: 'Exp. Share',
    description: 'All Pokémon gain XP after the next battle.',
    category: 'consumable',
    effect: { type: 'xp_share' },
    icon: '📡',
    rarity: 'uncommon',
  },

  // Held items
  {
    id: 'leftovers',
    name: 'Leftovers',
    description: 'Holder restores 1/16 of max HP each turn.',
    category: 'held',
    effect: { type: 'held', heldType: 'leftovers' },
    icon: '🍖',
    rarity: 'uncommon',
  },
  {
    id: 'choice-band',
    name: 'Choice Band',
    description: 'Holder\'s Attack is 1.5x, but can only use the first move.',
    category: 'held',
    effect: { type: 'held', heldType: 'choice-band' },
    icon: '🎀',
    rarity: 'rare',
  },
  {
    id: 'life-orb',
    name: 'Life Orb',
    description: 'Holder deals 1.3x damage, but loses 1/10 HP per attack.',
    category: 'held',
    effect: { type: 'held', heldType: 'life-orb' },
    icon: '🔴',
    rarity: 'rare',
  },
  {
    id: 'lum-berry',
    name: 'Lum Berry',
    description: 'Cures any status condition once when held.',
    category: 'held',
    effect: { type: 'held', heldType: 'lum-berry' },
    icon: '🫐',
    rarity: 'uncommon',
  },
  {
    id: 'rocky-helmet',
    name: 'Rocky Helmet',
    description: 'Attacker takes 1/6 of their HP as damage on contact moves.',
    category: 'held',
    effect: { type: 'held', heldType: 'rocky-helmet' },
    icon: '⛑️',
    rarity: 'rare',
  },
  {
    id: 'assault-vest',
    name: 'Assault Vest',
    description: 'Holder\'s Sp. Def is 1.5x.',
    category: 'held',
    effect: { type: 'held', heldType: 'assault-vest' },
    icon: '🦺',
    rarity: 'rare',
  },
  {
    id: 'focus-sash',
    name: 'Focus Sash',
    description: 'If holder is at full HP, it survives one hit that would knock it out.',
    category: 'held',
    effect: { type: 'held', heldType: 'focus-sash' },
    icon: '🏮',
    rarity: 'epic',
  },
  {
    id: 'eviolite',
    name: 'Eviolite',
    description: 'Not fully evolved: Déf et Déf Spé ×1.5.',
    category: 'held',
    effect: { type: 'held', heldType: 'eviolite' },
    icon: '💎',
    rarity: 'epic',
  },
  // New held items
  {
    id: 'choice-scarf',
    name: 'Choice Scarf',
    description: 'Vitesse ×1.5 — mais limité à la première capacité.',
    category: 'held',
    effect: { type: 'held', heldType: 'choice-scarf' },
    icon: '🧣',
    rarity: 'rare',
  },
  {
    id: 'choice-specs',
    name: 'Choice Specs',
    description: 'Att. Spé ×1.5 — mais limité aux capacités spéciales.',
    category: 'held',
    effect: { type: 'held', heldType: 'choice-specs' },
    icon: '🥽',
    rarity: 'rare',
  },
  {
    id: 'expert-belt',
    name: 'Expert Belt',
    description: 'Capacités super efficaces infligent ×1.2 dégâts.',
    category: 'held',
    effect: { type: 'held', heldType: 'expert-belt' },
    icon: '🥊',
    rarity: 'uncommon',
  },
  {
    id: 'shell-bell',
    name: 'Shell Bell',
    description: 'Restaure 1/8 des dégâts infligés en PV chaque tour.',
    category: 'held',
    effect: { type: 'held', heldType: 'shell-bell' },
    icon: '🔔',
    rarity: 'uncommon',
  },
  {
    id: 'scope-lens',
    name: 'Scope Lens',
    description: 'Augmente le taux de coups critiques.',
    category: 'held',
    effect: { type: 'held', heldType: 'scope-lens' },
    icon: '🔭',
    rarity: 'uncommon',
  },
  {
    id: 'sitrus-berry',
    name: 'Sitrus Berry',
    description: 'Restaure 25% des PV max quand les PV tombent sous 50%.',
    category: 'held',
    effect: { type: 'held', heldType: 'sitrus-berry' },
    icon: '🍋',
    rarity: 'common',
  },
  {
    id: 'weakness-policy',
    name: 'Weakness Policy',
    description: 'Si touché par une attaque super efficace: Att. et Att. Spé +2.',
    category: 'held',
    effect: { type: 'held', heldType: 'weakness-policy' },
    icon: '📜',
    rarity: 'epic',
  },
];

const ITEM_MAP: Record<string, Item> = {};
for (const item of ITEMS_DATABASE) {
  ITEM_MAP[item.id] = item;
}

export function getItemById(id: string): Item | undefined {
  return ITEM_MAP[id];
}

export function getRandomItem(rarity?: 'common' | 'uncommon' | 'rare' | 'epic'): Item {
  let pool = ITEMS_DATABASE;
  if (rarity) {
    pool = pool.filter(i => i.rarity === rarity);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getWeightedRandomItem(): Item {
  const weights = { common: 50, uncommon: 30, rare: 15, epic: 5 };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  for (const [rarity, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) {
      return getRandomItem(rarity as 'common' | 'uncommon' | 'rare' | 'epic');
    }
  }
  return getRandomItem('common');
}

const RARITY_PRICES: Record<string, number> = {
  common: 80,
  uncommon: 160,
  rare: 320,
  epic: 560,
};

export function getItemPrice(item: Item): number {
  return RARITY_PRICES[item.rarity] ?? 100;
}

// Generate shop stock: 5 items weighted by rarity, no duplicates
export function generateShopStock(count = 5): ShopItem[] {
  const weights = { common: 40, uncommon: 35, rare: 20, epic: 5 };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const usedIds = new Set<string>();
  const result: ShopItem[] = [];

  let tries = 0;
  while (result.length < count && tries < 200) {
    tries++;
    let roll = Math.random() * total;
    let rarity: 'common' | 'uncommon' | 'rare' | 'epic' = 'common';
    for (const [r, w] of Object.entries(weights)) {
      roll -= w;
      if (roll <= 0) { rarity = r as typeof rarity; break; }
    }

    const pool = ITEMS_DATABASE.filter(i => i.rarity === rarity && !usedIds.has(i.id));
    if (pool.length === 0) continue;

    const item = pool[Math.floor(Math.random() * pool.length)];
    usedIds.add(item.id);
    result.push({ item, price: getItemPrice(item), sold: false });
  }

  return result;
}
