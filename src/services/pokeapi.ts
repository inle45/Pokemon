import type { Pokemon, PokemonType } from '../types/pokemon';
import { getMovesForLevel } from '../data/moves';
import { getEvolutionData } from '../data/starters';

// In-memory cache
const pokemonCache: Map<number, Pokemon> = new Map();
const apiDataCache: Map<string, unknown> = new Map();

const BASE_URL = 'https://pokeapi.co/api/v2';
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getSpriteUrl(id: number, shiny = false): string {
  if (shiny) {
    return `${SPRITE_BASE}/shiny/${id}.png`;
  }
  return `${SPRITE_BASE}/${id}.png`;
}

export function getAnimatedSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/versions/generation-v/black-white/animated/${id}.gif`;
}

export function getBackSpriteUrl(id: number, shiny = false): string {
  if (shiny) {
    return `${SPRITE_BASE}/back/shiny/${id}.png`;
  }
  return `${SPRITE_BASE}/back/${id}.png`;
}

export function getAnimatedBackSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/versions/generation-v/black-white/animated/back/${id}.gif`;
}

/** Official high-res artwork — used for menus/cards (crisp, not pixelated). */
export function getArtworkUrl(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`;
}

async function fetchWithCache(url: string): Promise<unknown> {
  if (apiDataCache.has(url)) {
    return apiDataCache.get(url)!;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
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

interface PokeAPISpriteData {
  front_default: string | null;
  front_shiny: string | null;
  versions?: {
    'generation-v'?: {
      'black-white'?: {
        animated?: {
          front_default: string | null;
        };
      };
    };
  };
}

interface PokeAPIResponse {
  id: number;
  name: string;
  stats: PokeAPIStats[];
  moves: PokeAPIMoveEntry[];
  types: PokeAPITypeEntry[];
  sprites: PokeAPISpriteData;
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
  // Check cache for this pokemon at this level
  const cacheKey = id;
  if (pokemonCache.has(cacheKey)) {
    const cached = pokemonCache.get(cacheKey)!;
    // Re-calculate stats for the new level
    return scaleToLevel(cached, level);
  }

  const data = await fetchWithCache(`${BASE_URL}/pokemon/${id}`) as PokeAPIResponse;

  const baseStats = parseStats(data.stats);
  const types = data.types.map((t: PokeAPITypeEntry) => t.type.name as PokemonType);
  const isShiny = Math.random() < 1 / 512;

  const ivs = generateIVs();

  const maxHP = calcHP(baseStats.hp, ivs.hp, level);
  const moves = getMovesForLevel(types, level);

  const evolutionData = getEvolutionData(id);

  const pokemon: Pokemon = {
    id,
    name: data.name,
    displayName: formatPokemonName(data.name),
    types,
    baseStats,
    ivs,
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

  // Store base version in cache (level 5)
  pokemonCache.set(cacheKey, { ...pokemon, level: 5, currentHP: calcHP(baseStats.hp, ivs.hp, 5), maxHP: calcHP(baseStats.hp, ivs.hp, 5) });

  return pokemon;
}

export function scaleToLevel(pokemon: Pokemon, level: number): Pokemon {
  const ivs = generateIVs(); // New IVs for unique instances
  const maxHP = calcHP(pokemon.baseStats.hp, ivs.hp, level);
  const isShiny = Math.random() < 1 / 512;
  const moves = getMovesForLevel(pokemon.types, level);

  return {
    ...pokemon,
    ivs,
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

  // Stage multipliers
  const stageMap: Record<string, number> = {
    atk: pokemon.atkStage,
    def: pokemon.defStage,
    spAtk: pokemon.spAtkStage,
    spDef: pokemon.spDefStage,
    speed: pokemon.speedStage,
  };

  const stage = stageMap[stat] || 0;
  if (stage > 0) {
    value = Math.floor(value * (2 + stage) / 2);
  } else if (stage < 0) {
    value = Math.floor(value * 2 / (2 - stage));
  }

  // Status modifiers
  if (stat === 'atk' && pokemon.status === 'burn') {
    value = Math.floor(value * 0.5);
  }
  if (stat === 'speed' && pokemon.status === 'paralysis') {
    value = Math.floor(value * 0.5);
  }

  // Held item modifiers
  if (pokemon.heldItem === 'assault-vest' && stat === 'spDef') {
    value = Math.floor(value * 1.5);
  }

  return Math.max(1, value);
}

// Fetch multiple Pokémon in parallel with rate limiting
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

// Get a random Pokémon from a generation range
export function getRandomPokemonIds(count: number, minId = 1, maxId = 905): number[] {
  const ids: number[] = [];
  const used = new Set<number>();

  while (ids.length < count) {
    const id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    if (!used.has(id)) {
      used.add(id);
      ids.push(id);
    }
  }

  return ids;
}

// Level up a Pokémon
export function levelUp(pokemon: Pokemon): Pokemon {
  const newLevel = pokemon.level + 1;
  const newMaxHP = calcHP(pokemon.baseStats.hp, pokemon.ivs.hp, newLevel);
  const hpIncrease = newMaxHP - pokemon.maxHP;

  const evolutionData = getEvolutionData(pokemon.id);

  return {
    ...pokemon,
    level: newLevel,
    maxHP: newMaxHP,
    currentHP: Math.min(pokemon.currentHP + hpIncrease, newMaxHP),
    xpToNext: xpToNext(newLevel),
    xp: 0,
  };
}

// Try to evolve a Pokémon if it meets level requirements
export async function tryEvolve(pokemon: Pokemon): Promise<Pokemon | null> {
  const evolutionData = getEvolutionData(pokemon.id);
  if (!evolutionData || pokemon.level < evolutionData.level) {
    return null;
  }

  try {
    const evolved = await fetchPokemon(evolutionData.evolvesTo, pokemon.level);
    // Keep some things from the original
    evolved.ivs = pokemon.ivs;
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
