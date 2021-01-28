/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game, {getRandInt} from '../../game.js';
import {GameLog, logTypes} from '../GameLog.js';
import Thing from './Thing.js';

export const monsterStates = {
    PASSIVE: 0,
    ATTACKING: 1
};

/**
 * A monster in a room.
 * @param {Object} The monster's stats
 */
export default class Monster extends Thing {
    constructor(monster) {
        super();
        Object.assign(this, monster);
        this.isVisible = true;
        this.state = monsterStates.PASSIVE;
    }

    /**
     * Gets a description of the monster.
     * @return {string} The description
     */
    getDescription() {
        return `A ${this.name.toLowerCase()} with ${this.hp} HP. It does an average of ${this.strength} damage, and is about ${this.attackAccuracy * 100}% accurate.`;
    }

    /**
     * Gets a short formatted description of the monster for use in "look".
     * @return {string} The short description
     */
    getShortDescription() {
        return `${this.name} - ${this.hp} HP`;
    }

    /**
     * Calculates the effects of the monster interacting with a player.
     * @param {Player} player The player
     * @return {boolean} Whether the outcome resulted in player death
     */
    playerInteraction(player) {
        if (this.state === monsterStates.PASSIVE) {
            if (game.seed.quick() < this.aggression) {
                this.state = monsterStates.ATTACKING;
                GameLog.addMessage(`- The ${this.name} sees you.`, logTypes.COMBAT);
            }
        } else {
            if (game.seed.quick() < this.attackAccuracy) {
                const damage = this.strength + getRandInt(-this.strengthVariance, this.strengthVariance);
                player.hp -= damage;
                if (player.hp > 0) {
                    GameLog.addMessage(`- The ${this.name} attacks you for ${damage} damage.`, logTypes.COMBAT);
                    GameLog.addMessage(`Your HP is now: ${player.hp}`, logTypes.GAME);
                } else {
                    if (!player.dead) {
                        GameLog.addMessage(`- The ${this.name} attacks you for ${damage} damage, killing you.`, logTypes.ALERT);
                    }
                    return true;
                }
            }
        }
        return false;
    }
}

export const monsterTypes = {
    ZOMBIE: {
        name: 'Zombie',
        hp: 2,
        strength: 2,
        strengthVariance: 0,
        attackAccuracy: 0.5,
        aggression: 0.75
    },
    SKELETON: {
        name: 'Skeleton',
        hp: 4,
        strength: 3,
        strengthVariance: 1,
        attackAccuracy: 0.75,
        aggression: 0.65
    },
    SPIDER: {
        name: 'Spider',
        hp: 3,
        strength: 2,
        strengthVariance: 0,
        attackAccuracy: 0.95,
        aggression: 0.85
    },
    VAMPIRE: {
        name: 'Vampire',
        hp: 5,
        strength: 3,
        strengthVariance: 2,
        attackAccuracy: 1,
        aggression: 0.4
    },
    GOBLIN: {
        name: 'Goblin',
        hp: 2,
        strength: 2,
        strengthVariance: 1,
        attackAccuracy: 0.65,
        aggression: 0.7
    },
    GHOST: {
        name: 'Ghost',
        hp: 8,
        strength: 3,
        strengthVariance: 1,
        attackAccuracy: 1,
        aggression: 0.3
    }
};