import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components/ui/Button';
import { PokemonSprite } from '../components/pokemon/PokemonSprite';
import { getNodeColor, getLevelRange } from '../utils/mapGenerator';
import { NodeIcon } from '../components/map/NodeIcon';
import { fetchMultiplePokemon, getRandomPokemonIds } from '../services/pokeapi';
import { getWeightedRandomItem } from '../data/items';
import { getRandomEventMessage } from '../utils/helpers';
import type { NodeType } from '../types/game';
import type { Pokemon } from '../types/pokemon';


const NODE_FR: Record<NodeType, string> = {
  wild: 'Sauvage',
  trainer: 'Dresseur',
  elite: 'Élite',
  heal: 'Soin',
  item: 'Objet',
  shop: 'Boutique',
  event: 'Événement',
  boss: 'Boss',
};

export function MapScreen() {
  const {
    currentMap,
    accessibleNodes,
    completedNodes,
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
    items,
  } = useGameStore();

  const [loadingNode, setLoadingNode] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const didInitialScroll = useRef(false);

  const measure = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const pos: Record<string, { x: number; y: number }> = {};
    for (const id in nodeRefs.current) {
      const el = nodeRefs.current[id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      pos[id] = { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2 };
    }
    setPositions(pos);
    setSize({ w: rect.width, h: rect.height });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, currentRegion, completedNodes, currentMap]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure]);

  // Scroll to the bottom (start of the region) on first render.
  useEffect(() => {
    if (didInitialScroll.current || !scrollRef.current || size.h === 0) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    didInitialScroll.current = true;
  }, [size.h]);

  if (!currentMap) return null;

  const region = currentMap.regions[currentRegion];
  const regionNodes = currentMap.nodes.filter((n) => n.region === currentRegion);
  const layers = Array.from({ length: 7 }, (_, l) =>
    regionNodes.filter((n) => n.layer === l).sort((a, b) => a.position - b.position),
  );

  // Build connection edges within this region.
  const edges: { from: string; to: string; active: boolean }[] = [];
  for (const node of regionNodes) {
    for (const targetId of node.connections) {
      if (regionNodes.some((n) => n.id === targetId)) {
        edges.push({ from: node.id, to: targetId, active: completedNodes.includes(node.id) });
      }
    }
  }

  const allBossesDefeated = currentMap.nodes
    .filter((n) => n.type === 'boss')
    .every((n) => completedNodes.includes(n.id));

  const handleNodeClick = async (nodeId: string) => {
    if (!accessibleNodes.includes(nodeId) || completedNodes.includes(nodeId) || loadingNode) return;

    setLoadingNode(nodeId);
    const node = currentMap.nodes.find((n) => n.id === nodeId)!;
    selectNode(nodeId);

    const [minLevel, maxLevel] = getLevelRange(node.region, node.layer);
    const level = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    const adjustedLevel = level + (gameMode === 'challenge' ? 5 : 0);

    switch (node.type) {
      case 'heal': {
        healTeam();
        completeNode(nodeId);
        setLoadingNode(null);
        break;
      }
      case 'item': {
        addItem(getWeightedRandomItem());
        completeNode(nodeId);
        setLoadingNode(null);
        break;
      }
      case 'shop': {
        addItem(getWeightedRandomItem());
        addItem(getWeightedRandomItem());
        completeNode(nodeId);
        setLoadingNode(null);
        break;
      }
      case 'event': {
        const isGood = Math.random() > 0.4;
        const msg = getRandomEventMessage();
        if (isGood) {
          if (Math.random() < 0.4) {
            const item = getWeightedRandomItem();
            addItem(item);
            setPendingEvent({ message: `${msg}\n\nObjet reçu : ${item.name} !`, effect: 'good' });
          } else {
            const gained = Math.floor(Math.random() * 50 + 20);
            addCoins(gained);
            setPendingEvent({ message: `${msg}\n\nTu trouves ${gained} pièces !`, effect: 'good' });
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
        const [wildId] = getRandomPokemonIds(1, 1, 905, node.region);
        const enemies = await fetchMultiplePokemon([wildId], adjustedLevel);
        setEnemyTeam(enemies);
        setPendingReward({ type: 'pokemon', choices: enemies as Pokemon[] });
        setLoadingNode(null);
        setScreen('battle');
        break;
      }
      case 'trainer': {
        const enemyIds = getRandomPokemonIds(2 + Math.floor(Math.random() * 2), 1, 905, node.region);
        const enemies = await fetchMultiplePokemon(enemyIds, adjustedLevel);
        setEnemyTeam(enemies);
        setPendingReward({ type: 'item', items: [getWeightedRandomItem()] });
        setLoadingNode(null);
        setScreen('battle');
        break;
      }
      case 'elite': {
        const enemyIds = getRandomPokemonIds(3 + Math.floor(Math.random() * 2), 1, 905, node.region);
        const enemies = await fetchMultiplePokemon(enemyIds, adjustedLevel + 3);
        setEnemyTeam(enemies);
        const rewardPokemon = await fetchMultiplePokemon(getRandomPokemonIds(1, 1, 905, node.region), adjustedLevel + 2);
        setPendingReward({ type: 'pokemon', choices: rewardPokemon, items: [getWeightedRandomItem()] });
        setLoadingNode(null);
        setScreen('battle');
        break;
      }
      case 'boss': {
        const bossLevel = adjustedLevel + 5;
        const enemies = await fetchMultiplePokemon(getRandomPokemonIds(4 + Math.floor(Math.random() * 3), 1, 905, node.region), bossLevel);
        setEnemyTeam(enemies);
        const bonusPokemon = await fetchMultiplePokemon(getRandomPokemonIds(3, 1, 905, node.region), bossLevel - 5);
        setPendingReward({ type: 'pokemon', choices: bonusPokemon, items: [getWeightedRandomItem()] });
        setLoadingNode(null);
        setScreen('battle');
        break;
      }
      default:
        setLoadingNode(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[#09090f]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-base font-black text-white truncate">{region.name}</h1>
              <p className="text-[11px] text-white/40">Boss : {region.bossName}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/70 shrink-0">
              <span className="flex items-center gap-1">🪙 {coins}</span>
              <span className="flex items-center gap-1">🎒 {items.length}</span>
            </div>
          </div>
          {/* Region progress dots */}
          <div className="flex items-center gap-1.5 mt-2">
            {currentMap.regions.map((r, i) => (
              <div
                key={r.id}
                className="h-1 flex-1 rounded-full"
                style={{
                  background:
                    i < currentRegion ? '#4ade80' : i === currentRegion ? '#a78bfa' : 'rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Map (scrollable) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div ref={innerRef} className="relative max-w-md mx-auto px-6 py-8">
          {/* Connection lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={size.w}
            height={size.h}
            style={{ left: 0, top: 0 }}
          >
            {edges.map((e, i) => {
              const a = positions[e.from];
              const b = positions[e.to];
              if (!a || !b) return null;
              const midY = (a.y + b.y) / 2;
              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`}
                  fill="none"
                  stroke={e.active ? '#a78bfa' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={e.active ? 2.5 : 2}
                  strokeDasharray={e.active ? undefined : '5 5'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Layers, boss on top → start at bottom */}
          <div className="relative z-10 flex flex-col gap-9">
            {Array.from({ length: 7 }, (_, i) => {
              const layerIdx = 6 - i;
              const layerNodes = layers[layerIdx];
              if (layerNodes.length === 0) return <div key={layerIdx} className="h-0" />;

              return (
                <div key={layerIdx} className="flex items-center justify-around gap-3">
                  {layerNodes.map((node) => {
                    const isCompleted = completedNodes.includes(node.id);
                    const isAccessible = accessibleNodes.includes(node.id);
                    const isLoading = loadingNode === node.id;
                    const isBoss = node.type === 'boss';
                    const color = getNodeColor(node.type);
                    const clickable = isAccessible && !isCompleted && !loadingNode;
                    const dim = !isAccessible && !isCompleted;

                    return (
                      <div key={node.id} className="flex flex-col items-center gap-1">
                        <motion.button
                          ref={(el) => {
                            nodeRefs.current[node.id] = el;
                          }}
                          onClick={() => handleNodeClick(node.id)}
                          disabled={!clickable}
                          whileTap={clickable ? { scale: 0.9 } : {}}
                          className="relative rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            width: isBoss ? 68 : 52,
                            height: isBoss ? 68 : 52,
                            border: `2px solid ${isCompleted ? 'rgba(255,255,255,0.15)' : dim ? 'rgba(255,255,255,0.1)' : color}`,
                            background: isCompleted
                              ? 'rgba(255,255,255,0.04)'
                              : dim
                                ? 'rgba(255,255,255,0.03)'
                                : `radial-gradient(circle, ${color}33 0%, rgba(17,18,27,0.95) 75%)`,
                            boxShadow: clickable ? `0 0 18px ${color}55` : undefined,
                            opacity: dim ? 0.35 : 1,
                            cursor: clickable ? 'pointer' : 'default',
                          }}
                        >
                          {isLoading ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                          ) : isCompleted ? (
                            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <NodeIcon type={node.type} color={dim ? 'rgba(255,255,255,0.3)' : color} size={isBoss ? 30 : 22} />
                          )}

                          {clickable && (
                            <motion.span
                              className="absolute inset-0 rounded-full border-2"
                              style={{ borderColor: color }}
                              animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                            />
                          )}
                        </motion.button>

                        {clickable && (
                          <span className="text-[10px] font-bold" style={{ color }}>
                            {NODE_FR[node.type]}
                          </span>
                        )}
                        {isBoss && !isCompleted && !clickable && (
                          <span className="text-[10px] font-bold text-white/30">{region.bossName}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team bar */}
      <div className="sticky bottom-0 z-30 bg-[#09090f]/90 backdrop-blur-md border-t border-white/10 px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          {playerTeam.map((p, i) => {
            const pct = Math.max(0, p.currentHP / p.maxHP);
            const fainted = p.currentHP <= 0;
            return (
              <div
                key={`${p.id}-${i}`}
                className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1"
                style={{ opacity: fainted ? 0.4 : 1 }}
              >
                <PokemonSprite id={p.id} name={p.displayName} isShiny={p.isShiny} px={34} animate={false} />
                <div className="w-8 h-1 rounded-full bg-black/50 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct * 100}%`,
                      background: pct > 0.5 ? '#3ad860' : pct > 0.2 ? '#f7c843' : '#f2554b',
                    }}
                  />
                </div>
                <span className="text-[8px] text-white/40">Lv{p.level}</span>
              </div>
            );
          })}
          <div className="ml-2 text-[10px] text-white/30">
            {runStats.battlesWon}V / {runStats.battlesLost}D
          </div>
        </div>
      </div>

      {/* Champion overlay */}
      {allBossesDefeated && (
        <motion.div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-center p-8 bg-[#11121b] border border-yellow-500/30 rounded-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-yellow-400 mb-2">Champion !</h2>
            <p className="text-white/60 mb-6">Toutes les régions sont conquises !</p>
            <Button onClick={() => setScreen('victory')}>Voir les résultats</Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
