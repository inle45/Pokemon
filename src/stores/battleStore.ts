import { create } from 'zustand';
import type { BattleEvent } from '../types/battle';

interface BattleStore {
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
  speed: number; // ms per event

  initBattle: (
    events: BattleEvent[],
    playerHP: number[],
    enemyHP: number[],
  ) => void;
  setCurrentEvent: (index: number) => void;
  nextEvent: () => void;
  setAnimating: (v: boolean) => void;
  setAttackAnimation: (anim: BattleStore['attackingAnimation']) => void;
  setDamagedAnimation: (anim: BattleStore['damagedAnimation']) => void;
  updateHP: (playerHP: number[], enemyHP: number[]) => void;
  setActiveIndices: (player: number, enemy: number) => void;
  setSpeed: (speed: number) => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleStore>((set, get) => ({
  events: [],
  currentEventIndex: -1,
  playerTeamHP: [],
  enemyTeamHP: [],
  isAnimating: false,
  isComplete: false,
  winner: null,
  activePlayerIndex: 0,
  activeEnemyIndex: 0,
  attackingAnimation: null,
  damagedAnimation: null,
  speed: 800,

  initBattle: (events, playerHP, enemyHP) => {
    set({
      events,
      currentEventIndex: -1,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
      isAnimating: false,
      isComplete: false,
      winner: null,
      activePlayerIndex: 0,
      activeEnemyIndex: 0,
      attackingAnimation: null,
      damagedAnimation: null,
    });
  },

  setCurrentEvent: (index) => {
    const { events } = get();
    const event = events[index];
    if (!event) return;

    const updates: Partial<BattleStore> = { currentEventIndex: index };

    if (event.playerTeamHP) updates.playerTeamHP = event.playerTeamHP;
    if (event.enemyTeamHP) updates.enemyTeamHP = event.enemyTeamHP;
    if (event.activePlayerIndex !== undefined) updates.activePlayerIndex = event.activePlayerIndex;
    if (event.activeEnemyIndex !== undefined) updates.activeEnemyIndex = event.activeEnemyIndex;

    if (event.type === 'battle_end') {
      updates.isComplete = true;
      updates.winner = event.isPlayerVictory ? 'player' : 'enemy';
    }

    if (event.type === 'attack') {
      updates.attackingAnimation = {
        side: event.attackerSide!,
        index: event.attackerIndex!,
      };
    } else {
      updates.attackingAnimation = null;
    }

    if (event.type === 'damage') {
      const side = event.attackerSide === 'player' ? 'enemy' : 'player';
      updates.damagedAnimation = {
        side,
        index: event.defenderIndex!,
      };
    } else {
      updates.damagedAnimation = null;
    }

    set(updates);
  },

  nextEvent: () => {
    const { currentEventIndex, events } = get();
    const next = currentEventIndex + 1;
    if (next < events.length) {
      get().setCurrentEvent(next);
    }
  },

  setAnimating: (v) => set({ isAnimating: v }),
  setAttackAnimation: (anim) => set({ attackingAnimation: anim }),
  setDamagedAnimation: (anim) => set({ damagedAnimation: anim }),
  updateHP: (playerHP, enemyHP) => set({ playerTeamHP: playerHP, enemyTeamHP: enemyHP }),
  setActiveIndices: (player, enemy) => set({ activePlayerIndex: player, activeEnemyIndex: enemy }),
  setSpeed: (speed) => set({ speed }),

  resetBattle: () => set({
    events: [],
    currentEventIndex: -1,
    playerTeamHP: [],
    enemyTeamHP: [],
    isAnimating: false,
    isComplete: false,
    winner: null,
    activePlayerIndex: 0,
    activeEnemyIndex: 0,
    attackingAnimation: null,
    damagedAnimation: null,
  }),
}));
