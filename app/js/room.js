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
        return this;
    }

    /**
     * Returns a human-readable list of monsters in this room.
     *
     * @returns {string} the pretty list
     */
    listMonsters() {
        let monsterDescriptions = '';
        for (const [index, monster] of this.monsters.entries()) {
            monsterDescriptions += `\n${(index + 1)}) ${monster.species} - ${monster.hp} HP`;
        }
        return monsterDescriptions;
    }

    getMonster(type) {
        return this.monsters.find(monster => monster.species.toLowerCase() === type);
    }

    removeMonster(type) {
        for (const [index, monster] of this.monsters.entries()) {
            if (monster.species.toLowerCase() === type) {
                this.monsters.splice(index, 1);
            }
        }
    }
}