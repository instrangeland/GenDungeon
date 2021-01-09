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
        this.addMonster(monsterSpecies.ZOMBIE);
        this.description = this.generateTitle();
    }

    /**
     * Generates a random room description
     * @return {string} The description
     */
    generateTitle() {
        const adjectives = [
            'An unlit',
            'A dark',
            'A dimly lit',
            'A bright',
            'A mysterious',
            'An eerie',
            'An unnerving',
            'A slanted',
            'A round',
            'A curved',
            'A pristine'
        ];

        const nouns = [
            'room',
            'passageway',
            'corridor',
            'tunnel',
            'chamber'
        ];

        return `${getRandomElement(adjectives)} ${getRandomElement(nouns)}`;
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

    /**
     * Logs the description of the room and some other information
     * @param player The current player
     */
    getInfo(player) {
        return `* ${this.description} *\n\nYou are at [${player.x}, ${player.y}].\nContents of this room:\n${this.listMonsters()}`;
    }
}