// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

function playerAttacksMonster(player, monster) {
    monster.hp -= player.strength;
    return monster.hp > 0;
}

function monsterAttacksPlayer(player, monster) {
    player.hp -= monster.strength;
    return player.hp > 0;
}