/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import Food from './things/Food.js';
import game, {getRandInt, getRandomElement} from '../game.js';
import {GameLog, logTypes} from './GameLog.js';
import Monster, {monsterStates, monsterTypes} from './things/Monster.js';
import DiscordRP from './DiscordRP.js';
import Thing from './things/Thing.js';
import Weapon from './things/Weapon.js';
import Armor from './things/Armor.js';
import Gold from './things/Gold.js';
import Curiosity from './things/Curiosity.js';
import {
    FOOD_CHANCE,
    GHOST_CHANCE,
    GOLD_CHANCE,
    GOBLIN_CHANCE,
    SKELETON_CHANCE,
    SPIDER_CHANCE,
    VAMPIRE_CHANCE,
    WEAPON_CHANCE, ZOMBIE_CHANCE, CURIOSITY_CHANCE
} from './Values.js';

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
            this.isActive = noise.simplex2(y / 2 + 471 * game.seed.quick(), x / 2 + 471 * game.seed.quick()) > -0.15;
        }
        this.contents = [];
        this.description = this.generateDescription();
        this.distance = Math.sqrt(x ** 2 + y ** 2);
        if (game.seed.quick() > CURIOSITY_CHANCE) {
            var curiosity = this.makeRoomCuriosity();
            this.contents.push(curiosity);
            this.description += ` with a ${curiosity.name}`;
        }


        this.generateMonsters();

        if (game.seed.quick() > FOOD_CHANCE) {
            this.contents.push(new Food());
        }
        if (game.seed.quick() > WEAPON_CHANCE) {
            this.contents.push(new Weapon());
        }
        if (game.seed.quick() > GOLD_CHANCE) {
            this.contents.push(new Gold());
        }

        this.contents.push(new Thing('wall'));
        this.contents.push(new Thing('floor'));
        this.contents.push(new Thing('ceiling'));
        this.contents.push(new Thing('door'));
        this.contents.push(new Thing('path'));
        this.contents.push(new Thing('pathway'));
        this.contents.push(new Thing('monster'));
    }
    makeRoomCuriosity() {
        const coolThingName = [
            'puddle',
            'pit',
            'engraving',
            'mural',
            'mist',
            'column',
            'skulls',
            'gravestone'
        ]
        const coolRoomThing = [
            'small puddle',
            'pit',
            'carved engraving',
            'painted mural',
            'mist of darkness',
            'rock column',
            'pile of skulls',
            'large gravestone'
        ];
        const coolRoomThingDescriptions = {
            'puddle': "A small puddle, barely enough to wet your feet.",
            'pit': "You can't see more tha few feet down this massive pit.",
            'engraving': "The wall appears to have had a engraving carved into it. Unfortunately, water appears to have washed" +
                "away most of the detail...",
            'mural': "Somehow, a painted mural has survived all this time. It looks like some sort of" +
                "primitive cave art.",
            'mist': "You cstill see, but a faint mist obscures fine details.",
            'column': "A massive column of rock supports the ceiling, best to not touch it.",
            'skulls': "... ewww",
            'gravestone': 'The gravestone is made of old and worn grey stone. The inscription has faded away.'
        };
        var name = getRandomElement(coolThingName);

        return new Curiosity(name, coolRoomThingDescriptions[name], coolRoomThing[name]);

    }
    /**
     * Generates a random room description.
     * @return {string} The description
     */
    generateDescription() {
        const adjectives = [
            'unlit',
            'dark',
            'dimly lit',
            'bright',
            'mysterious',
            'eerie',
            'unnerving',
            'pristine',
            'dirty',
            'slanted',
            'round',
            'curved',
            'square',
            'rectangular',
            'semicircular',
            'strange',
            'weird',
            'symmetrical',
            'tall',
            'well lit'
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
        this.addMonsterChance(monsterTypes.ZOMBIE, 1, ZOMBIE_CHANCE);
        this.addMonsterChance(monsterTypes.SKELETON, 2, SKELETON_CHANCE);
        this.addMonsterChance(monsterTypes.GOBLIN, 2, GOBLIN_CHANCE);
        this.addMonsterChance(monsterTypes.SPIDER, 3, SPIDER_CHANCE);
        this.addMonsterChance(monsterTypes.VAMPIRE, 5, VAMPIRE_CHANCE);
        this.addMonsterChance(monsterTypes.GHOST, 8, GHOST_CHANCE);
    }

    /**
     * Gets a formatted description of the room and its contents.
     * @return {string} The description
     */
    function

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
        
            This room contains:
            ${this.listThings()}`;
        }
        return `* ${this.description} *
        ${pathsDescription}
        
        (This room is empty)`;
    }

    /**
     * Gets a formatted list of all things in the room.
     * @return {string}
     */
    listThings() {
        return this.contents.filter(
            thing => thing.isVisible
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
                thing => thing.isVisible
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
        this.contents.push(new Monster(monster, this.distance));
    }

    /**
     * Removes a thing from the room.
     * @param {string} thingName The name of the thing
     */
    removeThing(thingName) {
        if (Number.isInteger(parseFloat(thingName))) {
            let thing = this.contents.filter(
                thing => thing.isVisible
            )[thingName - 1];
            if (thing) {
                thingName = thing.name
            }
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
            game.score["attack"] += monster.strength * monster.attackAccuracy * Math.max(0, Math.min(damage, monster.hp));
            monster.hp -= damage;
            if (monster.hp > 0) {
                DiscordRP.updateAttack(monster.name.toLowerCase());
                GameLog.addMessage(`You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, taking its HP down to ${monster.hp}.`, logTypes.COMBAT);
            } else {
                this.removeThing(thing);
                DiscordRP.updateKilled(monster.name.toLowerCase());
                GameLog.addMessage(`You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, killing it.`, logTypes.SUCCESS);

            }
            return true;
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
            DiscordRP.updateTake(thingObject.name);
            game.score["eat"] += thingObject.healing;
            this.removeThing(thing);
            GameLog.addMessage(`You take and eat the ${thingObject.name.toLowerCase()}, increasing your health to ${player.hp} HP.`, logTypes.SUCCESS);
            return true;
        } else if (thingObject instanceof Weapon) {
            player.strength += thingObject.strengthBoost;
            DiscordRP.updateTake(thingObject.name);
            game.score["weapons"] += thingObject.strengthBoost;
            this.removeThing(thing);
            GameLog.addMessage(`You take the ${thingObject.name.toLowerCase()}, increasing your strength to ${player.strength}.`, logTypes.SUCCESS);
            return true;
        } else if (thingObject instanceof Armor) {
            if (player.playerHasArmorType[thingObject.name]) {
                GameLog.addMessage(`You've already got ${indefiniteArticle(thingObject.name)} ${thingObject.name.toLowerCase()}.`, logTypes.ALERT);
                return false;
            }

            game.score["armor"] += Armor.getDefenseByName(thingObject.name);
            player.playerHasArmorType[thingObject.name] = true;
            DiscordRP.updateTake(thingObject.name);
            this.removeThing(thing);
            GameLog.addMessage(`You take the ${thingObject.name.toLowerCase()}, increasing your defense by ${Armor.getDefenseByName(thingObject.name)}.`, logTypes.SUCCESS);
            return true;
        } else if (thingObject instanceof Gold) {
            game.score["gold"] += thingObject.amount;
            player.amountGold += thingObject.amount;
            this.removeThing(thing);
            GameLog.addMessage(`You take ${thingObject.amount} gold, you now have ${player.amountGold} gold.`, logTypes.SUCCESS);
            return true;
        } else if (thingObject) {
            GameLog.addMessage('You can\'t take that.', logTypes.ALERT);
            return false;
        }
        GameLog.addMessage('That doesn\'t exist here.', logTypes.ALERT);
        return false;
    }

    eatThing(player, thing) {
        const food = this.getThing(thing);
        if (food) {
            if (food instanceof Food) {
                this.takeThing(player, thing);
            } else {
                GameLog.addMessage('You can\'t eat that.', logTypes.ALERT);
                return false;
            }
        } else {
            GameLog.addMessage('That doesn\'t exist here.', logTypes.ALERT);
            return false;
        }
    }

    equipThing(player, thing) {
        const equippable = this.getThing(thing);
        if (equippable) {
            if (equippable instanceof Weapon || equippable instanceof Armor) {
                return this.takeThing(player, thing);
            } else {
                GameLog.addMessage('You can\'t equip that.', logTypes.ALERT);
                return false;
            }
        } else {
            return false;
        }
    }
}