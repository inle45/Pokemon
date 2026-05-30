import type { Pokemon } from '../types/pokemon';

export function getHPColor(current: number, max: number): string {
  const pct = current / max;
  if (pct > 0.5) return '#4ade80'; // green
  if (pct > 0.25) return '#fbbf24'; // yellow
  return '#f87171'; // red
}

export function getHPClass(current: number, max: number): string {
  const pct = current / max;
  if (pct > 0.5) return 'bg-green-400';
  if (pct > 0.25) return 'bg-yellow-400';
  return 'bg-red-400';
}

export function formatStatName(stat: string): string {
  const names: Record<string, string> = {
    hp: 'HP',
    atk: 'Atk',
    def: 'Def',
    spAtk: 'Sp.Atk',
    spDef: 'Sp.Def',
    speed: 'Speed',
  };
  return names[stat] || stat;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    burn: '#f97316',
    poison: '#a855f7',
    paralysis: '#eab308',
    sleep: '#6b7280',
    freeze: '#93c5fd',
  };
  return colors[status] || '#ffffff';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    burn: 'BRN',
    poison: 'PSN',
    paralysis: 'PAR',
    sleep: 'SLP',
    freeze: 'FRZ',
  };
  return labels[status] || status.toUpperCase();
}

export function calcXPGain(enemy: Pokemon): number {
  const baseXP = Object.values(enemy.baseStats).reduce((a, b) => a + b, 0);
  return Math.floor((baseXP * enemy.level * 7) / 10);
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function getRandomTrainerName(): string {
  const names = [
    'Ace Trainer Alex', 'Youngster Joey', 'Lass Sarah', 'Hiker Tom',
    'Swimmer Dana', 'Bug Catcher Pete', 'Rocket Grunt', 'Beauty Emma',
    'Rich Boy Winston', 'Cooltrainer River', 'Veteran Blake', 'Biker Tyson',
    'Scientist Rob', 'Picnicker Amy', 'Camper Kyle', 'Officer Jenny',
    'Psychic Nolan', 'Hexmaniac Hex', 'Ruin Maniac Brad', 'Dragon Tamer Perry',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export function getRandomEventMessage(): string {
  const events = [
    'You found a mysterious potion on the ground!',
    'A passing trainer gave you some advice — team morale up!',
    'You stumbled into a pitfall! Lost some coins...',
    'A wild Pokémon dropped its held item!',
    'The weather looks stormy ahead...',
    'You found a hidden cache of supplies!',
    'You encountered a shiny Pokémon! It fled before you could catch it...',
    'A friendly rival gave you a tip after the battle!',
  ];
  return events[Math.floor(Math.random() * events.length)];
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
