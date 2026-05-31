import type { Pokemon, PokemonType } from '../types/pokemon';
import { getMovesForLevel } from '../data/moves';
import { getEvolutionData } from '../data/starters';
import { getRandomNature, getNatureModifier, type NatureName } from '../data/natures';

// In-memory cache
const pokemonCache: Map<number, Pokemon> = new Map();
const apiDataCache: Map<string, unknown> = new Map();

const BASE_URL = 'https://pokeapi.co/api/v2';
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getSpriteUrl(id: number, shiny = false): string {
  if (shiny) return `${SPRITE_BASE}/shiny/${id}.png`;
  return `${SPRITE_BASE}/${id}.png`;
}

export function getAnimatedSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/versions/generation-v/black-white/animated/${id}.gif`;
}

export function getBackSpriteUrl(id: number, shiny = false): string {
  if (shiny) return `${SPRITE_BASE}/back/shiny/${id}.png`;
  return `${SPRITE_BASE}/back/${id}.png`;
}

export function getAnimatedBackSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/versions/generation-v/black-white/animated/back/${id}.gif`;
}

export function getArtworkUrl(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`;
}

async function fetchWithCache(url: string): Promise<unknown> {
  if (apiDataCache.has(url)) return apiDataCache.get(url)!;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const data = await response.json();
  apiDataCache.set(url, data);
  return data;
}

interface PokeAPIStats {
  base_stat: number;
  stat: { name: string };
}

interface PokeAPIMoveEntry {
  move: { name: string; url: string };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: { name: string };
  }>;
}

interface PokeAPITypeEntry {
  type: { name: string };
}

interface PokeAPIAbilityEntry {
  ability: { name: string };
  is_hidden: boolean;
}

interface PokeAPISpriteData {
  front_default: string | null;
  front_shiny: string | null;
}

interface PokeAPIResponse {
  id: number;
  name: string;
  stats: PokeAPIStats[];
  moves: PokeAPIMoveEntry[];
  types: PokeAPITypeEntry[];
  sprites: PokeAPISpriteData;
  abilities: PokeAPIAbilityEntry[];
}

function parseStats(apiStats: PokeAPIStats[]) {
  const stats = { hp: 45, atk: 45, def: 45, spAtk: 45, spDef: 45, speed: 45 };
  for (const s of apiStats) {
    switch (s.stat.name) {
      case 'hp': stats.hp = s.base_stat; break;
      case 'attack': stats.atk = s.base_stat; break;
      case 'defense': stats.def = s.base_stat; break;
      case 'special-attack': stats.spAtk = s.base_stat; break;
      case 'special-defense': stats.spDef = s.base_stat; break;
      case 'speed': stats.speed = s.base_stat; break;
    }
  }
  return stats;
}

function parseAbility(abilities: PokeAPIAbilityEntry[]): string {
  // Prefer non-hidden ability
  const main = abilities.find(a => !a.is_hidden);
  return (main ?? abilities[0])?.ability.name ?? 'none';
}

function generateIVs() {
  return {
    hp: Math.floor(Math.random() * 32),
    atk: Math.floor(Math.random() * 32),
    def: Math.floor(Math.random() * 32),
    spAtk: Math.floor(Math.random() * 32),
    spDef: Math.floor(Math.random() * 32),
    speed: Math.floor(Math.random() * 32),
  };
}

function calcHP(base: number, iv: number, level: number): number {
  return Math.floor(((2 * base + iv) * level) / 100) + level + 10;
}

function calcStat(base: number, iv: number, level: number): number {
  return Math.floor(((2 * base + iv) * level) / 100) + 5;
}

function xpToNext(level: number): number {
  return Math.floor(Math.pow(level, 3) * 0.6);
}

export function formatPokemonName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function fetchPokemon(id: number, level = 5): Promise<Pokemon> {
  const cacheKey = id;
  if (pokemonCache.has(cacheKey)) {
    return scaleToLevel(pokemonCache.get(cacheKey)!, level);
  }

  const data = await fetchWithCache(`${BASE_URL}/pokemon/${id}`) as PokeAPIResponse;

  const baseStats = parseStats(data.stats);
  const types = data.types.map((t: PokeAPITypeEntry) => t.type.name as PokemonType);
  const abilityName = parseAbility(data.abilities);
  const isShiny = Math.random() < 1 / 512;
  const nature = getRandomNature();
  const ivs = generateIVs();

  const maxHP = calcHP(baseStats.hp, ivs.hp, level);
  const moves = getMovesForLevel(types, level);
  const evolutionData = getEvolutionData(id);
  void evolutionData;

  const pokemon: Pokemon = {
    id,
    name: data.name,
    displayName: formatPokemonName(data.name),
    types,
    baseStats,
    ivs,
    nature,
    abilityName,
    level,
    currentHP: maxHP,
    maxHP,
    moves,
    status: null,
    statusTurns: 0,
    heldItem: null,
    isShiny,
    xp: 0,
    xpToNext: xpToNext(level),
    atkStage: 0,
    defStage: 0,
    spAtkStage: 0,
    spDefStage: 0,
    speedStage: 0,
    sprite: getSpriteUrl(id, isShiny),
    animatedSprite: getAnimatedSpriteUrl(id),
  };

  pokemonCache.set(cacheKey, { ...pokemon, level: 5, currentHP: calcHP(baseStats.hp, ivs.hp, 5), maxHP: calcHP(baseStats.hp, ivs.hp, 5) });

  return pokemon;
}

export function scaleToLevel(pokemon: Pokemon, level: number): Pokemon {
  const ivs = generateIVs();
  const nature = getRandomNature();
  const isShiny = Math.random() < 1 / 512;
  const maxHP = calcHP(pokemon.baseStats.hp, ivs.hp, level);
  const moves = getMovesForLevel(pokemon.types, level);

  return {
    ...pokemon,
    ivs,
    nature,
    level,
    currentHP: maxHP,
    maxHP,
    moves,
    status: null,
    statusTurns: 0,
    heldItem: null,
    isShiny,
    xp: 0,
    xpToNext: xpToNext(level),
    atkStage: 0,
    defStage: 0,
    spAtkStage: 0,
    spDefStage: 0,
    speedStage: 0,
    sprite: getSpriteUrl(pokemon.id, isShiny),
    animatedSprite: getAnimatedSpriteUrl(pokemon.id),
  };
}

export function getEffectiveStat(pokemon: Pokemon, stat: 'atk' | 'def' | 'spAtk' | 'spDef' | 'speed'): number {
  const base = pokemon.baseStats[stat];
  const iv = pokemon.ivs[stat];
  const level = pokemon.level;
  let value = calcStat(base, iv, level);

  // Nature modifier
  if (pokemon.nature) {
    value = Math.floor(value * getNatureModifier(pokemon.nature as NatureName, stat));
  }

  // Stage multipliers
  const stageMap: Record<string, number> = {
    atk: pokemon.atkStage,
    def: pokemon.defStage,
    spAtk: pokemon.spAtkStage,
    spDef: pokemon.spDefStage,
    speed: pokemon.speedStage,
  };
  const stage = stageMap[stat] || 0;
  if (stage > 0) value = Math.floor(value * (2 + stage) / 2);
  else if (stage < 0) value = Math.floor(value * 2 / (2 - stage));

  // Status modifiers (ability-aware)
  if (stat === 'atk') {
    if (pokemon.status !== null && (pokemon.abilityName === 'guts' || pokemon.abilityName === 'quick-feet')) {
      value = Math.floor(value * 1.5); // Guts boosts ATK when statused, negates burn drop
    } else if (pokemon.status === 'burn') {
      value = Math.floor(value * 0.5);
    }
  }
  if (stat === 'speed') {
    if (pokemon.status === 'paralysis') {
      if (pokemon.abilityName === 'quick-feet') {
        value = Math.floor(value * 1.5); // Quick Feet boosts speed when statused
      } else {
        value = Math.floor(value * 0.5);
      }
    }
  }

  // Held item modifiers
  if (pokemon.heldItem === 'assault-vest' && stat === 'spDef') value = Math.floor(value * 1.5);
  if (pokemon.heldItem === 'choice-scarf' && stat === 'speed') value = Math.floor(value * 1.5);
  if (pokemon.heldItem === 'choice-band' && stat === 'atk') value = Math.floor(value * 1.5);
  if (pokemon.heldItem === 'choice-specs' && stat === 'spAtk') value = Math.floor(value * 1.5);

  return Math.max(1, value);
}

export async function fetchMultiplePokemon(ids: number[], level: number): Promise<Pokemon[]> {
  const batchSize = 5;
  const results: Pokemon[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(id => fetchPokemon(id, level)));
    results.push(...batchResults);
  }
  return results;
}

// Legendary/mythical Pokémon IDs — excluded from all pools.
const LEGENDARY_IDS = new Set([
  144, 145, 146, 150, 151,
  243, 244, 245, 249, 250, 251,
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
  494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  716, 717, 718, 719, 720, 721,
  785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798,
  799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898,
  905, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010,
]);

// Curated Pokémon pools per region — thematically appropriate encounters.
// These replace random-range sampling for a true crescendo experience.
const CURATED_REGION_POOLS: number[][] = [
  // Region 0 — Viridian Forest (Bug/Normal/early Kanto + Johto)
  [
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    29, 30, 32, 33, 39, 40, 43, 44, 46, 47, 48, 49, 52, 53, 56, 57, 69, 70,
    161, 162, 163, 164, 165, 166, 167, 168, 172, 173, 174, 175, 176,
    183, 184, 187, 188, 189, 191, 192, 193, 204, 205,
  ],

  // Region 1 — Mt. Moon (Rock/Cave/Water)
  [
    35, 36, 41, 42, 54, 55, 60, 61, 62, 66, 67, 72, 73, 74, 75, 76,
    79, 80, 86, 87, 90, 91, 95, 98, 99, 116, 117, 118, 119, 120, 121,
    194, 195, 209, 210, 211, 218, 219, 220, 221, 222, 223, 224, 226,
    231, 232, 238, 239, 240, 246, 247,
    278, 279, 283, 284, 285, 286, 316, 317, 318, 319, 339, 340, 363, 364, 365,
  ],

  // Region 2 — Cerulean Route (Psychic/Electric/Fire/Ghost)
  [
    37, 38, 58, 59, 63, 64, 65, 83, 84, 85, 88, 89, 92, 93, 94,
    96, 97, 100, 101, 102, 103, 108, 109, 110, 114, 122, 128, 132,
    170, 171, 190, 198, 200, 203, 206, 207, 215, 225, 228, 229, 234,
    261, 262, 280, 281, 282, 302, 304, 305, 306, 309, 310, 311, 312,
    325, 326, 331, 332, 337, 338, 354, 355, 359,
    403, 404, 405, 406, 407, 420, 421, 425, 426, 427, 428, 434, 435, 436, 437,
    509, 510, 519, 520, 521, 546, 547, 548, 549, 554, 555, 556, 557, 558, 561,
    577, 578, 579,
  ],

  // Region 3 — Celadon City (Mixed evolved/strong midgame)
  [
    110, 113, 115, 123, 124, 125, 126, 127, 130, 131, 133, 134, 135, 136,
    137, 138, 139, 140, 141, 142, 143,
    186, 196, 197, 199, 208, 212, 214, 230, 233, 242, 248,
    330, 334, 351, 357, 371, 372, 373, 374, 375, 376,
    443, 444, 445, 446, 448, 449, 450, 451, 452, 453, 454, 456, 457, 459, 460,
    461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475,
    530, 534, 537, 545, 549, 553, 555, 563, 571, 579, 596, 598, 604, 609, 612,
    620, 625, 628, 630, 635, 637,
    661, 662, 663, 675, 681, 689, 693, 697, 699, 700, 706, 715,
  ],

  // Region 4 — Victory Road (Dragons/Pseudo-legendary/strong Gen 1-9)
  [
    68, 71, 76, 89, 91, 94, 112, 130, 131, 142, 143, 147, 148, 149,
    208, 248, 373, 376,
    445, 448, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478,
    500, 503, 530, 534, 545, 553, 555, 571, 579, 596, 598, 604, 609, 612, 620, 625, 628, 630, 635, 637,
    663, 675, 681, 689, 693, 697, 699, 700, 706, 715,
    730, 738, 745, 748, 752, 760, 768, 778, 784,
    812, 815, 818, 823, 836, 844, 849, 861, 879, 884, 887,
    908, 911, 914, 934, 936, 937, 941, 943, 947, 956, 959, 966, 970, 972, 975, 977, 979, 981, 983,
  ],
];

export function getRandomPokemonIds(count: number, _minId?: number, _maxId?: number, region = 4): number[] {
  const pool = CURATED_REGION_POOLS[Math.min(region, 4)].filter(id => !LEGENDARY_IDS.has(id));
  const ids: number[] = [];
  const used = new Set<number>();
  let tries = 0;

  while (ids.length < count && tries < 2000) {
    tries++;
    const id = pool[Math.floor(Math.random() * pool.length)];
    if (!used.has(id)) {
      used.add(id);
      ids.push(id);
    }
  }

  return ids;
}

export function levelUp(pokemon: Pokemon): Pokemon {
  const newLevel = pokemon.level + 1;
  const newMaxHP = calcHP(pokemon.baseStats.hp, pokemon.ivs.hp, newLevel);
  const hpIncrease = newMaxHP - pokemon.maxHP;

  return {
    ...pokemon,
    level: newLevel,
    maxHP: newMaxHP,
    currentHP: Math.min(pokemon.currentHP + hpIncrease, newMaxHP),
    xpToNext: xpToNext(newLevel),
    xp: 0,
  };
}

export async function tryEvolve(pokemon: Pokemon): Promise<Pokemon | null> {
  const evolutionData = getEvolutionData(pokemon.id);
  if (!evolutionData || pokemon.level < evolutionData.level) return null;

  try {
    const evolved = await fetchPokemon(evolutionData.evolvesTo, pokemon.level);
    evolved.ivs = pokemon.ivs;
    evolved.nature = pokemon.nature;
    evolved.heldItem = pokemon.heldItem;
    evolved.status = null;
    evolved.statusTurns = 0;

    const newMaxHP = calcHP(evolved.baseStats.hp, evolved.ivs.hp, pokemon.level);
    const hpPercent = pokemon.currentHP / pokemon.maxHP;
    evolved.maxHP = newMaxHP;
    evolved.currentHP = Math.floor(newMaxHP * hpPercent);

    return evolved;
  } catch {
    return null;
  }
}
