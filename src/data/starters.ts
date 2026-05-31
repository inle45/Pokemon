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

// Many common non-starter evolution lines (covers all curated regional pools)
export const MORE_EVOLUTIONS: Record<number, { evolvesTo: number; level: number }> = {
  // ── Region 0 (Viridian Forest) ──────────────────────────────────────────────
  10: { evolvesTo: 11, level: 7 },    // Caterpie line
  11: { evolvesTo: 12, level: 10 },
  13: { evolvesTo: 14, level: 7 },    // Weedle line
  14: { evolvesTo: 15, level: 10 },
  16: { evolvesTo: 17, level: 18 },   // Pidgey line
  17: { evolvesTo: 18, level: 36 },
  19: { evolvesTo: 20, level: 20 },   // Rattata
  21: { evolvesTo: 22, level: 20 },   // Spearow
  23: { evolvesTo: 24, level: 22 },   // Ekans
  35: { evolvesTo: 36, level: 36 },   // Clefairy
  39: { evolvesTo: 40, level: 36 },   // Jigglypuff
  43: { evolvesTo: 44, level: 21 },   // Oddish line
  44: { evolvesTo: 45, level: 36 },
  46: { evolvesTo: 47, level: 24 },   // Paras
  48: { evolvesTo: 49, level: 31 },   // Venonat
  52: { evolvesTo: 53, level: 28 },   // Meowth
  56: { evolvesTo: 57, level: 28 },   // Mankey
  69: { evolvesTo: 70, level: 21 },   // Bellsprout line
  70: { evolvesTo: 71, level: 36 },
  161: { evolvesTo: 162, level: 15 }, // Sentret
  163: { evolvesTo: 164, level: 20 }, // Hoothoot
  165: { evolvesTo: 166, level: 18 }, // Ledyba
  167: { evolvesTo: 168, level: 22 }, // Spinarak
  173: { evolvesTo: 35, level: 15 },  // Cleffa
  174: { evolvesTo: 39, level: 15 },  // Igglybuff
  175: { evolvesTo: 176, level: 15 }, // Togepi
  176: { evolvesTo: 468, level: 40 }, // Togetic → Togekiss
  183: { evolvesTo: 184, level: 18 }, // Marill
  187: { evolvesTo: 188, level: 18 }, // Hoppip line
  188: { evolvesTo: 189, level: 27 },
  191: { evolvesTo: 192, level: 25 }, // Sunkern
  193: { evolvesTo: 469, level: 40 }, // Yanma
  204: { evolvesTo: 205, level: 31 }, // Pineco

  // ── Region 1 (Mt. Moon) ─────────────────────────────────────────────────────
  41: { evolvesTo: 42, level: 22 },   // Zubat line
  42: { evolvesTo: 169, level: 40 },  // Golbat → Crobat
  54: { evolvesTo: 55, level: 33 },   // Psyduck
  60: { evolvesTo: 61, level: 25 },   // Poliwag line
  61: { evolvesTo: 62, level: 40 },
  66: { evolvesTo: 67, level: 28 },   // Machop line
  67: { evolvesTo: 68, level: 40 },
  72: { evolvesTo: 73, level: 30 },   // Tentacool
  74: { evolvesTo: 75, level: 25 },   // Geodude line
  75: { evolvesTo: 76, level: 40 },
  79: { evolvesTo: 80, level: 37 },   // Slowpoke
  86: { evolvesTo: 87, level: 34 },   // Seel
  90: { evolvesTo: 91, level: 36 },   // Shellder
  95: { evolvesTo: 208, level: 40 },  // Onix → Steelix
  98: { evolvesTo: 99, level: 28 },   // Krabby
  116: { evolvesTo: 117, level: 32 }, // Horsea line
  117: { evolvesTo: 230, level: 40 }, // Seadra → Kingdra
  118: { evolvesTo: 119, level: 33 }, // Goldeen
  120: { evolvesTo: 121, level: 36 }, // Staryu
  194: { evolvesTo: 195, level: 20 }, // Wooper
  209: { evolvesTo: 210, level: 23 }, // Snubbull
  218: { evolvesTo: 219, level: 38 }, // Slugma
  220: { evolvesTo: 221, level: 33 }, // Swinub line
  221: { evolvesTo: 473, level: 50 }, // Piloswine → Mamoswine
  223: { evolvesTo: 224, level: 25 }, // Remoraid
  231: { evolvesTo: 232, level: 25 }, // Phanpy
  238: { evolvesTo: 124, level: 30 }, // Smoochum → Jynx
  239: { evolvesTo: 125, level: 30 }, // Elekid → Electabuzz
  240: { evolvesTo: 126, level: 30 }, // Magby → Magmar
  246: { evolvesTo: 247, level: 30 }, // Larvitar line
  247: { evolvesTo: 248, level: 55 },
  278: { evolvesTo: 279, level: 25 }, // Wingull
  283: { evolvesTo: 284, level: 22 }, // Surskit
  285: { evolvesTo: 286, level: 23 }, // Shroomish
  316: { evolvesTo: 317, level: 26 }, // Gulpin
  318: { evolvesTo: 319, level: 30 }, // Carvanha
  339: { evolvesTo: 340, level: 30 }, // Barboach
  363: { evolvesTo: 364, level: 32 }, // Spheal line
  364: { evolvesTo: 365, level: 44 },

  // ── Region 2 (Cerulean Route) ────────────────────────────────────────────────
  37: { evolvesTo: 38, level: 36 },   // Vulpix
  58: { evolvesTo: 59, level: 36 },   // Growlithe
  63: { evolvesTo: 64, level: 16 },   // Abra line
  64: { evolvesTo: 65, level: 36 },
  84: { evolvesTo: 85, level: 31 },   // Doduo
  88: { evolvesTo: 89, level: 38 },   // Grimer
  92: { evolvesTo: 93, level: 25 },   // Gastly line
  93: { evolvesTo: 94, level: 40 },
  96: { evolvesTo: 97, level: 26 },   // Drowzee
  100: { evolvesTo: 101, level: 30 }, // Voltorb
  102: { evolvesTo: 103, level: 36 }, // Exeggcute
  108: { evolvesTo: 463, level: 40 }, // Lickitung → Lickilicky
  109: { evolvesTo: 110, level: 35 }, // Koffing
  114: { evolvesTo: 465, level: 40 }, // Tangela → Tangrowth
  129: { evolvesTo: 130, level: 20 }, // Magikarp
  147: { evolvesTo: 148, level: 30 }, // Dratini line
  148: { evolvesTo: 149, level: 55 },
  170: { evolvesTo: 171, level: 27 }, // Chinchou
  190: { evolvesTo: 424, level: 40 }, // Aipom → Ambipom
  198: { evolvesTo: 430, level: 40 }, // Murkrow → Honchkrow
  200: { evolvesTo: 429, level: 40 }, // Misdreavus → Mismagius
  203: { evolvesTo: 981, level: 32 }, // Girafarig → Farigiraf
  207: { evolvesTo: 472, level: 40 }, // Gligar → Gliscor
  215: { evolvesTo: 461, level: 40 }, // Sneasel → Weavile
  228: { evolvesTo: 229, level: 24 }, // Houndour
  261: { evolvesTo: 262, level: 18 }, // Poochyena
  280: { evolvesTo: 281, level: 20 }, // Ralts line
  281: { evolvesTo: 282, level: 30 },
  304: { evolvesTo: 305, level: 32 }, // Aron line
  305: { evolvesTo: 306, level: 42 },
  309: { evolvesTo: 310, level: 26 }, // Electrike
  325: { evolvesTo: 326, level: 32 }, // Spoink
  331: { evolvesTo: 332, level: 32 }, // Cacnea
  354: { evolvesTo: 355, level: 37 }, // Shuppet
  403: { evolvesTo: 404, level: 15 }, // Shinx line
  404: { evolvesTo: 405, level: 30 },
  406: { evolvesTo: 407, level: 25 }, // Budew
  420: { evolvesTo: 421, level: 25 }, // Cherubi
  425: { evolvesTo: 426, level: 28 }, // Drifloon
  427: { evolvesTo: 428, level: 30 }, // Buneary
  434: { evolvesTo: 435, level: 34 }, // Stunky
  436: { evolvesTo: 437, level: 33 }, // Bronzor
  509: { evolvesTo: 510, level: 20 }, // Purrloin
  519: { evolvesTo: 520, level: 21 }, // Pidove line
  520: { evolvesTo: 521, level: 32 },
  546: { evolvesTo: 547, level: 30 }, // Cottonee
  548: { evolvesTo: 549, level: 30 }, // Petilil
  554: { evolvesTo: 555, level: 35 }, // Darumaka
  557: { evolvesTo: 558, level: 34 }, // Dwebble
  577: { evolvesTo: 578, level: 32 }, // Solosis line
  578: { evolvesTo: 579, level: 41 },

  // ── Region 3 (Celadon City) ───────────────────────────────────────────────────
  125: { evolvesTo: 466, level: 50 }, // Electabuzz → Electivire
  126: { evolvesTo: 467, level: 50 }, // Magmar → Magmortar
  374: { evolvesTo: 375, level: 20 }, // Beldum line
  375: { evolvesTo: 376, level: 45 },
  443: { evolvesTo: 444, level: 24 }, // Gible line
  444: { evolvesTo: 445, level: 48 },
  446: { evolvesTo: 143, level: 30 }, // Munchlax
  449: { evolvesTo: 450, level: 34 }, // Hippopotas
  451: { evolvesTo: 452, level: 40 }, // Skorupi
  453: { evolvesTo: 454, level: 37 }, // Croagunk
  456: { evolvesTo: 457, level: 31 }, // Finneon
  459: { evolvesTo: 460, level: 40 }, // Snover
  543: { evolvesTo: 544, level: 22 }, // Venipede line
  544: { evolvesTo: 545, level: 30 },
  551: { evolvesTo: 552, level: 29 }, // Sandile line
  552: { evolvesTo: 553, level: 40 },
  574: { evolvesTo: 575, level: 32 }, // Gothita line
  575: { evolvesTo: 576, level: 41 },
  580: { evolvesTo: 581, level: 35 }, // Ducklett
  582: { evolvesTo: 583, level: 35 }, // Vanillite line
  583: { evolvesTo: 584, level: 47 },
  585: { evolvesTo: 586, level: 34 }, // Deerling
  588: { evolvesTo: 589, level: 35 }, // Karrablast
  590: { evolvesTo: 591, level: 39 }, // Foongus
  592: { evolvesTo: 593, level: 40 }, // Frillish
  595: { evolvesTo: 596, level: 36 }, // Joltik
  597: { evolvesTo: 598, level: 40 }, // Ferroseed
  599: { evolvesTo: 600, level: 38 }, // Klink line
  600: { evolvesTo: 601, level: 49 },
  602: { evolvesTo: 603, level: 39 }, // Tynamo line
  603: { evolvesTo: 604, level: 50 },
  605: { evolvesTo: 606, level: 42 }, // Elgyem
  607: { evolvesTo: 608, level: 41 }, // Litwick line
  608: { evolvesTo: 609, level: 50 },
  610: { evolvesTo: 611, level: 38 }, // Axew line
  611: { evolvesTo: 612, level: 48 },
  613: { evolvesTo: 614, level: 37 }, // Cubchoo
  616: { evolvesTo: 617, level: 35 }, // Shelmet
  619: { evolvesTo: 620, level: 50 }, // Mienfoo
  622: { evolvesTo: 623, level: 43 }, // Golett
  624: { evolvesTo: 625, level: 52 }, // Pawniard
  625: { evolvesTo: 983, level: 64 }, // Bisharp → Kingambit
  627: { evolvesTo: 628, level: 54 }, // Rufflet
  629: { evolvesTo: 630, level: 54 }, // Vullaby
  633: { evolvesTo: 634, level: 50 }, // Deino line
  634: { evolvesTo: 635, level: 64 },
  636: { evolvesTo: 637, level: 59 }, // Larvesta → Volcarona
  661: { evolvesTo: 662, level: 17 }, // Fletchling line
  662: { evolvesTo: 663, level: 35 },
  667: { evolvesTo: 668, level: 35 }, // Litleo
  674: { evolvesTo: 675, level: 32 }, // Pancham
  677: { evolvesTo: 678, level: 25 }, // Espurr
  679: { evolvesTo: 680, level: 35 }, // Honedge line
  680: { evolvesTo: 681, level: 45 },
  690: { evolvesTo: 691, level: 48 }, // Skrelp
  692: { evolvesTo: 693, level: 37 }, // Clauncher
  696: { evolvesTo: 697, level: 39 }, // Tyrunt
  698: { evolvesTo: 699, level: 39 }, // Amaura
  704: { evolvesTo: 705, level: 40 }, // Goomy line
  705: { evolvesTo: 706, level: 50 },
  714: { evolvesTo: 715, level: 48 }, // Noibat

  // ── Region 4 (Victory Road) ──────────────────────────────────────────────────
  821: { evolvesTo: 822, level: 18 }, // Rookidee line
  822: { evolvesTo: 823, level: 38 },
  835: { evolvesTo: 836, level: 25 }, // Yamper
  843: { evolvesTo: 844, level: 36 }, // Silicobra
  848: { evolvesTo: 849, level: 30 }, // Toxel
  859: { evolvesTo: 860, level: 32 }, // Impidimp line
  860: { evolvesTo: 861, level: 42 },
  878: { evolvesTo: 879, level: 34 }, // Cufant
  885: { evolvesTo: 886, level: 50 }, // Dreepy line
  886: { evolvesTo: 887, level: 60 },
  921: { evolvesTo: 922, level: 18 }, // Pawmi line
  922: { evolvesTo: 923, level: 32 },
  932: { evolvesTo: 933, level: 24 }, // Nacli line
  933: { evolvesTo: 934, level: 38 },
  935: { evolvesTo: 936, level: 30 }, // Charcadet
  938: { evolvesTo: 939, level: 30 }, // Tadbulb
  942: { evolvesTo: 943, level: 30 }, // Maschiff
  957: { evolvesTo: 958, level: 24 }, // Tinkatink line
  958: { evolvesTo: 959, level: 38 },
  963: { evolvesTo: 964, level: 38 }, // Finizen
  965: { evolvesTo: 966, level: 40 }, // Varoom
  971: { evolvesTo: 972, level: 30 }, // Greavard
};

export function getEvolutionData(pokemonId: number): { evolvesTo: number; level: number } | null {
  return EVOLUTION_LEVELS[pokemonId] || MORE_EVOLUTIONS[pokemonId] || null;
}
