import type { MoveData, PokemonType } from '../types/pokemon';

export const MOVE_DATABASE: MoveData[] = [
  // Normal
  { id: 'tackle', name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, category: 'physical' },
  { id: 'body-slam', name: 'Body Slam', type: 'normal', power: 85, accuracy: 100, pp: 15, category: 'physical', effect: 'paralysis', effectChance: 30 },
  { id: 'hyper-beam', name: 'Hyper Beam', type: 'normal', power: 150, accuracy: 90, pp: 5, category: 'special' },
  { id: 'return', name: 'Return', type: 'normal', power: 102, accuracy: 100, pp: 20, category: 'physical' },
  { id: 'quick-attack', name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, pp: 30, category: 'physical', priority: 1 },
  { id: 'extreme-speed', name: 'ExtremeSpeed', type: 'normal', power: 80, accuracy: 100, pp: 5, category: 'physical', priority: 2 },
  { id: 'double-edge', name: 'Double-Edge', type: 'normal', power: 120, accuracy: 100, pp: 15, category: 'physical', recoil: 0.33 },
  { id: 'slash', name: 'Slash', type: 'normal', power: 70, accuracy: 100, pp: 20, category: 'physical' },
  { id: 'swift', name: 'Swift', type: 'normal', power: 60, accuracy: 100, pp: 20, category: 'special' },
  { id: 'fury-swipes', name: 'Fury Swipes', type: 'normal', power: 18, accuracy: 80, pp: 15, category: 'physical', multiHit: [2, 5] },
  { id: 'swords-dance', name: 'Swords Dance', type: 'normal', power: 0, accuracy: 100, pp: 20, category: 'status', selfStatChange: { atk: 2 } },
  { id: 'recover', name: 'Recover', type: 'normal', power: 0, accuracy: 100, pp: 10, category: 'status', heal: 0.5 },
  { id: 'soft-boiled', name: 'Soft-Boiled', type: 'normal', power: 0, accuracy: 100, pp: 10, category: 'status', heal: 0.5 },
  { id: 'slack-off', name: 'Slack Off', type: 'normal', power: 0, accuracy: 100, pp: 10, category: 'status', heal: 0.5 },
  { id: 'shell-smash', name: 'Shell Smash', type: 'normal', power: 0, accuracy: 100, pp: 15, category: 'status', selfStatChange: { atk: 2, spAtk: 2, speed: 2, def: -1, spDef: -1 } },

  // Fire
  { id: 'ember', name: 'Ember', type: 'fire', power: 40, accuracy: 100, pp: 25, category: 'special', effect: 'burn', effectChance: 10 },
  { id: 'flamethrower', name: 'Flamethrower', type: 'fire', power: 90, accuracy: 100, pp: 15, category: 'special', effect: 'burn', effectChance: 10 },
  { id: 'fire-blast', name: 'Fire Blast', type: 'fire', power: 110, accuracy: 85, pp: 5, category: 'special', effect: 'burn', effectChance: 10 },
  { id: 'fire-punch', name: 'Fire Punch', type: 'fire', power: 75, accuracy: 100, pp: 15, category: 'physical', effect: 'burn', effectChance: 10 },
  { id: 'blaze-kick', name: 'Blaze Kick', type: 'fire', power: 85, accuracy: 90, pp: 10, category: 'physical', effect: 'burn', effectChance: 10 },
  { id: 'flare-blitz', name: 'Flare Blitz', type: 'fire', power: 120, accuracy: 100, pp: 15, category: 'physical', effect: 'burn', effectChance: 10, recoil: 0.33 },
  { id: 'overheat', name: 'Overheat', type: 'fire', power: 130, accuracy: 90, pp: 5, category: 'special', selfStatChange: { spAtk: -2 } },
  { id: 'heat-wave', name: 'Heat Wave', type: 'fire', power: 95, accuracy: 90, pp: 10, category: 'special', effect: 'burn', effectChance: 10 },
  { id: 'v-create', name: 'V-create', type: 'fire', power: 180, accuracy: 95, pp: 5, category: 'physical', selfStatChange: { def: -1, spDef: -1, speed: -1 } },
  { id: 'sunny-day', name: 'Sunny Day', type: 'fire', power: 0, accuracy: 100, pp: 5, category: 'status', weather: 'sun' },

  // Water
  { id: 'water-gun', name: 'Water Gun', type: 'water', power: 40, accuracy: 100, pp: 25, category: 'special' },
  { id: 'surf', name: 'Surf', type: 'water', power: 90, accuracy: 100, pp: 15, category: 'special' },
  { id: 'hydro-pump', name: 'Hydro Pump', type: 'water', power: 110, accuracy: 80, pp: 5, category: 'special' },
  { id: 'waterfall', name: 'Waterfall', type: 'water', power: 80, accuracy: 100, pp: 15, category: 'physical' },
  { id: 'aqua-jet', name: 'Aqua Jet', type: 'water', power: 40, accuracy: 100, pp: 20, category: 'physical', priority: 1 },
  { id: 'scald', name: 'Scald', type: 'water', power: 80, accuracy: 100, pp: 15, category: 'special', effect: 'burn', effectChance: 30 },
  { id: 'liquidation', name: 'Liquidation', type: 'water', power: 85, accuracy: 100, pp: 10, category: 'physical' },
  { id: 'origin-pulse', name: 'Origin Pulse', type: 'water', power: 110, accuracy: 85, pp: 10, category: 'special' },
  { id: 'rain-dance', name: 'Rain Dance', type: 'water', power: 0, accuracy: 100, pp: 5, category: 'status', weather: 'rain' },

  // Electric
  { id: 'thunder-shock', name: 'Thunder Shock', type: 'electric', power: 40, accuracy: 100, pp: 30, category: 'special', effect: 'paralysis', effectChance: 10 },
  { id: 'thunderbolt', name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, pp: 15, category: 'special', effect: 'paralysis', effectChance: 10 },
  { id: 'thunder', name: 'Thunder', type: 'electric', power: 110, accuracy: 70, pp: 10, category: 'special', effect: 'paralysis', effectChance: 30 },
  { id: 'thunder-punch', name: 'Thunder Punch', type: 'electric', power: 75, accuracy: 100, pp: 15, category: 'physical', effect: 'paralysis', effectChance: 10 },
  { id: 'volt-tackle', name: 'Volt Tackle', type: 'electric', power: 120, accuracy: 100, pp: 15, category: 'physical', recoil: 0.33, effect: 'paralysis', effectChance: 10 },
  { id: 'wild-charge', name: 'Wild Charge', type: 'electric', power: 90, accuracy: 100, pp: 15, category: 'physical', recoil: 0.25 },
  { id: 'discharge', name: 'Discharge', type: 'electric', power: 80, accuracy: 100, pp: 15, category: 'special', effect: 'paralysis', effectChance: 30 },
  { id: 'bolt-strike', name: 'Bolt Strike', type: 'electric', power: 130, accuracy: 85, pp: 5, category: 'physical', effect: 'paralysis', effectChance: 20 },

  // Grass
  { id: 'vine-whip', name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100, pp: 25, category: 'physical' },
  { id: 'razor-leaf', name: 'Razor Leaf', type: 'grass', power: 55, accuracy: 95, pp: 25, category: 'physical' },
  { id: 'solar-beam', name: 'Solar Beam', type: 'grass', power: 120, accuracy: 100, pp: 10, category: 'special' },
  { id: 'energy-ball', name: 'Energy Ball', type: 'grass', power: 90, accuracy: 100, pp: 10, category: 'special' },
  { id: 'leaf-storm', name: 'Leaf Storm', type: 'grass', power: 130, accuracy: 90, pp: 5, category: 'special', selfStatChange: { spAtk: -2 } },
  { id: 'petal-dance', name: 'Petal Dance', type: 'grass', power: 120, accuracy: 100, pp: 10, category: 'special' },
  { id: 'power-whip', name: 'Power Whip', type: 'grass', power: 120, accuracy: 85, pp: 10, category: 'physical' },
  { id: 'wood-hammer', name: 'Wood Hammer', type: 'grass', power: 120, accuracy: 100, pp: 15, category: 'physical', recoil: 0.33 },
  { id: 'giga-drain', name: 'Giga Drain', type: 'grass', power: 75, accuracy: 100, pp: 10, category: 'special', drain: 0.5 },
  { id: 'bullet-seed', name: 'Bullet Seed', type: 'grass', power: 25, accuracy: 100, pp: 30, category: 'physical', multiHit: [2, 5] },
  { id: 'quiver-dance', name: 'Quiver Dance', type: 'bug', power: 0, accuracy: 100, pp: 20, category: 'status', selfStatChange: { spAtk: 1, spDef: 1, speed: 1 } },

  // Ice
  { id: 'powder-snow', name: 'Powder Snow', type: 'ice', power: 40, accuracy: 100, pp: 25, category: 'special', effect: 'freeze', effectChance: 10 },
  { id: 'ice-beam', name: 'Ice Beam', type: 'ice', power: 90, accuracy: 100, pp: 10, category: 'special', effect: 'freeze', effectChance: 10 },
  { id: 'blizzard', name: 'Blizzard', type: 'ice', power: 110, accuracy: 70, pp: 5, category: 'special', effect: 'freeze', effectChance: 10 },
  { id: 'ice-punch', name: 'Ice Punch', type: 'ice', power: 75, accuracy: 100, pp: 15, category: 'physical', effect: 'freeze', effectChance: 10 },
  { id: 'freeze-dry', name: 'Freeze-Dry', type: 'ice', power: 70, accuracy: 100, pp: 20, category: 'special' },
  { id: 'icicle-crash', name: 'Icicle Crash', type: 'ice', power: 85, accuracy: 90, pp: 10, category: 'physical' },
  { id: 'ice-shard', name: 'Ice Shard', type: 'ice', power: 40, accuracy: 100, pp: 30, category: 'physical', priority: 1 },
  { id: 'glaciate', name: 'Glaciate', type: 'ice', power: 65, accuracy: 95, pp: 10, category: 'special', opponentStatChange: { speed: -1 } },
  { id: 'hail', name: 'Hail', type: 'ice', power: 0, accuracy: 100, pp: 10, category: 'status', weather: 'hail' },

  // Fighting
  { id: 'karate-chop', name: 'Karate Chop', type: 'fighting', power: 50, accuracy: 100, pp: 25, category: 'physical' },
  { id: 'low-kick', name: 'Low Kick', type: 'fighting', power: 60, accuracy: 100, pp: 20, category: 'physical' },
  { id: 'close-combat', name: 'Close Combat', type: 'fighting', power: 120, accuracy: 100, pp: 5, category: 'physical', selfStatChange: { def: -1, spDef: -1 } },
  { id: 'aura-sphere', name: 'Aura Sphere', type: 'fighting', power: 80, accuracy: 100, pp: 20, category: 'special' },
  { id: 'focus-blast', name: 'Focus Blast', type: 'fighting', power: 120, accuracy: 70, pp: 5, category: 'special' },
  { id: 'dynamic-punch', name: 'Dynamic Punch', type: 'fighting', power: 100, accuracy: 50, pp: 5, category: 'physical' },
  { id: 'cross-chop', name: 'Cross Chop', type: 'fighting', power: 100, accuracy: 80, pp: 5, category: 'physical' },
  { id: 'superpower', name: 'Superpower', type: 'fighting', power: 120, accuracy: 100, pp: 5, category: 'physical', selfStatChange: { atk: -1, def: -1 } },
  { id: 'mach-punch', name: 'Mach Punch', type: 'fighting', power: 40, accuracy: 100, pp: 30, category: 'physical', priority: 1 },
  { id: 'vacuum-wave', name: 'Vacuum Wave', type: 'fighting', power: 40, accuracy: 100, pp: 30, category: 'special', priority: 1 },
  { id: 'bulk-up', name: 'Bulk Up', type: 'fighting', power: 0, accuracy: 100, pp: 20, category: 'status', selfStatChange: { atk: 1, def: 1 } },

  // Poison
  { id: 'poison-sting', name: 'Poison Sting', type: 'poison', power: 15, accuracy: 100, pp: 35, category: 'physical', effect: 'poison', effectChance: 30 },
  { id: 'sludge', name: 'Sludge', type: 'poison', power: 65, accuracy: 100, pp: 20, category: 'special', effect: 'poison', effectChance: 30 },
  { id: 'sludge-bomb', name: 'Sludge Bomb', type: 'poison', power: 90, accuracy: 100, pp: 10, category: 'special', effect: 'poison', effectChance: 30 },
  { id: 'poison-jab', name: 'Poison Jab', type: 'poison', power: 80, accuracy: 100, pp: 20, category: 'physical', effect: 'poison', effectChance: 30 },
  { id: 'gunk-shot', name: 'Gunk Shot', type: 'poison', power: 120, accuracy: 80, pp: 5, category: 'physical', effect: 'poison', effectChance: 30 },
  { id: 'cross-poison', name: 'Cross Poison', type: 'poison', power: 70, accuracy: 100, pp: 20, category: 'physical', effect: 'poison', effectChance: 10 },
  { id: 'sludge-wave', name: 'Sludge Wave', type: 'poison', power: 95, accuracy: 100, pp: 10, category: 'special', effect: 'poison', effectChance: 10 },
  { id: 'belch', name: 'Belch', type: 'poison', power: 120, accuracy: 90, pp: 10, category: 'special' },

  // Ground
  { id: 'sand-attack', name: 'Sand Attack', type: 'ground', power: 0, accuracy: 100, pp: 15, category: 'status', opponentStatChange: { speed: -1 } },
  { id: 'magnitude', name: 'Magnitude', type: 'ground', power: 70, accuracy: 100, pp: 30, category: 'physical' },
  { id: 'earthquake', name: 'Earthquake', type: 'ground', power: 100, accuracy: 100, pp: 10, category: 'physical' },
  { id: 'earth-power', name: 'Earth Power', type: 'ground', power: 90, accuracy: 100, pp: 10, category: 'special', opponentStatChange: { spDef: -1 }, effectChance: 10 },
  { id: 'dig', name: 'Dig', type: 'ground', power: 80, accuracy: 100, pp: 10, category: 'physical' },
  { id: 'high-horsepower', name: 'High Horsepower', type: 'ground', power: 95, accuracy: 95, pp: 10, category: 'physical' },
  { id: 'precipice-blades', name: 'Precipice Blades', type: 'ground', power: 120, accuracy: 85, pp: 10, category: 'physical' },
  { id: 'thousand-arrows', name: 'Thousand Arrows', type: 'ground', power: 90, accuracy: 100, pp: 10, category: 'physical' },
  { id: 'sandstorm', name: 'Sandstorm', type: 'rock', power: 0, accuracy: 100, pp: 10, category: 'status', weather: 'sandstorm' },

  // Flying
  { id: 'gust', name: 'Gust', type: 'flying', power: 40, accuracy: 100, pp: 35, category: 'special' },
  { id: 'wing-attack', name: 'Wing Attack', type: 'flying', power: 60, accuracy: 100, pp: 35, category: 'physical' },
  { id: 'aerial-ace', name: 'Aerial Ace', type: 'flying', power: 60, accuracy: 100, pp: 20, category: 'physical' },
  { id: 'air-slash', name: 'Air Slash', type: 'flying', power: 75, accuracy: 95, pp: 15, category: 'special' },
  { id: 'brave-bird', name: 'Brave Bird', type: 'flying', power: 120, accuracy: 100, pp: 15, category: 'physical', recoil: 0.33 },
  { id: 'hurricane', name: 'Hurricane', type: 'flying', power: 110, accuracy: 70, pp: 10, category: 'special' },
  { id: 'sky-attack', name: 'Sky Attack', type: 'flying', power: 140, accuracy: 90, pp: 5, category: 'physical' },
  { id: 'oblivion-wing', name: 'Oblivion Wing', type: 'flying', power: 80, accuracy: 100, pp: 10, category: 'special', drain: 0.75 },
  { id: 'roost', name: 'Roost', type: 'flying', power: 0, accuracy: 100, pp: 10, category: 'status', heal: 0.5 },

  // Psychic
  { id: 'confusion', name: 'Confusion', type: 'psychic', power: 50, accuracy: 100, pp: 25, category: 'special' },
  { id: 'psybeam', name: 'Psybeam', type: 'psychic', power: 65, accuracy: 100, pp: 20, category: 'special' },
  { id: 'psychic', name: 'Psychic', type: 'psychic', power: 90, accuracy: 100, pp: 10, category: 'special', opponentStatChange: { spDef: -1 }, effectChance: 10 },
  { id: 'zen-headbutt', name: 'Zen Headbutt', type: 'psychic', power: 80, accuracy: 90, pp: 15, category: 'physical' },
  { id: 'psycho-cut', name: 'Psycho Cut', type: 'psychic', power: 70, accuracy: 100, pp: 20, category: 'physical' },
  { id: 'psystrike', name: 'Psystrike', type: 'psychic', power: 100, accuracy: 100, pp: 10, category: 'special' },
  { id: 'future-sight', name: 'Future Sight', type: 'psychic', power: 120, accuracy: 100, pp: 10, category: 'special' },
  { id: 'agility', name: 'Agility', type: 'psychic', power: 0, accuracy: 100, pp: 30, category: 'status', selfStatChange: { speed: 2 } },
  { id: 'calm-mind', name: 'Calm Mind', type: 'psychic', power: 0, accuracy: 100, pp: 20, category: 'status', selfStatChange: { spAtk: 1, spDef: 1 } },
  { id: 'nasty-plot', name: 'Nasty Plot', type: 'dark', power: 0, accuracy: 100, pp: 20, category: 'status', selfStatChange: { spAtk: 2 } },

  // Bug
  { id: 'bug-bite', name: 'Bug Bite', type: 'bug', power: 60, accuracy: 100, pp: 20, category: 'physical' },
  { id: 'signal-beam', name: 'Signal Beam', type: 'bug', power: 75, accuracy: 100, pp: 15, category: 'special' },
  { id: 'x-scissor', name: 'X-Scissor', type: 'bug', power: 80, accuracy: 100, pp: 15, category: 'physical' },
  { id: 'bug-buzz', name: 'Bug Buzz', type: 'bug', power: 90, accuracy: 100, pp: 10, category: 'special', opponentStatChange: { spDef: -1 }, effectChance: 10 },
  { id: 'megahorn', name: 'Megahorn', type: 'bug', power: 120, accuracy: 85, pp: 10, category: 'physical' },
  { id: 'leech-life', name: 'Leech Life', type: 'bug', power: 80, accuracy: 100, pp: 10, category: 'physical', drain: 0.5 },
  { id: 'first-impression', name: 'First Impression', type: 'bug', power: 90, accuracy: 100, pp: 10, category: 'physical', priority: 1 },
  { id: 'pin-missile', name: 'Pin Missile', type: 'bug', power: 25, accuracy: 95, pp: 20, category: 'physical', multiHit: [2, 5] },
  { id: 'pollen-puff', name: 'Pollen Puff', type: 'bug', power: 90, accuracy: 100, pp: 15, category: 'special' },

  // Rock
  { id: 'rock-throw', name: 'Rock Throw', type: 'rock', power: 50, accuracy: 90, pp: 15, category: 'physical' },
  { id: 'rock-slide', name: 'Rock Slide', type: 'rock', power: 75, accuracy: 90, pp: 10, category: 'physical' },
  { id: 'rock-blast', name: 'Rock Blast', type: 'rock', power: 25, accuracy: 90, pp: 10, category: 'physical', multiHit: [2, 5] },
  { id: 'stone-edge', name: 'Stone Edge', type: 'rock', power: 100, accuracy: 80, pp: 5, category: 'physical' },
  { id: 'power-gem', name: 'Power Gem', type: 'rock', power: 80, accuracy: 100, pp: 20, category: 'special' },
  { id: 'head-smash', name: 'Head Smash', type: 'rock', power: 150, accuracy: 80, pp: 5, category: 'physical', recoil: 0.5 },
  { id: 'diamond-storm', name: 'Diamond Storm', type: 'rock', power: 100, accuracy: 95, pp: 5, category: 'physical', selfStatChange: { def: 2 }, effectChance: 50 },
  { id: 'rock-wrecker', name: 'Rock Wrecker', type: 'rock', power: 150, accuracy: 90, pp: 5, category: 'physical' },

  // Ghost
  { id: 'lick', name: 'Lick', type: 'ghost', power: 30, accuracy: 100, pp: 30, category: 'physical', effect: 'paralysis', effectChance: 30 },
  { id: 'shadow-sneak', name: 'Shadow Sneak', type: 'ghost', power: 40, accuracy: 100, pp: 30, category: 'physical', priority: 1 },
  { id: 'shadow-ball', name: 'Shadow Ball', type: 'ghost', power: 80, accuracy: 100, pp: 15, category: 'special', opponentStatChange: { spDef: -1 }, effectChance: 20 },
  { id: 'shadow-claw', name: 'Shadow Claw', type: 'ghost', power: 70, accuracy: 100, pp: 15, category: 'physical' },
  { id: 'phantom-force', name: 'Phantom Force', type: 'ghost', power: 90, accuracy: 100, pp: 10, category: 'physical' },
  { id: 'shadow-force', name: 'Shadow Force', type: 'ghost', power: 120, accuracy: 100, pp: 5, category: 'physical' },
  { id: 'hex', name: 'Hex', type: 'ghost', power: 65, accuracy: 100, pp: 10, category: 'special' },
  { id: 'spectral-thief', name: 'Spectral Thief', type: 'ghost', power: 90, accuracy: 100, pp: 10, category: 'physical' },

  // Dragon
  { id: 'dragon-rage', name: 'Dragon Rage', type: 'dragon', power: 40, accuracy: 100, pp: 10, category: 'special' },
  { id: 'dragon-breath', name: 'Dragon Breath', type: 'dragon', power: 60, accuracy: 100, pp: 20, category: 'special', effect: 'paralysis', effectChance: 30 },
  { id: 'dragon-claw', name: 'Dragon Claw', type: 'dragon', power: 80, accuracy: 100, pp: 15, category: 'physical' },
  { id: 'dragon-pulse', name: 'Dragon Pulse', type: 'dragon', power: 85, accuracy: 100, pp: 10, category: 'special' },
  { id: 'outrage', name: 'Outrage', type: 'dragon', power: 120, accuracy: 100, pp: 10, category: 'physical' },
  { id: 'draco-meteor', name: 'Draco Meteor', type: 'dragon', power: 130, accuracy: 90, pp: 5, category: 'special', selfStatChange: { spAtk: -2 } },
  { id: 'dragon-rush', name: 'Dragon Rush', type: 'dragon', power: 100, accuracy: 75, pp: 10, category: 'physical' },
  { id: 'roar-of-time', name: 'Roar of Time', type: 'dragon', power: 150, accuracy: 90, pp: 5, category: 'special' },
  { id: 'dragon-dance', name: 'Dragon Dance', type: 'dragon', power: 0, accuracy: 100, pp: 20, category: 'status', selfStatChange: { atk: 1, speed: 1 } },

  // Dark
  { id: 'bite', name: 'Bite', type: 'dark', power: 60, accuracy: 100, pp: 25, category: 'physical' },
  { id: 'crunch', name: 'Crunch', type: 'dark', power: 80, accuracy: 100, pp: 15, category: 'physical', opponentStatChange: { def: -1 }, effectChance: 20 },
  { id: 'dark-pulse', name: 'Dark Pulse', type: 'dark', power: 80, accuracy: 100, pp: 15, category: 'special' },
  { id: 'night-slash', name: 'Night Slash', type: 'dark', power: 70, accuracy: 100, pp: 15, category: 'physical' },
  { id: 'foul-play', name: 'Foul Play', type: 'dark', power: 95, accuracy: 100, pp: 15, category: 'physical' },
  { id: 'knock-off', name: 'Knock Off', type: 'dark', power: 65, accuracy: 100, pp: 20, category: 'physical' },
  { id: 'sucker-punch', name: 'Sucker Punch', type: 'dark', power: 70, accuracy: 100, pp: 5, category: 'physical', priority: 1 },
  { id: 'dark-void', name: 'Dark Void', type: 'dark', power: 0, accuracy: 80, pp: 10, category: 'status', effect: 'sleep', effectChance: 100 },

  // Steel
  { id: 'metal-claw', name: 'Metal Claw', type: 'steel', power: 50, accuracy: 95, pp: 35, category: 'physical', selfStatChange: { atk: 1 }, effectChance: 10 },
  { id: 'iron-tail', name: 'Iron Tail', type: 'steel', power: 100, accuracy: 75, pp: 15, category: 'physical', opponentStatChange: { def: -1 }, effectChance: 30 },
  { id: 'iron-head', name: 'Iron Head', type: 'steel', power: 80, accuracy: 100, pp: 15, category: 'physical' },
  { id: 'flash-cannon', name: 'Flash Cannon', type: 'steel', power: 80, accuracy: 100, pp: 10, category: 'special', opponentStatChange: { spDef: -1 }, effectChance: 10 },
  { id: 'gyro-ball', name: 'Gyro Ball', type: 'steel', power: 60, accuracy: 100, pp: 5, category: 'physical' },
  { id: 'meteor-mash', name: 'Meteor Mash', type: 'steel', power: 90, accuracy: 90, pp: 10, category: 'physical', selfStatChange: { atk: 1 }, effectChance: 20 },
  { id: 'steel-beam', name: 'Steel Beam', type: 'steel', power: 140, accuracy: 95, pp: 5, category: 'special', recoil: 0.5 },
  { id: 'sunsteel-strike', name: 'Sunsteel Strike', type: 'steel', power: 100, accuracy: 100, pp: 5, category: 'physical' },
  { id: 'iron-defense', name: 'Iron Defense', type: 'steel', power: 0, accuracy: 100, pp: 15, category: 'status', selfStatChange: { def: 2 } },

  // Fairy
  { id: 'fairy-wind', name: 'Fairy Wind', type: 'fairy', power: 40, accuracy: 100, pp: 30, category: 'special' },
  { id: 'moonblast', name: 'Moonblast', type: 'fairy', power: 95, accuracy: 100, pp: 15, category: 'special', opponentStatChange: { spAtk: -1 }, effectChance: 30 },
  { id: 'play-rough', name: 'Play Rough', type: 'fairy', power: 90, accuracy: 90, pp: 10, category: 'physical', opponentStatChange: { atk: -1 }, effectChance: 10 },
  { id: 'dazzling-gleam', name: 'Dazzling Gleam', type: 'fairy', power: 80, accuracy: 100, pp: 10, category: 'special' },
  { id: 'spirit-break', name: 'Spirit Break', type: 'fairy', power: 75, accuracy: 100, pp: 15, category: 'physical', opponentStatChange: { spAtk: -1 } },
  { id: 'sparkling-aria', name: 'Sparkling Aria', type: 'fairy', power: 90, accuracy: 100, pp: 10, category: 'special' },
  { id: 'draining-kiss', name: 'Draining Kiss', type: 'fairy', power: 50, accuracy: 100, pp: 10, category: 'special', drain: 0.75 },
  { id: 'fleur-cannon', name: 'Fleur Cannon', type: 'fairy', power: 130, accuracy: 90, pp: 5, category: 'special', selfStatChange: { spAtk: -2 } },
  { id: 'moonlight', name: 'Moonlight', type: 'fairy', power: 0, accuracy: 100, pp: 5, category: 'status', heal: 0.5 },
];

