// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * A room in the map.
 * @class
 */
class Room {
    /**
     * Creates a room.
     */
    constructor() {
        this.monsters = [];
    }

    /**
     * Gets a monster from a room given the species.
     * @param {string} species The species of the monster to find
     * @returns {Monster} The monster
     */
    getMonster(species) {
        return this.monsters.find(monster => equalsCI(monster.species, species));
    }

    /**
     * Adds a new monster to the room.
     * @param {string} species The species of the new monster
     * @returns {Room} The room
     */
    addMonster(species) {
        this.monsters.push(new Monster(species));
        return this;
    }

    /**
     * Removes a monster from the room.
     * @param {string} species The species of the monster to remove
     * @returns {Room} The room
     */
    removeMonster(species) {
        this.monsters.splice(this.monsters.findIndex(monster => equalsCI(monster.species, species)), 1);
        return this;
    }

    /**
     * Creates a formatted list of all monsters in the room.
     * @returns {string} The formatted list
     */
    listMonsters() {
        const monsterDescriptions = [];
        for (const [index, monster] of this.monsters.entries()) {
            monsterDescriptions.push(`${(index + 1)}) ${monster.species} - ${monster.hp} HP`);
        }
        return monsterDescriptions.join('\n');
    }
}