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
     * @param {string} species The species of the monster to get
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
     * Gets a description of the room and some other information.
     * @param {Player} player The current player
     */
    getInfo(player) {
        return `* ${this.description} *
        
        ${this.listMonsters()}`;
    }

    /**
     * Adds a monster to the room if certain probabilities occur.
     * @param {string} species The species of the monster
     * @param {number} minDistance The minimum distance the room needs to be from the origin for the monster to spawn
     * @param {number} maxChance The maximum chance of the monster spawning
     */
    addMonsterChance(species, minDistance, maxChance) {
        if (getRandInt(0, this.distance) > minDistance - 1) {
            if (Math.random() > maxChance) {
                this.addMonster(species);
            }
        }
    }

    /**
     * Gets the description of a monster if it exists, otherwise a message stating it doesn't.
     * @param {string} species The species of the monster
     * @return {string} The description or message
     */
    getMonsterInfo(species) {
        const monster = this.getMonster(species);
        if (monster) {
            const description = [];
            description.push(`A ${monster.species.toLowerCase()} with ${monster.hp} HP.`);
            description.push(`It does an average of ${monster.strength} damage, and is about ${monster.attackAccuracy * 100}% accurate.`);
            return description.join(' ');
        } else {
            return 'That doesn\'t exist here.';
        }
    }

    /**
     * Calculates the effects of a player attack a monster, and returns a description of what happened.
     * @param {string} species The type of monster
     * @param {Player} player The player
     * @return {string} The message
     */
    playerAttacksMonster(species, player) {
        const monster = this.getMonster(species);
        if (monster) {
            const damage = player.strength;
            monster.hp -= damage;
            if (monster.hp > 0) {
                return `You attack the ${monster.species.toLowerCase()} for ${player.strength} damage, taking its HP down to ${monster.hp}.`;
            } else {
                this.removeMonster(species);
                return `You attack the ${monster.species.toLowerCase()} for ${player.strength} damage, killing it.`;
            }
        } else {
            return 'That doesn\'t exist here.';
        }
    }
}