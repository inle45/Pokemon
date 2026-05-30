import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { getNodeLabel, getNodeColor, getLevelRange } from '../utils/mapGenerator';
import { fetchMultiplePokemon, getRandomPokemonIds } from '../services/pokeapi';
import { getWeightedRandomItem } from '../data/items';
import { getRandomTrainerName, getRandomEventMessage } from '../utils/helpers';
import type { MapNode } from '../types/game';
import type { Pokemon } from '../types/pokemon';

export function MapScreen() {
  const {
    currentMap,
    accessibleNodes,
    completedNodes,
    currentNode,
    playerTeam,
    currentRegion,
    selectNode,
    completeNode,
    setScreen,
    setEnemyTeam,
    addItem,
    addCoins,
    healTeam,
    setPendingReward,
    setPendingEvent,
    coins,
    runStats,
    gameMode,
  } = useGameStore();

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [loadingNode, setLoadingNode] = useState<string | null>(null);

  if (!currentMap) return null;

  const regions = currentMap.regions;

  // Group nodes by region and layer
  const nodesByRegionLayer: Record<string, MapNode[]> = {};
  for (const node of currentMap.nodes) {
    const key = `${node.region}-${node.layer}`;
    if (!nodesByRegionLayer[key]) nodesByRegionLayer[key] = [];
    nodesByRegionLayer[key].push(node);
  }

  const handleNodeClick = async (nodeId: string) => {
    if (!accessibleNodes.includes(nodeId) || completedNodes.includes(nodeId)) return;

    setLoadingNode(nodeId);
    const node = currentMap.nodes.find(n => n.id === nodeId)!;
    selectNode(nodeId);

    const [minLevel, maxLevel] = getLevelRange(node.region, node.layer);
    const level = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    const challengeBonus = gameMode === 'challenge' ? 5 : 0;
    const adjustedLevel = level + challengeBonus;

    switch (node.type) {
      case 'heal': {
        healTeam();
        completeNode(nodeId);
        setLoadingNode(null);
        break;
      }

      case 'item': {
        const item = getWeightedRandomItem();
        addItem(item);
        completeNode(nodeId);
        setLoadingNode(null);
        break;
      }

      case 'event': {
        const isGood = Math.random() > 0.4;
        const msg = getRandomEventMessage();
        if (isGood) {
          const rand = Math.random();
          if (rand < 0.4) {
            const item = getWeightedRandomItem();
            addItem(item);
            setPendingEvent({ message: `${msg}\n\nYou received: ${item.name}!`, effect: 'good' });
          } else {
            const coins = Math.floor(Math.random() * 50 + 20);
            addCoins(coins);
            setPendingEvent({ message: `${msg}\n\nYou found ${coins} coins!`, effect: 'good' });
          }
        } else {
          setPendingEvent({ message: msg, effect: 'bad' });
        }
        completeNode(nodeId);
        setScreen('event');
        setLoadingNode(null);
        break;
      }

      case 'wild': {
        const [wildId] = getRandomPokemonIds(1, 1, 905);
        const enemies = await fetchMultiplePokemon([wildId], adjustedLevel);
        setEnemyTeam(enemies);

        // Reward: chance to catch the wild Pokémon
        const reward: { type: 'pokemon' | 'item' | 'coins' | 'heal'; choices?: Pokemon[] } = {
          type: 'pokemon',
          choices: enemies,
        };
        setPendingReward(reward);
        setLoadingNode(null);
        setScreen('battle');
        break;
      }

      case 'trainer': {
        const trainerSize = 2 + Math.floor(Math.random() * 2); // 2-3 Pokémon
        const enemyIds = getRandomPokemonIds(trainerSize, 1, 905);
        const enemies = await fetchMultiplePokemon(enemyIds, adjustedLevel);
        setEnemyTeam(enemies);

        const item = getWeightedRandomItem();
        setPendingReward({ type: 'item', items: [item] });
        setLoadingNode(null);
        setScreen('battle');
        break;
      }

      case 'elite': {
        const eliteSize = 3 + Math.floor(Math.random() * 2); // 3-4 Pokémon
        const enemyIds = getRandomPokemonIds(eliteSize, 1, 905);
        const enemies = await fetchMultiplePokemon(enemyIds, adjustedLevel + 3);
        setEnemyTeam(enemies);

        // Better rewards
        const eliteItem = getWeightedRandomItem();
        const rewardPokemonId = getRandomPokemonIds(1, 1, 905)[0];
        const rewardPokemon = await fetchMultiplePokemon([rewardPokemonId], adjustedLevel + 2);
        setPendingReward({ type: 'pokemon', choices: rewardPokemon, items: [eliteItem] });
        setLoadingNode(null);
        setScreen('battle');
        break;
      }

      case 'boss': {
        const bossSize = 4 + Math.floor(Math.random() * 3); // 4-6 Pokémon
        const bossIds = getRandomPokemonIds(bossSize, 1, 905);
        const bossLevel = adjustedLevel + 5;
        const enemies = await fetchMultiplePokemon(bossIds, bossLevel);
        setEnemyTeam(enemies);

        // Great rewards
        const bossItem = getWeightedRandomItem();
        const bonusPokemonIds = getRandomPokemonIds(3, 1, 905);
        const bonusPokemon = await fetchMultiplePokemon(bonusPokemonIds, bossLevel - 5);
        setPendingReward({ type: 'pokemon', choices: bonusPokemon, items: [bossItem] });
        setLoadingNode(null);
        setScreen('battle');
        break;
      }

      default: {
        setLoadingNode(null);
      }
    }
  };

  // Check if all regions are done (victory)
  const allBossesDefeated = currentMap.nodes
    .filter(n => n.type === 'boss')
    .every(n => completedNodes.includes(n.id));

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">World Map</h1>
          <p className="text-white/50 text-sm">Region {currentRegion + 1} of 5 · {completedNodes.length} nodes cleared</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>💰 {coins}</span>
          <span>⚔️ {runStats.battlesWon}W / {runStats.battlesLost}L</span>
        </div>
      </div>

      {/* Map */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] space-y-4">
          {regions.map(region => (
            <div key={region.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-2 rounded-full ${currentRegion > region.id ? 'bg-green-400' : currentRegion === region.id ? 'bg-yellow-400' : 'bg-white/20'}`} />
                <h2 className="font-bold text-white">{region.name}</h2>
                <span className="text-xs text-white/40">Boss: {region.bossName}</span>
                {currentRegion > region.id && (
                  <span className="ml-auto text-xs text-green-400 font-semibold">✓ Cleared</span>
                )}
              </div>

              {/* Layers */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: 7 }, (_, layerIdx) => {
                  const key = `${region.id}-${layerIdx}`;
                  const layerNodes = nodesByRegionLayer[key] || [];

                  return (
                    <div key={layerIdx} className="flex flex-col gap-2 shrink-0">
                      <span className="text-[10px] text-white/20 text-center font-mono">
                        {layerIdx === 6 ? 'BOSS' : `L${layerIdx + 1}`}
                      </span>

                      {layerNodes.map(node => {
                        const isCompleted = completedNodes.includes(node.id);
                        const isAccessible = accessibleNodes.includes(node.id);
                        const isHovered = hoveredNode === node.id;
                        const isLoading = loadingNode === node.id;
                        const color = getNodeColor(node.type);

                        return (
                          <div key={node.id} className="relative">
                            {/* Tooltip */}
                            {isHovered && (
                              <motion.div
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border border-white/20 rounded-lg p-2 text-xs text-white whitespace-nowrap z-20 pointer-events-none"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {getNodeLabel(node.type)}
                                <br />
                                <span className="text-white/40">
                                  {isCompleted ? 'Completed' : isAccessible ? 'Click to enter' : 'Locked'}
                                </span>
                              </motion.div>
                            )}

                            <motion.button
                              onClick={() => handleNodeClick(node.id)}
                              onHoverStart={() => setHoveredNode(node.id)}
                              onHoverEnd={() => setHoveredNode(null)}
                              disabled={!isAccessible || isCompleted || !!loadingNode}
                              whileHover={isAccessible && !isCompleted ? { scale: 1.15 } : {}}
                              whileTap={isAccessible && !isCompleted ? { scale: 0.9 } : {}}
                              className={`
                                w-12 h-12 rounded-full flex items-center justify-center text-lg
                                transition-all duration-200 border-2 relative
                                ${isCompleted
                                  ? 'opacity-40 cursor-not-allowed border-white/10 bg-white/5'
                                  : isAccessible
                                    ? 'cursor-pointer border-opacity-80 shadow-lg'
                                    : 'opacity-20 cursor-not-allowed border-transparent bg-white/5'
                                }
                              `}
                              style={isAccessible && !isCompleted ? {
                                borderColor: color,
                                backgroundColor: color + '20',
                                boxShadow: `0 0 15px ${color}40`,
                              } : undefined}
                            >
                              {isLoading ? (
                                <motion.div
                                  className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                />
                              ) : isCompleted ? (
                                <span className="text-white/30">✓</span>
                              ) : (
                                <span>
                                  {node.type === 'wild' ? '🌿' :
                                   node.type === 'trainer' ? '👤' :
                                   node.type === 'elite' ? '⚔️' :
                                   node.type === 'heal' ? '💊' :
                                   node.type === 'item' ? '🎁' :
                                   node.type === 'shop' ? '🏪' :
                                   node.type === 'event' ? '❓' :
                                   node.type === 'boss' ? '👑' : '•'}
                                </span>
                              )}

                              {/* Pulse for accessible */}
                              {isAccessible && !isCompleted && (
                                <motion.div
                                  className="absolute inset-0 rounded-full border-2"
                                  style={{ borderColor: color }}
                                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                              )}
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player Team Sidebar */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">Your Team</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {playerTeam.map((p, i) => (
            <PokemonCard key={`${p.id}-${i}`} pokemon={p} compact showHP index={i} />
          ))}
        </div>
      </div>

      {allBossesDefeated && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-center p-10 bg-[#1a1a2e] border border-gold/30 rounded-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-black text-yellow-400 mb-2">You're a Champion!</h2>
            <p className="text-white/60 mb-6">All regions conquered!</p>
            <Button onClick={() => setScreen('victory')}>View Results</Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
