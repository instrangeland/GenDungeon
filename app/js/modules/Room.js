// ProceduralTA is licensed under GNU General Public License v3.0.

import {getRandomElement, getRandInt} from "../ProceduralTA.js";
import {Monster, monsterTypes, monsterStates} from "./Monster.js";

function equalsCI(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}

export default class Room {
    constructor(x, y) {
        this.description = this.generateTitle();
        this.distance = Math.sqrt(x ** 2 + y ** 2);
        this.contents = [];
        this.generateMonsters();
    }

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

    generateMonsters() {
        this.addMonsterChance(monsterTypes.ZOMBIE, 1, 0.8);
        this.addMonsterChance(monsterTypes.SKELETON, 2, 0.75);
        this.addMonsterChance(monsterTypes.GOBLIN, 2, 0.65);
        this.addMonsterChance(monsterTypes.SPIDER, 3, 0.75);
        this.addMonsterChance(monsterTypes.VAMPIRE, 5, 0.7);
        this.addMonsterChance(monsterTypes.GHOST, 8, 0.5);
    }

    getRoomInfo() {
        return `* ${this.description} *
        
        ${this.listObjects()}`;
    }

    listObjects() {
        return this.contents.map(
            (thing, index) => `${(index + 1)}) ${thing.getShortDescription()}`
        ).join('\n');
    }

    getThing(thingName) {
        return this.contents.find(
            thing => equalsCI(thing.name, thingName)
        );
    }

    getThingInfo(thingName) {
        if (this.getThing(thingName)) {
            return this.getThing(thingName).getDescription();
        }
        return 'That doesn\'t exist here.';
    }

    addMonster(monster) {
        this.contents.push(new Monster(monster));
    }

    removeMonster(monsterName) {
        this.contents.splice(this.contents.findIndex(monster => equalsCI(monster.name, monsterName)), 1);
        return this;
    }

    addMonsterChance(monster, minDistance, maxChance) {
        if (getRandInt(0, this.distance) > minDistance - 1) {
            if (Math.random() < maxChance) {
                this.addMonster(monster);
            }
        }
    }

    attackMonster(player, monsterName) {
        const monster = this.getThing(monsterName);
        if (monster instanceof Monster) {
            monster.state = monsterStates.ATTACKING;
            const damage = player.strength;
            monster.hp -= damage;
            if (monster.hp > 0) {
                return `You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, taking its HP down to ${monster.hp}.`;
            } else {
                this.removeMonster(monsterName);
                return `You attack the ${monster.name.toLowerCase()} for ${player.strength} damage, killing it.`;
            }
        }
        return 'That doesn\'t exist here.';
    }
}