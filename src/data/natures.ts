export type NatureName =
  | 'hardy' | 'lonely' | 'brave' | 'adamant' | 'naughty'
  | 'bold' | 'docile' | 'relaxed' | 'impish' | 'lax'
  | 'timid' | 'hasty' | 'serious' | 'jolly' | 'naive'
  | 'modest' | 'mild' | 'quiet' | 'bashful' | 'rash'
  | 'calm' | 'gentle' | 'sassy' | 'careful' | 'quirky';

export type NatureStatKey = 'atk' | 'def' | 'spAtk' | 'spDef' | 'speed';

export interface Nature {
  label: string;
  increased: NatureStatKey | null;
  decreased: NatureStatKey | null;
}

export const NATURES: Record<NatureName, Nature> = {
  hardy:   { label: 'Hardy',   increased: null,     decreased: null },
  lonely:  { label: 'Lonely',  increased: 'atk',    decreased: 'def' },
  brave:   { label: 'Brave',   increased: 'atk',    decreased: 'speed' },
  adamant: { label: 'Adamant', increased: 'atk',    decreased: 'spAtk' },
  naughty: { label: 'Naughty', increased: 'atk',    decreased: 'spDef' },
  bold:    { label: 'Bold',    increased: 'def',    decreased: 'atk' },
  docile:  { label: 'Docile',  increased: null,     decreased: null },
  relaxed: { label: 'Relaxed', increased: 'def',    decreased: 'speed' },
  impish:  { label: 'Impish',  increased: 'def',    decreased: 'spAtk' },
  lax:     { label: 'Lax',     increased: 'def',    decreased: 'spDef' },
  timid:   { label: 'Timid',   increased: 'speed',  decreased: 'atk' },
  hasty:   { label: 'Hasty',   increased: 'speed',  decreased: 'def' },
  serious: { label: 'Serious', increased: null,     decreased: null },
  jolly:   { label: 'Jolly',   increased: 'speed',  decreased: 'spAtk' },
  naive:   { label: 'Naive',   increased: 'speed',  decreased: 'spDef' },
  modest:  { label: 'Modest',  increased: 'spAtk',  decreased: 'atk' },
  mild:    { label: 'Mild',    increased: 'spAtk',  decreased: 'def' },
  quiet:   { label: 'Quiet',   increased: 'spAtk',  decreased: 'speed' },
  bashful: { label: 'Bashful', increased: null,     decreased: null },
  rash:    { label: 'Rash',    increased: 'spAtk',  decreased: 'spDef' },
  calm:    { label: 'Calm',    increased: 'spDef',  decreased: 'atk' },
  gentle:  { label: 'Gentle',  increased: 'spDef',  decreased: 'def' },
  sassy:   { label: 'Sassy',   increased: 'spDef',  decreased: 'speed' },
  careful: { label: 'Careful', increased: 'spDef',  decreased: 'spAtk' },
  quirky:  { label: 'Quirky',  increased: null,     decreased: null },
};

const NATURE_NAMES = Object.keys(NATURES) as NatureName[];

export function getRandomNature(): NatureName {
  return NATURE_NAMES[Math.floor(Math.random() * NATURE_NAMES.length)];
}

export function getNatureModifier(nature: NatureName, stat: NatureStatKey): number {
  const n = NATURES[nature];
  if (n.increased === stat) return 1.1;
  if (n.decreased === stat) return 0.9;
  return 1.0;
}
