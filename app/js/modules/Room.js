// ProceduralTA is licensed under GNU General Public License v3.0.

import {getRandInt, getRandomElement, logMessage} from "../ProceduralTA.js";
import {logTypes} from "./GameLog.js";
import {Monster, monsterStates, monsterTypes} from "./things/Monster.js";
import {Food} from "./things/Food.js";

/**
 * Compares whether two strings are equal, ignoring case.
 * @param {string} str1 The first string
 * @param {string} str2 The second string
 * @return {boolean} Whether the strings are equal, ignoring case
 */
function equalsCI(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}

/**
 * A room in a world.
 * @param y {number} The y-coordinate
 * @param x {number} The x-coordinate
 * @module Room
 * @class
 */
export class Room {
    constructor(y, x) {
        this.description = this.generateDescription();
        this.distance = Math.sqrt(x ** 2 + y ** 2);
        this.contents = [];

        this.generateMonsters();
        if (Math.random() > 0.8) {
            this.contents.push(new Food());
        }
    }

    /**
     * Generates a random room description.
     * @return {string} The description
     */
    generateDescription() {
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
     * Adds monsters to the room.
     */
    generateMonsters() {
        this.addMonsterChance(monsterTypes.ZOMBIE, 1, 0.8);
        this.addMonsterChance(monsterTypes.SKELETON, 2, 0.75);
        this.addMonsterChance(monsterTypes.GOBLIN, 2, 0.65);
        this.addMonsterChance(monsterTypes.SPIDER, 3, 0.75);
        this.addMonsterChance(monsterTypes.VAMPIRE, 5, 0.7);
        this.addMonsterChance(monsterTypes.GHOST, 8, 0.5);
    }

    /**
     * Gets a formatted description of the room and its contents.
     * @return {string} The description
     */
    getRoomInfo() {
        if (this.contents.length) {
            return `* ${this.description} *
        
            ${this.listThings()}`;
        }
        return `* ${this.description} *
        
        (This room is empty)`
    }

    /**
     * Gets a formatted list of all things in the room.
     * @return {string}
     */
    listThings() {
        return this.contents.map(
            (thing, index) => `${(index + 1)}) ${thing.getShortDescription()}`
        ).join('\n');
    }

    /**
     * Gets a thing from the room.
     * @param {string} thingName The name of the thing
     * @return {Thing|undefined} The thing
     */
    getThing(thingName) {
        return this.contents.find(
            thing => equalsCI(thing.name, thingName)
        );
    }

    /**
     * Gets a formatted description of a thing.
     * @param {string} thingName The name of the thing
     * @return {string} The description
     */
    getThingInfo(thingName) {
        if (this.getThing(thingName)) {
            return this.getThing(thingName).getDescription();
        }
        return 'That doesn\'t exist here.';
    }

    /**
     * Adds a monster to the room.
     * @param {Object} monster The monster
     */
    addMonster(monster) {
        this.contents.push(new Monster(monster));
    }

    /**
     * Removes a thing from the room.
     * @param {string} thingName The name of the thing
     */
    removeThing(thingName) {
        this.contents.splice(this.contents.findIndex(monster => equalsCI(monster.name, thingName)), 1);
    }

    /**
     * Adds a monster to the room if certain probabilities occur.
     * @param {Object} monster The monster
     * @param {number} minDistance The minimum distance the room must be from the origin of the world
     * @param {number} maxChance The maximum chance of the monster generating as the distance approaches infinity
     */
    addMonsterChance(monster, minDistance, maxChance) {
        if (getRandInt(0, this.distance) > minDistance - 1) {
            if (Math.random() < maxChance) {
                this.addMonster(monster);
            }
        }
    }

    /**
     * Calculates the effects of a player attacking something.
     * @param {Player} player The player
     * @param {string} thing The thing being attacked
     * @return {boolean} Whether the attack succeeded
     */
    attackThing(player, thing) {
        const monster = this.getThing(thing);
        if (monster instanceof Monster) {
            monster.state = monsterStates.ATTACKING;
            const damage = player.strength;
            monster.hp -= damage;
            if (monster.hp > 0) {
                logMessage(`You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, taking its HP down to ${monster.hp}.`, logTypes.COMBAT);
                return true;
            } else {
                this.removeThing(thing);
                logMessage(`You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, killing it.`, logTypes.SUCCESS);
                return true;
            }
        } else if (monster) {
            logMessage('You can\'t attack that.', logTypes.ALERT);
            return false;
        }
        logMessage('That doesn\'t exist here.', logTypes.ALERT);
        return false;
    }

    /**
     * Calculates the effects of a player taking thing.
     * @param {Player} player The player
     * @param {string} thing The thing being taken
     * @return {boolean} Whether the thing was taken
     */
    takeThing(player, thing) {
        const food = this.getThing(thing);
        if (food instanceof Food) {
            player.hp += food.healing;
            this.removeThing(thing);
            logMessage(`You take and eat the ${food.name.toLowerCase()}, increasing your health to ${player.hp} HP.`, logTypes.SUCCESS);
            return true;
        } else if (food) {
            logMessage('You can\'t take that.', logTypes.ALERT);
            return false;
        }
        logMessage('That doesn\'t exist here.', logTypes.ALERT);
        return false;
    }
}