import type { Item } from '../types/game';

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
    description: 'Not fully evolved: Def and Sp. Def are 1.5x.',
    category: 'held',
    effect: { type: 'held', heldType: 'eviolite' },
    icon: '💎',
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
