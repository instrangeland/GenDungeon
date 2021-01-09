// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * Compute a player attacking a monster.
 * @param {Player} player The player
 * @param {Monster} monster The monster
 * @return {boolean} Whether the monster is still alive after the attack
 */
function playerAttacksMonster(player, monster) {
    monster.hp -= player.strength;
    return monster.hp > 0;
}

/**
 * Compute a monster attacking a player.
 * @param {Player} player The player
 * @param {Monster} monster The monster
 * @return {boolean} Whether the player is still alive after the attack
 */
function monsterAttacksPlayer(player, monster) {
    player.hp -= monster.strength;
    return player.hp > 0;
}