// ProceduralTA is licensed under GNU General Public License v3.0.
;
import Food from './things/Food.js';
import game, {getRandomElement, getRandInt} from '../game.js';
import {GameLog, logTypes} from './GameLog.js';
import Monster, {monsterStates, monsterTypes} from './things/Monster.js'
import rpc from './RPC.js';
import Thing from './things/Thing.js';
import Weapon from './things/Weapon.js';

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
 */
export default class Room {
    constructor(y, x) {
        this.y = y;
        this.x = x;

        if (this.y === 0 && this.x === 0) {
            this.isExplored = true;
        }

        if (-2 < this.y &&
            2 > this.y &&
            -2 < this.x &&
            2 > this.x) {
            this.isActive = true;
        } else {
            this.isActive = noise.simplex2(y / 2 + 471, x / 2 + 471) > -0.15;
        }

        this.description = this.generateDescription();
        this.distance = Math.sqrt(x ** 2 + y ** 2);
        this.contents = [];

        this.generateMonsters();
        if (game.seed.quick() > 0.8) {
            this.contents.push(new Food());
        }
        if (game.seed.quick() > 0.9) {
            this.contents.push(new Weapon());
        }

        this.contents.push(new Thing('wall'));
        this.contents.push(new Thing('floor'));
        this.contents.push(new Thing('ceiling'));
        this.contents.push(new Thing('door'));
        this.contents.push(new Thing('path'));
        this.contents.push(new Thing('pathway'));
        this.contents.push(new Thing('monster'));
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
            'A pristine',
            'A dirty',
            'A slanted',
            'A round',
            'A curved',
            'A square',
            'A rectangular',
            'A semicircular',
            'A strange',
            'A weird',
            'A symmetrical',
            'A tall'
        ];

        const nouns = [
            'room',
            'passageway',
            'corridor',
            'tunnel',
            'chamber',
            'entranceway'
        ];

        return `${getRandomElement(adjectives)} ${getRandomElement(nouns)}`;
    }

    /**
     * Adds monsters to the room.
     */
    generateMonsters() {
        this.addMonsterChance(monsterTypes.ZOMBIE, 1, 0.85);
        this.addMonsterChance(monsterTypes.SKELETON, 2, 0.8);
        this.addMonsterChance(monsterTypes.GOBLIN, 2, 0.7);
        this.addMonsterChance(monsterTypes.SPIDER, 3, 0.8);
        this.addMonsterChance(monsterTypes.VAMPIRE, 5, 0.75);
        this.addMonsterChance(monsterTypes.GHOST, 8, 0.55);
    }

    /**
     * Gets a formatted description of the room and its contents.
     * @return {string} The description
     */
    getRoomInfo() {
        this.isExplored = true;
        const world = game.world;
        const pathList = [];

        if (world.getRoom(this.y + 1, this.x).isActive) {
            pathList.push('north');
        } else {
            world.getRoom(this.y + 1, this.x).isExplored = true;
        }

        if (world.getRoom(this.y - 1, this.x).isActive) {
            pathList.push('south');
        } else {
            world.getRoom(this.y - 1, this.x).isExplored = true;
        }

        if (world.getRoom(this.y, this.x + 1).isActive) {
            pathList.push('east');
        } else {
            world.getRoom(this.y, this.x + 1).isExplored = true;
        }

        if (world.getRoom(this.y, this.x - 1).isActive) {
            pathList.push('west');
        } else {
            world.getRoom(this.y, this.x - 1).isExplored = true;
        }

        let pathsDescription;
        if (pathList.length === 1) {
            pathsDescription = `You can go ${pathList[0]} from here.`;
        } else if (pathList.length === 2) {
            pathsDescription = `You can go ${pathList[0]} and ${pathList[1]} from here.`;
        } else if (pathList.length === 3) {
            pathsDescription = `You can go ${pathList[0]}, ${pathList[1]}, and ${pathList[2]} from here.`;
        } else {
            pathsDescription = 'You can go in every direction from here.';
        }

        if (this.listThings()) {
            return `* ${this.description} *
            ${pathsDescription}
        
            ${this.listThings()}`;
        }
        return `* ${this.description} *
        ${pathsDescription}
        
        (This room is empty)`
    }

    /**
     * Gets a formatted list of all things in the room.
     * @return {string}
     */
    listThings() {
        return this.contents.filter(
            thing => thing.isListed
        ).map(
            (thing, index) => `${(index + 1)}) ${thing.getShortDescription()}`
        ).join('\n');
    }

    /**
     * Gets a thing from the room.
     * @param {string} thingName The name of the thing
     * @return {Thing|undefined} The thing
     */
    getThing(thingName) {
        if (Number.isInteger(parseFloat(thingName))) {
            return this.contents.filter(
                thing => thing.isListed
            )[thingName - 1];
        }
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
        if (Number.isInteger(parseFloat(thingName))) {
            this.contents.splice(this.contents.filter(
                thing => thing.isListed
            )[thingName - 1], 1);
        }
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
            if (game.seed.quick() < maxChance) {
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
                rpc.updateAttack(monster.name.toLowerCase());
                GameLog.addMessage(`You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, taking its HP down to ${monster.hp}.`, logTypes.COMBAT);
                return true;
            } else {
                this.removeThing(thing);
                rpc.updateKilled(monster.name.toLowerCase());
                GameLog.addMessage(`You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, killing it.`, logTypes.SUCCESS);
                game.score++;
                return true;
            }
        } else if (monster) {
            GameLog.addMessage('You can\'t attack that.', logTypes.ALERT);
            return false;
        }
        GameLog.addMessage('That doesn\'t exist here.', logTypes.ALERT);
        return false;
    }

    /**
     * Calculates the effects of a player taking thing.
     * @param {Player} player The player
     * @param {string} thing The thing being taken
     * @return {boolean} Whether the thing was taken
     */
    takeThing(player, thing) {
        const thingObject = this.getThing(thing);
        if (thingObject instanceof Food) {
            player.hp += thingObject.healing;
            rpc.updateTake(thingObject.name);
            this.removeThing(thing);
            GameLog.addMessage(`You take and eat the ${thingObject.name.toLowerCase()}, increasing your health to ${player.hp} HP.`, logTypes.SUCCESS);
            return true;
        } else if (thingObject instanceof Weapon) {
            player.strength += thingObject.strengthBoost;
            rpc.updateTake(thingObject.name);
            this.removeThing(thing);
            GameLog.addMessage(`You take the ${thingObject.name.toLowerCase()}, increasing your strength to ${player.strength}.`, logTypes.SUCCESS);
            return true;
        } else if (thingObject) {
            GameLog.addMessage('You can\'t take that.', logTypes.ALERT);
            return false;
        }
        GameLog.addMessage('That doesn\'t exist here.', logTypes.ALERT);
        return false;
    }
}