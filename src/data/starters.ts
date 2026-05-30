// Starter Pokémon IDs organized by generation
export const STARTERS_BY_GEN: Record<number, number[]> = {
  1: [1, 4, 7],       // Bulbasaur, Charmander, Squirtle
  2: [152, 155, 158], // Chikorita, Cyndaquil, Totodile
  3: [252, 255, 258], // Treecko, Torchic, Mudkip
  4: [387, 390, 393], // Turtwig, Chimchar, Piplup
  5: [495, 498, 501], // Snivy, Tepig, Oshawott
  6: [650, 653, 656], // Chespin, Fennekin, Froakie
  7: [722, 725, 728], // Rowlet, Litten, Popplio
  8: [810, 813, 816], // Grookey, Scorbunny, Sobble
  9: [906, 909, 912], // Sprigatito, Fuecoco, Quaxly
};

// All starter IDs combined
export const ALL_STARTER_IDS: number[] = Object.values(STARTERS_BY_GEN).flat();

// Special/legendary starters occasionally offered
export const BONUS_STARTERS: number[] = [
  133, // Eevee
  25,  // Pikachu
  172, // Pichu
  438, // Bonsly
  458, // Mantyke
  447, // Riolu
  349, // Feebas
  129, // Magikarp
];

export function getRandomStarters(count = 3): number[] {
  const allStarters = [...ALL_STARTER_IDS];
  // Occasionally add a bonus starter
  if (Math.random() < 0.3) {
    allStarters.push(BONUS_STARTERS[Math.floor(Math.random() * BONUS_STARTERS.length)]);
  }

  const shuffled = allStarters.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Evolution data for starter Pokémon
export const EVOLUTION_LEVELS: Record<number, { evolvesTo: number; level: number }> = {
  // Gen 1
  1: { evolvesTo: 2, level: 16 },
  2: { evolvesTo: 3, level: 32 },
  4: { evolvesTo: 5, level: 16 },
  5: { evolvesTo: 6, level: 36 },
  7: { evolvesTo: 8, level: 16 },
  8: { evolvesTo: 9, level: 36 },
  // Gen 2
  152: { evolvesTo: 153, level: 16 },
  153: { evolvesTo: 154, level: 32 },
  155: { evolvesTo: 156, level: 14 },
  156: { evolvesTo: 157, level: 36 },
  158: { evolvesTo: 159, level: 18 },
  159: { evolvesTo: 160, level: 30 },
  // Gen 3
  252: { evolvesTo: 253, level: 16 },
  253: { evolvesTo: 254, level: 36 },
  255: { evolvesTo: 256, level: 16 },
  256: { evolvesTo: 257, level: 36 },
  258: { evolvesTo: 259, level: 16 },
  259: { evolvesTo: 260, level: 36 },
  // Gen 4
  387: { evolvesTo: 388, level: 18 },
  388: { evolvesTo: 389, level: 32 },
  390: { evolvesTo: 391, level: 14 },
  391: { evolvesTo: 392, level: 36 },
  393: { evolvesTo: 394, level: 16 },
  394: { evolvesTo: 395, level: 36 },
  // Gen 5
  495: { evolvesTo: 496, level: 17 },
  496: { evolvesTo: 497, level: 36 },
  498: { evolvesTo: 499, level: 17 },
  499: { evolvesTo: 500, level: 36 },
  501: { evolvesTo: 502, level: 17 },
  502: { evolvesTo: 503, level: 36 },
  // Gen 6
  650: { evolvesTo: 651, level: 16 },
  651: { evolvesTo: 652, level: 36 },
  653: { evolvesTo: 654, level: 16 },
  654: { evolvesTo: 655, level: 36 },
  656: { evolvesTo: 657, level: 16 },
  657: { evolvesTo: 658, level: 36 },
  // Gen 7
  722: { evolvesTo: 723, level: 17 },
  723: { evolvesTo: 724, level: 34 },
  725: { evolvesTo: 726, level: 17 },
  726: { evolvesTo: 727, level: 34 },
  728: { evolvesTo: 729, level: 17 },
  729: { evolvesTo: 730, level: 34 },
  // Gen 8
  810: { evolvesTo: 811, level: 16 },
  811: { evolvesTo: 812, level: 35 },
  813: { evolvesTo: 814, level: 16 },
  814: { evolvesTo: 815, level: 35 },
  816: { evolvesTo: 817, level: 16 },
  817: { evolvesTo: 818, level: 35 },
  // Gen 9
  906: { evolvesTo: 907, level: 16 },
  907: { evolvesTo: 908, level: 36 },
  909: { evolvesTo: 910, level: 16 },
  910: { evolvesTo: 911, level: 35 },
  912: { evolvesTo: 913, level: 16 },
  913: { evolvesTo: 914, level: 36 },
  // Eevee evolutions (for wild encounters)
  133: { evolvesTo: 136, level: 25 }, // Default to Flareon
  25: { evolvesTo: 26, level: 25 },   // Pikachu -> Raichu
  172: { evolvesTo: 25, level: 15 },  // Pichu -> Pikachu
  447: { evolvesTo: 448, level: 25 }, // Riolu -> Lucario
};

// Many common non-starter evolution lines
export const MORE_EVOLUTIONS: Record<number, { evolvesTo: number; level: number }> = {
  // Caterpie line
  10: { evolvesTo: 11, level: 7 },
  11: { evolvesTo: 12, level: 10 },
  // Weedle line
  13: { evolvesTo: 14, level: 7 },
  14: { evolvesTo: 15, level: 10 },
  // Pidgey line
  16: { evolvesTo: 17, level: 18 },
  17: { evolvesTo: 18, level: 36 },
  // Rattata line
  19: { evolvesTo: 20, level: 20 },
  // Geodude line
  74: { evolvesTo: 75, level: 25 },
  75: { evolvesTo: 76, level: 40 },
  // Machop line
  66: { evolvesTo: 67, level: 28 },
  67: { evolvesTo: 68, level: 40 },
  // Gastly line
  92: { evolvesTo: 93, level: 25 },
  93: { evolvesTo: 94, level: 40 },
  // Dratini line
  147: { evolvesTo: 148, level: 30 },
  148: { evolvesTo: 149, level: 55 },
  // Magikarp
  129: { evolvesTo: 130, level: 20 },
  // Beldum
  374: { evolvesTo: 375, level: 20 },
  375: { evolvesTo: 376, level: 45 },
};

export function getEvolutionData(pokemonId: number): { evolvesTo: number; level: number } | null {
  return EVOLUTION_LEVELS[pokemonId] || MORE_EVOLUTIONS[pokemonId] || null;
}
