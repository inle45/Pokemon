import type { Pokemon, MoveData, StatusEffect } from '../types/pokemon';
import type { BattleEvent, BattleResult } from '../types/battle';
import { getTypeEffectiveness } from '../data/typeChart';
import { getEffectiveStat } from '../services/pokeapi';

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function calcDamage(
  attacker: Pokemon,
  defender: Pokemon,
  move: MoveData,
): { damage: number; effectiveness: number; isCritical: boolean } {
  if (move.power === 0 || move.category === 'status') {
    return { damage: 0, effectiveness: 1, isCritical: false };
  }

  const isCritical = Math.random() < 1 / 16;
  const critMultiplier = isCritical ? 1.5 : 1;

  // Determine attacking/defending stats
  const atkStat = move.category === 'physical'
    ? getEffectiveStat(attacker, 'atk')
    : getEffectiveStat(attacker, 'spAtk');
  const defStat = move.category === 'physical'
    ? getEffectiveStat(defender, 'def')
    : getEffectiveStat(defender, 'spDef');

  // STAB
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;

  // Type effectiveness
  const effectiveness = getTypeEffectiveness(move.type, defender.types);

  // Life Orb
  const lifeOrb = attacker.heldItem === 'life-orb' ? 1.3 : 1;

  // Choice Band
  const choiceBand = (attacker.heldItem === 'choice-band' && move.category === 'physical') ? 1.5 : 1;

  // Base damage formula
  const baseDamage = Math.floor(
    (((2 * attacker.level / 5 + 2) * move.power * atkStat / defStat) / 50 + 2)
    * stab * effectiveness * critMultiplier * lifeOrb * choiceBand
  );

  // Random factor (85-100%)
  const randomFactor = (Math.floor(Math.random() * 16) + 85) / 100;
  const damage = Math.max(1, Math.floor(baseDamage * randomFactor));

  return { damage, effectiveness, isCritical };
}

function getBestMove(attacker: Pokemon, defender: Pokemon): MoveData {
  let bestMove = attacker.moves[0];
  let bestExpectedDamage = -1;

  for (const move of attacker.moves) {
    if (move.power === 0 || move.category === 'status') continue;

    const atkStat = move.category === 'physical'
      ? getEffectiveStat(attacker, 'atk')
      : getEffectiveStat(attacker, 'spAtk');

    const effectiveness = getTypeEffectiveness(move.type, defender.types);
    const stab = attacker.types.includes(move.type) ? 1.5 : 1;

    const expected = move.power * atkStat * effectiveness * stab;

    if (expected > bestExpectedDamage) {
      bestExpectedDamage = expected;
      bestMove = move;
    }
  }

  return bestMove;
}

