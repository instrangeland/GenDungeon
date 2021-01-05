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
     * @param type {string} the type of the monster
     */
    addMonster(type) {
        this.monsters.push(new Monster(type));
    }

    /**
     * Returns a human-readable list of monsters in this room.
     *
     * @returns {string} the pretty list
     */
    listMonsters() {
        let monsterDescriptions = '';
        for (const [index, monster] of this.monsters.entries()) {
            monsterDescriptions += `\n${(index + 1)}) ${monster.type} - ${monster.hp} HP`;
        }
        return monsterDescriptions;
    }

    lookAtMonster(name) {
        for (const monster of this.monsters) {
            if (monster.type.toLowerCase() === name) {
                return 'You are looking at: ' + monster.type;
            }
        }
        return false;
    }
}