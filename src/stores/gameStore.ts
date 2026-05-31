import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pokemon } from '../types/pokemon';
import type { Screen, GameMode, MapNode, GameMap, Item, RunStats, RunHistory, ShopItem } from '../types/game';
import { generateMap, getAccessibleNodes } from '../utils/mapGenerator';
import { levelUp, tryEvolve } from '../services/pokeapi';

interface GameStore {
  // Navigation
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;

  // Game mode
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;

  // Team
  playerTeam: Pokemon[];
  addPokemon: (pokemon: Pokemon) => void;
  removePokemon: (id: number) => void;
  updateTeam: (team: Pokemon[]) => void;
  healTeam: () => void;

  // Map
  currentMap: GameMap | null;
  currentNode: MapNode | null;
  completedNodes: string[];
  accessibleNodes: string[];
  initMap: () => void;
  selectNode: (nodeId: string) => void;
  completeNode: (nodeId: string) => void;

  // Current region progress
  currentRegion: number;
  currentLayer: number;

  // Items
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  useItem: (itemId: string, targetIndex: number) => void;

  // Currency
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;

  // Run stats
  runStats: RunStats;
  updateStats: (partial: Partial<RunStats>) => void;

  // History
  runHistory: RunHistory[];
  saveRun: (result: 'win' | 'loss') => void;

  // Enemy team for current battle
  enemyTeam: Pokemon[];
  setEnemyTeam: (team: Pokemon[]) => void;

  // Reward pending
  pendingReward: { type: 'pokemon' | 'item' | 'coins' | 'heal'; choices?: Pokemon[]; items?: Item[]; coins?: number } | null;
  setPendingReward: (reward: GameStore['pendingReward']) => void;

  // Pending event
  pendingEvent: { message: string; effect: 'good' | 'bad' | 'neutral' } | null;
  setPendingEvent: (event: GameStore['pendingEvent']) => void;

  // Shop
  pendingShop: ShopItem[] | null;
  setPendingShop: (items: ShopItem[] | null) => void;

  // XP share toggle
  xpShareActive: boolean;
  setXpShare: (v: boolean) => void;

  // Reset
  resetRun: () => void;

  // Evolution queue (shown one-by-one on the evolution screen)
  pendingEvolutions: { pokemon: Pokemon; evolvesTo: Pokemon }[];
  /** back-compat alias for the first in queue */
  pendingEvolution: { pokemon: Pokemon; evolvesTo: Pokemon } | null;
  addPendingEvolution: (evo: { pokemon: Pokemon; evolvesTo: Pokemon }) => void;
  confirmEvolution: () => void; // apply + dequeue first

  // Battle result
  lastBattleResult: 'win' | 'loss' | null;
  setLastBattleResult: (r: 'win' | 'loss' | null) => void;
}

