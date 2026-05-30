export type BattleEventType =
  | 'turn_start'
  | 'attack'
  | 'damage'
  | 'miss'
  | 'status_apply'
  | 'status_damage'
  | 'status_cure'
  | 'stat_change'
  | 'heal'
  | 'faint'
  | 'switch_in'
  | 'critical'
  | 'effectiveness'
  | 'weather'
  | 'held_item'
  | 'battle_end'
  | 'level_up'
  | 'evolution';

export interface BattleEvent {
  type: BattleEventType;
  message: string;
  attackerSide?: 'player' | 'enemy';
  attackerIndex?: number;
  defenderIndex?: number;
  damage?: number;
  heal?: number;
  newHP?: number;
  maxHP?: number;
  moveName?: string;
  effectiveness?: number;
  isCritical?: boolean;
  statusEffect?: string;
  isPlayerVictory?: boolean;
  pokemonName?: string;
  newLevel?: number;
  evolvesTo?: string;
  // HP snapshots for the whole team at this event
  playerTeamHP?: number[];
  enemyTeamHP?: number[];
  activePlayerIndex?: number;
  activeEnemyIndex?: number;
}

export interface BattleResult {
  winner: 'player' | 'enemy';
  events: BattleEvent[];
  playerTeamFinal: import('./pokemon').Pokemon[];
  enemyTeamFinal: import('./pokemon').Pokemon[];
  xpGained: number[];
  turnsPlayed: number;
}

export interface BattleState {
  events: BattleEvent[];
  currentEventIndex: number;
  playerTeamHP: number[];
  enemyTeamHP: number[];
  isAnimating: boolean;
  isComplete: boolean;
  winner: 'player' | 'enemy' | null;
  activePlayerIndex: number;
  activeEnemyIndex: number;
  attackingAnimation: { side: 'player' | 'enemy'; index: number } | null;
  damagedAnimation: { side: 'player' | 'enemy'; index: number } | null;
}
