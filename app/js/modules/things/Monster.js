/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game, {getRandInt} from '../../game.js';
import {GameLog, logTypes} from '../GameLog.js';
import Thing from './Thing.js';
import Armor from "./Armor.js";

export const monsterStates = {
    PASSIVE: 0,
    ATTACKING: 1
};

/**
 * A monster in a room.
 * @param {Object} The monster's stats
 * @param {number} The distance of the containing room
 */
export default class Monster extends Thing {
    constructor(monster, distance) {
        super();
        Object.assign(this, monster);
        this.strength = Math.floor(this.strength * distance * 0.2);
        this.hp = Math.floor(this.hp * distance);
        this.isVisible = true;
        this.state = monsterStates.PASSIVE;
    }

    /**
     * Gets a description of the monster.
     * @return {string} The description
     */
    getDescription() {
        return `${Monster.getArticle(this.name)} ${this.name.toLowerCase()} with ${this.hp} HP. It does an average of ${Math.max(1, this.strength)} damage, and is about ${this.attackAccuracy * 100}% accurate.`;
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
                let damage = Math.max(1, this.strength + getRandInt(-this.strengthVariance, this.strengthVariance));
                let armorInventory = player.playerHasArmorType;
                let absorption = 0;
                for (const armor in armorInventory) {
                    if (!armorInventory.hasOwnProperty(armor)) continue;
                    if (armorInventory[armor]) { // Player has this armor type
                        let absorb = getRandInt(0, Armor.getDefenseByName(armor));
                        damage -= absorb;
                        absorption += absorb;
                    }
                }
                if (damage < 0) damage = 0;
                player.hp -= damage;
                if (player.hp > 0) {
                    if (damage > 0) {
                        if (player.hasArmor()) {
                            GameLog.addMessage(`- The ${this.name} attacks you for ${damage} damage, but your armor absorbed ${absorption} damage.`, logTypes.ALERT);
                        } else {
                            GameLog.addMessage(`- The ${this.name} attacks you for ${damage} damage.`, logTypes.ALERT);
                        }
                        GameLog.addMessage(`Your HP is now: ${player.hp}`, logTypes.GAME);
                    } else { // Armor shielded all attack
                        GameLog.addMessage(`- The ${this.name} attacked you, but your armor absorbed all damage.`, logTypes.COMBAT);
                    }
                } else {
                    GameLog.addMessage(`- The ${this.name} attacks you for ${damage} damage, killing you.`, logTypes.ALERT);
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