// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * A room in the map.
 * @class
 */
class Room {
    /**
     * Creates a room.
     * @param {number} y The y-coordinate
     * @param {number} x The x-coordinate
     */
    constructor(y, x) {
        this.distance = Math.ceil(Math.sqrt(x * x + y * y));
        this.monsters = [];
        this.generateMonsters();
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
        if (monsterDescriptions.length === 0) {
            monsterDescriptions.push('(This room is empty.)');
        }
        return monsterDescriptions.join('\n');
    }

    /**
     * Logs the description of the room and some other information.
     * @param {Player} player The current player
     */
    getInfo(player) {
        return `* ${this.description} *
        
        ${this.listMonsters()}`;
    }

    /**
     * Generates monsters in the room.
     */
    generateMonsters() {
        this.addMonsterChance(monsterTypes.ZOMBIE, 1, 0.9);
        this.addMonsterChance(monsterTypes.SKELETON, 2, 0.85);
        this.addMonsterChance(monsterTypes.GOBLIN, 2, 0.75);
        this.addMonsterChance(monsterTypes.SPIDER, 3, 0.85);
        this.addMonsterChance(monsterTypes.VAMPIRE, 5, 0.8);
        this.addMonsterChance(monsterTypes.GHOST, 8, 0.6);
    }

    /**
     * Adds a monster to the room if certain probabilities occur.
     * @param {string} type type of monster
     * @param {number} minDistance The minimum distance the room needs to be from the origin for the monster to spawn
     * @param {number} maxChance The maximum chance of the monster spawning
     */
    addMonsterChance(type, minDistance, maxChance) {
        if (getRandInt(0, this.distance) > minDistance - 1) {
            if (Math.random() > maxChance) {
                this.addMonster(type);
            }
        }
    }
}