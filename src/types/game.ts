import type { Pokemon } from './pokemon';

export type GameMode = 'normal' | 'nuzlocke' | 'challenge';

export type NodeType = 'wild' | 'trainer' | 'elite' | 'heal' | 'item' | 'shop' | 'event' | 'boss';

export type Screen =
  | 'home'
  | 'starter'
  | 'map'
  | 'battle'
  | 'reward'
  | 'shop'
  | 'team'
  | 'event'
  | 'gameover'
  | 'victory';

export interface MapNode {
  id: string;
  type: NodeType;
  region: number;
  layer: number;
  position: number;
  connections: string[];
  completed: boolean;
  accessible: boolean;
  data?: NodeData;
}

export interface NodeData {
  enemyTeam?: Pokemon[];
  trainerName?: string;
  isBoss?: boolean;
  reward?: RewardData;
}

export interface RewardData {
  type: 'pokemon' | 'item' | 'coins' | 'heal';
  choices?: Pokemon[];
  item?: Item;
  coins?: number;
}

export interface GameMap {
  nodes: MapNode[];
  regions: RegionInfo[];
}

export interface RegionInfo {
  id: number;
  name: string;
  theme: string;
  bossName: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: 'consumable' | 'held' | 'key';
  effect: ItemEffect;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
}

export interface ItemEffect {
  type: 'heal' | 'revive' | 'cure_status' | 'level_up' | 'xp_share' | 'stat_boost' | 'held';
  value?: number;
  stat?: string;
  heldType?: string;
}

export interface ShopItem {
  item: Item;
  price: number;
  sold: boolean;
}

export interface RunStats {
  battlesWon: number;
  battlesLost: number;
  pokemonCaught: number;
  damageDealt: number;
  damageTaken: number;
  turnsPlayed: number;
  regionsCleared: number;
  startTime: number;
  endTime?: number;
  mode: GameMode;
}

export interface RunHistory {
  id: string;
  date: number;
  mode: GameMode;
  stats: RunStats;
  finalTeam: { name: string; level: number }[];
  result: 'win' | 'loss';
  regionsCleared: number;
}