const MOVE_MAP: Record<string, MoveData> = {};
for (const move of MOVE_DATABASE) {
  MOVE_MAP[move.id] = move;
}

export function getMoveById(id: string): MoveData | undefined {
  return MOVE_MAP[id];
}

export function getMovesForTypes(types: string[], count = 4): MoveData[] {
  const typeSet = new Set(types);
  const typeMatches = MOVE_DATABASE.filter(m => typeSet.has(m.type) && m.power > 0);
  const others = MOVE_DATABASE.filter(m => !typeSet.has(m.type) && m.power > 0);

  typeMatches.sort((a, b) => b.power - a.power);
  others.sort((a, b) => b.power - a.power);

  const selected: MoveData[] = [];
  const typeCount = Math.min(Math.ceil(count * 0.75), typeMatches.length);
  for (let i = 0; i < typeCount; i++) {
    selected.push(typeMatches[i]);
  }
  for (let i = 0; selected.length < count && i < others.length; i++) {
    selected.push(others[i]);
  }
  return selected.slice(0, count);
}

const SETUP_MOVES = ['swords-dance', 'dragon-dance', 'nasty-plot', 'agility', 'calm-mind', 'quiver-dance', 'shell-smash', 'bulk-up', 'iron-defense'];
const HEAL_MOVES = ['recover', 'roost', 'soft-boiled', 'slack-off', 'moonlight'];

