import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useBattleStore } from '../stores/battleStore';
import { simulateBattle } from '../utils/battleEngine';
import { BattleScene } from '../components/battle/BattleScene';
import { levelUp, tryEvolve } from '../services/pokeapi';

export function BattleScreen() {
  const {
    playerTeam,
    enemyTeam,
    currentNode,
    gameMode,
    updateTeam,
    completeNode,
    setScreen,
    updateStats,
    runStats,
    xpShareActive,
    setPendingEvolution,
    setLastBattleResult,
  } = useGameStore();

  const { initBattle, resetBattle } = useBattleStore();

  useEffect(() => {
    if (playerTeam.length === 0 || enemyTeam.length === 0) return;

    // Run the battle simulation
    const result = simulateBattle(playerTeam, enemyTeam);

    // Initialize the battle store with events
    initBattle(
      result.events,
      playerTeam.map(p => p.currentHP),
      enemyTeam.map(p => p.currentHP),
    );

    // Update team HP to match battle result
    const updatedTeam = result.playerTeamFinal.map((p, i) => ({
      ...playerTeam[i],
      currentHP: p.currentHP,
      status: p.status,
      statusTurns: p.statusTurns,
      heldItem: p.heldItem,
    }));
    updateTeam(updatedTeam);

    return () => {
      resetBattle();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBattleEnd = async (winner: 'player' | 'enemy') => {
    setLastBattleResult(winner === 'player' ? 'win' : 'loss');

    if (winner === 'player') {
      // Grant XP
      const updatedTeam = [...playerTeam];
      const totalXP = enemyTeam.reduce((sum, e) => {
        return sum + Math.floor(
          (Object.values(e.baseStats).reduce((a, b) => a + b, 0) * e.level * 7) / (10 * playerTeam.length)
        );
      }, 0);

      let evolutionPending: { pokemon: typeof playerTeam[0]; evolvesTo: typeof playerTeam[0] } | null = null;

      for (let i = 0; i < updatedTeam.length; i++) {
        const pokemon = updatedTeam[i];
        if (pokemon.currentHP <= 0 && !xpShareActive) continue;

        const xpGain = xpShareActive ? totalXP : Math.floor(totalXP / updatedTeam.filter(p => p.currentHP > 0).length);

        pokemon.xp += xpGain;

        // Level up check
        while (pokemon.xp >= pokemon.xpToNext) {
          pokemon.xp -= pokemon.xpToNext;
          updatedTeam[i] = levelUp(pokemon);

          // Check evolution (only do first evolution we find)
          if (!evolutionPending) {
            const evolved = await tryEvolve(updatedTeam[i]);
            if (evolved) {
              evolutionPending = { pokemon: updatedTeam[i], evolvesTo: evolved };
            }
          }
        }
      }

      updateTeam(updatedTeam);

      if (evolutionPending) {
        setPendingEvolution(evolutionPending);
      }

      updateStats({ battlesWon: runStats.battlesWon + 1 });

      if (currentNode) {
        completeNode(currentNode.id);
      }

      // Check if all player Pokémon fainted (shouldn't happen if winner is player, but safety)
      const anyAlive = updatedTeam.some(p => p.currentHP > 0);
      if (!anyAlive) {
        if (gameMode === 'nuzlocke') {
          setScreen('gameover');
        } else {
          setScreen('gameover');
        }
      } else {
        setScreen('reward');
      }
    } else {
      updateStats({ battlesLost: runStats.battlesLost + 1 });

      const anyAlive = playerTeam.some(p => p.currentHP > 0);
      if (!anyAlive) {
        setScreen('gameover');
      } else {
        // Still have Pokémon, just lost battle
        setScreen('gameover');
      }
    }
  };

  if (playerTeam.length === 0 || enemyTeam.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">Preparing battle...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-white">
            {currentNode?.type === 'boss' ? '👑 Boss Battle!' :
             currentNode?.type === 'elite' ? '⚔️ Elite Trainer!' :
             currentNode?.type === 'wild' ? '🌿 Wild Battle' :
             '👤 Trainer Battle'}
          </h1>
          <p className="text-white/40 text-xs">
            {currentNode?.type === 'boss' ? 'Defeat the region boss to advance!' :
             'Autobattle in progress — watch the action unfold'}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <BattleScene
          playerTeam={playerTeam}
          enemyTeam={enemyTeam}
          onBattleEnd={handleBattleEnd}
        />
      </div>
    </motion.div>
  );
}
