import type { GameMap, MapNode, NodeType, RegionInfo } from '../types/game';

const REGIONS: RegionInfo[] = [
  { id: 0, name: 'Viridian Forest', theme: 'forest', bossName: 'Brock' },
  { id: 1, name: 'Mt. Moon Pass', theme: 'cave', bossName: 'Misty' },
  { id: 2, name: 'Cerulean Route', theme: 'route', bossName: 'Lt. Surge' },
  { id: 3, name: 'Celadon City', theme: 'city', bossName: 'Erika' },
  { id: 4, name: 'Victory Road', theme: 'mountain', bossName: 'Champion' },
];

// Layer distributions (types per layer)
const LAYER_DISTRIBUTIONS: NodeType[][] = [
  // Layer 0 — easy start
  ['wild', 'wild', 'heal'],
  // Layer 1
  ['wild', 'trainer', 'item'],
  // Layer 2
  ['trainer', 'wild', 'shop'],
  // Layer 3 — midpoint
  ['elite', 'heal', 'event'],
  // Layer 4
  ['trainer', 'elite', 'item'],
  // Layer 5
  ['wild', 'trainer', 'shop'],
  // Layer 6 — boss
  ['boss', 'boss', 'boss'],
];

function generateNodeId(region: number, layer: number, position: number): string {
  return `r${region}l${layer}p${position}`;
}

function pickNodeTypes(layer: number, nodeCount: number): NodeType[] {
  const distribution = LAYER_DISTRIBUTIONS[Math.min(layer, LAYER_DISTRIBUTIONS.length - 1)];

  // If it's the boss layer, always return boss
  if (layer === 6) {
    return Array(nodeCount).fill('boss');
  }

  // Shuffle and pick
  const shuffled = [...distribution].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, nodeCount);
}

export function generateMap(): GameMap {
  const nodes: MapNode[] = [];

  for (const region of REGIONS) {
    const regionId = region.id;
    const prevLayerIds: string[][] = [];

    for (let layer = 0; layer < 7; layer++) {
      // Boss layer has just 1 node
      const nodeCount = layer === 6 ? 1 : Math.floor(Math.random() * 2) + 2; // 2 or 3 nodes
      const types = pickNodeTypes(layer, nodeCount);

      const layerNodes: string[] = [];

      for (let pos = 0; pos < nodeCount; pos++) {
        const id = generateNodeId(regionId, layer, pos);
        layerNodes.push(id);

        const node: MapNode = {
          id,
          type: layer === 6 ? 'boss' : types[pos] || 'wild',
          region: regionId,
          layer,
          position: pos,
          connections: [],
          completed: false,
          accessible: layer === 0 && regionId === 0, // Only first region's first layer is accessible
        };

        nodes.push(node);
      }

      prevLayerIds.push(layerNodes);

      // Connect to previous layer
      if (layer > 0) {
        const prevLayer = prevLayerIds[layer - 1];
        const currentLayer = layerNodes;

        // Each node in current layer connects back from prev
        for (let i = 0; i < prevLayer.length; i++) {
          const prevNodeId = prevLayer[i];
          // Connect to 1 or 2 nodes in current layer
          const targetIdx = i % currentLayer.length;
          const prevNode = nodes.find(n => n.id === prevNodeId)!;
          const targetId = currentLayer[targetIdx];

          if (!prevNode.connections.includes(targetId)) {
            prevNode.connections.push(targetId);
          }

          // Sometimes connect to adjacent node too
          if (currentLayer.length > 1 && Math.random() < 0.4) {
            const altIdx = (targetIdx + 1) % currentLayer.length;
            const altId = currentLayer[altIdx];
            if (!prevNode.connections.includes(altId)) {
              prevNode.connections.push(altId);
            }
          }
        }

        // Ensure all current layer nodes have at least one incoming connection
        for (const currentId of currentLayer) {
          const hasIncoming = nodes.some(n => n.connections.includes(currentId));
          if (!hasIncoming) {
            // Connect from a random prev layer node
            const randomPrev = prevLayer[Math.floor(Math.random() * prevLayer.length)];
            const prevNode = nodes.find(n => n.id === randomPrev)!;
            if (!prevNode.connections.includes(currentId)) {
              prevNode.connections.push(currentId);
            }
          }
        }
      }
    }

    // If not the first region, set all first layer nodes as inaccessible
    // They become accessible when the previous region's boss is beaten
    if (regionId > 0) {
      for (const node of nodes) {
        if (node.region === regionId && node.layer === 0) {
          node.accessible = false;
        }
      }
    }
  }

  return { nodes, regions: REGIONS };
}

export function getAccessibleNodes(map: GameMap, completedNodeIds: Set<string>): string[] {
  const accessible: string[] = [];

  for (const node of map.nodes) {
    if (completedNodeIds.has(node.id)) continue;

    // Once any node in this (region, layer) is completed, the rest of the layer is locked.
    // This enforces the Slay-the-Spire "commit to a path" rule.
    const layerAlreadyCommitted = map.nodes.some(
      n => n.region === node.region && n.layer === node.layer && completedNodeIds.has(n.id)
    );
    if (layerAlreadyCommitted) continue;

    // First layer of first region is always available at the start.
    if (node.region === 0 && node.layer === 0) {
      accessible.push(node.id);
      continue;
    }

    // First layer of subsequent regions unlocks when the previous region's boss is cleared.
    if (node.layer === 0 && node.region > 0) {
      const prevBoss = map.nodes.find(
        n => n.region === node.region - 1 && n.type === 'boss'
      );
      if (prevBoss && completedNodeIds.has(prevBoss.id)) {
        accessible.push(node.id);
      }
      continue;
    }

    // All other nodes: accessible only if a direct predecessor is completed.
    const predecessors = map.nodes.filter(n => n.connections.includes(node.id));
    if (predecessors.some(p => completedNodeIds.has(p.id))) {
      accessible.push(node.id);
    }
  }

  return [...new Set(accessible)];
}

export function getNodeLabel(type: NodeType): string {
  const labels: Record<NodeType, string> = {
    wild: '🌿 Wild',
    trainer: '👤 Trainer',
    elite: '⚔️ Elite',
    heal: '💊 Rest',
    item: '🎁 Item',
    shop: '🏪 Shop',
    event: '❓ Event',
    boss: '👑 Boss',
  };
  return labels[type];
}

export function getNodeColor(type: NodeType): string {
  const colors: Record<NodeType, string> = {
    wild: '#4ade80',
    trainer: '#60a5fa',
    elite: '#f97316',
    heal: '#34d399',
    item: '#a78bfa',
    shop: '#fbbf24',
    event: '#e879f9',
    boss: '#f43f5e',
  };
  return colors[type];
}

// Region 0 (Viridian): 5-17  |  Region 1 (Mt. Moon): 16-32
// Region 2 (Route):   30-46  |  Region 3 (Celadon):  44-61
// Region 4 (Victory): 57-79  (boss scales +6 beyond normal)
export function getLevelRange(region: number, layer: number): [number, number] {
  const regionBase = [5, 16, 30, 44, 57][Math.min(region, 4)];
  const bossBonus = layer === 6 ? 6 : 0;
  const min = regionBase + layer * 2 + bossBonus;
  const max = min + 6;
  return [min, max];
}