export function getMovesForLevel(types: string[], level: number): MoveData[] {
  const typeSet = new Set(types);
  const damageMoveLvl = level < 15 ? 80 : level < 30 ? 110 : 999;

  const available = MOVE_DATABASE.filter(m => {
    if (m.category === 'status') return false;
    if (m.power > damageMoveLvl) return false;
    return true;
  });

  const typeMatches = available.filter(m => typeSet.has(m.type));
  const others = available.filter(m => !typeSet.has(m.type));

  typeMatches.sort(() => Math.random() - 0.5);
  others.sort(() => Math.random() - 0.5);

  const selected: MoveData[] = [];
  const typeCount = Math.min(2, typeMatches.length);
  for (let i = 0; i < typeCount; i++) {
    selected.push(typeMatches[i]);
  }
  for (let i = 0; selected.length < 4 && i < others.length; i++) {
    selected.push(others[i]);
  }

  // At level 10+, add a setup or healing move (30% chance)
  if (level >= 10 && selected.length >= 3 && Math.random() < 0.3) {
    // Find a matching-type setup move
    const matchingSetup = MOVE_DATABASE.filter(
      m => SETUP_MOVES.includes(m.id) && typeSet.has(m.type)
    );
    const matchingHeal = MOVE_DATABASE.filter(
      m => HEAL_MOVES.includes(m.id) && typeSet.has(m.type)
    );
    const extras = [...matchingSetup, ...matchingHeal];
    if (extras.length > 0) {
      const pick = extras[Math.floor(Math.random() * extras.length)];
      selected[3] = pick;
    }
  }

  return selected.slice(0, 4);
}
