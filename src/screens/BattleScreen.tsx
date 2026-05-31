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
    addPendingEvolution,
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

      const evolutions: { pokemon: typeof playerTeam[0]; evolvesTo: typeof playerTeam[0] }[] = [];

      for (let i = 0; i < updatedTeam.length; i++) {
        const pokemon = updatedTeam[i];
        if (pokemon.currentHP <= 0 && !xpShareActive) continue;

        const xpGain = xpShareActive ? totalXP : Math.floor(totalXP / updatedTeam.filter(p => p.currentHP > 0).length);

        pokemon.xp += xpGain;

        // Level up loop — collect all evolutions
        while (pokemon.xp >= pokemon.xpToNext) {
          pokemon.xp -= pokemon.xpToNext;
          updatedTeam[i] = levelUp(updatedTeam[i]);
          const evolved = await tryEvolve(updatedTeam[i]);
          if (evolved) {
            evolutions.push({ pokemon: updatedTeam[i], evolvesTo: evolved });
          }
        }
      }

      updateTeam(updatedTeam);
      evolutions.forEach(e => addPendingEvolution(e));

      updateStats({ battlesWon: runStats.battlesWon + 1 });

      if (currentNode) {
        completeNode(currentNode.id);
      }

      const anyAlive = updatedTeam.some(p => p.currentHP > 0);
      if (!anyAlive) {
        setScreen('gameover');
      } else if (evolutions.length > 0) {
        setScreen('evolution');
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
        <p className="text-white/50">Préparation du combat…</p>
      </div>
    );
  }

  const title =
    currentNode?.type === 'boss' ? '👑 Combat de Boss' :
    currentNode?.type === 'elite' ? '⚔️ Dresseur d\'élite' :
    currentNode?.type === 'wild' ? '🌿 Pokémon sauvage' :
    '👤 Combat de dresseur';

  return (
    <motion.div
      className="min-h-screen px-4 py-5 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md mb-3 text-center">
        <h1 className="text-base font-bold text-white/90 tracking-wide">{title}</h1>
      </div>

      <BattleScene
        playerTeam={playerTeam}
        enemyTeam={enemyTeam}
        onBattleEnd={handleBattleEnd}
      />
    </motion.div>
  );
}
