import type { Pokemon, MoveData, StatusEffect, WeatherEffect, StatKey } from '../types/pokemon';
import type { BattleEvent, BattleResult } from '../types/battle';
import { getTypeEffectiveness } from '../data/typeChart';
import { getEffectiveStat } from '../services/pokeapi';

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function clampStage(stage: number): number {
  return Math.max(-6, Math.min(6, stage));
}

function stageKey(stat: StatKey): 'atkStage' | 'defStage' | 'spAtkStage' | 'spDefStage' | 'speedStage' {
  const map: Record<StatKey, 'atkStage' | 'defStage' | 'spAtkStage' | 'spDefStage' | 'speedStage'> = {
    atk: 'atkStage', def: 'defStage', spAtk: 'spAtkStage', spDef: 'spDefStage', speed: 'speedStage',
  };
  return map[stat];
}

function isUnboosted(pokemon: Pokemon): boolean {
  return pokemon.atkStage === 0 && pokemon.spAtkStage === 0 && pokemon.speedStage === 0 &&
    pokemon.defStage === 0 && pokemon.spDefStage === 0;
}

function pickMultiHitCount(min: number, max: number): number {
  if (min === 2 && max === 5) {
    // Gen 5+: 2,2,3,3,4,5 distribution
    const r = Math.random();
    if (r < 1/3) return 2;
    if (r < 2/3) return 3;
    if (r < 5/6) return 4;
    return 5;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

function calcDamage(
  attacker: Pokemon,
  defender: Pokemon,
  move: MoveData,
  weather: WeatherEffect,
  isCritical: boolean,
): { damage: number; effectiveness: number } {
  if (move.power === 0 || move.category === 'status') {
    return { damage: 0, effectiveness: 1 };
  }

  const critMultiplier = isCritical ? 1.5 : 1;

  const atkStat = move.category === 'physical'
    ? getEffectiveStat(attacker, 'atk')
    : getEffectiveStat(attacker, 'spAtk');
  const defStat = move.category === 'physical'
    ? getEffectiveStat(defender, 'def')
    : getEffectiveStat(defender, 'spDef');

  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  const effectiveness = getTypeEffectiveness(move.type, defender.types);

  // Weather modifier
  let weatherMod = 1;
  if (weather === 'rain') {
    if (move.type === 'water') weatherMod = 1.5;
    else if (move.type === 'fire') weatherMod = 0.5;
  } else if (weather === 'sun') {
    if (move.type === 'fire') weatherMod = 1.5;
    else if (move.type === 'water') weatherMod = 0.5;
  }

  const lifeOrb = attacker.heldItem === 'life-orb' ? 1.3 : 1;
  const expertBelt = (attacker.heldItem === 'expert-belt' && effectiveness > 1) ? 1.2 : 1;

  // Ability damage modifiers (attacker)
  const hpRatioAtk = attacker.currentHP / attacker.maxHP;
  let abilityAtkMod = 1;
  if (hpRatioAtk < 1 / 3) {
    if (attacker.abilityName === 'blaze' && move.type === 'fire') abilityAtkMod = 1.5;
    else if (attacker.abilityName === 'torrent' && move.type === 'water') abilityAtkMod = 1.5;
    else if (attacker.abilityName === 'overgrow' && move.type === 'grass') abilityAtkMod = 1.5;
    else if (attacker.abilityName === 'swarm' && move.type === 'bug') abilityAtkMod = 1.5;
  }
  if (attacker.abilityName === 'technician' && move.power > 0 && move.power <= 60) abilityAtkMod *= 1.5;
  if (attacker.abilityName === 'adaptability' && attacker.types.includes(move.type)) abilityAtkMod *= 4 / 3; // STAB 2.0 instead of 1.5
  const stabMod = (attacker.abilityName === 'adaptability' && attacker.types.includes(move.type)) ? 2.0 : stab;

  // Ability damage modifiers (defender)
  let abilityDefMod = 1;
  if (defender.abilityName === 'thick-fat' && (move.type === 'fire' || move.type === 'ice')) abilityDefMod = 0.5;
  if (defender.abilityName === 'water-absorb' && move.type === 'water') return { damage: 0, effectiveness: 0 };
  if (defender.abilityName === 'volt-absorb' && move.type === 'electric') return { damage: 0, effectiveness: 0 };
  if (defender.abilityName === 'flash-fire' && move.type === 'fire') return { damage: 0, effectiveness: 0 };
  if (defender.abilityName === 'levitate' && move.type === 'ground') return { damage: 0, effectiveness: 0 };
  if (defender.abilityName === 'sap-sipper' && move.type === 'grass') return { damage: 0, effectiveness: 0 };
  if ((defender.abilityName === 'lightning-rod' || defender.abilityName === 'motor-drive') && move.type === 'electric') return { damage: 0, effectiveness: 0 };
  if (defender.abilityName === 'storm-drain' && move.type === 'water') return { damage: 0, effectiveness: 0 };

  const baseDamage = Math.floor(
    (((2 * attacker.level / 5 + 2) * move.power * atkStat / defStat) / 50 + 2)
    * stabMod * effectiveness * critMultiplier * weatherMod * lifeOrb * expertBelt * abilityAtkMod * abilityDefMod
  );

  const randomFactor = (Math.floor(Math.random() * 16) + 85) / 100;
  const damage = Math.max(1, Math.floor(baseDamage * randomFactor));

  return { damage, effectiveness };
}

function getBestMove(attacker: Pokemon, defender: Pokemon, weather: WeatherEffect): MoveData {
  const hpRatio = attacker.currentHP / attacker.maxHP;

  // Healing move when low HP
  if (hpRatio < 0.3 && attacker.currentHP < attacker.maxHP) {
    const healMove = attacker.moves.find(m => m.heal && m.category === 'status');
    if (healMove) return healMove;
  }

  // Setup move when healthy and unboosted (60% chance to use)
  if (hpRatio > 0.6 && isUnboosted(attacker)) {
    const setupMove = attacker.moves.find(m => m.selfStatChange && m.category === 'status' && !m.heal);
    if (setupMove && Math.random() < 0.6) return setupMove;
  }

  // Best damage move
  let bestMove = attacker.moves[0];
  let bestScore = -1;

  for (const move of attacker.moves) {
    if (move.power === 0 || move.category === 'status') continue;

    const atkStat = move.category === 'physical'
      ? getEffectiveStat(attacker, 'atk')
      : getEffectiveStat(attacker, 'spAtk');

    const effectiveness = getTypeEffectiveness(move.type, defender.types);
    const stab = attacker.types.includes(move.type) ? 1.5 : 1;
    let weatherMod = 1;
    if (weather === 'rain' && move.type === 'water') weatherMod = 1.5;
    else if (weather === 'rain' && move.type === 'fire') weatherMod = 0.5;
    else if (weather === 'sun' && move.type === 'fire') weatherMod = 1.5;
    else if (weather === 'sun' && move.type === 'water') weatherMod = 0.5;

    const expectedHits = move.multiHit ? (move.multiHit[0] + move.multiHit[1]) / 2 : 1;
    const score = move.power * expectedHits * atkStat * effectiveness * stab * weatherMod;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function applyStatChanges(
  target: Pokemon,
  targetSide: 'player' | 'enemy',
  targetIdx: number,
  changes: Partial<Record<StatKey, number>>,
  sourceName: string,
  events: BattleEvent[],
  playerHP: number[],
  enemyHP: number[],
) {
  for (const [stat, delta] of Object.entries(changes) as [StatKey, number][]) {
    const key = stageKey(stat);
    const before = target[key];
    target[key] = clampStage(before + delta);
    const change = target[key] - before;
    if (change === 0) continue;

    const statNames: Record<StatKey, string> = {
      atk: 'Attack', def: 'Defense', spAtk: 'Sp. Atk', spDef: 'Sp. Def', speed: 'Speed',
    };
    const dirWord = change > 0 ? (Math.abs(change) >= 2 ? 'sharply rose' : 'rose') : (Math.abs(change) >= 2 ? 'harshly fell' : 'fell');

    events.push({
      type: 'stat_change',
      message: `${target.displayName}'s ${statNames[stat]} ${dirWord}!`,
      attackerSide: targetSide,
      attackerIndex: targetIdx,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
  }
}

function applyStatusEffect(
  target: Pokemon,
  targetSide: 'player' | 'enemy',
  targetIdx: number,
  effect: string,
  events: BattleEvent[],
  playerHP: number[],
  enemyHP: number[],
) {
  if (target.status !== null) return;

  const statusMap: Record<string, StatusEffect> = {
    burn: 'burn', poison: 'poison', paralysis: 'paralysis', sleep: 'sleep', freeze: 'freeze',
  };
  const status = statusMap[effect];
  if (!status) return;

  // Type immunities
  if (status === 'burn' && target.types.includes('fire')) return;
  if (status === 'freeze' && target.types.includes('ice')) return;
  if (status === 'poison' && (target.types.includes('poison') || target.types.includes('steel'))) return;
  if (status === 'paralysis' && target.types.includes('electric')) return;

  if (target.heldItem === 'lum-berry') {
    target.heldItem = null;
    events.push({
      type: 'held_item',
      message: `${target.displayName}'s Lum Berry cured the status!`,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
    return;
  }

  target.status = status;
  if (status === 'sleep') {
    target.statusTurns = Math.floor(Math.random() * 3) + 1;
  }

  const labels: Record<string, string> = {
    burn: 'burned', poison: 'poisoned', paralysis: 'paralyzed', sleep: 'put to sleep', freeze: 'frozen solid',
  };
  events.push({
    type: 'status_apply',
    message: `${target.displayName} was ${labels[effect]}!`,
    attackerSide: targetSide,
    attackerIndex: targetIdx,
    statusEffect: status,
    playerTeamHP: [...playerHP],
    enemyTeamHP: [...enemyHP],
  });
}

function recordFaint(
  pokemon: Pokemon,
  side: 'player' | 'enemy',
  index: number,
  events: BattleEvent[],
  playerHP: number[],
  enemyHP: number[],
) {
  pokemon.currentHP = 0;
  if (side === 'player') playerHP[index] = 0;
  else enemyHP[index] = 0;

  events.push({
    type: 'faint',
    message: `${pokemon.displayName} fainted!`,
    attackerSide: side,
    attackerIndex: index,
    playerTeamHP: [...playerHP],
    enemyTeamHP: [...enemyHP],
    activePlayerIndex: side === 'player' ? index : undefined,
    activeEnemyIndex: side === 'enemy' ? index : undefined,
  });
}

function processTurnEndStatus(
  pokemon: Pokemon,
  side: 'player' | 'enemy',
  index: number,
  weather: WeatherEffect,
  events: BattleEvent[],
  playerHP: number[],
  enemyHP: number[],
): boolean {
  // Sitrus Berry: heal 25% HP when below 50%
  if (pokemon.heldItem === 'sitrus-berry' && pokemon.currentHP <= pokemon.maxHP / 2) {
    pokemon.heldItem = null; // consumed
    const heal = Math.max(1, Math.floor(pokemon.maxHP / 4));
    pokemon.currentHP = Math.min(pokemon.maxHP, pokemon.currentHP + heal);
    if (side === 'player') playerHP[index] = pokemon.currentHP;
    else enemyHP[index] = pokemon.currentHP;
    events.push({
      type: 'heal',
      message: `${pokemon.displayName} ate its Sitrus Berry and restored ${heal} HP!`,
      attackerSide: side,
      attackerIndex: index,
      heal,
      newHP: pokemon.currentHP,
      maxHP: pokemon.maxHP,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
  }

  // Leftovers healing (even without status)
  if (pokemon.heldItem === 'leftovers') {
    const heal = Math.max(1, Math.floor(pokemon.maxHP / 16));
    pokemon.currentHP = Math.min(pokemon.maxHP, pokemon.currentHP + heal);
    if (side === 'player') playerHP[index] = pokemon.currentHP;
    else enemyHP[index] = pokemon.currentHP;
    events.push({
      type: 'held_item',
      message: `${pokemon.displayName} restored HP via Leftovers!`,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
  }

  // Weather damage
  if (weather === 'sandstorm') {
    const immune = pokemon.types.some(t => ['rock', 'steel', 'ground'].includes(t));
    if (!immune) {
      const dmg = Math.max(1, Math.floor(pokemon.maxHP / 16));
      pokemon.currentHP = Math.max(0, pokemon.currentHP - dmg);
      if (side === 'player') playerHP[index] = pokemon.currentHP;
      else enemyHP[index] = pokemon.currentHP;
      events.push({
        type: 'weather',
        message: `${pokemon.displayName} is buffeted by the sandstorm! (-${dmg} HP)`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
      if (pokemon.currentHP <= 0) return true;
    }
  } else if (weather === 'hail') {
    const immune = pokemon.types.includes('ice');
    if (!immune) {
      const dmg = Math.max(1, Math.floor(pokemon.maxHP / 16));
      pokemon.currentHP = Math.max(0, pokemon.currentHP - dmg);
      if (side === 'player') playerHP[index] = pokemon.currentHP;
      else enemyHP[index] = pokemon.currentHP;
      events.push({
        type: 'weather',
        message: `${pokemon.displayName} is pelted by hail! (-${dmg} HP)`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
      if (pokemon.currentHP <= 0) return true;
    }
  }

  if (!pokemon.status) return false;

  if (pokemon.status === 'burn') {
    const damage = Math.max(1, Math.floor(pokemon.maxHP / 16));
    pokemon.currentHP = Math.max(0, pokemon.currentHP - damage);
    if (side === 'player') playerHP[index] = pokemon.currentHP;
    else enemyHP[index] = pokemon.currentHP;
    events.push({
      type: 'status_damage',
      message: `${pokemon.displayName} is hurt by its burn! (-${damage} HP)`,
      attackerSide: side,
      attackerIndex: index,
      damage,
      newHP: pokemon.currentHP,
      maxHP: pokemon.maxHP,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
    return pokemon.currentHP <= 0;
  }

  if (pokemon.status === 'poison') {
    const damage = Math.max(1, Math.floor(pokemon.maxHP / 8));
    pokemon.currentHP = Math.max(0, pokemon.currentHP - damage);
    if (side === 'player') playerHP[index] = pokemon.currentHP;
    else enemyHP[index] = pokemon.currentHP;
    events.push({
      type: 'status_damage',
      message: `${pokemon.displayName} is hurt by poison! (-${damage} HP)`,
      attackerSide: side,
      attackerIndex: index,
      damage,
      newHP: pokemon.currentHP,
      maxHP: pokemon.maxHP,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
    return pokemon.currentHP <= 0;
  }

  if (pokemon.status === 'freeze') {
    if (Math.random() < 0.2) {
      pokemon.status = null;
      events.push({
        type: 'status_cure',
        message: `${pokemon.displayName} thawed out!`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    }
  }

  return false;
}

export function simulateBattle(
  rawPlayerTeam: Pokemon[],
  rawEnemyTeam: Pokemon[],
): BattleResult {
  const playerTeam: Pokemon[] = deepClone(rawPlayerTeam);
  const enemyTeam: Pokemon[] = deepClone(rawEnemyTeam);
  const events: BattleEvent[] = [];

  const playerHP = playerTeam.map(p => p.currentHP);
  const enemyHP = enemyTeam.map(p => p.currentHP);

  let weather: WeatherEffect = null;
  let weatherTurns = 0;

  let playerIndex = 0;
  let enemyIndex = 0;
  let turns = 0;
  const MAX_TURNS = 120;

  while (playerIndex < playerTeam.length && playerTeam[playerIndex].currentHP <= 0) playerIndex++;
  while (enemyIndex < enemyTeam.length && enemyTeam[enemyIndex].currentHP <= 0) enemyIndex++;

  events.push({
    type: 'switch_in',
    message: `${playerTeam[playerIndex]?.displayName ?? 'Unknown'} vs ${enemyTeam[enemyIndex]?.displayName ?? 'Unknown'}!`,
    activePlayerIndex: playerIndex,
    activeEnemyIndex: enemyIndex,
    playerTeamHP: [...playerHP],
    enemyTeamHP: [...enemyHP],
  });

  // ── Battle-start ability triggers ──────────────────────────────────────────
  const WEATHER_ABILITIES: Record<string, WeatherEffect> = {
    'drought': 'sun', 'drizzle': 'rain', 'sand-stream': 'sandstorm', 'snow-warning': 'hail',
  };
  const weatherLabels: Record<string, string> = {
    rain: 'It started to rain!', sun: 'The sunlight turned harsh!',
    sandstorm: 'A sandstorm kicked up!', hail: 'It started to hail!',
  };

  for (const side of [playerTeam[playerIndex], enemyTeam[enemyIndex]]) {
    if (!side) continue;
    const w = WEATHER_ABILITIES[side.abilityName];
    if (w && !weather) {
      weather = w;
      weatherTurns = 8;
      events.push({ type: 'weather', message: `${side.displayName}'s ${side.abilityName} — ${weatherLabels[w]}`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
    }
    if (side.abilityName === 'intimidate') {
      // Lower opponent ATK by 1
      const opponent = side === playerTeam[playerIndex] ? enemyTeam[enemyIndex] : playerTeam[playerIndex];
      const opponentSide = side === playerTeam[playerIndex] ? 'enemy' : 'player';
      const opponentIdx = side === playerTeam[playerIndex] ? enemyIndex : playerIndex;
      if (opponent) {
        applyStatChanges(opponent, opponentSide, opponentIdx, { atk: -1 }, 'Intimidate', events, playerHP, enemyHP);
        events.push({ type: 'stat_change', message: `${side.displayName}'s Intimidate lowered ${opponent.displayName}'s Attack!`, attackerSide: opponentSide === 'enemy' ? 'player' : 'enemy', attackerIndex: opponentIdx === enemyIndex ? playerIndex : enemyIndex, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
      }
    }
  }

  // Executes one side's attack. Returns true if the defender fainted.
  const doAttack = (
    attacker: Pokemon,
    defender: Pokemon,
    attackerSide: 'player' | 'enemy',
    attackerIdx: number,
    defenderIdx: number,
    skip: boolean,
  ): boolean => {
    if (skip || attacker.currentHP <= 0 || defender.currentHP <= 0) return false;

    const move = getBestMove(attacker, defender, weather);
    const defenderSide: 'player' | 'enemy' = attackerSide === 'player' ? 'enemy' : 'player';

    // --- Status / utility moves ---
    if (move.category === 'status') {
      const accuracy = move.accuracy / 100;
      if (Math.random() > accuracy) {
        events.push({
          type: 'miss',
          message: `${attacker.displayName} used ${move.name} — but it missed!`,
          attackerSide,
          attackerIndex: attackerIdx,
          moveName: move.name,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
        return false;
      }

      events.push({
        type: 'attack',
        message: `${attacker.displayName} used ${move.name}!`,
        attackerSide,
        attackerIndex: attackerIdx,
        moveName: move.name,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
        activePlayerIndex: playerIndex,
        activeEnemyIndex: enemyIndex,
      });

      // Heal
      if (move.heal) {
        const healed = Math.max(1, Math.floor(attacker.maxHP * move.heal));
        const actual = Math.min(healed, attacker.maxHP - attacker.currentHP);
        attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + healed);
        if (attackerSide === 'player') playerHP[attackerIdx] = attacker.currentHP;
        else enemyHP[attackerIdx] = attacker.currentHP;
        events.push({
          type: 'heal',
          message: `${attacker.displayName} restored ${actual} HP!`,
          attackerSide,
          attackerIndex: attackerIdx,
          heal: actual,
          newHP: attacker.currentHP,
          maxHP: attacker.maxHP,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }

      // Weather
      if (move.weather) {
        weather = move.weather;
        weatherTurns = 5;
        const labels: Record<string, string> = {
          rain: 'It started to rain!',
          sun: 'The sunlight turned harsh!',
          sandstorm: 'A sandstorm kicked up!',
          hail: 'It started to hail!',
        };
        events.push({
          type: 'weather',
          message: labels[move.weather] ?? 'The weather changed!',
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }

      // Status inflict (e.g. Dark Void)
      if (move.effect && move.effectChance) {
        if (Math.random() * 100 < move.effectChance) {
          applyStatusEffect(defender, defenderSide, defenderIdx, move.effect, events, playerHP, enemyHP);
        }
      }

      // Self stat change
      if (move.selfStatChange) {
        applyStatChanges(attacker, attackerSide, attackerIdx, move.selfStatChange, move.name, events, playerHP, enemyHP);
      }

      // Opponent stat change
      if (move.opponentStatChange) {
        applyStatChanges(defender, defenderSide, defenderIdx, move.opponentStatChange, move.name, events, playerHP, enemyHP);
      }

      return false;
    }

    // --- Damage moves ---
    const accuracy = move.accuracy / 100;
    if (Math.random() > accuracy) {
      events.push({
        type: 'miss',
        message: `${attacker.displayName} used ${move.name} — but it missed!`,
        attackerSide,
        attackerIndex: attackerIdx,
        moveName: move.name,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
      return false;
    }

    const critRate = attacker.heldItem === 'scope-lens' ? 1 / 8 : 1 / 16;
    const isCritical = Math.random() < critRate;
    const { damage: baseDamage, effectiveness } = calcDamage(attacker, defender, move, weather, isCritical);

    let attackMsg = `${attacker.displayName} used ${move.name}`;
    if (isCritical) attackMsg += ' — Critical hit!';
    if (effectiveness > 1) attackMsg += ' — Super effective!';
    else if (effectiveness < 1 && effectiveness > 0) attackMsg += ' — Not very effective…';
    else if (effectiveness === 0) attackMsg += ' — No effect!';

    events.push({
      type: 'attack',
      message: attackMsg,
      attackerSide,
      attackerIndex: attackerIdx,
      defenderIndex: defenderIdx,
      moveName: move.name,
      damage: baseDamage,
      isCritical,
      effectiveness,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
      activePlayerIndex: playerIndex,
      activeEnemyIndex: enemyIndex,
    });

    if (effectiveness === 0) return false;

    // Multi-hit
    const hitCount = move.multiHit ? pickMultiHitCount(move.multiHit[0], move.multiHit[1]) : 1;
    let totalDamageDealt = 0;

    for (let hit = 0; hit < hitCount; hit++) {
      const { damage } = hit === 0
        ? { damage: baseDamage }
        : calcDamage(attacker, defender, move, weather, false);

      // Sturdy: survive a one-hit KO from full HP
      let actualDamage = Math.min(damage, defender.currentHP);
      if (defender.abilityName === 'sturdy' && defender.currentHP === defender.maxHP && damage >= defender.currentHP) {
        actualDamage = defender.currentHP - 1;
        events.push({ type: 'held_item', message: `${defender.displayName} held on with Sturdy!`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
      }
      defender.currentHP = Math.max(0, defender.currentHP - actualDamage);
      if (attackerSide === 'player') enemyHP[defenderIdx] = defender.currentHP;
      else playerHP[defenderIdx] = defender.currentHP;
      totalDamageDealt += actualDamage;

      const hitLabel = hitCount > 1 ? ` (hit ${hit + 1})` : '';
      events.push({
        type: 'damage',
        message: `${defender.displayName} took ${actualDamage} damage${hitLabel}! (${defender.currentHP}/${defender.maxHP} HP)`,
        attackerSide,
        defenderIndex: defenderIdx,
        damage: actualDamage,
        newHP: defender.currentHP,
        maxHP: defender.maxHP,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
        activePlayerIndex: playerIndex,
        activeEnemyIndex: enemyIndex,
      });

      if (defender.currentHP <= 0) break;
    }

    if (hitCount > 1) {
      events.push({
        type: 'damage',
        message: `Hit ${Math.min(hitCount, totalDamageDealt > 0 ? hitCount : 1)} time(s)!`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    }

    // Drain healing
    if (move.drain && totalDamageDealt > 0) {
      const healed = Math.max(1, Math.floor(totalDamageDealt * move.drain));
      const actual = Math.min(healed, attacker.maxHP - attacker.currentHP);
      attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + healed);
      if (attackerSide === 'player') playerHP[attackerIdx] = attacker.currentHP;
      else enemyHP[attackerIdx] = attacker.currentHP;
      if (actual > 0) {
        events.push({
          type: 'heal',
          message: `${attacker.displayName} drained ${actual} HP!`,
          attackerSide,
          attackerIndex: attackerIdx,
          heal: actual,
          newHP: attacker.currentHP,
          maxHP: attacker.maxHP,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }
    }

    // Life Orb recoil
    if (attacker.heldItem === 'life-orb' && totalDamageDealt > 0) {
      const recoil = Math.max(1, Math.floor(attacker.maxHP / 10));
      attacker.currentHP = Math.max(0, attacker.currentHP - recoil);
      if (attackerSide === 'player') playerHP[attackerIdx] = attacker.currentHP;
      else enemyHP[attackerIdx] = attacker.currentHP;
      events.push({
        type: 'held_item',
        message: `${attacker.displayName} is hurt by Life Orb! (-${recoil} HP)`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    }

    // Move recoil
    if (move.recoil && totalDamageDealt > 0) {
      const recoil = Math.max(1, Math.floor(totalDamageDealt * move.recoil));
      attacker.currentHP = Math.max(0, attacker.currentHP - recoil);
      if (attackerSide === 'player') playerHP[attackerIdx] = attacker.currentHP;
      else enemyHP[attackerIdx] = attacker.currentHP;
      events.push({
        type: 'damage',
        message: `${attacker.displayName} is hurt by recoil! (-${recoil} HP)`,
        attackerSide,
        attackerIndex: attackerIdx,
        damage: recoil,
        newHP: attacker.currentHP,
        maxHP: attacker.maxHP,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    }

    // Shell Bell: attacker heals 1/8 of damage dealt
    if (attacker.heldItem === 'shell-bell' && totalDamageDealt > 0) {
      const heal = Math.max(1, Math.floor(totalDamageDealt / 8));
      const actual = Math.min(heal, attacker.maxHP - attacker.currentHP);
      if (actual > 0) {
        attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + heal);
        if (attackerSide === 'player') playerHP[attackerIdx] = attacker.currentHP;
        else enemyHP[attackerIdx] = attacker.currentHP;
        events.push({
          type: 'heal',
          message: `${attacker.displayName} restored ${actual} HP via Shell Bell!`,
          attackerSide,
          attackerIndex: attackerIdx,
          heal: actual,
          newHP: attacker.currentHP,
          maxHP: attacker.maxHP,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }
    }

    // Weakness Policy: +2 Atk/SpAtk when hit by super-effective move
    if (defender.heldItem === 'weakness-policy' && effectiveness > 1 && defender.currentHP > 0) {
      defender.heldItem = null; // consumed
      applyStatChanges(defender, defenderSide, defenderIdx, { atk: 2, spAtk: 2 }, 'Weakness Policy', events, playerHP, enemyHP);
    }

    // Rocky Helmet
    if (defender.heldItem === 'rocky-helmet' && move.category === 'physical') {
      const helmDmg = Math.max(1, Math.floor(attacker.maxHP / 6));
      attacker.currentHP = Math.max(0, attacker.currentHP - helmDmg);
      if (attackerSide === 'player') playerHP[attackerIdx] = attacker.currentHP;
      else enemyHP[attackerIdx] = attacker.currentHP;
      events.push({
        type: 'held_item',
        message: `${attacker.displayName} was hurt by ${defender.displayName}'s Rocky Helmet! (-${helmDmg} HP)`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    }

    // Status from move hit
    if (move.effect && move.effectChance && defender.currentHP > 0) {
      if (Math.random() * 100 < move.effectChance) {
        applyStatusEffect(defender, defenderSide, defenderIdx, move.effect, events, playerHP, enemyHP);
      }
    }

    // Opponent stat change from move (chance-based if effectChance, otherwise always)
    if (move.opponentStatChange && defender.currentHP > 0) {
      const chance = move.effectChance ?? 100;
      if (Math.random() * 100 < chance) {
        applyStatChanges(defender, defenderSide, defenderIdx, move.opponentStatChange, move.name, events, playerHP, enemyHP);
      }
    }

    // Self stat change from move
    if (move.selfStatChange) {
      applyStatChanges(attacker, attackerSide, attackerIdx, move.selfStatChange, move.name, events, playerHP, enemyHP);
    }

    // Check faint
    if (defender.currentHP <= 0) {
      recordFaint(defender, defenderSide, defenderIdx, events, playerHP, enemyHP);
      return true;
    }
    if (attacker.currentHP <= 0) {
      recordFaint(attacker, attackerSide, attackerIdx, events, playerHP, enemyHP);
      return false;
    }

    return false;
  };

  while (
    playerIndex < playerTeam.length &&
    enemyIndex < enemyTeam.length &&
    turns < MAX_TURNS
  ) {
    turns++;
    const player = playerTeam[playerIndex];
    const enemy = enemyTeam[enemyIndex];

    // Resolve sleep / freeze / paralysis at start of each side's turn
    let playerSkip = false;
    let enemySkip = false;

    if (player.status === 'sleep') {
      player.statusTurns--;
      if (player.statusTurns <= 0) {
        player.status = null;
        events.push({ type: 'status_cure', message: `${player.displayName} woke up!`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
      } else {
        playerSkip = true;
        events.push({ type: 'status_damage', message: `${player.displayName} is fast asleep…`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
      }
    } else if (player.status === 'freeze') {
      playerSkip = true;
      events.push({ type: 'status_damage', message: `${player.displayName} is frozen solid!`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
    } else if (player.status === 'paralysis' && Math.random() < 0.25) {
      playerSkip = true;
      events.push({ type: 'status_damage', message: `${player.displayName} is paralyzed! It can't move!`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
    }

    if (enemy.status === 'sleep') {
      enemy.statusTurns--;
      if (enemy.statusTurns <= 0) {
        enemy.status = null;
        events.push({ type: 'status_cure', message: `${enemy.displayName} woke up!`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
      } else {
        enemySkip = true;
        events.push({ type: 'status_damage', message: `${enemy.displayName} is fast asleep…`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
      }
    } else if (enemy.status === 'freeze') {
      enemySkip = true;
      events.push({ type: 'status_damage', message: `${enemy.displayName} is frozen solid!`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
    } else if (enemy.status === 'paralysis' && Math.random() < 0.25) {
      enemySkip = true;
      events.push({ type: 'status_damage', message: `${enemy.displayName} is paralyzed! It can't move!`, playerTeamHP: [...playerHP], enemyTeamHP: [...enemyHP] });
    }

    // Turn order: priority first, then speed
    const playerMove = playerSkip ? null : getBestMove(player, enemy, weather);
    const enemyMove = enemySkip ? null : getBestMove(enemy, player, weather);

    const playerPriority = playerMove?.priority ?? 0;
    const enemyPriority = enemyMove?.priority ?? 0;

    const playerSpeed = getEffectiveStat(player, 'speed');
    const enemySpeed = getEffectiveStat(enemy, 'speed');

    const playerFirst =
      playerPriority > enemyPriority ||
      (playerPriority === enemyPriority && playerSpeed >= enemySpeed);

    if (playerFirst) {
      const enemyFainted = doAttack(player, enemy, 'player', playerIndex, enemyIndex, playerSkip);
      if (enemyFainted && player.currentHP > 0 && player.abilityName === 'moxie') {
        applyStatChanges(player, 'player', playerIndex, { atk: 1 }, 'Moxie', events, playerHP, enemyHP);
      }
      if (!enemyFainted && player.currentHP > 0) {
        const playerFainted2 = doAttack(enemy, player, 'enemy', enemyIndex, playerIndex, enemySkip);
        if (playerFainted2 && enemy.currentHP > 0 && enemy.abilityName === 'moxie') {
          applyStatChanges(enemy, 'enemy', enemyIndex, { atk: 1 }, 'Moxie', events, playerHP, enemyHP);
        }
      }
    } else {
      const playerFainted = doAttack(enemy, player, 'enemy', enemyIndex, playerIndex, enemySkip);
      if (playerFainted && enemy.currentHP > 0 && enemy.abilityName === 'moxie') {
        applyStatChanges(enemy, 'enemy', enemyIndex, { atk: 1 }, 'Moxie', events, playerHP, enemyHP);
      }
      if (!playerFainted && enemy.currentHP > 0) {
        const enemyFainted2 = doAttack(player, enemy, 'player', playerIndex, enemyIndex, playerSkip);
        if (enemyFainted2 && player.currentHP > 0 && player.abilityName === 'moxie') {
          applyStatChanges(player, 'player', playerIndex, { atk: 1 }, 'Moxie', events, playerHP, enemyHP);
        }
      }
    }

    // End of turn — abilities + status
    if (player.currentHP > 0 && player.abilityName === 'speed-boost') {
      applyStatChanges(player, 'player', playerIndex, { speed: 1 }, 'Speed Boost', events, playerHP, enemyHP);
    }
    if (enemy.currentHP > 0 && enemy.abilityName === 'speed-boost') {
      applyStatChanges(enemy, 'enemy', enemyIndex, { speed: 1 }, 'Speed Boost', events, playerHP, enemyHP);
    }
    if (player.currentHP > 0) {
      const died = processTurnEndStatus(player, 'player', playerIndex, weather, events, playerHP, enemyHP);
      if (died) recordFaint(player, 'player', playerIndex, events, playerHP, enemyHP);
    }
    if (enemy.currentHP > 0) {
      const died = processTurnEndStatus(enemy, 'enemy', enemyIndex, weather, events, playerHP, enemyHP);
      if (died) recordFaint(enemy, 'enemy', enemyIndex, events, playerHP, enemyHP);
    }

    // Weather countdown
    if (weather && weatherTurns > 0) {
      weatherTurns--;
      if (weatherTurns === 0) {
        const labels: Record<string, string> = {
          rain: 'The rain stopped.',
          sun: 'The harsh sunlight faded.',
          sandstorm: 'The sandstorm subsided.',
          hail: 'The hail stopped.',
        };
        events.push({
          type: 'weather',
          message: labels[weather] ?? 'The weather cleared.',
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
        weather = null;
      }
    }

    // Switch to next alive if fainted
    if (playerTeam[playerIndex].currentHP <= 0) {
      const next = playerTeam.findIndex((p, i) => i > playerIndex && p.currentHP > 0);
      if (next !== -1) {
        playerIndex = next;
        events.push({
          type: 'switch_in',
          message: `Go, ${playerTeam[playerIndex].displayName}!`,
          activePlayerIndex: playerIndex,
          activeEnemyIndex: enemyIndex,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }
    }

    if (enemyTeam[enemyIndex].currentHP <= 0) {
      const next = enemyTeam.findIndex((p, i) => i > enemyIndex && p.currentHP > 0);
      if (next !== -1) {
        enemyIndex = next;
        events.push({
          type: 'switch_in',
          message: `Opponent sent out ${enemyTeam[enemyIndex].displayName}!`,
          activePlayerIndex: playerIndex,
          activeEnemyIndex: enemyIndex,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }
    }

    const playerAlive = playerTeam.some(p => p.currentHP > 0);
    const enemyAlive = enemyTeam.some(p => p.currentHP > 0);
    if (!playerAlive || !enemyAlive) break;
  }

  const playerAlive = playerTeam.some(p => p.currentHP > 0);
  const winner = playerAlive ? 'player' : 'enemy';

  events.push({
    type: 'battle_end',
    message: playerAlive ? 'You won the battle!' : 'You lost the battle…',
    isPlayerVictory: playerAlive,
    playerTeamHP: [...playerHP],
    enemyTeamHP: [...enemyHP],
  });

  const xpGained = playerTeam.map((p) => {
    if (p.currentHP <= 0) return 0;
    const baseXP = enemyTeam.reduce((sum, e) => {
      return sum + Math.floor(e.baseStats.hp + e.baseStats.atk + e.baseStats.def + e.baseStats.spAtk + e.baseStats.spDef + e.baseStats.speed);
    }, 0);
    return Math.floor((baseXP * (enemyTeam[0]?.level ?? 5) * 7) / (10 * playerTeam.length));
  });

  for (let i = 0; i < rawPlayerTeam.length; i++) {
    rawPlayerTeam[i].currentHP = playerHP[i];
    rawPlayerTeam[i].status = playerTeam[i].status;
    rawPlayerTeam[i].statusTurns = playerTeam[i].statusTurns;
    rawPlayerTeam[i].heldItem = playerTeam[i].heldItem;
    rawPlayerTeam[i].atkStage = playerTeam[i].atkStage;
    rawPlayerTeam[i].defStage = playerTeam[i].defStage;
    rawPlayerTeam[i].spAtkStage = playerTeam[i].spAtkStage;
    rawPlayerTeam[i].spDefStage = playerTeam[i].spDefStage;
    rawPlayerTeam[i].speedStage = playerTeam[i].speedStage;
  }

  return {
    winner,
    events,
    playerTeamFinal: playerTeam,
    enemyTeamFinal: enemyTeam,
    xpGained,
    turnsPlayed: turns,
  };
}
