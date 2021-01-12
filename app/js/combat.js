// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * Compute a player attacking a monster.
 * @param {Player} player The player
 * @param {Monster} monster The monster
 * @param {number} damage The amount of damage to inflict
 * @return {boolean} Whether the monster is still alive after the attack
 */
function playerAttacksMonster(player, monster, damage) {
    monster.hp -= damage;
    monster.state = monsterStates.ATTACKING;
    return monster.hp > 0;
}

/**
 * Compute a monster attacking a player.
 * @param {Player} player The player
 * @param {Monster} monster The monster
 * @param {number} damage The amount of damage to inflict
 * @return {boolean} Whether the player is still alive after the attack
 */
function monsterAttacksPlayer(player, monster, damage) {
    player.hp -= damage;
    return player.hp > 0;
}