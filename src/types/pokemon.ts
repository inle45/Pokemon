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
