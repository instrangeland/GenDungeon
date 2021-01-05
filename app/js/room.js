// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * Rooms are found in the map and contain entities.
 */
class Room {
    constructor() {
        this.monsters = [];
    }

    /**
     * Adds a monster to this room.
     *
     * @param name {string} the name of the monster
     * @param hp {number}   the health-points of the monster
     */
    addMonster(name, hp) {
        this.monsters.push({
            name: name,
            hp: hp
        });
    }

    /**
     * Returns a human-readable list of monsters in this room.
     *
     * @returns {string} the pretty list
     */
    listMonsters() {
        let monsterDescriptions = '';
        for (const [index, monster] of this.monsters.entries()) {
            monsterDescriptions += `\n${(index + 1)}) ${monster.name} - ${monster.hp} HP`;
        }
        return monsterDescriptions;
    }

    lookAtMonster(name) {
        for (const monster of this.monsters) {
            if (monster.name.toLowerCase() === name) {
                return 'You are looking at: ' + monster.name;
            }
        }
        return false;
    }
}