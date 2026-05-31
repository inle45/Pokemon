import type { NatureName } from '../data/natures';
export type { NatureName };

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type StatusEffect = 'burn' | 'poison' | 'paralysis' | 'sleep' | 'freeze' | null;

export interface PokemonStats {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface PokemonIVs {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export type WeatherEffect = 'rain' | 'sun' | 'sandstorm' | 'hail' | null;

export type StatKey = 'atk' | 'def' | 'spAtk' | 'spDef' | 'speed';

export interface MoveData {
  id: string;
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  pp: number;
  category: 'physical' | 'special' | 'status';
  effect?: string;
  effectChance?: number;
  priority?: number;
  drain?: number;
  recoil?: number;
  multiHit?: [number, number];
  selfStatChange?: Partial<Record<StatKey, number>>;
  opponentStatChange?: Partial<Record<StatKey, number>>;
  heal?: number;
  weather?: WeatherEffect;
}

export interface Pokemon {
  id: number;
  name: string;
  displayName: string;
  types: PokemonType[];
  baseStats: PokemonStats;
  ivs: PokemonIVs;
  level: number;
  currentHP: number;
  maxHP: number;
  moves: MoveData[];
  status: StatusEffect;
  statusTurns: number;
  nature: NatureName;
  abilityName: string;
  heldItem: string | null;
  isShiny: boolean;
  xp: number;
  xpToNext: number;
  atkStage: number;
  defStage: number;
  spAtkStage: number;
  spDefStage: number;
  speedStage: number;
  sprite: string;
  animatedSprite: string;
}

export interface EvolutionData {
  pokemonId: number;
  evolvesTo: number;
  level: number;
}