function applyStatusEffect(
  target: Pokemon,
  effect: string,
  events: BattleEvent[],
  side: 'player' | 'enemy',
  index: number,
  playerHP: number[],
  enemyHP: number[],
) {
  if (target.status !== null) return; // Already has status

  const statusMap: Record<string, StatusEffect> = {
    burn: 'burn',
    poison: 'poison',
    paralysis: 'paralysis',
    sleep: 'sleep',
    freeze: 'freeze',
  };

  const status = statusMap[effect];
  if (!status) return;

  // Lum Berry prevents status
  if (target.heldItem === 'lum-berry') {
    target.heldItem = null; // consumed
    events.push({
      type: 'held_item',
      message: `${target.displayName}'s Lum Berry cured the status!`,
      pokemonName: target.displayName,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
    return;
  }

  target.status = status;
  if (status === 'sleep') {
    target.statusTurns = Math.floor(Math.random() * 3) + 1;
  }

  events.push({
    type: 'status_apply',
    message: `${target.displayName} was ${status === 'burn' ? 'burned' : status === 'poison' ? 'poisoned' : status === 'paralysis' ? 'paralyzed' : status === 'sleep' ? 'put to sleep' : 'frozen'}!`,
    attackerSide: side,
    attackerIndex: index,
    statusEffect: status,
    playerTeamHP: [...playerHP],
    enemyTeamHP: [...enemyHP],
  });
}

function processTurnEndStatus(
  pokemon: Pokemon,
  side: 'player' | 'enemy',
  index: number,
  events: BattleEvent[],
  playerHP: number[],
  enemyHP: number[],
): boolean {
  if (!pokemon.status) return false;

  // Leftovers healing
  if (pokemon.heldItem === 'leftovers') {
    const heal = Math.max(1, Math.floor(pokemon.maxHP / 16));
    pokemon.currentHP = Math.min(pokemon.maxHP, pokemon.currentHP + heal);
    if (side === 'player') playerHP[index] = pokemon.currentHP;
    else enemyHP[index] = pokemon.currentHP;

    events.push({
      type: 'held_item',
      message: `${pokemon.displayName} restored a little HP via Leftovers!`,
      playerTeamHP: [...playerHP],
      enemyTeamHP: [...enemyHP],
    });
  }

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

export function simulateBattle(
  rawPlayerTeam: Pokemon[],
  rawEnemyTeam: Pokemon[],
): BattleResult {
  const playerTeam: Pokemon[] = deepClone(rawPlayerTeam);
  const enemyTeam: Pokemon[] = deepClone(rawEnemyTeam);
  const events: BattleEvent[] = [];

  const playerHP = playerTeam.map(p => p.currentHP);
  const enemyHP = enemyTeam.map(p => p.currentHP);

  let playerIndex = 0;
  let enemyIndex = 0;
  let turns = 0;
  const MAX_TURNS = 100;

  // Find first alive Pokémon
  while (playerIndex < playerTeam.length && playerTeam[playerIndex].currentHP <= 0) playerIndex++;
  while (enemyIndex < enemyTeam.length && enemyTeam[enemyIndex].currentHP <= 0) enemyIndex++;

  events.push({
    type: 'switch_in',
    message: `${playerTeam[playerIndex]?.displayName || 'Unknown'} vs ${enemyTeam[enemyIndex]?.displayName || 'Unknown'}!`,
    activePlayerIndex: playerIndex,
    activeEnemyIndex: enemyIndex,
    playerTeamHP: [...playerHP],
    enemyTeamHP: [...enemyHP],
  });

  while (
    playerIndex < playerTeam.length &&
    enemyIndex < enemyTeam.length &&
    turns < MAX_TURNS
  ) {
    turns++;
    const player = playerTeam[playerIndex];
    const enemy = enemyTeam[enemyIndex];

    // Check sleep/paralysis/freeze skip at turn start
    let playerSkip = false;
    let enemySkip = false;

    if (player.status === 'sleep') {
      player.statusTurns--;
      if (player.statusTurns <= 0) {
        player.status = null;
        events.push({
          type: 'status_cure',
          message: `${player.displayName} woke up!`,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      } else {
        playerSkip = true;
        events.push({
          type: 'status_damage',
          message: `${player.displayName} is fast asleep...`,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }
    } else if (player.status === 'freeze') {
      playerSkip = true;
      events.push({
        type: 'status_damage',
        message: `${player.displayName} is frozen solid!`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    } else if (player.status === 'paralysis' && Math.random() < 0.25) {
      playerSkip = true;
      events.push({
        type: 'status_damage',
        message: `${player.displayName} is paralyzed! It can't move!`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    }

    if (enemy.status === 'sleep') {
      enemy.statusTurns--;
      if (enemy.statusTurns <= 0) {
        enemy.status = null;
        events.push({
          type: 'status_cure',
          message: `${enemy.displayName} woke up!`,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      } else {
        enemySkip = true;
        events.push({
          type: 'status_damage',
          message: `${enemy.displayName} is fast asleep...`,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
        });
      }
    } else if (enemy.status === 'freeze') {
      enemySkip = true;
      events.push({
        type: 'status_damage',
        message: `${enemy.displayName} is frozen solid!`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    } else if (enemy.status === 'paralysis' && Math.random() < 0.25) {
      enemySkip = true;
      events.push({
        type: 'status_damage',
        message: `${enemy.displayName} is paralyzed! It can't move!`,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
      });
    }

    // Determine turn order by speed
    const playerSpeed = getEffectiveStat(player, 'speed');
    const enemySpeed = getEffectiveStat(enemy, 'speed');

    const playerFirst = playerSpeed >= enemySpeed;

    const doAttack = (
      attacker: Pokemon,
      defender: Pokemon,
      attackerSide: 'player' | 'enemy',
      attackerIdx: number,
      defenderIdx: number,
      skip: boolean,
    ): boolean => {
      if (skip || attacker.currentHP <= 0 || defender.currentHP <= 0) return false;

      const move = getBestMove(attacker, defender);

      // Accuracy check
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

      const { damage, effectiveness, isCritical } = calcDamage(attacker, defender, move);

      let message = `${attacker.displayName} used ${move.name}`;
      if (isCritical) message += ' — Critical hit!';
      if (effectiveness > 1) message += ' — Super effective!';
      else if (effectiveness < 1 && effectiveness > 0) message += ' — Not very effective...';
      else if (effectiveness === 0) message += ' — It had no effect!';

      events.push({
        type: 'attack',
        message,
        attackerSide,
        attackerIndex: attackerIdx,
        defenderIndex: defenderIdx,
        moveName: move.name,
        damage,
        isCritical,
        effectiveness,
        playerTeamHP: [...playerHP],
        enemyTeamHP: [...enemyHP],
        activePlayerIndex: playerIndex,
        activeEnemyIndex: enemyIndex,
      });

      if (damage > 0 && effectiveness > 0) {
        defender.currentHP = Math.max(0, defender.currentHP - damage);
        if (attackerSide === 'player') {
          enemyHP[defenderIdx] = defender.currentHP;
        } else {
          playerHP[defenderIdx] = defender.currentHP;
        }

        events.push({
          type: 'damage',
          message: `${defender.displayName} took ${damage} damage! (${defender.currentHP}/${defender.maxHP} HP)`,
          attackerSide,
          defenderIndex: defenderIdx,
          damage,
          newHP: defender.currentHP,
          maxHP: defender.maxHP,
          playerTeamHP: [...playerHP],
          enemyTeamHP: [...enemyHP],
          activePlayerIndex: playerIndex,
          activeEnemyIndex: enemyIndex,
        });

        // Life Orb recoil
        if (attacker.heldItem === 'life-orb') {
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

        // Status effect from move
        if (move.effect && move.effectChance && Math.random() * 100 < move.effectChance) {
          const defenderSide = attackerSide === 'player' ? 'enemy' : 'player';
          applyStatusEffect(defender, move.effect, events, defenderSide, defenderIdx, playerHP, enemyHP);
        }
      }

      // Check faint
      if (defender.currentHP <= 0) {
        if (attackerSide === 'player') {
          recordFaint(defender, 'enemy', defenderIdx, events, playerHP, enemyHP);
        } else {
          recordFaint(defender, 'player', defenderIdx, events, playerHP, enemyHP);
        }
        return true; // defender fainted
      }

      // Check attacker faint (from Life Orb/Rocky Helmet)
      if (attacker.currentHP <= 0) {
        recordFaint(attacker, attackerSide, attackerIdx, events, playerHP, enemyHP);
        return false;
      }

      return false;
    };

    if (playerFirst) {
      const enemyFainted = doAttack(player, enemy, 'player', playerIndex, enemyIndex, playerSkip);
      if (!enemyFainted && player.currentHP > 0) {
        doAttack(enemy, player, 'enemy', enemyIndex, playerIndex, enemySkip);
      }
    } else {
      const playerFainted = doAttack(enemy, player, 'enemy', enemyIndex, playerIndex, enemySkip);
      if (!playerFainted && enemy.currentHP > 0) {
        doAttack(player, enemy, 'player', playerIndex, enemyIndex, playerSkip);
      }
    }

    // End of turn status damage
    if (player.currentHP > 0) {
      const playerFainted = processTurnEndStatus(player, 'player', playerIndex, events, playerHP, enemyHP);
      if (playerFainted) {
        recordFaint(player, 'player', playerIndex, events, playerHP, enemyHP);
      }
    }
    if (enemy.currentHP > 0) {
      const enemyFainted = processTurnEndStatus(enemy, 'enemy', enemyIndex, events, playerHP, enemyHP);
      if (enemyFainted) {
        recordFaint(enemy, 'enemy', enemyIndex, events, playerHP, enemyHP);
      }
    }

    // Switch to next alive Pokémon if current fainted
    if (playerTeam[playerIndex].currentHP <= 0) {
      const nextPlayer = playerTeam.findIndex((p, i) => i > playerIndex && p.currentHP > 0);
      if (nextPlayer !== -1) {
        playerIndex = nextPlayer;
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
      const nextEnemy = enemyTeam.findIndex((p, i) => i > enemyIndex && p.currentHP > 0);
      if (nextEnemy !== -1) {
        enemyIndex = nextEnemy;
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

    // Check if battle is over
    const playerAlive = playerTeam.some(p => p.currentHP > 0);
    const enemyAlive = enemyTeam.some(p => p.currentHP > 0);

    if (!playerAlive || !enemyAlive) break;
  }

  const playerAlive = playerTeam.some(p => p.currentHP > 0);
  const winner = playerAlive ? 'player' : 'enemy';

  events.push({
    type: 'battle_end',
    message: playerAlive
      ? 'You won the battle!'
      : 'You lost the battle...',
    isPlayerVictory: playerAlive,
    playerTeamHP: [...playerHP],
    enemyTeamHP: [...enemyHP],
  });

  // Calculate XP gained
  const xpGained = playerTeam.map((p, i) => {
    if (p.currentHP <= 0) return 0;
    const baseXP = enemyTeam.reduce((sum, e) => {
      return sum + Math.floor(e.baseStats.hp + e.baseStats.atk + e.baseStats.def + e.baseStats.spAtk + e.baseStats.spDef + e.baseStats.speed);
    }, 0);
    return Math.floor((baseXP * enemyTeam[0]?.level * 7) / (10 * playerTeam.length));
  });

  // Apply HP changes back to original teams
  for (let i = 0; i < rawPlayerTeam.length; i++) {
    rawPlayerTeam[i].currentHP = playerHP[i];
    rawPlayerTeam[i].status = playerTeam[i].status;
    rawPlayerTeam[i].statusTurns = playerTeam[i].statusTurns;
    rawPlayerTeam[i].heldItem = playerTeam[i].heldItem;
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