const defaultRunStats = (mode: GameMode): RunStats => ({
  battlesWon: 0,
  battlesLost: 0,
  pokemonCaught: 0,
  damageDealt: 0,
  damageTaken: 0,
  turnsPlayed: 0,
  regionsCleared: 0,
  startTime: Date.now(),
  mode,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentScreen: 'home',
      setScreen: (screen) => set({ currentScreen: screen }),

      gameMode: 'normal',
      setGameMode: (mode) => set({ gameMode: mode }),

      playerTeam: [],
      addPokemon: (pokemon) => {
        const { playerTeam } = get();
        if (playerTeam.length >= 6) return;
        set({ playerTeam: [...playerTeam, pokemon] });
      },
      removePokemon: (id) => {
        set(s => ({ playerTeam: s.playerTeam.filter(p => p.id !== id) }));
      },
      updateTeam: (team) => set({ playerTeam: team }),
      healTeam: () => {
        set(s => ({
          playerTeam: s.playerTeam.map(p => ({
            ...p,
            currentHP: p.maxHP,
            status: null,
            statusTurns: 0,
          })),
        }));
      },

      currentMap: null,
      currentNode: null,
      completedNodes: [],
      accessibleNodes: [],
      currentRegion: 0,
      currentLayer: 0,

      initMap: () => {
        const map = generateMap();
        const completedSet = new Set<string>();
        const accessible = getAccessibleNodes(map, completedSet);
        set({
          currentMap: map,
          currentNode: null,
          completedNodes: [],
          accessibleNodes: accessible,
          currentRegion: 0,
          currentLayer: 0,
        });
      },

      selectNode: (nodeId) => {
        const { currentMap } = get();
        if (!currentMap) return;
        const node = currentMap.nodes.find(n => n.id === nodeId);
        if (node) {
          set({ currentNode: node, currentLayer: node.layer, currentRegion: node.region });
        }
      },

      completeNode: (nodeId) => {
        const { currentMap, completedNodes } = get();
        if (!currentMap) return;

        const newCompleted = [...completedNodes, nodeId];
        const completedSet = new Set(newCompleted);
        const accessible = getAccessibleNodes(currentMap, completedSet);

        const node = currentMap.nodes.find(n => n.id === nodeId);
        const newRegion = node?.region ?? 0;

        // Check if boss was cleared to update region
        let clearedRegion = get().currentRegion;
        if (node?.type === 'boss') {
          clearedRegion = newRegion + 1;
        }

        set({
          completedNodes: newCompleted,
          accessibleNodes: accessible,
          currentRegion: clearedRegion,
        });
      },

      items: [],
      addItem: (item) => set(s => ({ items: [...s.items, item] })),
      removeItem: (itemId) => set(s => {
        const idx = s.items.findIndex(i => i.id === itemId);
        if (idx === -1) return s;
        const newItems = [...s.items];
        newItems.splice(idx, 1);
        return { items: newItems };
      }),
      useItem: (itemId, targetIndex) => {
        const { playerTeam, items } = get();
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const team = [...playerTeam];
        const target = team[targetIndex];
        if (!target) return;

        switch (item.effect.type) {
          case 'heal': {
            const heal = item.effect.value ?? 50;
            target.currentHP = Math.min(target.maxHP, target.currentHP + heal);
            break;
          }
          case 'revive': {
            if (target.currentHP > 0) return; // Can't revive non-fainted
            const pct = item.effect.value ?? 0.5;
            target.currentHP = Math.floor(target.maxHP * pct);
            break;
          }
          case 'cure_status': {
            target.status = null;
            target.statusTurns = 0;
            break;
          }
          case 'level_up': {
            const leveled = levelUp(target);
            team[targetIndex] = leveled;
            // Remove item before async evolution check
            get().removeItem(itemId);
            set({ playerTeam: team });

            // Check evolution async
            tryEvolve(leveled).then(evolved => {
              if (evolved) {
                get().addPendingEvolution({ pokemon: leveled, evolvesTo: evolved });
                get().setScreen('evolution');
              }
            });
            return;
          }
          case 'stat_boost': {
            const stat = item.effect.stat;
            const val = item.effect.value ?? 1;
            if (stat === 'atk') target.atkStage = Math.min(6, target.atkStage + val);
            if (stat === 'spAtk') target.spAtkStage = Math.min(6, target.spAtkStage + val);
            if (stat === 'speed') target.speedStage = Math.min(6, target.speedStage + val);
            break;
          }
          case 'xp_share': {
            get().setXpShare(true);
            get().removeItem(itemId);
            set({ playerTeam: team });
            return;
          }
          case 'held': {
            target.heldItem = item.effect.heldType ?? null;
            break;
          }
        }

        get().removeItem(itemId);
        set({ playerTeam: team });
      },

      coins: 0,
      addCoins: (amount) => set(s => ({ coins: s.coins + amount })),
      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) return false;
        set({ coins: coins - amount });
        return true;
      },

      runStats: defaultRunStats('normal'),
      updateStats: (partial) => set(s => ({
        runStats: { ...s.runStats, ...partial },
      })),

      runHistory: [],
      saveRun: (result) => {
        const { runStats, playerTeam, currentRegion } = get();
        const entry: RunHistory = {
          id: `run-${Date.now()}`,
          date: Date.now(),
          mode: runStats.mode,
          stats: { ...runStats, endTime: Date.now() },
          finalTeam: playerTeam.map(p => ({ name: p.displayName, level: p.level })),
          result,
          regionsCleared: currentRegion,
        };
        set(s => ({ runHistory: [entry, ...s.runHistory].slice(0, 10) }));
      },

      enemyTeam: [],
      setEnemyTeam: (team) => set({ enemyTeam: team }),

      pendingReward: null,
      setPendingReward: (reward) => set({ pendingReward: reward }),

      pendingEvent: null,
      setPendingEvent: (event) => set({ pendingEvent: event }),

      pendingShop: null,
      setPendingShop: (items) => set({ pendingShop: items }),

      xpShareActive: false,
      setXpShare: (v) => set({ xpShareActive: v }),

      pendingEvolutions: [],
      get pendingEvolution() { return get().pendingEvolutions[0] ?? null; },
      addPendingEvolution: (evo) => set(s => ({ pendingEvolutions: [...s.pendingEvolutions, evo] })),
      confirmEvolution: () => {
        const { pendingEvolutions, playerTeam } = get();
        const current = pendingEvolutions[0];
        if (!current) return;

        const idx = playerTeam.findIndex(p => p.id === current.pokemon.id && p.level === current.pokemon.level);
        const newTeam = [...playerTeam];
        if (idx !== -1) newTeam[idx] = current.evolvesTo;
        set({ playerTeam: newTeam, pendingEvolutions: pendingEvolutions.slice(1) });
      },

      lastBattleResult: null,
      setLastBattleResult: (r) => set({ lastBattleResult: r }),

      resetRun: () => {
        const { gameMode } = get();
        const map = generateMap();
        const completedSet = new Set<string>();
        const accessible = getAccessibleNodes(map, completedSet);

        set({
          currentScreen: 'starter',
          playerTeam: [],
          currentMap: map,
          currentNode: null,
          completedNodes: [],
          accessibleNodes: accessible,
          currentRegion: 0,
          currentLayer: 0,
          items: [],
          coins: 300,
          runStats: defaultRunStats(gameMode),
          enemyTeam: [],
          pendingReward: null,
          pendingEvent: null,
          pendingShop: null,
          xpShareActive: false,
          pendingEvolutions: [],
          lastBattleResult: null,
        });
      },
    }),
    {
      name: 'poke-rogue-save',
      partialize: (state) => ({
        runHistory: state.runHistory,
        gameMode: state.gameMode,
      }),
    }
  )
);
